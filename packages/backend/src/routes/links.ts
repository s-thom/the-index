import { LinkDetail, getLinkDetailByIdFn, addNewLinkFn } from '../functions/links';
import { wrapPromiseRoute } from '../util/request';
import StatusError, { CODES } from '../util/StatusError';
import { getParam } from '../util/validation';

interface GetLinkResponse {
  link: LinkDetail;
}

interface AddNewLinkRequest {
  url: string;
  tags: string[];
}

interface AddNewLinkResponse {
  id: string;
}

export const getLinkByIdRoute = wrapPromiseRoute<any, GetLinkResponse>(async (body, params, token) => {
  const id = getParam(params, 'id');

  if (!token) {
    throw new StatusError(CODES.UNAUTHORIZED, 'Not logged in');
  }

  const link = await getLinkDetailByIdFn(id, token.userId);

  return {
    link,
  };
});

export const addNewLinkRoute = wrapPromiseRoute<AddNewLinkRequest, AddNewLinkResponse>(async (body, params, token) => {
  if (!token) {
    throw new StatusError(CODES.UNAUTHORIZED, 'Not logged in');
  }

  const newLinkId = await addNewLinkFn(body.url, body.tags, token.userId);

  return {
    id: newLinkId,
  };
});
