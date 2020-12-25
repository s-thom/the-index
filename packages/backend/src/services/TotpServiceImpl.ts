import * as otplib from 'otplib';
import { Inject, Service } from 'typedi';
import ILogger, { Logger } from '../infrastructure/Logger/Logger';
import LoggerImpl from '../infrastructure/Logger/LoggerImpl';
import ITotpService from './TotpService';

@Service()
export default class TotpServiceImpl implements ITotpService {
  private readonly log: Logger;

  constructor(@Inject(() => LoggerImpl) private readonly logger: ILogger) {
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
