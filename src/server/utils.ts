import { RefreshType, refreshToken, StorageKeys } from '@kinde/js-utils';
import { jwtDecoder } from '@kinde/jwt-decoder';
import { KindeConfig } from '../config';
import { getSession } from './session';
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

  return decodedToken.exp && decodedToken.exp < Date.now() / 1000;
};

export const refreshTokenIfNecessary = async () => {
  const session = getSession();
  const accessToken = await session.getSessionItem(StorageKeys.accessToken);
  const idToken = await session.getSessionItem(StorageKeys.idToken);
  if (!accessToken || !idToken) {
    return {
      success: false,
      message: 'No access token or id token found',
    };
  }

  if (isTokenExpired(accessToken as string) || isTokenExpired(idToken as string)) {
    const refreshResult = await refreshToken({
      domain: KindeConfig.env.KINDE_ISSUER_URL,
      clientId: KindeConfig.env.KINDE_CLIENT_ID,
      refreshType: RefreshType.refreshToken,
    });

    if (!refreshResult.success) {
      return {
        success: false,
        message: refreshResult.error,
      };
    }
  }

  return {
    success: true,
    message: 'Tokens refreshed',
  };
};
