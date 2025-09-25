import { KindeConfig } from '../config';

export const kindeLog = {
  info: (message: string) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.log(`[Kinde] ${message}`);
  },
  error: (message: string) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.error(`[Kinde] ${message}`);
  },
  warn: (message: string) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.warn(`[Kinde] ${message}`);
  },
  debug: (message: string) => {
    if (!KindeConfig.isDebugMode) {
      return;
    }
    console.debug(`[Kinde] ${message}`);
  },
};
