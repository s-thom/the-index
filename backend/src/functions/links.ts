import { getLinkById, insertLink } from "../database/links";
import { getOrInsertTags, addTagsToLink } from "../database/tags";

export interface Link {
  id: string;
  url: string;
  title: string;
  inserted: Date;
}

export async function getLinkByIdFn(id: string) {
  if (typeof id !== "string") {
    throw new Error("Invalid ID");
  }

  const link = await getLinkById(id);

  if (!link) {
    throw new Error("Invalid ID");
  }

  return link;
}

export async function addNewLinkFn(url: string, title: string, tags: string[]) {
  if (typeof url !== "string") {
    throw new Error("Invalid URL");
  }
  if (typeof title !== "string") {
    throw new Error("Invalid title");
  }
  if (!Array.isArray(tags)) {
    throw new Error("Invalid tags");
  }

  // Add/fetch tags
  const tagsPromise = getOrInsertTags(tags);

  // Insert new Link
  const linkPromise = insertLink(url, title);

  // Wait for both to complete, they can be done async
  const [tagValues, link] = await Promise.all([tagsPromise, linkPromise]);
  if (!(tagValues && link)) {
    throw new Error("Unable to save");
  }

  // Insert link/tag entries
  await addTagsToLink(link.id, Array.from(tagValues.keys()));

  return link.id;
}
