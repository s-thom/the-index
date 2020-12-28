import User from '../../Users/User';
import Tag from '../Tag';

export interface GetTagsOptions {
  allowList?: string[];
  blockList?: string[];
}

export default interface ITagService {
  getUserTags(user: User, options: GetTagsOptions): Promise<Tag[]>;
}
