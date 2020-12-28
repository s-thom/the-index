import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useDeepMemo from './useDeepMemo';

type TypeOrArray<T> = T | T[];

export type QueryType = { [x: string]: TypeOrArray<string | number | boolean> | undefined };

export default function useParams(): [params: QueryType, setParams: (newParams: unknown) => void] {
  const { push } = useHistory();
  const { search } = useLocation();

  const value = useMemo(() => {
    const parsed = queryString.parse(search, {
      arrayFormat: 'comma',
      parseBooleans: true,
      parseNumbers: true,
    });

    const normalised: QueryType = {};
    Object.keys(parsed).forEach((key) => {
      normalised[key] = parsed[key] ?? undefined;
    });
    return normalised;
  }, [search]);
  const memoisedValue = useDeepMemo(value);

  const setValue = useCallback(
    (newValue: unknown) => {
      const query = queryString.stringify(newValue as any, {
        arrayFormat: 'comma',
      });

      push(`?${query}`);
    },
    [push],
  );

  return [memoisedValue, setValue];
}
