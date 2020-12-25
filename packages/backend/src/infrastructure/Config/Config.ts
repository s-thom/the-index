import { OptionsJson as BodyParserOptions, OptionsUrlencoded as UrlEncodedOptions } from 'body-parser';
import { CorsOptions } from 'cors';
import { LoggerOptions } from 'pino';
import { ConnectionOptions } from 'typeorm';

export interface ExpressConfig {
  port: number;
  proxy: boolean;

  cors: CorsOptions;
  bodyParser: BodyParserOptions;
  urlEncoded: UrlEncodedOptions;
  cookieSession: CookieSessionInterfaces.CookieSessionOptions;
}

export default interface IConfig {
  isDev(): boolean;
  express: ExpressConfig;
  logger: LoggerOptions;
  typeOrm: ConnectionOptions;
}
