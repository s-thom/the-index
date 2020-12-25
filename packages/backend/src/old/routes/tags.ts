import { GetTagsQueryParams, GetTagsResponse } from '../../api-types';
import { getMostCommonTagsForUserFn } from '../functions/tags';
import { wrapPromiseRoute } from '../util/request';
import StatusError, { CODES } from '../util/StatusError';

// eslint-disable-next-line import/prefer-default-export
export const getMostCommonTagsRoute = wrapPromiseRoute<GetTagsQueryParams, GetTagsResponse>(
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
