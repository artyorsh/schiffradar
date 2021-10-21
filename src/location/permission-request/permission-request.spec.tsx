import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { ILocationService } from '@/location';
import { IRouter } from '@/router';

import { ILocationPermissionRequestVM, LocationPermissionRequest } from './location-permission-request.component';
import { LocationPermissionRequestVM } from './location-permission-request.vm';

describe('Home', () => {

  let vm: ILocationPermissionRequestVM;
  let locationService: ILocationService;
  let router: IRouter;

  beforeEach(() => {
    locationService = {
      prefetch: jest.fn(),
      requestPermissions: jest.fn(() => Promise.resolve(true)),
      getCurrentLocation: jest.fn(() => Promise.resolve([0, 0, 0])),
    };
    router = jest.requireMock('@/router/react-navigation/react-navigation-router').RouterService();
    vm = new LocationPermissionRequestVM(locationService, router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should request location permissions', () => {
    const api = render(<LocationPermissionRequest vm={vm} />);
    fireEvent.press(api.getByTestId('@permission-request/continue'));

    expect(locationService.requestPermissions).toHaveBeenCalled();
  });

  it('should navigate to map if permission given', async () => {
    locationService.requestPermissions = jest.fn(() => Promise.resolve(true));

    const api = render(<LocationPermissionRequest vm={vm} />);
    fireEvent.press(api.getByTestId('@permission-request/continue'));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/map', { location: [0, 0, 0] });
    });
  });

  it('should remain on permission request screen if permission denied', async () => {
    locationService.requestPermissions = jest.fn(() => Promise.resolve(false));

    const api = render(<LocationPermissionRequest vm={vm} />);
    fireEvent.press(api.getByTestId('@permission-request/continue'));

    expect(router.replace).not.toHaveBeenCalled();
  });
});
