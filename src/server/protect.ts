import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { kindeLog } from '../logger';
import { evaluateRouteRule } from './middleware/utils';

const evaluateRoute = createServerFn()
  .inputValidator((path: string) => path)
  .handler(async (ctx) => {
    return await evaluateRouteRule(ctx.data);
  });

export const protect = async (path: string) => {
  kindeLog.info(`protect: protect has been called with path ${path}`);
  const result = await evaluateRoute({ data: path });
  if (!result.access) {
    kindeLog.info(`protect: no access, redirecting to ${result.redirectTo}`);
    throw redirect({ to: result.redirectTo });
  }
};
