import axios from 'axios';
import { Logger } from 'tslog';

import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { MaskedEmail, MaskedEmailState } from '../types/MaskedEmail';
import { SetResponse } from '../types/Response';
import { buildHeaders, parseSession } from '../util/sessionUtil';
const logger: Logger = new Logger();
/**
 * Creates a new masked email address
 * @param session The session object
 * @param forDomain The domain to create the masked email for
 * @param state The state to set the masked email to. Defaults to 'enabled'.
 */
export const create = async (
  session: any,
  forDomain: string,
  state?: MaskedEmailState
): Promise<MaskedEmail> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  if (!forDomain) {
    return Promise.reject(new Error('No forDomain provided'));
  }
  const { apiUrl, accountId } = parseSession(session);
  const headers = buildHeaders();
  const response = await axios.post(
    apiUrl,
    {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [
        [
          MASKED_EMAIL_CALLS.set,
          {
            accountId,
            create: {
              [forDomain]: {
                forDomain,
                state: state ? state : 'enabled'
              }
            }
          },
          'a'
        ]
      ]
    },
    {
      headers
    }
  );

  logger.debug('create() response', response);
  const data: SetResponse = response.data;
  return data.methodResponses[0][1].created[forDomain];
};
