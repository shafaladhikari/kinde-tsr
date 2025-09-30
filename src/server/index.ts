import { frameworkSettings } from '@kinde-oss/kinde-auth-react/utils';
import { version } from '../../package.json';

frameworkSettings.framework = 'tanstack-start-react';
frameworkSettings.sdkVersion = version;

export * from '@kinde/js-utils';
export { KindeAuthHandler } from './handlers';
export { KindeAuthMiddleware, createKindeMiddleware } from './middleware/isolated';
export { protect } from './protect';