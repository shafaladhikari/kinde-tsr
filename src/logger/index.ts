import { KindeConfig } from '../config';

export const kindeLog = {
  info: (message?: any, ...optionalParams: any[]) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.log(`[Kinde] ${message}`, ...optionalParams);
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.error(`[Kinde] ${message}`, ...optionalParams);
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.warn(`[Kinde] ${message}`, ...optionalParams);
  },
  debug: (message?: any, ...optionalParams: any[]) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.debug(`[Kinde] ${message}`, ...optionalParams);
  },
};
