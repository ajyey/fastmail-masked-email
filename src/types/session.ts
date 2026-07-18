/**
 * Fastmail JMAP session object
 */
export interface SessionAccount {
  name: string;
  isPersonal: boolean;
  userId: string;
  accountCapabilities: Record<string, Record<string, unknown>>;
  isReadOnly: boolean;
  [key: string]: unknown;
}

export interface Session {
  state: string;
  apiUrl: string;
  capabilities: Record<string, Record<string, unknown>>;
  accounts: Record<string, SessionAccount>;
  primaryAccounts: Record<string, string>;
  eventSourceUrl?: string;
  downloadUrl?: string;
  uploadUrl?: string;
  username?: string;
  [key: string]: unknown;
}

export type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type ReadonlySession = DeepReadonly<Session>;
