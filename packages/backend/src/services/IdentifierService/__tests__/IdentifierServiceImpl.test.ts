import IdentifierServiceImpl from '../IdentifierServiceImpl';

describe('IdentifierServiceImpl', () => {
  it('should generate an ID', () => {
    const service = new IdentifierServiceImpl();

    expect(service.next()).toMatch(/^A0[0-9A-F]+$/);
  });
});
