/**
 * Represents the state of a masked email address.
 *
 * The state of a masked email address can be one of the following:
 * - enabled
 *   - The address is active and receiving mail normally.
 * - disabled
 *   - The address is active, but mail is sent straight to trash.
 * - deleted
 *   - The address is inactive; any mail sent to the address is bounced.
 * - pending
 *   - A create-only temporary state. Once changed, it cannot be restored.
 *   - If a message is received by an address in the "pending" state, it will automatically be converted to "enabled".
 *   - Pending email addresses are automatically deleted 24h after creation.

 * @see {@link https://www.fastmail.com/developer/maskedemail/}
 */
export type MaskedEmailState = 'enabled' | 'disabled' | 'pending' | 'deleted';

/** States accepted when creating an address; deletion is an update operation. */
export type CreateMaskedEmailState = Exclude<MaskedEmailState, 'deleted'>;

/** States accepted when updating an address; pending cannot be restored. */
export type UpdateMaskedEmailState = Exclude<MaskedEmailState, 'pending'>;

/**
 * Represents a masked email address.
 * @see {@link https://www.fastmail.com/developer/maskedemail/}
 */
export interface MaskedEmail {
  /** The email address. */
  email: string;
  /** The id of the masked email address. */
  id: string;
  /** A deep link to the credential or other record related to this masked email */
  url: string | null;
  /** The current state of the masked email address. */
  state: MaskedEmailState;
  /** The protocol and domain (i.e. origin) of the site the user is using the masked email for. */
  forDomain: string;
  /** A short user-supplied description of what this masked email address is for. */
  description: string;
  /** The date-time the email address was created. */
  createdAt: string;
  /** The date-time the most recent message was received, if any. */
  lastMessageAt: string | null;
  /** The name of the client that created this masked email address */
  createdBy: string;
}
