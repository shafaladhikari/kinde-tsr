import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import { validateClientSecret } from '../../server/utils';
import type { KindeRouteHandler } from '../types';

export const healthHandler: KindeRouteHandler = async (_, session) => {
  if (!KindeConfig.isDebugMode) {
    return new Response('OK', { status: 200 });
  }

  return new Response(
    JSON.stringify({
      apiPath: KindeConfig.authApiPath,
      siteUrl: KindeConfig.env.KINDE_SITE_URL,
      postLoginRedirectURL: KindeConfig.postLoginRedirectUrl,
      issuerURL: KindeConfig.env.KINDE_ISSUER_URL,
      clientID: KindeConfig.env.KINDE_CLIENT_ID,
      clientSecret: validateClientSecret(KindeConfig.env.KINDE_CLIENT_SECRET ?? '')
        ? 'Set correctly'
        : 'Not set correctly',
      postLogoutRedirectURL: KindeConfig.postLogoutRedirectUrl,
      audience: KindeConfig.env.KINDE_AUDIENCE,
      cookieDomain: KindeConfig.env.KINDE_COOKIE_DOMAIN,
      logoutRedirectURL: KindeConfig.postLogoutRedirectUrl,
      routes: {
        login: KindeConfig.loginUrl,
        logout: KindeConfig.logoutUrl,
        callback: KindeConfig.callbackUrl,
        register: KindeConfig.registerUrl,
        health: KindeConfig.healthUrl,
        createOrg: KindeConfig.createOrgUrl,
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
