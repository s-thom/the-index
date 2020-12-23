import userEvent from '@testing-library/user-event';
import SearchPage from '..';
import { render, screen, waitFor } from '../../../util/test-utils';
import * as mockedApi from '../../../api-types';

jest.mock('../../../api-types');

const { postSearch, getTags } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('SearchPage', () => {
  it('should allow a user to search for links by tags', async () => {
    getTags.mockResolvedValue({ tags: ['suggestion'] });
    postSearch.mockResolvedValue({
      links: [
        {
          id: '1',
          inserted: '2020-01-01T00:00:00.000Z',
          url: 'https://example.com',
          tags: ['foo', 'bar'],
          user: { id: '1', name: 'stuart' },
        },
        {
          id: '2',
          inserted: '2020-01-01T00:00:00.000Z',
          url: 'https://google.com',
          tags: ['foo', 'baz'],
          user: { id: '1', name: 'stuart' },
        },
      ],
    });

    render(<SearchPage />);

    await waitFor(() => expect(postSearch).toHaveBeenCalledTimes(1));
    expect(postSearch).toHaveBeenLastCalledWith({
      body: {
        tags: [],
      },
    });

    const tagsInput = screen.getByRole('textbox');
    userEvent.type(tagsInput, 'foo');
    userEvent.type(tagsInput, ' ');

    await waitFor(() => expect(postSearch).toHaveBeenCalledTimes(2));
    expect(postSearch).toHaveBeenLastCalledWith({
      body: {
        tags: ['foo'],
      },
    });

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
