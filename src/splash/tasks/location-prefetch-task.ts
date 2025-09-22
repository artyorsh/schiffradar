import { ILocationService } from '@/location';
import { IRoute } from '@/router';

import { ISplashScreenTask } from '../splash.vm';

export class LocationPrefetchTask implements ISplashScreenTask {

  constructor(private locationService: ILocationService) {}

  public async run(): Promise<[IRoute, object]> {
    try {
      const location: GeoJSON.Position = await this.locationService.prefetch();

      if (!location) {
        return ['/location-permission', {}];
      }

      return ['/map', { location }];
    } catch {
      return Promise.resolve(['/location-permission', {}]);
    }
  }
}
