import { vi, describe, it, expect, afterEach } from 'vitest';
import axios from 'axios';
import { sessionFixture } from '../__fixtures__/session.fixture';
import { API_HOSTNAME } from '../constants';
import { getSession } from '../lib/session';
import { Session } from '../types/session';

vi.mock('axios');

describe('getSession', () => {
  const mockAuthToken = 'mockAuthToken';
  const mockHostname = 'mock.example.com';
  const mockSessionResponse: Session = {
    ...sessionFixture,
    fmAuthToken: mockAuthToken
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully get session with provided token and default hostname', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: mockSessionResponse });

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
    vi.mocked(axios.get).mockResolvedValue({ data: mockSessionResponse });

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

  it('should reject with an error if the request received an error response', async () => {
    const mockErrorResponse = {
      status: 401,
      statusText: 'Unauthorized',
      data: 'Invalid token'
    };

    vi.mocked(axios.get).mockRejectedValue({
      response: mockErrorResponse
    });

    await expect(getSession(mockAuthToken, mockHostname)).rejects.toThrow(
      `getting a session failed with status code ${mockErrorResponse.status}: ${mockErrorResponse.statusText}. ${mockErrorResponse.data}`
    );
  });

  it('should reject with an error if the request was made but no response was received', async () => {
    const mockErrorRequest = {
      url: `https://${mockHostname}/jmap/session`,
      method: 'GET'
    };

    vi.mocked(axios.get).mockRejectedValue({
      request: mockErrorRequest,
      message: 'Network error'
    });

    await expect(getSession(mockAuthToken, mockHostname)).rejects.toThrow(
      'getting a session request was made, but no response was received. Error message: Network error'
    );
  });

  it('should reject with an error if an error occurred while fetching the JMAP session without request and response', async () => {
    vi.mocked(axios.get).mockRejectedValue({
      message: 'Unexpected error'
    });

    await expect(getSession(mockAuthToken, mockHostname)).rejects.toThrow(
      'An error occurred while getting a session. Error message: Unexpected error'
    );
  });
});
