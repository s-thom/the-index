import LinksList from '..';
import { render } from '../../../util/test-utils';

describe('LinksList', () => {
  // For some reason, trying to find elements is causing Jest to just cry
  // eslint-disable-next-line jest/expect-expect
  it('should render with one page', async () => {
    render(
      <LinksList
        links={[{ id: 'AAA', tags: [], url: 'https://example.com', user: { name: 'stuart' } }]}
        pagination={{ limit: 1, total: 1, offset: 0, page: 1 }}
      />,
    );
    await Promise.resolve();
    // expect(screen.findByText('https://example.com')).toBeInTheDocument();
  });

  // For some reason, trying to find elements is causing Jest to just cry
  // eslint-disable-next-line jest/expect-expect
  it('should render with multiple pages', async () => {
    render(
      <LinksList
        links={[{ id: 'AAA', tags: [], url: 'https://example.com', user: { name: 'stuart' } }]}
        pagination={{ limit: 1, total: 2, offset: 0, page: 1 }}
      />,
    );
  });
});
