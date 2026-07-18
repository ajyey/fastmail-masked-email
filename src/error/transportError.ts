export class TransportError extends Error {
  name = 'TransportError';

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
