/** Represents a per-record failure from a JMAP set operation. */
export class JmapSetError extends Error {
  name = 'JmapSetError';

  /**
   * @param operation - Human-readable operation being attempted.
   * @param type - Machine-readable JMAP SetError type.
   * @param message - Human-readable failure description.
   * @param affectedId - Record ID or creation ID that failed.
   * @param subType - Optional Fastmail-specific error refinement.
   * @param responseData - Raw SetError data when safe to expose.
   */
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
