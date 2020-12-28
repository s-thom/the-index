import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import ITypeOrmService from '../../../services/TypeOrmService/TypeOrmService';
import TypeOrmServiceImpl from '../../../services/TypeOrmService/TypeOrmServiceImpl';
import UserModel from '../../Users/repository/UserModel.entity';
import User from '../../Users/User';
import UserAuth from '../UserAuth';
import IAuthRepository from './AuthRepository';
import UserAuthModel from './UserAuthModel.entity';

@Service()
export default class AuthRepositoryImpl implements IAuthRepository {
  private readonly log: Logger;

  private readonly repository: Repository<UserAuthModel>;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => TypeOrmServiceImpl) private readonly typeOrm: ITypeOrmService,
  ) {
    this.log = this.logger.child('AuthRepository');
    this.repository = typeOrm.getRepository(UserAuthModel);
  }

  private async resolve(model: UserAuthModel): Promise<UserAuth> {
    return new UserAuth(model);
  }

  async getAuthMethodsByName(name: string) {
    const authMethods = await this.repository
      .createQueryBuilder()
      .leftJoin(UserModel, 'u')
      .where('u.name = :name', { name })
      .getMany();

    return Promise.all(authMethods.map((auth) => this.resolve(auth)));
  }

  async insertAuthMethod(user: User, auth: Pick<UserAuth, 'type' | 'secret'>) {
    const newModel = await this.repository.save({
      type: auth.type,
      secret: auth.secret,
      user,
    });

    return this.resolve(newModel);
  }
}
