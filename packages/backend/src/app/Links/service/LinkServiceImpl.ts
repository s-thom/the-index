import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import IIdentifierService from '../../../services/IdentifierService';
import IdentifierServiceImpl from '../../../services/IdentifierServiceImpl';
import User from '../../Users/User';
import Link from '../Link';
import ILinkRepository from '../repository/LinkRepository';
import LinkRepositoryImpl from '../repository/LinkRepositoryImpl';
import ILinkService from './LinkService';

@Service()
export default class LinkServiceImpl implements ILinkService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
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
}
