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

export interface SetErrorData {
  type: string;
  description?: string;
  properties?: string[];
  subType?: string;
  [key: string]: unknown;
}

/** Response data returned from a JMAP set call. */
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
