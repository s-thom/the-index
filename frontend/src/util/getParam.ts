import queryString from "query-string";

const location = window.location;

/**
 * Parses the query param to a string
 * @param value Value to parse
 */
export function getParamAsString(key: string): string {
  const value = queryString.parse(location.search)[key];
  if (value) {
    if (Array.isArray(value)) {
      throw new Error("Tried to get param as string, but got an array instead");
    } else {
      return value;
    }
  } else {
    return "";
  }
}

/**
 * Parses the query param to a string array
 * @param value Value to parse
 */
export function getParamAsArray(key: string): string[] {
  const value = queryString.parse(location.search, { arrayFormat: "comma" })[
    key
  ];
  if (value) {
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  } else {
    return [];
  }
}
