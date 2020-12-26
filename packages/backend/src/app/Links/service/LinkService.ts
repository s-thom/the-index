import User from '../../Users/User';
import Link from '../Link';

export default interface ILinkService {
  getLink(user: User, reference: string): Promise<Link>;
  addLink(user: User, link: Pick<Link, 'url' | 'tags'>): Promise<Link>;
}
