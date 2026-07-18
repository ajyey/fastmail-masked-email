/**
 * Error thrown when the user's credentials are invalid or not provided.
 */
export class InvalidCredentialsError extends Error {
  name = 'InvalidCredentialsError';
  readonly status?: number;

  constructor(message: string, options?: { cause?: unknown; status?: number }) {
    super(message, { cause: options?.cause });
    this.status = options?.status;
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
