import queryString from 'query-string';
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useDeepMemo from './useDeepMemo';

type ParamValue = string | string[] | undefined;

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

export function useParams(): [params: Record<string, ParamValue>, setParams: (newParams: unknown) => void] {
  const { push } = useHistory();
  const { search } = useLocation();

  const value = useMemo(() => {
    const parsed = queryString.parse(search, {
      arrayFormat: 'comma',
    });

    const normalised: Record<string, ParamValue> = {};
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

export function useStringParam(key: string): ParamHookReturn<string> {
  const [params, setParams] = useParams();

  const setValue = useCallback(
    (newValue: string | undefined) => {
      setParams({
        ...params,
        [key]: newValue,
      });
    },
    [key, params, setParams],
  );

  const value = useMemo(() => {
    const queryValue = params[key] ?? '';
    if (Array.isArray(queryValue)) {
      return queryValue.join(',');
    }
    return queryValue;
  }, [key, params]);

  return [value, setValue];
}

export function useArrayParam(key: string): ParamHookReturn<string[]> {
  const [params, setParams] = useParams();

  const setValue = useCallback(
    (newValue: string[] | undefined) => {
      setParams({
        ...params,
        [key]: newValue,
      });
    },
    [key, params, setParams],
  );

  const value = useMemo(() => {
    const queryValue = params[key];
    if (Array.isArray(queryValue)) {
      return queryValue;
    }
    if (typeof queryValue === 'string') {
      return [queryValue];
    }
    return [];
  }, [key, params]);

  return [value, setValue];
}
