import { randomUUID } from 'node:crypto';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  MaskedEmailNotFoundError,
  MaskedEmailService,
  type ReadonlySession
} from '../src/index.js';

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
const origin = 'https://example.com';
const initialDescription = `Integration test ${suffix}`;
const updatedDescription = `Updated integration test ${suffix}`;
const updatedUrl = `https://example.com/credentials/${suffix}`;
let createdId: string | undefined;
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
      const cleanupIds = createdId
        ? [createdId]
        : initialized
          ? (await service.getAllEmails())
              .filter((email) =>
                [initialDescription, updatedDescription].includes(
                  email.description
                )
              )
              .map((email) => email.id)
          : [];
      await Promise.all(
        cleanupIds.map((id) => service.permanentlyDeleteEmail(id))
      );
    } catch (error) {
      console.error(`Failed to clean up integration masked email ${suffix}.`);
      throw error;
    }
  });

  it('discovers a usable JMAP session', () => {
    expect(session.apiUrl).toMatch(/^https:\/\//);
    expect(Object.keys(session.accounts).length).toBeGreaterThan(0);
  });

  it('creates a pending masked email', async () => {
    const created = await service.createEmail({
      description: initialDescription,
      emailPrefix,
      forDomain: origin,
      state: 'pending',
      url: updatedUrl
    });
    createdId = created.id;

    expect(created.email.split('@')[0]).toMatch(new RegExp(`^${emailPrefix}`));
    expect(created.description).toBe(initialDescription);
    expect(created.forDomain).toBe(origin);
    expect(created.state).toBe('pending');
    expect(created.url).toBe(updatedUrl);
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
    await expect(service.filterByDomain(origin, all)).resolves.toContainEqual(
      byId
    );
  });

  it('updates mutable metadata', async () => {
    const id = expectCreatedId();
    await service.updateEmail(id, {
      description: updatedDescription,
      state: 'enabled',
      url: null
    });

    await expect(service.getEmailById(id)).resolves.toMatchObject({
      description: updatedDescription,
      id,
      state: 'enabled',
      url: null
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
    await service.permanentlyDeleteEmail(id);
    createdId = undefined;

    await expect(service.getEmailById(id)).rejects.toBeInstanceOf(
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
