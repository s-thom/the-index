import { CorsOptions } from 'cors';
import { LoggerOptions } from 'pino';
import { OptionsJson as BodyParserOptions, OptionsUrlencoded as UrlEncodedOptions } from 'body-parser';
import { Service } from 'typedi';
import IConfig, { ExpressConfig } from './Config';
import '../../util/env';

const DEFAULT_PORT = 7000;

@Service()
export default class ConfigImpl implements IConfig {
  cors: CorsOptions = {
    origin: process.env.CORS_ALLOWED,
  };

  express: ExpressConfig = {
    port: parseInt(process.env.SERVER_PORT ?? `${DEFAULT_PORT}`, 10) || DEFAULT_PORT,
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
}
