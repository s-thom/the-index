import { DecodedToken, generateJwt } from "../util/auth";
import { getUserByNameFn } from "../functions/users";
import { wrapPromiseRoute } from "../util/request";

interface LoginBlankRequest {
  name: string;
}

interface LoginTotpRequest {
  name: string;
  challenge: "TOTP";
  response: string;
}

type LoginRequest = LoginBlankRequest | LoginTotpRequest;

interface LoginSuccessResponse {
  token: string;
  content: DecodedToken;
}

interface LoginTotpSetupResponse {
  requires: "setup";
  code: string;
  url: string;
}

interface LoginChallengeResponse {
  requires: "challenge";
  totp: true;
}

type LoginResponse =
  | LoginSuccessResponse
  | LoginTotpSetupResponse
  | LoginChallengeResponse;

export const loginRoute = wrapPromiseRoute<LoginRequest, LoginResponse>(
  async (body, params, token) => {
    const name = body.name;

    const user = await getUserByNameFn(name);

    const tokenContent: DecodedToken = {
      userId: user.id
    };

    const jwt = await generateJwt(tokenContent);

    // There is no security at the moment. This will need to change before any prod deployment
    return {
      token: jwt,
      content: {
        userId: user.id
      }
    };
  }
);
