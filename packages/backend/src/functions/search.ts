import { LinkDetail, getLinkDetailByIdFn } from './links';
import { searchLinkIdsByTags } from '../database/tags';

// eslint-disable-next-line import/prefer-default-export
export async function searchLinksByTagsFn(
  tags: string[],
  userId: string,
  dateRange: {
    before?: Date;
    after?: Date;
  },
): Promise<LinkDetail[]> {
  if (!Array.isArray(tags)) {
    throw new Error('Invalid tags');
  }

  const linkIds = await searchLinkIdsByTags(tags, userId, dateRange);

  const detailPromises = linkIds.map((id) => getLinkDetailByIdFn(id, userId));

  const details = await Promise.all(detailPromises);
  return details;
}
