import { Inject, Service } from 'typedi';
import { Connection, EntityTarget, getConnectionManager, ObjectLiteral } from 'typeorm';
import IConfigService from '../ConfigService/ConfigService';
import ConfigServiceImpl from '../ConfigService/ConfigServiceImpl';
import ILoggerService, { Logger } from '../LoggerService/LoggerService';
import LoggerServiceImpl from '../LoggerService/LoggerServiceImpl';
import ITypeOrmService from './TypeOrmService';

@Service()
export default class TypeOrmServiceImpl implements ITypeOrmService {
  private readonly log: Logger;

  private connection: Connection | undefined;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => ConfigServiceImpl) private readonly config: IConfigService,
  ) {
    this.log = this.logger.child('TypeOrmService');
  }

  async start() {
    this.log.debug('Creating connection');
    const connectionManager = getConnectionManager();
    this.connection = connectionManager.create(this.config.typeOrm);

    await this.connection.connect();

    return this.connection;
  }

  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    if (!this.connection) {
      const message = 'Tried to get repository but the TypeOrmService has not been started';
      this.log.error(message);
      throw new Error(message);
    }

    return this.connection.getRepository(entity);
  }
}
