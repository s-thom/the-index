import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";

export interface DecodedToken {
  userId: string;
}

export interface AuthorisedRequest extends Request {
  token: DecodedToken;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable not set. While you're at it, check the others."
  );
}

// Thanks to Naren Yellavula for writing the following article
// https://medium.com/dev-bits/c403f7cf04f4

export function checkTokenMiddleware(
  req: AuthorisedRequest,
  res: Response,
  next: NextFunction
) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    // There shouldn't be multiple headers, but just in case
    if (Array.isArray(token)) {
      return res.status(500).json({
        message: "Too many tokens"
      });
    }

    // Remove Bearer from string
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, JWT_SECRET as string, (err: Error, decoded: any) => {
      if (err) {
        return res.status(401).json({
          message: "Token is not valid"
        });
      } else {
        req.token = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Auth token is not supplied"
    });
  }
}

export async function generateJwt(token: DecodedToken) {
  return new Promise<string>((res, rej) => {
    jwt.sign(
      token,
      JWT_SECRET as string,
      { algorithm: "RS256", expiresIn: "30d" },
      (err, jwtToken) => {
        if (err) {
          rej(err);
          return;
        }
        res(jwtToken);
      }
    );
  });
}
