import { exchangeAuthCode } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import type { KindeRouteHandler } from '../../server/types';

export const callbackHandler: KindeRouteHandler = async (request) => {
  kindeLog.info('callbackHandler: firing');
  const exchangeResult = await exchangeAuthCode({
    urlParams: new URL(request.url).searchParams,
    clientId: KindeConfig.env.KINDE_CLIENT_ID,
    domain: KindeConfig.env.KINDE_ISSUER_URL,
    redirectURL: KindeConfig.callbackUrl,
    clientSecret: KindeConfig.env.KINDE_CLIENT_SECRET,
    autoRefresh: false,
  });

  if (!exchangeResult.success) {
    kindeLog.error(`callbackHandler encountered an error while exchanging auth code: ${exchangeResult.error}`);
    throw redirect({
      href: KindeConfig.postLogoutRedirectUrl
    })
  }

  throw redirect({
    href: KindeConfig.postLoginRedirectUrl,
  });
};
