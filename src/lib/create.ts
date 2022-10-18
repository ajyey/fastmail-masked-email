import axios from 'axios';
import debug from 'debug';
const createLogger = debug('create');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { MaskedEmail } from '../types/MaskedEmail';
import { CreateOptions } from '../types/Options';
import { SetResponse } from '../types/Response';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Creates a new masked email address
 * @param session - The session object
 * @param options - The options for creating the masked email
 */
export const create = async (
  session: any,
  options: CreateOptions = {}
): Promise<MaskedEmail> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const state = options.state || 'enabled';
  const body = {
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
  const data: SetResponse = response.data;
  return {
    ...data.methodResponses[0][1].created['0'],
    state
  };
};
