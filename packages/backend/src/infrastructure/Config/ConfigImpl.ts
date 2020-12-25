import { OptionsJson as BodyParserOptions, OptionsUrlencoded as UrlEncodedOptions } from 'body-parser';
import { CorsOptions } from 'cors';
import { join } from 'path';
import { LoggerOptions } from 'pino';
import { Service } from 'typedi';
import { ConnectionOptions } from 'typeorm';
import '../../old/util/env';
import IConfig, { ExpressConfig } from './Config';

const DEFAULT_PORT = 7000;

@Service()
export default class ConfigImpl implements IConfig {
  cors: CorsOptions = {
    origin: process.env.CORS_ALLOWED,
  };

  express: ExpressConfig = {
    port: parseInt(process.env.SERVER_PORT ?? `${DEFAULT_PORT}`, 10) || DEFAULT_PORT,
    sessionSecret:
      process.env.SESSION_SECRET ??
      (() => {
        throw new Error('No SESSION_SECRET provided');
      })(),
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
