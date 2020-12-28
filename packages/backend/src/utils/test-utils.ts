import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import IConfigService from '../services/ConfigService/ConfigService';
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

export const mockConfigService: jest.Mocked<IConfigService> = {
  isDev: jest.fn(),
  express: { bodyParser: {}, cookieSession: {}, cors: {}, port: 7000, proxy: false, urlEncoded: {} },
  logger: {},
  typeOrm: {
    connection: 'test',
  },
};

export const mockTypeOrmConnectionOptions: ConnectionOptions = {
  name: 'test',
  type: 'sqlite',
  database: ':memory:',
  dropSchema: true,
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  synchronize: true,
  logging: false,
};

beforeEach(() => {
  // Mock logger service methods
  mockLoggerService.get.mockReturnValue(mockLogger);
  mockLoggerService.child.mockReturnValue(mockLogger);
});
