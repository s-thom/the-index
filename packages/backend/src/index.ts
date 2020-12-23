import 'reflect-metadata';
import Container from 'typedi';
import { useContainer } from 'typeorm';
import IExpressServer from './infrastructure/ExpressServer/ExpressServer';
import ExpressServerImpl from './infrastructure/ExpressServer/ExpressServerImpl';
import './util/env';

useContainer(Container);
const app = Container.get<IExpressServer>(ExpressServerImpl);
app.start();

export default app;
