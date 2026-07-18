import type { MaskedEmail } from './maskedEmail.js';

/**
 * Response data containing masked email information returned from making a standard get call
 */
export interface GetResponseData {
  accountId: string;
  state: string;
  notFound: string[] | null;
  list: MaskedEmail[];
}

/** Per-record failure returned by a JMAP set operation. */
export interface SetErrorData {
  /** Machine-readable JMAP SetError type. */
  type: string;
  /** Optional human-readable explanation. */
  description?: string;
  /** Properties responsible for validation failure, when supplied. */
  properties?: string[];
  /** Fastmail-specific refinement of the error type. */
  subType?: string;
  [key: string]: unknown;
}

/**
 * Response data returned from a JMAP set call.
 *
 * @typeParam T - Object type being created or updated.
 */
export interface SetResponseData<T> {
  accountId: string;
  oldState?: string | null;
  newState?: string | null;
  created?: Record<string, Partial<T> & { id: string }> | null;
  updated?: Record<string, Partial<T> | null> | null;
  destroyed?: string[] | null;
  notCreated?: Record<string, SetErrorData> | null;
  notUpdated?: Record<string, SetErrorData> | null;
  notDestroyed?: Record<string, SetErrorData> | null;
}
