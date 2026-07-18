<p align="center">
  <img src="logo.png" alt="fastmail-masked-email logo" />
</p>
<h1 align="center">fastmail-masked-email</h1>
<p align="center">Manage <a href="https://www.fastmail.help/hc/en-us/articles/4406536368911-Masked-Email">Fastmail Masked Email</a> addresses with Node.js.</p>

`fastmail-masked-email` is an ESM-only library for Node.js 22 or later. It
discovers the JMAP API and account from the authenticated Fastmail session,
then creates, reads, updates, filters, and deletes masked email addresses.

## Installation

```sh
npm install fastmail-masked-email
```

## Authentication

Create a [Fastmail API token](https://www.fastmail.help/hc/en-us/articles/5254602856719-API-tokens)
with the **Masked Email** scope. Pass it directly or set `JMAP_TOKEN` before
constructing the service:

```js
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService({
  token: process.env.FASTMAIL_TOKEN
});
```

With the library's environment variable names:

```js
const service = new MaskedEmailService(); // Reads JMAP_TOKEN and JMAP_HOSTNAME.
```

`JMAP_HOSTNAME` defaults to `api.fastmail.com`. The library reads
`process.env`; it does **not** load `.env` files. Load one in your application,
for example with `import 'dotenv/config'`, before constructing the service.

Do not expose API tokens in browser or client-side code.

## Service Setup

The canonical constructor accepts an options object:

```js
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService({
  token: process.env.JMAP_TOKEN,
  hostname: 'api.fastmail.com', // Host only: no scheme or path.
  accountId: 'optional-account-id',
  timeout: 10_000,
  signal: AbortSignal.timeout(15_000)
});

await service.initialize();
```

`sessionUrl` may replace `hostname` when a provider gives you a complete HTTPS
JMAP session URL. `httpClient` accepts a Ky `KyInstance`, primarily for custom
transports and testing. Requests disable automatic retries so mutating JMAP
operations are never repeated implicitly, and HTTP errors are always thrown.
Positive `timeout` values cover the response body; `0` disables the timeout.
When no timeout is supplied, a custom Ky instance keeps its configured timeout.

The positional constructor remains temporarily available but is deprecated:

```js
const service = new MaskedEmailService(token, 'api.fastmail.com');
```

Call `initialize(): Promise<void>` before `getSession()` or any remote method.
Concurrent initialization calls share the same request. If initialization
fails, it may be called again. The service fetches and validates the JMAP
session, uses its `apiUrl` for later requests, and selects an account as follows:

1. The requested `accountId`, if supplied and capable.
2. The session's primary masked-email account.
3. The first account advertising masked-email support.

Writes are rejected for read-only accounts. `getSession()` synchronously
returns a read-only snapshot, not the service's mutable internal session:

```js
const session = service.getSession();
console.log(session.apiUrl, session.accounts);
```

## Create

`createEmail(options?): Promise<MaskedEmail>` creates an address and fetches
the complete server-owned record:

```js
const email = await service.createEmail({
  state: 'enabled',
  forDomain: 'https://example.com',
  description: 'Example account',
  emailPrefix: 'example_login',
  url: 'https://example.com/account/security'
});
```

Create options:

| Option        | Accepted value                                                           |
| ------------- | ------------------------------------------------------------------------ |
| `state`       | `enabled`, `disabled`, or `pending`; defaults to `enabled`               |
| `forDomain`   | An HTTP(S) origin, such as `https://example.com`; no path/query/fragment |
| `description` | A string                                                                 |
| `emailPrefix` | 1-64 lowercase letters, digits, or underscores; create-only              |
| `url`         | An absolute deep-link URL, or `null`                                     |

Fastmail's JMAP API normally defaults a new address to `pending` when state is
omitted. This library deliberately sends `enabled` by default. Pass
`{ state: 'pending' }` when you want Fastmail's pending behavior: first mail
enables the address, and an unused pending address is automatically deleted
after 24 hours.

## Read And Filter

```js
const all = await service.getAllEmails();
const one = await service.getEmailById(email.id);
const sameAddress = await service.getEmailsByAddress(email.email);
const disabled = await service.filterByState('disabled');
const forExample = await service.filterByDomain('https://example.com');
```

`getAllEmails()` returns every state reported by Fastmail, including pending
and deleted records. `getEmailById()` rejects with
`MaskedEmailNotFoundError` when the ID is absent.

The three search/filter helpers perform exact, case-sensitive local equality
checks. Without a list they first call `getAllEmails()`. Supply a previously
loaded list to avoid another request; in that form they do not require an
initialized service:

```js
const all = await service.getAllEmails();

const matches = await service.getEmailsByAddress('alias@example.com', all);
const enabled = await service.filterByState('enabled', all);
const forExample = await service.filterByDomain('https://example.com', all);
```

## Update And State Transitions

`updateEmail(id, options): Promise<void>` accepts at least one of
`description`, `forDomain`, `state`, or `url`. The same metadata validation as
creation applies; `url: null` clears the deep link. Update state may be
`enabled`, `disabled`, or `deleted`, but not `pending`.

```js
await service.updateEmail(email.id, {
  description: 'Updated account note',
  forDomain: 'https://accounts.example.com',
  url: null
});

await service.disableEmail(email.id); // Promise<void>
await service.enableEmail(email.id); // Promise<void>
await service.deleteEmail(email.id); // Promise<void>
```

State semantics:

| State      | Behavior                                                               |
| ---------- | ---------------------------------------------------------------------- |
| `enabled`  | Active; mail is delivered normally.                                    |
| `disabled` | Active; incoming mail is sent to Trash.                                |
| `deleted`  | Inactive; incoming mail is bounced. It can be restored by enabling it. |
| `pending`  | Create-only temporary state; first mail enables it, or it expires.     |

`updateEmail()`, `enableEmail()`, `disableEmail()`, and `deleteEmail()` resolve
to `undefined` after the server confirms the update. They do not return the
JMAP `updated` object. Fetch the record if you need its current representation.

### Permanent Delete

```js
await service.permanentlyDeleteEmail(email.id); // Promise<void>
```

`deleteEmail()` is a reversible state change. `permanentlyDeleteEmail()` asks
Fastmail to destroy the record and is irreversible. Fastmail only permits
eligible addresses, such as addresses that have never received mail; an
ineligible request rejects with `JmapSetError`. Successful permanent deletion
resolves to `undefined` only after the server confirms the ID was destroyed.

## Errors And Retries

All public error classes are named ESM exports:

```js
import {
  InvalidCredentialsError,
  JmapSetError,
  TransportError
} from 'fastmail-masked-email';

try {
  await service.disableEmail(email.id);
} catch (error) {
  if (error instanceof InvalidCredentialsError) {
    console.error('Check the token and its Masked Email scope.', error.status);
  } else if (error instanceof JmapSetError) {
    console.error(error.type, error.subType, error.affectedId);
  } else if (error instanceof TransportError) {
    console.error(error.status, error.operation, error.responseData);
  }
}
```

| Error                        | Meaning and useful fields                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `InvalidArgumentError`       | Invalid local input.                                                                                        |
| `InvalidCredentialsError`    | Missing token or HTTP 401/403; optional `status`.                                                           |
| `ServiceNotInitializedError` | `initialize()` has not completed successfully.                                                              |
| `UnsupportedAccountError`    | Missing capability, unsupported selected account, or read-only write; optional `accountId`.                 |
| `MaskedEmailNotFoundError`   | Requested ID was not returned; `id`.                                                                        |
| `TransportError`             | Network or non-auth HTTP failure; `operation`, `status`, `responseData`, and `cause`.                       |
| `JmapMethodError`            | JMAP method/response failure; `operation`, `type`, `callId`, and `responseData`.                            |
| `JmapSetError`               | Per-record create/update/destroy failure; `operation`, `type`, `affectedId`, `subType`, and `responseData`. |

Do not retry validation, credential, unsupported-account, or not-found errors
without correcting their cause. Retry transient network failures, HTTP 429,
and 5xx responses with bounded exponential backoff and jitter, honoring any
server retry guidance. Treat writes carefully: automatic retries, especially
of `createEmail()`, may duplicate an operation if the server succeeded before
the connection failed.

## CommonJS Consumers

The package has no CommonJS `require` export. Migrate a CommonJS application to
ESM, or use dynamic import from CommonJS:

```js
async function main() {
  const { MaskedEmailService } = await import('fastmail-masked-email');
  const service = new MaskedEmailService({ token: process.env.JMAP_TOKEN });
  await service.initialize();
}

main().catch(console.error);
```

See [MIGRATION.md](MIGRATION.md) for the complete v3-to-v4 guide and the
[generated API documentation](https://ajyey.github.io/fastmail-masked-email/)
for exported TypeScript definitions.

## Live Integration Tests

The normal test suite uses an injected HTTP client and never contacts Fastmail.
To verify the complete API against a dedicated Fastmail test account, run:

```sh
JMAP_TOKEN=your-test-token npm run test:integration
```

Set `JMAP_HOSTNAME` as well when testing a non-default host. The token needs the
Masked Email scope. The command builds the package first, so the suite imports
the same ESM entrypoint consumers use. It checks environment configuration and
authentication errors, creates pending and default-state addresses, exercises
cached and fetching filters, metadata updates, every state transition, and
permanent deletion, then attempts cleanup even after a failure.

This command is intentionally excluded from `npm test`. Never use a personal
account or a token that is also used by production automation.
