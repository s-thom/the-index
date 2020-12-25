import { Request, Router } from 'express';
import { Inject, Service } from 'typedi';
import * as Yup from 'yup';
import { DeleteV2AuthResponse, PostV2AuthRequestBody, PostV2AuthResponse } from '../../../../api-types';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import asyncRoute from '../../middleware/asyncRoute';
import IAuthenticationController from './AuthenticationController';

@Service()
export default class AuthenticationControllerImpl implements IAuthenticationController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger, // @Inject(() => ) private readonly userService: IUserService,
  ) {
    this.log = this.logger.child('AuthenticationController');
  }

  async logOut(req: Request) {
    req.session = undefined;
    this.log.info('Logged user out', { name: req.user?.name ?? '<<???>>' });
    return {};
  }

  router() {
    const router = Router();

    router.post(
      '/',
      asyncRoute<PostV2AuthRequestBody, PostV2AuthResponse>(
        {
          body: Yup.object()
            .shape({
              name: Yup.string().defined(),
              code: Yup.string(),
            })
            .defined(),
        },
        (req) => this.logIn(req, req.body),
      ),
    );
    router.delete(
      '/',
      asyncRoute<unknown, DeleteV2AuthResponse>({}, (req) => this.logOut(req)),
    );

    return router;
  }
}
