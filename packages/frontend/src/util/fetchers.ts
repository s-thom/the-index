// Adapted from https://github.com/contiamo/restful-react/blob/master/examples/fetchers.ts

import axios, { AxiosResponse } from 'axios';
import qs from 'query-string';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CustomGetProps<ResponseType, ErrorType, QueryParamsType, PathParamsType> {
  queryParams?: QueryParamsType;
}

export function customGet<ResponseType, ErrorType, QueryParamsType, PathParamsType>(
  path: string,
  props: CustomGetProps<ResponseType, ErrorType, QueryParamsType, PathParamsType>,
): Promise<ResponseType> {
  let url = path;
  if (props.queryParams && Object.keys(props.queryParams).length) {
    url += `?${qs.stringify(props.queryParams as any)}`;
  }

  return axios
    .request<any, AxiosResponse<ResponseType>>({ method: 'GET', url, headers: { 'content-type': 'application/json' } })
    .then((response) => response.data);
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
): Promise<ResponseType> => {
  let url = path;
  if (method === 'DELETE' && typeof props.body === 'string') {
    url += `/${props.body}`;
  }
  if (props.queryParams && Object.keys(props.queryParams).length) {
    url += `?${qs.stringify(props.queryParams as any)}`;
  }

  return axios
    .request<any, AxiosResponse<ResponseType>>({
      method: method as any,
      url,
      data: props.body,
      headers: { 'content-type': 'application/json' },
    })
    .then((response) => response.data);
};
