import { MemoryRouter, Route } from 'react-router-dom';
import LinkDetailPage from '..';
import * as mockedApi from '../../../api-types';
import { render, screen, waitFor } from '../../../util/test-utils';

jest.mock('../../../api-types');

const { getV2LinkId } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('LinkDetailPage', () => {
  it('should render when successfully retrieving data', async () => {
    getV2LinkId.mockResolvedValue({
      link: {
        id: 'A00025E91EEBF5400000',
        url: 'https://example.com',
        tags: ['example'],
        created: '2020-01-01T00:00:00.000Z',
        visibility: 'private',
        user: {
          name: 'stuart',
        },
      },
    });

    render(
      <MemoryRouter initialEntries={['/test']}>
        <Route path="/:id" component={LinkDetailPage} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(getV2LinkId).toHaveBeenCalledTimes(1));
    expect(getV2LinkId).toHaveBeenLastCalledWith({ id: 'test' });

    expect(screen.getByRole('heading')).toHaveTextContent('https://example.com');
  });

  it('should render when it errors while retrieving data', async () => {
    getV2LinkId.mockRejectedValue({});

    const { container } = render(
      <MemoryRouter initialEntries={['/test']}>
        <Route path="/:id" component={LinkDetailPage} />
      </MemoryRouter>,
    );

    await waitFor(() => expect(getV2LinkId).toHaveBeenCalledTimes(1));
    expect(getV2LinkId).toHaveBeenLastCalledWith({ id: 'test' });

    expect(container).toHaveTextContent(/^There was an error/);
  });
});
