import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import ITypeOrmService from '../../../services/TypeOrmService/TypeOrmService';
import TypeOrmServiceImpl from '../../../services/TypeOrmService/TypeOrmServiceImpl';
import User from '../../Users/User';
import Tag from '../Tag';
import TagModel from './TagModel.entity';
import ITagRepository, { GetTagsOptions } from './TagRepository';

@Service()
export default class TagRepositoryImpl implements ITagRepository {
  private readonly log: Logger;

  private readonly repository: Repository<TagModel>;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => TypeOrmServiceImpl) private readonly typeOrm: ITypeOrmService,
  ) {
    this.log = this.logger.child('TagRepository');
    this.repository = typeOrm.getRepository(TagModel);
  }

  private async resolve(model: TagModel): Promise<Tag> {
    return new Tag(model);
  }

  async getUserTags(user: User, { allowList, blockList, limit }: GetTagsOptions = {}): Promise<Tag[]> {
    const finalLimit = Math.min(limit ?? (allowList ? allowList.length : 10), 50);

    let queryBuilder = this.repository
      .createQueryBuilder()
      .innerJoinAndSelect('TagModel.user', 'u')
      .leftJoin('links_tags_tags', 'ltt', 'ltt.tagsId = TagModel.id')
      .where('u.name = :name', { name: user.name });

    // Add allow/block list filtering
    if (allowList) {
      queryBuilder = queryBuilder.andWhere('TagModel.name IN (:...allowList)', { allowList });
    }
    if (blockList) {
      queryBuilder = queryBuilder.andWhere('TagModel.name NOT IN (:...blockList)', { blockList });
    }

    queryBuilder = queryBuilder
      .groupBy('TagModel.id')
      .orderBy('count(ltt.linksId) DESC, TagModel.name')
      .limit(finalLimit);

    const tags = await queryBuilder.getMany();

    return Promise.all(tags.map((tag) => this.resolve(tag)));
  }
}
