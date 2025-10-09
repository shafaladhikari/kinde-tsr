import { frameworkSettings } from '@kinde-oss/kinde-auth-react/utils';
import { version } from '../../package.json';

frameworkSettings.framework = 'tanstack-start-react';
frameworkSettings.sdkVersion = version;

export * from '@kinde/js-utils';
export { kindeAuthHandler } from './handlers';
export { createKindeGlobalMiddleware } from './middleware';
export { protect } from './protect';
