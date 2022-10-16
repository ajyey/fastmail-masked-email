import axios, { AxiosResponse } from 'axios';
import debug from 'debug';
const sessionLogger = debug('session');
import { API_HOSTNAME } from '../constants';

/**
 * Gets the session object from the JMAP server
 */
export const getSession = async (
  token?: string,
  hostname: string = API_HOSTNAME
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
  const authUrl = `https://${hostname}/jmap/session`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
  const response: AxiosResponse = await axios.get(authUrl, {
    headers
  });
  // Set the token in the session object to be used in subsequent requests
  response.data.fmAuthToken = token;
  sessionLogger('getSession() response: %o', JSON.stringify(response.data));
  return await response.data;
};
