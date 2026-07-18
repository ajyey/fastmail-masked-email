/** Thrown when no writable masked-email-capable account can satisfy a request. */
export class UnsupportedAccountError extends Error {
  name = 'UnsupportedAccountError';

  /**
   * @param message - Human-readable account or capability failure.
   * @param accountId - Account involved in the failure, when known.
   */
  constructor(
    message: string,
    readonly accountId?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, UnsupportedAccountError.prototype);
  }
}
