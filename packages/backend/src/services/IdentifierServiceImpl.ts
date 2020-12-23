import { ExtSnowflakeGenerator } from 'extended-snowflake';
import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../infrastructure/Logger/Logger';
import LoggerImpl from '../infrastructure/Logger/LoggerImpl';
import IIdentifierService from './IdentifierService';

@Service()
export default class IdentifierServiceImpl implements IIdentifierService {
  private readonly log: Logger;

  private readonly idGenerator = new ExtSnowflakeGenerator(0);

  constructor(@Inject(() => LoggerImpl) private readonly logger: ILogger) {
    this.log = this.logger.child('IdentifierService');
  }

  next() {
    const id = this.idGenerator.next();
    this.log.trace('Generated identifier', { id });
    return id;
  }
}
