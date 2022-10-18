import axios, { AxiosResponse } from 'axios';
import debug from 'debug';
const listLogger = debug('list');
const getByIdLogger = debug('getById');

import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { MaskedEmail } from '../types/MaskedEmail';
import { GetResponse } from '../types/Response';
import { filterByAddress } from '../util/getUtil';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Retrieves all masked emails
 * @param session - The session object
 */
export const list = async (session: any): Promise<MaskedEmail[]> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: null }, 'a']]
  };
  listLogger('list() body: %o', JSON.stringify(body));
  const response: AxiosResponse = await axios.post(apiUrl, body, {
    headers
  });
  listLogger('list() response: %o', JSON.stringify(response.data));
  const data: GetResponse = response.data;
  return data.methodResponses[0][1].list;
};

/**
 * Get a masked email by id
 * @param id - The id of the masked email address.
 * @param session - The session object
 * @returns The masked email
 * @throws Error if no id is provided, no session is provided, or the masked email is not found
 */
export const getById = async (
  id: string,
  session: any
): Promise<MaskedEmail> => {
  if (!session) {
    return Promise.reject(new Error('No session provided'));
  }
  if (!id) {
    return Promise.reject(new Error('No id provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: [id] }, 'a']]
  };
  const response: AxiosResponse = await axios.post(apiUrl, body, {
    headers
  });
  getByIdLogger('getById() body: %o', JSON.stringify(body));
  const data: GetResponse = response.data;
  getByIdLogger('getById() response %o', JSON.stringify(response.data));
  if (!data.methodResponses[0][1].list) {
    return Promise.reject(new Error(`No masked email found with id ${id}`));
  }
  return data.methodResponses[0][1].list[0];
};

/**
 * Get a masked email by address
 * @param address - The address to retrieve
 * @param session - The session object
 * @returns The masked email object in a list
 */
export const getByAddress = async (
  address: string,
  session: any
): Promise<MaskedEmail[] | []> => {
  const maskedEmails = await list(session);
  return filterByAddress(address, maskedEmails);
};
