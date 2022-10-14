import { GetMethodResponse, SetMethodResponse } from './MethodResponse';

export interface GetResponse {
  sessionState: string;
  latestClientVersion: string;
  methodResponses: Array<Array<GetMethodResponse>>;
}
export interface SetResponse {
  sessionState: string;
  latestClientVersion: string;
  methodResponses: Array<Array<SetMethodResponse>>;
}
