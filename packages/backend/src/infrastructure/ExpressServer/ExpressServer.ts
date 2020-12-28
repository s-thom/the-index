import { Server } from 'http';

export default interface IExpressServer {
  start(): Promise<Server>;
}
