import type { KyInstance } from 'ky';

import type {
  CreateMaskedEmailState,
  UpdateMaskedEmailState
} from './maskedEmail.js';

/** Mutable masked-email fields accepted by {@link MaskedEmailService.updateEmail}. */
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

/** Metadata and initial state accepted when creating a masked email. */
export interface CreateOptions {
  /** A short description of the account or purpose associated with the address. */
  description?: string;
  /** The canonical HTTP(S) origin associated with the address. */
  forDomain?: string;
  /** The initial state. The library defaults this to enabled. */
  state?: CreateMaskedEmailState;
  /** A deep link to the related credential or account record. */
  url?: string | null;
  /** A lowercase alphanumeric/underscore prefix of at most 64 characters. */
  emailPrefix?: string;
}

/** Configuration for {@link MaskedEmailService}. */
export interface MaskedEmailServiceOptions {
  /** Fastmail API token. Falls back to `JMAP_TOKEN` when omitted. */
  token?: string;
  /** API host without a scheme or path. Falls back to `JMAP_HOSTNAME`. */
  hostname?: string;
  /** Complete HTTPS session discovery URL, taking precedence over `hostname`. */
  sessionUrl?: string;
  /** Specific masked-email-capable account to use instead of automatic selection. */
  accountId?: string;
  /** Request timeout in milliseconds. Set to `0` to disable timeouts. */
  timeout?: number;
  /** Signal used to cancel session and JMAP requests. */
  signal?: AbortSignal;
  /** Ky instance to use instead of the package default, primarily for testing. */
  httpClient?: KyInstance;
}
