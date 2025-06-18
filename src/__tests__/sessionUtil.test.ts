import { sessionFixture } from '../__fixtures__/session.fixture';
import { buildHeaders, parseSession } from '../util/sessionUtil';
import { describe, it, expect } from 'vitest';


describe('parseSession', () => {
  it('should parse the session object and return accountId, apiUrl, and authToken', () => {
    const session = {
      ...sessionFixture,
      fmAuthToken: 'auth-token-123'
    };

    const parsedResult = {
      accountId: 'yourAccountId',
      apiUrl: 'https://api.fastmail.com/jmap/api/',
      authToken: session.fmAuthToken
    };

    expect(parseSession(session)).toStrictEqual(parsedResult);
  });
});

describe('buildHeaders', () => {
  it('should build headers for requests using the JMAP token', () => {
    const authToken = 'auth-token-123';
    const expectedResult = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer auth-token-123'
    };

    expect(buildHeaders(authToken)).toStrictEqual(expectedResult);
  });
});
