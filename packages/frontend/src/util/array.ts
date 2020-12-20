/* eslint-disable import/prefer-default-export */

/**
 * Deduplicates values from an array
 * @param array Array to deduplicate
 */
export function deduplicate<T>(array: T[]) {
  return array.filter((v, i, a) => a.indexOf(v) === i);
}
