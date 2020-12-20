import * as otplib from 'otplib';
import { DecodedToken, generateJwt } from '../util/auth';
import { getUserByNameFn, userHasAuthentication, resetUserTotpCode, verifyUserTotpCode } from '../functions/users';
import { wrapPromiseRoute } from '../util/request';

interface LoginBlankRequest {
  name: string;
}

interface LoginTotpRequest {
  name: string;
  challenge: 'TOTP';
  response: string;
}

type LoginRequest = LoginBlankRequest | LoginTotpRequest;

export interface LoginSuccessResponse {
  token: string;
  content: DecodedToken;
}

export interface LoginTotpSetupResponse {
  requires: 'setup';
  code: string;
  url: string;
}

export interface LoginChallengeResponse {
  requires: 'challenge';
  totp: true;
}

export type LoginResponse = LoginSuccessResponse | LoginTotpSetupResponse | LoginChallengeResponse;

function isValidTotpChallenge(body: LoginRequest): body is LoginTotpRequest {
  if (typeof (body as LoginTotpRequest).challenge === 'string') {
    return (body as LoginTotpRequest).challenge === 'TOTP';
  }
  return false;
}

export const loginRoute = wrapPromiseRoute<LoginRequest, LoginResponse>(async (body) => {
  const { name } = body;

  const user = await getUserByNameFn(name);

  const hasAuth = await userHasAuthentication(user.id, 'totp');
  if (!hasAuth) {
    const auth = await resetUserTotpCode(user.id);

    return {
      requires: 'setup',
      code: auth.secret,
      url: otplib.authenticator.keyuri(user.name, 'the-index', auth.secret),
    };
  }

  if (!isValidTotpChallenge(body)) {
    // No challenge response given, ask for one
    return {
      requires: 'challenge',
      totp: true,
    };
  }

  const valid = await verifyUserTotpCode(user.id, body.response);
  if (!valid) {
    throw new Error('Invalid challenge response');
  }

  const tokenContent: DecodedToken = {
    userId: user.id,
  };

  const jwt = await generateJwt(tokenContent);

  return {
    token: jwt,
    content: {
      userId: user.id,
    },
  };
});