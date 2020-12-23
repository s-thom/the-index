import NotFoundPage from '..';
import { render, screen } from '../../../util/test-utils';

describe('NotFoundPage', () => {
  it('should render', () => {
    render(<NotFoundPage />);

    expect(screen.getByRole('heading')).toHaveTextContent('Not Found');
  });
});
