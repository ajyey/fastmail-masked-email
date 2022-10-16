import { MaskedEmail } from '../types/MaskedEmail';
import { filterByAddress, filterByState } from "../util/getUtil";

describe('getUtil', () => {
  let maskedEmails: MaskedEmail[];
  beforeEach(() => {
    maskedEmails = [
      {
        id: '1',
        email: 'testEmail@test.com',
        state: 'enabled',
        description: 'A very helpful description',
        forDomain: 'test.com',
        createdAt: '2020-01-01T00:00:00.000Z',
        createdBy: '1Password',
        url: 'gmail.com',
        lastMessageAt: '2020-01-01T00:00:00.000Z'
      },
      {
        id: '2',
        email: 'testEmail2@test.com',
        state: 'enabled',
        description: 'A not so helpful description',
        forDomain: 'test.com',
        createdAt: '2020-01-01T00:00:00.000Z',
        createdBy: '1Password',
        url: 'gmail.com',
        lastMessageAt: '2020-01-01T00:00:00.000Z'
      }
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
});
