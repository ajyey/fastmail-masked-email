import { MaskedEmailState } from './MaskedEmail';

/**
 * Options for creating a masked email
 */
export interface CreateOptions {
  description?: string;
  forDomain?: string;
  state?: MaskedEmailState;
}

/**
 * Options for updating a masked email
 */
export interface UpdateOptions {
  /** The updated description to use  */
  description?: string;
  /** The updated forDomain to use  */
  forDomain?: string;
  /** The updated state to use  */
  state?: MaskedEmailState;
}
