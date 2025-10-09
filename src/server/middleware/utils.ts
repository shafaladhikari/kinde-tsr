import { pathToRegexp } from 'path-to-regexp';
import type { KindeGlobalMiddlewareRoute } from '.';

export const matchRoutes = (request: Request, protectedRoutes: KindeGlobalMiddlewareRoute[]) => {
  const path = new URL(request.url).pathname;
  const matchedRoutes = protectedRoutes.filter((route) => {
    const pattern = pathToRegexp(route.path).regexp;
    return pattern.test(path);
  });
  return {
    matchedRoutes,
    isOnProtectedRoute: matchedRoutes.length > 0,
  };
};
