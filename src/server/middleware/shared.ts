import { isKindeRoute, refreshTokenIfNecessary } from "../utils";
import { kindeLog } from "../../logger";
import { getUserProfile, isAuthenticated } from "@kinde/js-utils";
import { isRedirect, redirect } from "@tanstack/react-router";
import { RequestServerNextFn } from "@tanstack/react-start";
import { KindeConfig } from "../../config";

export const handleKindeMiddleware = async <TRegister, TMiddlewares>(request: Request, next: RequestServerNextFn<TRegister, TMiddlewares>) => {
  kindeLog.info(`KindeAuthMiddleware: firing with path ${request.url}`);
  if (isKindeRoute(request)) {
    kindeLog.info('KindeAuthMiddleware: isKindeRoute, passing to next middleware');
    return next();
  }

  kindeLog.info('KindeAuthMiddleware: refreshing token (if necessary)');
  const refreshResult = await refreshTokenIfNecessary();

  if (!refreshResult.success) {
    kindeLog.info(`KindeAuthMiddleware: refresh token failed with error ${refreshResult.message}`);
    throw redirect({
      to: KindeConfig.loginUrl,
    });
  }

  return next()
};