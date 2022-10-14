import fetch from 'node-fetch';

import {
  HTTP,
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY,
} from '../constants';
import { MaskedEmail, MaskedEmailState } from '../types/MaskedEmail';
// import { SetResponse } from '../types/Response';
import { buildHeaders, parseSession } from '../util/sessionUtil';

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
    throw new Error('No session provided');
  }
  if (!forDomain) {
    throw new Error('No domain provided');
  }
  const { apiUrl, accountId } = parseSession(session);
  const headers = buildHeaders();
  const response = await fetch(apiUrl, {
    method: HTTP.POST,
    headers,
    body: JSON.stringify({
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [
        [
          MASKED_EMAIL_CALLS.set,
          {
            accountId,
            create: {
              [forDomain]: { forDomain, state: state ? state : 'enabled' },
            },
          },
          'a',
        ],
      ],
    }),
  });
  const data = await response.json();
  return data.methodResponses[0][1].created[forDomain];
};
