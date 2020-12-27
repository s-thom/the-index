import { mockLoggerService } from '../../../../utils/test-utils';
import LinkServiceImpl from '../LinkServiceImpl';

describe('LinkServiceImpl', () => {
  describe('getLink', () => {
    it('should get a link', async () => {
      const mockFindByReference = jest.fn().mockResolvedValue({
        id: 1,
        reference: 'AAA',
        user: { id: 1 },
        tags: [{ id: 1 }],
        url: 'https://example.com',
      });

      const service = new LinkServiceImpl(
        mockLoggerService,
        {
          findByReference: mockFindByReference,
          insert: jest.fn(),
          search: jest.fn(),
        },
        { next: jest.fn() },
      );

      await expect(service.getLink({ id: 1 } as any, 'AAA')).resolves.toEqual({
        id: 1,
        reference: 'AAA',
        user: { id: 1 },
        tags: [{ id: 1 }],
        url: 'https://example.com',
      });

      expect(mockFindByReference).toHaveBeenCalledTimes(1);
      expect(mockFindByReference).toHaveBeenLastCalledWith({ id: 1 }, 'AAA');
    });
  });

  describe('addLink', () => {
    it('should add a link', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        id: 1,
        reference: 'AAA',
        user: { id: 1 },
        tags: ['foo', 'bar'],
        url: 'https://example.com',
      });

      const service = new LinkServiceImpl(
        mockLoggerService,
        {
          findByReference: jest.fn(),
          insert: mockInsert,
          search: jest.fn(),
        },
        { next: jest.fn() },
      );

      await expect(
        service.addLink({ id: 1 } as any, { url: 'https://example.com', tags: ['foo', 'bar'] }),
      ).resolves.toEqual({
        id: 1,
        reference: 'AAA',
        user: { id: 1 },
        tags: ['foo', 'bar'],
        url: 'https://example.com',
      });

      expect(mockInsert).toHaveBeenCalledTimes(1);
      expect(mockInsert).toHaveBeenLastCalledWith({ id: 1 }, { url: 'https://example.com', tags: ['foo', 'bar'] });
    });
  });

  describe('search', () => {
    it('should add a link', async () => {
      const mockSearch = jest.fn().mockResolvedValue([
        {
          id: 1,
          reference: 'AAA',
          user: { id: 1 },
          tags: ['foo', 'bar'],
          url: 'https://example.com',
        },
      ]);

      const service = new LinkServiceImpl(
        mockLoggerService,
        {
          findByReference: jest.fn(),
          insert: jest.fn(),
          search: mockSearch,
        },
        { next: jest.fn() },
      );

      await expect(service.search({ id: 1 } as any, { tags: ['foo', 'bar'] })).resolves.toEqual([
        {
          id: 1,
          reference: 'AAA',
          user: { id: 1 },
          tags: ['foo', 'bar'],
          url: 'https://example.com',
        },
      ]);

      expect(mockSearch).toHaveBeenCalledTimes(1);
      expect(mockSearch).toHaveBeenLastCalledWith({ id: 1 }, { tags: ['foo', 'bar'] });
    });
  });
});
