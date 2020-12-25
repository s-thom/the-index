import { NextFunction, Request, RequestHandler, Response } from 'express';
import Container from 'typedi';
import * as Yup from 'yup';
import ApiError from '../../../errors/ApiError';
import InvalidRequestError from '../../../errors/InvalidRequestError';
import MultipleError from '../../../errors/MultipleError';
import UnknownError from '../../../errors/UnknownError';
import ILogger from '../../Logger/Logger';
import LoggerImpl from '../../Logger/LoggerImpl';

const loggerService = Container.get<ILogger>(LoggerImpl);
const logger = loggerService.child('Express.asyncRoute');

function transformError(error: Error): ApiError | MultipleError {
  if (error instanceof Yup.ValidationError) {
    if (error.inner.length > 0) {
      // If the error contains multiple errors, transform each of them
      return new MultipleError(error.inner.map(transformError));
    }

    // Transform the error
    return new InvalidRequestError({
      message: error.message,
      safeMessage: 'Invalid request',
      meta: { path: error.path },
    });
  }

  // Error was not a yup error
  logger.warn('Unknown error in request validation', { error, message: error.message });
  return new UnknownError({ message: error.message });
}

export interface RouteValidation<RequestType, ParamsType> {
  params?: ParamsType extends void ? undefined : Yup.SchemaOf<ParamsType>;
  body?: RequestType extends void ? undefined : Yup.SchemaOf<RequestType>;
}

async function validateSchemas<RequestType, ParamsType>(
  req: Request<unknown, any, unknown>,
  validation: RouteValidation<RequestType, ParamsType>,
): Promise<{
  params: ParamsType extends void ? unknown : ParamsType;
  body: RequestType extends void ? unknown : RequestType;
}> {
  let { params, body } = req;
  const errors: Error[] = [];

  if (validation.params) {
    try {
      params = await validation.params.validate(req.params, { abortEarly: false });
    } catch (error: unknown) {
      if (error instanceof Error) {
        errors.push(error);
      } else {
        throw error;
      }
    }
  }
  if (validation.body) {
    try {
      body = await validation.body.validate(req.body, { abortEarly: false });
    } catch (error: unknown) {
      if (error instanceof Error) {
        errors.push(error);
      } else {
        throw error;
      }
    }
  }

  if (errors.length > 0) {
    throw new MultipleError(errors.map(transformError));
  }

  return {
    params: params as any,
    body: body as any,
  };
}

export type AsyncRouteHandler<RequestType, ResponseType, ParamsType> = (
  req: Request<ParamsType, ResponseType, RequestType>,
  res: Response<ResponseType>,
  next: NextFunction,
) => Promise<ResponseType>;

export default function asyncRoute<
  RequestType = unknown,
  ResponseType = unknown,
  ParamsType = import('express-serve-static-core').ParamsDictionary
>(
  validation: RouteValidation<RequestType, ParamsType>,
  handler: AsyncRouteHandler<RequestType, ResponseType, ParamsType>,
): RequestHandler<ParamsType, ResponseType, RequestType> {
  return async (req, res, next) => {
    try {
      // Validate schema
      const { params, body } = await validateSchemas(req, validation);
      // If there were results of validation, add to request
      if (params) {
        (req as any).originalParams = req.params;
        req.params = params as ParamsType;
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
