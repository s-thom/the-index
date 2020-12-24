import { Router } from 'express';
import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../../Logger/Logger';
import LoggerImpl from '../../Logger/LoggerImpl';
import apiErrors from '../middleware/apiErrors';
import { IController } from './Controller';
import V2ControllerImpl from './v2';
import OldControllerImpl from './old';

@Service()
export default class ControllerImpl implements IController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => V2ControllerImpl) private readonly v2Controller: IController,
    @Inject(() => OldControllerImpl) private readonly oldController: IController,
  ) {
    this.log = this.logger.child('Controller');
  }

  router() {
    const router = Router();

    router.use(apiErrors());

    router.use('/', this.oldController.router());
    // router.use('/v2', this.v2Controller.router());

    return router;
  }
}
