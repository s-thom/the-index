import { Request, Response } from "express";
import { DecodedToken, AuthorisedRequest } from "./auth";

interface Params {
  [key: string]: string | undefined;
}

/**
 * Wraps a Promise function to work with Express
 * @param routeFn Route to call
 * @param preResponseFn Place to inject things like headers, if necessary
 */
export function wrapPromiseRoute<T = any, U = any>(
  routeFn: (body: T, params: Params, token?: DecodedToken) => Promise<U>,
  preResponseFn?: (reqBody: T, resBody: U, res: Response) => Promise<void>
) {
  return async (req: Request, res: Response) => {
    try {
      // Overwrite query parameters with path parameters for safety
      const params: Params = Object.assign({}, req.query, req.params);

      const responseData = await routeFn(
        req.body,
        params,
        (req as AuthorisedRequest).token
      );

      // Run the pre-response function
      if (preResponseFn) {
        await preResponseFn(req.body, responseData, res);
      }

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

const IDENTIFIER_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
export function isValidIdentifier(value: string) {
  return IDENTIFIER_REGEX.test(value);
}
