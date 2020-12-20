import { wrapPromiseRoute } from '../util/request';
import { getMostCommonTagsForUserFn } from '../functions/tags';
import StatusError, { CODES } from '../util/StatusError';

interface MostCommonTagsRequest {}

interface MostCommonTagsResponse {
  tags: string[];
}

// eslint-disable-next-line import/prefer-default-export
export const getMostCommonTagsRoute = wrapPromiseRoute<MostCommonTagsRequest, MostCommonTagsResponse>(
  async (body, params, token) => {
    if (!token) {
      throw new StatusError(CODES.UNAUTHORIZED, 'Not logged in');
    }

    const excludeTags = params.excludeTags ? params.excludeTags.split(',') : [];

    const tags = await getMostCommonTagsForUserFn(token.userId, excludeTags);

    return {
      tags,
    };
  },
);
