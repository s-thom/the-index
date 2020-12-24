import { Router } from 'express';
import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import { IController } from '../Controller';
import IUserController from './UserController';
import UserControllerImpl from './UserControllerImpl';

@Service()
export default class V2Controller implements IController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => UserControllerImpl) private readonly userController: IUserController,
  ) {
    this.log = this.logger.child('V2Controller');
  }

  router() {
    const router = Router();

    router.use('/users', this.userController.router());

    return router;
  }
}
