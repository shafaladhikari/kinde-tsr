import { generateAuthUrl, IssuerRouteTypes, Scopes } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import type { KindeRouteHandler } from '../../server/types';

export const loginHandler: KindeRouteHandler = async () => {
  const authUrl = await generateAuthUrl(KindeConfig.env.KINDE_ISSUER_URL, IssuerRouteTypes.login, {
    clientId: KindeConfig.env.KINDE_CLIENT_ID,
    redirectURL: KindeConfig.callbackUrl,
    responseType: 'code',
    scope: [Scopes.openid, Scopes.profile, Scopes.email, Scopes.offline_access],
  });
  throw redirect({
    href: authUrl.url.toString(),
  });
};
