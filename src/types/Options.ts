import { MaskedEmailState } from './MaskedEmail';

/**
 * Options for creating a masked email
 */
export interface CreateOptions {
  description?: string;
  forDomain?: string;
  state?: MaskedEmailState;
}
