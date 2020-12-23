/* eslint-disable max-classes-per-file */
import correlator from 'express-correlation-id';
import Pino, { Logger as PinoLogger } from 'pino';
import { Inject, Service } from 'typedi';
import IConfig from '../Config/Config';
import ConfigImpl from '../Config/ConfigImpl';
import ILogger, { Logger } from './Logger';

class PinoWrapper implements Logger {
  constructor(readonly pino: PinoLogger) {}

  fatal(message: string, mixin: object = {}) {
    this.pino.fatal(mixin, message);
  }

  error(message: string, mixin: object = {}) {
    this.pino.error(mixin, message);
  }

  warn(message: string, mixin: object = {}) {
    this.pino.warn(mixin, message);
  }

  info(message: string, mixin: object = {}) {
    this.pino.info(mixin, message);
  }

  debug(message: string, mixin: object = {}) {
    this.pino.debug(mixin, message);
  }

  trace(message: string, mixin: object = {}) {
    this.pino.trace(mixin, message);
  }
}

@Service()
export default class LoggerImpl implements ILogger {
  private readonly logger: PinoLogger;

  constructor(@Inject(() => ConfigImpl) private readonly config: IConfig) {
    this.logger = Pino({
      ...config.logger,
      mixin: () => ({ correlationId: correlator.getId() }),
    });
  }

  get() {
    return new PinoWrapper(this.logger);
  }

  child(name: string) {
    return new PinoWrapper(this.logger.child({ module: name }));
  }
}
