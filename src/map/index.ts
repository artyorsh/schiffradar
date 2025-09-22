import { createElement, FC, useMemo } from 'react';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { IHttpClient } from '@/http';
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

export const MapScreenModule = new ContainerModule(({ bind }) => {
  bind<FC>(AppModule.MAP_SCREEN)
    .toFactory(context => createMapScreen(context));
});

export const createMapScreen = (context: ResolutionContext): FC => {
  return ({ route }: any) => {
    const location: GeoJSON.Position = route.params.location;
    // const location: GeoJSON.Position = [4.5297216, 52.4637027, 10];
    const viewModel: IMapVM = useMemo(() => createMapViewModel(context, location), [location]);

    return createElement(Map, { vm: viewModel });
  };
};

const createMapViewModel = (context: ResolutionContext, initialPosition: GeoJSON.Position): IMapVM => {
  const displayZoomLevel: number = 12;

  initialPosition[2] = displayZoomLevel;

  const dataSource: IMapDataSource = createDataSource(context, displayZoomLevel);
  const detailsPresenter: IVesselDetailsPresenter = createDetailsPresenter(context);

  const locationService: ILocationService = context.get(AppModule.LOCATION);
  const logService: ILogService = context.get(AppModule.LOG);

  return new MapVM(
    process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
    initialPosition,
    dataSource,
    locationService,
    detailsPresenter,
    logService.createLogger(MapVM.name),
  );
};

const createDataSource = (context: ResolutionContext, zoomLevel: number): IMapDataSource => {
  const httpClient: IHttpClient = context.get(AppModule.HTTP);
  const logService: ILogService = context.get(AppModule.LOG);

  const api: IVesselsRepository = new VesselsRemoteRepository(httpClient, {
    logger: logService.createLogger(VesselsRemoteRepository.name),
  });

  const memCache: IVesselsRepository = new VesselsMemRepository({
    logger: logService.createLogger(VesselsMemRepository.name),
  });

  return new VesselsDataSource(api, memCache, {
    zoomLevel: zoomLevel,
    pollInterval: 1000,
    cacheTtl: 3000,
    logger: logService.createLogger(VesselsDataSource.name),
  });
};

const createDetailsPresenter = (context: ResolutionContext): IVesselDetailsPresenter => {
  const modalService: IModalService = context.get(AppModule.MODAL);

  return new VesselDetailsPresenter(modalService, {
    getImage: () => require('../location/permission-request/location-permission-icon.png'),
    getDetailsUrl: mmsi => `https://www.marinetraffic.com/en/ais/details/ships/mmsi:${mmsi}`,
  });
};
