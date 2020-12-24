import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import ITypeOrmService from '../../../infrastructure/TypeOrmService/TypeOrmService';
import TypeOrmServiceImpl from '../../../infrastructure/TypeOrmService/TypeOrmServiceImpl';
import Tag from '../Tag';
import TagModel from './TagModel.entity';
import ITagRepository from './TagRepository';

@Service()
export default class TagRepositoryImpl implements ITagRepository {
  private readonly log: Logger;

  private readonly repository: Repository<TagModel>;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => TypeOrmServiceImpl) private readonly typeOrm: ITypeOrmService,
  ) {
    this.log = this.logger.child('TagRepository');
    this.repository = typeOrm.getRepository(TagModel);
  }

  private async resolve(model: TagModel): Promise<Tag> {
    return new Tag(model);
  }
}
