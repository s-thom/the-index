import { render, screen } from '@testing-library/react';
import App from '..';

describe('App', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByText('The Index')).toBeInTheDocument();
  });
});
