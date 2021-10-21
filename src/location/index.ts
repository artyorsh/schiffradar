import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { ILogService } from '@/log';
import { IRouter } from '@/router';

import { IPermissionProvider, LocationService } from './location.service';
import { LocationPermissionProvider } from './location-permission-provider';
import { ILocationPermissionRequestVM, LocationPermissionRequest } from './permission-request/location-permission-request.component';
import { LocationPermissionRequestVM } from './permission-request/location-permission-request.vm';

export interface ILocationService {
  /**
   * Should prefetch permission state and location data if possible.
   */
  prefetch(): Promise<GeoJSON.Position | null>;
  requestPermissions(): Promise<boolean>;
  getCurrentLocation(): Promise<GeoJSON.Position>;
}

export type ILocationPermissionRoute = '/location-permission';

export const LocationModule = new ContainerModule(bind => {
  bind<ILocationService>(AppModule.LOCATION).toDynamicValue(context => {
    const logger: ILogService = context.container.get(AppModule.LOG);

    const permissionProvider: IPermissionProvider = new LocationPermissionProvider({ logger });

    return new LocationService(permissionProvider);
  });

  bind<interfaces.Factory<React.FC>>(AppModule.LOCATION_PERMISSION)
    .toFactory(context => () => React.createElement(LocationPermissionRequest, { vm: createLocationPermissionVM(context) }));
});

const createLocationPermissionVM = (context: interfaces.Context): ILocationPermissionRequestVM => {
  const router: IRouter = context.container.get(AppModule.ROUTER);
  const locationService: ILocationService = context.container.get(AppModule.LOCATION);

  return new LocationPermissionRequestVM(
    locationService,
    router,
  );
};
