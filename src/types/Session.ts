/**
 * Fastmail JMAP session object
 */
export interface Session {
  state: string;
  apiUrl: string;
  capabilities: {
    'urn:ietf:params:jmap:core': {
      maxConcurrentUpload: number;
      maxConcurrentRequests: number;
      maxSizeRequest: number;
      maxObjectsInGet: number;
      maxCallsInRequest: number;
      maxSizeUpload: number;
      maxObjectsInSet: number;
      collationAlgorithms: string[];
    };
    'https://www.fastmail.com/dev/maskedemail': Record<string, unknown>;
  };
  accounts: {
    [key: string]: {
      name: string;
      isPersonal: boolean;
      userId: string;
      accountCapabilities: {
        'urn:ietf:params:jmap:core': Record<string, unknown>;
        'https://www.fastmail.com/dev/maskedemail': Record<string, unknown>;
      };
      isReadOnly: boolean;
    };
  };
  eventSourceUrl: string;
  downloadUrl: string;
  uploadUrl: string;
  username: string;
  primaryAccounts: {
    [key: string]: string;
  };
}
