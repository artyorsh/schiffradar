import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { ILocationService } from '@/location';
import { ILogService } from '@/log';
import { IModalService } from '@/modal';

import { IVesselsRepository, VesselsDataSource } from './datasource/vessels-datasource';
import { VesselsMemRepository } from './datasource/vessels-mem-repository';
import { VesselsRemoteRepository } from './datasource/vessels-remote-repository';
import { IMapVM, Map } from './map.component';
import { IMapDataSource, IVesselDetailsPresenter, MapVM } from './map.vm';
import { VesselDetailsPresenter } from './vessel-details/vessel-details-presenter';

export type IMapRoute = '/map';

export const MapScreenModule = new ContainerModule(bind => {
  bind<interfaces.Factory<React.FC>>(AppModule.MAP_SCREEN).toFactory(context => ({ route }) => {
    const initialLocation: GeoJSON.Position = route.params.location;

    return React.createElement(Map, { vm: createMapVM(context, initialLocation) });
  });
});

const createMapVM = (context: interfaces.Context, initialPosition: GeoJSON.Position): IMapVM => {
  const displayZoomLevel: number = 12;

  initialPosition[2] = displayZoomLevel;

  const dataSource: IMapDataSource = createDataSource(context, displayZoomLevel);
  const detailsPresenter: IVesselDetailsPresenter = createDetailsPresenter(context);

  const locationService: ILocationService = context.container.get(AppModule.LOCATION);
  const logService: ILogService = context.container.get(AppModule.LOG);

  return new MapVM(
    process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
    initialPosition,
    dataSource,
    locationService,
    detailsPresenter,
    logService,
  );
};

const createDataSource = (context: interfaces.Context, zoomLevel: number): IMapDataSource => {
  const logger: ILogService = context.container.get(AppModule.LOG);

  const api: IVesselsRepository = new VesselsRemoteRepository(process.env.EXPO_PUBLIC_API_URL, { logger });
  const memCache: IVesselsRepository = new VesselsMemRepository({ logger });

  return new VesselsDataSource(api, memCache, {
    zoomLevel: zoomLevel,
    pollInterval: 1000,
    cacheTtl: 3000,
    logger: logger,
  });
};

const createDetailsPresenter = (context: interfaces.Context): IVesselDetailsPresenter => {
  const modalService: IModalService = context.container.get(AppModule.MODAL);

  return new VesselDetailsPresenter(modalService, {
    getImage: () => require('../location/permission-request/location-permission-icon.png'),
    getDetailsUrl: mmsi => `https://www.marinetraffic.com/en/ais/details/ships/mmsi:${mmsi}`,
  });
};
