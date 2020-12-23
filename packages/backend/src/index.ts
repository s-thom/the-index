import 'reflect-metadata';
import './util/env';
import Container from 'typedi';
import IExpressServer from './infrastructure/ExpressServer/ExpressServer';
import ExpressServerImpl from './infrastructure/ExpressServer/ExpressServerImpl';

const app = Container.get<IExpressServer>(ExpressServerImpl);
app.start();

export default app;
