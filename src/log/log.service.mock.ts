import { ILogService } from '.';

jest.mock('./log.service', () => {
  const logService: ILogService = {
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    flush: jest.fn(),
    addLabel: jest.fn(),
    removeLabel: jest.fn(),
  };

  return {
    LogService: jest.fn().mockImplementation(() => logService),
  };
});

