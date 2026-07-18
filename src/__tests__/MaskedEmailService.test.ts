import axios, { AxiosError, type AxiosInstance } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { maskedEmailFixture } from '../__fixtures__/maskedEmail.fixture.js';
import { permanentDeleteFailResponseFixture } from '../__fixtures__/responses/permanentDeleteFailResponse.fixture.js';
import { permanentDeleteSuccessResponseFixture } from '../__fixtures__/responses/permanentDeleteSuccessResponse.fixture.js';
import { sessionFixture } from '../__fixtures__/session.fixture.js';
import { JMAP, MASKED_EMAIL_CAPABILITY } from '../constants.js';
import {
  InvalidArgumentError,
  InvalidCredentialsError,
  JmapMethodError,
  JmapSetError,
  MaskedEmailNotFoundError,
  MaskedEmailService,
  ServiceNotInitializedError,
  TransportError,
  UnsupportedAccountError
} from '../index.js';
import type { MaskedEmail } from '../types/maskedEmail.js';
import type { Session } from '../types/session.js';

function response(method: string, data: unknown, callId = '1') {
  const defaults =
    method === 'MaskedEmail/get'
      ? { accountId: 'masked-account', notFound: null, state: 'state-1' }
      : method === 'MaskedEmail/set'
        ? { accountId: 'masked-account' }
        : {};
  const methodData =
    typeof data === 'object' && data !== null && !Array.isArray(data)
      ? { ...defaults, ...data }
      : data;
  return {
    data: {
      sessionState: 'session-state-1',
      methodResponses: [[method, methodData, callId]]
    }
  };
}

describe('MaskedEmailService', () => {
  let get: ReturnType<typeof vi.fn>;
  let post: ReturnType<typeof vi.fn>;
  let httpClient: AxiosInstance;
  let service: MaskedEmailService;

  beforeEach(() => {
    get = vi.fn();
    post = vi.fn();
    httpClient = { get, post } as unknown as AxiosInstance;
    service = new MaskedEmailService({
      token: 'test-token',
      hostname: 'api.example.com',
      httpClient
    });
    get.mockResolvedValue({ data: structuredClone(sessionFixture) });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  async function initialize() {
    await service.initialize();
  }

  describe('initialization', () => {
    it('fetches and snapshots a validated session', async () => {
      await initialize();

      expect(get).toHaveBeenCalledWith(
        'https://api.example.com/jmap/session',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token'
          }
        })
      );
      const snapshot = service.getSession();
      expect(snapshot).toEqual(sessionFixture);
      (snapshot as unknown as Session).accounts['masked-account'].name =
        'changed';
      expect(service.getSession().accounts['masked-account'].name).toBe(
        'test@example.com'
      );
    });

    it('shares concurrent initialization', async () => {
      await Promise.all([service.initialize(), service.initialize()]);
      expect(get).toHaveBeenCalledTimes(1);
    });

    it('accepts a standard JMAP account without Fastmail userId', async () => {
      const session: Session = structuredClone(sessionFixture);
      delete session.accounts['masked-account'].userId;
      get.mockResolvedValue({ data: session });

      await expect(service.initialize()).resolves.toBeUndefined();
      expect(
        service.getSession().accounts['masked-account'].userId
      ).toBeUndefined();
    });

    it('supports the deprecated positional constructor', async () => {
      vi.stubEnv('JMAP_TOKEN', 'env-token');
      const positional = new MaskedEmailService('token', 'api.example.com');
      expect(positional).toBeInstanceOf(MaskedEmailService);
    });

    it('supports an environment token with a positional hostname', async () => {
      vi.stubEnv('JMAP_TOKEN', 'env-token');
      const axiosGet = vi
        .spyOn(axios, 'get')
        .mockResolvedValue({ data: structuredClone(sessionFixture) });
      const positional = new MaskedEmailService(
        undefined,
        'legacy.example.com'
      );
      await positional.initialize();
      expect(axiosGet).toHaveBeenCalledWith(
        'https://legacy.example.com/jmap/session',
        expect.any(Object)
      );
    });

    it('reads credentials and hostname from the environment', async () => {
      vi.stubEnv('JMAP_TOKEN', 'env-token');
      vi.stubEnv('JMAP_HOSTNAME', 'env.example.com');
      const fromEnvironment = new MaskedEmailService({ httpClient });
      await fromEnvironment.initialize();
      expect(get).toHaveBeenCalledWith(
        'https://env.example.com/jmap/session',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer env-token'
          })
        })
      );
    });

    it('accepts an explicit HTTPS session URL', async () => {
      const custom = new MaskedEmailService({
        token: 'token',
        sessionUrl: 'https://jmap.example.com/session',
        httpClient
      });
      await custom.initialize();
      expect(get).toHaveBeenCalledWith(
        'https://jmap.example.com/session',
        expect.any(Object)
      );
    });

    it.each([
      [{ token: 'token', hostname: 'https://api.example.com' }, 'hostname'],
      [
        { token: 'token', hostname: 'api.fastmail.com@attacker.example' },
        'hostname'
      ],
      [{ token: 'token', hostname: ' api.example.com' }, 'hostname'],
      [
        { token: 'token', sessionUrl: 'http://api.example.com/session' },
        'sessionUrl'
      ]
    ])('rejects invalid connection configuration', (options, message) => {
      expect(() => new MaskedEmailService({ ...options, httpClient })).toThrow(
        message
      );
    });

    it('rejects missing credentials', async () => {
      vi.stubEnv('JMAP_TOKEN', '');
      const missingToken = new MaskedEmailService({
        token: '',
        httpClient
      });
      await expect(missingToken.initialize()).rejects.toBeInstanceOf(
        InvalidCredentialsError
      );
    });

    it.each([
      null,
      {},
      { ...sessionFixture, apiUrl: 'not a URL' },
      { ...sessionFixture, apiUrl: 'http://api.example.com/jmap/api/' },
      {
        ...sessionFixture,
        capabilities: { [JMAP.CORE]: {} }
      },
      {
        ...sessionFixture,
        capabilities: { [MASKED_EMAIL_CAPABILITY]: {} }
      },
      {
        ...sessionFixture,
        accounts: {
          'masked-account': {
            ...sessionFixture.accounts['masked-account'],
            isReadOnly: 'no'
          }
        }
      }
    ])('rejects malformed or unsupported sessions', async (session) => {
      get.mockResolvedValue({ data: session });
      await expect(service.initialize()).rejects.toBeInstanceOf(Error);
    });

    it('prefers the masked-email primary account over core', async () => {
      const session: Session = structuredClone(sessionFixture);
      session.accounts['core-account'] = {
        ...session.accounts['masked-account'],
        accountCapabilities: { [JMAP.CORE]: {} }
      };
      session.primaryAccounts[JMAP.CORE] = 'core-account';
      get.mockResolvedValue({ data: session });
      post.mockResolvedValue(
        response('MaskedEmail/get', { accountId: 'masked-account', list: [] })
      );

      await initialize();
      await service.getAllEmails();
      expect(post.mock.calls[0][1].methodCalls[0][1].accountId).toBe(
        'masked-account'
      );
    });

    it('falls back to an account advertising masked-email support', async () => {
      const session: Session = structuredClone(sessionFixture);
      session.primaryAccounts = {};
      get.mockResolvedValue({ data: session });
      post.mockResolvedValue(response('MaskedEmail/get', { list: [] }));
      await initialize();
      await service.getAllEmails();
      expect(post.mock.calls[0][1].methodCalls[0][1].accountId).toBe(
        'masked-account'
      );
    });

    it('validates an explicitly selected account', async () => {
      const selected = new MaskedEmailService({
        token: 'token',
        accountId: 'missing',
        httpClient
      });
      await expect(selected.initialize()).rejects.toBeInstanceOf(
        UnsupportedAccountError
      );
    });

    it('uses an explicitly selected supported account', async () => {
      const selected = new MaskedEmailService({
        token: 'token',
        accountId: 'masked-account',
        httpClient
      });
      await expect(selected.initialize()).resolves.toBeUndefined();
    });

    it('rejects a session with no supported account', async () => {
      const session: Session = structuredClone(sessionFixture);
      session.primaryAccounts = {};
      session.accounts['masked-account'].accountCapabilities = {
        [JMAP.CORE]: {}
      };
      get.mockResolvedValue({ data: session });
      await expect(service.initialize()).rejects.toBeInstanceOf(
        UnsupportedAccountError
      );
    });
  });

  describe('JMAP get operations', () => {
    beforeEach(async () => initialize());

    it('requires initialization', async () => {
      const uninitialized = new MaskedEmailService({ token: 'token' });
      expect(() => uninitialized.getSession()).toThrow(
        ServiceNotInitializedError
      );
      await expect(uninitialized.getAllEmails()).rejects.toBeInstanceOf(
        ServiceNotInitializedError
      );
    });

    it('retrieves all masked emails with a complete invocation', async () => {
      post.mockResolvedValue(
        response('MaskedEmail/get', {
          accountId: 'masked-account',
          list: [maskedEmailFixture],
          notFound: null
        })
      );

      await expect(service.getAllEmails()).resolves.toEqual([
        maskedEmailFixture
      ]);
      expect(post).toHaveBeenCalledWith(
        sessionFixture.apiUrl,
        {
          using: [JMAP.CORE, MASKED_EMAIL_CAPABILITY],
          methodCalls: [
            ['MaskedEmail/get', { accountId: 'masked-account', ids: null }, '1']
          ]
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token'
          })
        })
      );
    });

    it('retrieves one masked email by ID', async () => {
      post.mockResolvedValue(
        response('MaskedEmail/get', {
          list: [maskedEmailFixture],
          notFound: []
        })
      );
      await expect(
        service.getEmailById(maskedEmailFixture.id)
      ).resolves.toEqual(maskedEmailFixture);
    });

    it('reports a missing masked email', async () => {
      post.mockResolvedValue(
        response('MaskedEmail/get', { list: [], notFound: ['missing'] })
      );
      await expect(service.getEmailById('missing')).rejects.toBeInstanceOf(
        MaskedEmailNotFoundError
      );
    });

    it('rejects an empty ID', async () => {
      await expect(service.getEmailById(' ')).rejects.toBeInstanceOf(
        InvalidArgumentError
      );
    });

    it.each([
      [{}, 'list'],
      [{ list: [], notFound: 'bad' }, 'notFound'],
      [{ list: [], notFound: [1] }, 'notFound'],
      [{ list: [{}] }, 'list']
    ])('rejects malformed get data', async (data, message) => {
      post.mockResolvedValue(response('MaskedEmail/get', data));
      await expect(service.getAllEmails()).rejects.toThrow(message);
    });

    it('preserves JMAP method errors', async () => {
      post.mockResolvedValue(
        response('error', {
          type: 'accountNotSupportedByMethod',
          description: 'Unsupported account'
        })
      );
      await expect(service.getAllEmails()).rejects.toMatchObject({
        name: 'JmapMethodError',
        type: 'accountNotSupportedByMethod',
        callId: '1'
      });
    });

    it('handles malformed JMAP method error data', async () => {
      post.mockResolvedValue(response('error', null));
      await expect(service.getAllEmails()).rejects.toMatchObject({
        type: 'unknown',
        message: 'Unknown JMAP method error'
      });

      post.mockResolvedValue(response('error', { type: 42 }, '2'));
      await expect(service.getAllEmails()).rejects.toMatchObject({
        type: 'unknown',
        message: 'JMAP listing masked emails failed.'
      });
    });

    it.each([
      [{ data: {} }, 'invalid JMAP response'],
      [response('MaskedEmail/get', { list: [] }, 'wrong'), 'call ID'],
      [response('MaskedEmail/set', { list: [] }), 'Expected MaskedEmail/get']
    ])('rejects malformed invocations', async (result, message) => {
      post.mockResolvedValue(result);
      await expect(service.getAllEmails()).rejects.toThrow(message);
    });
  });

  describe('create and update operations', () => {
    beforeEach(async () => initialize());

    it('creates then retrieves a server-authoritative record', async () => {
      post
        .mockResolvedValueOnce(
          response('MaskedEmail/set', {
            accountId: 'masked-account',
            created: { '0': { id: maskedEmailFixture.id } }
          })
        )
        .mockResolvedValueOnce(
          response(
            'MaskedEmail/get',
            { list: [maskedEmailFixture], notFound: [] },
            '2'
          )
        );

      await expect(
        service.createEmail({
          state: 'pending',
          forDomain: 'https://example.com',
          description: 'Test account',
          emailPrefix: 'test_1',
          url: 'https://example.com/credentials/1'
        })
      ).resolves.toEqual(maskedEmailFixture);
      expect(post.mock.calls[0][1].methodCalls[0]).toEqual([
        'MaskedEmail/set',
        {
          accountId: 'masked-account',
          create: {
            '0': {
              state: 'pending',
              forDomain: 'https://example.com',
              description: 'Test account',
              emailPrefix: 'test_1',
              url: 'https://example.com/credentials/1'
            }
          }
        },
        '1'
      ]);
    });

    it('defaults newly created addresses to enabled', async () => {
      post
        .mockResolvedValueOnce(
          response('MaskedEmail/set', {
            created: { '0': { id: maskedEmailFixture.id } }
          })
        )
        .mockResolvedValueOnce(
          response('MaskedEmail/get', { list: [maskedEmailFixture] }, '2')
        );
      await service.createEmail();
      expect(post.mock.calls[0][1].methodCalls[0][1].create['0'].state).toBe(
        'enabled'
      );
    });

    it('surfaces notCreated errors', async () => {
      post.mockResolvedValue(
        response('MaskedEmail/set', {
          notCreated: {
            '0': { type: 'rateLimit', description: 'Try later' }
          }
        })
      );
      await expect(service.createEmail()).rejects.toBeInstanceOf(JmapSetError);
    });

    it('requires a created ID', async () => {
      post.mockResolvedValue(response('MaskedEmail/set', { created: {} }));
      await expect(service.createEmail()).rejects.toBeInstanceOf(
        JmapMethodError
      );
    });

    it('rejects a non-object set response', async () => {
      post.mockResolvedValue(response('MaskedEmail/set', []));
      await expect(service.createEmail()).rejects.toBeInstanceOf(
        JmapMethodError
      );
    });

    it.each([
      { updated: 'masked-email-1' },
      { destroyed: 'masked-email-1' },
      { notUpdated: { 'masked-email-1': 'bad' } }
    ])('rejects malformed set groups', async (setResponse) => {
      post.mockResolvedValue(response('MaskedEmail/set', setResponse));
      await expect(
        service.updateEmail(maskedEmailFixture.id, { description: 'Updated' })
      ).rejects.toBeInstanceOf(JmapMethodError);
    });

    it('updates a record only after server confirmation', async () => {
      post.mockResolvedValue(
        response('MaskedEmail/set', {
          updated: { [maskedEmailFixture.id]: null }
        })
      );
      await expect(
        service.updateEmail(maskedEmailFixture.id, {
          description: 'Updated',
          url: null
        })
      ).resolves.toBeUndefined();
    });

    it('surfaces notUpdated errors', async () => {
      post.mockResolvedValue(
        response('MaskedEmail/set', {
          notUpdated: {
            [maskedEmailFixture.id]: {
              type: 'invalidProperties',
              properties: ['description']
            }
          }
        })
      );
      await expect(
        service.updateEmail(maskedEmailFixture.id, { description: 'Updated' })
      ).rejects.toMatchObject({
        name: 'JmapSetError',
        affectedId: maskedEmailFixture.id,
        type: 'invalidProperties'
      });
    });

    it('rejects an update not confirmed by the server', async () => {
      post.mockResolvedValue(response('MaskedEmail/set', { updated: {} }));
      await expect(
        service.updateEmail(maskedEmailFixture.id, { description: 'Updated' })
      ).rejects.toBeInstanceOf(JmapMethodError);
    });

    it.each([
      [null, 'options must be an object'],
      [{}, 'No options provided'],
      [{ description: undefined }, 'No options provided'],
      [{ unknown: true }, 'Invalid options'],
      [{ state: 'pending' }, 'Invalid update state'],
      [{ forDomain: 'example.com' }, 'forDomain'],
      [{ forDomain: 123 }, 'forDomain'],
      [{ url: 'not-a-url' }, 'url'],
      [{ url: 123 }, 'url'],
      [{ description: 1 }, 'description']
    ])('validates update options', async (options, message) => {
      await expect(
        service.updateEmail(maskedEmailFixture.id, options as never)
      ).rejects.toThrow(message);
    });

    it.each([
      [{ state: 'deleted' }, 'Invalid create state'],
      [{ emailPrefix: 'UPPERCASE' }, 'emailPrefix'],
      [{ emailPrefix: 'a'.repeat(65) }, 'emailPrefix'],
      [{ forDomain: 'https://example.com/path' }, 'forDomain'],
      [{ forDomain: 'https://example.com/' }, 'forDomain'],
      [{ url: 'relative/path' }, 'url'],
      [{ extra: true }, 'Invalid options']
    ])('validates create options', async (options, message) => {
      await expect(service.createEmail(options as never)).rejects.toThrow(
        message
      );
    });

    it('rejects writes to a read-only account', async () => {
      const readonlySession: Session = structuredClone(sessionFixture);
      readonlySession.accounts['masked-account'].isReadOnly = true;
      const readonlyClient = {
        get: vi.fn().mockResolvedValue({ data: readonlySession }),
        post: vi.fn()
      } as unknown as AxiosInstance;
      const readonlyService = new MaskedEmailService({
        token: 'token',
        httpClient: readonlyClient
      });
      await readonlyService.initialize();
      await expect(readonlyService.createEmail()).rejects.toBeInstanceOf(
        UnsupportedAccountError
      );
    });
  });

  describe('state transitions and permanent deletion', () => {
    beforeEach(async () => initialize());

    it.each([
      ['enableEmail', 'enabled'],
      ['disableEmail', 'disabled'],
      ['deleteEmail', 'deleted']
    ] as const)('sends the correct state for %s', async (method, state) => {
      post.mockResolvedValue(
        response('MaskedEmail/set', {
          updated: { [maskedEmailFixture.id]: null }
        })
      );
      await service[method](maskedEmailFixture.id);
      expect(
        post.mock.calls[0][1].methodCalls[0][1].update[maskedEmailFixture.id]
      ).toEqual({ state });
    });

    it('permanently deletes using the real destroyed array shape', async () => {
      post.mockResolvedValue({ data: permanentDeleteSuccessResponseFixture });
      await expect(
        service.permanentlyDeleteEmail('masked-81873752')
      ).resolves.toBeUndefined();
    });

    it('surfaces a real notDestroyed response', async () => {
      post.mockResolvedValue({ data: permanentDeleteFailResponseFixture });
      await expect(
        service.permanentlyDeleteEmail('masked-81873752')
      ).rejects.toMatchObject({
        name: 'JmapSetError',
        type: 'forbidden',
        subType: 'addressInUse'
      });
    });

    it('requires destroy confirmation', async () => {
      post.mockResolvedValue(response('MaskedEmail/set', { destroyed: [] }));
      await expect(
        service.permanentlyDeleteEmail(maskedEmailFixture.id)
      ).rejects.toBeInstanceOf(JmapMethodError);
    });
  });

  describe('local filters', () => {
    const secondEmail: MaskedEmail = {
      ...maskedEmailFixture,
      id: 'masked-email-2',
      email: 'other@masked.example',
      state: 'disabled',
      forDomain: 'https://other.example'
    };

    it('filters a supplied list without initialization or requests', async () => {
      const uninitialized = new MaskedEmailService({ token: 'token' });
      const list = [maskedEmailFixture, secondEmail] as const;
      await expect(
        uninitialized.getEmailsByAddress(maskedEmailFixture.email, list)
      ).resolves.toEqual([maskedEmailFixture]);
      await expect(
        uninitialized.filterByState('disabled', list)
      ).resolves.toEqual([secondEmail]);
      await expect(
        uninitialized.filterByDomain('https://example.com', list)
      ).resolves.toEqual([maskedEmailFixture]);
    });

    it('fetches all records when no list is supplied', async () => {
      await initialize();
      post.mockResolvedValue(
        response('MaskedEmail/get', { list: [maskedEmailFixture] })
      );
      await expect(
        service.getEmailsByAddress(maskedEmailFixture.email)
      ).resolves.toEqual([maskedEmailFixture]);

      post.mockResolvedValue(
        response('MaskedEmail/get', { list: [maskedEmailFixture] }, '2')
      );
      await expect(service.filterByState('enabled')).resolves.toEqual([
        maskedEmailFixture
      ]);

      post.mockResolvedValue(
        response('MaskedEmail/get', { list: [maskedEmailFixture] }, '3')
      );
      await expect(
        service.filterByDomain('https://example.com')
      ).resolves.toEqual([maskedEmailFixture]);
    });

    it('validates the address', async () => {
      await expect(service.getEmailsByAddress(' ', [])).rejects.toBeInstanceOf(
        InvalidArgumentError
      );
    });
  });

  describe('transport errors', () => {
    it('maps authentication failures', async () => {
      get.mockRejectedValue(
        new AxiosError(
          'Unauthorized',
          'ERR_BAD_REQUEST',
          undefined,
          undefined,
          {
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config: { headers: {} } as never,
            data: { type: 'unauthorized' }
          }
        )
      );
      await expect(service.initialize()).rejects.toMatchObject({
        name: 'InvalidCredentialsError',
        status: 401
      });
    });

    it('preserves status and response data for HTTP errors', async () => {
      await initialize();
      post.mockRejectedValue(
        new AxiosError(
          'Unavailable',
          'ERR_BAD_RESPONSE',
          undefined,
          undefined,
          {
            status: 503,
            statusText: 'Unavailable',
            headers: {},
            config: { headers: {} } as never,
            data: { type: 'serverUnavailable' }
          }
        )
      );
      await expect(service.getAllEmails()).rejects.toMatchObject({
        name: 'TransportError',
        status: 503,
        responseData: { type: 'serverUnavailable' }
      });
    });

    it('wraps network and non-Error failures', async () => {
      await initialize();
      post.mockRejectedValueOnce(new AxiosError('Network Error'));
      await expect(service.getAllEmails()).rejects.toBeInstanceOf(
        TransportError
      );
      post.mockRejectedValueOnce('socket closed');
      await expect(service.getAllEmails()).rejects.toThrow('socket closed');
      post.mockRejectedValueOnce(new Error('connection reset'));
      await expect(service.getAllEmails()).rejects.toThrow('connection reset');
    });
  });
});
