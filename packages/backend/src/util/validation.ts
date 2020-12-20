import { Params } from './request';
import StatusError, { CODES } from './StatusError';

const IDENTIFIER_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
export function isValidIdentifier(value: string) {
  return IDENTIFIER_REGEX.test(value);
}

/**
 * Gets a parameter, throwing if it is invalid
 * @param params Params object to check
 * @param key Key of the parameter
 * @param optional Whether the parameter is optional
 */
export function getParam(params: Params, key: string): string;
export function getParam<T>(params: Params, key: string, validator: (param: any) => T): T;
export function getParam<T>(params: Params, key: string, validator?: (param: any) => T) {
  if (validator) {
    try {
      validator(params[key]);
    } catch (err) {
      throw new StatusError(CODES.BAD_REQUEST, `Invalid parameter "${key}"`);
    }
  } else if (typeof params[key] === 'string') {
    return params[key];
  } else {
    throw new StatusError(CODES.BAD_REQUEST, `Invalid parameter "${key}"`);
  }
  return undefined;
}

export const VALIDATORS = {
  optionalString: (param: any) => {
    if (typeof param === 'string' || param === undefined) {
      return param as string | undefined;
    }
    throw new Error();
  },
};
