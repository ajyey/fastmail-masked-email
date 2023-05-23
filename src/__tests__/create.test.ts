import axios from '../__mocks__/axios';
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { create } from '../lib/create';
import { JmapRequest } from '../types/jmap';
import { Options } from '../types/options';
import { buildHeaders, parseSession } from '../util/sessionUtil';

jest.mock('../util/sessionUtil');

describe('create', () => {
  const mockedParseSession = parseSession as jest.MockedFunction<
    typeof parseSession
  >;
  const mockedBuildHeaders = buildHeaders as jest.MockedFunction<
    typeof buildHeaders
  >;
  let session: any;
  beforeEach(() => {
    jest.resetAllMocks();
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
    await expect(create(undefined)).rejects.toThrow(InvalidArgumentError);
  });

  it('should create a new masked email address enabled by default', async () => {
    const options: Options = {};

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

    axios.post.mockResolvedValue({
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
    const options: Options = {};
    const errorResponse = {
      status: 500,
      statusText: 'Internal Server Error',
      data: 'Server error occurred'
    };

    axios.post.mockRejectedValue({
      response: errorResponse
    });

    await expect(create(session, options)).rejects.toThrow(
      `Create request failed with status code ${errorResponse.status}: ${errorResponse.statusText}. ${errorResponse.data}`
    );
  });

  it('should reject with an Error when Axios makes a request but receives no response', async () => {
    const options: Options = {};

    const errorMessage = 'Network Error';

    axios.post.mockRejectedValue({
      request: {},
      message: errorMessage
    });

    await expect(create(session, options)).rejects.toThrow(
      `Create request was made, but no response was received. Error message: ${errorMessage}`
    );
  });

  it('should reject with an Error when another error occurs during the request', async () => {
    const options: Options = {};

    const errorMessage = 'Unexpected Error';

    axios.post.mockRejectedValue({
      message: errorMessage
    });

    await expect(create(session, options)).rejects.toThrow(
      `An error occurred while creating a masked email. Error message: ${errorMessage}`
    );
  });
});
