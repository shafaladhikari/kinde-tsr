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
  if (
    await isTokenExpired({
      threshold: 20000,
    })
  ) {
    console.log(
      `Calling refreshToken with domain ${KindeConfig.env.KINDE_ISSUER_URL} and clientId ${KindeConfig.env.KINDE_CLIENT_ID}`,
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
    const session = getServerSession();
    const accessToken = await session.getSessionItem(StorageKeys.accessToken);
    const idToken = await session.getSessionItem(StorageKeys.idToken);
    const refreshToken = await session.getSessionItem(StorageKeys.refreshToken);

    if (!accessToken || !idToken || !refreshToken) {
      kindeLog.info('checkSession: no session tokens found, user is unauthenticated');
      return {
        message: 'UNAUTHENTICATED',
      };
    }

    return {
      message: 'CHECK_SUCCESS',
      idToken: idToken as string,
      accessToken: accessToken as string,
      refreshToken: refreshToken as string,
    };
  }
};
