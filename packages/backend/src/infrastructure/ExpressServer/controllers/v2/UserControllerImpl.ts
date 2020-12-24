import { Router } from 'express';
import { Inject, Service } from 'typedi';
import { GetV2UserIdPathParams } from '../../../../api-types';
import User from '../../../../app/Users/User';
import IUserService from '../../../../app/Users/service/UserService';
import UserServiceImpl from '../../../../app/Users/service/UserServiceImpl';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import IUserController from './UserController';

@Service()
export default class UserControllerImpl implements IUserController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => UserServiceImpl) private readonly userService: IUserService,
  ) {
    this.log = this.logger.child('UserController');
  }

  async getByName(currentUser: User, pathParams: GetV2UserIdPathParams) {
    const user = await this.userService.getByName(pathParams.name);
    return { user };
  }

  router() {
    const router = Router();

    return router;
  }
}
