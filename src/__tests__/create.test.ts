import { vi, describe, it, expect, beforeEach } from 'vitest';
import axios from 'axios';
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { createEmail } from '../lib/create';
import { JmapRequest } from '../types/jmap';
import { CreateOptions } from '../types/options';
import { buildHeaders, parseSession } from '../util/sessionUtil';

vi.mock('axios');
vi.mock('../util/sessionUtil');

describe('create', () => {
  const mockedParseSession = vi.mocked(parseSession);
  const mockedBuildHeaders = vi.mocked(buildHeaders);
  let session: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedParseSession.mockReturnValue({
      accountId: 'account1',
      apiUrl: 'https://api.example.com',
      authToken: 'auth-token-123'
    });

    mockedBuildHeaders.mockReturnValue({
      'Content-Type': 'application/json',
      Authorization: 'Bearer auth-token-123'
    });
    session = {
      primaryAccounts: {
        [JMAP.CORE]: 'account1'
      },
      apiUrl: 'https://api.example.com',
      fmAuthToken: 'auth-token-123'
    };
  });

  it('should reject with InvalidArgumentError if no session is provided', async () => {
    await expect(createEmail(undefined)).rejects.toThrow(InvalidArgumentError);
  });

  it('should createEmail a new masked email address enabled by default', async () => {
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

    const result = await createEmail(session, options);

    expect(mockedParseSession).toHaveBeenCalledWith(session);
    expect(mockedBuildHeaders).toHaveBeenCalledWith('auth-token-123');
    expect(axios.post).toHaveBeenCalledWith(
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

  it('should reject with an Error when Axios receives an error response', async () => {
    const options: CreateOptions = {};
    const errorResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      data: 'Server error occurred'
    };

    vi.mocked(axios.post).mockRejectedValue({
      response: errorResponse
    });

    await expect(createEmail(session, options)).rejects.toThrow(
      `creating a masked email failed with status code ${errorResponse.status}: ${errorResponse.statusText}. ${errorResponse.data}`
    );
  });

  it('should reject with an Error when Axios makes a request but receives no response', async () => {
    const options: CreateOptions = {};

    const errorMessage = 'Network Error';

    vi.mocked(axios.post).mockRejectedValue({
      request: {},
      message: errorMessage
    });

    await expect(createEmail(session, options)).rejects.toThrow(
      `creating a masked email request was made, but no response was received. Error message: ${errorMessage}`
    );
  });

  it('should reject with an Error when another error occurs during the request', async () => {
    const options: CreateOptions = {};

    const errorMessage = 'Unexpected Error';

    vi.mocked(axios.post).mockRejectedValue({
      message: errorMessage
    });

    await expect(createEmail(session, options)).rejects.toThrow(
      `An error occurred while creating a masked email. Error message: ${errorMessage}`
    );
  });
});
