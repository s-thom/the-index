import { mockTypeOrmService, seedDatabase } from '../../../../utils/test-db-utils';
import { mockLoggerService } from '../../../../utils/test-utils';
import LinkRepositoryImpl from '../LinkRepositoryImpl';

describe('LinkRepositoryImpl', () => {
  describe('insert', () => {
    it('should add a link and its tags', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [{ id: 1, name: 'foo', user: { id: 1 } }],
        links: [],
      });

      const mockGetUserTags = jest.fn().mockResolvedValue([{ id: 1, name: 'foo' }]);

      const repository = new LinkRepositoryImpl(mockLoggerService, mockTypeOrmService, {
        getUserTags: mockGetUserTags,
      });
      await expect(
        repository.insert(
          { id: 1, name: 'stuart', created: new Date() },
          { reference: 'AAA', visibility: 'private', tags: ['foo', 'bar'], url: 'https://example.com' },
        ),
      ).resolves.toMatchObject({
        reference: 'AAA',
        visibility: 'private',
        tags: ['foo', 'bar'],
        url: 'https://example.com',
        user: { id: 1, name: 'stuart' },
      });
    });
  });

  describe('findByReference', () => {
    it('should find a link', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [{ id: 1, name: 'foo', user: { id: 1 } }],
        links: [
          {
            id: 1,
            reference: 'AAA',
            visibility: 'private',
            user: { id: 1 },
            tags: [{ id: 1 }],
            url: 'https://example.com',
          },
        ],
      });

      const repository = new LinkRepositoryImpl(mockLoggerService, mockTypeOrmService, { getUserTags: jest.fn() });
      await expect(
        repository.findByReference({ id: 1, name: 'stuart', created: new Date() }, 'AAA'),
      ).resolves.toMatchObject({
        reference: 'AAA',
        visibility: 'private',
        tags: ['foo'],
        url: 'https://example.com',
        user: { id: 1, name: 'stuart' },
      });
    });

    it('should throw if the link was not found', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [{ id: 1, name: 'foo', user: { id: 1 } }],
        links: [],
      });

      const repository = new LinkRepositoryImpl(mockLoggerService, mockTypeOrmService, { getUserTags: jest.fn() });
      await expect(repository.findByReference({ id: 1, name: 'stuart', created: new Date() }, 'AAA')).rejects.toEqual(
        new Error('Could not find link by reference AAA'),
      );
    });
  });

  describe('search', () => {
    it('should get links', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [
          { id: 1, name: 'foo', user: { id: 1 } },
          { id: 2, name: 'bar', user: { id: 1 } },
          { id: 3, name: 'baz', user: { id: 1 } },
        ],
        links: [
          {
            id: 1,
            reference: 'AAA',
            visibility: 'private',
            user: { id: 1 },
            tags: [{ id: 1 }, { id: 2 }],
            url: 'https://example.com',
          },
          {
            id: 2,
            reference: 'BBB',
            visibility: 'private',
            user: { id: 1 },
            tags: [{ id: 2 }, { id: 3 }],
            url: 'https://example.com',
          },
        ],
      });

      const repository = new LinkRepositoryImpl(mockLoggerService, mockTypeOrmService, { getUserTags: jest.fn() });
      await expect(
        repository.search({ id: 1, name: 'stuart', created: new Date() }, { tags: ['bar', 'baz'] }),
      ).resolves.toMatchObject({
        links: [
          { id: 2, reference: 'BBB', visibility: 'private', tags: expect.arrayContaining(['bar', 'baz']) },
          { id: 1, reference: 'AAA', visibility: 'private', tags: expect.arrayContaining(['foo', 'bar']) },
        ],
        pagination: { limit: 10, offset: 0, total: 2 },
      });
    });

    it('should filter links by creation date', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [
          { id: 1, name: 'foo', user: { id: 1 } },
          { id: 2, name: 'bar', user: { id: 1 } },
          { id: 3, name: 'baz', user: { id: 1 } },
        ],
        links: [
          {
            id: 1,
            reference: 'AAA',
            visibility: 'private',
            user: { id: 1 },
            tags: [{ id: 1 }, { id: 2 }],
            created: new Date('2019-01-01T00:00:00.000Z'),
          },
          {
            id: 2,
            reference: 'BBB',
            visibility: 'private',
            user: { id: 1 },
            tags: [{ id: 2 }, { id: 3 }],
            created: new Date('2020-01-05T00:00:00.000Z'),
          },
          {
            id: 3,
            reference: 'CCC',
            user: { id: 1 },
            tags: [{ id: 1 }, { id: 3 }],
            created: new Date('2021-01-01T00:00:00.000Z'),
          },
        ],
      });

      const repository = new LinkRepositoryImpl(mockLoggerService, mockTypeOrmService, { getUserTags: jest.fn() });
      await expect(
        repository.search(
          { id: 1, name: 'stuart', created: new Date() },
          {
            tags: ['bar', 'baz'],
            created: {
              min: new Date('2020-01-01T00:00:00.000Z'),
              max: new Date('2020-02-01T00:00:00.000Z'),
            },
            limit: 5,
          },
        ),
      ).resolves.toMatchObject({
        links: [{ id: 2, reference: 'BBB', visibility: 'private', tags: expect.arrayContaining(['bar', 'baz']) }],
        pagination: { limit: 5, offset: 0, total: 1 },
      });
    });

    it.each<[string, any[]]>([
      ['public', [{ id: 3 }, { id: 2 }, { id: 1 }]],
      ['internal', [{ id: 2 }, { id: 1 }]],
      ['private', [{ id: 1 }]],
    ])('should filter links by visibility %s', async (actualVisibility, expectedLinks) => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [
          { id: 1, name: 'foo', user: { id: 1 } },
          { id: 2, name: 'bar', user: { id: 1 } },
          { id: 3, name: 'baz', user: { id: 1 } },
        ],
        links: [
          {
            id: 1,
            reference: 'AAA',
            visibility: 'private',
            user: { id: 1 },
            tags: [{ id: 1 }, { id: 2 }],
            created: new Date('2020-01-01T00:00:00.000Z'),
          },
          {
            id: 2,
            reference: 'BBB',
            visibility: 'internal',
            user: { id: 1 },
            tags: [{ id: 2 }, { id: 3 }],
            created: new Date('2020-01-02T00:00:00.000Z'),
          },
          {
            id: 3,
            reference: 'CCC',
            visibility: 'public',
            user: { id: 1 },
            tags: [{ id: 1 }, { id: 3 }],
            created: new Date('2020-01-03T00:00:00.000Z'),
          },
        ],
      });

      const repository = new LinkRepositoryImpl(mockLoggerService, mockTypeOrmService, { getUserTags: jest.fn() });
      await expect(
        repository.search(
          { id: 1, name: 'stuart', created: new Date() },
          {
            tags: ['foo', 'bar', 'baz'],
            visibility: actualVisibility,
            limit: 5,
          },
        ),
      ).resolves.toMatchObject({
        links: expectedLinks,
        pagination: { limit: 5, offset: 0, total: expectedLinks.length },
      });
    });
  });
});
