import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

import { MaskedEmailService } from 'fastmail-masked-email';

const token = process.env.JMAP_TOKEN?.trim();
if (!token) {
  throw new Error('Fastmail contract test requires JMAP_TOKEN.');
}

const hostname = process.env.JMAP_HOSTNAME?.trim();
const service = new MaskedEmailService({
  token,
  timeout: 30_000,
  ...(hostname ? { hostname } : {})
});
const suffix = `${Date.now().toString(36)}_${randomUUID()
  .replaceAll('-', '')
  .slice(0, 12)}`;
const emailPrefix = `contract_${suffix}`;
const updatedDescription = `Fastmail contract test ${suffix}`;
const updatedUrl = `https://example.com/contracts/${suffix}`;
let createdId;

try {
  await service.initialize();
  const created = await service.createEmail({
    description: 'Fastmail contract test pending address',
    emailPrefix,
    state: 'pending'
  });
  createdId = created.id;

  const pending = await service.getEmailById(createdId);
  assert.equal(pending.id, createdId);
  assert.ok(pending.email.split('@')[0].startsWith(emailPrefix));
  assert.equal(pending.state, 'pending');

  await service.updateEmail(createdId, {
    description: updatedDescription,
    forDomain: 'https://example.com',
    state: 'enabled',
    url: updatedUrl
  });

  const updated = await service.getEmailById(createdId);
  assert.equal(updated.description, updatedDescription);
  assert.equal(updated.forDomain, 'https://example.com');
  assert.equal(updated.state, 'enabled');
  assert.equal(updated.url, updatedUrl);

  console.log('Fastmail contract test passed.');
} finally {
  if (createdId) {
    await service.permanentlyDeleteEmail(createdId);
  }
}
