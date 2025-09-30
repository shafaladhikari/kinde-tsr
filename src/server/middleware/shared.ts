import { redirect } from '@tanstack/react-router';
import type { RequestServerNextFn } from '@tanstack/react-start';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import { isKindeRoute, refreshTokenIfNecessary } from '../utils';

export const handleKindeMiddleware = async <TRegister, TMiddlewares>(
  request: Request,
  next: RequestServerNextFn<TRegister, TMiddlewares>,
) => {
  kindeLog.info(`KindeAuthMiddleware: firing with path ${request.url}`);
  if (isKindeRoute(request)) {
    kindeLog.info('KindeAuthMiddleware: isKindeRoute, passing to next middleware');
    return next();
  }

  kindeLog.info('KindeAuthMiddleware: refreshing token (if necessary)');
  const refreshResult = await refreshTokenIfNecessary();

  if (!refreshResult.success) {
    kindeLog.info(`KindeAuthMiddleware: refresh token failed with error ${refreshResult.message}`);
    throw redirect({
      href: KindeConfig.loginUrl,
    });
  }

  return next();
};
