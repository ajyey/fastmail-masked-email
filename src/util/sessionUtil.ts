import { JMAP } from '../constants';

/**
 * Parses the session object and returns the apiUrl and accountId
 * @param session The session object
 */
export const parseSession = (session: any) => {
  const accountId = session.primaryAccounts[JMAP.CORE];
  const { apiUrl } = session;
  return {
    accountId,
    apiUrl,
  };
};

/**
 * Builds headers for requests using the JMAP token
 */
export const buildHeaders = () => {
  if (!process.env.JMAP_TOKEN) {
    throw new Error('JMAP_TOKEN env variable must be set');
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.JMAP_TOKEN}`,
  };
};
