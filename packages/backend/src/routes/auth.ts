import * as otplib from 'otplib';
import {
  PostLoginChallengeResponse,
  PostLoginRequest as PostLoginEmptyRequest,
  PostLoginSetupResponse,
  PostLoginSuccessResponse,
  PostLoginTOTPRequest,
} from '../api-types';
import { getUserByNameFn, resetUserTotpCode, userHasAuthentication, verifyUserTotpCode } from '../functions/users';
import { DecodedToken, generateJwt } from '../util/auth';
import { wrapPromiseRoute } from '../util/request';

export type PostLoginRequest = PostLoginEmptyRequest | PostLoginTOTPRequest;
export type PostLoginResponse = PostLoginSuccessResponse | PostLoginSetupResponse | PostLoginChallengeResponse;

function isValidTotpChallenge(body: PostLoginRequest): body is PostLoginTOTPRequest {
  return 'challenge' in body && 'response' in body;
}

export const loginRoute = wrapPromiseRoute<PostLoginRequest, PostLoginResponse>(async (body) => {
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
