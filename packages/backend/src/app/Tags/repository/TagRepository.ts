import User from '../../Users/User';
import Tag from '../Tag';

export default interface ITagRepository {
  getUserTags(user: User, exclude?: string[]): Promise<Tag[]>;
}
