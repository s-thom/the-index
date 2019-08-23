import {
  LinkDetail,
  getLinkDetailByIdFn,
  addNewLinkFn
} from "../functions/links";
import { wrapPromiseRoute } from "../util";
import StatusError, { CODES } from "../StatusError";

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

export const getLinkByIdRoute = wrapPromiseRoute<any, GetLinkResponse>(
  async (body, params, token) => {
    const id = params.id;
    if (!id) {
      throw new Error('No "id" parameter specified');
    }
    if (typeof id !== "string") {
      throw new Error('Invalid "id" parameter specified');
    }

    if (!token) {
      throw new StatusError(CODES.UNAUTHORIZED, "Not logged in");
    }

    const link = await getLinkDetailByIdFn(id, token.userId);

    return {
      link
    };
  }
);

export const addNewLinkRoute = wrapPromiseRoute<
  AddNewLinkRequest,
  AddNewLinkResponse
>(async (body, params, token) => {
  if (!token) {
    throw new StatusError(CODES.UNAUTHORIZED, "Not logged in");
  }

  const newLinkId = await addNewLinkFn(body.url, body.tags, token.userId);

  return {
    id: newLinkId
  };
});
