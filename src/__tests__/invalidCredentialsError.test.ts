import { InvalidCredentialsError } from '../error/invalidCredentialsError';
import { describe, it, expect } from 'vitest';

describe('InvalidCredentialsError', () => {
  it('should create an instance of InvalidCredentialsError with the given message', () => {
    const message = 'Invalid credentials';
    const error = new InvalidCredentialsError(message);

    expect(error).toBeInstanceOf(InvalidCredentialsError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('InvalidCredentialsError');
    expect(error.message).toBe(message);
  });

  it('should inherit from Error', () => {
    const error = new InvalidCredentialsError('Some message');

    expect(Object.getPrototypeOf(error)).toBeInstanceOf(Error);
  });
});
