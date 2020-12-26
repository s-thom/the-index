import { Logger as PinoLogger } from 'pino';

interface LogFn {
  (msg: string, mixin: object): void;
  (msg: string): void;
}

export interface Logger {
  fatal: LogFn;
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  trace: LogFn;
  pino: PinoLogger;
}

export default interface ILoggerService {
  get(): Logger;
  child(name: string): Logger;
}
