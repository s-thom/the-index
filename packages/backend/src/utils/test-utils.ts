import ILoggerService, { Logger } from '../services/LoggerService/LoggerService';

export const mockLogger: jest.Mocked<Logger> = {
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  pino: null as any,
};

export const mockLoggerService: jest.Mocked<ILoggerService> = {
  get: jest.fn(),
  child: jest.fn(),
};

beforeEach(() => {
  mockLoggerService.get.mockReturnValue(mockLogger);
  mockLoggerService.child.mockReturnValue(mockLogger);
});
