# Migrating From v3 To v4

v4 requires Node.js 22 or later and publishes an ESM-only, explicitly exported
API. It also tightens JMAP validation, account selection, return values, and
errors. Update imports, construction, renamed methods, and write-result handling
before upgrading.

## Breaking Changes

| v3                                                                                     | v4                                                                                                      | Action                                                                                            |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| No declared Node.js minimum                                                            | Node.js `>=22`                                                                                          | Upgrade the runtime.                                                                              |
| CommonJS consumers could attempt `require()` against the package entry                 | No CommonJS export                                                                                      | Use ESM or CommonJS dynamic `import()`.                                                           |
| Positional `new MaskedEmailService(token, hostname)` was canonical                     | Options-object constructor is canonical; positional form is deprecated                                  | Pass `{ token, hostname }`.                                                                       |
| `getSession()` was typed as `Promise<any>` while returning the internal object         | Synchronous `ReadonlySession` snapshot                                                                  | Remove `await` if desired and do not mutate it to configure the service.                          |
| Session account selection could fall back to the core primary account or first account | Selects an explicitly requested capable account, masked-email primary account, or first capable account | Set `accountId` when a particular account is required; handle `UnsupportedAccountError`.          |
| `getEmailByAddress(address)`                                                           | `getEmailsByAddress(address, list?)`                                                                    | Rename the call; optionally pass a cached list.                                                   |
| `filterByForDomain(domain, list?)`                                                     | `filterByDomain(origin, list?)`                                                                         | Rename the call and use an exact HTTP(S) origin.                                                  |
| `forDomain` examples used bare domains                                                 | Must be an HTTP(S) origin without path, query, or fragment                                              | Change `example.com` to `https://example.com`.                                                    |
| `Options` allowed all masked-email states                                              | `CreateOptions` and `UpdateOptions` enforce valid transitions                                           | Create with `enabled`, `disabled`, or `pending`; update with `enabled`, `disabled`, or `deleted`. |
| `url` was not accepted by create/update options                                        | `url` is an absolute deep link or `null`                                                                | Use `null` to clear it.                                                                           |
| `emailPrefix` was loosely passed through                                               | Must match 1-64 lowercase letters, digits, or underscores                                               | Validate prefixes before creation.                                                                |
| Update and delete methods returned JMAP result objects/arrays                          | `updateEmail`, state helpers, and permanent delete return `Promise<void>`                               | Stop reading their resolved values; fetch the record when needed.                                 |
| `createEmail()` returned the create response fragment                                  | Returns the complete `MaskedEmail` fetched by ID                                                        | Expect an additional JMAP get and a complete server-owned record.                                 |
| Failures were mostly generic `Error` or `InvalidArgumentError`                         | Structured exported error classes                                                                       | Update error handling to use `instanceof` and structured fields.                                  |
| Internal JMAP request/response types were root exports                                 | Consumer API exports masked-email, options, and session types plus errors                               | Remove imports of internal `jmap`/`response` types.                                               |

## Imports

### ES modules

Before:

```js
const { MaskedEmailService } = require('fastmail-masked-email');
```

After, set `"type": "module"` in your application's `package.json` or use an
`.mjs` file:

```js
import { MaskedEmailService } from 'fastmail-masked-email';
```

TypeScript consumers should use an ESM-aware configuration such as
`moduleResolution: "NodeNext"` with `module: "NodeNext"`, or
`moduleResolution: "Bundler"` with an ESM module target.

### CommonJS dynamic import

If the application must remain CommonJS, replace `require()` with asynchronous
dynamic import:

```js
async function main() {
  const { MaskedEmailService } = await import('fastmail-masked-email');
  const service = new MaskedEmailService({ token: process.env.JMAP_TOKEN });
  await service.initialize();
  return service.getAllEmails();
}

main().then(console.log).catch(console.error);
```

## Construction And Initialization

Before:

```js
const service = new MaskedEmailService(token, 'api.fastmail.com');
await service.initialize();
```

After:

```js
const service = new MaskedEmailService({
  token,
  hostname: 'api.fastmail.com',
  accountId: 'optional-account-id',
  timeout: 10_000
});

await service.initialize();
```

The deprecated positional overload still works during migration. `hostname`
must be a host without scheme or path. Alternatively, provide a complete HTTPS
`sessionUrl`.

The constructor still falls back to `JMAP_TOKEN` and `JMAP_HOSTNAME`, with
`api.fastmail.com` as the default host. v4 does not load `.env`; load it in the
application before constructing the service.

Every remote operation and `getSession()` requires a successful
`initialize()`. Initialization now validates the session's masked-email
capability and selected account. Writes also reject read-only accounts.

## Methods And Values

Before:

```js
const created = await service.createEmail({ forDomain: 'example.com' });
const matches = await service.getEmailByAddress(created.email);
const domainMatches = await service.filterByForDomain('example.com');
const result = await service.disableEmail(created.id);
```

After:

```js
const created = await service.createEmail({
  forDomain: 'https://example.com',
  url: 'https://example.com/account'
});

const all = await service.getAllEmails();
const matches = await service.getEmailsByAddress(created.email, all);
const domainMatches = await service.filterByDomain('https://example.com', all);

await service.disableEmail(created.id); // Resolves to undefined.
const current = await service.getEmailById(created.id);
```

Supplying a list to `getEmailsByAddress`, `filterByState`, or `filterByDomain`
makes the operation entirely local: no initialization or request is needed.
Comparisons are exact and case-sensitive. Omitting the list fetches all records
first.

The library sends `enabled` when `createEmail()` omits state, even though the
Fastmail API's own default is `pending`. Pass `{ state: 'pending' }` explicitly
to preserve pending behavior.

`disabled` sends incoming mail to Trash. `deleted` is a reversible soft delete
that bounces incoming mail. `permanentlyDeleteEmail()` irreversibly destroys an
eligible record and now resolves only after Fastmail confirms destruction.

## Error Handling

Before:

```js
try {
  await service.permanentlyDeleteEmail(id);
} catch (error) {
  console.error(error.message);
}
```

After:

```js
import {
  InvalidCredentialsError,
  JmapSetError,
  TransportError
} from 'fastmail-masked-email';

try {
  await service.permanentlyDeleteEmail(id);
} catch (error) {
  if (error instanceof JmapSetError) {
    console.error(error.type, error.subType, error.affectedId);
  } else if (error instanceof InvalidCredentialsError) {
    console.error(error.status);
  } else if (error instanceof TransportError) {
    console.error(error.operation, error.status, error.responseData);
  } else {
    throw error;
  }
}
```

v4 exports `InvalidArgumentError`, `InvalidCredentialsError`,
`ServiceNotInitializedError`, `UnsupportedAccountError`,
`MaskedEmailNotFoundError`, `TransportError`, `JmapMethodError`, and
`JmapSetError`. Retry only transient network, HTTP 429, or 5xx failures with
backoff. Do not blindly retry writes: a lost response can leave the operation
completed, and retrying creation can produce a second address.
