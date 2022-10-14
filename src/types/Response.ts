import { MethodResponse } from './MethodResponse';

export interface Response {
  sessionState: string;
  latestClientVersion: string;
  methodResponses: Array<Array<MethodResponse>>;
}
