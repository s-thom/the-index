import { Router } from 'express';
import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import currentUser from '../../middleware/currentUser';
import { IController } from '../Controller';
import IAuthenticationController from './AuthenticationController';
import AuthenticationControllerImpl from './AuthenticationControllerImpl';
import IUserController from './UserController';
import UserControllerImpl from './UserControllerImpl';

@Service()
export default class V2Controller implements IController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => UserControllerImpl) private readonly userController: IUserController,
    @Inject(() => AuthenticationControllerImpl) private readonly authController: IAuthenticationController,
  ) {
    this.log = this.logger.child('V2Controller');
  }

  router() {
    const router = Router();

    router.use('/auth', this.authController.router());

    // Add user middleware for all further routes
    router.use(currentUser());

    router.use('/users', this.userController.router());

    return router;
  }
}
