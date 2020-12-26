import { Router } from 'express';
import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import IController from './Controller';
import V2ControllerImpl from './v2';

@Service()
export default class ControllerImpl implements IController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => V2ControllerImpl) private readonly v2Controller: IController,
  ) {
    this.log = this.logger.child('Controller');
  }

  router() {
    const router = Router();

    router.use('/v2', this.v2Controller.router());

    return router;
  }
}
