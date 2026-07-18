export class UnsupportedAccountError extends Error {
  name = 'UnsupportedAccountError';

  constructor(
    message: string,
    readonly accountId?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, UnsupportedAccountError.prototype);
  }
}
