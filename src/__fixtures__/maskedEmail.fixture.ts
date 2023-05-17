import { MaskedEmailState } from '../types/maskedEmail';

export const maskedEmailFixture = {
  id: '1',
  email: 'testEmail@test.com',
  state: 'enabled' as MaskedEmailState,
  description: 'A very helpful description',
  forDomain: 'test.com',
  createdAt: '2020-01-01T00:00:00.000Z',
  createdBy: '1Password',
  url: 'gmail.com',
  lastMessageAt: '2020-01-01T00:00:00.000Z'
};
