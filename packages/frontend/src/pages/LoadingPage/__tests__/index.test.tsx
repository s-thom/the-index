import LoadingPage from '..';
import { render } from '../../../util/test-utils';

describe('LoadingPage', () => {
  it('should render', () => {
    const { container } = render(<LoadingPage />);
    expect(container).toHaveTextContent('Loading...');
  });
});
