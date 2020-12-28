import { mockLoggerService } from '../../../utils/test-utils';
import TotpServiceImpl from '../TotpServiceImpl';

describe('TotpServiceImpl', () => {
  it('should generate a secret', () => {
    const service = new TotpServiceImpl(mockLoggerService);
    expect(service.generateSecret()).toEqual(expect.any(String));
  });

  it('should validate a secret', () => {
    const service = new TotpServiceImpl(mockLoggerService);
    expect(service.validateCode('example', '000000')).toEqual(expect.any(Boolean));
  });
});
