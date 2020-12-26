import { getConnectionManager } from 'typeorm';
// This file should not be imported from outside of test files
// eslint-disable-next-line import/no-extraneous-dependencies
import { define, factory, useRefreshDatabase } from 'typeorm-seeding';
import LinkModel from '../app/Links/repository/LinkModel.entity';
import TagModel from '../app/Tags/repository/TagModel.entity';
import UserModel from '../app/Users/repository/UserModel.entity';
import TypeOrmServiceImpl from '../services/TypeOrmService/TypeOrmServiceImpl';
import { mockConfigService, mockLoggerService } from './test-utils';

define(UserModel, (faker, ctx: Partial<UserModel> | undefined) => {
  const user = new UserModel();
  user.id = ctx?.id ?? faker.random.number(1000000);
  user.name = ctx?.name ?? faker.name.firstName().toLowerCase();
  user.created = ctx?.created ?? faker.date.past(10);
  user.updated = ctx?.updated;
  user.deleted = ctx?.deleted;
  return user;
});

define(TagModel, (faker, ctx: Partial<TagModel> | undefined) => {
  const tag = new TagModel();
  tag.id = ctx?.id ?? faker.random.number(1000000);
  tag.name = ctx?.name ?? faker.lorem.word();
  tag.user = ctx?.user ?? ((null as unknown) as UserModel);
  return tag;
});

define(LinkModel, (faker, ctx: Partial<LinkModel> | undefined) => {
  const link = new LinkModel();
  link.id = ctx?.id ?? faker.random.number(1000000);
  link.reference = ctx?.reference ?? faker.random.hexaDecimal(18).toUpperCase();
  link.url = ctx?.url ?? faker.internet.url();
  link.tags = ctx?.tags ?? ((null as unknown) as TagModel[]);
  link.user = ctx?.user ?? ((null as unknown) as UserModel);
  link.updated = ctx?.updated;
  link.deleted = ctx?.deleted;
  return link;
});

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

export const typeOrmService = new TypeOrmServiceImpl(mockLoggerService, mockConfigService);
jest.spyOn(typeOrmService, 'start');
jest.spyOn(typeOrmService, 'getRepository');

export async function seedDatabase() {
  await typeOrmService.start();
  await useRefreshDatabase({ connection: 'test' });
  const users = await factory(UserModel)().createMany(10);
  const useDataPromises = users.map(async (user) => {
    const tags = await factory(TagModel)({ user }).createMany(10);
    const links = await factory(LinkModel)({ user })
      .map(async (model) => {
        // The aim of the mapper is to specifically mutate the value
        // eslint-disable-next-line no-param-reassign
        model.tags = takeRandom(tags, 3);
        return model;
      })
      .createMany(50);

    return { user, tags, links };
  });
  await Promise.all(useDataPromises);
}

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
