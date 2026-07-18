export class ServiceNotInitializedError extends Error {
  name = 'ServiceNotInitializedError';

  constructor(message = 'Service not initialized. Call initialize() first.') {
    super(message);
    Object.setPrototypeOf(this, ServiceNotInitializedError.prototype);
  }
}
