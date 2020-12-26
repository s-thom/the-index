import 'reflect-metadata';
import Container from 'typedi';
import IExpressServer from './infrastructure/ExpressServer/ExpressServer';
import ExpressServerImpl from './infrastructure/ExpressServer/ExpressServerImpl';
import ILogger from './infrastructure/Logger/Logger';
import LoggerImpl from './infrastructure/Logger/LoggerImpl';
import ITypeOrmService from './services/TypeOrmService';
import TypeOrmServiceImpl from './services/TypeOrmServiceImpl';

const loggerService = Container.get<ILogger>(LoggerImpl);
const logger = loggerService.child('app');

async function startApp() {
  const typeOrmService = Container.get<ITypeOrmService>(TypeOrmServiceImpl);
  await typeOrmService.start();

  const expressApp = Container.get<IExpressServer>(ExpressServerImpl);
  await expressApp.start();
}

startApp().catch((error) => logger.error(error));
