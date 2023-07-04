import { JMAP } from '../constants';

/**
 * Parses the session object and returns the apiUrl, accountId, and auth token attached to the session
 * @param session - The session object
 */
export const parseSession = (session: any) => {
  const accountId = session.primaryAccounts[JMAP.CORE];
  const { apiUrl, fmAuthToken } = session;
  return {
    accountId,
    apiUrl,
    authToken: fmAuthToken
  };
};

/**
 * Builds headers for requests using the JMAP token
 * @param authToken - The JMAP authentication token
 */
export const buildHeaders = (authToken: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`
  };
};
