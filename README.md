![Logo](logo.png)
# fastmail-masked-email

A Node.js library for creating and modifying/updating [Fastmail Masked Emails](https://www.fastmail.help/hc/en-us/articles/4406536368911-Masked-Email)

## Installation
```bash
npm install fastmail-masked-email
```
or
```bash
yarn add fastmail-masked-email
```

## Authentication Setup
In order to be able to make requests to the Fastmail API, you will need to [create a Fastmail API Token](https://www.fastmail.help/hc/en-us/articles/5254602856719-API-tokens).
This token should be created with the `Masked Email` scope to allow for the creation and management of masked emails.

This library relies on the use of two environment variables to authenticate with Fastmail.

- `JMAP_TOKEN`
- `JMAP_HOSTNAME` ( Defaults to `api.fastmail.com` if not explicitly set )

You can set these environment variables in your shell, or in a `.env` file in the root of your project and use something like the [dotenv](https://www.npmjs.com/package/dotenv) package to load them.

## Getting a Session
Getting a session is the first step in interacting with the Fastmail API. This is done by calling the `getSession` function.
A session is an object that is returned containing the `accountId` and `apiUrl` for the authenticated user,
both of which are required when making more useful requests to Fastmail to interact with masked emails.


```typescript
import { getSession } from 'fastmail-masked-email';

// Get a session and pass in your token and hostname directly (e.g. from using dotenv)
const session = await getSession(token, hostname);

// getSession will attempt to load the JMAP_TOKEN and JMAP_HOSTNAME
// environment variables if they are not directly passed in as arguments
session = await getSession();

// Getting a session also works with just passing in the token. In this case, the hostname will default to api.fastmail.com
session = await getSession(token);
```

## Listing all your Masked Emails
Once you have a session, you can use it to list **all** of the masked emails that are currently configured for your account.
This includes `enabled`, `disabled`, `pending` and `deleted` masked emails.

All the masked emails are returned in an array of `MaskedEmail` objects.
All methods require a `session` object to be passed in as the first argument. This session object is used to interact with the
Fastmail API.

```typescript
import { list, getSession } from 'fastmail-masked-email';

const session = await getSession(token, hostname);

const myMaskedEmails = await list(session);

console.log(myMaskedEmails);
```

## Getting a Masked Email by ID
If you know the unique ID of a masked email you want to retrieve, you can get it by its ID.

```typescript
import { getById, getSession } from 'fastmail-masked-email';

const session = await getSession(token, hostname);

const myMaskedEmail = await getById('my-masked-email-id', session);

console.log(myMaskedEmail);
```


## Creating a new Masked Email
Creating a new masked email is done by calling the `create` method and passing in both the `session` object and an optional `options` parameter.
The `options` parameter is an object that can contain the following properties:

- `state`: `enabled` | `disabled` | `pending` ( Defaults to `enabled` )
- `forDomain`: string ( This is the domain that you want associated with this masked email )
- `description`: string ( This is a description of the masked email )

You can optionally pass in a `state` to set the initial state of the masked email. The default state is `enabled`.

```typescript
import { create, getSession } from 'fastmail-masked-email';

const session = await getSession(token, hostname);

// Create a new masked email for the domain 'example.com'
const newMaskedEmail = await create(session, { forDomain: 'example.com' });

// Create a new masked email that is disabled by default
newMaskedEmail = await create(session, 'example.com', { state: 'disabled' });

// Create a new masked email with a description
newMaskedEmail = await create(session, { description: 'My new masked email' });

// Create a new masked email with all options present
newMaskedEmail = await create(session, { forDomain: 'example.com', state: 'enabled', description: 'My new masked email' });
```

## Updating a Masked Email
There are three masked email properties that can be updated:
- `forDomain`
- `state`
- `description`

To update a masked email, call the `update` method.
The `update` method requires the `id` of the masked email to update, the `session` object, an  `options` object.

The `options` object can contain any of the above three properties properties, but MUST contain at least one of them.
`update` returns a rejected promise if no properties are passed into the options object.


```typescript
import { update, getSession } from 'fastmail-masked-email';

const session = await getSession(token, hostname);

await update('my-masked-email-id', session, {
	forDomain: 'example.com',
	description: 'My new masked email!',
	state: 'disabled'
});
```


### Enabling, Disabling, and Deleting a Masked Email
Enabling a masked email is done by calling the `enable` method and passing in the masked email `id` and the `session` object.
An enabled masked email will receive any email sent to it.

```typescript
import { disable, getSession } from 'fastmail-masked-email';

const session = getSession(token, hostname);

await disable('my-masked-email-id', session);
```
#### Disable
Disabling a masked email is done by calling the `disable` method and passing in the masked email `id` and the `session` object.
When a masked email is disabled, any email sent to it will be sent to the trash.

#### Enable
```typescript
import { disable, getSession } from 'fastmail-masked-email';

const session = getSession(token, hostname);

await disable('my-masked-email-id', session);
```
#### Delete
A masked email can be deleted by calling the `remove` method and passing in the masked email `id` and the `session` object.
Any email sent to a deleted masked email will be sent to the trash.
A deleted email can be restored by `enable`-ing it again at which point it will continue to receive emails.

```typescript
import { remove, getSession } from 'fastmail-masked-email';

const session = getSession(token, hostname);

await remove('my-masked-email-id', session);
```
