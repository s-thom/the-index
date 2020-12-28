import ApiError, { ApiErrorOptions } from './ApiError';

export default class NotFoundError extends ApiError {
  constructor(options: ApiErrorOptions) {
    super(404, options);
  }
}
