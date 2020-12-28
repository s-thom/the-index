import { mockLoggerService } from '../../../../../utils/test-utils';
import TagControllerImpl from '../TagControllerImpl';

describe('TagControllerImpl', () => {
  describe('getCommonlyUsedTags', () => {
    it('should get a list of tags', async () => {
      const mockGetTags = jest.fn().mockResolvedValue([{ id: 1, name: 'foo' }]);

      const controller = new TagControllerImpl(mockLoggerService, { getUserTags: mockGetTags });

      await expect(
        controller.getCommonlyUsedTags(
          { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
          { exclude: ['bar'] },
        ),
      ).resolves.toEqual({ tags: ['foo'] });

      expect(mockGetTags).toHaveBeenCalledTimes(1);
      expect(mockGetTags).toHaveBeenLastCalledWith(
        { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
        { blockList: ['bar'] },
      );
    });
  });

  describe('router', () => {
    it('should return a router', () => {
      const controller = new TagControllerImpl(mockLoggerService, { getUserTags: jest.fn() });
      const router = controller.router();

      expect(router.stack).toHaveLength(1);
    });
  });
});
