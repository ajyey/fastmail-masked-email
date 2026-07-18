/**
 * Error thrown when an argument is invalid.
 */
export class InvalidArgumentError extends Error {
  name = 'InvalidArgumentError';

  /** Create an error describing invalid local input. */
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}
