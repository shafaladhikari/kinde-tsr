import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import type { KindeRouteHandler } from '../../server/types';

export const logoutHandler: KindeRouteHandler = async (_, session) => {
  await session.destroySession();
  throw redirect({
    href: KindeConfig.postLogoutRedirectUrl,
  });
};
