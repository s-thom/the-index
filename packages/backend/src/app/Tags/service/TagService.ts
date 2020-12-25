import User from '../../Users/User';
import Tag from '../Tag';

export default interface ITagService {
  getUserTags(user: User, exclude?: string[]): Promise<Tag[]>;
}
