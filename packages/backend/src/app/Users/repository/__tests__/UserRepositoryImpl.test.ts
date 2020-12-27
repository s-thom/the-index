import { mockTypeOrmService, seedDatabase } from '../../../../utils/test-db-utils';
import { mockLoggerService } from '../../../../utils/test-utils';
import UserRepositoryImpl from '../UserRepositoryImpl';

describe('UserRepositoryImpl', () => {
  describe('findById', () => {
    it('should return a user', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [],
        links: [],
      });

      const repository = new UserRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.findById(1)).resolves.toMatchObject({ id: 1, name: 'stuart' });
    });

    it('should throw if a user does not exist', async () => {
      await seedDatabase({ users: [], tags: [], links: [] });

      const repository = new UserRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.findById(1)).rejects.toEqual(new Error('Could not find user by id 1'));
    });
  });

  describe('findByName', () => {
    it('should return a user', async () => {
      await seedDatabase({ users: [{ id: 1, name: 'stuart' }], tags: [], links: [] });

      const repository = new UserRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.findByName('stuart')).resolves.toMatchObject({ id: 1, name: 'stuart' });
    });

    it('should throw if a user does not exist', async () => {
      await seedDatabase({ users: [], tags: [], links: [] });

      const repository = new UserRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.findByName('stuart')).rejects.toEqual(new Error('Could not find user by name stuart'));
    });
  });
});
