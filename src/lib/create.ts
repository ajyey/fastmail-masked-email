import axios from 'axios';
import debug from 'debug';
const createLogger = debug('create');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { MaskedEmail, MaskedEmailState } from '../types/MaskedEmail';
import { SetResponse } from '../types/Response';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Options for creating a masked email
 */
interface CreateOptions {
  description?: string;
  forDomain?: string;
  state?: MaskedEmailState;
}

/**
 * Creates a new masked email address
 * @param session The session object
 * @param createOptions The options for creating the masked email
 */
export const create = async (
  session: any,
  createOptions: CreateOptions = {}
): Promise<MaskedEmail> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [
      [
        MASKED_EMAIL_CALLS.set,
        {
          accountId,
          create: {
            ['0']: {
              forDomain: createOptions.forDomain || '',
              description: createOptions.description || '',
              state: createOptions.state || 'enabled'
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
  return data.methodResponses[0][1].created['0'];
};
