import ApiError, { ApiErrorOptions } from './ApiError';

export default class UnauthorizedError extends ApiError {
  constructor(options: ApiErrorOptions) {
    super(401, options);
  }
}
