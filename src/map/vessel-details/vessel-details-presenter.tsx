import { ImageSourcePropType } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { IModalService, PresentationType } from '@/modal';

import { IVesselData, IVesselDetailsPresenter } from '../map.vm';
import { VesselDetails } from './vessel-details.component';

interface VesselDetailsPresenterOptions {
  getImage(mmsi: number): ImageSourcePropType;
  getDetailsUrl(mmsi: number): string;
}

export class VesselDetailsPresenter implements IVesselDetailsPresenter {

  constructor(private modalService: IModalService, private options: VesselDetailsPresenterOptions) {

  }

  public presentVesselDetails(data: IVesselData): void {
    this.modalService.show(controller => (
      <VesselDetails
        title={data.name}
        image={this.options.getImage(data.mmsi)}
        viewDetails={() => {
          this.openBrowser(data.mmsi);
          controller.resolve();
        }}
        dismiss={() => controller.resolve()}
      />
    ), PresentationType.BOTTOM_SHEET);
  }

  private openBrowser(mmsi: number): void {
    const detailsUrl: string = this.options.getDetailsUrl(mmsi);
    WebBrowser.openBrowserAsync(detailsUrl);
  }
}
