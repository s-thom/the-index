import { getMockReq, getMockRes } from '@jest-mock/express';
import * as Yup from 'yup';
import MultipleError from '../../../../errors/MultipleError';
import asyncRoute from '../asyncRoute';

describe('asyncRoute', () => {
  it('should call the request handler with no validation', async () => {
    const req = getMockReq();
    const { res, next } = getMockRes();
    const handler = jest.fn(async () => ({ example: 'foo' }));

    const middleware = asyncRoute({}, handler);

    await middleware(req, res, next);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({ example: 'foo' });
  });

  it('should not try to send a response if one has already been sent', async () => {
    const req = getMockReq();
    const { res, next } = getMockRes({ headersSent: true });
    const handler = jest.fn(async () => ({ example: 'foo' }));

    const middleware = asyncRoute({}, handler);

    await middleware(req, res, next);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(0);
  });

  it('should call the request handler with all validation', async () => {
    const req = getMockReq({ params: { string: 'foo' }, body: { number: 5 }, query: { boolean: true } });
    const { res, next } = getMockRes();
    const handler = jest.fn(async () => ({ example: 'foo' }));

    const middleware = asyncRoute(
      {
        body: Yup.object().shape({ number: Yup.number().required() }).defined(),
        params: Yup.object().shape({ string: Yup.string().required() }).defined(),
        query: Yup.object().shape({ boolean: Yup.boolean().required() }).defined(),
      },
      handler,
    );

    await middleware(req, res, next);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenLastCalledWith(req, res, next);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenLastCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenLastCalledWith({ example: 'foo' });
  });

  it('should error when there are validation errors', async () => {
    const req = getMockReq({ params: { number: 'foo' }, body: { number: 'bar' }, query: { number: 'baz' } });
    const { res, next } = getMockRes();
    const handler = jest.fn(async () => ({ example: 'foo' }));

    const middleware = asyncRoute(
      {
        body: Yup.object().shape({ number: Yup.number().required() }).defined(),
        params: Yup.object().shape({ number: Yup.number().required() }).defined(),
        query: Yup.object().shape({ number: Yup.number().required() }).defined(),
      },
      handler,
    );

    await middleware(req, res, next);

    expect(handler).toHaveBeenCalledTimes(0);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(new MultipleError([new Error(), new Error(), new Error()]));
  });
});
