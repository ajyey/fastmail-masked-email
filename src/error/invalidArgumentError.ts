/**
 * Error thrown when an argument is invalid.
 */
export class InvalidArgumentError extends Error {
  name = 'InvalidArgumentError';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidArgumentError.prototype);
  }
}
