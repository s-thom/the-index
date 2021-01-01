import userEvent from '@testing-library/user-event';
import NewLinkPage from '..';
import * as mockedApi from '../../../api-types';
import { render, screen, waitFor } from '../../../util/test-utils';

jest.mock('../../../api-types');

const { getV2Tags, postV2Links } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('NewLinkPage', () => {
  it('should allow a user to add a new link', async () => {
    getV2Tags.mockResolvedValue({ tags: ['suggestion'] });
    postV2Links.mockResolvedValue({
      link: {
        id: '1',
        created: '2020-01-01T00:00:00.000Z',
        url: 'https://example/com',
        tags: ['suggestion'],
        visibility: 'private',
        user: { name: 'stuart' },
      },
    });

    render(<NewLinkPage />);

    await waitFor(() => expect(getV2Tags).toHaveBeenCalledTimes(1));
    expect(getV2Tags).toHaveBeenLastCalledWith({
      queryParams: {
        exclude: [],
      },
    });

    const urlInput = screen.getByPlaceholderText('Enter URL');
    userEvent.type(urlInput, 'https://example.com');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    const [submitButton, addTagButton] = buttons;

    // Add suggested tag
    userEvent.click(addTagButton!);

    await waitFor(() => expect(getV2Tags).toHaveBeenCalledTimes(2));
    expect(getV2Tags).toHaveBeenLastCalledWith({
      queryParams: {
        exclude: ['suggestion'],
      },
    });

    // Click submit
    userEvent.click(submitButton!);

    await waitFor(() => expect(postV2Links).toHaveBeenCalledTimes(1));
    expect(postV2Links).toHaveBeenLastCalledWith({
      body: {
        url: 'https://example.com',
        tags: ['suggestion'],
        visibility: 'private',
      },
    });
  });
});
