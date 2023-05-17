import { GetMethodResponse, SetMethodResponse } from './methodResponse';

/**
 * Response returned from making a standard get call
 */
export interface GetResponse {
  sessionState: string;
  latestClientVersion: string;
  methodResponses: Array<Array<GetMethodResponse>>;
}

/**
 * Response returned from making a standard set/update call
 */
export interface SetResponse {
  sessionState: string;
  latestClientVersion: string;
  methodResponses: Array<Array<SetMethodResponse>>;
}
