import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import User from '../../Users/User';
import ITagRepository from '../repository/TagRepository';
import TagRepositoryImpl from '../repository/TagRepositoryImpl';
import Tag from '../Tag';
import ITagService, { GetTagsOptions } from './TagService';

@Service()
export default class TagServiceImpl implements ITagService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => TagRepositoryImpl) private readonly tagRepository: ITagRepository,
  ) {
    this.log = this.logger.child('TagService');
  }

  async getUserTags(user: User, options: GetTagsOptions = {}): Promise<Tag[]> {
    this.log.trace('Getting tags for user', { name: user.name, options });
    return this.tagRepository.getUserTags(user, options);
  }
}
