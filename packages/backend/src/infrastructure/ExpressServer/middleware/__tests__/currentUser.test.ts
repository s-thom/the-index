import { getMockReq, getMockRes } from '@jest-mock/express';
import currentUser from '../currentUser';

describe('currentUser', () => {
  it('should error if there is no session', async () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    const middleware = currentUser({ userService: { getById: jest.fn(), getByName: jest.fn() } });

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(new Error('No session'));
  });

  it('should error if there is a session but no name', async () => {
    const req = getMockReq({ session: {} });
    const { res, next } = getMockRes();

    const middleware = currentUser({ userService: { getById: jest.fn(), getByName: jest.fn() } });

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(new Error('No session'));
  });

  it('should error if there is a session but the user does not exist', async () => {
    const req = getMockReq({ session: { name: 'stuart' } });
    const { res, next } = getMockRes();

    const middleware = currentUser({
      userService: { getById: jest.fn(), getByName: jest.fn().mockRejectedValue(new Error('Some error')) },
    });

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(new Error('Error during user retrieval'));
  });

  it('should add the user to the request', async () => {
    const req = getMockReq({ session: { name: 'stuart' } });
    const { res, next } = getMockRes();

    const middleware = currentUser({
      userService: { getById: jest.fn(), getByName: jest.fn().mockResolvedValue({ id: 1, name: 'stuart' }) },
    });

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith();

    expect(req.user).toEqual({ id: 1, name: 'stuart' });
  });
});
