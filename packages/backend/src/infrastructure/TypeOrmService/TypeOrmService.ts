import { Connection, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export default interface ITypeOrmService {
  start(): Promise<Connection>;
  getRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T>;
}
