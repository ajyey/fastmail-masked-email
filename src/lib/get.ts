import fetch, { RequestInfo } from 'node-fetch';

import {
  HTTP,
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY,
} from '../constants';
import { MaskedEmail } from '../types/MaskedEmail';
import { GetResponse } from '../types/Response';
import { getEmailByAddress } from '../util/getUtil';

/**
 * Gets all masked emails
 * @param headers The headers to use for the request
 * @param apiUrl The apiUrl from the session
 * @param accountId The accountId from the session
 */
export const getAll = async (
  headers: any,
  apiUrl: RequestInfo,
  accountId: string
): Promise<readonly MaskedEmail[]> => {
  const response = await fetch(apiUrl, {
    method: HTTP.POST,
    headers,
    body: JSON.stringify({
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: null }, 'a']],
    }),
  });
  const data: GetResponse = <GetResponse>await response.json();
  return data.methodResponses[0][1].list;
};

/**
 * Get a masked email by id
 * @param id The id of the masked email address.
 * @param apiUrl The apiUrl from the session object.
 * @param accountId The accountId from the session object.
 */
export const getById = async (
  id: string,
  headers: any,
  apiUrl: RequestInfo,
  accountId: string
): Promise<MaskedEmail> => {
  const response = await fetch(apiUrl, {
    method: HTTP.POST,
    headers,
    body: JSON.stringify({
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: [id] }, 'a']],
    }),
  });
  const data: GetResponse = <GetResponse>await response.json();
  return data.methodResponses[0][1].list[0];
};

/**
 * Get a masked email by address
 * @param address The address to retrieve
 * @param headers The headers to use for the request
 * @param apiUrl The apiUrl from the session object.
 * @param accountId The accountId from the session object.
 */
export const getByAddress = async (
  address: string,
  headers: any,
  apiUrl: RequestInfo,
  accountId: string
): Promise<MaskedEmail | undefined> => {
  const maskedEmails = await getAll(headers, apiUrl, accountId);
  return getEmailByAddress(address, maskedEmails);
};
