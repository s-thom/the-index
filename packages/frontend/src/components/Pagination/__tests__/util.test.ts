import { generateNumberRange } from '../util';

describe('generateNumberRange', () => {
  it('should generate lists of number for the correct ranges', () => {
    // Normal range
    expect(generateNumberRange(3, 1, 5, 3)).toEqual([2, 3, 4]);
    // Start of range
    expect(generateNumberRange(1, 1, 5, 3)).toEqual([1, 2, 3]);
    // End of range
    expect(generateNumberRange(5, 1, 5, 3)).toEqual([3, 4, 5]);
    // Constrained by min/max
    expect(generateNumberRange(1, 1, 1, 3)).toEqual([1]);
    // Constrained by max length
    expect(generateNumberRange(3, 1, 5, 1)).toEqual([3]);
    // Out of range (too low)
    expect(generateNumberRange(-10, 1, 5, 3)).toEqual([1, 2, 3]);
    // Out of range (too high)
    expect(generateNumberRange(20, 1, 5, 3)).toEqual([3, 4, 5]);
  });
});
