import { ILogService } from '@/log';

import { ITileData, IVesselsRepository } from './vessels-datasource';

export interface IVesselsRemoteRepositoryOptions {
  logger?: ILogService;
}

interface INearbyTileResponse {
  id: string;
  vessels: Array<{
    mmsi: number;
    name: string;
    coordinates: {
      coordinates: GeoJSON.Position;
    };
    cog: number;
    updated_at: string;
  }>;
  surrounding_ids: string[];
}

export class VesselsRemoteRepository implements IVesselsRepository {

  constructor(private baseUrl: string, _options: IVesselsRemoteRepositoryOptions) {
  }

  public getData(tileId: string): Promise<ITileData[]> {
    return fetch(`${this.baseUrl}/vessels?tile=${tileId}`)
      .then(response => response.json())
      .then((response: INearbyTileResponse[]) => {
        return response.map((item: INearbyTileResponse) => ({
          id: item.id,
          vessels: item.vessels.map(v => ({
            mmsi: v.mmsi,
            name: v.name,
            location: [v.coordinates.coordinates[0], v.coordinates.coordinates[1]],
            cog: v.cog,
            updatedAt: this.toLocalDate(v.updated_at),
          })),
          surrounding_ids: item.surrounding_ids,
          updatedAt: Date.now(),
        }));
      });
  }

  public setData(_tileId: string, _data: ITileData[]): Promise<void> {
    return Promise.reject(new Error('Setting vessels in the remote repository is not supported.'));
  }

  private toLocalDate(utc: string): Date {
    const date = new Date(utc);

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    );
  }
}
