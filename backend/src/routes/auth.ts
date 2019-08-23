import { DecodedToken, generateJwt } from "../util/auth";
import { getUserByNameFn } from "../functions/users";
import { wrapPromiseRoute } from "../util/request";

interface LoginRequest {
  name: string;
}

interface LoginResponse {
  token: DecodedToken;
}

export const loginRoute = wrapPromiseRoute<LoginRequest, LoginResponse>(
  async (body, params, token) => {
    const name = body.name;

    const user = await getUserByNameFn(name);

    // There is no security at the moment. This will need to change before any prod deployment
    return {
      token: {
        userId: user.id
      }
    };
  },
  async (reqBody, resBody, res) => {
    const jwt = await generateJwt(resBody.token);
    res.setHeader("Authorization", `Bearer: ${jwt}`);
  }
);
