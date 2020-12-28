import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import styled from 'styled-components';
import { ErrorResponseResponse, postV2Auth, PostV2AuthRequestBody, PostV2AuthResponse } from '../../api-types';
import LoginForm, { LoginFormValues } from '../../components/LoginForm';
import { useAuthorizationContext } from '../../context/AuthorizationContext';
import TotpSetup from './TotpSetup';

const StyledWrapper = styled.div`
  text-align: center;
`;

export default function LoginPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totpCode, setTotpCode] = useState<string>();
  const { setIsAuthorized } = useAuthorizationContext();

  const loginResponseCallback = useCallback(() => setIsAuthorized(true), [setIsAuthorized]);
  const loginErrorCallback = useCallback((error: unknown) => {
    // Do a quick test to see if this is an Axios error
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as AxiosError).response!;
      // Test to see fi it's probably a well-formed error
      if ('errors' in response.data) {
        const data = response.data as ErrorResponseResponse;

        // Try find TOTP setup error
        const needsSetupError = data.errors.find((e) => e.code === 'auth.totp.setup');
        if (needsSetupError) {
          setTotpCode(needsSetupError.meta?.code);
        }
      }
    }
  }, []);

  const { mutate: submitLogin } = useMutation<PostV2AuthResponse, void, PostV2AuthRequestBody>(
    ['login'],
    async ({ code, name }) => {
      const response = await postV2Auth({ body: { name, code } });
      return response;
    },
    { onSuccess: loginResponseCallback, onError: loginErrorCallback },
  );

  const onSubmit = useCallback(
    (values: LoginFormValues) => {
      submitLogin(values);
    },
    [submitLogin],
  );

  return (
    <StyledWrapper>
      <h2>Login</h2>
      <LoginForm onSubmit={onSubmit} challenge="totp" />
      {totpCode && <TotpSetup code={totpCode} />}
    </StyledWrapper>
  );
}
