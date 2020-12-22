import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useDeepMemo from './useDeepMemo';

type ParamHookReturn<T> = [
  /**
   * The value of the parameter
   */
  value: T,
  /**
   * Callback to set the value of the parameter.
   * A value of `undefined` will remove the parameter
   */
  setValue: (newValue: T | undefined) => void,
];

export function useStringParam(key: string): ParamHookReturn<string> {
  const { push } = useHistory();
  const { search } = useLocation();

  const setValue = useCallback(
    (newValue: string | undefined) => {
      const currentQuery = queryString.parse(search, {
        arrayFormat: 'comma',
      });
      currentQuery[key] = newValue ?? null;
      const query = queryString.stringify(currentQuery, {
        arrayFormat: 'comma',
      });

      push(`?${query}`);
    },
    [key, push, search],
  );

  const value = useMemo(() => {
    const queryValue =
      queryString.parse(search, {
        arrayFormat: 'comma',
      })[key] ?? '';
    if (Array.isArray(queryValue)) {
      return queryValue.join(',');
    }
    return queryValue;
  }, [key, search]);

  return [value, setValue];
}

export function useArrayParam(key: string): ParamHookReturn<string[]> {
  const { push } = useHistory();
  const { search } = useLocation();

  const setValue = useCallback(
    (newValue: string[] | undefined) => {
      const currentQuery = queryString.parse(search, {
        arrayFormat: 'comma',
      });
      currentQuery[key] = newValue ?? null;
      const query = queryString.stringify(currentQuery, {
        arrayFormat: 'comma',
      });

      push(`?${query}`);
    },
    [key, push, search],
  );

  const value = useMemo(() => {
    const queryValue =
      queryString.parse(search, {
        arrayFormat: 'comma',
      })[key] ?? [];
    if (Array.isArray(queryValue)) {
      return queryValue.sort();
    }
    if (typeof queryValue === 'string') {
      return [queryValue];
    }
    return [];
  }, [key, search]);

  const memoisedValue = useDeepMemo(value);

  return [memoisedValue, setValue];
}
