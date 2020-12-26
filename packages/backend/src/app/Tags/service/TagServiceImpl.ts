import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../../../infrastructure/Logger/Logger';
import LoggerImpl from '../../../infrastructure/Logger/LoggerImpl';
import User from '../../Users/User';
import ITagRepository from '../repository/TagRepository';
import TagRepositoryImpl from '../repository/TagRepositoryImpl';
import Tag from '../Tag';
import ITagService, { GetTagsOptions } from './TagService';

@Service()
export default class TagServiceImpl implements ITagService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => TagRepositoryImpl) private readonly tagRepository: ITagRepository,
  ) {
    this.log = this.logger.child('TagService');
  }

  async getUserTags(user: User, options: GetTagsOptions = {}): Promise<Tag[]> {
    this.log.trace('Getting tags for user', { name: user.name, options });
    return this.tagRepository.getUserTags(user, options);
  }
}
