import userEvent from '@testing-library/user-event';
import NewLinkPage from '..';
import * as mockedApi from '../../../api-types';
import { render, screen, waitFor } from '../../../util/test-utils';

jest.mock('../../../api-types');

const { getTags, postLinks } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('NewLinkPage', () => {
  it('should allow a user to add a new link', async () => {
    getTags.mockResolvedValue({ tags: ['suggestion'] });
    postLinks.mockResolvedValue({ id: '1' });

    render(<NewLinkPage />);

    await waitFor(() => expect(getTags).toHaveBeenCalledTimes(1));
    expect(getTags).toHaveBeenLastCalledWith({
      queryParams: {
        excludeTags: [],
      },
    });

    const urlInput = screen.getByPlaceholderText('Enter URL');
    userEvent.type(urlInput, 'https://example.com');

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    const [submitButton, addTagButton] = buttons;

    // Add suggested tag
    userEvent.click(addTagButton!);

    await waitFor(() => expect(getTags).toHaveBeenCalledTimes(2));
    expect(getTags).toHaveBeenLastCalledWith({
      queryParams: {
        excludeTags: ['suggestion'],
      },
    });

    // Click submit
    userEvent.click(submitButton!);

    await waitFor(() => expect(postLinks).toHaveBeenCalledTimes(1));
    expect(postLinks).toHaveBeenLastCalledWith({
      body: {
        url: 'https://example.com',
        tags: ['suggestion'],
      },
    });
  });
});
