import { createServerOnlyFn } from '@tanstack/react-start';
import { getServerSession } from '../session';
import type { KindeRouteHandlerMap } from '../types';
import { getKindeRouteFromRequest } from '../utils';
import { callbackHandler } from './callback';
import { createOrgHandler } from './create-org';
import { healthHandler } from './health';
import { loginHandler } from './login';
import { logoutHandler } from './logout';
import { registerHandler } from './register';

const RouteMap: KindeRouteHandlerMap = {
  login: loginHandler,
  logout: logoutHandler,
  callback: callbackHandler,
  register: registerHandler,
  'create-org': createOrgHandler,
  health: healthHandler,
};

export const kindeAuthHandler = createServerOnlyFn(async (request: Request) => {
  const route = getKindeRouteFromRequest(request);

  if (!route) {
    return new Response('Not found', { status: 404 });
  }

  const handler = RouteMap[route];
  const session = getServerSession();

  return handler(request, session);
});
