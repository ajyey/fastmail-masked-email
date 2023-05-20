import { GetResponseData, SetResponseData } from './response';

/**
 * Method calls and responses are represented as arrays of the form:
 * [methodName, args, methodCallId]
 * See https://jmap.io/spec-core.html#the-invocation-data-type for more information
 */
type Invocation<T> = [methodName: string, args: T, methodCallId: string];

/**
 * JMAP request object
 */
export interface JmapRequest {
  using: string[];
  methodCalls: Invocation<Record<string, any>>[];
  createdIds?: Record<string, string>;
}

/**
 * JMAP response object
 */
interface JmapResponse<T> {
  sessionState: string;
  latestClientVersion: string;
  methodResponses: Invocation<T>[];
}

/**
 * JMAP set/update response
 */
export type JmapSetResponse = JmapResponse<SetResponseData>;

/**
 * JMAP get response
 */
export type JmapGetResponse = JmapResponse<GetResponseData>;
