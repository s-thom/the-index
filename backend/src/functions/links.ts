import { getLinkById, insertLink } from "../database/links";
import {
  getOrInsertTags,
  addTagsToLink,
  getTagsForLinkId
} from "../database/tags";

export interface Link {
  id: string;
  url: string;
  inserted: Date;
  userId: string;
}

export interface LinkDetail extends Link {
  tags: string[];
}

export async function getLinkByIdFn(id: string, userId: string) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID");
  }

  const link = await getLinkById(id, userId);

  if (!link) {
    throw new Error("Invalid ID");
  }

  return link;
}

export async function getLinkDetailByIdFn(
  id: string,
  userId: string
): Promise<LinkDetail> {
  if (typeof id !== "string") {
    throw new Error("Invalid ID");
  }

  const link = await getLinkById(id, userId);

  if (!link) {
    throw new Error("Invalid ID");
  }

  const tagsInfo = await getTagsForLinkId(id, userId);

  return {
    ...link,
    tags: tagsInfo.map(tag => tag.name)
  };
}

export async function addNewLinkFn(
  url: string,
  tags: string[],
  userId: string
) {
  if (typeof url !== "string") {
    throw new Error("Invalid URL");
  }
  if (!Array.isArray(tags)) {
    throw new Error("Invalid tags");
  }

  // Add/fetch tags
  const tagsPromise = getOrInsertTags(tags);

  // Insert new Link
  const linkPromise = insertLink(url, userId);

  // Wait for both to complete, they can be done async
  const [tagValues, link] = await Promise.all([tagsPromise, linkPromise]);
  if (!(tagValues && link)) {
    throw new Error("Unable to save");
  }

  // Insert link/tag entries
  await addTagsToLink(link.id, Array.from(tagValues.keys()));

  return link.id;
}
