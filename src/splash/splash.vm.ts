import { ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native';
import { UnistylesTheme } from 'react-native-unistyles';

import { INavigationLifecycleListener, IRoute, IRouter } from '@/router';

import { ISplashVM } from './splash.component';

export interface IPrefetchTask {
  /**
   * Prefetches the app state required for the initial start.
   * @returns initial route and params to navigate.
   */
  prefetch(): Promise<[IRoute, object]>;
}

export interface ISplashAnimation {
  playTillIntermediate(): Promise<void>;
  finish(): Promise<void>;
  getImageStyle(): ImageStyle;
}

/**
 * Copy 'expo-splash-screen' config, see app.config.ts
 * @see https://docs.expo.dev/versions/latest/sdk/splash-screen/#configurable-properties
 */
export interface IExpoSplashConfig {
  backgroundColor(theme: UnistylesTheme): string;
  image(theme: UnistylesTheme): ImageSourcePropType;
  imageWidth: number;
}

export interface ISplashScreenConfig extends IExpoSplashConfig {
  /**
   * The task to run before navigating to main screen (e.g user login).
   */
  prefetchTask: IPrefetchTask;
  /**
   * The animation to run while the `task` is running.
   * - The `playToIntermediate` starts the animation before the task.
   * - The `finish` finalizes the animation when the `task` is resolved.
   */
  animation: ISplashAnimation;
}

export class SplashVM implements ISplashVM, INavigationLifecycleListener {

  private task: IPrefetchTask;
  private animation: ISplashAnimation;
  private config: IExpoSplashConfig;

  constructor(private router: IRouter, { prefetchTask, animation, ...config }: ISplashScreenConfig) {
    this.task = prefetchTask;
    this.animation = animation;
    this.config = config;
    this.router.subscribe('/', this);
  }

  public onFocus = async (): Promise<void> => {
    await this.animation.playTillIntermediate();
    const [route, params] = await this.task.prefetch();

    await this.animation.finish();
    this.router.replace(route, params);
  };

  public onBlur = (): void => {
    /* no-op */
  };

  public getImage(theme: UnistylesTheme): ImageSourcePropType {
    return this.config.image(theme);
  }

  public getImageStyle(): ImageStyle {
    return {
      width: this.config.imageWidth,
      height: this.config.imageWidth,
      ...this.animation.getImageStyle(),
    };
  }

  public getBackgroundStyle(theme: UnistylesTheme): ViewStyle {
    return {
      backgroundColor: this.config.backgroundColor(theme),
    };
  }
}
