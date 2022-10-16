import axios, { AxiosResponse } from 'axios';
import { Logger } from 'tslog';

import { API_HOSTNAME } from '../constants';
const logger: Logger = new Logger();
/**
 * Gets the session object from the JMAP server
 */
export const getSession = async (
  hostname?: string,
  token?: string
): Promise<any> => {
  if (!hostname) {
    hostname = process.env.JMAP_HOSTNAME || API_HOSTNAME;
  }
  if (!token) {
    token = process.env.JMAP_TOKEN;
  }
  if (!token) {
    return Promise.reject(
      new Error(
        'No hostname or token provided. Please provide a hostname and token, or set the JMAP_HOSTNAME and JMAP_TOKEN environment variables.'
      )
    );
  }
  const authUrl = `https://${hostname}/.well-known/jmap`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response: AxiosResponse = await axios.get(authUrl, {
    headers
  });
  logger.debug('getSession() response', response);
  return await response.data;
};
