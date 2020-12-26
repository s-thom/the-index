/**
 * Similar to `Partial<T>`, but only applies to keys in `K`.
 * i.e. the value of any key not in `K` is still the original type on `T`
 */
export type PickPartial<T, K extends keyof T> = Partial<T> & Pick<T, K>;
