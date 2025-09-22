import { createElement, FC, useMemo } from 'react';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILocationService } from '@/location';
import { IRouter } from '@/router';

import { ISplashVM, Splash } from './splash.component';
import { IExpoSplashConfig, ISplashAnimation, ISplashScreenTask, SplashVM } from './splash.vm';
import { SplashAnimation } from './splash-animation';
import { LocationPrefetchTask } from './tasks/location-prefetch-task';

export type ISplashRoute = '/';

export const SplashScreenModule = new ContainerModule(({ bind }) => {
  bind<React.FC>(AppModule.SPLASH_SCREEN)
    .toFactory(context => createSplashScreen(context));
});

const createSplashScreen = (context: ResolutionContext): React.FC => {
  const SplashScreenContainer: FC = () => {
    const viewModel: ISplashVM = useMemo(() => createSplashViewModel(context), []);

    return createElement(Splash, { vm: viewModel });
  };

  return SplashScreenContainer;
};

const createSplashViewModel = (context: ResolutionContext): ISplashVM => {
  const router: IRouter = context.get(AppModule.ROUTER);
  const locationService: ILocationService = context.get(AppModule.LOCATION);

  const expoSplashConfig: IExpoSplashConfig = {
    backgroundColor: theme => theme.colors.background,
    image: _theme => require('../../assets/images/ic-launcher-foreground.png'),
    imageWidth: 256,
  };

  const animation: ISplashAnimation = new SplashAnimation({
    duration: 400,
  });

  const prefetchTask: ISplashScreenTask = new LocationPrefetchTask(locationService);

  return new SplashVM(router, {
    ...expoSplashConfig,
    task: prefetchTask,
    animation: animation,
  });
};
