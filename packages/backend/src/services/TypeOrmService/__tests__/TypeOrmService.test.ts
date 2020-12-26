import { Connection, Repository } from 'typeorm';
import { mockConfigService, mockLoggerService } from '../../../utils/test-utils';
import TypeOrmServiceImpl from '../TypeOrmServiceImpl';

describe('TypeOrmServiceImpl', () => {
  describe('start', () => {
    it('should start', async () => {
      const service = new TypeOrmServiceImpl(mockLoggerService, mockConfigService);
      await expect(service.start()).resolves.toBeInstanceOf(Connection);
    });
  });

  describe('getRepository', () => {
    it('should get a repository', async () => {
      const service = new TypeOrmServiceImpl(mockLoggerService, mockConfigService);
      await expect(service.start()).resolves.toBeInstanceOf(Connection);

      expect(service.getRepository('UserModel')).toBeInstanceOf(Repository);
    });

    it('should throw if the connection has not started', async () => {
      const service = new TypeOrmServiceImpl(mockLoggerService, mockConfigService);
      expect(() => {
        service.getRepository('UserModel');
      }).toThrow(new Error('Tried to get repository but the TypeOrmService has not been started'));
    });
  });
});
