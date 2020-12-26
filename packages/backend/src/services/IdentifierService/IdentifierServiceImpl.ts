import { ExtSnowflakeGenerator } from 'extended-snowflake';
import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../LoggerService/LoggerService';
import LoggerServiceImpl from '../LoggerService/LoggerServiceImpl';
import IIdentifierService from './IdentifierService';

@Service()
export default class IdentifierServiceImpl implements IIdentifierService {
  private readonly log: Logger;

  private readonly idGenerator = new ExtSnowflakeGenerator(0);

  constructor(@Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService) {
    this.log = this.logger.child('IdentifierService');
  }

  next() {
    const id = this.idGenerator.next();
    this.log.trace('Generated identifier', { id });
    return id;
  }
}
