export const sessionFixture = {
  capabilities: {
    'urn:ietf:params:jmap:core': {
      maxSizeRequest: 10000000,
      maxObjectsInGet: 4096,
      maxConcurrentRequests: 10,
      maxConcurrentUpload: 10,
      maxCallsInRequest: 50,
      collationAlgorithms: ['i;ascii-numeric', 'i;ascii-casemap', 'i;octet'],
      maxObjectsInSet: 4096,
      maxSizeUpload: 250000000
    },
    'https://www.fastmail.com/dev/maskedemail': {}
  },
  state: 'cyrus-68;p-bc40ede6f8',
  eventSourceUrl: 'https://api.fastmail.com/jmap/event/',
  downloadUrl:
    'https://www.fastmailusercontent.com/jmap/download/{accountId}/{blobId}/{name}?type={type}',
  apiUrl: 'https://api.fastmail.com/jmap/api/',
  accounts: {
    yourAccountId: {
      name: 'yourname@fastmail.com',
      isPersonal: true,
      isReadOnly: false,
      userId: 'user-1234567890',
      accountCapabilities: {
        'https://www.fastmail.com/dev/maskedemail': {},
        'urn:ietf:params:jmap:core': {}
      },
      isArchiveUser: false
    }
  },
  uploadUrl: 'https://api.fastmail.com/jmap/upload/{accountId}/',
  username: 'yourname@fastmail.com',
  primaryAccounts: {
    'urn:ietf:params:jmap:core': 'yourAccountId',
    'https://www.fastmail.com/dev/maskedemail': 'yourAccountId'
  }
};
