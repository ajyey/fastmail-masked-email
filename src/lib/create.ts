import axios from 'axios';
import debug from 'debug';
const createLogger = debug('create');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { JmapRequest, JmapSetResponse } from '../types/jmap';
import { MaskedEmail, MaskedEmailState } from '../types/maskedEmail';
import { Options } from '../types/options';
import { buildHeaders, parseSession } from '../util/sessionUtil';

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
  const state: MaskedEmailState = options.state || 'enabled';
  const body: JmapRequest = {
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
  createLogger('create() body: %o', JSON.stringify(body));

  const response = await axios.post(apiUrl, body, {
    headers
  });

  createLogger('create() response: %o', JSON.stringify(response.data));
  const data: JmapSetResponse = response.data;
  return {
    ...data.methodResponses[0][1].created['0'],
    state
  };
};