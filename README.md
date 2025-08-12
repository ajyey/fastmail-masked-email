
<p align="center">
  <img src="logo.png" />
</p>
<h1 align="center" style="border-bottom: none;">fastmail-masked-email</h1>
<h3 align="center">Create, delete, and modify <a href="https://www.fastmail.help/hc/en-us/articles/4406536368911-Masked-Email">fastmail masked emails</a></h3>

<p align="center">
  <a href="https://open.vscode.dev/ajyey/fastmail-masked-email">
    <img alt="open in vs code" src="https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc">
  </a>
  <a href="https://github.com/semantic-release/semantic-release/tree/master">
    <img alt="semantic-release: angular" src="https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release">
  </a>
  <a href="https://www.npmjs.com/package/fastmail-masked-email">
    <img alt="npm latest version" src="https://img.shields.io/npm/v/fastmail-masked-email">
  </a>
  <a href="https://www.npmjs.com/package/fastmail-masked-email">
    <img alt="npm beta version" src="https://img.shields.io/npm/v/fastmail-masked-email/beta.svg">
  </a>
</p>
<p align="center">
  <a href="https://github.com/ajyey/fastmail-masked-email/actions/workflows/test.yml">
    <img alt="test state" src="https://github.com/ajyey/fastmail-masked-email/actions/workflows/test.yml/badge.svg?branch=master">
  </a>
  <a href="https://github.com/ajyey/fastmail-masked-email/actions/workflows/release.yml">
    <img alt="release state" src="https://github.com/ajyey/fastmail-masked-email/actions/workflows/release.yml/badge.svg?branch=master">
  </a>
  <a href="https://github.com/ajyey/fastmail-masked-email/actions/workflows/docs.yml">
    <img alt="docs state" src="https://github.com/ajyey/fastmail-masked-email/actions/workflows/docs.yml/badge.svg?branch=master">
  </a>
  <a href="https://github.com/ajyey/fastmail-masked-email/issues?q=is%3Aopen+is%3Aissue">
    <img alt="open issues" src="https://img.shields.io/github/issues-raw/ajyey/fastmail-masked-email">
  </a>
  <a href="https://github.com/ajyey/fastmail-masked-email/blob/master/LICENSE">
    <img alt="license" src="https://img.shields.io/github/license/ajyey/fastmail-masked-email">
  </a>
</p>
<p align="center">
  Check out the
  <a href="https://ajyey.github.io/fastmail-masked-email/">
    Typedoc
  </a>
  for Typescript definitions and documentation.

</p>


# Installation


```bash
npm install fastmail-masked-email --save
```
or
```bash
yarn add fastmail-masked-email
```

# Setting Up Authentication
In order to be able to make requests to the Fastmail API, you will need to [create a Fastmail API Token](https://www.fastmail.help/hc/en-us/articles/5254602856719-API-tokens).
This token should be created with the `Masked Email` scope to allow for the creation and management of masked emails.

This library supports authentication through environment variables or by passing credentials directly to the service.

- `JMAP_TOKEN`
- `JMAP_HOSTNAME` ( Defaults to `api.fastmail.com` if not explicitly set )

You can set these environment variables in your shell, or in a `.env` file in the root of your project and use something like the [dotenv](https://www.npmjs.com/package/dotenv) package to load them.

# Usage

## Creating and Initializing the Service
The first step is to create an instance of `MaskedEmailService` and initialize it. The service will automatically handle session management with the Fastmail API.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

// Create service with token and hostname directly
const service = new MaskedEmailService(token, hostname);
await service.initialize();

// Or create service using environment variables (JMAP_TOKEN and JMAP_HOSTNAME)
const serviceWithEnv = new MaskedEmailService();
await serviceWithEnv.initialize();

// Or create service with just a token (hostname defaults to api.fastmail.com)
const serviceWithToken = new MaskedEmailService(token);
await serviceWithToken.initialize();
```

## Getting all of your Masked Emails
Once you have initialized the service, you can retrieve a list of **all** of the masked emails that are currently configured for your account.
This includes `enabled`, `disabled`, `pending` and `deleted` masked emails.

All the masked emails are returned in an array of `MaskedEmail` objects.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

const myMaskedEmails = await service.getAllEmails();

console.log(myMaskedEmails);
```

## Getting a Masked Email by ID
If you know the unique ID of a masked email you want to retrieve, you can get it by its ID.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

const myMaskedEmail = await service.getEmailById('my-masked-email-id');

console.log(myMaskedEmail);
```


## Creating a new Masked Email
Creating a new masked email is done by calling the `createEmail` method with an optional `options` parameter.
The `options` parameter is an object that can contain the following properties:

- `state`: `enabled` | `disabled` | `pending` ( Defaults to `enabled` )
- `forDomain`: string ( This is the domain that you want associated with this masked email )
- `description`: string ( This is a description of the masked email )
- `emailPrefix`: string ( If supplied, the masked email will start with the given prefix )

You can optionally pass in a `state` to set the initial state of the masked email. The default state is `enabled`.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

// Create a new masked email for the domain 'example.com'
let newMaskedEmail = await service.createEmail({ forDomain: 'example.com' });

// Create a new masked email that is disabled by default
newMaskedEmail = await service.createEmail({ state: 'disabled' });

// Create a new masked email with a description
newMaskedEmail = await service.createEmail({ description: 'My new masked email' });

// Create a new masked email that starts with a given prefix
newMaskedEmail = await service.createEmail({ emailPrefix: 'myprefix' });

// Create a new masked email with all options present
newMaskedEmail = await service.createEmail({
  forDomain: 'example.com',
  state: 'enabled',
  description: 'My new masked email',
  emailPrefix: 'myprefix'
});
```

## Updating a Masked Email
There are three masked email properties that can be updated:
- `forDomain`
- `state`
- `description`

To update a masked email, call the `updateEmail` method.
The `updateEmail` method requires the `id` of the masked email to update and an `options` object.

The `options` object can contain any of the above three properties, but MUST contain at least one of them.
`updateEmail` returns a rejected promise if no properties are passed into the options object.


```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

await service.updateEmail('my-masked-email-id', {
	forDomain: 'example.com',
	description: 'My new masked email!',
	state: 'disabled'
});
```


### Enabling, Disabling, and Deleting a Masked Email
The service provides convenient methods for common operations on masked emails.
An enabled masked email will receive any email sent to it.

#### Enable

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

await service.enableEmail('my-masked-email-id');
```

#### Disable
When a masked email is disabled, any email sent to it will be sent to the trash.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

await service.disableEmail('my-masked-email-id');
```

#### Delete
Any email sent to a deleted masked email will be sent to the trash.
A deleted email can be restored by enabling it again at which point it will continue to receive emails.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

await service.deleteEmail('my-masked-email-id');
```

#### Permanently Delete a Masked Email
A masked email that has not received any mail yet can be permanently deleted.
This will permanently delete the masked email and it will no longer be able to be restored.

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

await service.permanentlyDeleteEmail('my-masked-email-id');
```

## Additional Filtering Methods
The `MaskedEmailService` provides convenient filtering methods to help you find specific masked emails.

### Get Masked Emails by Address
If you know the exact email address, you can retrieve all masked emails that match it:

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

const emailsWithAddress = await service.getEmailByAddress('specific@masked.email');
console.log(emailsWithAddress);
```

### Filter by State
Filter all your masked emails by their current state:

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

// Get only enabled emails
const enabledEmails = await service.filterByState('enabled');

// Get only disabled emails
const disabledEmails = await service.filterByState('disabled');

// Get only deleted emails
const deletedEmails = await service.filterByState('deleted');
```

### Filter by Domain
Filter masked emails by the domain they're associated with:

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

// Get all masked emails for a specific domain
const domainEmails = await service.filterByForDomain('example.com');
console.log(domainEmails);
```

You can also pass an existing list of emails to these filter methods to avoid making additional API calls:

```typescript
import { MaskedEmailService } from 'fastmail-masked-email';

const service = new MaskedEmailService(token, hostname);
await service.initialize();

// Get all emails once
const allEmails = await service.getAllEmails();

// Filter the existing list without additional API calls
const enabledEmails = await service.filterByState('enabled', allEmails);
const domainEmails = await service.filterByForDomain('example.com', allEmails);
```

# Notes
- Note on using `async/await`:
  - In the code examples shown above, we are using `await` to handle asynchronous operations. To use `await`, you must be inside an `async` function.
	If you're using these examples in your own code, make sure to wrap them in an `async` function. Here's an example of how you can do that:
  	```typescript
     import { MaskedEmailService } from 'fastmail-masked-email';
     async function main() {
        const service = new MaskedEmailService(token, hostname);
        await service.initialize();
        const myMaskedEmails = await service.getAllEmails();
        console.log(myMaskedEmails);
  	  }
  	  main()
  	  .then(() => console.log('Done!'))
  	  .catch((error) => console.error('An error occurred:', error));
  	```
