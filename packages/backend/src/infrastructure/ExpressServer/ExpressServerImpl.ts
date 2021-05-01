import compression from 'compression';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import correlator from 'express-correlation-id';
import expressPinoLogger from 'express-pino-logger';
import expressRequestId from 'express-request-id';
import helmet from 'helmet';
import { createServer } from 'http';
import { Inject, Service } from 'typedi';
import IConfigService from '../../services/ConfigService/ConfigService';
import ConfigServiceImpl from '../../services/ConfigService/ConfigServiceImpl';
import IIdentifierService from '../../services/IdentifierService/IdentifierService';
import IdentifierServiceImpl from '../../services/IdentifierService/IdentifierServiceImpl';
import ILoggerService, { Logger } from '../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../services/LoggerService/LoggerServiceImpl';
import IController from './controllers/Controller';
import V2Controller from './controllers/v2';
import IExpressServer from './ExpressServer';
import apiErrors from './middleware/apiErrors';

@Service()
export default class ExpressServerImpl implements IExpressServer {
  private readonly log: Logger;

  constructor(
    @Inject(() => ConfigServiceImpl) private readonly config: IConfigService,
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => IdentifierServiceImpl) private readonly idService: IIdentifierService,
    @Inject(() => V2Controller) private readonly v2Controller: IController,
  ) {
    this.log = this.logger.child('ExpressServer');
  }

  async start() {
    const app = express();

    if (this.config.express.proxy) {
      app.set('trust proxy', 1);
    }

    // Standard middleware
    app.use(json(this.config.express.bodyParser));
    app.use(cors(this.config.express.cors));
    app.use(compression());
    app.use(expressRequestId());
    app.use(correlator());
    app.use(expressPinoLogger({ logger: this.log.pino }));
    app.use(urlencoded(this.config.express.urlEncoded));
    app.use(helmet());
    app.use(cookieSession(this.config.express.cookieSession));
    app.disable('x-powered-by');

    app.use('/v2', this.v2Controller.router());

    app.use(apiErrors({ idGenerator: this.idService, logger: this.logger.child('ExpressServer.apiErrors') }));

    const { port } = this.config.express;

    return createServer(app).listen(port, () => {
      this.log.info(`Listening on port ${port} (${this.config.isDev() ? 'development' : 'production'})`);
    });
  }
}
