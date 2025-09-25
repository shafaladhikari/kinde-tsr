import { callbackHandler } from '../../server/handlers/callback';
import { loginHandler } from '../../server/handlers/login';
import { logoutHandler } from '../../server/handlers/logout';
import { getSession, initSession } from '../../server/session';
import type { KindeRouteHandlerMap } from '../../server/types';
import { getKindeRouteFromRequest } from '../../server/utils';

const RouteMap: KindeRouteHandlerMap = {
  login: loginHandler,
  logout: logoutHandler,
  callback: callbackHandler,
};

export const KindeAuthHandler = (request: Request) => {
  const route = getKindeRouteFromRequest(request);
  initSession();

  if (!route) {
    return new Response('Not found', { status: 404 });
  }

  const handler = RouteMap[route];

  if (!handler) {
    return new Response('Not found', { status: 404 });
  }

  const session = getSession();

  return handler(request, session);
};
