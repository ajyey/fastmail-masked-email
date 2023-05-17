import axios, { AxiosResponse } from 'axios';
import debug from 'debug';
const sessionLogger = debug('session');
import { API_HOSTNAME } from '../constants';

/**
 * Gets the session object from the JMAP server
 * @param token - Optional Fastmail API token to use for authentication
 * @param hostname - Optional Fastmail API hostname to use for authentication; defaults to https://api.fastmail.com
 * @throws {@link InvalidCredentialsError} if no username or password is provided
 */
export const getSession = async (
  token?: string,
  hostname?: string
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
        'No auth token provided and JMAP_TOKEN environment variable is not set. Please provide a token.'
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
