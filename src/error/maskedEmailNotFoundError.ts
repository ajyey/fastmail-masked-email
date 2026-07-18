export class MaskedEmailNotFoundError extends Error {
  name = 'MaskedEmailNotFoundError';

  constructor(readonly id: string) {
    super(`No masked email found with id ${id}`);
    Object.setPrototypeOf(this, MaskedEmailNotFoundError.prototype);
  }
}
