import { wrapPromiseRoute } from "../util/request";
import { getMostCommonTagsForUserFn } from "../functions/tags";
import StatusError, { CODES } from "../util/StatusError";

interface MostCommonTagsRequest {}

interface MostCommonTagsResponse {
  tags: string[];
}

export const searchLinksByTags = wrapPromiseRoute<
  MostCommonTagsRequest,
  MostCommonTagsResponse
>(async (body, params, token) => {
  if (!token) {
    throw new StatusError(CODES.UNAUTHORIZED, "Not logged in");
  }

  const tags = await getMostCommonTagsForUserFn(token.userId);

  return {
    tags
  };
});
