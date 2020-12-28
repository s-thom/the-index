import { mockLoggerService } from '../../../../../utils/test-utils';
import UserControllerImpl from '../UserControllerImpl';

describe('UserControllerImpl', () => {
  describe('getByName', () => {
    it('should get a user by name', async () => {
      const mockGetByName = jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') });

      const controller = new UserControllerImpl(mockLoggerService, { getById: jest.fn(), getByName: mockGetByName });

      await expect(
        controller.getByName(
          { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
          { name: 'stuart' },
        ),
      ).resolves.toEqual({ user: { name: 'stuart' } });

      expect(mockGetByName).toHaveBeenCalledTimes(1);
      expect(mockGetByName).toHaveBeenLastCalledWith('stuart');
    });

    it("should use the current user's name if the given parameter is `me`", async () => {
      const mockGetByName = jest
        .fn()
        .mockResolvedValue({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') });

      const controller = new UserControllerImpl(mockLoggerService, { getById: jest.fn(), getByName: mockGetByName });

      await expect(
        controller.getByName({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') }, { name: 'me' }),
      ).resolves.toEqual({ user: { name: 'stuart' } });

      expect(mockGetByName).toHaveBeenCalledTimes(1);
      expect(mockGetByName).toHaveBeenLastCalledWith('stuart');
    });
  });

  describe('router', () => {
    it('should return a router', () => {
      const controller = new UserControllerImpl(mockLoggerService, { getById: jest.fn(), getByName: jest.fn() });
      const router = controller.router();

      expect(router.stack).toHaveLength(1);
    });
  });
});
