import axios from 'axios';
import debug from 'debug';
const setStateLog = debug('setState');
const setDescriptionLog = debug('setDescription');
const setForDomainLog = debug('setForDomain');
import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
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
    return Promise.reject(new Error('No id provided'));
  }
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
        { accountId, update: { [id]: { description } } },
        'a'
      ]
    ]
  };
  setDescriptionLog('setDescription() body: %o', JSON.stringify(body));
  const response = await axios.post(apiUrl, body, {
    headers
  });
  setDescriptionLog('setDescription() response: %o', response);
  const data: SetResponse = response.data;
  return data.methodResponses[0][1].updated;
};

/**
 * Sets the forDomain of the masked email address
 * @param id The id of the masked email to update
 * @param forDomain The new domain to set
 * @param session The session object
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
    return Promise.reject(new Error('No session provided'));
  }
  if (!id) {
    return Promise.reject(new Error('No id provided'));
  }
  if (!forDomain) {
    return Promise.reject(new Error('No forDomain provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [
      [
        MASKED_EMAIL_CALLS.set,
        { accountId, update: { [id]: { forDomain } } },
        'a'
      ]
    ]
  };
  setForDomainLog('setForDomain() body: %o', JSON.stringify(body));
  const response = await axios.post(apiUrl, body, {
    headers
  });
  setForDomainLog('Response: %o', JSON.stringify(response.data));
  const data: SetResponse = response.data;
  return data.methodResponses[0][1].updated;
};

/**
 * Sets the state of a masked email
 * @param id The id of the masked email to update
 * @param state The new state to set
 * @param session The session object
 */
const setState = async (
  id: string | undefined,
  state: string,
  session: any
): Promise<{ [key: string]: null }> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  if (!id) {
    return Promise.reject(new Error('No id provided'));
  }
  if (!state) {
    return Promise.reject(new Error('No state provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [
      [MASKED_EMAIL_CALLS.set, { accountId, update: { [id]: { state } } }, 'a']
    ]
  };
  setStateLog('setState() body: %o', JSON.stringify(body));
  const response = await axios.post(apiUrl, body, {
    headers
  });
  setStateLog('setState() response: %o', JSON.stringify(response.data));
  const data: SetResponse = await response.data;
  return data.methodResponses[0][1].updated;
};

/**
 * Deletes a masked email by setting the state to deleted
 * @param id The id of the masked email to delete
 * @param session The session object
 */
export const remove = async (
  id: string | undefined,
  session: any
): Promise<{ [key: string]: null }> => {
  return await setState(id, 'deleted', session);
};

/**
 * Disables a masked email by setting the state to disabled
 * @param id The id of the masked email to disable
 * @param session The session object
 */
export const disable = async (
  id: string | undefined,
  session: any
): Promise<{ [key: string]: null }> => {
  return await setState(id, 'disabled', session);
};

/**
 * Enables a masked email by setting the state to enabled
 * @param id The id of the masked email to enable
 * @param session The session object
 */
export const enable = async (
  id: string | undefined,
  session: any
): Promise<{ [key: string]: null }> => {
  return await setState(id, 'enabled', session);
};
