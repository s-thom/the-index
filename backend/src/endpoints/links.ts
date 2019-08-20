import { Request, Response } from "express";
import {
  LinkDetail,
  getLinkDetailByIdFn,
  addNewLinkFn
} from "../functions/links";

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

export async function getLinkByIdRoute(req: Request, res: Response) {
  try {
    const id = req.param("id");
    if (!id) {
      throw new Error('No "id" parameter specified');
    }

    const link = await getLinkDetailByIdFn(id);

    const response: GetLinkResponse = {
      link
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}

export async function addNewLinkRoute(req: Request, res: Response) {
  try {
    const body: AddNewLinkRequest = req.body;

    const newLinkId = await addNewLinkFn(body.url, body.tags);

    const response: AddNewLinkResponse = {
      id: newLinkId
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
