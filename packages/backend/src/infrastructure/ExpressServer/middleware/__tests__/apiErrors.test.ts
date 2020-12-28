import { getMockReq, getMockRes } from '@jest-mock/express';
import ApiError from '../../../../errors/ApiError';
import MultipleError from '../../../../errors/MultipleError';
import { mockLogger } from '../../../../utils/test-utils';
import apiErrors from '../apiErrors';

describe('apiErrors', () => {
  it('should skip if a response has already been sent', () => {
    const req = getMockReq();
    const { res, next } = getMockRes({ headersSent: true });

    const middleware = apiErrors();

    const error = new Error('The passed in error');
    middleware(error, req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(error);
  });

  it('should use the default status code when given a MultipleError with no children', () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    const middleware = apiErrors({ defaultStatus: 9001 });

    middleware(new MultipleError([]), req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenLastCalledWith(9001);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({ errors: [] });
  });

  it('should determine the status code when given a MultipleError with child errors', () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    const middleware = apiErrors({ defaultStatus: 9001 });

    middleware(
      new MultipleError([
        new Error('Internal message'),
        new ApiError(9002, { message: 'ApiError 1', safeMessage: 'Message for user' }),
        new ApiError(400, { message: 'ApiError 2' }),
      ]),
      req,
      res,
      next,
    );

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenLastCalledWith(9002);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({
      errors: [
        {
          id: expect.any(String),
        },
        {
          id: expect.any(String),
          status: 9002,
          detail: 'Message for user',
        },
        {
          id: expect.any(String),
          status: 400,
        },
      ],
    });
  });

  it('should use the ID generator for any errors that are not ApiErrors', () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    const middleware = apiErrors({ idGenerator: { next: () => 'fancy-id' } });

    middleware(new Error('Internal message'), req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenLastCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({
      errors: [{ id: 'fancy-id' }],
    });
  });

  it('should log errors if given a logger', () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    const middleware = apiErrors({ logger: mockLogger });

    middleware(new Error('Internal message'), req, res, next);

    expect(mockLogger.error).toHaveBeenCalled();
  });
});
