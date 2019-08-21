import { searchLinksByTagsFn } from "../functions/search";
import { LinkDetail } from "../functions/links";
import { wrapPromiseRoute } from "../util";

interface SearchLinksByTagsRequest {
  tags: string[];
}

interface SearchLinksByTagsResponse {
  links: LinkDetail[];
}

export const searchLinksByTags = wrapPromiseRoute<
  SearchLinksByTagsRequest,
  SearchLinksByTagsResponse
>(async (body, req) => {
  const links = await searchLinksByTagsFn(body.tags);

  return {
    links
  };
});
