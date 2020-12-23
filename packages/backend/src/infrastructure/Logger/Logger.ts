import { Logger as PinoLogger } from 'pino';

export type Logger = PinoLogger;

export default interface ILogger {
  get(): Logger;
  child(name: string): Logger;
}
