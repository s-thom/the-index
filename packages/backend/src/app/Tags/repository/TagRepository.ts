import User from '../../Users/User';
import Tag from '../Tag';

export interface GetTagsOptions {
  allowList?: string[];
  blockList?: string[];
  limit?: number;
}

export default interface ITagRepository {
  getUserTags(user: User, options?: GetTagsOptions): Promise<Tag[]>;
}
