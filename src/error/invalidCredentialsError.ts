/**
 * Error thrown when the user's credentials are invalid or not provided.
 */
export class InvalidCredentialsError extends Error {
  name = 'InvalidCredentialsError';
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
