import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as Yup from 'yup';
import ApiError from '../../../errors/ApiError';
import InvalidRequestError from '../../../errors/InvalidRequestError';
import MultipleError from '../../../errors/MultipleError';
import UnknownError from '../../../errors/UnknownError';

interface RouteValidation<RequestType, ParamsType, QueryType> {
  params?: ParamsType extends void ? undefined : Yup.SchemaOf<ParamsType>;
  query?: QueryType extends void ? undefined : Yup.SchemaOf<QueryType>;
  body?: RequestType extends void ? undefined : Yup.SchemaOf<RequestType>;
}

type AsyncRouteHandler<RequestType, ResponseType, ParamsType, QueryType> = (
  req: Request<ParamsType, ResponseType, RequestType, QueryType>,
  res: Response<ResponseType>,
  next: NextFunction,
) => Promise<ResponseType>;

export default function asyncRoute<
  RequestType = unknown,
  ResponseType = unknown,
  ParamsType = import('express-serve-static-core').ParamsDictionary,
  QueryType = import('qs').ParsedQs
>(
  validation: RouteValidation<RequestType, ParamsType, QueryType>,
  handler: AsyncRouteHandler<RequestType, ResponseType, ParamsType, QueryType>,
): RequestHandler<ParamsType, ResponseType, RequestType, QueryType> {
  // #region Internal functions
  /**
   * Transforms an error (usually a Yup ValidationError) to an ApiError
   * @param error Error to transform
   * @param type Usually which validation was being done (e.g. `path`, `query`, `body`)
   */
  function transformError(error: Error, type: string): ApiError | MultipleError {
    if (error instanceof Yup.ValidationError) {
      if (error.inner.length > 0) {
        // If the error contains multiple errors, transform each of them
        return new MultipleError(error.inner.map((inner) => transformError(inner, type)));
      }

      // Transform the error
      return new InvalidRequestError({
        message: error.message,
        safeMessage: 'Invalid request',
        meta: { type, path: error.path },
      });
    }

    // Error was not a yup error
    return new UnknownError({ message: error.message });
  }

  async function validateSchemas(
    req: Request<unknown, any, unknown, unknown>,
  ): Promise<{
    params: ParamsType extends void ? unknown : ParamsType;
    query: QueryType extends void ? unknown : QueryType;
    body: RequestType extends void ? unknown : RequestType;
  }> {
    let { params, body, query } = req;
    const errors: Error[] = [];

    if (validation.params) {
      try {
        const parsedParams = await validation.params.validate(req.params, { abortEarly: false });
        if (parsedParams) {
          params = parsedParams;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.push(transformError(error, 'path'));
        } else {
          throw error;
        }
      }
    }
    if (validation.query) {
      try {
        const parsedQuery = await validation.query.validate(req.query, { abortEarly: false });
        if (parsedQuery) {
          query = parsedQuery;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.push(transformError(error, 'query'));
        } else {
          throw error;
        }
      }
    }
    if (validation.body) {
      try {
        const parsedBody = await validation.body.validate(req.body, { abortEarly: false });
        if (parsedBody) {
          body = parsedBody;
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.push(transformError(error, 'body'));
        } else {
          throw error;
        }
      }
    }

    if (errors.length > 0) {
      throw new MultipleError(errors);
    }

    return {
      params: params as any,
      query: query as any,
      body: body as any,
    };
  }
  // #endregion

  return async (req, res, next) => {
    try {
      // Validate schema
      const { params, body, query } = await validateSchemas(req);
      // If there were results of validation, add to request
      if (params) {
        (req as any).originalParams = req.params;
        req.params = params as ParamsType;
      }
      if (query) {
        (req as any).originalQuery = req.query;
        req.query = query as QueryType;
      }
      if (body) {
        (req as any).originalBody = req.body;
        req.body = body as RequestType;
      }

      const response = await handler(req, res, next);

      // Prevent double sending in case handler called res directly
      if (res.headersSent) {
        return;
      }
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
