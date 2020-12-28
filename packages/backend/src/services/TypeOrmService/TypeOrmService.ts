import { Connection, EntityTarget, ObjectLiteral, Repository, ConnectionOptions } from 'typeorm';

export default interface ITypeOrmService {
  start(): Promise<Connection>;
  setConfiguration(config: ConnectionOptions): void;
  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T>;
}
