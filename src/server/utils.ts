import { jwtDecoder } from '@kinde/jwt-decoder';
import { type KindeRoute, KindeRoutes } from './types';

export const getLastPathFromRequest = (request: Request) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const lastPath = path.split('/').pop();
  if (!lastPath) {
    return null;
  }
  return lastPath;
};

export const getKindeRouteFromRequest = (request: Request) => {
  const finalPath = getLastPathFromRequest(request);

  if (!finalPath) {
    return null;
  }

  const isKindeRoute = KindeRoutes.includes(finalPath as KindeRoute);

  if (!isKindeRoute) {
    return null;
  }

  return finalPath as KindeRoute;
};

export const isKindeRoute = (request: Request) => {
  const finalPath = getLastPathFromRequest(request);
  if (!finalPath) {
    return false;
  }
  return KindeRoutes.includes(finalPath as KindeRoute);
};

export const isTokenExpired = (token: string) => {
  const decodedToken = jwtDecoder(token);

  if (!decodedToken?.exp) {
    return true;
  }

  const TWENTY_EIGHT_DAYS = 86400000;
  const expiry = Math.min(decodedToken.exp * 1000 - 20000, TWENTY_EIGHT_DAYS);
  return expiry < Date.now();
};

export const validateClientSecret = (secret: string): boolean => {
  return !!secret.match('^[a-zA-Z0-9]{40,60}$')?.length;
};
