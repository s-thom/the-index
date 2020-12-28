import { OptionsJson as BodyParserOptions, OptionsUrlencoded as UrlEncodedOptions } from 'body-parser';
import { CorsOptions } from 'cors';
import { LoggerOptions } from 'pino';

export interface ExpressConfig {
  port: number;
  proxy: boolean;

  cors: CorsOptions;
  bodyParser: BodyParserOptions;
  urlEncoded: UrlEncodedOptions;
  cookieSession: CookieSessionInterfaces.CookieSessionOptions;
}

export interface TypeOrmConfig {
  connection: string;
}

export default interface IConfigService {
  isDev(): boolean;
  express: ExpressConfig;
  logger: LoggerOptions;
  typeOrm: TypeOrmConfig;
}
