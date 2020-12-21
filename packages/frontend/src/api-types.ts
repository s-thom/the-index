/* Generated by restful-react */

import { customGet, customMutate, CustomGetProps, CustomMutateProps } from './util/fetchers';
/**
 * Login request with no credentials
 */
export interface PostLoginRequest {
  /**
   * The name of the user logging in
   */
  name: string;
}

/**
 * Login request with a TOTP code
 */
export interface PostLoginTOTPRequest {
  /**
   * The name of the user logging in
   */
  name: string;
  /**
   * The challenge issued
   */
  challenge: 'TOTP';
  /**
   * The response to the challenge
   */
  response: string;
}

/**
 * Successful response
 */
export interface PostLoginSuccessResponse {
  /**
   * The JWT bearer token
   */
  token: string;
  /**
   * The decoded content of the token
   */
  content: {
    /**
     * The ID of the user
     */
    userId: string;
  };
}

/**
 * Challenge required response
 */
export interface PostLoginChallengeResponse {
  /**
   * A code referring to why the user was not authorised
   */
  requires: 'challenge';
  /**
   * Whether TOTP can be used to satisfy the challenge
   */
  totp: boolean;
}

/**
 * Setup required response
 */
export interface PostLoginSetupResponse {
  /**
   * A code referring to why the user was not authorised
   */
  requires: 'setup';
  /**
   * The secret code for TOTP authentication
   */
  code: string;
  /**
   * A URL that can be used to import the TOTP secret into an authenticator app
   */
  url: string;
}

/**
 * A link stored in the-index
 */
export interface LinkDetail {
  /**
   * The ID of the link
   */
  id: string;
  /**
   * The URL of the link
   */
  url: string;
  /**
   * List of tags associated with the link
   */
  tags: string[];
  /**
   * The date the link was added
   */
  inserted: string;
  /**
   * The user that added the link
   */
  user: {
    /**
     * The ID of the user
     */
    id: string;
    /**
     * The name of the user
     */
    name: string;
  };
}

/**
 * Log in
 *
 * Log in to the-index
 *
 */
export function postLogin(
  props: CustomMutateProps<
    PostLoginSuccessResponse | PostLoginChallengeResponse | PostLoginSetupResponse,
    void,
    void,
    PostLoginRequest | PostLoginTOTPRequest,
    void
  >,
  signal?: RequestInit['signal'],
) {
  return customMutate<
    PostLoginSuccessResponse | PostLoginChallengeResponse | PostLoginSetupResponse,
    void,
    void,
    PostLoginRequest | PostLoginTOTPRequest,
    void
  >('POST', `/login`, props, signal);
}

export interface GetTagsResponse {
  /**
   * The list of tags
   */
  tags: string[];
}

export interface GetTagsQueryParams {
  /**
   * List of tags to exclude
   */
  excludeTags?: string[];
}

/**
 * Get common tags
 *
 * Gets a list of the most commonly used tags by the current user
 *
 */
export function getTags(
  props: CustomGetProps<GetTagsResponse, void, GetTagsQueryParams, void>,
  signal?: RequestInit['signal'],
) {
  return customGet<GetTagsResponse, void, GetTagsQueryParams, void>(`/tags`, props, signal);
}

export interface PostSearchResponse {
  /**
   * The list of links
   */
  links: LinkDetail[];
}

export interface PostSearchQueryParams {
  /**
   * List of tags to exclude
   */
  excludeTags?: string[];
}

export interface PostSearchRequestBody {
  /**
   * List of tags to search on
   */
  tags: string[];
  /**
   * The upper bound for the time a link was added
   */
  before?: string;
  /**
   * The lower bound for the time a link was added
   */
  after?: string;
}

/**
 * Search links
 *
 * Searches for links matching the given parameters
 *
 */
export function postSearch(
  props: CustomMutateProps<PostSearchResponse, void, PostSearchQueryParams, PostSearchRequestBody, void>,
  signal?: RequestInit['signal'],
) {
  return customMutate<PostSearchResponse, void, PostSearchQueryParams, PostSearchRequestBody, void>(
    'POST',
    `/search`,
    props,
    signal,
  );
}

export interface PostLinksResponse {
  /**
   * The ID of the newly added link
   */
  id: string;
}

export interface PostLinksRequestBody {
  /**
   * The link to be added
   */
  url: string;
  /**
   * List of tags to add to the link
   */
  tags: string[];
}

/**
 * Add new link
 *
 * Adds a new link
 *
 */
export function postLinks(
  props: CustomMutateProps<PostLinksResponse, void, void, PostLinksRequestBody, void>,
  signal?: RequestInit['signal'],
) {
  return customMutate<PostLinksResponse, void, void, PostLinksRequestBody, void>('POST', `/links`, props, signal);
}

export interface GetLinksIdResponse {
  link: LinkDetail;
}

export interface GetLinksIdPathParams {
  /**
   * The ID of the link
   */
  id: string;
}

/**
 * Get link detail
 *
 * Gets the detail of a single link
 *
 */
export function getLinksId(
  {
    id,
    ...props
  }: CustomGetProps<GetLinksIdResponse, void, void, GetLinksIdPathParams> & {
    /**
     * The ID of the link
     */
    id: string;
  },
  signal?: RequestInit['signal'],
) {
  return customGet<GetLinksIdResponse, void, void, GetLinksIdPathParams>(`/links/${id}`, props, signal);
}
