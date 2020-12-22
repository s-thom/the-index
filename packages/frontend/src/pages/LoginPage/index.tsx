import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import {
  postLogin,
  PostLoginChallengeResponse,
  PostLoginRequest,
  PostLoginSetupResponse,
  PostLoginSuccessResponse,
  PostLoginTOTPRequest,
} from '../../api-types';
import { useAuthorizationContext } from '../../context/AuthorizationContext';
import LoginTotpForm from '../../components/LoginTotpForm';
import LoginTotpSetup from '../../components/LoginTotpSetup';
import LoginUserForm from '../../components/LoginUserForm';
import './index.css';

type LoginResponseCombined = PostLoginSetupResponse | PostLoginSuccessResponse | PostLoginChallengeResponse;

export default function LoginPage() {
  const history = useHistory();
  const [showTotp, setShowTotp] = useState(false);
  const [name, setName] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpSetup, setTotpSetup] = useState<PostLoginSetupResponse>();
  const { setToken } = useAuthorizationContext();

  const loginResponseCallback = useCallback(
    (response: LoginResponseCombined) => {
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

  const { mutate: submitLogin } = useMutation<
    LoginResponseCombined,
    void,
    { method?: 'TOTP'; code?: string; username: string }
  >(
    ['login'],
    async ({ method, code, username }) => {
      const requestData: PostLoginRequest | PostLoginTOTPRequest =
        method && code ? { name: username, challenge: method, response: code } : { name: username };

      const response = await postLogin({ body: requestData });
      return response;
    },
    { onSuccess: loginResponseCallback },
  );

  const onUserSubmit = useCallback(
    (username: string) => {
      setName(username);

      submitLogin({ username, method: totpCode ? 'TOTP' : undefined, code: totpCode });
    },
    [submitLogin, totpCode],
  );

  const onTotpSubmit = useCallback(
    (code: string) => {
      setTotpCode(code);

      if (name) {
        submitLogin({ username: name, method: 'TOTP', code });
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
