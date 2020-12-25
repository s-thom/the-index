import { getMostCommonTagsForUser } from '../database/tags';

export interface Tag {
  id: string;
  name: string;
  userId: string;
}

export async function getMostCommonTagsForUserFn(userId: string, excludeTags: string[]): Promise<string[]> {
  const tags = await getMostCommonTagsForUser(userId, excludeTags);
  return tags.map((t) => t.name);
}
