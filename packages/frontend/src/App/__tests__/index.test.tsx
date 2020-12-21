import { cleanup, render, screen } from '@testing-library/react';
import App from '..';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('should render', () => {
    render(<App />);
    expect(screen.getByText('The Index')).toBeTruthy();
  });
});
