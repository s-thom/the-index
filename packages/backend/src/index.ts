import pino from 'pino';
import 'reflect-metadata';
import Container from 'typedi';
import IExpressServer from './infrastructure/ExpressServer/ExpressServer';
import ExpressServerImpl from './infrastructure/ExpressServer/ExpressServerImpl';
import ITypeOrmService from './services/TypeOrmService';
import TypeOrmServiceImpl from './services/TypeOrmServiceImpl';
import './util/env';

async function startApp() {
  const typeOrmService = Container.get<ITypeOrmService>(TypeOrmServiceImpl);
  await typeOrmService.start();

  const expressApp = Container.get<IExpressServer>(ExpressServerImpl);
  await expressApp.start();
}

startApp().catch((error) => pino().error(error));
