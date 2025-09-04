import React from 'react';

import { IModalController, IModalFactory, IModalService, IWindowSizeListener, PresentationType } from '.';
import { ILayoutProvider, IModalRef, Modal } from './modal.component';
import { IModalWindowRef, ModalWindow as ModalWindowComponent } from './modal-window.component';

export interface IModalPresentationPolicy {
  apply(numberOfActiveModals: number, subscribe: (listener: IWindowSizeListener) => Function): Promise<void>;
}

export type IModalServiceOptions = Record<PresentationType, ILayoutProvider> & {
  presentationPolicy: IModalPresentationPolicy;
};

export class ModalService implements IModalService {

  private windowRef = React.createRef<IModalWindowRef>();

  private numberOfActiveModals: number = 0;
  private windowSizeListeners: IWindowSizeListener[] = [];

  constructor(private options: IModalServiceOptions) {

  }

  public getWindow = (): React.ReactElement => {
    return React.createElement(ModalWindowComponent, {
      ref: this.windowRef,
      onWindowSizeChange: this.onWindowSizeChange,
    });
  };

  public show = <R>(factory: IModalFactory<R>, presentationType: PresentationType): Promise<R> => {
    return this.options.presentationPolicy.apply(this.numberOfActiveModals, this.subscribe)
      .then(() => this.showInternal(factory, presentationType));
  };

  public subscribe = (listener: IWindowSizeListener): Function => {
    const subscriptionIndex: number = this.windowSizeListeners.push(listener) - 1;

    return () => {
      if (this.windowSizeListeners[subscriptionIndex] === listener) {
        this.windowSizeListeners.splice(subscriptionIndex, 1);
      }
    };
  };

  private showInternal = <R>(factory: IModalFactory<R>, presentationType: PresentationType): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!this.windowRef.current) {
        throw new Error('ModalWindow is not mounted');
      }

      const controller: IModalController = {
        resolve: (args: R) => {
          return ref.current?.hide()
            .then(() => this.windowRef.current?.unmount(elementId))
            .then(() => resolve(args));
        },
        reject: (error: Error) => {
          return ref.current?.hide()
            .then(() => this.windowRef.current?.unmount(elementId))
            .then(() => reject(error));
        },
      };

      const layoutProvider: ILayoutProvider = this.options[presentationType];

      if (!layoutProvider) {
        throw new Error(`Layout provider for presentation type ${presentationType} not found. Is it present in ModalService options?`);
      }

      const ref = React.createRef<IModalRef>();
      const modal = React.createElement(Modal, { ref, layoutProvider }, factory(controller));

      const elementId: number = this.windowRef.current?.mount(modal);
    });
  };

  private onWindowSizeChange = (numberOfActiveModals: number): void => {
    this.numberOfActiveModals = numberOfActiveModals;
    this.windowSizeListeners.forEach(l => l.onWindowSizeChange(numberOfActiveModals));
  };
}
