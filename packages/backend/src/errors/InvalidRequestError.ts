import ApiError, { ApiErrorOptions } from './ApiError';

export default class InvalidRequestError extends ApiError {
  constructor(options: ApiErrorOptions) {
    super(400, options);
  }
}
