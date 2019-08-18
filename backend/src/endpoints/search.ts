import { Request, Response } from "express";
import { searchLinksByTagsFn } from "../functions/search";
import { LinkDetail } from "../functions/links";

interface SearchLinksByTagsRequest {
  tags: string[];
}

interface SearchLinksByTagsResponse {
  links: LinkDetail[];
}

export async function searchLinksByTags(req: Request, res: Response) {
  try {
    const body: SearchLinksByTagsRequest = req.body;

    const links = await searchLinksByTagsFn(body.tags);

    const response: SearchLinksByTagsResponse = {
      links
    };
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
