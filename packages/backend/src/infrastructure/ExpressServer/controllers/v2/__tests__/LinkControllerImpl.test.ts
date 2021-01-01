import { mockLoggerService } from '../../../../../utils/test-utils';
import LinkControllerImpl from '../LinkControllerImpl';

describe('LinkControllerImpl', () => {
  describe('getLink', () => {
    it('should get a link', async () => {
      const mockGetLink = jest.fn().mockResolvedValue({
        id: 1,
        reference: 'AAA',
        visibility: 'private',
        url: 'https://example.com',
        tags: ['foo'],
        user: { id: 1, name: 'stuart' },
      });

      const controller = new LinkControllerImpl(mockLoggerService, {
        getLink: mockGetLink,
        addLink: jest.fn(),
        search: jest.fn(),
      });

      await expect(
        controller.getLink({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') }, { id: 'AAA' }),
      ).resolves.toEqual({
        link: { id: 'AAA', visibility: 'private', url: 'https://example.com', tags: ['foo'], user: { name: 'stuart' } },
      });

      expect(mockGetLink).toHaveBeenCalledTimes(1);
      expect(mockGetLink).toHaveBeenLastCalledWith(
        { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
        'AAA',
      );
    });
  });

  describe('addLink', () => {
    it('should add a link', async () => {
      const mockAddLink = jest.fn().mockResolvedValue({
        id: 1,
        reference: 'AAA',
        visibility: 'private',
        url: 'https://example.com',
        tags: ['foo'],
        user: { id: 1, name: 'stuart' },
      });

      const controller = new LinkControllerImpl(mockLoggerService, {
        getLink: jest.fn(),
        addLink: mockAddLink,
        search: jest.fn(),
      });

      await expect(
        controller.addLink(
          { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
          { url: 'https://example.com', tags: ['foo'], visibility: 'private' },
        ),
      ).resolves.toEqual({
        link: { id: 'AAA', visibility: 'private', url: 'https://example.com', tags: ['foo'], user: { name: 'stuart' } },
      });

      expect(mockAddLink).toHaveBeenCalledTimes(1);
      expect(mockAddLink).toHaveBeenLastCalledWith(
        { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
        { url: 'https://example.com', tags: ['foo'] },
      );
    });
  });

  describe('search', () => {
    it('should search for links with default search parameters', async () => {
      const mockSearch = jest
        .fn()
        .mockResolvedValue({ links: [], pagination: { limit: 25, offset: 0, page: 1, total: 0 } });

      const controller = new LinkControllerImpl(mockLoggerService, {
        getLink: jest.fn(),
        addLink: jest.fn(),
        search: mockSearch,
      });

      await expect(
        controller.search({ id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') }, {}),
      ).resolves.toEqual({ links: [], pagination: { limit: 25, offset: 0, page: 1, total: 0 } });

      expect(mockSearch).toHaveBeenCalledTimes(1);
      expect(mockSearch).toHaveBeenLastCalledWith(
        { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
        { tags: [], created: {} },
      );
    });

    it('should search for links with given search parameters', async () => {
      const mockSearch = jest.fn().mockResolvedValue({
        links: [
          {
            id: 1,
            reference: 'AAA',
            visibility: 'private',
            url: 'https://example.com',
            tags: ['foo'],
            user: { id: 1, name: 'stuart' },
          },
        ],
        pagination: { limit: 25, offset: 0, page: 1, total: 1 },
      });

      const controller = new LinkControllerImpl(mockLoggerService, {
        getLink: jest.fn(),
        addLink: jest.fn(),
        search: mockSearch,
      });

      await expect(
        controller.search(
          { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
          { tags: ['foo'], before: '2021-01-01T00:00:00.000Z', after: '2020-01-01T00:00:00.000Z' },
        ),
      ).resolves.toEqual({
        links: [
          { id: 'AAA', visibility: 'private', url: 'https://example.com', tags: ['foo'], user: { name: 'stuart' } },
        ],
        pagination: { limit: 25, offset: 0, page: 1, total: 1 },
      });

      expect(mockSearch).toHaveBeenCalledTimes(1);
      expect(mockSearch).toHaveBeenLastCalledWith(
        { id: 1, name: 'stuart', created: new Date('2020-01-01T00:00:00.000Z') },
        {
          tags: ['foo'],
          created: { max: new Date('2021-01-01T00:00:00.000Z'), min: new Date('2020-01-01T00:00:00.000Z') },
        },
      );
    });
  });

  describe('router', () => {
    it('should return a router', () => {
      const controller = new LinkControllerImpl(mockLoggerService, {
        getLink: jest.fn(),
        addLink: jest.fn(),
        search: jest.fn(),
      });
      const router = controller.router();

      expect(router.stack).toHaveLength(3);
    });
  });
});
