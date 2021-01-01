import { Pagination } from '../../../api-types';
import User from '../../Users/User';
import Link from '../Link';

export interface LinkSearchOptions {
  tags: string[];
  created?: {
    min?: Date;
    max?: Date;
  };
  visibility?: string;
  limit?: number;
  offset?: number;
}

export interface LinkSearchReturn {
  links: Link[];
  pagination: Pagination;
}

export default interface ILinkService {
  getLink(user: User, reference: string): Promise<Link>;
  addLink(user: User, link: Pick<Link, 'url' | 'tags'>): Promise<Link>;
  search(user: User, options: LinkSearchOptions): Promise<LinkSearchReturn>;
}
