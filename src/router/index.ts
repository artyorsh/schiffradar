import { ReactNavigationRouter } from './react-navigation/react-navigation-router';
import { StackRouteFactory } from './react-navigation/stack-route-factory';
import { ContainerModule, interfaces } from 'inversify';

import { AppModule } from '@/di/model';
import { ILocationPermissionRoute } from '@/location';
import { ILogService } from '@/log';
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
  /**
   * @returns a function to unsubscribe the listener
   */
  subscribe(route: IRoute, listener: INavigationLifecycleListener): Function;
}

export const RouterModule = new ContainerModule(bind => {
  bind<IRouter>(AppModule.ROUTER)
    .toDynamicValue(context => createRouter(context))
    .inSingletonScope();
});

const createRouter = (context: interfaces.Context): IRouter => {
  const logService: ILogService = context.container.get(AppModule.LOG);

  return new ReactNavigationRouter(logService, StackRouteFactory({
    '/': context.container.get(AppModule.SPLASH_SCREEN),
    '/location-permission': context.container.get(AppModule.LOCATION_PERMISSION),
    '/map': context.container.get(AppModule.MAP_SCREEN),
  }));
};

