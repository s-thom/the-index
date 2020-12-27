import { getTestConnection, mockTypeOrmService, seedDatabase } from '../../../../utils/test-db-utils';
import { mockLoggerService } from '../../../../utils/test-utils';
import AuthRepositoryImpl from '../AuthRepositoryImpl';
import UserAuthModel from '../UserAuthModel.entity';

describe('AuthRepositoryImpl', () => {
  describe('getAuthMethodsByName', () => {
    it('should get the auth methods for a user', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [],
        links: [],
      });
      const connection = getTestConnection();
      const authRepository = connection.getRepository(UserAuthModel);
      await authRepository.save({ type: 'totp', user: { id: 1 }, secret: 'hush-hush' });

      const repository = new AuthRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(repository.getAuthMethodsByName('stuart')).resolves.toMatchObject([
        { type: 'totp', secret: 'hush-hush' },
      ]);
    });
  });

  describe('insertAuthMethod', () => {
    it('should add an auth method for a user', async () => {
      await seedDatabase({
        users: [{ id: 1, name: 'stuart' }],
        tags: [],
        links: [],
      });

      const repository = new AuthRepositoryImpl(mockLoggerService, mockTypeOrmService);
      await expect(
        repository.insertAuthMethod(
          { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
          { type: 'totp', secret: 'hush-hush' },
        ),
      ).resolves.toMatchObject({ type: 'totp', secret: 'hush-hush' });
    });
  });
});
