/**
 * Transformer for Yup validation. Converts non-array values to an array
 * @param value Current transformed value
 * @param originalValue Original value before prior transformation
 */
// eslint-disable-next-line import/prefer-default-export
export function arrayTransformer(value: unknown, originalValue: unknown): string[] | unknown {
  if (Array.isArray(originalValue)) {
    return originalValue;
  }

  return [originalValue];
}
