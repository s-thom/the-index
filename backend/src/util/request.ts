import { Request, Response } from "express";
import { AuthorisedRequest, DecodedToken, generateJwt } from "./auth";

export interface Params {
  [key: string]: string | undefined;
}

/**
 * Wraps a Promise function to work with Express
 * @param routeFn Route to call
 */
export function wrapPromiseRoute<T = any, U = any>(
  routeFn: (body: T, params: Params, token?: DecodedToken) => Promise<U>
) {
  return async (req: Request, res: Response) => {
    try {
      // Overwrite query parameters with path parameters for safety
      const params: Params = Object.assign({}, req.query, req.params);

      const token: DecodedToken | undefined = (req as AuthorisedRequest).token;

      const dataPromise = routeFn(req.body, params, token);
      const newJwtPromise = Promise.resolve()
        .then(() => {
          if (token) {
            const newTokenPayload: DecodedToken = {
              userId: token.userId
            };
            return generateJwt(newTokenPayload);
          }
        })
        .catch(() => undefined);

      const newJwt = await newJwtPromise;
      if (newJwt) {
        res.setHeader("X-New-Token", newJwt);
      }

      const responseData = await dataPromise;
      res.json(responseData);
    } catch (err) {
      let statusCode = 500;
      let message = "Internal server error";

      if (!(err === null || err === undefined)) {
        if (err.status) {
          statusCode = err.status;
        }
        if (err.message) {
          message = err.message;
        }
      }

      res.status(statusCode).json({ message });
    }
  };
}
