import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { postLogin, PostLoginRequest, PostLoginSetupResponse, PostLoginTOTPRequest } from '../../api-types';
import { useAuthorizationContext } from '../../context/AuthorizationContext';
import LoginTotpForm from '../LoginTotpForm';
import LoginTotpSetup from '../LoginTotpSetup';
import LoginUserForm from '../LoginUserForm';
import './index.css';

export default function LoginPage() {
  const history = useHistory();
  const [showTotp, setShowTotp] = useState(false);
  const [name, setName] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpSetup, setTotpSetup] = useState<PostLoginSetupResponse>();
  const { setToken } = useAuthorizationContext();

  const submitLogin = useCallback(
    async (username: string, method?: 'TOTP', code?: string) => {
      const requestData: PostLoginRequest | PostLoginTOTPRequest =
        method && code ? { name: username, challenge: method, response: code } : { name: username };

      const response = await postLogin({ body: requestData });

      if ('token' in response) {
        history.push('/search');
        setToken(response.token);
        return;
      }

      if (response.requires === 'challenge' && (response as any).totp) {
        setShowTotp(true);
        return;
      }

      if (response.requires === 'setup') {
        setTotpSetup(response);
        setShowTotp(true);
      }
    },
    [history, setToken],
  );

  const onUserSubmit = useCallback(
    (username: string) => {
      setName(username);

      submitLogin(username, totpCode ? 'TOTP' : undefined, totpCode);
    },
    [submitLogin, totpCode],
  );

  const onTotpSubmit = useCallback(
    (code: string) => {
      setTotpCode(code);

      if (name) {
        submitLogin(name, 'TOTP', code);
      }
    },
    [name, submitLogin],
  );

  return (
    <div className="LoginPage">
      <h2 className="LoginPage-heading">Login</h2>
      <LoginUserForm onSubmit={onUserSubmit} />
      {showTotp && <LoginTotpForm onSubmit={onTotpSubmit} />}
      {totpSetup && <LoginTotpSetup code={totpSetup.code} url={totpSetup.url} />}
    </div>
  );
}
