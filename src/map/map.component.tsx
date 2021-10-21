import React from 'react';
import { observer } from 'mobx-react';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import Mapbox, { MapState } from '@rnmapbox/maps';

import { IconButton } from '@/uilib/icon-button.component';

import { IVesselsLayerVM, VesselsLayer } from './vessels-layer.component';

export interface IMapVM extends IVesselsLayerVM {
  initialPosition: GeoJSON.Position;
  reportError(message: string): void;
  onMount(): void;
  onUnmount(): void;
  onCameraChanged(center: GeoJSON.Position, zoom: number): void;
}

const useMapboxStyleUrl = (): string => {
  const { rt } = useUnistyles();

  return rt.colorScheme === 'dark' ? Mapbox.StyleURL.TrafficNight : Mapbox.StyleURL.Outdoors;
};

export const Map: React.FC<{ vm: IMapVM }> = observer(({ vm }) => {

  const mapCameraRef = React.useRef<Mapbox.Camera>(null);
  const [isMapReady, setIsMapReady] = React.useState<boolean>(false);
  const styleUrl: string = useMapboxStyleUrl();

  React.useEffect(() => {
    vm.onMount();

    return () => vm.onUnmount();
  }, []);

  const onLocationButtonPress = (): void => {
    mapCameraRef.current?.setCamera({
      centerCoordinate: vm.initialPosition,
      zoomLevel: vm.getDisplayZoomLevel(),
    });
  };

  const onCameraChanged = (state: MapState): void => {
    if (!isMapReady) {
      return;
    }

    vm.onCameraChanged(state.properties.center, state.properties.zoom);
  };

  return (
    <>
      <Mapbox.MapView
        testID='map-view'
        style={styles.map}
        styleURL={styleUrl}
        attributionEnabled={false}
        scaleBarEnabled={false}
        onMapLoadingError={() => vm.reportError('Map loading error')}
        onCameraChanged={onCameraChanged}
        onDidFinishLoadingMap={() => setIsMapReady(true)}>
        <Mapbox.UserLocation />
        <Mapbox.Camera
          ref={mapCameraRef}
          defaultSettings={{ centerCoordinate: vm.initialPosition, zoomLevel: vm.getDisplayZoomLevel() }}
          followZoomLevel={vm.getDisplayZoomLevel()}
        />
        <VesselsLayer vm={vm} />
      </Mapbox.MapView>
      <IconButton
        type='primary'
        style={styles.locateButton}
        icon='Location'
        onPress={onLocationButtonPress}
      />
    </>
  );
});

const styles = StyleSheet.create((_, rt) => ({
  map: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    bottom: rt.insets.bottom + 16,
    right: 16,
  },
}));
