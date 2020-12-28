import { Inject, Service } from 'typedi';
import {
  Connection,
  ConnectionOptions,
  EntityTarget,
  getConnectionManager,
  getConnectionOptions,
  ObjectLiteral,
} from 'typeorm';
import IConfigService from '../ConfigService/ConfigService';
import ConfigServiceImpl from '../ConfigService/ConfigServiceImpl';
import ILoggerService, { Logger } from '../LoggerService/LoggerService';
import LoggerServiceImpl from '../LoggerService/LoggerServiceImpl';
import ITypeOrmService from './TypeOrmService';

@Service()
export default class TypeOrmServiceImpl implements ITypeOrmService {
  private readonly log: Logger;

  private connectionOptions: ConnectionOptions | undefined;

  private connection: Connection | undefined;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => ConfigServiceImpl) private readonly config: IConfigService,
  ) {
    this.log = this.logger.child('TypeOrmService');
  }

  setConfiguration(config: ConnectionOptions) {
    if (this.connection) {
      const message = 'Tried to set the database configuration but the TypeOrmService has already been started';
      this.log.error(message);
      throw new Error(message);
    }

    this.connectionOptions = config;
  }

  async start() {
    this.log.debug('Creating connection');

    if (!this.connectionOptions) {
      this.connectionOptions = await getConnectionOptions(this.config.typeOrm.connection);
    }

    this.log.trace('Applying database configuration', {
      options: {
        ...this.connectionOptions,
        password: undefined,
      },
    });

    const connectionManager = getConnectionManager();
    this.connection = connectionManager.create(this.connectionOptions);

    await this.connection.connect();

    this.log.debug(`Connected (${this.config.typeOrm.connection})`);
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
