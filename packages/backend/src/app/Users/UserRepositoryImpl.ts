import { Inject, Service } from 'typedi';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Repository,
  UpdateDateColumn,
} from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import NotFoundError from '../../errors/NotFoundError';
import ILogger, { Logger } from '../../infrastructure/Logger/Logger';
import LoggerImpl from '../../infrastructure/Logger/LoggerImpl';
import User from './User';
import IUserRepository from './UserRepository';

@Entity({ name: 'users' })
export class UserModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  name!: string;

  @CreateDateColumn()
  created!: Date;

  @UpdateDateColumn()
  updated?: Date;

  @DeleteDateColumn()
  deleted?: Date;
}

@Service()
export default class UserRepositoryImpl implements IUserRepository {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @InjectRepository(UserModel) private readonly repository: Repository<UserModel>,
  ) {
    this.log = this.logger.child('UserRepository');
  }

  private async resolve(model: UserModel): Promise<User> {
    return new User(model);
  }

  async findById(id: number) {
    this.log.trace('Finding user by id', { id });
    const model = await this.repository.findOne({ where: { id } });
    if (!model) {
      this.log.error('No user by id', { id });
      throw new NotFoundError({ message: `Could not find user by id ${id}`, safeMessage: 'User not found' });
    }

    this.log.trace('Found user by id', { id, name: model.name });
    return this.resolve(model);
  }

  async findByName(name: string) {
    this.log.trace('Finding user by id', { name });
    const model = await this.repository.findOne({ where: { name } });
    if (!model) {
      this.log.error('No user by name', { name });
      throw new NotFoundError({ message: `Could not find user by name ${name}`, safeMessage: 'User not found' });
    }

    this.log.trace('Found user by name', { name, id: model.id });
    return this.resolve(model);
  }
}
