import React from 'react';
import { observer } from 'mobx-react';
import { Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { Feature } from 'geojson';

export interface IVesselVM {
  id: number;
  location: GeoJSON.Position;
  cog: number;
}

export interface IVesselsLayerVM {
  getDisplayZoomLevel(): number;
  getVessels(): IVesselVM[];
  shouldRenderOverlapping(): boolean;
  viewVesselDetails(id: number): void;
}

export const VesselsLayer: React.FC<{ vm: IVesselsLayerVM }> = observer(({ vm }) => {

  const shouldRenderOverlapping: boolean = vm.shouldRenderOverlapping();

  const onFeaturePress = (event: OnPressEvent): void => {
    const vesselId = event.features[0]?.id;

    if (vesselId) {
      vm.viewVesselDetails(vesselId as number);
    }
  };

  const createVessel = (vessel: IVesselVM, _index: number): Feature => ({
    type: 'Feature',
    id: vessel.id,
    geometry: {
      type: 'Point',
      coordinates: vessel.location,
    },
    properties: {
      cog: vessel.cog,
    },
  });

  return (
    <>
      <Images images={{ ship: require('./vessel-icon.png') }} />
      <ShapeSource
        id='vessels'
        shape={{
          type: 'FeatureCollection',
          features: vm.getVessels().map(createVessel),
        }}
        onPress={e => onFeaturePress(e)}>
        <SymbolLayer
          id='vessel-icon'
          minZoomLevel={vm.getDisplayZoomLevel()}
          style={{
            iconImage: 'ship',
            iconSize: 0.5,
            iconRotate: ['get', 'cog'],
            iconAllowOverlap: shouldRenderOverlapping,
            iconIgnorePlacement: shouldRenderOverlapping,
          }}
        />
      </ShapeSource>
    </>
  );
});
