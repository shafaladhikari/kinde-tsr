import { isTokenExpired, RefreshType, refreshToken, StorageKeys } from '@kinde/js-utils';
import { KindeConfig } from '../config';
import { kindeLog } from '../logger';
import { getServerSession } from './session';

type CheckSessionPayload =
  | {
      message: 'REFRESH_FAILED';
    }
  | {
      message: 'UNAUTHENTICATED';
    }
  | {
      message: 'CHECK_SUCCESS';
      idToken: string;
      accessToken: string;
      refreshToken: string;
    };
type CheckSessionResult = Promise<CheckSessionPayload>;

export const checkSession = async (): CheckSessionResult => {
  const session = getServerSession();
  const sessionRefreshToken = await session.getSessionItem(StorageKeys.refreshToken);
  
  if (
    await isTokenExpired({
      threshold: 2,
    })
  ) {
    if(!sessionRefreshToken) {
      kindeLog.info('checkSession: access token expired but no refresh token found, user is unauthenticated');
      return {
        message: 'UNAUTHENTICATED',
      };
    }
    kindeLog.info(
      `checkSession: Calling refreshToken with domain ${KindeConfig.env.KINDE_ISSUER_URL} and clientId ${KindeConfig.env.KINDE_CLIENT_ID}`,
    );
    const refreshResult = await refreshToken({
      domain: KindeConfig.env.KINDE_ISSUER_URL,
      clientId: KindeConfig.env.KINDE_CLIENT_ID,
      refreshType: RefreshType.refreshToken,
      clientSecret: KindeConfig.env.KINDE_CLIENT_SECRET,
    });

    if (!refreshResult.success) {
      kindeLog.error(`checkSession: refresh token failed with error ${refreshResult.error}`);
      return {
        message: 'REFRESH_FAILED',
      };
    }

    return {
      message: 'CHECK_SUCCESS',
      idToken: refreshResult.idToken!,
      accessToken: refreshResult.accessToken!,
      refreshToken: refreshResult.refreshToken!,
    };
  } else {
    const sessionAccessToken = await session.getSessionItem(StorageKeys.accessToken);
    const sessionIdToken = await session.getSessionItem(StorageKeys.idToken);

    if (!sessionAccessToken || !sessionIdToken || !sessionRefreshToken) {
      kindeLog.info('checkSession: no session tokens found, user is unauthenticated');
      return {
        message: 'UNAUTHENTICATED',
      };
    }

    return {
      message: 'CHECK_SUCCESS',
      idToken: sessionIdToken as string,
      accessToken: sessionAccessToken as string,
      refreshToken: sessionRefreshToken as string,
    };
  }
};
