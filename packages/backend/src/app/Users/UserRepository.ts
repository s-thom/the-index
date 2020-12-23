import User from './User';

export default interface IUserRepository {
  findById(id: number): Promise<User>;
  findByName(name: string): Promise<User>;
}
