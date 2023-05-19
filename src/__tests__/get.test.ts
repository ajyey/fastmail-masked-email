import axios from 'axios';

import { maskedEmailFixture } from '../__fixtures__/maskedEmail.fixture';
import { JMAP, MASKED_EMAIL_CALLS } from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import * as get from '../lib/get';
import { getByAddress, getById, list } from '../lib/get';
import { MaskedEmail } from '../types/maskedEmail';

jest.mock('axios');

describe('get', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const listSpy = jest.spyOn(get, 'list');

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const session = {
    primaryAccounts: {
      [JMAP.CORE]: 'account1'
    },
    apiUrl: 'https://api.example.com',
    fmAuthToken: 'auth-token-123'
  };

  const maskedEmails: MaskedEmail[] = [
    {
      ...maskedEmailFixture
    },
    {
      ...maskedEmailFixture,
      id: '2',
      email: 'test2@google.com'
    }
  ];

  describe('list', () => {
    it('should reject with InvalidArgumentError if no session is provided', async () => {
      await expect(list(undefined)).rejects.toThrow(InvalidArgumentError);
    });

    it('should list all masked emails', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          methodResponses: [[MASKED_EMAIL_CALLS.get, { list: maskedEmails }]]
        }
      });

      const result = await list(session);

      expect(result).toEqual(maskedEmails);
    });
  });

  describe('getById', () => {
    it('should reject with InvalidArgumentError if no session is provided', async () => {
      await expect(getById('1', undefined)).rejects.toThrow(
        InvalidArgumentError
      );
    });

    it('should reject with InvalidArgumentError if no id is provided', async () => {
      await expect(getById(undefined, session)).rejects.toThrow(
        InvalidArgumentError
      );
    });

    it('should get a masked email by id', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          methodResponses: [
            [MASKED_EMAIL_CALLS.get, { list: [maskedEmails[0]] }]
          ]
        }
      });

      const result = await getById('1', session);

      expect(result).toEqual(maskedEmails[0]);
    });

    it('should reject with an error if masked email not found', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          methodResponses: [
            [MASKED_EMAIL_CALLS.get, { notFound: ['masked-email-3'], list: [] }]
          ]
        }
      });

      await expect(getById('masked-email-3', session)).rejects.toThrow(
        'No masked email found with id masked-email-3'
      );
    });
  });

  describe('getByAddress', () => {
    it('should get a masked email by address', async () => {
      listSpy.mockResolvedValue(maskedEmails);
      const result = await getByAddress('testEmail@test.com', session);

      expect(result).toEqual([maskedEmails[0]]);
    });
  });
});
