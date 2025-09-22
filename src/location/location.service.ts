import { Accuracy, getCurrentPositionAsync } from 'expo-location';

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

  public async prefetch(): Promise<GeoJSON.Position | null> {
    const isPermissionGranted = await this.permissionProvider.isGranted();

    if (!isPermissionGranted) {
      return null;
    }

    const location: GeoJSON.Position = await this.getCurrentLocation();
    this.initialState = { isGranted: true, location };

    return location;
  }

  public requestPermissions(): Promise<boolean> {
    if (this.initialState.isGranted) {
      return Promise.resolve(true);
    }

    return this.permissionProvider.requestLocationPermission();
  }

  public async getCurrentLocation(): Promise<GeoJSON.Position> {
    const initialLocation = this.initialState?.location;

    if (initialLocation) {
      this.initialState = null;

      return Promise.resolve(initialLocation);
    }

    const { coords } = await getCurrentPositionAsync({ accuracy: Accuracy.High });

    return [coords.longitude, coords.latitude];
  }
}
