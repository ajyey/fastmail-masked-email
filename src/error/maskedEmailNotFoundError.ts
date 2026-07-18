/** Thrown when Fastmail does not return the requested masked-email ID. */
export class MaskedEmailNotFoundError extends Error {
  name = 'MaskedEmailNotFoundError';

  /** Create a not-found error for the requested record ID. */
  constructor(readonly id: string) {
    super(`No masked email found with id ${id}`);
    Object.setPrototypeOf(this, MaskedEmailNotFoundError.prototype);
  }
}
