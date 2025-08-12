import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { MaskedEmailService } from '../MaskedEmailService';
import { JmapRequest } from '../types/jmap';
import { MaskedEmail } from '../types/maskedEmail';
import { CreateOptions, Options } from '../types/options';

vi.mock('axios');

describe('MaskedEmailService', () => {
  const mockedAxios = vi.mocked(axios);
  let service: MaskedEmailService;
  let mockSession: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MaskedEmailService('test-token', 'api.example.com');
    mockSession = {
      primaryAccounts: {
        [JMAP.CORE]: 'account1'
      },
      apiUrl: 'https://api.example.com',
      fmAuthToken: 'auth-token-123'
    };
  });

  describe('initialization', () => {
    it('should create service with token and hostname', () => {
      const serviceWithParams = new MaskedEmailService('token', 'hostname');
      expect(serviceWithParams).toBeDefined();
    });

    it('should create service with environment variables', () => {
      process.env.JMAP_TOKEN = 'env-token';
      process.env.JMAP_HOSTNAME = 'env-hostname';

      const serviceWithEnv = new MaskedEmailService();
      expect(serviceWithEnv).toBeDefined();

      delete process.env.JMAP_TOKEN;
      delete process.env.JMAP_HOSTNAME;
    });

    it('should initialize session successfully', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          primaryAccounts: { [JMAP.CORE]: 'account1' },
          apiUrl: 'https://api.example.com'
        }
      });

      await service.initialize();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.example.com/jmap/session',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        }
      );
    });

    it('should throw error when no token is provided', async () => {
      const serviceNoToken = new MaskedEmailService();

      await expect(serviceNoToken.initialize()).rejects.toThrow(
        'No auth token provided and JMAP_TOKEN environment variable is not set. Please provide a token.'
      );
    });

    it('should handle axios error during session initialization', async () => {
      vi.mocked(axios.get).mockRejectedValue({
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: 'Invalid credentials'
        }
      });

      await expect(service.initialize()).rejects.toThrow(
        'getting a session failed with status code 401: Unauthorized. Invalid credentials'
      );
    });
  });

  describe('createEmail', () => {
    beforeEach(async () => {
      // Mock successful initialization
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should throw error if service is not initialized', async () => {
      const uninitializedService = new MaskedEmailService('token');

      await expect(uninitializedService.createEmail()).rejects.toThrow(
        'Service not initialized. Call initialize() first.'
      );
    });

    it('should create a new masked email address with default enabled state', async () => {
      const options: CreateOptions = {};

      const expectedRequest: JmapRequest = {
        using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
        methodCalls: [
          [
            MASKED_EMAIL_CALLS.set,
            {
              accountId: 'account1',
              create: {
                ['0']: {
                  state: 'enabled'
                }
              }
            },
            'a'
          ]
        ]
      };

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                created: {
                  '0': {
                    id: 'masked-email-id'
                  }
                }
              }
            ]
          ]
        }
      });

      const result = await service.createEmail(options);

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        'https://api.example.com',
        expectedRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        }
      );

      expect(result).toEqual({
        id: 'masked-email-id',
        state: 'enabled'
      });
    });

    it('should create a masked email with custom options', async () => {
      const options: CreateOptions = {
        state: 'disabled',
        description: 'Test email'
      };

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                created: {
                  '0': {
                    id: 'masked-email-id',
                    description: 'Test email'
                  }
                }
              }
            ]
          ]
        }
      });

      const result = await service.createEmail(options);

      expect(result).toEqual({
        id: 'masked-email-id',
        description: 'Test email',
        state: 'disabled'
      });
    });

    it('should handle axios error during createEmail', async () => {
      vi.mocked(axios.post).mockRejectedValue({
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: 'Server error occurred'
        }
      });

      await expect(service.createEmail({})).rejects.toThrow(
        'creating a masked email failed with status code 500: Internal Server Error. Server error occurred'
      );
    });
  });

  describe('getAllEmails', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should throw error if service is not initialized', async () => {
      const uninitializedService = new MaskedEmailService('token');

      await expect(uninitializedService.getAllEmails()).rejects.toThrow(
        'Service not initialized. Call initialize() first.'
      );
    });

    it('should retrieve all masked emails', async () => {
      const mockEmails = [
        { id: '1', email: 'test1@example.com', state: 'enabled' },
        { id: '2', email: 'test2@example.com', state: 'disabled' }
      ];

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: mockEmails
              }
            ]
          ]
        }
      });

      const result = await service.getAllEmails();

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        'https://api.example.com',
        {
          using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
          methodCalls: [
            [MASKED_EMAIL_CALLS.get, { accountId: 'account1', ids: null }, 'a']
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        }
      );

      expect(result).toEqual(mockEmails);
    });

    it('should handle axios error during getAllEmails', async () => {
      vi.mocked(axios.post).mockRejectedValue({
        request: {},
        message: 'Network Error'
      });

      await expect(service.getAllEmails()).rejects.toThrow(
        'listing masked emails request was made, but no response was received. Error message: Network Error'
      );
    });
  });

  describe('getEmailById', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should throw error if service is not initialized', async () => {
      const uninitializedService = new MaskedEmailService('token');

      await expect(uninitializedService.getEmailById('id')).rejects.toThrow(
        'Service not initialized. Call initialize() first.'
      );
    });

    it('should throw error if no id is provided', async () => {
      await expect(service.getEmailById(undefined)).rejects.toThrow(
        'No id provided'
      );
    });

    it('should retrieve a masked email by id', async () => {
      const mockEmail = {
        id: 'test-id',
        email: 'test@example.com',
        state: 'enabled'
      };

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: [mockEmail],
                notFound: []
              }
            ]
          ]
        }
      });

      const result = await service.getEmailById('test-id');

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        'https://api.example.com',
        {
          using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
          methodCalls: [
            [
              MASKED_EMAIL_CALLS.get,
              { accountId: 'account1', ids: ['test-id'] },
              'a'
            ]
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        }
      );

      expect(result).toEqual(mockEmail);
    });

    it('should throw error when masked email is not found', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: [],
                notFound: ['test-id']
              }
            ]
          ]
        }
      });

      await expect(service.getEmailById('test-id')).rejects.toThrow(
        'No masked email found with id test-id'
      );
    });
  });

  describe('getEmailByAddress', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should retrieve masked emails by address', async () => {
      const mockEmails = [
        { id: '1', email: 'test@example.com', state: 'enabled' },
        { id: '2', email: 'other@example.com', state: 'enabled' },
        { id: '3', email: 'test@example.com', state: 'disabled' }
      ];

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: mockEmails
              }
            ]
          ]
        }
      });

      const result = await service.getEmailByAddress('test@example.com');

      expect(result).toEqual([
        { id: '1', email: 'test@example.com', state: 'enabled' },
        { id: '3', email: 'test@example.com', state: 'disabled' }
      ]);
    });

    it('should return empty array when no emails match address', async () => {
      const mockEmails = [
        { id: '1', email: 'other@example.com', state: 'enabled' }
      ];

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: mockEmails
              }
            ]
          ]
        }
      });

      const result = await service.getEmailByAddress('notfound@example.com');
      expect(result).toEqual([]);
    });
  });

  describe('updateEmail', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should throw error if service is not initialized', async () => {
      const uninitializedService = new MaskedEmailService('token');

      await expect(
        uninitializedService.updateEmail('id', { state: 'disabled' })
      ).rejects.toThrow('Service not initialized. Call initialize() first.');
    });

    it('should throw error if no id is provided', async () => {
      await expect(
        service.updateEmail(undefined, { state: 'disabled' })
      ).rejects.toThrow('No id provided');
    });

    it('should throw error if no options are provided', async () => {
      await expect(service.updateEmail('test-id', {})).rejects.toThrow(
        'No options provided. Please provide at least one option to updateEmail.'
      );
    });

    it('should throw error for invalid options', async () => {
      const invalidOptions = { invalidField: 'value' } as Options;

      await expect(
        service.updateEmail('test-id', invalidOptions)
      ).rejects.toThrow('Invalid options provided: invalidField');
    });

    it('should update a masked email successfully', async () => {
      const options: Options = {
        state: 'disabled',
        description: 'Updated description'
      };

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                updated: { 'test-id': null }
              }
            ]
          ]
        }
      });

      const result = await service.updateEmail('test-id', options);

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        'https://api.example.com',
        {
          using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
          methodCalls: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                accountId: 'account1',
                update: {
                  'test-id': options
                }
              },
              'a'
            ]
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        }
      );

      expect(result).toEqual({ 'test-id': null });
    });

    it('should handle axios error during update', async () => {
      vi.mocked(axios.post).mockRejectedValue({
        message: 'Unexpected Error'
      });

      await expect(
        service.updateEmail('test-id', { state: 'disabled' })
      ).rejects.toThrow(
        'An error occurred while updating a masked email. Error message: Unexpected Error'
      );
    });
  });

  describe('convenience methods', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should delete a masked email', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                updated: { 'test-id': null }
              }
            ]
          ]
        }
      });

      const result = await service.deleteEmail('test-id');
      expect(result).toEqual({ 'test-id': null });

      // Verify it called updateEmail with deleted state
      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        'https://api.example.com',
        expect.objectContaining({
          methodCalls: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                accountId: 'account1',
                update: {
                  'test-id': { state: 'deleted' }
                }
              },
              'a'
            ]
          ]
        }),
        expect.any(Object)
      );
    });

    it('should disable a masked email', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                updated: { 'test-id': null }
              }
            ]
          ]
        }
      });

      const result = await service.disableEmail('test-id');
      expect(result).toEqual({ 'test-id': null });
    });

    it('should enable a masked email', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                updated: { 'test-id': null }
              }
            ]
          ]
        }
      });

      const result = await service.enableEmail('test-id');
      expect(result).toEqual({ 'test-id': null });
    });
  });

  describe('permanentlyDeleteEmail', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should throw error if service is not initialized', async () => {
      const uninitializedService = new MaskedEmailService('token');

      await expect(
        uninitializedService.permanentlyDeleteEmail('id')
      ).rejects.toThrow('Service not initialized. Call initialize() first.');
    });

    it('should throw error if no id is provided', async () => {
      await expect(service.permanentlyDeleteEmail(undefined)).rejects.toThrow(
        'No id provided'
      );
    });

    it('should permanently delete a masked email successfully', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                destroyed: { 'test-id': null }
              }
            ]
          ]
        }
      });

      const result = await service.permanentlyDeleteEmail('test-id');

      expect(vi.mocked(axios.post)).toHaveBeenCalledWith(
        'https://api.example.com',
        {
          using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
          methodCalls: [
            [
              MASKED_EMAIL_CALLS.set,
              { accountId: 'account1', destroy: ['test-id'] },
              'a'
            ]
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        }
      );

      expect(result).toEqual({ 'test-id': null });
    });

    it('should handle case when email cannot be destroyed', async () => {
      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.set,
              {
                notDestroyed: {
                  'test-id': {
                    description: 'Cannot destroy email'
                  }
                }
              }
            ]
          ]
        }
      });

      await expect(service.permanentlyDeleteEmail('test-id')).rejects.toThrow(
        'Cannot destroy email'
      );
    });
  });

  describe('filter methods', () => {
    beforeEach(async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockSession });
      await service.initialize();
    });

    it('should filter emails by state', async () => {
      const mockEmails = [
        { id: '1', email: 'test1@example.com', state: 'enabled' as const },
        { id: '2', email: 'test2@example.com', state: 'disabled' as const },
        { id: '3', email: 'test3@example.com', state: 'enabled' as const }
      ];

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: mockEmails
              }
            ]
          ]
        }
      });

      const result = await service.filterByState('enabled');

      expect(result).toEqual([
        { id: '1', email: 'test1@example.com', state: 'enabled' },
        { id: '3', email: 'test3@example.com', state: 'enabled' }
      ]);
    });

    it('should filter emails by state with provided list', async () => {
      const mockEmails: MaskedEmail[] = [
        { id: '1', email: 'test1@example.com', state: 'enabled' },
        { id: '2', email: 'test2@example.com', state: 'disabled' }
      ] as MaskedEmail[];

      const result = await service.filterByState('disabled', mockEmails);

      expect(result).toEqual([
        { id: '2', email: 'test2@example.com', state: 'disabled' }
      ]);

      // Should not make an API call when list is provided
      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });

    it('should filter emails by forDomain', async () => {
      const mockEmails = [
        {
          id: '1',
          email: 'test1@example.com',
          state: 'enabled' as const,
          forDomain: 'example.com'
        },
        {
          id: '2',
          email: 'test2@example.com',
          state: 'enabled' as const,
          forDomain: 'other.com'
        },
        {
          id: '3',
          email: 'test3@example.com',
          state: 'enabled' as const,
          forDomain: 'example.com'
        }
      ];

      vi.mocked(axios.post).mockResolvedValue({
        data: {
          methodResponses: [
            [
              MASKED_EMAIL_CALLS.get,
              {
                list: mockEmails
              }
            ]
          ]
        }
      });

      const result = await service.filterByForDomain('example.com');

      expect(result).toEqual([
        {
          id: '1',
          email: 'test1@example.com',
          state: 'enabled',
          forDomain: 'example.com'
        },
        {
          id: '3',
          email: 'test3@example.com',
          state: 'enabled',
          forDomain: 'example.com'
        }
      ]);
    });

    it('should filter emails by forDomain with provided list', async () => {
      const mockEmails: MaskedEmail[] = [
        {
          id: '1',
          email: 'test1@example.com',
          state: 'enabled' as const,
          forDomain: 'example.com'
        },
        {
          id: '2',
          email: 'test2@example.com',
          state: 'enabled' as const,
          forDomain: 'other.com'
        }
      ] as MaskedEmail[];

      const result = await service.filterByForDomain('other.com', mockEmails);

      expect(result).toEqual([
        {
          id: '2',
          email: 'test2@example.com',
          state: 'enabled',
          forDomain: 'other.com'
        }
      ]);

      // Should not make an API call when list is provided
      expect(vi.mocked(axios.post)).not.toHaveBeenCalled();
    });
  });
});
