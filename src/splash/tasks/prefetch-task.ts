import { ILocationService } from '@/location';
import { IRoute } from '@/router';

import { IPrefetchTask } from '../splash.vm';

export class PrefetchTask implements IPrefetchTask {

  constructor(private locationService: ILocationService) {}

  public prefetch = async (): Promise<[IRoute, object]> => {
    try {
      const location: GeoJSON.Position = await this.locationService.prefetch();

      if (!location) {
        return ['/location-permission', {}];
      }

      return ['/map', { location }];
    } catch (error) {
      return Promise.resolve(['/location-permission', {}]);
    }
  };
}
