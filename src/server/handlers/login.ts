import { generateAuthUrl, IssuerRouteTypes, Scopes } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import type { KindeRouteHandler } from '../../server/types';

export const loginHandler: KindeRouteHandler = async () => {
  kindeLog.info('loginHandler: firing');
  const authUrl = await generateAuthUrl(KindeConfig.KINDE_ISSUER_URL, IssuerRouteTypes.login, {
    clientId: KindeConfig.KINDE_CLIENT_ID,
    redirectURL: KindeConfig.callbackUrl,
    responseType: 'code',
    scope: [Scopes.openid, Scopes.profile, Scopes.email, Scopes.offline_access],
  });
  throw redirect({
    href: authUrl.url.toString(),
  });
};
