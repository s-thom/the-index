import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import IUserRepository from '../repository/UserRepository';
import UserRepositoryImpl from '../repository/UserRepositoryImpl';
import IUserService from './UserService';

@Service()
export default class UserServiceImpl implements IUserService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => UserRepositoryImpl) private readonly userRepository: IUserRepository,
  ) {
    this.log = this.logger.child('UserService');
  }

  getById(id: number) {
    return this.userRepository.findById(id);
  }

  getByName(name: string) {
    return this.userRepository.findByName(name);
  }
}
