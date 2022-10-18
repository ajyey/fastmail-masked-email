import axios from 'axios';
import debug from 'debug';
const updateLog = debug('setState');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { UpdateOptions } from '../types/Options';
import { SetResponse } from '../types/Response';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Updates a masked email
 * @param id - The id of the masked email to update
 * @param session - The session object
 * @param options - The options containing the fields to update
 */
export const update = async (
  id: string | undefined,
  session: any,
  options: UpdateOptions = {}
): Promise<{ [key: string]: null }> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  if (!id) {
    return Promise.reject(new Error('No id provided'));
  }
  if (Object.keys(options).length === 0) {
    return Promise.reject(
      new Error(
        'No options provided. Please provide at least one option to update.'
      )
    );
  }

  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [
      [
        MASKED_EMAIL_CALLS.set,
        { accountId, update: { [id]: { ...options } } },
        'a'
      ]
    ]
  };
  updateLog('update() body: %o', JSON.stringify(body));
  const response = await axios.post(apiUrl, body, {
    headers
  });
  updateLog('update() response: %o', JSON.stringify(response.data));
  const data: SetResponse = await response.data;
  return data.methodResponses[0][1].updated;
};

/**
 * Deletes a masked email by setting the state to deleted
 * @param id - The id of the masked email to delete
 * @param session - The session object
 */
export const remove = async (
  id: string | undefined,
  session: any
): Promise<{ [key: string]: null }> => {
  return await update(id, session, { state: 'deleted' });
};

/**
 * Disables a masked email by setting the state to disabled
 * @param id - The id of the masked email to disable
 * @param session - The session object
 */
export const disable = async (
  id: string | undefined,
  session: any
): Promise<{ [key: string]: null }> => {
  return await update(id, session, { state: 'disabled' });
};

/**
 * Enables a masked email by setting the state to enabled
 * @param id - The id of the masked email to enable
 * @param session - The session object
 */
export const enable = async (
  id: string | undefined,
  session: any
): Promise<{ [key: string]: null }> => {
  return await update(id, session, { state: 'enabled' });
};
