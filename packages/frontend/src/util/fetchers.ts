// Adapted from https://github.com/contiamo/restful-react/blob/master/examples/fetchers.ts

import qs from 'query-string';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CustomGetProps<ResponseType, ErrorType, QueryParamsType, PathParamsType> {
  queryParams?: QueryParamsType;
}

export function customGet<ResponseType, ErrorType, QueryParamsType, PathParamsType>(
  path: string,
  props: CustomGetProps<ResponseType, ErrorType, QueryParamsType, PathParamsType>,
  signal?: RequestInit['signal'],
): Promise<ResponseType> {
  let url = path;
  if (props.queryParams && Object.keys(props.queryParams).length) {
    url += `?${qs.stringify(props.queryParams)}`;
  }
  return fetch(url, {
    headers: {
      'content-type': 'application/json',
    },
    signal,
  }).then((res) => res.json());
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CustomMutateProps<ResponseType, ErrorType, QueryParamsType, BodyType, PathParamsType> {
  body: BodyType;
  queryParams?: QueryParamsType;
}

export const customMutate = <ResponseType, ErrorType, QueryParamsType, BodyType, PathParamsType>(
  method: string,
  path: string,
  props: CustomMutateProps<ResponseType, ErrorType, QueryParamsType, BodyType, PathParamsType>,
  signal?: RequestInit['signal'],
): Promise<ResponseType> => {
  let url = path;
  if (method === 'DELETE' && typeof props.body === 'string') {
    url += `/${props.body}`;
  }
  if (props.queryParams && Object.keys(props.queryParams).length) {
    url += `?${qs.stringify(props.queryParams)}`;
  }
  return fetch(url, {
    method,
    body: JSON.stringify(props.body),
    headers: {
      'content-type': 'application/json',
    },
    signal,
  }).then((res) => res.json());
};
