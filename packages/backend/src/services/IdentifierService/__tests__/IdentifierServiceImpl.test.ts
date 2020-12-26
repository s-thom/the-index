import { mockLoggerService } from '../../../utils/test-utils';
import IdentifierServiceImpl from '../IdentifierServiceImpl';

describe('IdentifierServiceImpl', () => {
  it('should generate an ID', () => {
    const service = new IdentifierServiceImpl(mockLoggerService);

    expect(service.next()).toMatch(/^A0[0-9A-F]+$/);
  });
});
