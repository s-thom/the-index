import userEvent from '@testing-library/user-event';
import LoginPage from '..';
import * as mockedApi from '../../../api-types';
import { AuthorizationContext } from '../../../context/AuthorizationContext';
import { render, screen, waitFor } from '../../../util/test-utils';

jest.mock('qrcode');
jest.mock('../../../api-types');

const { postLogin } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('LoginPage', () => {
  it('should allow a user to log in', async () => {
    const setToken = jest.fn();
    postLogin
      .mockResolvedValueOnce({ requires: 'challenge', totp: true })
      .mockResolvedValueOnce({ token: 'abc', content: { userId: '1' } });

    render(
      <AuthorizationContext.Provider value={{ authorized: false, setToken }}>
        <LoginPage />
      </AuthorizationContext.Provider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Login');

    // Add username
    const userInput = screen.getByPlaceholderText('Name');
    userEvent.type(userInput, 'stuart');
    userEvent.type(userInput, '{enter}');

    await waitFor(() => expect(postLogin).toHaveBeenCalledTimes(1));
    expect(postLogin).toHaveBeenLastCalledWith({ body: { name: 'stuart' } });

    // Add TOTP code
    const totpInput = screen.getByPlaceholderText('Code');
    userEvent.type(totpInput, '000000');
    userEvent.type(totpInput, '{enter}');

    await waitFor(() => expect(postLogin).toHaveBeenCalledTimes(2));
    expect(postLogin).toHaveBeenLastCalledWith({ body: { name: 'stuart', challenge: 'TOTP', response: '000000' } });

    expect(setToken).toHaveBeenCalledTimes(1);
    expect(setToken).toHaveBeenLastCalledWith('abc');
  });

  it('should request a user to set up their TOTP', async () => {
    const setToken = jest.fn();
    postLogin
      .mockResolvedValueOnce({
        requires: 'setup',
        code: 'AAAA',
        url: 'otpauth://totp/stuart?secret=AAAA&issuer=the-index',
      })
      .mockResolvedValueOnce({ token: 'abc', content: { userId: '1' } });

    render(
      <AuthorizationContext.Provider value={{ authorized: false, setToken }}>
        <LoginPage />
      </AuthorizationContext.Provider>,
    );
    expect(screen.getByRole('heading')).toHaveTextContent('Login');

    // Add username
    const userInput = screen.getByPlaceholderText('Name');
    userEvent.type(userInput, 'stuart');
    userEvent.type(userInput, '{enter}');

    await waitFor(() => expect(postLogin).toHaveBeenCalledTimes(1));
    expect(postLogin).toHaveBeenLastCalledWith({ body: { name: 'stuart' } });

    // Expect setup
    expect(screen.queryByText('Set up your authenticator app')).toBeInTheDocument();

    // Add TOTP code
    const totpInput = screen.getByPlaceholderText('Code');
    userEvent.type(totpInput, '000000');
    userEvent.type(totpInput, '{enter}');

    await waitFor(() => expect(postLogin).toHaveBeenCalledTimes(2));
    expect(postLogin).toHaveBeenLastCalledWith({ body: { name: 'stuart', challenge: 'TOTP', response: '000000' } });

    expect(setToken).toHaveBeenCalledTimes(1);
    expect(setToken).toHaveBeenLastCalledWith('abc');
  });
});
