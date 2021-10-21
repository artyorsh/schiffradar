import { Linking } from 'react-native';
import * as Location from 'expo-location';

import { ILogService } from '@/log';

import { IPermissionProvider } from './location.service';

export interface ILocationPermissionProviderOptions {
  logger: ILogService;
}

export class LocationPermissionProvider implements IPermissionProvider {

  private static TAG: string = LocationPermissionProvider.name;

  private logger: ILogService;

  constructor(options?: ILocationPermissionProviderOptions) {
    this.logger = options.logger;
  }

  public isGranted = (): Promise<boolean> => {
    return this.getPermissionStatus()
      .then(response => response.status === Location.PermissionStatus.GRANTED);
  };

  public requestLocationPermission = async (): Promise<boolean> => {
    this.logger.debug(LocationPermissionProvider.TAG, 'Starting permission flow');

    const permissionResponse: Location.LocationPermissionResponse = await this.getPermissionStatus();
    const isNotGranted: boolean = permissionResponse.status !== Location.PermissionStatus.GRANTED;

    this.logger.debug(LocationPermissionProvider.TAG, `Permission response: ${permissionResponse.status}. Should request: ${isNotGranted}.`);

    if (!isNotGranted) {
      return true;
    }

    if (permissionResponse.status === Location.PermissionStatus.DENIED) {
      this.logger.info(LocationPermissionProvider.TAG, 'System request was denied, opening settings.');
      Linking.openSettings();

      return false;
    }

    const isSystemRequestGranted: boolean = await this.requestSystemPermission();
    this.logger.info(LocationPermissionProvider.TAG, `System request granted: ${isSystemRequestGranted}.`);

    return isSystemRequestGranted;
  };

  private requestSystemPermission(): Promise<boolean> {
    return Location.requestForegroundPermissionsAsync()
      .then(response => response.status === Location.PermissionStatus.GRANTED);
  }

  private getPermissionStatus(): Promise<Location.PermissionResponse> {
    return Location.getForegroundPermissionsAsync();
  }
}
