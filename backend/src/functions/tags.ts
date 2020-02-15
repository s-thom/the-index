import { getMostCommonTagsForUser } from "../database/tags";

export interface Tag {
  id: string;
  name: string;
  userId: string;
}

export async function getMostCommonTagsForUserFn(
  userId: string
): Promise<string[]> {
  const tags = await getMostCommonTagsForUser(userId);
  return tags.map(t => t.id);
}
