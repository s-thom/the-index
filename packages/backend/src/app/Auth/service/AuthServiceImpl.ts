import { Inject, Service } from 'typedi';
import UnauthorizedError from '../../../errors/UnauthorizedError';
import ILoggerService, { Logger } from '../../../services/LoggerService/LoggerService';
import LoggerServiceImpl from '../../../services/LoggerService/LoggerServiceImpl';
import ITotpService from '../../../services/TotpService/TotpService';
import TotpServiceImpl from '../../../services/TotpService/TotpServiceImpl';
import IUserService from '../../Users/service/UserService';
import UserServiceImpl from '../../Users/service/UserServiceImpl';
import User from '../../Users/User';
import IAuthRepository from '../repository/AuthRepository';
import AuthRepositoryImpl from '../repository/AuthRepositoryImpl';
import UserAuth from '../UserAuth';
import IAuthService, { Authenticated, AuthenticationInfo, SetupRequired } from './AuthService';

const AUTH_TOTP = 'totp';

@Service()
export default class AuthServiceImpl implements IAuthService {
  private readonly log: Logger;

  constructor(
    @Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService,
    @Inject(() => UserServiceImpl) private readonly userService: IUserService,
    @Inject(() => AuthRepositoryImpl) private readonly authRepository: IAuthRepository,
    @Inject(() => TotpServiceImpl) private readonly totpService: ITotpService,
  ) {
    this.log = this.logger.child('AuthService');
  }

  private async validateUserTotp(info: AuthenticationInfo, auth: UserAuth): Promise<void> {
    this.log.trace('Validating TOTP info', { name: info.name });
    if (!info.code) {
      throw new UnauthorizedError({ message: 'No code given', safeMessage: 'Invalid login', code: 'auth.invalid' });
    }

    const result = this.totpService.validateCode(auth.secret, info.code);
    if (!result) {
      throw new UnauthorizedError({
        message: 'Invalid code given',
        safeMessage: 'Invalid login',
        code: 'auth.invalid',
      });
    }
  }

  private async createUserTotp(user: User): Promise<UserAuth> {
    this.log.trace('Creating TOTP info', { name: user.name });
    const newSecret = this.totpService.generateSecret();
    const newRecord = await this.authRepository.insertAuthMethod(user, { type: AUTH_TOTP, secret: newSecret });
    return newRecord;
  }

  async authenticate(info: AuthenticationInfo): Promise<Authenticated | SetupRequired> {
    this.log.debug('Starting authentication for user', { name: info.name });

    let user: User;
    try {
      user = await this.userService.getByName(info.name);
    } catch (err) {
      throw new UnauthorizedError({
        message: `No user with name "${info.name}"`,
        safeMessage: 'Invalid login',
        code: 'auth.invalid',
      });
    }

    const authMethods = await this.authRepository.getAuthMethodsByName(info.name);

    const totpAuth = authMethods.find((method) => method.type === AUTH_TOTP);
    if (totpAuth) {
      // Validate the TOTP authentication
      await this.validateUserTotp(info, totpAuth);
      return {
        authenticated: true,
        user,
      };
    }

    const newAuth = await this.createUserTotp(user);
    return {
      authenticated: false,
      code: newAuth.secret,
    };
  }
}
