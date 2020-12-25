import { Request, Router } from 'express';
import { Inject, Service } from 'typedi';
import * as Yup from 'yup';
import { DeleteV2AuthResponse, PostV2AuthRequestBody, PostV2AuthResponse } from '../../../../api-types';
import IAuthService from '../../../../app/Auth/service/AuthService';
import AuthServiceImpl from '../../../../app/Auth/service/AuthServiceImpl';
import ApiError from '../../../../errors/ApiError';
import ILogger, { Logger } from '../../../Logger/Logger';
import LoggerImpl from '../../../Logger/LoggerImpl';
import asyncRoute from '../../middleware/asyncRoute';
import IAuthenticationController from './AuthenticationController';

@Service()
export default class AuthenticationControllerImpl implements IAuthenticationController {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerImpl) private readonly logger: ILogger,
    @Inject(() => AuthServiceImpl) private readonly authService: IAuthService,
  ) {
    this.log = this.logger.child('AuthenticationController');
  }

  async logIn(req: Request, requestBody: PostV2AuthRequestBody) {
    const authResult = await this.authService.authenticate(requestBody);

    if (authResult.authenticated) {
      return {
        user: authResult.user,
      };
    }

    throw new ApiError(400, {
      code: 'auth.totp.setup',
      message: 'User has not set up TOTP',
      safeMessage: 'TOTP setup required',
      meta: { code: authResult.code },
    });
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
