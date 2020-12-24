import { Inject, Service } from 'typedi';
import { Repository } from 'typeorm';
import NotFoundError from '../../../errors/NotFoundError';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import ITypeOrmService from '../../../infrastructure/TypeOrmService/TypeOrmService';
import TypeOrmServiceImpl from '../../../infrastructure/TypeOrmService/TypeOrmServiceImpl';
import User from '../../Users/User';
import Link from '../Link';
import LinkModel from './LinkModel.entity';
import ILinkRepository from './LinkRepository';

@Service()
export default class LinkRepositoryImpl implements ILinkRepository {
  private readonly log: Logger;

  private readonly repository: Repository<LinkModel>;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => TypeOrmServiceImpl) private readonly typeOrm: ITypeOrmService,
  ) {
    this.log = this.logger.child('LinkRepository');
    this.repository = typeOrm.getRepository(LinkModel);
  }

  private async resolve(model: LinkModel): Promise<Link> {
    return new Link({
      ...model,
      tags: model.tags.map((tag) => tag.name),
    });
  }

  async insert(user: User, link: Omit<Link, 'id' | 'created' | 'deleted' | 'updated' | 'user'>) {
    const model = await this.repository.save({
      ...link,
      tags: link.tags.map((tag) => ({ name: tag })),
      user,
    });
    return this.resolve(model);
  }

  async findById(id: number) {
    this.log.trace('Finding user by id', { id });
    const model = await this.repository.findOne({ where: { id } });
    if (!model) {
      this.log.error('No user by id', { id });
      throw new NotFoundError({ message: `Could not find user by id ${id}`, safeMessage: 'Link not found' });
    }

    this.log.trace('Found user by id', { id, reference: model.reference });
    return this.resolve(model);
  }

  async findByReference(reference: string) {
    this.log.trace('Finding user by id', { reference });
    const model = await this.repository.findOne({ where: { reference } });
    if (!model) {
      this.log.error('No user by reference', { reference });
      throw new NotFoundError({
        message: `Could not find user by reference ${reference}`,
        safeMessage: 'Link not found',
      });
    }

    this.log.trace('Found user by reference', { reference, id: model.id });
    return this.resolve(model);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async search(user: User, tags: string[], dateRange: { min?: Date; max?: Date }) {
    // this.log.trace('Searching links', {
    //   user: user.name,
    //   tags,
    //   min: dateRange.min?.toISOString(),
    //   max: dateRange.max?.toISOString(),
    // });
    // const models = await this.repository.createQueryBuilder().innerJoin(TagModel, 'tags');
    // TODO:
    return [];
  }
}
