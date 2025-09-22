import { createElement, FC, useMemo } from 'react';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
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

export const LocationModule = new ContainerModule(({ bind }) => {
  bind<ILocationService>(AppModule.LOCATION)
    .toDynamicValue(context => createLocationService(context))
    .inSingletonScope();

  bind<FC>(AppModule.LOCATION_PERMISSION)
    .toFactory(context => createLocationPermissionScreen(context));
});

const createLocationService = (context: ResolutionContext): ILocationService => {
  const logService: ILogService = context.get(AppModule.LOG);
  const permissionProvider: IPermissionProvider = new LocationPermissionProvider({
    logger: logService.createLogger(LocationPermissionProvider.name),
  });

  return new LocationService(permissionProvider);
};

const createLocationPermissionScreen = (context: ResolutionContext): FC => {
  const LocationPermissionScreen: FC = () => {
    const viewModel: ILocationPermissionRequestVM = useMemo(() => createLocationPermissionViewModel(context), []);

    return createElement(LocationPermissionRequest, { vm: viewModel });
  };

  LocationPermissionScreen.displayName = 'LocationPermissionScreen';

  return LocationPermissionScreen;
};

const createLocationPermissionViewModel = (context: ResolutionContext): ILocationPermissionRequestVM => {
  const router: IRouter = context.get(AppModule.ROUTER);
  const locationService: ILocationService = context.get(AppModule.LOCATION);

  return new LocationPermissionRequestVM(
    locationService,
    router,
  );
};
