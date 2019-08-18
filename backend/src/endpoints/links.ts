import { Request, Response } from "express";
import { Link, getLinkByIdFn, addNewLink } from "../functions/links";

interface GetLinkResponse {
  link: Link;
}

interface AddNewLinkRequest {
  url: string;
  title: string;
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

    const link = await getLinkByIdFn(id);

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

    const newLinkId = await addNewLink(body.url, body.title, body.tags);

    const response: AddNewLinkResponse = {
      id: newLinkId
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
