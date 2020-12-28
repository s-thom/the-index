import { mockLoggerService } from '../../../../utils/test-utils';
import TagServiceImpl from '../TagServiceImpl';

describe('TagServiceImpl', () => {
  describe('getUserTags', () => {
    it('should get tags', async () => {
      const mockGetTags = jest.fn().mockResolvedValue([{ id: 1, name: 'foo' }]);

      const service = new TagServiceImpl(mockLoggerService, { getUserTags: mockGetTags });
      await expect(service.getUserTags({ id: 1 } as any)).resolves.toEqual([{ id: 1, name: 'foo' }]);

      expect(mockGetTags).toHaveBeenCalledTimes(1);
      expect(mockGetTags).toHaveBeenLastCalledWith({ id: 1 } as any, {});
    });

    it('should get tags with filter options', async () => {
      const mockGetTags = jest.fn().mockResolvedValue([{ id: 1, name: 'foo' }]);

      const service = new TagServiceImpl(mockLoggerService, { getUserTags: mockGetTags });
      await expect(service.getUserTags({ id: 1 } as any, { allowList: ['foo'] })).resolves.toEqual([
        { id: 1, name: 'foo' },
      ]);

      expect(mockGetTags).toHaveBeenCalledTimes(1);
      expect(mockGetTags).toHaveBeenLastCalledWith({ id: 1 } as any, { allowList: ['foo'] });
    });
  });
});
