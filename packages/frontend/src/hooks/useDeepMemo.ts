import equals from 'fast-deep-equal';
import { useRef } from 'react';

export default function useDeepMemo<T>(value: T): T {
  const ref = useRef(value);

  if (equals(value, ref.current)) {
    return ref.current;
  }

  ref.current = value;
  return value;
}
