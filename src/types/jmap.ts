import type { GetResponseData, SetResponseData } from './response.js';

/**
 * Method calls and responses are represented as arrays of the form:
 * [methodName, args, methodCallId]
 * See https://jmap.io/spec-core.html#the-invocation-data-type for more information
 */
export type Invocation<T> = [methodName: string, args: T, methodCallId: string];

/** Data carried by a JMAP method-level `error` invocation. */
export interface JmapMethodErrorData {
  /** Machine-readable JMAP error type. */
  type: string;
  /** Optional human-readable explanation. */
  description?: string;
  [key: string]: unknown;
}

/**
 * JMAP request object
 */
export interface JmapRequest {
  using: string[];
  methodCalls: Invocation<Record<string, unknown>>[];
  createdIds?: Record<string, string>;
}

/**
 * JMAP response object
 */
export interface JmapResponse<T> {
  sessionState?: string;
  latestClientVersion?: string;
  methodResponses: Invocation<T>[];
}

/**
 * JMAP set/update response
 */
export type JmapSetResponse<T> = JmapResponse<SetResponseData<T>>;

/**
 * JMAP get response
 */
export type JmapGetResponse = JmapResponse<GetResponseData>;
