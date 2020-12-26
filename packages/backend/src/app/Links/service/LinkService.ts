import User from '../../Users/User';
import Link from '../Link';

export default interface ILinkService {
  addLink(user: User, link: Pick<Link, 'url' | 'tags'>): Promise<Link>;
}
