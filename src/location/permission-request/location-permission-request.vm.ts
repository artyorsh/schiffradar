import { ILocationService } from '@/location';
import { IRouter } from '@/router';

import { ILocationPermissionRequestVM } from './location-permission-request.component';

export class LocationPermissionRequestVM implements ILocationPermissionRequestVM {

  constructor(
    private locationService: ILocationService,
    private router: IRouter,
  ) {

  }

  public onMount = (): void => {
    /* no-op */
  };

  public onUnmount = (): void => {
    /* no-op */
  };

  public async requestPermissions(): Promise<void> {
    const isGranted = await this.locationService.requestPermissions();

    if (!isGranted) {
      return;
    }

    const currentLocation = await this.locationService.getCurrentLocation();

    this.router.replace('/map', { location: currentLocation });
  }
}
