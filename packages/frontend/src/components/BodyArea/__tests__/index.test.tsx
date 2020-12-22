import BodyArea from '..';
import { render, screen } from '../../../util/test-utils';

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
