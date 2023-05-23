import { AxiosError } from 'axios';

/**
 * Handles an axios error and returns a rejected promise with a formatted error message based on the type of error and action attempted.
 * @param error The axios error
 * @param logger The logger to use for logging
 * @param action The action that was being performed when the error occurred
 */
export const handleAxiosError = (
  error: AxiosError,
  logger: (message: string, ...args: any[]) => void,
  action: string
): Promise<never> => {
  if (error.response) {
    const errorMessage = `${action} failed with status code ${error.response.status}: ${error.response.statusText}. ${error.response.data}`;
    logger('Error response from axios: %o', error.response);
    return Promise.reject(new Error(errorMessage));
  } else if (error.request) {
    const errorMessage = `${action} request was made, but no response was received. Error message: ${error.message}`;
    logger('Error request: %o', error.request);
    return Promise.reject(new Error(errorMessage));
  } else {
    const errorMessage = `An error occurred while ${action.toLowerCase()}. Error message: ${
      error.message
    }`;
    logger('Error: %o', error);
    return Promise.reject(new Error(errorMessage));
  }
};
/**
 * Descriptive actions that can be passed to the axios error handler
 */
export const ACTIONS = {
  CREATE: 'creating a masked email',
  SESSION: 'getting a session',
  LIST: 'listing masked emails',
  GET_BY_ID: 'getting a masked email by id',
  DELETE: 'deleting a masked email',
  UPDATE: 'updating a masked email'
};
