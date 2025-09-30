import { createMiddleware } from '@tanstack/react-start';
import { handleKindeMiddleware } from './shared';
import { has } from '@kinde/js-utils';
import { isRedirect, redirect } from '@tanstack/react-router';
import { kindeLog } from '../../logger';
import { KindeConfig } from '../../config';


export const KindeAuthMiddleware = createMiddleware().server(async ({ request, next }) => {
  return handleKindeMiddleware(request, next);
});

type KindeMiddlewareOptions = {
  has: Parameters<typeof has>[0]
  noAccessRedirect?: string
}

export const createKindeMiddleware = (options: KindeMiddlewareOptions) => {
  return createMiddleware().server(async ({ request, next }) => {
    if(options.has) {
      kindeLog.info(`KindeAuthMiddleware: checking if user has permissions ${JSON.stringify(options.has)}`);
      const canView = await has(options.has);
      if(!canView) {
        kindeLog.info(`KindeAuthMiddleware: user does not have permissions, redirecting to ${options.noAccessRedirect ?? '/api/auth/login'}`);
        throw redirect({ to: options.noAccessRedirect ?? KindeConfig.loginUrl })
      }
    }
    return handleKindeMiddleware(request, next);
  });
}
