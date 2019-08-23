import { Params } from "./request";
import StatusError, { CODES } from "./StatusError";

const IDENTIFIER_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
export function isValidIdentifier(value: string) {
  return IDENTIFIER_REGEX.test(value);
}
