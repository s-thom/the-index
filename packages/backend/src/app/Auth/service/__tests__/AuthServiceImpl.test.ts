import { mockLoggerService } from '../../../../utils/test-utils';
import AuthServiceImpl from '../AuthServiceImpl';

describe('AuthServiceImpl', () => {
  describe('authenticate', () => {
    it("should validate a user's credentials", async () => {
      const service = new AuthServiceImpl(
        mockLoggerService,
        {
          getById: jest.fn(),
          getByName: jest.fn().mockResolvedValue({ id: 1, name: 'stuart' }),
        },
        {
          getAuthMethodsByName: jest.fn().mockResolvedValue([{ type: 'totp', secret: 'hush-hush' }]),
          insertAuthMethod: jest.fn(),
        },
        {
          generateSecret: jest.fn(),
          validateCode: jest.fn().mockReturnValue(true),
        },
      );

      await expect(service.authenticate({ name: 'stuart', code: '000000' })).resolves.toEqual({
        authenticated: true,
        user: { id: 1, name: 'stuart' },
      });
    });

    it('should generate TOTP credentials if the user has none', async () => {
      const service = new AuthServiceImpl(
        mockLoggerService,
        {
          getById: jest.fn(),
          getByName: jest.fn().mockResolvedValue({ id: 1, name: 'stuart' }),
        },
        {
          getAuthMethodsByName: jest.fn().mockResolvedValue([]),
          insertAuthMethod: jest.fn().mockResolvedValue({ id: 1, type: 'totp', secret: 'hush-hush' }),
        },
        {
          generateSecret: jest.fn().mockReturnValue('hush-hush'),
          validateCode: jest.fn(),
        },
      );

      await expect(service.authenticate({ name: 'stuart' })).resolves.toEqual({
        authenticated: false,
        code: 'hush-hush',
      });
    });

    it('should throw if no user exists with the given name', async () => {
      const service = new AuthServiceImpl(
        mockLoggerService,
        {
          getById: jest.fn(),
          getByName: jest.fn().mockRejectedValue(new Error()),
        },
        {
          getAuthMethodsByName: jest.fn().mockResolvedValue([{ type: 'totp', secret: 'hush-hush' }]),
          insertAuthMethod: jest.fn(),
        },
        {
          generateSecret: jest.fn(),
          validateCode: jest.fn(),
        },
      );

      await expect(service.authenticate({ name: 'stuart' })).rejects.toEqual(new Error('No user with name "stuart"'));
    });

    it('should throw if no TOTP code is given', async () => {
      const service = new AuthServiceImpl(
        mockLoggerService,
        {
          getById: jest.fn(),
          getByName: jest.fn().mockResolvedValue({ id: 1, name: 'stuart' }),
        },
        {
          getAuthMethodsByName: jest.fn().mockResolvedValue([{ type: 'totp', secret: 'hush-hush' }]),
          insertAuthMethod: jest.fn(),
        },
        {
          generateSecret: jest.fn(),
          validateCode: jest.fn(),
        },
      );

      await expect(service.authenticate({ name: 'stuart' })).rejects.toEqual(new Error('No code given'));
    });

    it('should throw if an invalid TOTP code is given', async () => {
      const service = new AuthServiceImpl(
        mockLoggerService,
        {
          getById: jest.fn(),
          getByName: jest.fn().mockResolvedValue({ id: 1, name: 'stuart' }),
        },
        {
          getAuthMethodsByName: jest.fn().mockResolvedValue([{ type: 'totp', secret: 'hush-hush' }]),
          insertAuthMethod: jest.fn(),
        },
        {
          generateSecret: jest.fn(),
          validateCode: jest.fn().mockReturnValue(false),
        },
      );

      await expect(service.authenticate({ name: 'stuart', code: '000000' })).rejects.toEqual(
        new Error('Invalid code given'),
      );
    });
  });
});
