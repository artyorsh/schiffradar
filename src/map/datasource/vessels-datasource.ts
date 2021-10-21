import { pointToTile } from '@mapbox/tilebelt';

import { ILogService } from '@/log';

import { IMapData, IMapDataSource, IMapPositionProvider, IVesselData } from '../map.vm';

export interface ITileData {
  id: string;
  vessels: IVesselData[];
  surrounding_ids: string[];
  updatedAt: number;
}

export interface IVesselsRepository {
  getData(tileId: string): Promise<ITileData[]>;
  setData(tileId: string, data: ITileData[]): Promise<void>;
}

export interface IVesselsDataSourceOptions {
  /**
   * The zoom level of the Provider, at which the DataSource is active.
   * The DataSource falls back to zoomLevel if provider_z > zoomLevel and doesn't pull the data if provider_z < zoomLevel.
   */
  zoomLevel: number;
  /**
   * How often the DataSource should poll the Repositories with the IMapPositionProvider's location.
   * Lower intervals = more accurate data as user scrolls the map, but also more frequent queries and HTTP requests (@see cacheTtl)
   *
   * @example pollInterval=1000 will:
   *  - request current location from the Provider and query the LocalRepository.
   *  - if there is no local data for the location, *or* the data is stale (@see cacheTtl), query RemoteRepository and update the LocalRepository.
   *  - trigger the callback with the found data.
   *
   * @default 1000
   */
  pollInterval?: number;
  /**
   * How long the DataSource should consider the data from LocalRepository actual.
   * @default 3000
   */
  cacheTtl?: number;
  logger?: ILogService;
}

const defaultOptions: IVesselsDataSourceOptions = {
  zoomLevel: 12,
  pollInterval: 1000,
  cacheTtl: 3000,
};

export class VesselsDataSource implements IMapDataSource {

  private static TAG: string = VesselsDataSource.name;

  private logger: ILogService | null;

  private zoomLevel: number;
  private pollInterval: number;
  private cacheTtl: number;

  constructor(
    private remoteRepository: IVesselsRepository,
    private localRepository: IVesselsRepository,
    options: IVesselsDataSourceOptions = defaultOptions,
  ) {
    this.zoomLevel = options.zoomLevel || defaultOptions.zoomLevel;
    this.pollInterval = options.pollInterval || defaultOptions.pollInterval;
    this.cacheTtl = options.cacheTtl || defaultOptions.cacheTtl;

    this.logger = options.logger;
  }

  public subscribe(positionProvider: IMapPositionProvider, callback: (data: IMapData) => void): Function {
    const locationPollInterval: NodeJS.Timeout = setInterval(() => {
      positionProvider.getMapPosition()
        .then(position => this.getVessels(position))
        .then(vessels => callback(vessels))
        .catch(e => this.logger.warn(VesselsDataSource.TAG, e));

    }, this.pollInterval);

    return () => clearInterval(locationPollInterval);
  }

  private getVessels(position: GeoJSON.Position): Promise<IMapData> {
    const providerZoomLevel: number = position[2];

    if (providerZoomLevel < this.zoomLevel) {
      return Promise.reject(new Error(`Too low zoom level: ${providerZoomLevel}`));
    }

    position[2] = this.zoomLevel;
    const tileId: string = this.getTileId(position);

    return this.localRepository.getData(tileId).then(localData => {
      const mapData: IMapData | null = this.createMapData(position, localData);
      const isActual: boolean = !!mapData && Date.now() - mapData.updatedAt <= this.cacheTtl;

      if (isActual) {
        this.logger.debug(VesselsDataSource.TAG, `[${tileId}] using local data.`);

        return mapData;
      }

      this.logger.debug(VesselsDataSource.TAG, `[${tileId}] requesting remote data.`);

      return this.remoteRepository.getData(tileId).then(remoteData => {
        this.localRepository.setData(tileId, remoteData);

        return this.createMapData(position, remoteData);
      });
    });
  }

  private getTileId([lon, lat, zoom]: GeoJSON.Position): string {
    return pointToTile(lon, lat, zoom).join('_');
  }

  private createMapData = (position: GeoJSON.Position, tiles: ITileData[]): IMapData | null => {
    if (tiles.length === 0) {
      return null;
    }

    const allVessels: IVesselData[] = tiles.map(tile => tile.vessels).flat();

    return {
      position,
      vessels: allVessels,
      updatedAt: tiles[0].updatedAt,
    };
  };
}
