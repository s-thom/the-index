/**
 * Generates a range of numbers within the bounds, centred on the current value
 * @param current The current value
 * @param min The minimum allowed value
 * @param max The maximum allowed value
 * @param maxLength The maximum number of items allowed in the list
 */
// eslint-disable-next-line import/prefer-default-export
export function generateNumberRange(current: number, min: number, max: number, maxLength: number): number[] {
  // The maximum length of the final array
  const clampedLength = Math.max(Math.min(maxLength, max - min + 1), 1);

  const leftRange = Math.floor((clampedLength - 1) / 2);
  const rightRange = Math.ceil((clampedLength - 1) / 2);

  let start: number;
  if (current - leftRange < min) {
    start = min;
  } else if (current + rightRange > max) {
    start = max - (clampedLength - 1);
  } else {
    start = current - leftRange;
  }

  return [...Array(clampedLength)].map((_, i) => start + i);
}
