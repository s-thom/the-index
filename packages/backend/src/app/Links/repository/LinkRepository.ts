import User from '../../Users/User';
import Link from '../Link';

export interface LinkSearchOptions {
  tags: string[];
  created?: {
    min?: Date;
    max?: Date;
  };
  limit?: number;
}

export default interface ILinkRepository {
  insert(user: User, link: Omit<Link, 'id' | 'created' | 'deleted' | 'updated' | 'user'>): Promise<Link>;
  findByReference(user: User, reference: string): Promise<Link>;
  search(user: User, options: LinkSearchOptions): Promise<Link[]>;
}
