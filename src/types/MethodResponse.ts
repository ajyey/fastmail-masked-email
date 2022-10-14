import { MaskedEmail } from './MaskedEmail';

export interface GetMethodResponse {
  accountId: string;
  state: string;
  notFound: any[];
  list: MaskedEmail[];
}

export interface SetMethodResponse {
  created: any;
  oldState: string;
  accountId: string;
  newState: string;
  updated: { [key: string]: null };
  destroyed: [any];
}
