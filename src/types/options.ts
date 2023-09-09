import { MaskedEmailState } from './maskedEmail';

/**
 * Options for creating or updating a masked email
 */
export interface Options {
  /** The description to set fpr the masked email */
  description?: string;
  /** The domain to be associated with the masked email */
  forDomain?: string;
  /**
   * The state to set for the masked email
   * @defaultValue 'enabled'
   * @see {@link MaskedEmailState} for valid values
   * */
  state?: MaskedEmailState;
}

export interface CreateOptions extends Options {
  /** If supplied, the server-assigned email will start with the given prefix. */
  emailPrefix?: string;
}
