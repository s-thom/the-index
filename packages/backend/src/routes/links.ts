import { GetLinksIdResponse, PostLinksRequestBody, PostLinksResponse } from '../api-types';
import { addNewLinkFn, getLinkDetailByIdFn } from '../functions/links';
import { wrapPromiseRoute } from '../util/request';
import StatusError, { CODES } from '../util/StatusError';
import { getParam } from '../util/validation';

export const getLinkByIdRoute = wrapPromiseRoute<any, GetLinksIdResponse>(async (body, params, token) => {
  const id = getParam(params, 'id');

  if (!token) {
    throw new StatusError(CODES.UNAUTHORIZED, 'Not logged in');
  }

  const link = await getLinkDetailByIdFn(id, token.userId);

  return {
    link,
  };
});

export const addNewLinkRoute = wrapPromiseRoute<PostLinksRequestBody, PostLinksResponse>(
  async (body, params, token) => {
    if (!token) {
      throw new StatusError(CODES.UNAUTHORIZED, 'Not logged in');
    }

    const newLinkId = await addNewLinkFn(body.url, body.tags, token.userId);

    return {
      id: newLinkId,
    };
  },
);
