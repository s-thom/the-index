export default class StatusError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;
  }
}

export enum CODES {
  OK = 200,
  CREATED = 201,
  NOT_FOUND = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_ERROR = 500
}
