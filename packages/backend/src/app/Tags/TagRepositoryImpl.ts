import { Inject, Service } from 'typedi';
import { Column, Entity, Index, PrimaryGeneratedColumn, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import ILogger, { Logger } from '../../infrastructure/Logger/Logger';
import LoggerImpl from '../../infrastructure/Logger/LoggerImpl';
import Tag from './Tag';
import ITagRepository from './TagRepository';

@Entity({ name: 'tags' })
export class TagModel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  @Index({ unique: true })
  name!: string;
}

@Service()
export default class TagRepositoryImpl implements ITagRepository {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @InjectRepository(TagModel) private readonly repository: Repository<TagModel>,
  ) {
    this.log = this.logger.child('TagRepository');
  }

  private async resolve(model: TagModel): Promise<Tag> {
    return new Tag(model);
  }
}
