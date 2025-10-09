import { isTokenExpired, RefreshType, refreshToken } from '@kinde/js-utils';
import { KindeConfig } from '../config';
import { kindeLog } from '../logger';

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
  }

  return {
    message: 'UNAUTHENTICATED',
  };
};
