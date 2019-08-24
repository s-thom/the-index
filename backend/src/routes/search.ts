import { searchLinksByTagsFn } from "../functions/search";
import { LinkDetail } from "../functions/links";
import { wrapPromiseRoute } from "../util/request";
import StatusError, { CODES } from "../util/StatusError";

interface SearchLinksByTagsRequest {
  tags: string[];
}

interface SearchLinksByTagsResponse {
  links: LinkDetail[];
}

export const searchLinksByTags = wrapPromiseRoute<
  SearchLinksByTagsRequest,
  SearchLinksByTagsResponse
>(async (body, params, token) => {
  if (!token) {
    throw new StatusError(CODES.UNAUTHORIZED, "Not logged in");
  }

  const links = await searchLinksByTagsFn(body.tags, token.userId);

  return {
    links
  };
});
