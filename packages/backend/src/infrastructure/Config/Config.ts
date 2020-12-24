import { CorsOptions } from 'cors';
import { LoggerOptions } from 'pino';
import { OptionsJson as BodyParserOptions, OptionsUrlencoded as UrlEncodedOptions } from 'body-parser';
import { ConnectionOptions } from 'typeorm';

export interface ExpressConfig {
  port: number;
}

export default interface IConfig {
  cors: CorsOptions;
  express: ExpressConfig;
  logger: LoggerOptions;
  bodyParser: BodyParserOptions;
  urlEncoded: UrlEncodedOptions;
  typeOrm: ConnectionOptions;
}
