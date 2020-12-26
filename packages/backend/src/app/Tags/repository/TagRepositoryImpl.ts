import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import ITypeOrmService from '../../../services/TypeOrmService';
import TypeOrmServiceImpl from '../../../services/TypeOrmServiceImpl';
import User from '../../Users/User';
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

  async getUserTags(user: User, exclude = [] as string[], limit = 10): Promise<Tag[]> {
    const tags = await this.repository
      .createQueryBuilder()
      .innerJoinAndSelect('TagModel.user', 'u')
      .innerJoin('links_tags_tags', 'ltt', 'ltt.tagsId = TagModel.id')
      .where('u.name = :name', { name: user.name })
      .andWhere('TagModel.name NOT IN (:exclude)', { exclude })
      .groupBy('TagModel.id')
      .orderBy('count(ltt.linksId) DESC, TagModel.name')
      .limit(limit)
      .getMany();

    return Promise.all(tags.map((tag) => this.resolve(tag)));
  }
}
