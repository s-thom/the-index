import correlator from 'express-correlation-id';
import pino, { Logger } from 'pino';
import { Inject, Service } from 'typedi';
import IConfig from '../Config/Config';
import ConfigImpl from '../Config/ConfigImpl';
import ILogger from './Logger';

@Service()
export default class LoggerImpl implements ILogger {
  private readonly logger: Logger;

  constructor(@Inject(() => ConfigImpl) private readonly config: IConfig) {
    this.logger = pino({
      ...config.logger,
      mixin: () => ({ correlationId: correlator.getId() }),
    });
  }

  get() {
    return this.logger;
  }

  child(name: string) {
    return this.get().child({ module: name });
  }
}
