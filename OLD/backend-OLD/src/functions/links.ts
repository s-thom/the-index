import urlRegex from "url-regex-safe";
import { getLinkById, insertLink } from "../database/links";
import {
  getOrInsertTags,
  addTagsToLink,
  getTagsForLinkId
} from "../database/tags";
import { getUserById } from "../database/users";

export interface Link {
  id: string;
  url: string;
  inserted: Date;
  userId: string;
}

export interface LinkDetail {
  id: string;
  url: string;
  inserted: Date;
  tags: string[];
  user: {
    id: string;
    name: string;
  };
}

const URL_REGEX = urlRegex({ strict: false, exact: true });

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

  const tagsInfoPromise = getTagsForLinkId(id, userId);
  const userInfoPromise = getUserById(userId);

  const [tagsInfo, userInfo] = await Promise.all([
    tagsInfoPromise,
    userInfoPromise
  ]);

  if (!userInfo) {
    throw new Error("Unable to get user info");
  }

  return {
    id: link.id,
    url: link.url,
    inserted: link.inserted,
    tags: (tagsInfo || []).map(tag => tag.name),
    user: {
      id: userInfo.id,
      name: userInfo.name
    }
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
  if (!URL_REGEX.test(url)) {
    throw new Error("Invalid URL");
  }
  if (!Array.isArray(tags)) {
    throw new Error("Invalid tags");
  }

  // Add/fetch tags
  const tagsPromise = getOrInsertTags(tags, userId);

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
