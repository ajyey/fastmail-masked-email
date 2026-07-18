import type { MaskedEmail } from '../types/maskedEmail.js';

export const maskedEmailFixture = {
  id: 'masked-email-1',
  email: 'test@masked.example',
  state: 'enabled',
  description: 'Test account',
  forDomain: 'https://example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'fastmail-masked-email',
  url: 'https://example.com/credentials/1',
  lastMessageAt: null
} satisfies MaskedEmail;
