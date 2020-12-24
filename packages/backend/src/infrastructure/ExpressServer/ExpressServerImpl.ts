import compression from 'compression';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import correlator from 'express-correlation-id';
import expressPinoLogger from 'express-pino-logger';
import expressRequestId from 'express-request-id';
import helmet from 'helmet';
import { createServer } from 'http';
import { Inject, Service } from 'typedi';
import IConfig from '../Config/Config';
import ConfigImpl from '../Config/ConfigImpl';
import ILogger, { Logger } from '../Logger/Logger';
import LoggerImpl from '../Logger/LoggerImpl';
import { IController } from './controllers/Controller';
import ControllerImpl from './controllers/ControllerImpl';
import IExpressServer from './ExpressServer';

@Service()
export default class ExpressServerImpl implements IExpressServer {
  private readonly log: Logger;

  constructor(
    @Inject(() => ConfigImpl) private readonly config: IConfig,
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => ControllerImpl) private readonly controller: IController,
  ) {
    this.log = this.logger.child('ExpressServer');
  }

  async start() {
    const app = express();

    // Standard middleware
    app.use(json(this.config.bodyParser));
    app.use(cors(this.config.cors));
    app.use(compression());
    app.use(expressRequestId());
    app.use(correlator());
    app.use(expressPinoLogger({ logger: this.log.pino }));
    app.use(urlencoded(this.config.urlEncoded));
    app.use(helmet());
    app.disable('x-powered-by');

    app.use(this.controller.router());

    const { port } = this.config.express;

    return createServer(app).listen(port, () => {
      this.log.info(`Listening on port ${port}`);
    });
  }
}
