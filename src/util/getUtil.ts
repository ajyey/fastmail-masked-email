import { MaskedEmail, MaskedEmailState } from '../types/MaskedEmail';

/**
 * Gets a masked email by email address from the full list of masked emails
 * @param address - The email address to find from the list of masked emails
 * @param list - The list of {@link MaskedEmail} objects to search through
 * @returns The {@link MaskedEmail} if found; Returns an empty list otherwise
 */
export const filterByAddress = (
  address: string,
  list: MaskedEmail[]
): MaskedEmail[] | [] => {
  return list.filter((me) => me.email === address);
};

/**
 * Filters emails by state
 * @param state - The state to filter by
 * @param list - The list of masked emails
 * @returns The {@link MaskedEmail} list filtered by state
 */
export const filterByState = (
  state: MaskedEmailState,
  list: MaskedEmail[]
): MaskedEmail[] | [] => {
  return list.filter((me) => me.state === state);
};

/**
 * Filters emails by forDomain
 * @param domain - The domain to filter by
 * @param list - The list of {@link MaskedEmail} objects
 */
export const filterByForDomain = (
  domain: string,
  list: MaskedEmail[]
): MaskedEmail[] | [] => {
  return list.filter((me) => me.forDomain === domain);
};
