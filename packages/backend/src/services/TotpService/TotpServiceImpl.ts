import * as otplib from 'otplib';
import { Inject, Service } from 'typedi';
import ILoggerService, { Logger } from '../LoggerService/LoggerService';
import LoggerServiceImpl from '../LoggerService/LoggerServiceImpl';
import ITotpService from './TotpService';

@Service()
export default class TotpServiceImpl implements ITotpService {
  private readonly log: Logger;

  constructor(@Inject(() => LoggerServiceImpl) private readonly logger: ILoggerService) {
    this.log = this.logger.child('TotpService');
  }

  generateSecret(): string {
    this.log.trace('Generating secret');
    return otplib.authenticator.generateSecret();
  }

  validateCode(secret: string, code: string): boolean {
    this.log.trace('Validating code');
    return otplib.authenticator.check(code, secret);
  }
}
