/* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */

import { Tag } from '../../functions/tags';

export async function getAllTags(): Promise<Tag[]> {
  return [
    {
      id: '1',
      name: 'example',
      userId: 'user',
    },
    {
      id: '2',
      name: 'test',
      userId: 'user',
    },
    {
      id: '3',
      name: 'another',
      userId: 'user',
    },
  ];
}

export async function insertTag(tagName: string): Promise<Tag | null> {
  switch (tagName) {
    case 'example':
      return {
        id: '1',
        name: tagName,
        userId: 'user',
      };
    case 'null':
      return null;
    default:
      throw new Error('Unmocked value');
  }
}

export async function getOrInsertTags(tags: string[]): Promise<Map<string, Tag>> {
  const mapEntries = tags.map(
    (tag, index) =>
      [
        index.toString(),
        {
          id: index.toString(),
          name: tag,
        },
      ] as [string, Tag],
  );

  return new Map(mapEntries);
}

export async function addTagsToLink(linkId: string, tagIds: string[]) {}

export async function searchLinkIdsByTags(
  tags: string[],
  userId: string,
  dateRange: {
    before?: Date;
    after?: Date;
  },
): Promise<string[]> {
  return ['1'];
}

export async function getTagsForLinkId(linkId: string, userId: string): Promise<Tag[]> {
  return [
    {
      id: '1',
      name: 'example',
      userId: 'user',
    },
    {
      id: '2',
      name: 'test',
      userId: 'user',
    },
    {
      id: '3',
      name: 'another',
      userId: 'user',
    },
  ];
}
