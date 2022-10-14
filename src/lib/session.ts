import fetch from 'node-fetch';

import { HTTP } from '../constants';

/**
 * Gets the session object from the JMAP server
 * @param headers The headers to use for the request
 * @param authUrl The authUrl from the session object
 */
export const getSession = async (): Promise<any> => {
  const hostname = process.env.JMAP_HOSTNAME;
  const token = process.env.JMAP_TOKEN;
  if (!process.env.JMAP_HOSTNAME || !process.env.JMAP_TOKEN) {
    throw new Error('JMAP_HOSTNAME and JMAP_TOKEN must be set');
  }
  const authUrl = `https://${hostname}/.well-known/jmap`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(authUrl, {
    method: HTTP.GET,
    headers,
  });
  return await response.json();
};
