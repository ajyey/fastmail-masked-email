import axios from 'axios';

import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { create } from '../lib/create';
import { Options } from '../types/options';
import { buildHeaders, parseSession } from '../util/sessionUtil';

jest.mock('axios');
jest.mock('../util/sessionUtil');

describe('create', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedParseSession = parseSession as jest.MockedFunction<
    typeof parseSession
  >;
  const mockedBuildHeaders = buildHeaders as jest.MockedFunction<
    typeof buildHeaders
  >;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should reject with InvalidArgumentError if no session is provided', async () => {
    await expect(create(undefined)).rejects.toThrow(InvalidArgumentError);
  });

  it('should create a new masked email address enabled by default', async () => {
    const session = {
      primaryAccounts: {
        [JMAP.CORE]: 'account1'
      },
      apiUrl: 'https://api.example.com',
      fmAuthToken: 'auth-token-123'
    };

    const options: Options = {};

    const expectedRequest = {
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

    mockedParseSession.mockReturnValue({
      accountId: 'account1',
      apiUrl: 'https://api.example.com',
      authToken: 'auth-token-123'
    });

    mockedBuildHeaders.mockReturnValue({
      'Content-Type': 'application/json',
      Authorization: 'Bearer auth-token-123'
    });

    mockedAxios.post.mockResolvedValue({
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

    const result = await create(session, options);

    expect(mockedParseSession).toHaveBeenCalledWith(session);
    expect(mockedBuildHeaders).toHaveBeenCalledWith('auth-token-123');
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.com',
      expectedRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer auth-token-123'
        }
      }
    );

    expect(result).toEqual({
      id: 'masked-email-id',
      state: 'enabled'
    });
  });
});
