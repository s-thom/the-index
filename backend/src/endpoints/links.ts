import { Request, Response } from "express";
import { Link, getLinkByIdFn } from "../functions/links";

interface GetLinkResponse {
  link: Link;
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
