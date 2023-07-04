import { maskedEmailFixture } from '../__fixtures__/maskedEmail.fixture';
import axios from '../__mocks__/axios';
import { JMAP, MASKED_EMAIL_CALLS } from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import * as get from '../lib/get';
import { getAllEmails, getEmailByAddress, getEmailById } from '../lib/get';
import { MaskedEmail } from '../types/maskedEmail';

describe('get', () => {
  const listSpy = jest.spyOn(get, 'getAllEmails');

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
      await expect(getAllEmails(undefined)).rejects.toThrow(
        InvalidArgumentError
      );
    });

    it('should get all masked emails', async () => {
      axios.post.mockResolvedValue({
        data: {
          methodResponses: [[MASKED_EMAIL_CALLS.get, { list: maskedEmails }]]
        }
      });

      const result = await getAllEmails(session);

      expect(result).toEqual(maskedEmails);
    });
  });

  describe('getById', () => {
    it('should reject with InvalidArgumentError if no session is provided', async () => {
      await expect(getEmailById('1', undefined)).rejects.toThrow(
        InvalidArgumentError
      );
    });

    it('should reject with InvalidArgumentError if no id is provided', async () => {
      await expect(getEmailById(undefined, session)).rejects.toThrow(
        InvalidArgumentError
      );
    });

    it('should get a masked email by id', async () => {
      axios.post.mockResolvedValue({
        data: {
          methodResponses: [
            [MASKED_EMAIL_CALLS.get, { list: [maskedEmails[0]] }]
          ]
        }
      });

      const result = await getEmailById('1', session);

      expect(result).toEqual(maskedEmails[0]);
    });

    it('should reject with an error if masked email not found', async () => {
      axios.post.mockResolvedValue({
        data: {
          methodResponses: [
            [MASKED_EMAIL_CALLS.get, { notFound: ['masked-email-3'], list: [] }]
          ]
        }
      });

      await expect(getEmailById('masked-email-3', session)).rejects.toThrow(
        'No masked email found with id masked-email-3'
      );
    });
  });

  describe('getByAddress', () => {
    it('should get a masked email by address', async () => {
      listSpy.mockResolvedValue(maskedEmails);
      const result = await getEmailByAddress('testEmail@test.com', session);

      expect(result).toEqual([maskedEmails[0]]);
    });
  });
});
