import 'reflect-metadata';
import Container from 'typedi';
import IExpressServer from './infrastructure/ExpressServer/ExpressServer';
import ExpressServerImpl from './infrastructure/ExpressServer/ExpressServerImpl';
import ILoggerService from './services/LoggerService/LoggerService';
import LoggerServiceImpl from './services/LoggerService/LoggerServiceImpl';
import ITypeOrmService from './services/TypeOrmService/TypeOrmService';
import TypeOrmServiceImpl from './services/TypeOrmService/TypeOrmServiceImpl';

const loggerService = Container.get<ILoggerService>(LoggerServiceImpl);
const logger = loggerService.child('app');

async function startApp() {
  const typeOrmService = Container.get<ITypeOrmService>(TypeOrmServiceImpl);
  await typeOrmService.start();

  const expressApp = Container.get<IExpressServer>(ExpressServerImpl);
  await expressApp.start();
}

startApp().catch((error) => logger.error('Error on start', { error, message: error?.message, stack: error?.stack }));
