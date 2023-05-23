import axios, { AxiosError, AxiosResponse } from 'axios';
import debug from 'debug';
const debugLogger = debug('session:debug');
const errorLogger = debug('session:error');
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
  hostname = hostname || process.env.JMAP_HOSTNAME || API_HOSTNAME;

  token = token || process.env.JMAP_TOKEN;

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
  try {
    const response: AxiosResponse = await axios.get(authUrl, {
      headers
    });
    // Set the token in the session object to be used in subsequent requests
    response.data.fmAuthToken = token;
    debugLogger('getSession() response: %o', JSON.stringify(response.data));
    return await response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const errorMessage = `Request for session failed with status code ${axiosError.response.status}: ${axiosError.response.statusText}. ${axiosError.response.data}`;
      errorLogger('Error response: %o', axiosError.response);
      return Promise.reject(new Error(errorMessage));
    } else if (axiosError.request) {
      const errorMessage = `Request for session was made, but no response was received. Error message: ${axiosError.message}`;
      errorLogger('Error request: %o', axiosError.request);
      return Promise.reject(new Error(errorMessage));
    } else {
      const errorMessage = `An error occurred while fetching the JMAP session. Error message: ${axiosError.message}`;
      errorLogger('Error: %o', axiosError);
      return Promise.reject(new Error(errorMessage));
    }
  }
};
