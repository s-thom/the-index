import Header from '..';
import { render, screen } from '../../../util/test-utils';

describe('Header', () => {
  it('should render', () => {
    render(<Header />);
    expect(screen.getByRole('link')).toHaveTextContent('the-index');
  });

  it('should render with navigation', () => {
    render(<Header navigation={<span data-testid="example">Example</span>} />);
    expect(screen.getByTestId('example')).toHaveTextContent('Example');
  });
});
