import { Router } from 'express';
import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../../services/LoggerService/LoggerServiceImpl';
import currentUser from '../../middleware/currentUser';
import IController from '../Controller';
import AuthenticationControllerImpl from './AuthenticationControllerImpl';
import LinkControllerImpl from './LinkControllerImpl';
import TagControllerImpl from './TagControllerImpl';
import UserControllerImpl from './UserControllerImpl';

@Service()
export default class V2Controller implements IController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => UserControllerImpl) private readonly userController: IController,
    @Inject(() => AuthenticationControllerImpl) private readonly authController: IController,
    @Inject(() => TagControllerImpl) private readonly tagController: IController,
    @Inject(() => LinkControllerImpl) private readonly linkController: IController,
  ) {
    this.log = this.logger.child('V2Controller');
  }

  router() {
    const router = Router();

    router.use('/auth', this.authController.router());

    // Add user middleware for all further routes
    router.use(currentUser());

    router.use('/users', this.userController.router());
    router.use('/tags', this.tagController.router());
    router.use('/links', this.linkController.router());

    return router;
  }
}
