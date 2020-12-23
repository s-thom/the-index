import User from '../Users/User';
import Link from './Link';

export default interface ILinkRepository {
  insert(user: User, link: Omit<Link, 'id' | 'created' | 'deleted' | 'updated' | 'user'>): Promise<Link>;
  findById(id: number): Promise<Link>;
  findByReference(reference: string): Promise<Link>;
  search(user: User, tags: string[], dateRange: { min?: Date; max?: Date }): Promise<Link[]>;
}
