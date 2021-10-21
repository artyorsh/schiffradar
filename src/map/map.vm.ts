import Mapbox from '@rnmapbox/maps';
import { action, makeAutoObservable, observable } from 'mobx';

import { ILocationService } from '@/location';
import { ILogService } from '@/log';

import { IMapVM } from './map.component';
import { IVesselVM } from './vessels-layer.component';

export interface IMapPositionProvider {
  getMapPosition(): Promise<GeoJSON.Position>;
}

export interface IVesselData {
  mmsi: number;
  name: string;
  location: GeoJSON.Position;
  cog: number;
}

export interface IMapData {
  position: GeoJSON.Position;
  vessels: IVesselData[];
  updatedAt: number;
}

export interface IMapDataSource {
  /**
   * @returns a function to unsubscribe from the data source.
   */
  subscribe(positionProvider: IMapPositionProvider, callback: (data: IMapData) => void): Function;
}

export interface IVesselDetailsPresenter {
  presentVesselDetails(data: IVesselData): void;
}

export class MapVM implements IMapVM, IMapPositionProvider {

  private static TAG: string = MapVM.name;

  private dataSubscription: Function;

  private mapPosition: GeoJSON.Position | null = null;

  @observable private data: IMapData | null = null;

  constructor(
    mapBoxAccessToken: string,
    public initialPosition: GeoJSON.Position,
    private dataSource: IMapDataSource,
    private locationService: ILocationService,
    private vesselDetailsPresenter: IVesselDetailsPresenter,
    private logger: ILogService,
  ) {
    makeAutoObservable(this);
    Mapbox.setAccessToken(mapBoxAccessToken);
  }

  public onMount(): void {
    this.dataSubscription = this.dataSource.subscribe(this, this.onDataReceived);
  }

  public onUnmount(): void {
    this.dataSubscription?.();
  }

  public onCameraChanged([lon, lat]: GeoJSON.Position, zoom: number): void {
    this.logger.debug('MapViewVM', `Camera changed: ${JSON.stringify({ lon, lat, zoom }, null, 2)}`);
    this.mapPosition = [lon, lat, zoom];
  }

  public reportError(message: string): void {
    this.logger.error(MapVM.TAG, message);
  }

  // IVesselsLayerVM

  public getDisplayZoomLevel(): number {
    return this.initialPosition[2];
  }

  public getVessels(): IVesselVM[] {
    return (this.data?.vessels || []).map(v => ({
      id: v.mmsi,
      location: v.location,
      cog: v.cog,
    }));
  }

  public shouldRenderOverlapping(): boolean {
    return true;
  }

  public viewVesselDetails(id: number): void {
    const vessel: IVesselData | undefined = this.data?.vessels.find(v => v.mmsi.toString() === id.toString());

    if (!vessel) {
      this.logger.warn(MapVM.TAG, `Unable to present vessel details for ${id}: vessel not found.`);

      return;
    }

    this.vesselDetailsPresenter.presentVesselDetails(vessel);
  }

  // IMapPositionProvider

  public getMapPosition(): Promise<GeoJSON.Position> {
    if (!this.mapPosition) {
      return this.locationService.getCurrentLocation()
        .then(location => [...location, this.getDisplayZoomLevel()]);
    }

    return Promise.resolve(this.mapPosition);
  }

  @action private onDataReceived = (data: IMapData): void => {
    const isSameData: boolean = this.isSameData(this.data, data);

    if (isSameData) {
      return;
    }

    this.logger.debug(MapVM.TAG, 'Updating map data.');
    this.data = data;
  };

  private isSameData = (lhs: IMapData, rhs: IMapData): boolean => {
    return lhs?.position === rhs?.position
      && lhs?.updatedAt === rhs?.updatedAt;
  };
}
