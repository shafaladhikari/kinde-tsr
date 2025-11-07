import { has, isAuthenticated } from '@kinde/js-utils';
import { KindeConfig } from '../../config';
import type { KindeRouteRule } from '.';

export const matchRoutes = (pathname: string, protectedRoutes: KindeRouteRule[]) => {
  const matchedRoutes = protectedRoutes.filter((route) => {
    return matchRoute(route.path, pathname);
  });
  return {
    matchedRoutes,
    isOnProtectedRoute: matchedRoutes.length > 0,
  };
};

const matchRoute = (glob: string, path: string): boolean => {
  if (!glob || !path) return false;

  const normalizeAndSplit = (str: string) =>
    normalizePath(str)
      .toLowerCase()
      .split('/')
      .slice(1)
      .map((item) => item.trim());

  const pattern = normalizeAndSplit(glob);
  const route = normalizeAndSplit(path);

  const hasWildcard = pattern[pattern.length - 1] === '*';

  // Match all routes if pattern is just '/*'
  if (pattern.length === 1 && hasWildcard) return true;

  // For non-wildcard patterns, lengths must match exactly
  if (!hasWildcard && pattern.length !== route.length) return false;

  // For wildcard patterns, route must be at least pattern.length - 1
  // This allows /protected/* to match both /protected and /protected/anything
  if (hasWildcard && route.length < pattern.length - 1) return false;

  // Compare segments up to the wildcard (or full pattern if no wildcard)
  const compareLength = hasWildcard ? pattern.length - 1 : pattern.length;
  const result = pattern.slice(0, compareLength).every((segment, index) => matchPattern(segment, route[index]));

  return result;
};

const normalizePath = (str: string): string => {
  const path = str.trim().startsWith('/') ? str.trim() : `/${str.trim()}`;
  return path.length === 1 ? path : path.replace(/\/$/, '');
};

const matchPattern = (pattern: string | undefined, blob: string | undefined): boolean => {
  if (!pattern || !blob) return false;
  return pattern === '*' || pattern === blob;
};

export const evaluateRouteRule = async (path: string) => {
  const { isOnProtectedRoute, matchedRoutes } = matchRoutes(path, KindeConfig.routeRules ?? []);
  const isAuthed = await isAuthenticated();
  if (isOnProtectedRoute) {
    for (const route of matchedRoutes) {
      if (!route.has && !isAuthed) {
        return {
          access: false,
          redirectTo: route.redirectTo,
        };
      } else if (route.has) {
        const hasPermission = await has(route.has!);
        if (!hasPermission) {
          return {
            access: false,
            redirectTo: route.redirectTo,
          };
        }
      }
    }
  }

  return {
    access: true,
  };
};
