import fetch from 'node-fetch';

import {
  HTTP,
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY,
} from '../constants';
import { SetResponse } from '../types/Response';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Sets the description of a masked email
 * @param id The id of the masked email address.
 * @param description The new description to set
 * @param session The session object
 * @returns An object containing the id of the email that was updated as the key
 * e.g.
 *
 * {
 *
 *     [masked-1234]: null
 * }
 */
export const setDescription = async (
  id: string | undefined,
  description: string,
  session: any
): Promise<{ [key: string]: null }> => {
  if (!id) {
    throw new Error('No id provided');
  }
  if (!session) {
    throw new Error('No session provided');
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
          { accountId, update: { [id]: { description } } },
          'a',
        ],
      ],
    }),
  });
  const data: SetResponse = <SetResponse>await response.json();
  return data.methodResponses[0][1].updated;
};

/**
 * Sets the forDomain of the masked email address
 * @param id The id of the masked email to update
 * @param headers The headers to use for the request
 * @param forDomain The new domain to set
 * @param apiUrl The apiUrl from the session object.
 * @param accountId The accountId from the session object.
 * @returns An object containing the id of the email that was updated as the key
 * e.g.
 *
 * {
 *
 *     [masked-1234]: null
 * }
 */
export const setForDomain = async (
  id: string | undefined,
  forDomain: string,
  session: any
): Promise<{ [key: string]: null }> => {
  if (!session) {
    throw new Error('No session provided');
  }
  if (!id) {
    throw new Error('No id provided');
  }
  if (!forDomain) {
    throw new Error('No forDomain provided');
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
          { accountId, update: { [id]: { forDomain } } },
          'a',
        ],
      ],
    }),
  });
  const data: SetResponse = <SetResponse>await response.json();
  return data.methodResponses[0][1].updated;
};
