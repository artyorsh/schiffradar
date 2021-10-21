import { Container } from 'inversify';

import { LocationModule } from '@/location';
import { LogModule } from '@/log';
import { MapScreenModule } from '@/map';
import { ModalModule } from '@/modal';
import { ProcessInfoModule } from '@/process-info';
import { RouterModule } from '@/router';
import { SplashScreenModule } from '@/splash';

export const container = new Container();

container.load(
  LogModule,
  RouterModule,
  SplashScreenModule,
  ProcessInfoModule,
  LocationModule,
  ModalModule,
  MapScreenModule,
);
