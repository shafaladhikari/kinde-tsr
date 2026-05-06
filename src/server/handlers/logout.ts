import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import type { KindeRouteHandler } from '../../server/types';

export const logoutHandler: KindeRouteHandler = async (_, session) => {
  kindeLog.info('logoutHandler: firing');
  await session.destroySession();

  const issuerUrl = KindeConfig.env.KINDE_ISSUER_URL;
  const postLogoutRedirectUrl = KindeConfig.postLogoutRedirectUrl;
  
  const logoutUrl = new URL(`${issuerUrl}/logout`);
  logoutUrl.searchParams.set('redirect', postLogoutRedirectUrl);
  const logoutEndpoint = logoutUrl.toString();

  throw redirect({ href: logoutEndpoint });
};
