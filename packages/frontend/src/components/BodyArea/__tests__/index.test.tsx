import BodyArea from '..';
import { cleanup, render, screen } from '../../../util/test-utils';

afterEach(() => {
  cleanup();
});

describe('BodyArea', () => {
  it('should render', () => {
    render(
      <BodyArea>
        <span data-testid="example">Example</span>
      </BodyArea>,
    );
    expect(screen.getByTestId('example')).toHaveTextContent('Example');
  });
});
