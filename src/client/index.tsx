import { frameworkSettings } from '@kinde/js-utils';
import { version } from '../../package.json';

frameworkSettings.framework = 'tanstack-start-react';
frameworkSettings.sdkVersion = version;

export { useKindeAuth } from '@kinde-oss/kinde-auth-react';
export * from './components';
