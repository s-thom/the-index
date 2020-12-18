import { searchLinksByTagsFn } from "../functions/search";
import { LinkDetail } from "../functions/links";
import { wrapPromiseRoute } from "../util/request";
import StatusError, { CODES } from "../util/StatusError";

interface SearchLinksByTagsRequest {
  tags: string[];
  before?: string;
  after?: string;
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

  const range: {
    before?: Date;
    after?: Date;
  } = {};

  if (body.before) {
    range.before = new Date(body.before);
  }
  if (body.after) {
    range.after = new Date(body.after);
  }

  const links = await searchLinksByTagsFn(body.tags, token.userId, range);

  return {
    links
  };
});
