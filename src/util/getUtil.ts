import { MaskedEmail, MaskedEmailState } from '../types/MaskedEmail';

/**
 * Gets a masked email by email address from the full list of masked emails
 * @param address The email address to find from the list of masked emails
 * @param list The list of masked emails
 */
export const getEmailByAddress = async (
  address: string,
  list: readonly MaskedEmail[]
): Promise<MaskedEmail | undefined> => {
  return list.find((me) => me.email === address);
};

/**
 * Filters emails by state
 * @param state The state to filter by
 * @param list The list of masked emails
 */
export const filterEmailsByState = async (
  state: MaskedEmailState,
  list: MaskedEmail[]
) => {
  return list.filter((me) => me.state === state);
};
