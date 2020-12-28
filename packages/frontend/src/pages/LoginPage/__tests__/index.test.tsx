import userEvent from '@testing-library/user-event';
import LoginPage from '..';
import * as mockedApi from '../../../api-types';
import { AuthorizationContext } from '../../../context/AuthorizationContext';
import { render, screen, waitFor } from '../../../util/test-utils';

jest.mock('qrcode');
jest.mock('../../../api-types');

const { postV2Auth } = mockedApi as jest.Mocked<typeof mockedApi>;

describe('LoginPage', () => {
  it('should allow a user to log in', async () => {
    const setIsAuthorized = jest.fn();
    postV2Auth
      .mockRejectedValueOnce({ status: 401, reesponse: { errors: [{}] } })
      .mockResolvedValueOnce({ user: { name: 'stuart' } });

    render(
      <AuthorizationContext.Provider value={{ isAuthorized: false, setIsAuthorized }}>
        <LoginPage />
      </AuthorizationContext.Provider>,
    );
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Login');

    // Add username
    const userInput = screen.getByPlaceholderText('Name');
    userEvent.type(userInput, 'stuart');
    const totpInput = screen.getByPlaceholderText('Code');
    userEvent.type(totpInput, '000000');
    userEvent.type(totpInput, '{enter}');

    await waitFor(() => expect(postV2Auth).toHaveBeenCalledTimes(1));
    expect(postV2Auth).toHaveBeenLastCalledWith({ body: { name: 'stuart', code: '000000' } });

    userEvent.type(totpInput, '{enter}');

    await waitFor(() => expect(postV2Auth).toHaveBeenCalledTimes(2));
    expect(postV2Auth).toHaveBeenLastCalledWith({ body: { name: 'stuart', code: '000000' } });

    expect(setIsAuthorized).toHaveBeenCalledTimes(1);
    expect(setIsAuthorized).toHaveBeenLastCalledWith(true);
  });

  it('should request a user to set up their TOTP', async () => {
    const setToken = jest.fn();
    postV2Auth
      .mockRejectedValueOnce({
        status: 401,
        response: { data: { errors: [{ code: 'auth.totp.setup', meta: { code: 'AAAA' } }] } },
      })
      .mockResolvedValueOnce({ user: { name: 'stuart' } });

    render(
      <AuthorizationContext.Provider value={{ isAuthorized: false, setIsAuthorized: setToken }}>
        <LoginPage />
      </AuthorizationContext.Provider>,
    );
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(2);
    expect(headings[0]).toHaveTextContent('Login');

    // Add username
    const userInput = screen.getByPlaceholderText('Name');
    userEvent.type(userInput, 'stuart');
    const totpInput = screen.getByPlaceholderText('Code');
    userEvent.type(totpInput, '000000');
    userEvent.type(totpInput, '{enter}');

    await waitFor(() => expect(postV2Auth).toHaveBeenCalledTimes(1));
    expect(postV2Auth).toHaveBeenLastCalledWith({ body: { name: 'stuart', code: '000000' } });

    // Expect setup
    expect(screen.queryByText('Set up your authenticator app')).toBeInTheDocument();

    userEvent.type(totpInput, '{enter}');

    await waitFor(() => expect(postV2Auth).toHaveBeenCalledTimes(2));
    expect(postV2Auth).toHaveBeenLastCalledWith({ body: { name: 'stuart', code: '000000' } });

    expect(setToken).toHaveBeenCalledTimes(1);
    expect(setToken).toHaveBeenLastCalledWith(true);
  });
});
