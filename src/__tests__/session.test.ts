import axios from 'axios';

import { sessionFixture } from '../__fixtures__/session.fixture';
import { API_HOSTNAME } from '../constants';
import { getSession } from '../lib/session';
import { Session } from '../types/session';

jest.mock('axios');

describe('getSession', () => {
  const mockAuthToken = 'mockAuthToken';
  const mockHostname = 'mock.example.com';
  const mockSessionResponse: Session = {
    ...sessionFixture,
    fmAuthToken: mockAuthToken
  };

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should successfully get session with provided token and default hostname', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockSessionResponse });

    const result = await getSession(mockAuthToken);
    expect(axios.get).toHaveBeenCalledWith(
      `https://${API_HOSTNAME}/jmap/session`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAuthToken}`
        }
      }
    );
    expect(result).toEqual(mockSessionResponse);
  });

  it('should successfully get session with provided token and hostname', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: mockSessionResponse });

    const result = await getSession(mockAuthToken, mockHostname);
    expect(axios.get).toHaveBeenCalledWith(
      `https://${mockHostname}/jmap/session`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockAuthToken}`
        }
      }
    );
    expect(result).toEqual(mockSessionResponse);
  });

  it('should reject with an error if no token is provided and token env var is not set', async () => {
    await expect(getSession(undefined, API_HOSTNAME)).rejects.toThrow(
      'No auth token provided and JMAP_TOKEN environment variable is not set. Please provide a token.'
    );
  });
});
