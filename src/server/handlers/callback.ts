import { exchangeAuthCode } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import type { KindeRouteHandler } from '../../server/types';

export const callbackHandler: KindeRouteHandler = async (request) => {
  kindeLog.info('callbackHandler: firing');
  const exchangeResult = await exchangeAuthCode({
    urlParams: new URL(request.url).searchParams,
    clientId: KindeConfig.KINDE_CLIENT_ID,
    domain: KindeConfig.KINDE_ISSUER_URL,
    redirectURL: KindeConfig.callbackUrl,
    clientSecret: KindeConfig.KINDE_CLIENT_SECRET,
    autoRefresh: false,
  });

  if (!exchangeResult.success) {
    kindeLog.error(`callbackHandler encountered an error while exchanging auth code: ${exchangeResult.error}`);
  }

  throw redirect({
    href: KindeConfig.postLoginRedirectUrl,
  });
};
