import { ILogService } from '@/log';

import { IVesselData } from '../map.vm';
import { ITileData, IVesselsRepository } from './vessels-datasource';

export interface IVesselsMemRepositoryOptions {
  logger?: ILogService;
}

export class VesselsMemRepository implements IVesselsRepository {

  private static TAG: string = VesselsMemRepository.name;

  private logger: ILogService | null = null;

  private tileMap: Map<string, { updated_at: number; surrounding_ids: string[] }> = new Map();
  private vesselsMap: Map<string, IVesselData[]> = new Map();

  constructor(options?: IVesselsMemRepositoryOptions) {
    this.logger = options?.logger;
  }

  public getData(tileId: string): Promise<ITileData[]> {
    const result: ITileData[] = [];

    if (!this.tileMap.has(tileId)) {
      return Promise.resolve(result);
    }

    const surroundingIds: string[] = this.tileMap.get(tileId).surrounding_ids || [];
    const queryTiles: string[] = [tileId, ...surroundingIds];

    for (const qid of queryTiles) {
      const data: IVesselData[] = this.vesselsMap.get(qid);

      if (!data) {
        this.logger.debug(VesselsMemRepository.TAG, `[${tileId}] no data for surrounding ${qid}, ignoring.`);
        continue;
      }

      const { updated_at, surrounding_ids } = this.tileMap.get(qid);
      result.push({ id: qid, vessels: data, surrounding_ids, updatedAt: updated_at });
    }

    return Promise.resolve(result);
  }

  public setData(tileId: string, data: ITileData[]): Promise<void> {
    data.forEach(tile => {
      this.tileMap.set(tile.id, { updated_at: tile.updatedAt, surrounding_ids: tile.surrounding_ids });

      const hasDataForKey: boolean = this.vesselsMap.has(tile.id);
      const operation: string = hasDataForKey ? 'updating existing' : 'creating new';
      this.logger?.debug(VesselsMemRepository.TAG, `[${tileId}] ${operation} entry.`);

      this.vesselsMap.set(tile.id, tile.vessels);
    });

    return Promise.resolve();
  }
}
