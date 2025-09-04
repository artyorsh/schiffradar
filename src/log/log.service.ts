import { ILogLevel, ILogPayload, ILogService } from '.';

export interface ILogServiceOptions {
  flushInterval?: number;
  transporters?: ILogTransporter[];
  defaultLabels?: ILogPayload;
}

export interface ILogOptions {
  level: ILogLevel;
}

export interface ILogTransporter {
  readonly id: string;
  transport(tag: string, message: string, options?: ILogOptions): void;
  flush(): void;
}

export class LogService implements ILogService {

  private transporters: ILogTransporter[] = [];

  private defaultLabels: ILogPayload = {};
  private customLabels: ILogPayload = {};

  constructor(options: ILogServiceOptions = {}) {
    this.transporters = options.transporters || [];
    this.defaultLabels = options.defaultLabels || {};

    const flushInterval: number = options.flushInterval || 0;

    if (flushInterval > 0) {
      setInterval(() => this.flush(), flushInterval);
    }
  }

  public log = (tag: string, message: string, level: ILogLevel, payload: ILogPayload = {}): void => {
    this.transporters.forEach(t => {
      const labels = { ...this.customLabels, ...payload, ...this.defaultLabels, level };
      t.transport(tag, message, labels);
    });
  };

  public debug = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'debug', payload);
  };

  public info = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'info', payload);
  };

  public warn = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'warn', payload);
  };

  public error = (tag: string, message: string, payload: ILogPayload = {}): void => {
    this.log(tag, message, 'error', payload);
  };

  public addLabel = (key: string, value: string): void => {
    this.customLabels[key] = value;
  };

  public removeLabel = (key: string): void => {
    delete this.customLabels[key];
  };

  public flush = (): void => {
    this.transporters.forEach(t => t.flush());
  };
}
