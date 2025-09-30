import { getUserProfile, isAuthenticated } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { kindeLog } from '../logger';
import { isKindeRoute, refreshTokenIfNecessary } from './utils';

type KindeRequestMiddleware = ReturnType<ReturnType<typeof createMiddleware>['server']>;

export const KindeAuthMiddleware: KindeRequestMiddleware = createMiddleware().server(async ({ request, next }) => {
  kindeLog.info(`KindeAuthMiddleware: firing with path ${request.url}`);
  if (isKindeRoute(request)) {
    kindeLog.info('KindeAuthMiddleware: isKindeRoute, passing to next middleware');
    return next();
  }

  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    kindeLog.info('KindeAuthMiddleware: not authenticated, redirecting to login');
    throw redirect({
      to: '/api/auth/login',
    });
  }

  kindeLog.info('KindeAuthMiddleware: refreshing token (if necessary)');
  const refreshResult = await refreshTokenIfNecessary();

  if (!refreshResult.success) {
    kindeLog.info(`KindeAuthMiddleware: refresh token failed with error ${refreshResult.message}`);
    throw redirect({
      to: '/api/auth/login',
    });
  }

  const user = await getUserProfile();
  kindeLog.info('KindeAuthMiddleware: user authenticated, passing to next middleware');
  return next({
    context: {
      user,
    },
  });
});
