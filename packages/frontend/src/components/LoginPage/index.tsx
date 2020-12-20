import { RouteComponentProps } from '@reach/router';
import React, { useState } from 'react';
import { PostLoginSetupResponse } from '../../api-types';
import { useRequester } from '../../hooks/requests';
import { useToken } from '../../hooks/token';
import LoginTotpForm from '../LoginTotpForm';
import LoginTotpSetup from '../LoginTotpSetup';
import LoginUserForm from '../LoginUserForm';
import './index.css';

export default function LoginPage({ navigate }: RouteComponentProps) {
  const requester = useRequester();
  const [, setToken] = useToken();
  const [showTotp, setShowTotp] = useState(false);
  const [name, setName] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [totpSetup, setTotpSetup] = useState<PostLoginSetupResponse>();

  async function submitLogin(username: string, method?: string, code?: string) {
    const requestData: any = {
      name: username,
    };

    if (method && code) {
      requestData.challenge = method;
      requestData.response = code;
    }

    const response = await requester.login(requestData);

    if ('token' in response) {
      setToken(response.token);

      if (navigate) {
        navigate('/');
      }

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
  }

  async function onUserSubmit(username: string) {
    setName(username);

    submitLogin(username, totpCode ? 'TOTP' : undefined, totpCode);
  }

  async function onTotpSubmit(code: string) {
    setTotpCode(code);

    if (name) {
      submitLogin(name, 'TOTP', code);
    }
  }

  return (
    <div className="LoginPage">
      <h2 className="LoginPage-heading">Login</h2>
      <LoginUserForm onSubmit={onUserSubmit} />
      {showTotp && <LoginTotpForm onSubmit={onTotpSubmit} />}
      {totpSetup && <LoginTotpSetup code={totpSetup.code} url={totpSetup.url} />}
    </div>
  );
}
