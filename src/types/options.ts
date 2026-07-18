import type { KyInstance } from 'ky';

import type {
  CreateMaskedEmailState,
  UpdateMaskedEmailState
} from './maskedEmail.js';

/**
 * Options for creating or updating a masked email
 */
export interface UpdateOptions {
  /** The description to set for the masked email. */
  description?: string;
  /** The HTTP(S) origin associated with the masked email. */
  forDomain?: string;
  /** The state to set for the masked email. */
  state?: UpdateMaskedEmailState;
  /** A deep link to the related record, or null to clear it. */
  url?: string | null;
}

export interface CreateOptions {
  description?: string;
  forDomain?: string;
  /** The initial state. The library defaults this to enabled. */
  state?: CreateMaskedEmailState;
  url?: string | null;
  /** A lowercase alphanumeric/underscore prefix of at most 64 characters. */
  emailPrefix?: string;
}

/** Configuration for {@link MaskedEmailService}. */
export interface MaskedEmailServiceOptions {
  token?: string;
  hostname?: string;
  sessionUrl?: string;
  accountId?: string;
  timeout?: number;
  signal?: AbortSignal;
  httpClient?: KyInstance;
}
