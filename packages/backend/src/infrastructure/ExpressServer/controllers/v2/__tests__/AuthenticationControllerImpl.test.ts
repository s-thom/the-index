import { getMockReq } from '@jest-mock/express';
import { mockLoggerService } from '../../../../../utils/test-utils';
import AuthenticationControllerImpl from '../AuthenticationControllerImpl';

describe('AuthenticationControllerImpl', () => {
  describe('logIn', () => {
    it('should add the session if the user is authenticated', async () => {
      const mockAuthenticate = jest.fn().mockResolvedValue({ authenticated: true, user: { id: 1, name: 'stuart' } });
      const mockIdNext = jest.fn().mockReturnValue('12345');
      const req = getMockReq({ body: { name: 'stuart', code: '000000' } });

      const controller = new AuthenticationControllerImpl(
        mockLoggerService,
        {
          authenticate: mockAuthenticate,
        },
        { next: mockIdNext },
      );

      await expect(controller.logIn(req, req.body)).resolves.toEqual({ user: { id: 1, name: 'stuart' } });

      expect(req.session).toEqual({ name: 'stuart', nonce: '12345' });
    });

    it('should throw if the user was not authenticated', async () => {
      const mockAuthenticate = jest.fn().mockResolvedValue({ authenticated: false, code: 'AAA' });
      const req = getMockReq({ body: { name: 'stuart', code: '000000' } });

      const controller = new AuthenticationControllerImpl(
        mockLoggerService,
        {
          authenticate: mockAuthenticate,
        },
        { next: jest.fn() },
      );

      await expect(controller.logIn(req, req.body)).rejects.toEqual(new Error('User has not set up TOTP'));
    });
  });

  describe('logOut', () => {
    it('should remove the session', async () => {
      const req = getMockReq({ session: { name: 'stuart' } });

      const controller = new AuthenticationControllerImpl(
        mockLoggerService,
        { authenticate: jest.fn() },
        { next: jest.fn() },
      );

      await expect(controller.logOut(req)).resolves.toEqual({});

      expect(req.session).toBeUndefined();
    });
  });

  describe('router', () => {
    it('should return a router', () => {
      const controller = new AuthenticationControllerImpl(
        mockLoggerService,
        { authenticate: jest.fn() },
        { next: jest.fn() },
      );
      const router = controller.router();

      expect(router.stack).toHaveLength(2);
    });
  });
});
