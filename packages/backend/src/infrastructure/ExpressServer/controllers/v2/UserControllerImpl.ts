import { Router } from 'express';
import { Inject, Service } from 'typedi';
import * as Yup from 'yup';
import { GetV2UserIdPathParams, GetV2UserIdResponse } from '../../../../api-types';
import User from '../../../../app/Users/User';
import IUserService from '../../../../app/Users/service/UserService';
import UserServiceImpl from '../../../../app/Users/service/UserServiceImpl';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import IUserController from './UserController';
import asyncRoute from '../../middleware/asyncRoute';

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

    router.get(
      ':id',
      asyncRoute<void, GetV2UserIdResponse, GetV2UserIdPathParams>(
        {
          params: Yup.object()
            .shape({
              name: Yup.string().defined(),
            })
            .defined(),
        },
        (req) => this.getByName(req.user, req.params),
      ),
    );

    return router;
  }
}
