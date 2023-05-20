import { MaskedEmail } from './maskedEmail';

/**
 * Response data containing masked email information returned from making a standard get call
 */
export interface GetResponseData {
  accountId: string;
  state: string;
  notFound: string[];
  list: MaskedEmail[];
}

/**
 * Response data returned from making a successful set/update call
 */
export interface SetResponseData {
  created: any;
  oldState: string;
  accountId: string;
  newState: string;
  updated: { [key: string]: null };
  destroyed: { [key: string]: null };
}
