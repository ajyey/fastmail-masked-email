import { MaskedEmail } from './MaskedEmail';

export interface MethodResponse {
  accountId: string;
  state: string;
  notFound: any[];
  list: MaskedEmail[];
}
