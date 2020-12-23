interface IUser {
  id: number;

  name: string;

  created: Date;

  updated?: Date;

  deleted?: Date;
}

export default class User implements Readonly<IUser> {
  readonly id: number;

  readonly name: string;

  readonly created: Date;

  readonly updated?: Date;

  readonly deleted?: Date;

  constructor({ id, name, created, updated, deleted }: IUser) {
    this.id = id;
    this.name = name;
    this.created = created;
    this.updated = updated;
    this.deleted = deleted;
  }
}
