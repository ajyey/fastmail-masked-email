/**
 * Represents a method-level JMAP error or a malformed JMAP response.
 * HTTP requests may succeed while carrying this error in `methodResponses`.
 */
export class JmapMethodError extends Error {
  name = 'JmapMethodError';

  /**
   * @param operation - Human-readable operation being attempted.
   * @param type - JMAP error type, or `invalidResponse` for malformed data.
   * @param message - Human-readable failure description.
   * @param callId - Invocation ID associated with the response.
   * @param responseData - Raw method response data when safe to expose.
   * @param options - Optional underlying cause.
   */
  constructor(
    readonly operation: string,
    readonly type: string,
    message: string,
    readonly callId?: string,
    readonly responseData?: unknown,
    options?: { cause?: unknown }
  ) {
    super(message, { cause: options?.cause });
    Object.setPrototypeOf(this, JmapMethodError.prototype);
  }
}
