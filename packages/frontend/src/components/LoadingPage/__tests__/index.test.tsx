import LoadingPage from '..';
import { cleanup, render } from '../../../util/test-utils';

afterEach(() => {
  cleanup();
});

describe('LoadingPage', () => {
  it('should render', () => {
    const { container } = render(<LoadingPage />);
    expect(container).toHaveTextContent('Loading...');
  });
});
