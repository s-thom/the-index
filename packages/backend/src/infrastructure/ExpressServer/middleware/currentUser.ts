import { RequestHandler } from 'express';
import IUserService from '../../../app/Users/service/UserService';
import User from '../../../app/Users/User';
import UnauthorizedError from '../../../errors/UnauthorizedError';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}

interface CurrentUserConfig {
  userService: IUserService;
}

/**
 * Factory for a middleware to attach the currently logged in user to the request
 */
export default function currentUser({ userService }: CurrentUserConfig): RequestHandler {
  return async (req, res, next) => {
    try {
      // Get session and name of user from session
      const { session } = req;
      if (!session) {
        throw new UnauthorizedError({ message: 'No session', safeMessage: 'Invalid session' });
      }
      const { name } = session;
      if (!name) {
        throw new UnauthorizedError({ message: 'No session', safeMessage: 'Invalid session' });
      }

      try {
        const user = await userService.getByName(name);
        req.user = user;
      } catch (err) {
        throw new UnauthorizedError({ message: 'Error during user retrieval', safeMessage: 'Invalid session' });
      }

      next();
    } catch (err: unknown) {
      next(err);
    }
  };
}
