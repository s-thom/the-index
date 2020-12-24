import User from '../app/Users/User';

declare global {
  declare namespace Express {
    interface Request {
      user: User;
    }
  }
}
