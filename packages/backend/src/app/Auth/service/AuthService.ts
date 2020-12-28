import User from '../../Users/User';

export interface AuthenticationInfo {
  name: string;
  code?: string;
}

export interface Authenticated {
  authenticated: true;
  user: User;
}

export interface SetupRequired {
  authenticated: false;
  code: string;
}

export default interface IAuthService {
  authenticate(info: AuthenticationInfo): Promise<Authenticated | SetupRequired>;
}
