import { getConnectionManager } from 'typeorm';
import LinkModel from '../app/Links/repository/LinkModel.entity';
import TagModel from '../app/Tags/repository/TagModel.entity';
import UserModel from '../app/Users/repository/UserModel.entity';
import TypeOrmServiceImpl from '../services/TypeOrmService/TypeOrmServiceImpl';
import { mockConfigService, mockLogger } from './test-utils';
import { PickPartial } from './types';

// #region make<DataType> function
export function makeUser({ id, name, created, updated, deleted }: PickPartial<UserModel, 'name'>): UserModel {
  const user = new UserModel();
  user.id = id!; // Explicitly allowing undefined, as when inserted this will be generated
  user.name = name;
  user.created = created ?? new Date('2020-01-01T00:00:00.000Z');
  user.updated = updated;
  user.deleted = deleted;
  return user;
}

export function makeTag({ id, name, user }: PickPartial<TagModel, 'name'>): TagModel {
  const tag = new TagModel();
  tag.id = id!; // Explicitly allowing undefined, as when inserted this will be generated
  tag.name = name;
  tag.user = user ?? (undefined as any);
  return tag;
}

export function makeLink({
  id,
  reference,
  url,
  tags,
  user,
  created,
  updated,
  deleted,
}: PickPartial<LinkModel, 'reference'>): LinkModel {
  const link = new LinkModel();
  link.id = id!; // Explicitly allowing undefined, as when inserted this will be generated
  link.reference = reference;
  link.url = url ?? `https://example.com#${reference}`;
  link.tags = tags ?? (undefined as any);
  link.user = user ?? (undefined as any);
  link.created = created ?? new Date('2020-01-01T00:00:00.000Z');
  link.updated = updated;
  link.deleted = deleted;
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
  const connectionManager = getConnectionManager();
  const connection = connectionManager.get('test');
  return connection;
}

export async function seedDatabase({
  users,
  tags,
  links,
}: {
  users: PickPartial<UserModel, 'name'>[];
  tags: PickPartial<TagModel, 'name'>[];
  links: PickPartial<LinkModel, 'reference'>[];
}): Promise<void> {
  // Save all data to the database
  const connection = getTestConnection();
  await connection.getRepository(UserModel).save(users.map(makeUser));
  await connection.getRepository(TagModel).save(tags.map(makeTag), { chunk: 50 });
  await connection.getRepository(LinkModel).save(links.map(makeLink), { chunk: 50 });
}

beforeEach(async () => {
  await mockTypeOrmService.start();
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
