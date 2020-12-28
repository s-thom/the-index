import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import IIdentifierService from '../../../services/IdentifierService/IdentifierService';
import IdentifierServiceImpl from '../../../services/IdentifierService/IdentifierServiceImpl';
import User from '../../Users/User';
import Link from '../Link';
import ILinkRepository from '../repository/LinkRepository';
import LinkRepositoryImpl from '../repository/LinkRepositoryImpl';
import ILinkService, { LinkSearchOptions, LinkSearchReturn } from './LinkService';

@Service()
export default class LinkServiceImpl implements ILinkService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => LinkRepositoryImpl) private readonly linkRepository: ILinkRepository,
    @Inject(() => IdentifierServiceImpl) private readonly idService: IIdentifierService,
  ) {
    this.log = this.logger.child('LinkService');
  }

  async getLink(user: User, reference: string): Promise<Link> {
    return this.linkRepository.findByReference(user, reference);
  }

  async addLink(user: User, link: Pick<Link, 'url' | 'tags'>): Promise<Link> {
    const reference = this.idService.next();
    const newLink = this.linkRepository.insert(user, { ...link, reference });
    return newLink;
  }

  async search(user: User, options: LinkSearchOptions): Promise<LinkSearchReturn> {
    const {
      links,
      pagination: { limit, offset, total },
    } = await this.linkRepository.search(user, options);
    return {
      links,
      pagination: {
        limit,
        offset,
        total,
        page: Math.max(Math.ceil(offset / limit) + 1, Math.ceil(total / limit)),
      },
    };
  }
}
