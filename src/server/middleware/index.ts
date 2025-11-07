import { getUserProfile, has, StorageKeys } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { createMiddleware } from '@tanstack/react-start';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import { checkSession } from '../check-session';
import { getServerSession } from '../session';
import { isKindeRoute } from '../utils';
import { matchRoutes } from './utils';

// TODO:
// Temporary fix due to lack of type export
type HasParams = Parameters<typeof has>[0];

export type KindeRouteRule = {
  path: string;
  has?: HasParams;
  redirectTo: string;
};

export type KindeGlobalMiddlewareOptions = {
  routeRules?: KindeRouteRule[];
  returnToCurrentPage?: boolean;
};

export const createKindeGlobalMiddleware = (options: KindeGlobalMiddlewareOptions) => {
  return createMiddleware().server(async ({ request, next }) => {
    KindeConfig.routeRules = options.routeRules ?? [];

    const session = getServerSession();
    kindeLog.info(`KindeAuthMiddleware: firing with path ${request.url}`);
    if (isKindeRoute(request)) {
      kindeLog.info('KindeAuthMiddleware: isKindeRoute, passing to next middleware');
      return next();
    }

    const { isOnProtectedRoute, matchedRoutes } = matchRoutes(new URL(request.url).pathname, options.routeRules ?? []);

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
    const firstMatchingRedirect = matchedRoutes.find((route) => route.redirectTo)?.redirectTo;
    const firstMatchingPermission = matchedRoutes.find((route) => route.has)?.has;

    if (checkSessionResult.message !== 'CHECK_SUCCESS') {
      kindeLog.info(`KindeAuthMiddleware: refresh token failed with error ${checkSessionResult.message}`);

      if (isOnProtectedRoute) {
        throw redirect({
          href: firstMatchingRedirect ?? KindeConfig.loginUrl,
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

    console.log('KindeAuthMiddleware: middleware nexting');

    return next({
      context: {
        user,
        isAuthenticated: true,
        permissions: firstMatchingPermission,
      },
    });
  });
};
