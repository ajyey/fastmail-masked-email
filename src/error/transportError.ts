/** Represents a network, timeout, response-stream, or non-auth HTTP failure. */
export class TransportError extends Error {
  name = 'TransportError';

  /**
   * @param operation - Human-readable operation being attempted.
   * @param message - Human-readable failure description.
   * @param status - HTTP status, when a response was received.
   * @param responseData - Parsed error response supplied by Ky.
   * @param options - Optional underlying cause.
   */
  constructor(
    readonly operation: string,
    message: string,
    readonly status?: number,
    readonly responseData?: unknown,
    options?: { cause?: unknown }
  ) {
    super(message, { cause: options?.cause });
    Object.setPrototypeOf(this, TransportError.prototype);
  }
}
