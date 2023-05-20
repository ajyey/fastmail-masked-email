import axios, { AxiosResponse } from 'axios';
import debug from 'debug';
const listLogger = debug('list');
const getByIdLogger = debug('getById');

import {
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from '../constants';
import { InvalidArgumentError } from '../error/invalidArgumentError';
import { JmapGetResponse, JmapRequest } from '../types/jmap';
import { MaskedEmail } from '../types/maskedEmail';
import { GetResponseData } from '../types/response';
import { filterByAddress } from '../util/getUtil';
import { buildHeaders, parseSession } from '../util/sessionUtil';

/**
 * Retrieves all masked emails
 * @param session - The session object
 * @throws {@link InvalidArgumentError} if no session is provided
 * @returns A list of {@link MaskedEmail} objects
 */
export const list = async (session: any): Promise<MaskedEmail[]> => {
  if (!session) {
    return Promise.reject(new InvalidArgumentError('No session provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body: JmapRequest = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: null }, 'a']]
  };
  listLogger('list() body: %o', JSON.stringify(body));
  const response: AxiosResponse = await axios.post(apiUrl, body, {
    headers
  });
  listLogger('list() response: %o', JSON.stringify(response.data));
  const jmapResponse: JmapGetResponse = response.data;
  const methodResponse: GetResponseData = jmapResponse.methodResponses[0][1];
  return methodResponse.list;
};

const maskedEmailNotFound = (
  id: string,
  response: JmapGetResponse
): boolean => {
  const notFoundIds = response.methodResponses[0][1].notFound;
  if (notFoundIds && notFoundIds.length > 0) {
    return notFoundIds.includes(id);
  }
  return false;
};
/**
 * Get a masked email by id
 * @param id - The id of the masked email address.
 * @param session - The session object
 * @returns A {@link MaskedEmail} object
 * @throws {@link InvalidArgumentError} if no session is provided or no id is provided
 */
export const getById = async (
  id: string | undefined,
  session: any
): Promise<MaskedEmail> => {
  if (!session) {
    return Promise.reject(new InvalidArgumentError('No session provided'));
  }
  if (!id) {
    return Promise.reject(new InvalidArgumentError('No id provided'));
  }
  const { apiUrl, accountId, authToken } = parseSession(session);
  const headers = buildHeaders(authToken);
  const body: JmapRequest = {
    using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
    methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: [id] }, 'a']]
  };
  const response: AxiosResponse = await axios.post(apiUrl, body, {
    headers
  });
  getByIdLogger('getById() body: %o', JSON.stringify(body));
  const responseData: JmapGetResponse = response.data;
  getByIdLogger('getById() response %o', JSON.stringify(response.data));
  if (maskedEmailNotFound(id, responseData)) {
    return Promise.reject(new Error(`No masked email found with id ${id}`));
  }
  return responseData.methodResponses[0][1].list[0];
};

/**
 * Get a masked email by address
 * @param address - The address to retrieve
 * @param session - The session object
 * @returns  A {@link MaskedEmail} object
 */
export const getByAddress = async (
  address: string,
  session: any
): Promise<MaskedEmail[] | []> => {
  const maskedEmails = await list(session);
  return filterByAddress(address, maskedEmails);
};
