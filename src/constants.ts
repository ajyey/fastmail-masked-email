export const JMAP = {
  CORE: 'urn:ietf:params:jmap:core'
};

export const MASKED_EMAIL_CALLS = {
  get: 'MaskedEmail/get',
  set: 'MaskedEmail/set'
};

export const MASKED_EMAIL_CAPABILITY =
  'https://www.fastmail.com/dev/maskedemail';

/**
 * The default hostname for the Fastmail API
 */
export const API_HOSTNAME = 'api.fastmail.com';

/**
 * Descriptive actions that can be passed to the axios error handler
 */
export enum Action {
  CREATE = 'creating a masked email',
  SESSION = 'getting a session',
  LIST = 'listing masked emails',
  GET_BY_ID = 'getting a masked email by id',
  DELETE = 'deleting a masked email',
  UPDATE = 'updating a masked email'
}
