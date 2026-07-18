export class JmapSetError extends Error {
  name = 'JmapSetError';

  constructor(
    readonly operation: string,
    readonly type: string,
    message: string,
    readonly affectedId: string,
    readonly subType?: string,
    readonly responseData?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, JmapSetError.prototype);
  }
}
