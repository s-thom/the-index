import User from '../Users/User';

interface IUserAuth {
  id: number;
  user: User;
  type: string;
  secret: string;
  created: Date;
  updated?: Date;
  deleted?: Date;
}

export default class UserAuth implements Readonly<IUserAuth> {
  readonly id: number;

  readonly user: User;

  readonly type: string;

  readonly secret: string;

  readonly created: Date;

  readonly updated?: Date;

  readonly deleted?: Date;

  constructor({ id, user, type, secret, created, updated, deleted }: IUserAuth) {
    this.id = id;
    this.user = user;
    this.type = type;
    this.secret = secret;
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }
}
