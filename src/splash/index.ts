import React from 'react';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { ILocationService } from '@/location';
import { IRouter } from '@/router';

import { ISplashVM, Splash } from './splash.component';
import { IExpoSplashConfig, IPrefetchTask, ISplashAnimation, SplashVM } from './splash.vm';
import { SplashAnimation } from './splash-animation';
import { PrefetchTask } from './tasks/prefetch-task';

export type ISplashRoute = '/';

export const SplashScreenModule = new ContainerModule(bind => {
  bind<interfaces.Factory<React.FC>>(AppModule.SPLASH_SCREEN)
    .toFactory(context => () => React.createElement(Splash, { vm: createSplashVM(context) }));
});

const createSplashVM = (context: interfaces.Context): ISplashVM => {
  const router: IRouter = context.container.get(AppModule.ROUTER);
  const locationService: ILocationService = context.container.get(AppModule.LOCATION);
  const prefetchTask: IPrefetchTask = new PrefetchTask(locationService);

  const expoSplashConfig: IExpoSplashConfig = {
    backgroundColor: theme => theme.colors.background,
    image: _theme => require('../../assets/images/ic-launcher-foreground.png'),
    imageWidth: 256,
  };

  const animation: ISplashAnimation = new SplashAnimation({
    duration: 400,
  });

  return new SplashVM(router, {
    ...expoSplashConfig,
    prefetchTask: prefetchTask,
    animation: animation,
  });
};
