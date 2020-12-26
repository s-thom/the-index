import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import NotFoundError from '../../../errors/NotFoundError';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import ITypeOrmService from '../../../services/TypeOrmService/TypeOrmService';
import TypeOrmServiceImpl from '../../../services/TypeOrmService/TypeOrmServiceImpl';
import User from '../User';
import UserModel from './UserModel.entity';
import IUserRepository from './UserRepository';

@Service()
export default class UserRepositoryImpl implements IUserRepository {
  private readonly log: Logger;

  private readonly repository: Repository<UserModel>;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => TypeOrmServiceImpl) private readonly typeOrm: ITypeOrmService,
  ) {
    this.log = this.logger.child('UserRepository');
    this.repository = typeOrm.getRepository(UserModel);
  }

  private async resolve(model: UserModel): Promise<User> {
    return new User(model);
  }

  async findById(id: number) {
    this.log.trace('Finding user by id', { id });
    const model = await this.repository.findOne({ where: { id } });
    if (!model) {
      this.log.error('No user by id', { id });
      throw new NotFoundError({ message: `Could not find user by id ${id}`, safeMessage: 'User not found' });
    }

    this.log.trace('Found user by id', { id, name: model.name });
    return this.resolve(model);
  }

  async findByName(name: string) {
    this.log.trace('Finding user by id', { name });
    const model = await this.repository.findOne({ where: { name } });
    if (!model) {
      this.log.error('No user by name', { name });
      throw new NotFoundError({ message: `Could not find user by name ${name}`, safeMessage: 'User not found' });
    }

    this.log.trace('Found user by name', { name, id: model.id });
    return this.resolve(model);
  }
}
