import 'core-js/proposals/reflect-metadata';
import registerRootComponent from 'expo/src/launch/registerRootComponent';
import { Container } from 'inversify';

import '@/uilib';
import { I18nModule } from '@/i18n';
import { HttpModule } from '@/http';
import { LocationModule } from '@/location';
import { MapScreenModule } from '@/map';
import { LogModule } from '@/log';
import { ModalModule } from '@/modal';
import { ProcessInfoModule } from '@/process-info';
import { RouterModule } from '@/router';
import { SplashScreenModule } from '@/splash';

import { App } from './src/app';

export const container = new Container();

container.load(
  I18nModule,
  HttpModule,
  LogModule,
  RouterModule,
  ProcessInfoModule,
  ModalModule,
  SplashScreenModule,
  LocationModule,
  MapScreenModule,
);

registerRootComponent(() => {
  return <App get={serviceId => container.get(serviceId)} />;
});
