import { generateAuthUrl, IssuerRouteTypes, Scopes } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import type { KindeRouteHandler } from '../types';

export const registerHandler: KindeRouteHandler = async () => {
  kindeLog.info('registerHandler: firing');
  const authUrl = await generateAuthUrl(KindeConfig.env.KINDE_ISSUER_URL, IssuerRouteTypes.register, {
    clientId: KindeConfig.env.KINDE_CLIENT_ID,
    redirectURL: KindeConfig.callbackUrl,
    responseType: 'code',
    scope: [Scopes.openid, Scopes.profile, Scopes.email, Scopes.offline_access],
  });
  throw redirect({
    href: authUrl.url.toString(),
  });
};
