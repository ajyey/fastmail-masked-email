export class JmapMethodError extends Error {
  name = 'JmapMethodError';

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
