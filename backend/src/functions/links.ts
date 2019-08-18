import { getLinkById } from "../database/links";

export interface Link {
  id: string;
  url: string;
  title: string;
  inserted: Date;
}

export async function getLinkByIdFn(id: string) {
  const link = await getLinkById(id);

  if (!link) {
    throw new Error("Invalid ID");
  }

  return link;
}
