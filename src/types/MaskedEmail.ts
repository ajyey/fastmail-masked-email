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
 *   - The initial state. Once set to anything else, it cannot be set back to pending.
 *   - If a message is received by an address in the "pending" state, it will automatically be converted to "enabled".
 *   - Pending email addresses are automatically deleted 24h after creation.

 * @see {@link https://www.fastmail.com/developer/maskedemail/}
 */
export type MaskedEmailState = 'enabled' | 'disabled' | 'pending' | 'deleted';

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
  /** The date-time the most recent message was received at this email address, if any. */
  createdAt: string;
  /** The date-time the email address was created. */
  lastMessageAt: string;
  /** The name of the client that created this masked email address */
  createdBy: string;
  /** (create-only) This is only used on create and otherwise ignored; it is not returned when masked email objects are fetched. */
  emailPrefix?: string;
}
