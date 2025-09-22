import { FC } from 'react';
import { ReactNavigationRouter } from './react-navigation/react-navigation-router';
import { StackTreeFactory } from './react-navigation/stack-tree-factory';
import { ContainerModule, ResolutionContext } from 'inversify';

import { AppModule } from '@/di';
import { ILocationPermissionRoute } from '@/location';
import { ILogger, ILogService } from '@/log';
import { IMapRoute } from '@/map';
import { ISplashRoute } from '@/splash';

export type IRoute =
  | ISplashRoute
  | ILocationPermissionRoute
  | IMapRoute;

export type IRouteParams = Record<string, any>;

export interface INavigationLifecycleListener {
  onFocus?(): void;
  onBlur?(): void;
}

export interface IRouter {
  getWindow(): React.ReactElement;
  navigate(route: IRoute, params?: IRouteParams): void;
  replace(route: IRoute, params?: IRouteParams): void;
  goBack(): void;
  getCurrentRoute(): IRoute;
  /**
   * @returns a function to unsubscribe the listener
   */
  subscribe(route: IRoute, listener: INavigationLifecycleListener): Function;
}

export const RouterModule = new ContainerModule(({ bind }) => {
  bind<IRouter>(AppModule.ROUTER)
    .toDynamicValue(context => createRouter(context))
    .inSingletonScope();
});

const createRouter = (context: ResolutionContext): IRouter => {
  const logService: ILogService = context.get(AppModule.LOG);
  const logger: ILogger = logService.createLogger(ReactNavigationRouter.name);

  return new ReactNavigationRouter(logger, StackTreeFactory(() => ({
    '/': context.get<FC>(AppModule.SPLASH_SCREEN),
    '/location-permission': context.get<FC>(AppModule.LOCATION_PERMISSION),
    '/map': context.get<FC>(AppModule.MAP_SCREEN),
  })));
};
