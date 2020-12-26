import { ExtSnowflakeGenerator } from 'extended-snowflake';
import { Connection, getConnectionManager } from 'typeorm';
import LinkModel from '../app/Links/repository/LinkModel.entity';
import TagModel from '../app/Tags/repository/TagModel.entity';
import UserModel from '../app/Users/repository/UserModel.entity';
import TypeOrmServiceImpl from '../services/TypeOrmService/TypeOrmServiceImpl';
import { mockConfigService, mockLogger } from './test-utils';

// #region Utilities
const generator = new ExtSnowflakeGenerator(0);
function generateString() {
  return generator.next();
}

/**
 * Takes a random selection of items from an array
 * @param arr Array to sample from
 * @param n Number if items to take
 */
function takeRandom<T>(arr: T[], n: number): T[] {
  const outArray: T[] = [];
  const arrClone = [...arr];
  for (let i = 0; i < n; i++) {
    // Escape hatch if there are no more items in the array
    if (arrClone.length === 0) {
      return arrClone;
    }

    const index = Math.floor(Math.random() * arr.length);
    const removedItems = arrClone.splice(index, 1);
    outArray.push(...removedItems);
  }

  return outArray;
}

/**
 * Runs a callback the specified number of times, returning the result
 * @param n Number of times to run the callback
 * @param fn Callback to run
 */
function doTimes<T>(n: number, fn: (i: number) => T): T[] {
  return [...Array(n)].map((_, i) => fn(i));
}
// #endregion

// #region make<DataType> function
function makeUser(overrides?: Partial<UserModel>): UserModel {
  const user = new UserModel();
  user.id = undefined as any;
  user.name = overrides?.name ?? generateString();
  user.created = overrides?.created ?? new Date('2020-01-01T00:00:00.000Z');
  user.updated = overrides?.updated;
  user.deleted = overrides?.deleted;
  return user;
}

function makeTag(overrides?: Partial<TagModel>): TagModel {
  const tag = new TagModel();
  tag.id = undefined as any;
  tag.name = overrides?.name ?? generateString();
  tag.user = overrides?.user ?? (undefined as any);
  return tag;
}

function makeLink(overrides?: Partial<LinkModel>): LinkModel {
  const link = new LinkModel();
  link.id = undefined as any;
  link.reference = overrides?.reference ?? generateString();
  link.url = overrides?.url ?? `https://example.com#${generateString()}`;
  link.tags = overrides?.tags ?? (undefined as any);
  link.user = overrides?.user ?? (undefined as any);
  link.created = overrides?.created ?? new Date('2020-01-01T00:00:00.000Z');
  link.updated = overrides?.updated;
  link.deleted = overrides?.deleted;
  return link;
}
// #endregion

export const mockTypeOrmService = new TypeOrmServiceImpl(
  // Since the constructor is called before the functions have their mock implementations,
  // we need to manually mock the logger instance in
  { child: () => mockLogger, get: () => mockLogger },
  mockConfigService,
);

export function getTestConnection() {
  const connection = (mockTypeOrmService as any).connection as Connection;
  return connection;
}

export async function seedDatabase() {
  const data = doTimes(10, (index) => makeUser({ id: index + 1 })).map((user) => {
    const tags = doTimes(10, () => makeTag({ user }));
    const links = doTimes(50, () => makeLink({ user, tags: takeRandom(tags, 3) }));

    return { user, tags, links };
  });

  // Extract data from created models
  const allUsers: UserModel[] = [];
  const allTags: TagModel[] = [];
  const allLinks: LinkModel[] = [];
  for (const item of data) {
    allUsers.push(item.user);
    allTags.push(...item.tags);
    allLinks.push(...item.links);
  }

  // Save all data to the database
  const connection = getTestConnection();
  await connection.getRepository(UserModel).save(allUsers);
  await connection.getRepository(TagModel).save(allTags, { chunk: 50 });
  await connection.getRepository(LinkModel).save(allLinks, { chunk: 50 });
}

beforeEach(async () => {
  // Seed database
  // This is a bit of a lengthy operation, which is why the db utils have been split into this file.
  // Only the <Entity>Respository classes should require this in their tests.
  await mockTypeOrmService.start();
  await seedDatabase();
});

// This is a clone of the cleanup effect in `src/services/TypeOrmService/__tests__/TypeOrmServiceImpl.ts`, and should stay in sync
afterEach(async () => {
  // Clean up in-memory database
  const connectionManager = getConnectionManager();
  if (connectionManager.has('test')) {
    const connection = connectionManager.get('test');
    if (connection.isConnected) {
      await connection.dropDatabase();
      await connection.close();
    }
  }
});
