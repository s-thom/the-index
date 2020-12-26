import * as mockedPino from 'pino';
import { mockConfigService } from '../../../utils/test-utils';
import LoggerServiceImpl from '../LoggerServiceImpl';

jest.mock('pino');

const pino = mockedPino as jest.Mocked<typeof mockedPino>;

describe('LoggerServiceImpl', () => {
  it('should get a logger', () => {
    const service = new LoggerServiceImpl(mockConfigService);
    expect(service.get()).toBeTruthy();
  });

  it.each([['trace'], ['debug'], ['info'], ['warn'], ['error'], ['fatal']] as mockedPino.Level[][])(
    'should get a logger',
    (level) => {
      const mockLogger: mockedPino.Logger = {
        trace: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        fatal: jest.fn(),
        child: jest.fn(() => mockLogger),
      } as any;
      ((pino as unknown) as jest.Mock<mockedPino.Logger>).mockReturnValue(mockLogger);

      const service = new LoggerServiceImpl({ logger: {} } as any);

      expect(pino).toHaveBeenCalledTimes(1);

      const logger = service.child(level);

      logger[level](`Testing ${level}`, { level });

      expect(mockLogger[level]).toHaveBeenCalled();
      expect(mockLogger[level]).toHaveBeenLastCalledWith({ level }, `Testing ${level}`);
    },
  );
});
