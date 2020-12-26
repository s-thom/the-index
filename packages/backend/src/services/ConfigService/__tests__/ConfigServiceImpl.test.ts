import ConfigServiceImpl from '../ConfigServiceImpl';

// Backup and restore process.env during these tests.
// Also give each test its own shallow clone of the variables
let env: NodeJS.ProcessEnv;
beforeAll(() => {
  env = process.env;
});
beforeEach(() => {
  process.env = {
    SESSION_SECRET: 'secret-is-required',
    ...env,
  };
});
afterAll(() => {
  process.env = env;
});

describe('ConfigServiceImpl', () => {
  it('should provide defaults if environment variables are not set', () => {
    process.env = { SESSION_SECRET: 'secret-is-required' };

    const service = new ConfigServiceImpl();
    expect(service.express).toEqual({
      port: 7000,
      proxy: false,
      cors: {
        origin: undefined,
      },
      bodyParser: {
        limit: '1mb',
      },
      urlEncoded: {
        extended: true,
      },
      cookieSession: {
        name: 'session',
        secure: true,
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 5,
        secret: 'secret-is-required',
      },
    });
    expect(service.logger).toEqual({
      enabled: true,
      level: 'info',
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
      },
    });
    expect(service.typeOrm).toEqual({
      name: 'default',
      type: 'sqlite',
      database: './the-index.sqlite',
      entities: [expect.any(String)],
      synchronize: false,
    });
  });

  it('should use given values if environment variables are set', () => {
    process.env = {
      SESSION_SECRET: 'secret-is-required',
      CORS_ALLOWED: 'https://example.com',
      SERVER_PORT: '8080',
      LOGGER_LEVEL: 'trace',
      EXPRESS_PROXY: 'true',
      DATABASE_NAME: './example.sqlite',
      DATABASE_SYNCHRONIZE: 'true',
    };

    const service = new ConfigServiceImpl();
    expect(service.express).toEqual({
      port: 8080,
      proxy: true,
      cors: {
        origin: 'https://example.com',
      },
      bodyParser: {
        limit: '1mb',
      },
      urlEncoded: {
        extended: true,
      },
      cookieSession: {
        name: 'session',
        secure: true,
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 5,
        secret: 'secret-is-required',
      },
    });
    expect(service.logger).toEqual({
      enabled: true,
      level: 'trace',
      redact: {
        paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
      },
    });
    expect(service.typeOrm).toEqual({
      name: 'default',
      type: 'sqlite',
      database: './example.sqlite',
      entities: [expect.any(String)],
      synchronize: true,
    });
  });

  describe('isDev', () => {
    it.each([
      ['development', true],
      ['production', false],
    ])('should return (environment: %s) the value `%s`', (envName, expected) => {
      process.env.NODE_ENV = envName;
      const service = new ConfigServiceImpl();
      expect(service.isDev()).toBe(expected);
    });
  });

  describe('cookieSession.secret', () => {
    describe('secret', () => {
      it('should throw if no SESSION_SECRET is set', () => {
        process.env.SESSION_SECRET = undefined;
        expect(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const service = new ConfigServiceImpl();
        }).toThrow(new Error('No SESSION_SECRET provided'));
      });
    });
  });

  describe('express', () => {
    describe('port', () => {
      it('should use the default port if the variable is not a valid number', () => {
        process.env.SERVER_PORT = 'NaN';
        const service = new ConfigServiceImpl();
        expect(service.express.port).toEqual(7000);
      });
    });
  });
});
