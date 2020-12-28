import * as Yup from 'yup';
import { arrayTransformer } from '../yup';

describe('arrayTransformer', () => {
  it('should coerce different values to be an array', async () => {
    const validator = Yup.array().transform(arrayTransformer).defined();

    await expect(validator.validate([])).resolves.toEqual([]);
    await expect(validator.validate(['foo', 'bar'])).resolves.toEqual(['foo', 'bar']);
    await expect(validator.validate([5, true])).resolves.toEqual([5, true]);
    await expect(validator.validate('foo')).resolves.toEqual(['foo']);
    await expect(validator.validate(5)).resolves.toEqual([5]);
    await expect(validator.validate(true)).resolves.toEqual([true]);
    await expect(validator.validate([undefined])).resolves.toEqual([undefined]);
  });
});
