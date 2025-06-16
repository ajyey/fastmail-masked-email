import { InvalidArgumentError } from '../error/invalidArgumentError';
import { describe, it, expect } from 'vitest';

describe('InvalidArgumentError', () => {
  it('should create an instance of InvalidArgumentError with the given message', () => {
    const message = 'Invalid argument';
    const error = new InvalidArgumentError(message);

    expect(error).toBeInstanceOf(InvalidArgumentError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('InvalidArgumentError');
    expect(error.message).toBe(message);
  });

  it('should inherit from Error', () => {
    const error = new InvalidArgumentError('Some message');

    expect(Object.getPrototypeOf(error)).toBeInstanceOf(Error);
  });
});
