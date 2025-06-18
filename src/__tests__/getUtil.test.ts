import { beforeEach, describe, expect, it } from 'vitest';

import { maskedEmailFixture } from '../__fixtures__/maskedEmail.fixture';
import { MaskedEmail } from '../types/maskedEmail';
import {
  filterByAddress,
  filterByForDomain,
  filterByState
} from '../util/getUtil';

describe('getUtil', () => {
  let maskedEmails: MaskedEmail[];
  beforeEach(() => {
    maskedEmails = [
      { ...maskedEmailFixture },
      { ...maskedEmailFixture, id: '2', email: 'testEmail2@test.com' }
    ];
  });
  describe('filterByAddress', () => {
    it('should return the masked email by address if found', () => {
      expect(
        filterByAddress('testEmail2@test.com', maskedEmails)
      ).toStrictEqual([maskedEmails[1]]);
    });
    it('should return an empty list if the masked email is not found', () => {
      expect(
        filterByAddress('doesntExist@test.com', maskedEmails)
      ).toStrictEqual([]);
    });
  });
  describe('filterByState', () => {
    it('should return the masked email by state if found', () => {
      expect(filterByState('enabled', maskedEmails)).toStrictEqual([
        maskedEmails[0],
        maskedEmails[1]
      ]);
    });
    it('should return an empty list if the masked email is not found', () => {
      expect(filterByState('disabled', maskedEmails)).toStrictEqual([]);
    });
  });
  describe('filterByForDomain', () => {
    it('should return the masked email by forDomain if found', () => {
      expect(filterByForDomain('test.com', maskedEmails)).toStrictEqual([
        maskedEmails[0],
        maskedEmails[1]
      ]);
    });
    it('should return an empty list if the masked email is not found', () => {
      expect(filterByForDomain('test2.com', maskedEmails)).toStrictEqual([]);
    });
  });
});
