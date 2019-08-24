import { DecodedToken, generateJwt } from "../util/auth";
import { getUserByNameFn } from "../functions/users";
import { wrapPromiseRoute } from "../util/request";

interface LoginRequest {
  name: string;
}

interface LoginResponse {
  token: string;
  content: DecodedToken;
}

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
