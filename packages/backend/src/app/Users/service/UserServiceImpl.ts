import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import IUserRepository from '../repository/UserRepository';
import UserRepositoryImpl from '../repository/UserRepositoryImpl';
import IUserService from './UserService';

@Service()
export default class UserServiceImpl implements IUserService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
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
