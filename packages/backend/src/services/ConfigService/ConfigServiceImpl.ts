import { OptionsJson as BodyParserOptions, OptionsUrlencoded as UrlEncodedOptions } from 'body-parser';
import { join } from 'path';
import { LoggerOptions } from 'pino';
import { Service } from 'typedi';
import { ConnectionOptions } from 'typeorm';
import IConfigService, { ExpressConfig } from './ConfigService';

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

  bodyParser: BodyParserOptions = {
    limit: '1mb',
  };

  urlEncoded: UrlEncodedOptions = {
    extended: true,
  };

  typeOrm: ConnectionOptions = {
    name: 'default',
    type: 'sqlite',
    database:
      process.env.DATABASE_NAME ??
      (() => {
        throw new Error('No DATABASE_NAME provided');
      })(),
    entities: [join(__dirname, '/../../**/*.entity.{ts,js}')],
    synchronize: !process.env.DATABASE_SYNCHRONIZE?.match(/false/i),
  };
}
