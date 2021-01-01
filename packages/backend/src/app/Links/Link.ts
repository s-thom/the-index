import User from '../Users/User';

interface ILink {
  id: number;
  reference: string;
  url: string;
  tags: string[];
  user: User;
  visibility: string;
  created: Date;
  updated?: Date;
  deleted?: Date;
}

export default class Link implements Readonly<ILink> {
  readonly id: number;

  readonly reference: string;

  readonly url: string;

  readonly tags: string[];

  readonly user: User;

  readonly visibility: string;

  readonly created: Date;

  readonly updated?: Date;

  readonly deleted?: Date;

  constructor({ id, reference, url, tags, user, visibility, created, updated, deleted }: ILink) {
    this.id = id;
    this.reference = reference;
    this.url = url;
    this.tags = tags;
    this.user = user;
    this.visibility = visibility;
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }
}
