import { JMAP, MASKED_EMAIL_CAPABILITY } from '../constants.js';
import type { Session } from '../types/session.js';

export const sessionFixture = {
  capabilities: {
    [JMAP.CORE]: {},
    [MASKED_EMAIL_CAPABILITY]: {}
  },
  state: 'session-state-1',
  apiUrl: 'https://api.example.com/jmap/api/',
  accounts: {
    'masked-account': {
      name: 'test@example.com',
      isPersonal: true,
      isReadOnly: false,
      userId: 'user-1',
      accountCapabilities: {
        [JMAP.CORE]: {},
        [MASKED_EMAIL_CAPABILITY]: {}
      }
    }
  },
  username: 'test@example.com',
  primaryAccounts: {
    [MASKED_EMAIL_CAPABILITY]: 'masked-account'
  }
} satisfies Session;
