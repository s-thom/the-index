/* eslint-disable max-classes-per-file */
import correlator from 'express-correlation-id';
import Pino, { Logger as PinoLogger } from 'pino';
import { Inject, Service } from 'typedi';
import IConfigService from '../ConfigService/ConfigService';
import ConfigServiceImpl from '../ConfigService/ConfigServiceImpl';
import ILoggerService, { Logger } from './LoggerService';

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
export default class LoggerServiceImpl implements ILoggerService {
  private readonly logger: PinoLogger;

  constructor(@Inject(() => ConfigServiceImpl) private readonly config: IConfigService) {
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
