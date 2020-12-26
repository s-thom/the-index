import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import NotFoundError from '../../../errors/NotFoundError';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import ITypeOrmService from '../../../services/TypeOrmService';
import TypeOrmServiceImpl from '../../../services/TypeOrmServiceImpl';
import ITagService from '../../Tags/service/TagService';
import TagServiceImpl from '../../Tags/service/TagServiceImpl';
import User from '../../Users/User';
import Link from '../Link';
import LinkModel from './LinkModel.entity';
import ILinkRepository, { LinkSearchOptions } from './LinkRepository';

@Service()
export default class LinkRepositoryImpl implements ILinkRepository {
  private readonly log: Logger;

  private readonly repository: Repository<LinkModel>;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => TypeOrmServiceImpl) private readonly typeOrm: ITypeOrmService,
    @Inject(() => TagServiceImpl) private readonly tagService: ITagService,
  ) {
    this.log = this.logger.child('LinkRepository');
    this.repository = typeOrm.getRepository(LinkModel);
  }

  private async resolve(model: LinkModel): Promise<Link> {
    return new Link({
      ...model,
      tags: model.tags.map((tag) => tag.name),
      user: new User(model.user),
    });
  }

  async insert(user: User, link: Omit<Link, 'id' | 'created' | 'deleted' | 'updated' | 'user'>) {
    const existingTags = await this.tagService.getUserTags(user, { allowList: link.tags });
    const existingMap = new Map(existingTags.map((tag) => [tag.name, tag]));

    const model = await this.repository.save({
      ...link,
      tags: link.tags.map((tag) => {
        // Use existing object if it exists
        if (existingMap.has(tag)) {
          return existingMap.get(tag)!;
        }

        // Otherwise add new tag
        return { name: tag, user };
      }),
      user,
    });
    return this.resolve(model);
  }

  async findByReference(user: User, reference: string) {
    this.log.trace('Finding link by reference', { name: user.name, reference });
    const model = await this.repository.findOne({ where: { reference, user }, relations: ['tags', 'user'] });
    if (!model) {
      this.log.error('No link by reference', { reference });
      throw new NotFoundError({
        message: `Could not find link by reference ${reference}`,
        safeMessage: 'Link not found',
      });
    }

    this.log.trace('Found link by reference', { reference, id: model.id });
    return this.resolve(model);
  }

  async search(user: User, { tags, created, limit = 10 }: LinkSearchOptions): Promise<Link[]> {
    const { min, max } = created ?? {};

    // Create query builder for getting all links matching the query parameters
    let queryBuilder = this.repository
      .createQueryBuilder()
      .distinct(true)
      .innerJoin('LinkModel.user', 'u')
      .innerJoin('LinkModel.tags', 't')
      .where('u.name = :name', { name: user.name })
      .andWhere('t.name IN (:...tags)', { tags });

    if (min) {
      queryBuilder = queryBuilder.andWhere('where LinkModel.created >= datetime(:min)', { min: min.toISOString() });
    }
    if (max) {
      queryBuilder = queryBuilder.andWhere('where LinkModel.created <= datetime(:max)', { max: max.toISOString() });
    }

    queryBuilder = queryBuilder.groupBy('LinkModel.id').orderBy('count(t.id) DESC, LinkModel.id', 'DESC').limit(limit);

    const matchingLinks = await queryBuilder.getMany();
    const matchingIds = matchingLinks.map((link) => link.id);

    const links = await this.repository.findByIds(matchingIds, { relations: ['user', 'tags'] });

    // Links array from the second query is not sorted, so must be sorted manually.
    // This isn't *the most* efficient, but query set lengths should be relatively small.
    // Use of `.indexOf()` should be OK, as all link IDs were grabbed from the actual data being used.
    links.sort((a, b) => matchingIds.indexOf(a.id) - matchingIds.indexOf(b.id));

    return Promise.all(links.map((link) => this.resolve(link)));
  }
}
