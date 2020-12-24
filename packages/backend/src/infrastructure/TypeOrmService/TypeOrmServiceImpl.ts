import { Inject, Service } from 'typedi';
import { Connection, EntityTarget, getConnectionManager, ObjectLiteral } from 'typeorm';
import IConfig from '../Config/Config';
import ConfigImpl from '../Config/ConfigImpl';
import ILogger, { Logger } from '../Logger/Logger';
import LoggerImpl from '../Logger/LoggerImpl';
import ITypeOrmService from './TypeOrmService';

@Service()
export default class TypeOrmServiceImpl implements ITypeOrmService {
  private readonly log: Logger;

  private connection: Connection | undefined;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => ConfigImpl) private readonly config: IConfig,
  ) {
    this.log = this.logger.child('TypeOrmService');
  }

  async start() {
    const connectionManager = getConnectionManager();
    this.connection = connectionManager.create(this.config.typeOrm);

    return this.connection;
  }

  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>) {
    if (!this.connection) {
      const message = 'Tried to get repository but the TypeOrmService did not start';
      this.log.error(message);
      throw new Error(message);
    }

    this.log.info('Getting entity', { entity: entity.toString(), opts: this.connection.options });

    return this.connection.getRepository(entity);
  }
}
