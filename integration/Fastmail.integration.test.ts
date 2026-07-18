import { randomUUID } from 'node:crypto';

import {
  InvalidCredentialsError,
  MaskedEmailNotFoundError,
  MaskedEmailService,
  type ReadonlySession
} from 'fastmail-masked-email';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const token = process.env.JMAP_TOKEN?.trim();
if (!token) {
  throw new Error(
    'Fastmail integration tests require JMAP_TOKEN with the Masked Email scope.'
  );
}

const hostname = process.env.JMAP_HOSTNAME?.trim();
const service = new MaskedEmailService({
  token,
  timeout: 30_000,
  ...(hostname ? { hostname } : {})
});
const suffix = `${Date.now().toString(36)}_${randomUUID()
  .replaceAll('-', '')
  .slice(0, 10)}`;
const emailPrefix = `integration_${suffix}`;
const defaultEmailPrefix = `default_${suffix}`;
const initialOrigin = 'https://example.com';
const updatedOrigin = 'https://accounts.example.com';
const initialDescription = `Integration test ${suffix}`;
const defaultDescription = `Default integration test ${suffix}`;
const updatedDescription = `Updated integration test ${suffix}`;
const initialUrl = `https://example.com/credentials/${suffix}`;
const updatedUrl = `https://accounts.example.com/credentials/${suffix}`;
let createdId: string | undefined;
let defaultCreatedId: string | undefined;
let initialized = false;
let session: ReadonlySession;

describe.sequential('Fastmail live integration', () => {
  beforeAll(async () => {
    await service.initialize();
    initialized = true;
    session = service.getSession();
  });

  afterAll(async () => {
    try {
      const cleanupIds = new Set(
        [createdId, defaultCreatedId].filter(
          (id): id is string => id !== undefined
        )
      );
      if (initialized) {
        const descriptions = [
          initialDescription,
          defaultDescription,
          updatedDescription
        ];
        for (const email of await service.getAllEmails()) {
          if (descriptions.includes(email.description)) {
            cleanupIds.add(email.id);
          }
        }
      }
      for (const id of cleanupIds) {
        await service.permanentlyDeleteEmail(id);
      }
    } catch (error) {
      console.error(`Failed to clean up integration masked email ${suffix}.`);
      throw error;
    }
  });

  it('discovers a usable JMAP session', () => {
    expect(session.apiUrl).toMatch(/^https:\/\//);
    expect(Object.keys(session.accounts).length).toBeGreaterThan(0);
  });

  it('constructs from environment variables', async () => {
    const environmentService = new MaskedEmailService({ timeout: 30_000 });
    await environmentService.initialize();
    expect(environmentService.getSession().apiUrl).toBe(session.apiUrl);
  });

  it('maps invalid credentials to InvalidCredentialsError', async () => {
    const invalidService = new MaskedEmailService({
      token: `${token}_invalid`,
      timeout: 30_000,
      ...(hostname ? { hostname } : {})
    });
    await expect(invalidService.initialize()).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
  });

  it('creates a pending masked email', async () => {
    const created = await service.createEmail({
      description: initialDescription,
      emailPrefix,
      forDomain: initialOrigin,
      state: 'pending',
      url: initialUrl
    });
    createdId = created.id;

    expect(created.email.split('@')[0]).toMatch(new RegExp(`^${emailPrefix}`));
    expect(created.description).toBe(initialDescription);
    expect(created.forDomain).toBe(initialOrigin);
    expect(created.state).toBe('pending');
    expect(created.url).toBe(initialUrl);
  });

  it('uses the library default enabled state', async () => {
    const created = await service.createEmail({
      description: defaultDescription,
      emailPrefix: defaultEmailPrefix
    });
    defaultCreatedId = created.id;

    expect(created.state).toBe('enabled');
  });

  it('retrieves and filters the created masked email', async () => {
    const id = expectCreatedId();
    const byId = await service.getEmailById(id);
    const all = await service.getAllEmails();

    expect(byId.id).toBe(id);
    expect(all.some((email) => email.id === id)).toBe(true);
    await expect(service.getEmailsByAddress(byId.email, all)).resolves.toEqual([
      byId
    ]);
    await expect(service.filterByState('pending', all)).resolves.toContainEqual(
      byId
    );
    await expect(
      service.filterByDomain(initialOrigin, all)
    ).resolves.toContainEqual(byId);

    await expect(service.getEmailsByAddress(byId.email)).resolves.toEqual([
      byId
    ]);
    await expect(service.filterByState('pending')).resolves.toContainEqual(
      byId
    );
    await expect(service.filterByDomain(initialOrigin)).resolves.toContainEqual(
      byId
    );
  });

  it('updates mutable metadata', async () => {
    const id = expectCreatedId();
    await service.updateEmail(id, {
      description: updatedDescription,
      forDomain: updatedOrigin,
      state: 'enabled',
      url: updatedUrl
    });

    await expect(service.getEmailById(id)).resolves.toMatchObject({
      description: updatedDescription,
      forDomain: updatedOrigin,
      id,
      state: 'enabled',
      url: updatedUrl
    });
  });

  it('applies every reversible state transition', async () => {
    const id = expectCreatedId();

    await service.disableEmail(id);
    await expect(service.getEmailById(id)).resolves.toMatchObject({
      id,
      state: 'disabled'
    });

    await service.enableEmail(id);
    await expect(service.getEmailById(id)).resolves.toMatchObject({
      id,
      state: 'enabled'
    });

    await service.deleteEmail(id);
    await expect(service.getEmailById(id)).resolves.toMatchObject({
      id,
      state: 'deleted'
    });

    await service.enableEmail(id);
  });

  it('permanently destroys the test masked email', async () => {
    const id = expectCreatedId();
    const defaultId = expectDefaultCreatedId();
    await service.permanentlyDeleteEmail(id);
    createdId = undefined;
    await service.permanentlyDeleteEmail(defaultId);
    defaultCreatedId = undefined;

    await expect(service.getEmailById(id)).rejects.toBeInstanceOf(
      MaskedEmailNotFoundError
    );
    await expect(service.getEmailById(defaultId)).rejects.toBeInstanceOf(
      MaskedEmailNotFoundError
    );
  });
});

function expectCreatedId(): string {
  if (!createdId) {
    throw new Error('The integration masked email was not created.');
  }
  return createdId;
}

function expectDefaultCreatedId(): string {
  if (!defaultCreatedId) {
    throw new Error(
      'The default-state integration masked email was not created.'
    );
  }
  return defaultCreatedId;
}
