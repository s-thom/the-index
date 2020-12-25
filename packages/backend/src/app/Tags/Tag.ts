import User from '../Users/User';

interface ITag {
  id: number;
  name: string;
  user: User;
}

export default class Tag implements Readonly<ITag> {
  readonly id: number;

  readonly name: string;

  readonly user: User;

  constructor({ id, name, user }: ITag) {
    this.id = id;
    this.name = name;
    this.user = user;
  }
}
