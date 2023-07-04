import axios, { AxiosError } from 'axios';
import debug from 'debug';
const updateDebugLogger = debug('updateEmail:debug');
const updateErrorLogger = debug('updateEmail:error');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { JmapRequest, JmapSetResponse } from '../types/jmap';
import { Options } from '../types/options';
import { ACTIONS, handleAxiosError } from '../util/errorUtil';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Updates a masked email
 * @param id - The id of the masked email to update
 * @param session - The session object
 * @param options - The {@link Options} containing the fields to update
 * @throws {@link InvalidArgumentError} if no id is provided, no session is provided, or the {@link Options} are empty
 */
export const updateEmail = async (
  id: string | undefined,
  session: any,
  options: Options
): Promise<{ [key: string]: null }> => {
  if (!session) {
    return Promise.reject(new InvalidArgumentError('No session provided'));
  }
  if (!id) {
    return Promise.reject(new InvalidArgumentError('No id provided'));
  }
  if (Object.keys(options).length === 0) {
    return Promise.reject(
      new InvalidArgumentError(
        'No options provided. Please provide at least one option to update.'
      )
    );
  }
  const validOptions: string[] = ['description', 'forDomain', 'state'];
  const invalidOptions: string[] = Object.keys(options).filter(
    (option: string) => !validOptions.includes(option)
  );
  if (invalidOptions.length > 0) {
    return Promise.reject(
      new InvalidArgumentError(
        `Invalid options provided: ${invalidOptions.join(', ')}`
      )
    );
  }

  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body: JmapRequest = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [
      [
        MASKED_EMAIL_CALLS.set,
        { accountId, update: { [id]: { ...options } } },
        'a'
      ]
    ]
  };
  updateDebugLogger('updateEmail() body: %o', JSON.stringify(body));
  try {
    const response = await axios.post(apiUrl, body, {
      headers
    });
    updateDebugLogger(
      'updateEmail() response: %o',
      JSON.stringify(response.data)
    );
    const data: JmapSetResponse = await response.data;
    return data.methodResponses[0][1].updated;
  } catch (error) {
    return handleAxiosError(
      error as AxiosError,
      updateErrorLogger,
      ACTIONS.UPDATE
    );
  }
};

/**
 * Deletes a masked email by setting the state to deleted
 * @param id - The id of the masked email to delete
 * @param session - The session object
 */
export const remove = async (
  id: string,
  session: any
): Promise<{ [key: string]: null }> => {
  return await updateEmail(id, session, { state: 'deleted' });
};

/**
 * Disables a masked email by setting the state to disabled
 * @param id - The id of the masked email to disable
 * @param session - The session object
 */
export const disable = async (
  id: string,
  session: any
): Promise<{ [key: string]: null }> => {
  return await updateEmail(id, session, { state: 'disabled' });
};

/**
 * Enables a masked email by setting the state to enabled
 * @param id - The id of the masked email to enable
 * @param session - The session object
 */
export const enable = async (
  id: string,
  session: any
): Promise<{ [key: string]: null }> => {
  return await updateEmail(id, session, { state: 'enabled' });
};
