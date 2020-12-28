import { mockLoggerService } from '../../../../utils/test-utils';
import UserServiceImpl from '../UserServiceImpl';

describe('UserServiceImpl', () => {
  describe('getById', () => {
    it('should return a user', async () => {
      const mockFindById = jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') });

      const service = new UserServiceImpl(mockLoggerService, { findById: mockFindById, findByName: jest.fn() });
      await expect(service.getById(1)).resolves.toEqual({
        id: 1,
        name: 'stuart',
        created: new Date('2020-01-01T00:00:00.000Z'),
      });

      expect(mockFindById).toHaveBeenCalledTimes(1);
      expect(mockFindById).toHaveBeenLastCalledWith(1);
    });
  });

  describe('getByName', () => {
    it('should return a user', async () => {
      const mockFindByName = jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') });

      const service = new UserServiceImpl(mockLoggerService, { findById: jest.fn(), findByName: mockFindByName });
      await expect(service.getByName('stuart')).resolves.toEqual({
        id: 1,
        name: 'stuart',
        created: new Date('2020-01-01T00:00:00.000Z'),
      });

      expect(mockFindByName).toHaveBeenCalledTimes(1);
      expect(mockFindByName).toHaveBeenLastCalledWith('stuart');
    });
  });
});
