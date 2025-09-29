import { createServerOnlyFn } from '@tanstack/react-start';
import { callbackHandler } from '../../server/handlers/callback';
import { loginHandler } from '../../server/handlers/login';
import { logoutHandler } from '../../server/handlers/logout';
import { setupHandler } from '../../server/handlers/setup';
import { getSession } from '../../server/session';
import type { KindeRouteHandlerMap } from '../../server/types';
import { getKindeRouteFromRequest } from '../../server/utils';

const RouteMap: KindeRouteHandlerMap = {
  login: loginHandler,
  logout: logoutHandler,
  callback: callbackHandler,
  setup: setupHandler,
};

export const KindeAuthHandler = createServerOnlyFn(async (request: Request) => {
  const route = getKindeRouteFromRequest(request);

  if (!route) {
    return new Response('Not found', { status: 404 });
  }

  const handler = RouteMap[route];
  const session = getSession();

  return handler(request, session);
});
