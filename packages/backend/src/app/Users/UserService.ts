import User from './User';

export default interface IUserService {
  getById(id: number): Promise<User>;
  getByName(name: string): Promise<User>;
}
