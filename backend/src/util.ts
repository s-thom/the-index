import { Request, Response } from "express";

/**
 * Wraps a Promise function to work with Express
 * @param routeFn Route to call
 */
export function wrapPromiseRoute<T = any, U = any>(
  routeFn: (requestBody: T, request: Request) => Promise<U>
) {
  return async (request: Request, response: Response) => {
    try {
      const responseData = await routeFn(request.body, request);
      response.json(responseData);
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

      response.status(statusCode).json({ message });
    }
  };
}

export class StatusError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;
  }
}
