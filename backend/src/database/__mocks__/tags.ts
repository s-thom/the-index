import { Tag } from "../../functions/tags";

export async function getAllTags(): Promise<Tag[] | null> {
  // TODO:
  return null;
}

export async function insertTag(tagName: string): Promise<Tag | null> {
  switch (tagName) {
    case "example":
      return {
        id: "1",
        name: tagName
      };
    case "null":
      return null;
    default:
      throw new Error("Unmocked value");
  }
}

export async function getOrInsertTags(
  tags: string[]
): Promise<Map<string, Tag>> {
  const mapEntries = tags.map(
    (tag, index) =>
      [
        index.toString(),
        {
          id: index.toString(),
          name: tag
        }
      ] as [string, Tag]
  );

  return new Map(mapEntries);
}

export async function addTagsToLink(linkId: string, tagIds: string[]) {}
