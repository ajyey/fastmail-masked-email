import ky, {
  isHTTPError,
  type KyInstance,
  type Options,
  type ResponsePromise
} from 'ky';

import {
  API_HOSTNAME,
  JMAP,
  MASKED_EMAIL_CALLS,
  MASKED_EMAIL_CAPABILITY
} from './constants.js';
import { InvalidArgumentError } from './error/invalidArgumentError.js';
import { InvalidCredentialsError } from './error/invalidCredentialsError.js';
import { JmapMethodError } from './error/jmapMethodError.js';
import { JmapSetError } from './error/jmapSetError.js';
import { MaskedEmailNotFoundError } from './error/maskedEmailNotFoundError.js';
import { ServiceNotInitializedError } from './error/serviceNotInitializedError.js';
import { TransportError } from './error/transportError.js';
import { UnsupportedAccountError } from './error/unsupportedAccountError.js';
import type {
  Invocation,
  JmapMethodErrorData,
  JmapRequest,
  JmapResponse
} from './types/jmap.js';
import type { MaskedEmail, MaskedEmailState } from './types/maskedEmail.js';
import type {
  CreateOptions,
  MaskedEmailServiceOptions,
  UpdateOptions
} from './types/options.js';
import type {
  GetResponseData,
  SetErrorData,
  SetResponseData
} from './types/response.js';
import type {
  ReadonlySession,
  Session,
  SessionAccount
} from './types/session.js';

const CREATE_FIELDS = new Set([
  'description',
  'emailPrefix',
  'forDomain',
  'state',
  'url'
]);
const UPDATE_FIELDS = new Set(['description', 'forDomain', 'state', 'url']);
const CREATE_STATES = new Set(['enabled', 'disabled', 'pending']);
const UPDATE_STATES = new Set(['enabled', 'disabled', 'deleted']);

type JmapArguments = Record<string, unknown>;

/** A service for managing Fastmail masked email addresses. */
export class MaskedEmailService {
  private readonly token?: string;
  private readonly sessionUrl: string;
  private readonly requestedAccountId?: string;
  private readonly timeout?: number | false;
  private readonly signal?: AbortSignal;
  private readonly httpClient: KyInstance;
  private readonly usesDefaultHttpClient: boolean;
  private session: Session | null = null;
  private accountId: string | null = null;
  private initialization: Promise<void> | null = null;
  private callSequence = 0;

  constructor(options?: MaskedEmailServiceOptions);
  /** @deprecated Pass a {@link MaskedEmailServiceOptions} object instead. */
  constructor(token?: string, hostname?: string);
  constructor(
    optionsOrToken: MaskedEmailServiceOptions | string = {},
    legacyHostname?: string
  ) {
    const options =
      typeof optionsOrToken === 'string' || legacyHostname !== undefined
        ? {
            token:
              typeof optionsOrToken === 'string' ? optionsOrToken : undefined,
            hostname: legacyHostname
          }
        : optionsOrToken;

    this.token = options.token ?? process.env.JMAP_TOKEN;
    this.requestedAccountId = options.accountId;
    if (
      options.timeout !== undefined &&
      (!Number.isFinite(options.timeout) || options.timeout < 0)
    ) {
      throw new InvalidArgumentError('timeout must be a non-negative number');
    }
    this.timeout = options.timeout === 0 ? false : options.timeout;
    this.signal = options.signal;
    this.usesDefaultHttpClient = options.httpClient === undefined;
    this.httpClient = options.httpClient ?? ky;
    this.sessionUrl = this.resolveSessionUrl(
      options.sessionUrl,
      options.hostname ?? process.env.JMAP_HOSTNAME ?? API_HOSTNAME
    );
  }

  /** Fetch and validate the JMAP session used by subsequent calls. */
  async initialize(): Promise<void> {
    if (this.initialization) {
      return this.initialization;
    }

    this.initialization = this.initializeSession();
    try {
      await this.initialization;
    } finally {
      this.initialization = null;
    }
  }

  /** Return a snapshot of the active JMAP session. */
  getSession(): ReadonlySession {
    this.ensureInitialized();
    return structuredClone(this.session!) as ReadonlySession;
  }

  /** Create a masked email and retrieve the complete server-owned object. */
  async createEmail(options: CreateOptions = {}): Promise<MaskedEmail> {
    this.ensureWritable();
    const validatedOptions = this.validateCreateOptions(options);
    const state = validatedOptions.state ?? 'enabled';
    const response = await this.executeSet('creating a masked email', {
      accountId: this.accountId!,
      create: {
        '0': {
          ...validatedOptions,
          state
        }
      }
    });

    this.throwSetError(response.notCreated, '0', 'creating a masked email');
    const created = response.created?.['0'];
    if (!created?.id) {
      throw this.invalidResponse(
        'creating a masked email',
        'The JMAP response did not contain the created masked email ID.',
        response
      );
    }

    return this.getEmailById(created.id);
  }

  /** Retrieve every masked email in the selected account. */
  async getAllEmails(): Promise<MaskedEmail[]> {
    this.ensureInitialized();
    const response = await this.executeGet('listing masked emails', null);
    return response.list;
  }

  /** Retrieve one masked email by ID. */
  async getEmailById(id: string): Promise<MaskedEmail> {
    this.ensureInitialized();
    const validId = this.validateId(id);
    const response = await this.executeGet('getting a masked email by id', [
      validId
    ]);
    const email = response.list.find((candidate) => candidate.id === validId);

    if (!email) {
      throw new MaskedEmailNotFoundError(validId);
    }

    return email;
  }

  /** Find all masked email records with an exact address match. */
  async getEmailsByAddress(
    address: string,
    list?: readonly MaskedEmail[]
  ): Promise<MaskedEmail[]> {
    if (typeof address !== 'string' || address.trim().length === 0) {
      throw new InvalidArgumentError('No address provided');
    }

    const emails = list ?? (await this.getAllEmails());
    return emails.filter((email) => email.email === address);
  }

  /** Update mutable properties of a masked email. */
  async updateEmail(id: string, options: UpdateOptions): Promise<void> {
    this.ensureWritable();
    const validId = this.validateId(id);
    const validatedOptions = this.validateUpdateOptions(options);
    const response = await this.executeSet('updating a masked email', {
      accountId: this.accountId!,
      update: { [validId]: validatedOptions }
    });

    this.throwSetError(response.notUpdated, validId, 'updating a masked email');
    if (!response.updated || !(validId in response.updated)) {
      throw this.invalidResponse(
        'updating a masked email',
        `The JMAP response did not confirm that ${validId} was updated.`,
        response
      );
    }
  }

  async deleteEmail(id: string): Promise<void> {
    return this.updateEmail(id, { state: 'deleted' });
  }

  async disableEmail(id: string): Promise<void> {
    return this.updateEmail(id, { state: 'disabled' });
  }

  async enableEmail(id: string): Promise<void> {
    return this.updateEmail(id, { state: 'enabled' });
  }

  /** Permanently destroy an eligible masked email. */
  async permanentlyDeleteEmail(id: string): Promise<void> {
    this.ensureWritable();
    const validId = this.validateId(id);
    const response = await this.executeSet('deleting a masked email', {
      accountId: this.accountId!,
      destroy: [validId]
    });

    this.throwSetError(
      response.notDestroyed,
      validId,
      'deleting a masked email'
    );
    if (!response.destroyed?.includes(validId)) {
      throw this.invalidResponse(
        'deleting a masked email',
        `The JMAP response did not confirm that ${validId} was destroyed.`,
        response
      );
    }
  }

  async filterByState(
    state: MaskedEmailState,
    list?: readonly MaskedEmail[]
  ): Promise<MaskedEmail[]> {
    const emails = list ?? (await this.getAllEmails());
    return emails.filter((email) => email.state === state);
  }

  async filterByDomain(
    origin: string,
    list?: readonly MaskedEmail[]
  ): Promise<MaskedEmail[]> {
    const emails = list ?? (await this.getAllEmails());
    return emails.filter((email) => email.forDomain === origin);
  }

  private async initializeSession(): Promise<void> {
    if (!this.token?.trim()) {
      throw new InvalidCredentialsError(
        'No auth token provided and JMAP_TOKEN environment variable is not set. Please provide a token.'
      );
    }

    const data = await this.requestJson('getting a session', () =>
      this.httpClient.get(this.sessionUrl, {
        ...this.requestConfig(),
        headers: this.buildHeaders()
      })
    );

    const session = this.parseSession(data);
    const accountId = this.selectAccount(session);
    this.session = session;
    this.accountId = accountId;
  }

  private async executeGet(
    operation: string,
    ids: string[] | null
  ): Promise<GetResponseData> {
    const response = await this.execute(operation, MASKED_EMAIL_CALLS.get, {
      accountId: this.accountId!,
      ids
    });

    if (
      !this.isRecord(response) ||
      typeof response.accountId !== 'string' ||
      typeof response.state !== 'string' ||
      !Array.isArray(response.list) ||
      !response.list.every((email) => this.isMaskedEmail(email))
    ) {
      throw this.invalidResponse(
        operation,
        'The JMAP get response did not contain a list.',
        response
      );
    }

    if (
      response.notFound !== undefined &&
      response.notFound !== null &&
      (!Array.isArray(response.notFound) ||
        !response.notFound.every((id) => typeof id === 'string'))
    ) {
      throw this.invalidResponse(
        operation,
        'The JMAP get response contained an invalid notFound value.',
        response
      );
    }

    return response as unknown as GetResponseData;
  }

  private async executeSet(
    operation: string,
    args: JmapArguments
  ): Promise<SetResponseData<MaskedEmail>> {
    const response = await this.execute(
      operation,
      MASKED_EMAIL_CALLS.set,
      args
    );
    if (!this.isSetResponse(response)) {
      throw this.invalidResponse(
        operation,
        'The JMAP set response was not an object.',
        response
      );
    }
    return response as unknown as SetResponseData<MaskedEmail>;
  }

  private async execute(
    operation: string,
    methodName: string,
    args: JmapArguments
  ): Promise<unknown> {
    this.ensureInitialized();
    const callId = String(++this.callSequence);
    const body: JmapRequest = {
      using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
      methodCalls: [[methodName, args, callId]]
    };

    const data = await this.requestJson(operation, () =>
      this.httpClient.post(this.session!.apiUrl, {
        ...this.requestConfig(),
        headers: this.buildHeaders(),
        json: body
      })
    );

    if (!this.isRecord(data) || !Array.isArray(data.methodResponses)) {
      throw this.invalidResponse(
        operation,
        'The server returned an invalid JMAP response.',
        data,
        callId
      );
    }

    const invocation = (
      data as unknown as JmapResponse<unknown>
    ).methodResponses.find(
      (candidate): candidate is Invocation<unknown> =>
        Array.isArray(candidate) && candidate[2] === callId
    );

    if (!invocation) {
      throw this.invalidResponse(
        operation,
        `The JMAP response did not contain call ID ${callId}.`,
        data,
        callId
      );
    }

    const [responseMethod, responseData] = invocation;
    if (responseMethod === 'error') {
      const errorData = this.isRecord(responseData)
        ? (responseData as unknown as JmapMethodErrorData)
        : { type: 'unknown', description: 'Unknown JMAP method error' };
      throw new JmapMethodError(
        operation,
        typeof errorData.type === 'string' ? errorData.type : 'unknown',
        errorData.description ?? `JMAP ${operation} failed.`,
        callId,
        responseData
      );
    }

    if (responseMethod !== methodName) {
      throw this.invalidResponse(
        operation,
        `Expected ${methodName} but received ${responseMethod}.`,
        data,
        callId
      );
    }

    return responseData;
  }

  private parseSession(data: unknown): Session {
    if (!this.isRecord(data)) {
      throw this.invalidResponse(
        'getting a session',
        'The JMAP session was not an object.',
        data
      );
    }

    if (
      typeof data.state !== 'string' ||
      typeof data.apiUrl !== 'string' ||
      !this.isRecord(data.capabilities) ||
      !this.isRecord(data.accounts) ||
      !this.isRecord(data.primaryAccounts)
    ) {
      throw this.invalidResponse(
        'getting a session',
        'The JMAP session is missing required fields.',
        data
      );
    }

    try {
      const apiUrl = new URL(data.apiUrl);
      if (apiUrl.protocol !== 'https:') {
        throw new Error('JMAP API URL must use HTTPS.');
      }
    } catch {
      throw this.invalidResponse(
        'getting a session',
        'The JMAP session contains an invalid apiUrl.',
        data
      );
    }

    if (
      !(JMAP.CORE in data.capabilities) ||
      !(MASKED_EMAIL_CAPABILITY in data.capabilities)
    ) {
      throw new UnsupportedAccountError(
        'The JMAP session does not advertise the required JMAP capabilities.'
      );
    }

    if (
      !Object.values(data.accounts).every((account) =>
        this.isSessionAccount(account)
      )
    ) {
      throw this.invalidResponse(
        'getting a session',
        'The JMAP session contains invalid account data.',
        data
      );
    }

    return data as unknown as Session;
  }

  private selectAccount(session: Session): string {
    if (this.requestedAccountId) {
      const account = session.accounts[this.requestedAccountId];
      if (!account || !this.supportsMaskedEmail(account)) {
        throw new UnsupportedAccountError(
          `Account ${this.requestedAccountId} does not support Fastmail masked email.`,
          this.requestedAccountId
        );
      }
      return this.requestedAccountId;
    }

    const primaryId = session.primaryAccounts[MASKED_EMAIL_CAPABILITY];
    if (primaryId && this.supportsMaskedEmail(session.accounts[primaryId])) {
      return primaryId;
    }

    const supportedAccount = Object.entries(session.accounts).find(
      ([, account]) => this.supportsMaskedEmail(account)
    );
    if (!supportedAccount) {
      throw new UnsupportedAccountError(
        'No account in the JMAP session supports Fastmail masked email.'
      );
    }
    return supportedAccount[0];
  }

  private supportsMaskedEmail(
    account: SessionAccount | undefined
  ): account is SessionAccount {
    return Boolean(
      account &&
        this.isRecord(account.accountCapabilities) &&
        MASKED_EMAIL_CAPABILITY in account.accountCapabilities
    );
  }

  private ensureInitialized(): void {
    if (!this.session || !this.accountId) {
      throw new ServiceNotInitializedError();
    }
  }

  private ensureWritable(): void {
    this.ensureInitialized();
    const account = this.session!.accounts[this.accountId!];
    if (account.isReadOnly) {
      throw new UnsupportedAccountError(
        `Account ${this.accountId} is read-only.`,
        this.accountId!
      );
    }
  }

  private buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    };
  }

  private requestConfig(): Options {
    const options: Options = {
      retry: 0,
      throwHttpErrors: true
    };
    if (this.timeout !== undefined) {
      options.timeout = this.timeout;
    } else if (this.usesDefaultHttpClient) {
      options.timeout = false;
    }

    let signal = this.signal;
    if (typeof this.timeout === 'number') {
      const timeoutSignal = AbortSignal.timeout(this.timeout);
      signal = signal
        ? AbortSignal.any([signal, timeoutSignal])
        : timeoutSignal;
    }
    if (signal) {
      options.signal = signal;
    }
    return options;
  }

  private async requestJson(
    operation: string,
    request: () => ResponsePromise
  ): Promise<unknown> {
    let response: Response;
    try {
      response = await request();
    } catch (error) {
      throw this.transportError(error, operation);
    }

    try {
      return await response.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw this.invalidResponse(
          operation,
          'The server returned invalid JSON.',
          undefined,
          undefined,
          error
        );
      }
      throw this.transportError(error, operation);
    }
  }

  private resolveSessionUrl(sessionUrl: string | undefined, hostname: string) {
    if (sessionUrl !== undefined) {
      try {
        const parsed = new URL(sessionUrl);
        if (parsed.protocol !== 'https:') {
          throw new Error('Session URL must use HTTPS.');
        }
        return parsed.toString();
      } catch {
        throw new InvalidArgumentError(
          'Invalid sessionUrl: expected an absolute HTTPS URL'
        );
      }
    }

    if (typeof hostname !== 'string' || hostname.trim() !== hostname) {
      throw new InvalidArgumentError(
        'hostname must be a host name without a scheme or path'
      );
    }
    try {
      const parsed = new URL(`https://${hostname}`);
      if (
        !hostname ||
        parsed.username ||
        parsed.password ||
        parsed.pathname !== '/' ||
        parsed.search ||
        parsed.hash ||
        parsed.host.toLowerCase() !== hostname.toLowerCase()
      ) {
        throw new Error('Invalid host authority.');
      }
      return `${parsed.origin}/jmap/session`;
    } catch {
      throw new InvalidArgumentError(
        'hostname must be a host name without a scheme or path'
      );
    }
  }

  private validateCreateOptions(options: CreateOptions): CreateOptions {
    const validated = this.validateOptions(
      options,
      CREATE_FIELDS,
      'createEmail'
    );
    if (
      validated.state !== undefined &&
      (typeof validated.state !== 'string' ||
        !CREATE_STATES.has(validated.state))
    ) {
      throw new InvalidArgumentError(
        `Invalid create state: ${String(validated.state)}`
      );
    }
    if (
      validated.emailPrefix !== undefined &&
      (typeof validated.emailPrefix !== 'string' ||
        !/^[a-z0-9_]{1,64}$/.test(validated.emailPrefix))
    ) {
      throw new InvalidArgumentError(
        'emailPrefix must contain 1-64 lowercase letters, digits, or underscores'
      );
    }
    this.validateMetadata(validated);
    return validated as CreateOptions;
  }

  private validateUpdateOptions(options: UpdateOptions): UpdateOptions {
    const validated = this.validateOptions(
      options,
      UPDATE_FIELDS,
      'updateEmail'
    );
    if (Object.keys(validated).length === 0) {
      throw new InvalidArgumentError(
        'No options provided. Please provide at least one option to updateEmail.'
      );
    }
    if (
      validated.state !== undefined &&
      (typeof validated.state !== 'string' ||
        !UPDATE_STATES.has(validated.state))
    ) {
      throw new InvalidArgumentError(
        `Invalid update state: ${String(validated.state)}`
      );
    }
    this.validateMetadata(validated);
    return validated as UpdateOptions;
  }

  private validateOptions(
    options: unknown,
    allowedFields: Set<string>,
    operation: string
  ): Record<string, unknown> {
    if (!this.isRecord(options)) {
      throw new InvalidArgumentError(`${operation} options must be an object`);
    }

    const invalidFields = Object.keys(options).filter(
      (field) => !allowedFields.has(field)
    );
    if (invalidFields.length > 0) {
      throw new InvalidArgumentError(
        `Invalid options provided: ${invalidFields.join(', ')}`
      );
    }

    return Object.fromEntries(
      Object.entries(options).filter(([, value]) => value !== undefined)
    );
  }

  private validateMetadata(options: Record<string, unknown>): void {
    if (
      options.forDomain !== undefined &&
      !this.isHttpOrigin(options.forDomain)
    ) {
      throw new InvalidArgumentError(
        'forDomain must be an HTTP(S) origin without a path, query, or fragment'
      );
    }
    if (
      options.url !== undefined &&
      options.url !== null &&
      !this.isAbsoluteUrl(options.url)
    ) {
      throw new InvalidArgumentError('url must be an absolute URL or null');
    }
    if (
      options.description !== undefined &&
      typeof options.description !== 'string'
    ) {
      throw new InvalidArgumentError('description must be a string');
    }
  }

  private validateId(id: unknown): string {
    if (typeof id !== 'string' || id.trim().length === 0) {
      throw new InvalidArgumentError('No id provided');
    }
    return id;
  }

  private throwSetError(
    errors: Record<string, SetErrorData> | null | undefined,
    affectedId: string,
    operation: string
  ): void {
    const error = errors?.[affectedId];
    if (!error) {
      return;
    }
    const type = typeof error.type === 'string' ? error.type : 'unknown';
    const description =
      typeof error.description === 'string'
        ? error.description
        : `${operation} failed with ${type}.`;
    throw new JmapSetError(
      operation,
      type,
      description,
      affectedId,
      typeof error.subType === 'string' ? error.subType : undefined,
      error
    );
  }

  private invalidResponse(
    operation: string,
    message: string,
    responseData: unknown,
    callId?: string,
    cause?: unknown
  ): JmapMethodError {
    return new JmapMethodError(
      operation,
      'invalidResponse',
      message,
      callId,
      responseData,
      { cause }
    );
  }

  private transportError(error: unknown, operation: string): Error {
    if (isHTTPError(error)) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        return new InvalidCredentialsError(
          `${operation} failed with status code ${status}.`,
          { cause: error, status }
        );
      }

      return new TransportError(
        operation,
        `${operation} failed with status code ${status}.`,
        status,
        error.data,
        { cause: error }
      );
    }

    return new TransportError(
      operation,
      `${operation} failed: ${error instanceof Error ? error.message : String(error)}`,
      undefined,
      undefined,
      { cause: error }
    );
  }

  private isHttpOrigin(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    try {
      const parsed = new URL(value);
      return (
        (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
        parsed.search === '' &&
        parsed.hash === '' &&
        value === parsed.origin
      );
    } catch {
      return false;
    }
  }

  private isAbsoluteUrl(value: unknown): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private isMaskedEmail(value: unknown): value is MaskedEmail {
    return (
      this.isRecord(value) &&
      typeof value.id === 'string' &&
      typeof value.email === 'string' &&
      (CREATE_STATES.has(String(value.state)) || value.state === 'deleted') &&
      typeof value.description === 'string' &&
      typeof value.forDomain === 'string' &&
      typeof value.createdAt === 'string' &&
      typeof value.createdBy === 'string' &&
      (typeof value.url === 'string' || value.url === null) &&
      (typeof value.lastMessageAt === 'string' || value.lastMessageAt === null)
    );
  }

  private isSessionAccount(value: unknown): value is SessionAccount {
    return (
      this.isRecord(value) &&
      typeof value.name === 'string' &&
      typeof value.isPersonal === 'boolean' &&
      typeof value.isReadOnly === 'boolean' &&
      (value.userId === undefined || typeof value.userId === 'string') &&
      this.isRecord(value.accountCapabilities)
    );
  }

  private isSetResponse(value: unknown): value is SetResponseData<MaskedEmail> {
    if (!this.isRecord(value) || typeof value.accountId !== 'string') {
      return false;
    }

    const recordGroups = [
      'created',
      'updated',
      'notCreated',
      'notUpdated',
      'notDestroyed'
    ];
    if (
      recordGroups.some(
        (group) =>
          value[group] !== undefined &&
          value[group] !== null &&
          !this.isRecord(value[group])
      )
    ) {
      return false;
    }

    for (const group of ['notCreated', 'notUpdated', 'notDestroyed']) {
      const errors = value[group];
      if (
        this.isRecord(errors) &&
        !Object.values(errors).every((error) => this.isRecord(error))
      ) {
        return false;
      }
    }

    return (
      (value.destroyed === undefined ||
        value.destroyed === null ||
        (Array.isArray(value.destroyed) &&
          value.destroyed.every((id) => typeof id === 'string'))) &&
      (value.created === undefined ||
        value.created === null ||
        Object.values(value.created).every(
          (created) => this.isRecord(created) && typeof created.id === 'string'
        )) &&
      (value.updated === undefined ||
        value.updated === null ||
        Object.values(value.updated).every(
          (updated) => updated === null || this.isRecord(updated)
        ))
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
