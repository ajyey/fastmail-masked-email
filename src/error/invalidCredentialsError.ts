/**
 * Thrown when credentials are missing, invalid, or insufficiently authorized.
 */
export class InvalidCredentialsError extends Error {
  name = 'InvalidCredentialsError';
  /** HTTP status returned by the server, when available. */
  readonly status?: number;

  /** Create a credential error while preserving the underlying Ky failure. */
  constructor(message: string, options?: { cause?: unknown; status?: number }) {
    super(message, { cause: options?.cause });
    this.status = options?.status;
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
