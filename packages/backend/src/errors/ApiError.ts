import Container from 'typedi';
import IIdentifierService from '../services/IdentifierService/IdentifierService';
import IdentifierServiceImpl from '../services/IdentifierService/IdentifierServiceImpl';

export interface ApiErrorOptions {
  /**
   * A code unique to the type of problem
   */
  code?: string;
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

// I can't think of a clean way to get rid of this `Container.get` call.
// It's *mostly* ok, given that the identifier service does not inject any others into itself.
const idService = Container.get<IIdentifierService>(IdentifierServiceImpl);

export default class ApiError extends Error {
  readonly id = idService.next();

  constructor(readonly status: number, readonly options: ApiErrorOptions) {
    super(options.message);

    // Typescript compiles errors weird
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
