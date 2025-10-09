import { getUserProfile, has, StorageKeys } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import { checkSession } from '../check-session';
import type { HasParams } from '../protect';
import { getServerSession } from '../session';
import { isKindeRoute } from '../utils';
import { matchRoutes } from './utils';

export type KindeGlobalMiddlewareRoute = {
  path: string;
  has?: HasParams;
  redirectTo?: string;
};

export type KindeGlobalMiddlewareOptions = {
  protectedRoutes?: KindeGlobalMiddlewareRoute[];
  returnToCurrentPage?: boolean;
};

export const createKindeGlobalMiddleware = (options: KindeGlobalMiddlewareOptions) => {
  return createMiddleware().server(async ({ request, next }) => {
    const session = getServerSession();
    kindeLog.info(`KindeAuthMiddleware: firing with path ${request.url}`);
    if (isKindeRoute(request)) {
      kindeLog.info('KindeAuthMiddleware: isKindeRoute, passing to next middleware');
      return next();
    }

    const { isOnProtectedRoute, matchedRoutes } = matchRoutes(request, options.protectedRoutes ?? []);

    if (isOnProtectedRoute) {
      for (const route of matchedRoutes) {
        kindeLog.info(`KindeAuthMiddleware: checking route ${route.path}`);
        if (!route.has) continue;
        kindeLog.info(`KindeAuthMiddleware: checking permission ${route.has}`);
        const hasPermission = await has(route.has);
        if (!hasPermission) {
          throw redirect({
            href: route.redirectTo ?? KindeConfig.loginUrl,
          });
        }
      }
    }

    kindeLog.info('KindeAuthMiddleware: refreshing token (if necessary)');
    const checkSessionResult = await checkSession();

    if (checkSessionResult.message !== 'CHECK_SUCCESS') {
      kindeLog.info(`KindeAuthMiddleware: refresh token failed with error ${checkSessionResult.message}`);

      if (isOnProtectedRoute) {
        const firstMatchingRoute = matchedRoutes.find((route) => route.redirectTo);
        throw redirect({
          href: firstMatchingRoute?.redirectTo ?? KindeConfig.loginUrl,
        });
      }

      kindeLog.info('KindeAuthMiddleware: on public route, continuing despite refresh failure');
      return next();
    }

    await session.setItems({
      [StorageKeys.accessToken]: checkSessionResult.accessToken,
      [StorageKeys.idToken]: checkSessionResult.idToken,
      [StorageKeys.refreshToken]: checkSessionResult.refreshToken,
    });

    const user = await getUserProfile();

    return next({
      context: {
        user,
        isAuthenticated: true,
      },
    });
  });
};
