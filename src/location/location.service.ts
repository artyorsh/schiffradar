import * as Location from 'expo-location';

import { ILocationService } from '.';

export interface IPermissionProvider {
  isGranted(): Promise<boolean>;
  requestLocationPermission(): Promise<boolean>;
}

interface IInitialState {
  isGranted: boolean;
  location: GeoJSON.Position | null;
}

export class LocationService implements ILocationService {

  private initialState: Partial<IInitialState> = {};

  constructor(private permissionProvider: IPermissionProvider) {
  }

  public prefetch(): Promise<GeoJSON.Position | null> {
    return this.permissionProvider.isGranted().then(granted => {
      if (!granted) {
        return null;
      }

      return this.getCurrentLocation().then(location => {
        this.initialState = { isGranted: true, location };

        return location;
      });
    });
  }

  public requestPermissions(): Promise<boolean> {
    if (this.initialState.isGranted) {
      return Promise.resolve(true);
    }

    return this.permissionProvider.requestLocationPermission();
  }

  public getCurrentLocation(): Promise<GeoJSON.Position> {
    if (this.initialState.location) {
      return Promise.resolve(this.initialState.location).finally(() => {
        this.initialState = null;
      });
    }

    return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      .then(({ coords }: Location.LocationObject) => [coords.longitude, coords.latitude]);
  }
}
