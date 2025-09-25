import type { TanstackStore } from './store';

export const KindeRoutes = ['login', 'logout', 'callback'] as const;
export type KindeRoute = (typeof KindeRoutes)[number];
export type KindeRouteHandler = (request: Request, session: TanstackStore) => Promise<Response>;
export type KindeRouteHandlerMap = Record<KindeRoute, KindeRouteHandler>;
