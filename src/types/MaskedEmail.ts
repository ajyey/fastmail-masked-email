/**
 * Represents the state of a masked email address.
 *
 * pending: the initial state. Once set to anything else, it cannot be set back to pending.
 * If a message is received by an address in the "pending" state, it will automatically be converted to "enabled".
 * Pending email addresses are automatically deleted 24h after creation.
 *
 * enabled: the address is active and receiving mail normally.
 * disabled: the address is active, but mail is sent straight to trash.
 * deleted: the address is inactive; any mail sent to the address is bounced.
 */
export type MaskedEmailState = 'enabled' | 'disabled' | 'pending' | 'deleted';
/**
 * Represents a masked email address.
 *
 * email: The email address.
 * id: The id of the masked email address.
 * state: The current state of the masked email address.
 * forDomain: The protocol and domain (i.e. origin) of the site the user is using the masked email for. Example: https://www.example.com
 * description: A short user-supplied description of what this masked email address is for.
 * lastMessageAt: The date-time the most recent message was received at this email address, if any.
 * createdAt: The date-time the email address was created.
 * createdBy: The name of the client that created this masked email address
 * url: A deep link to the credential or other record related to this masked email
 * emailPrefix: (create-only) This is only used on create and otherwise ignored; it is not returned when GetMaskedEmail objects are fetched.
 */
export interface MaskedEmail {
  email: string;
  id: string;
  url: string | null;
  state: MaskedEmailState;
  forDomain: string;
  description: string;
  createdAt: string;
  lastMessageAt: string;
  createdBy: string;
  emailPrefix?: string;
}
