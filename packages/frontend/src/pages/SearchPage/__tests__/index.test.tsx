import userEvent from '@testing-library/user-event';
import SearchPage from '..';
import { render, screen, waitFor } from '../../../util/test-utils';
import * as mockedApi from '../../../api-types';

jest.mock('../../../api-types');

const { getV2Links, getV2Tags } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('SearchPage', () => {
  it('should allow a user to search for links by tags', async () => {
    getV2Tags.mockResolvedValue({ tags: ['suggestion'] });
    getV2Links.mockResolvedValue({
      links: [
        {
          id: '1',
          created: '2020-01-01T00:00:00.000Z',
          url: 'https://example.com',
          tags: ['foo', 'bar'],
          user: { name: 'stuart' },
        },
        {
          id: '2',
          created: '2020-01-01T00:00:00.000Z',
          url: 'https://google.com',
          tags: ['foo', 'baz'],
          user: { name: 'stuart' },
        },
      ],
    });

    render(<SearchPage />);

    await waitFor(() => expect(getV2Links).toHaveBeenCalledTimes(1));
    expect(getV2Links).toHaveBeenLastCalledWith({
      queryParams: {
        tags: [],
      },
    });

    const tagsInput = screen.getByRole('textbox');
    userEvent.type(tagsInput, 'foo');
    userEvent.type(tagsInput, ' ');

    await waitFor(() => expect(getV2Links).toHaveBeenCalledTimes(2));
    expect(getV2Links).toHaveBeenLastCalledWith({
      queryParams: {
        tags: ['foo'],
      },
    });

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});
