import axios from 'axios';

import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { disable, enable, remove, update } from '../lib/set';
import * as set from '../lib/set';
import { UpdateOptions } from '../types/options';

jest.mock('axios');

describe('update', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const updateSpy = jest.spyOn(set, 'update');

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

  describe('update', () => {
    it('should reject with InvalidArgumentError if no session is provided', async () => {
      await expect(
        update('1', undefined, { description: 'test' })
      ).rejects.toThrow(InvalidArgumentError);
    });

    it('should reject with InvalidArgumentError if no id is provided', async () => {
      await expect(
        update(undefined, session, { description: 'test' })
      ).rejects.toThrow(InvalidArgumentError);
    });

    it('should reject with InvalidArgumentError if no options are provided', async () => {
      await expect(update('1', session, {})).rejects.toThrow(
        InvalidArgumentError
      );
    });
    it('should reject with InvalidArgumentError if invalid options are provided', async () => {
      await expect(
        update('1', session, { invalid: 'invalid' } as UpdateOptions)
      ).rejects.toThrow(InvalidArgumentError);
    });

    it('should update a masked email', async () => {
      const updateOptions: UpdateOptions = {
        description: 'updated description',
        state: 'disabled'
      };

      mockedAxios.post.mockResolvedValue({
        data: {
          methodResponses: [
            [MASKED_EMAIL_CALLS.set, { updated: { '1': null } }]
          ]
        }
      });

      const result = await update('1', session, updateOptions);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.example.com',
        {
          using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
          methodCalls: [
            [
              MASKED_EMAIL_CALLS.set,
              { accountId: 'account1', update: { '1': updateOptions } },
              'a'
            ]
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer auth-token-123'
          }
        }
      );

      expect(result).toEqual({ '1': null });
    });
  });

  describe('remove', () => {
    it('should remove a masked email', async () => {
      updateSpy.mockResolvedValue({ '1': null });

      const result = await remove('1', session);

      expect(updateSpy).toHaveBeenCalledWith('1', session, {
        state: 'deleted'
      });
      expect(result).toEqual({ '1': null });
    });
  });

  describe('disable', () => {
    it('should disable a masked email', async () => {
      updateSpy.mockResolvedValue({ '1': null });

      const result = await disable('1', session);

      expect(updateSpy).toHaveBeenCalledWith('1', session, {
        state: 'disabled'
      });
      expect(result).toEqual({ '1': null });
    });
  });

  describe('enable', () => {
    it('should enable a masked email', async () => {
      updateSpy.mockResolvedValue({ '1': null });

      const result = await enable('1', session);

      expect(updateSpy).toHaveBeenCalledWith('1', session, {
        state: 'enabled'
      });
      expect(result).toEqual({ '1': null });
    });
  });
});
