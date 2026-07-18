/** Thrown when a remote method is used before successful initialization. */
export class ServiceNotInitializedError extends Error {
  name = 'ServiceNotInitializedError';

  /** Create an initialization-state error. */
  constructor(message = 'Service not initialized. Call initialize() first.') {
    super(message);
    Object.setPrototypeOf(this, ServiceNotInitializedError.prototype);
  }
}
