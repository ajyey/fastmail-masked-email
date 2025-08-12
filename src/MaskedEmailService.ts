import axios, { AxiosError, AxiosResponse } from 'axios';
import debug from 'debug';

import {
  Action,
  API_HOSTNAME,
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from './constants';
import { InvalidArgumentError } from './error/invalidArgumentError';
import { JmapGetResponse, JmapRequest, JmapSetResponse } from './types/jmap';
import { MaskedEmail, MaskedEmailState } from './types/maskedEmail';
import { CreateOptions, Options } from './types/options';
import { GetResponseData } from './types/response';

/**
 * MaskedEmailService - A comprehensive service for managing Fastmail masked emails
 * Provides methods for creating, retrieving, updating, and deleting masked email addresses
 */
export class MaskedEmailService {
  private session: any = null;
  private debugLogger = debug('MaskedEmailService:debug');
  private errorLogger = debug('MaskedEmailService:error');

  /**
   * Creates a new MaskedEmailService instance
   * @param token - Optional Fastmail API token for authentication
   * @param hostname - Optional Fastmail API hostname; defaults to api.fastmail.com
   */
  constructor(
    private token?: string,
    private hostname?: string
  ) {
    this.token = token || process.env.JMAP_TOKEN;
    this.hostname = hostname || process.env.JMAP_HOSTNAME || API_HOSTNAME;
  }

  /**
   * Initialize the service by getting a session from the JMAP server
   * @returns Promise that resolves when the session is established
   * @throws Error if no auth token is provided
   */
  async initialize(): Promise<void> {
    if (!this.token) {
      throw new Error(
        'No auth token provided and JMAP_TOKEN environment variable is not set. Please provide a token.'
      );
    }

    const authUrl = `https://${this.hostname}/jmap/session`;
    const headers = this.buildHeaders(this.token);

    try {
      const response: AxiosResponse = await axios.get(authUrl, { headers });
      this.session = response.data;
      this.debugLogger('Session initialized: %o', JSON.stringify(this.session));
    } catch (error) {
      return this.handleAxiosError(error as AxiosError, Action.SESSION);
    }
  }

  public getSession(): Promise<any> {
    this.ensureInitialized();
    return this.session;
  }

  /**
   * Creates a new masked email address
   * @param options - The {@link CreateOptions|options} for creating the masked email
   * @throws {@link InvalidArgumentError} if no session is provided
   */
  async createEmail(options: CreateOptions = {}): Promise<MaskedEmail> {
    this.ensureInitialized();

    const { apiUrl, accountId } = this.parseSession();
    const headers = this.buildHeaders(this.token!);
    const state: MaskedEmailState = options.state || 'enabled';

    const requestBody: JmapRequest = {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [
        [
          MASKED_EMAIL_CALLS.set,
          {
            accountId,
            create: {
              ['0']: {
                ...options,
                state
              }
            }
          },
          'a'
        ]
      ]
    };

    this.debugLogger(
      'createEmail() request body: %o',
      JSON.stringify(requestBody)
    );

    try {
      const response = await axios.post(apiUrl, requestBody, { headers });
      this.debugLogger(
        'createEmail() response: %o',
        JSON.stringify(response.data)
      );

      const { data }: { data: JmapSetResponse } = response;
      return {
        ...data.methodResponses[0][1].created['0'],
        state
      };
    } catch (error) {
      return this.handleAxiosError(error as AxiosError, Action.CREATE);
    }
  }

  /**
   * Retrieves all masked emails
   * @throws {@link InvalidArgumentError} if no session is provided
   * @returns A list of all {@link MaskedEmail} objects
   */
  async getAllEmails(): Promise<MaskedEmail[]> {
    this.ensureInitialized();

    const { apiUrl, accountId } = this.parseSession();
    const headers = this.buildHeaders(this.token!);

    const body: JmapRequest = {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: null }, 'a']]
    };

    this.debugLogger('getAllEmails() body: %o', JSON.stringify(body));

    try {
      const response: AxiosResponse = await axios.post(apiUrl, body, {
        headers
      });
      this.debugLogger(
        'getAllEmails() response: %o',
        JSON.stringify(response.data)
      );

      const jmapResponse: JmapGetResponse = response.data;
      const methodResponse: GetResponseData =
        jmapResponse.methodResponses[0][1];
      return methodResponse.list;
    } catch (error) {
      return this.handleAxiosError(error as AxiosError, Action.LIST);
    }
  }

  /**
   * Get a masked email by id
   * @param id - The id of the masked email address.
   * @returns A {@link MaskedEmail} object
   * @throws {@link InvalidArgumentError} if no session is provided or no id is provided
   */
  async getEmailById(id: string | undefined): Promise<MaskedEmail> {
    this.ensureInitialized();

    if (!id) {
      return Promise.reject(new InvalidArgumentError('No id provided'));
    }

    const { apiUrl, accountId } = this.parseSession();
    const headers = this.buildHeaders(this.token!);

    const body: JmapRequest = {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [[MASKED_EMAIL_CALLS.get, { accountId, ids: [id] }, 'a']]
    };

    try {
      const response: AxiosResponse = await axios.post(apiUrl, body, {
        headers
      });
      this.debugLogger('getEmailById() body: %o', JSON.stringify(body));

      const responseData: JmapGetResponse = response.data;
      this.debugLogger(
        'getEmailById() response %o',
        JSON.stringify(response.data)
      );

      if (this.maskedEmailNotFound(id, responseData)) {
        return Promise.reject(new Error(`No masked email found with id ${id}`));
      }

      return responseData.methodResponses[0][1].list[0];
    } catch (error) {
      return this.handleAxiosError(error as AxiosError, Action.GET_BY_ID);
    }
  }

  /**
   * Get a masked email by address
   * @param address - The address to retrieve
   * @returns  A {@link MaskedEmail} object
   */
  async getEmailByAddress(address: string): Promise<MaskedEmail[] | []> {
    try {
      const maskedEmails: MaskedEmail[] = await this.getAllEmails();
      return this.filterByAddress(address, maskedEmails);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Updates a masked email
   * @param id - The id of the masked email to update
   * @param options - The {@link Options} containing the fields to update
   * @throws {@link InvalidArgumentError} if no id is provided, no session is provided, or the {@link Options} are empty
   */
  async updateEmail(
    id: string | undefined,
    options: Options
  ): Promise<{ [key: string]: null }> {
    this.ensureInitialized();

    if (!id) {
      return Promise.reject(new InvalidArgumentError('No id provided'));
    }

    if (Object.keys(options).length === 0) {
      return Promise.reject(
        new InvalidArgumentError(
          'No options provided. Please provide at least one option to updateEmail.'
        )
      );
    }

    const validOptions: string[] = ['description', 'forDomain', 'state'];
    const invalidOptions: string[] = Object.keys(options).filter(
      (option: string) => !validOptions.includes(option)
    );

    if (invalidOptions.length > 0) {
      return Promise.reject(
        new InvalidArgumentError(
          `Invalid options provided: ${invalidOptions.join(', ')}`
        )
      );
    }

    const { apiUrl, accountId } = this.parseSession();
    const headers = this.buildHeaders(this.token!);

    const body: JmapRequest = {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [
        [
          MASKED_EMAIL_CALLS.set,
          { accountId, update: { [id]: { ...options } } },
          'a'
        ]
      ]
    };

    this.debugLogger('updateEmail() body: %o', JSON.stringify(body));

    try {
      const response = await axios.post(apiUrl, body, { headers });
      this.debugLogger(
        'updateEmail() response: %o',
        JSON.stringify(response.data)
      );

      const data: JmapSetResponse = await response.data;
      return data.methodResponses[0][1].updated;
    } catch (error) {
      return this.handleAxiosError(error as AxiosError, Action.UPDATE);
    }
  }

  /**
   * Deletes a masked email by setting the state to deleted
   * @param id - The id of the masked email to deleteEmail
   */
  async deleteEmail(id: string): Promise<{ [key: string]: null }> {
    return await this.updateEmail(id, { state: 'deleted' });
  }

  /**
   * Disables a masked email by setting the state to disabled
   * @param id - The id of the masked email to disableEmail
   */
  async disableEmail(id: string): Promise<{ [key: string]: null }> {
    return await this.updateEmail(id, { state: 'disabled' });
  }

  /**
   * Enables a masked email by setting the state to enabled
   * @param id - The id of the masked email to enableEmail
   */
  async enableEmail(id: string): Promise<{ [key: string]: null }> {
    return await this.updateEmail(id, { state: 'enabled' });
  }

  /**
   * Permanently deletes a masked email
   * @param id - The id of the masked email to permanently deleteEmail
   * @throws {@link InvalidArgumentError} if no id is provided or no session is provided
   */
  async permanentlyDeleteEmail(
    id: string | undefined
  ): Promise<{ [key: string]: null }> {
    this.ensureInitialized();

    if (!id) {
      return Promise.reject(new InvalidArgumentError('No id provided'));
    }

    const { apiUrl, accountId } = this.parseSession();
    const headers = this.buildHeaders(this.token!);

    const body: JmapRequest = {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [[MASKED_EMAIL_CALLS.set, { accountId, destroy: [id] }, 'a']]
    };

    this.debugLogger('permanentlyDeleteEmail() body: %o', JSON.stringify(body));

    try {
      const response = await axios.post(apiUrl, body, { headers });
      this.debugLogger(
        'permanentlyDeleteEmail() response: %o',
        JSON.stringify(response.data)
      );

      const data: JmapSetResponse = await response.data;

      // Check if the email was not destroyed
      if (data.methodResponses[0][1].notDestroyed) {
        const notDestroyedObj = data.methodResponses[0][1].notDestroyed[id];
        this.errorLogger(
          'permanentlyDeleteEmail() error: %o',
          JSON.stringify(notDestroyedObj)
        );
        return Promise.reject(new Error(notDestroyedObj.description));
      } else {
        return data.methodResponses[0][1].destroyed;
      }
    } catch (error) {
      return this.handleAxiosError(error as AxiosError, Action.DELETE);
    }
  }

  /**
   * Filter masked emails by state
   * @param state - The state to filter by
   * @param list - The list of masked emails (optional, will fetch all if not provided)
   * @returns Promise that resolves to a filtered {@link MaskedEmail} array
   */
  async filterByState(
    state: MaskedEmailState,
    list?: MaskedEmail[]
  ): Promise<MaskedEmail[]> {
    const emails = list || (await this.getAllEmails());
    return emails.filter((me) => me.state === state);
  }

  /**
   * Filter masked emails by domain
   * @param domain - The domain to filter by
   * @param list - The list of masked emails (optional, will fetch all if not provided)
   * @returns Promise that resolves to a filtered {@link MaskedEmail} array
   */
  async filterByForDomain(
    domain: string,
    list?: MaskedEmail[]
  ): Promise<MaskedEmail[]> {
    const emails = list || (await this.getAllEmails());
    return emails.filter((me: MaskedEmail) => me.forDomain === domain);
  }

  // Private utility methods

  private ensureInitialized(): void {
    if (!this.session) {
      throw new InvalidArgumentError(
        'Service not initialized. Call initialize() first.'
      );
    }
  }

  private parseSession() {
    const accountId = this.session.primaryAccounts[JMAP.CORE];
    const { apiUrl } = this.session;
    return {
      accountId,
      apiUrl
    };
  }

  /**
   * Builds headers for requests using the JMAP token
   * @param authToken - The JMAP authentication token
   */
  private buildHeaders(authToken: string) {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`
    };
  }

  private maskedEmailNotFound(id: string, response: JmapGetResponse): boolean {
    const notFoundIds = response.methodResponses[0][1].notFound;
    if (notFoundIds && notFoundIds.length > 0) {
      return notFoundIds.includes(id);
    }
    return false;
  }

  private filterByAddress(
    address: string,
    list: MaskedEmail[]
  ): MaskedEmail[] | [] {
    return list.filter((me: MaskedEmail) => me.email === address);
  }

  /**
   * Handles an axios error and returns a rejected promise with a formatted error message based on the type of error and action attempted.
   * @param error - The axios error
   * @param action - The action that was being performed when the error occurred
   */
  private async handleAxiosError(
    error: AxiosError,
    action: Action
  ): Promise<never> {
    if (error.response) {
      const errorMessage = `${action} failed with status code ${error.response.status}: ${error.response.statusText}. ${error.response.data}`;
      this.errorLogger('Error response from axios: %o', error.response);
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      const errorMessage = `${action} request was made, but no response was received. Error message: ${error.message}`;
      this.errorLogger('Error request: %o', error.request);
      return Promise.reject(new Error(errorMessage));
    } else {
      const errorMessage = `An error occurred while ${action.toLowerCase()}. Error message: ${error.message}`;
      this.errorLogger('Error: %o', error);
      return Promise.reject(new Error(errorMessage));
    }
  }
}
