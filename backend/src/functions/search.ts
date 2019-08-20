import { LinkDetail, getLinkDetailByIdFn } from "./links";
import { searchLinkIdsByTags } from "../database/tags";

export async function searchLinksByTagsFn(
  tags: string[]
): Promise<LinkDetail[]> {
  if (!Array.isArray(tags)) {
    throw new Error("Invalid tags");
  }

  const linkIds = await searchLinkIdsByTags(tags);

  const detailPromises = linkIds.map(getLinkDetailByIdFn);

  const details = await Promise.all(detailPromises);
  return details;
}
