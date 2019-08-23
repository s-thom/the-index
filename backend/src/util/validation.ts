import { Params } from "./request";
import StatusError, { CODES } from "./StatusError";

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
export function getParam(
  params: Params,
  key: string,
  optional: true
): string | undefined;
export function getParam(params: Params, key: string, optional = false) {
  if (
    typeof params[key] === "string" ||
    (optional && params[key] === undefined)
  ) {
    return params[key];
  } else {
    throw new StatusError(CODES.BAD_REQUEST, `Invalid parameter "${key}"`);
  }
}
