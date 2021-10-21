import { ILogService } from '@/log';

import { IProcessInfoService } from '.';
import { IProcessInfoProviderMap, ProcessInfoService } from './process-info.service';

describe('ProcessInfoService', () => {

  let processInfoService: IProcessInfoService;
  const providers: IProcessInfoProviderMap = {
    DeviceInfo: {
      getId: () => 'DeviceInfo',
      getCurrentData: () => Promise.resolve({ toString: () => 'DeviceInfo data' }),
      subscribe: (callback) => {
        callback({ toString: () => 'DeviceInfo upd data' });

        return () => {/* no-op */};
      },
    },
    AppInfo: {
      getId: () => 'AppInfo',
      getCurrentData: () => Promise.resolve({ toString: () => 'AppInfo data' }),
      subscribe: (callback) => {
        callback({ toString: () => 'AppInfo upd data' });

        return () => {/* no-op */};
      },
    },
  };

  let logger: ILogService;

  beforeEach(() => {
    logger = jest.requireMock('@/log/log.service').LogService();
    processInfoService = new ProcessInfoService(logger, { providers });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log current data without subscribing', () => {
    const firstCall = (logger.log as jest.Mock).mock.calls[0];
    const secondCall = (logger.log as jest.Mock).mock.calls[1];

    expect(firstCall[1])
      .toContain('DeviceInfo data');

    expect(secondCall[1])
      .toContain('AppInfo data');
  });

  it('should log updated data', () => {
    processInfoService.startListening();

    const thirdCall = (logger.log as jest.Mock).mock.calls[2];
    const fourthCall = (logger.log as jest.Mock).mock.calls[3];

    expect(thirdCall[1])
      .toContain('DeviceInfo upd data');

    expect(fourthCall[1])
      .toContain('AppInfo upd data');
  });

  it('should get current provider data', async () => {
    const deviceData = await processInfoService.getCurrentData('DeviceInfo');
    const appData = await processInfoService.getCurrentData('AppInfo');

    expect(deviceData.toString()).toEqual('DeviceInfo data');
    expect(appData.toString()).toEqual('AppInfo data');
  });
});
