/**
 * Method response returned from making a standard get call
 */
import { MaskedEmail } from './MaskedEmail';

export interface GetMethodResponse {
  accountId: string;
  state: string;
  notFound: any[];
  list: MaskedEmail[];
}

/**
 * Method response returned from making a standard set call
 */
export interface SetMethodResponse {
  created: any;
  oldState: string;
  accountId: string;
  newState: string;
  updated: { [key: string]: null };
  destroyed: { [key: string]: null };
}
