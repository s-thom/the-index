import {
  LinkDetail,
  getLinkDetailByIdFn,
  addNewLinkFn
} from "../functions/links";
import { wrapPromiseRoute } from "../util";

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

export const getLinkByRouteId = wrapPromiseRoute<any, GetLinkResponse>(
  async (body, req) => {
    const id = req.param("id");
    if (!id) {
      throw new Error('No "id" parameter specified');
    }

    const link = await getLinkDetailByIdFn(id);

    return {
      link
    };
  }
);

export const addNewLinkRoute = wrapPromiseRoute<
  AddNewLinkRequest,
  AddNewLinkResponse
>(async (body, req) => {
  const newLinkId = await addNewLinkFn(body.url, body.tags);

  return {
    id: newLinkId
  };
});
