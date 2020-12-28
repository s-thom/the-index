import ApiError, { ApiErrorOptions } from './ApiError';

export default class UnknownError extends ApiError {
  constructor(options: ApiErrorOptions) {
    super(500, options);
  }
}
