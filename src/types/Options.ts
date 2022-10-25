import { MaskedEmailState } from './MaskedEmail';

/**
 * Options for creating a masked email
 */
export interface CreateOptions {
  /** The description to use for the newly created masked email */
  description?: string;
  /** The domain to be associated with the newly created masked email */
  forDomain?: string;
  /**
   * The state to set for the newly created masked email
   * @defaultValue 'enabled'
   * @see {@link MaskedEmailState} for valid values
   * */
  state?: MaskedEmailState;
}

/**
 * Options for updating a masked email
 */
export interface UpdateOptions {
  /** The description to use when updating the masked email */
  description?: string;
  /** The domain to use when updating the masked email  */
  forDomain?: string;
  /** The state to update the masked email to  */
  state?: MaskedEmailState;
}
