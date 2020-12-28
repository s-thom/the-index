import { LoggerOptions } from 'pino';
import { Service } from 'typedi';
import IConfigService, { ExpressConfig, TypeOrmConfig } from './ConfigService';

const DEFAULT_PORT = 7000;

@Service()
export default class ConfigServiceImpl implements IConfigService {
  isDev() {
    return process.env.NODE_ENV === 'development';
  }

  express: ExpressConfig = {
    port: parseInt(process.env.SERVER_PORT ?? `${DEFAULT_PORT}`, 10) || DEFAULT_PORT,
    proxy: !!process.env.EXPRESS_PROXY,
    cors: {
      origin: process.env.CORS_ALLOWED,
    },
    bodyParser: {
      limit: '1mb',
    },
    urlEncoded: {
      extended: true,
    },
    cookieSession: {
      name: 'session',
      secure: !this.isDev(),
      httpOnly: true,
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24 * 5,
      secret:
        process.env.SESSION_SECRET ??
        (() => {
          throw new Error('No SESSION_SECRET provided');
        })(),
    },
  };

  logger: LoggerOptions = {
    enabled: true,
    level: process.env.LOGGER_LEVEL ?? 'info',
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'],
    },
  };

  typeOrm: TypeOrmConfig = {
    connection: process.env.DATABASE_CONNECTION ?? 'default',
  };
}
