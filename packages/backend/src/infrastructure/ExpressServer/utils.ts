import { NextFunction, Request, RequestHandler, Response } from 'express';

export type AsyncRouteHandler<ResponseType> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<ResponseType>;

export function asyncRoute<T>(handler: AsyncRouteHandler<T>): RequestHandler {
  return (req, res, next) => {
    return handler(req, res, next)
      .then((response) => {
        // Prevent double sending in case handler called res directly
        if (res.headersSent) {
          return;
        }

        res.status(200).json(response);
      })
      .catch(next);
  };
}
