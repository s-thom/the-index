import { PostSearchRequestBody, PostSearchResponse } from '../api-types';
import { searchLinksByTagsFn } from '../functions/search';
import { wrapPromiseRoute } from '../util/request';
import StatusError, { CODES } from '../util/StatusError';

// eslint-disable-next-line import/prefer-default-export
export const searchLinksByTags = wrapPromiseRoute<PostSearchRequestBody, PostSearchResponse>(
  async (body, params, token) => {
    if (!token) {
      throw new StatusError(CODES.UNAUTHORIZED, 'Not logged in');
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
      links,
    };
  },
);
