import { mockTypeOrmService, seedDatabase } from '../../../../utils/test-db-utils';
import { mockLoggerService } from '../../../../utils/test-utils';
import TagRepositoryImpl from '../TagRepositoryImpl';

describe('TagRepositoryImpl', () => {
  describe('getUserTags', () => {
    it('should get tags sorted by name alphabetically', async () => {
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
            tags: [{ id: 1 }, { id: 2 }, { id: 3 }],
            user: { id: 1 },
          },
        ],
      });

      const repository = new TagRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.getUserTags({ id: 1, name: 'stuart', created: new Date() })).resolves.toMatchObject([
        { id: 2, name: 'bar', user: { id: 1 } },
        { id: 3, name: 'baz', user: { id: 1 } },
        { id: 1, name: 'foo', user: { id: 1 } },
      ]);
    });

    it('should get tags sorted by the number of links that have the tag', async () => {
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
            tags: [{ id: 1 }, { id: 3 }],
            user: { id: 1 },
          },
          {
            id: 2,
            reference: 'BBB',
            visibility: 'private',
            tags: [{ id: 2 }, { id: 3 }],
            user: { id: 1 },
          },
        ],
      });

      const repository = new TagRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.getUserTags({ id: 1, name: 'stuart', created: new Date() })).resolves.toMatchObject([
        { id: 3, name: 'baz', user: { id: 1 } },
        { id: 2, name: 'bar', user: { id: 1 } },
        { id: 1, name: 'foo', user: { id: 1 } },
      ]);
    });

    it('should filter tags by the allow and blocklists', async () => {
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
            tags: [{ id: 1 }, { id: 2 }, { id: 3 }],
            user: { id: 1 },
          },
        ],
      });

      const repository = new TagRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(
        repository.getUserTags(
          { id: 1, name: 'stuart', created: new Date() },
          {
            allowList: ['foo', 'bar'],
            blockList: ['bar'],
          },
        ),
      ).resolves.toMatchObject([{ id: 1, name: 'foo', user: { id: 1 } }]);
    });

    it('should limit results', async () => {
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
            tags: [{ id: 1 }, { id: 2 }, { id: 3 }],
            user: { id: 1 },
          },
        ],
      });

      const repository = new TagRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(
        repository.getUserTags({ id: 1, name: 'stuart', created: new Date() }, { limit: 1 }),
      ).resolves.toMatchObject([{ id: 2, name: 'bar', user: { id: 1 } }]);
    });
  });
});
