export interface Alert {
  message: string;
  target: AlertTarget;
}

export enum AlertTarget {
  Success = 'Success',
  Error = 'Error',
  Info = 'Info',
  Warning = 'Warning',
  Debug = 'Debug'
}