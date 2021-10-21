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

  public requestPermissions(): void {
    this.locationService.requestPermissions().then(granted => {
      if (!granted) {
        return;
      }

      return this.locationService.getCurrentLocation()
        .then(location => this.router.replace('/map', { location }));
    });
  }
}
