import { ErrorRequestHandler } from 'express';
import Container from 'typedi';
import { Error as ErrorType } from '../../../api-types';
import ApiError from '../../../errors/ApiError';
import MultipleError from '../../../errors/MultipleError';
import IIdentifierService from '../../../services/IdentifierService';
import IdentifierServiceImpl from '../../../services/IdentifierServiceImpl';
import ILogger from '../../Logger/Logger';
import LoggerImpl from '../../Logger/LoggerImpl';

interface JsonApiErrorsOptions {
  defaultStatus: number;
}

const idService = Container.get<IIdentifierService>(IdentifierServiceImpl);
const loggerService = Container.get<ILogger>(LoggerImpl);
const logger = loggerService.child('Express.apiErrors');

/**
 * Determines the final error status for this
 * @param error
 */
export function determineErrorStatus(error: unknown, defaultStatus: number): number {
  if (error instanceof ApiError) {
    // ApiErrors have a status, so use that.
    return error.status;
  }
  if (error instanceof MultipleError) {
    // Return the default status if there are no errors in the MultipleError.
    if (error.errors.length === 0) {
      return defaultStatus;
    }

    // Return the highest status code of all children.
    // The highest number is *roughly* equivalent to severity.
    // The most important thing is the hundreds digit.
    return error.errors.reduce((acc, err) => Math.max(acc, determineErrorStatus(err, defaultStatus)), 0);
  }

  // Fallback case for all other Error types and any weird values that end up here
  return defaultStatus;
}

/**
 * Converts an error object to a list of JSON API errors
 * @param error Error to convert
 */
export function errorToJsonErrors(error: unknown): ErrorType[] {
  const errors = error instanceof MultipleError ? error.errors : [error];

  return errors.map<ErrorType>((e) => {
    if (e instanceof ApiError) {
      return {
        id: e.id,
        code: e.options.code,
        status: e.status,
        detail: e.options.safeMessage,
        meta: e.options.meta,
      };
    }

    const id = idService.next();
    logger.warn('Error is not an API error', {
      error,
      message: (error as any)?.message,
      id,
    });
    return {
      id,
    };
  });
}

const DEFAULT_OPTIONS: JsonApiErrorsOptions = {
  defaultStatus: 500,
};

/**
 * Factory for an error middleware that is similar to JSON API's error definitions
 * @param options Options for creating errors
 */
export default function apiErrors(options?: Partial<JsonApiErrorsOptions>): ErrorRequestHandler {
  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (err, req, res, next) => {
    // Prevent errors from trying to send two responses
    // https://expressjs.com/en/guide/error-handling.html
    if (res.headersSent) {
      return next(err);
    }

    // Log the incoming error for tracing
    logger.error('Error caught by error handler', { error: err, message: err?.message });

    const finalStatus = determineErrorStatus(err, mergedOptions.defaultStatus);
    const errorObjects = errorToJsonErrors(err);

    // Log the final output
    logger.error('API errors', { errors: errorObjects });

    return res.status(finalStatus).json({ errors: errorObjects });
  };
}
