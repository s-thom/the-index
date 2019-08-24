import { LinkDetail, getLinkDetailByIdFn } from "./links";
import { searchLinkIdsByTags } from "../database/tags";

export async function searchLinksByTagsFn(
  tags: string[],
  userId: string
): Promise<LinkDetail[]> {
  if (!Array.isArray(tags)) {
    throw new Error("Invalid tags");
  }

  const linkIds = await searchLinkIdsByTags(tags, userId);

  const detailPromises = linkIds.map(id => getLinkDetailByIdFn(id, userId));

  const details = await Promise.all(detailPromises);
  return details;
}
