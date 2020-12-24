import { Request, RequestHandler } from 'express';
import Container from 'typedi';
import IUserService from '../../../app/Users/service/UserService';
import UserServiceImpl from '../../../app/Users/service/UserServiceImpl';
import UnauthorizedError from '../../../errors/UnauthorizedError';

async function getUserFromSession(req: Request) {
  const { session } = req;
  if (!session) {
    throw new UnauthorizedError({ message: 'No session' });
  }

  const { name } = session;
  if (!name) {
    throw new UnauthorizedError({ message: 'No session' });
  }

  const userService = Container.get<IUserService>(UserServiceImpl);
  try {
    return userService.getByName(name);
  } catch (err) {
    throw new UnauthorizedError({ message: 'Error during user retrieval' });
  }
}

/**
 * Factory for a middleware to attach the currently logged in user to the request
 */
export default function currentUser(): RequestHandler {
  return (req, res, next) => {
    getUserFromSession(req).then(
      (user) => {
        req.user = user;
        next();
      },
      (err) => next(err),
    );
  };
}
