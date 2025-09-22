import { Linking } from 'react-native';
import { getForegroundPermissionsAsync, LocationPermissionResponse, PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location';

import { ILogger } from '@/log';

import { IPermissionProvider } from './location.service';

export interface ILocationPermissionProviderOptions {
  logger: ILogger;
}

export class LocationPermissionProvider implements IPermissionProvider {

  private logger: ILogger;

  constructor(options?: ILocationPermissionProviderOptions) {
    this.logger = options.logger;
  }

  public isGranted = async (): Promise<boolean> => {
    const permissionStatus = await getForegroundPermissionsAsync();

    return permissionStatus.status === PermissionStatus.GRANTED;
  };

  public requestLocationPermission = async (): Promise<boolean> => {
    this.logger.debug('Starting permission flow');

    const permissionResponse: LocationPermissionResponse = await getForegroundPermissionsAsync();
    const isNotGranted: boolean = permissionResponse.status !== PermissionStatus.GRANTED;

    this.logger.debug(`Permission response: ${permissionResponse.status}. Should request: ${isNotGranted}.`);

    if (!isNotGranted) {
      return true;
    }

    if (permissionResponse.status === PermissionStatus.DENIED) {
      this.logger.info('System request was denied, opening settings.');
      Linking.openSettings();

      return false;
    }

    const isSystemRequestGranted: boolean = await this.requestSystemPermission();
    this.logger.info(`System request granted: ${isSystemRequestGranted}.`);

    return isSystemRequestGranted;
  };

  private async requestSystemPermission(): Promise<boolean> {
    const permissionStatus = await requestForegroundPermissionsAsync();

    return permissionStatus.status === PermissionStatus.GRANTED;
  }
}
