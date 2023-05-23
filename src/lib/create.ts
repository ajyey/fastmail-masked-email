import axios, { AxiosError } from 'axios';
import debug from 'debug';
const debugLogger = debug('create:debug');
const errorLogger = debug('create:error');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { JmapRequest, JmapSetResponse } from '../types/jmap';
import { MaskedEmail, MaskedEmailState } from '../types/maskedEmail';
import { Options } from '../types/options';
import { ACTIONS, handleAxiosError } from '../util/errorUtil';
import { buildHeaders, parseSession } from '../util/sessionUtil';

const DEFAULT_MASKED_EMAIL_STATE: MaskedEmailState = 'enabled';

/**
 * Creates a new masked email address
 * @param session - The session object
 * @param options - The {@link Options} for creating the masked email
 * @throws {@link InvalidArgumentError} if no session is provided
 */
export const create = async (
  session: any,
  options: Options = {}
): Promise<MaskedEmail> => {
  if (!session) {
    return Promise.reject(new InvalidArgumentError('No session provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const state: MaskedEmailState = options.state || DEFAULT_MASKED_EMAIL_STATE;
  const requestBody: JmapRequest = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [
      [
        MASKED_EMAIL_CALLS.set,
        {
          accountId,
          create: {
            ['0']: {
              ...options,
              state
            }
          }
        },
        'a'
      ]
    ]
  };
  debugLogger('create() request body: %o', JSON.stringify(requestBody));
  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers
    });

    debugLogger('create() response: %o', JSON.stringify(response.data));
    const { data }: { data: JmapSetResponse } = response;
    return {
      ...data.methodResponses[0][1].created['0'],
      state
    };
  } catch (error) {
    return handleAxiosError(error as AxiosError, errorLogger, ACTIONS.CREATE);
  }
};
