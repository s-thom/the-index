import User from '../../Users/User';
import UserAuth from '../UserAuth';

export default interface IAuthRepository {
  getAuthMethodsByName(name: string): Promise<UserAuth[]>;
  insertAuthMethod(user: User, auth: Pick<UserAuth, 'type' | 'secret'>): Promise<UserAuth>;
}
