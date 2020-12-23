import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import {
  postLogin,
  PostLoginChallengeResponse,
  PostLoginRequest,
  PostLoginSetupResponse,
  PostLoginSuccessResponse,
  PostLoginTOTPRequest,
} from '../../api-types';
import LoginForm, { LoginFormValues } from '../../components/LoginForm';
import { useAuthorizationContext } from '../../context/AuthorizationContext';
import TotpSetup from './TotpSetup';

type LoginResponseCombined = PostLoginSetupResponse | PostLoginSuccessResponse | PostLoginChallengeResponse;

const StyledWrapper = styled.div`
  text-align: center;
`;

export default function LoginPage() {
  const [showTotp, setShowTotp] = useState(false);
  const [totpSetup, setTotpSetup] = useState<PostLoginSetupResponse>();
  const { setToken } = useAuthorizationContext();

  const loginResponseCallback = useCallback(
    (response: LoginResponseCombined) => {
      if ('token' in response) {
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
    [setToken],
  );

  const { mutate: submitLogin } = useMutation<
    LoginResponseCombined,
    void,
    { method?: 'TOTP'; code?: string; name: string }
  >(
    ['login'],
    async ({ method, code, name }) => {
      const requestData: PostLoginRequest | PostLoginTOTPRequest =
        method && code ? { name, challenge: method, response: code } : { name };

      const response = await postLogin({ body: requestData });
      return response;
    },
    { onSuccess: loginResponseCallback },
  );

  const onSubmit = useCallback(
    (values: LoginFormValues) => {
      if (values.response) {
        submitLogin({
          name: values.name,
          method: 'TOTP',
          code: values.response,
        });
      } else {
        submitLogin({ name: values.name });
      }
    },
    [submitLogin],
  );

  return (
    <StyledWrapper>
      <h2>Login</h2>
      <LoginForm onSubmit={onSubmit} challenge={showTotp ? 'totp' : undefined} />
      {totpSetup && <TotpSetup code={totpSetup.code} url={totpSetup.url} />}
    </StyledWrapper>
  );
}
