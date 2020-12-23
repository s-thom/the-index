interface ITag {
  id: number;
  name: string;
}

export default class Tag implements Readonly<ITag> {
  readonly id: number;

  readonly name: string;

  constructor({ id, name }: ITag) {
    this.id = id;
    this.name = name;
  }
}
