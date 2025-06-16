import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { maskedEmailFixture } from '../__fixtures__/maskedEmail.fixture';
import { JMAP, MASKED_EMAIL_CALLS } from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { getAllEmails, getEmailByAddress, getEmailById } from '../lib/get';
import { MaskedEmail } from '../types/maskedEmail';

vi.mock('axios');
describe('get', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  })

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
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [[MASKED_EMAIL_CALLS.get, { list: maskedEmails }]]
        }
      });

      const result = await getAllEmails(session);

      expect(result).toEqual(maskedEmails);
    });

    it('should reject with an error if the request received an error response', async () => {
      const mockErrorResponse = {
        status: 401,
        statusText: 'Unauthorized',
        data: 'Invalid token'
      };

      vi.mocked(axios.post).mockRejectedValue({
        response: mockErrorResponse
      });

      await expect(getAllEmails(session)).rejects.toThrow(
        `listing masked emails failed with status code ${mockErrorResponse.status}: ${mockErrorResponse.statusText}. ${mockErrorResponse.data}`
      );
    });

    it('should reject with an error if the request was made but no response was received', async () => {
      const mockErrorRequest = {
        url: session.apiUrl,
        method: 'POST'
      };

      vi.mocked(axios.post).mockRejectedValue({
        request: mockErrorRequest,
        message: 'Network timeout'
      });

      await expect(getAllEmails(session)).rejects.toThrow(
        'listing masked emails request was made, but no response was received. Error message: Network timeout'
      );
    });

    it('should reject with an error if an unexpected error occurred', async () => {
      vi.mocked(axios.post).mockRejectedValue({
        message: 'Unexpected error'
      });

      await expect(getAllEmails(session)).rejects.toThrow(
        'An error occurred while listing masked emails. Error message: Unexpected error'
      );
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
      vi.mocked(axios.post).mockResolvedValue({
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
      vi.mocked(axios.post).mockResolvedValue({
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

    it('should reject with an error if the request received an error response', async () => {
      const mockErrorResponse = {
        status: 403,
        statusText: 'Forbidden',
        data: 'Access denied'
      };

      vi.mocked(axios.post).mockRejectedValue({
        response: mockErrorResponse
      });

      await expect(getEmailById('1', session)).rejects.toThrow(
        `getting a masked email by id failed with status code ${mockErrorResponse.status}: ${mockErrorResponse.statusText}. ${mockErrorResponse.data}`
      );
    });

    it('should reject with an error if the request was made but no response was received', async () => {
      const mockErrorRequest = {
        url: session.apiUrl,
        method: 'POST'
      };

      vi.mocked(axios.post).mockRejectedValue({
        request: mockErrorRequest,
        message: 'Connection timeout'
      });

      await expect(getEmailById('1', session)).rejects.toThrow(
        'getting a masked email by id request was made, but no response was received. Error message: Connection timeout'
      );
    });

    it('should reject with an error if an unexpected error occurred', async () => {
      vi.mocked(axios.post).mockRejectedValue({
        message: 'Database connection error'
      });

      await expect(getEmailById('1', session)).rejects.toThrow(
        'An error occurred while getting a masked email by id. Error message: Database connection error'
      );
    });

  });

  describe('getByAddress', () => {
    it('should get a masked email by address', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [[MASKED_EMAIL_CALLS.get, { list: maskedEmails }]]
        }
      });
      const result = await getEmailByAddress('testEmail@test.com', session);
      expect(axios.post).toHaveBeenCalledWith(
        session.apiUrl,
        expect.objectContaining({
          using: [JMAP.CORE, expect.any(String)],
          methodCalls: expect.arrayContaining([
            expect.arrayContaining([MASKED_EMAIL_CALLS.get, expect.any(Object), expect.any(String)])
          ])
        }),
        expect.objectContaining({
          headers: expect.any(Object)
        })
      );

      expect(result).toEqual([maskedEmails[0]]);


    });

    it('should reject with an error if getAllEmails throws an error', async () => {
      const mockErrorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: 'Server error'
      };

      vi.mocked(axios.post).mockRejectedValue({
        response: mockErrorResponse
      });

      await expect(getEmailByAddress('testEmail@test.com', session)).rejects.toThrow(
        `listing masked emails failed with status code ${mockErrorResponse.status}: ${mockErrorResponse.statusText}. ${mockErrorResponse.data}`
      );
    });

  });
});
