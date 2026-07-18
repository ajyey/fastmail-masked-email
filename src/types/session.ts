/** Account metadata advertised by a JMAP session. */
export interface SessionAccount {
  /** Human-readable account name. */
  name: string;
  /** Whether this is the user's personal account. */
  isPersonal: boolean;
  /** Optional Fastmail extension; not part of the standard JMAP Account object. */
  userId?: string;
  /** Capabilities supported for this account. */
  accountCapabilities: Record<string, Record<string, unknown>>;
  /** Whether writes are forbidden for this account. */
  isReadOnly: boolean;
  [key: string]: unknown;
}

/** Validated subset of a Fastmail JMAP session used by the service. */
export interface Session {
  /** Opaque state token representing the session configuration. */
  state: string;
  /** HTTPS endpoint used for JMAP method calls. */
  apiUrl: string;
  /** Capabilities advertised by the server. */
  capabilities: Record<string, Record<string, unknown>>;
  /** Accounts available to the authenticated user. */
  accounts: Record<string, SessionAccount>;
  /** Preferred account IDs keyed by capability URI. */
  primaryAccounts: Record<string, string>;
  /** Optional endpoint for JMAP event sources. */
  eventSourceUrl?: string;
  /** Optional URL template for downloads. */
  downloadUrl?: string;
  /** Optional URL template for uploads. */
  uploadUrl?: string;
  /** Authenticated username when provided by the server. */
  username?: string;
  [key: string]: unknown;
}

/** Recursively mark object properties and array elements as readonly. */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

/** Immutable snapshot returned by {@link MaskedEmailService.getSession}. */
export type ReadonlySession = DeepReadonly<Session>;
