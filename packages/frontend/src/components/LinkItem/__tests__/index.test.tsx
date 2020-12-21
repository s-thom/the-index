import LinkItem from '..';
import { cleanup, render, screen } from '../../../util/test-utils';

afterEach(() => {
  cleanup();
});

describe('LinkItem', () => {
  it('should render', () => {
    render(
      <LinkItem
        link={{
          id: '1',
          url: 'https://example.com',
          tags: ['one', 'two'],
          user: { id: '1', name: 'stuart' },
          inserted: '2020-01-01T00:00:00.000Z',
        }}
      />,
    );
    expect(screen.getByRole('link')).toHaveTextContent('https://example.com');

    const tags = screen.queryAllByRole('listitem');
    expect(tags).toHaveLength(2);
    expect(tags.map((tag) => tag.textContent)).toEqual(['one', 'two']);
  });
});
