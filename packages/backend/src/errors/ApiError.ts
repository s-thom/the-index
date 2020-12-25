import Container from 'typedi';
import IIdentifierService from '../services/IdentifierService';
import IdentifierServiceImpl from '../services/IdentifierServiceImpl';

export interface ApiErrorOptions {
  /**
   * A message for the error
   */
  message: string;
  /**
   * A message suitable for transmission over network
   */
  safeMessage?: string;
  /**
   * Additional information suitable for transmission over network
   */
  meta?: object;
}

const idService = Container.get<IIdentifierService>(IdentifierServiceImpl);

export default class ApiError extends Error {
  readonly id = idService.next();

  constructor(readonly status: number, readonly options: ApiErrorOptions) {
    super(options.message);
  }
}
