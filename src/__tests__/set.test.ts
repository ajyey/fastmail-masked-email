import axios from '../__mocks__/axios';
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import {
  deleteEmail,
  disableEmail,
  enableEmail,
  updateEmail
} from '../lib/set';
import * as set from '../lib/set';
import { Options } from '../types/options';
describe('update', () => {
  const updateSpy = jest.spyOn(set, 'updateEmail');

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

  describe('updateEmail', () => {
    it('should reject with InvalidArgumentError if no session is provided', async () => {
      await expect(
        updateEmail('1', undefined, { description: 'test' })
      ).rejects.toThrow(InvalidArgumentError);
    });

    it('should reject with InvalidArgumentError if no id is provided', async () => {
      await expect(
        updateEmail(undefined, session, { description: 'test' })
      ).rejects.toThrow(InvalidArgumentError);
    });

    it('should reject with InvalidArgumentError if no options are provided', async () => {
      await expect(updateEmail('1', session, {})).rejects.toThrow(
        InvalidArgumentError
      );
    });
    it('should reject with InvalidArgumentError if invalid options are provided', async () => {
      await expect(
        updateEmail('1', session, { invalid: 'invalid' } as Options)
      ).rejects.toThrow(InvalidArgumentError);
    });

    it('should update a masked email', async () => {
      const updateOptions: Options = {
        description: 'updated description',
        state: 'disabled'
      };

      axios.post.mockResolvedValue({
        data: {
          methodResponses: [
            [MASKED_EMAIL_CALLS.set, { updated: { '1': null } }]
          ]
        }
      });

      const result = await updateEmail('1', session, updateOptions);

      expect(axios.post).toHaveBeenCalledWith(
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

  describe('deleteEmail', () => {
    it('should delete a masked email', async () => {
      updateSpy.mockResolvedValue({ '1': null });

      const result = await deleteEmail('1', session);

      expect(updateSpy).toHaveBeenCalledWith('1', session, {
        state: 'deleted'
      });
      expect(result).toEqual({ '1': null });
    });
  });

  describe('disableEmail', () => {
    it('should disable a masked email', async () => {
      updateSpy.mockResolvedValue({ '1': null });

      const result = await disableEmail('1', session);

      expect(updateSpy).toHaveBeenCalledWith('1', session, {
        state: 'disabled'
      });
      expect(result).toEqual({ '1': null });
    });
  });

  describe('enableEmail', () => {
    it('should enable a masked email', async () => {
      updateSpy.mockResolvedValue({ '1': null });

      const result = await enableEmail('1', session);

      expect(updateSpy).toHaveBeenCalledWith('1', session, {
        state: 'enabled'
      });
      expect(result).toEqual({ '1': null });
    });
  });
});
