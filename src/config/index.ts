import { getValidatedKindeEnv, type KindeEnv } from './env';
import { stringbool, trimTrailingSlash } from './utils';
import { sanitizeUrl } from '@kinde/js-utils'

type KindeConfig = {
  env: KindeEnv;
  isDebugMode: boolean;
  postLoginRedirectUrl: string;
  postLogoutRedirectUrl: string;
  callbackUrl: string;
  logoutUrl: string;
  loginUrl: string;
  registerUrl: string;
  healthUrl: string;
  createOrgUrl: string;
  authApiPath: string;
  cookieDomain: string | undefined;
}

const buildKindeConfig = (): KindeConfig => {
  const env = getValidatedKindeEnv();
  const authApiPath = env.KINDE_AUTH_API_PATH ?? 'api/auth'

  const buildKindeAuthUrl = (path: string) => {
    return sanitizeUrl(`${env.KINDE_SITE_URL}/${authApiPath}/${path}`);
  };

  return {
    env,
    isDebugMode: stringbool(env.KINDE_DEBUG_MODE),
    postLoginRedirectUrl: trimTrailingSlash(env.KINDE_POST_LOGIN_REDIRECT_URL) ?? env.KINDE_SITE_URL,
    postLogoutRedirectUrl: trimTrailingSlash(env.KINDE_POST_LOGOUT_REDIRECT_URL) ?? env.KINDE_SITE_URL,
    callbackUrl: buildKindeAuthUrl(env.KINDE_AUTH_CALLBACK_ROUTE ?? 'callback'),
    logoutUrl: buildKindeAuthUrl(env.KINDE_AUTH_LOGOUT_ROUTE ?? 'logout'),
    loginUrl: buildKindeAuthUrl(env.KINDE_AUTH_LOGIN_ROUTE ?? 'login'),
    registerUrl: buildKindeAuthUrl(env.KINDE_AUTH_REGISTER_ROUTE ?? 'register'),
    healthUrl: buildKindeAuthUrl(env.KINDE_AUTH_HEALTH_ROUTE ?? 'health'),
    createOrgUrl: buildKindeAuthUrl(env.KINDE_AUTH_CREATE_ORG_ROUTE ?? 'create-org'),
    authApiPath,
    cookieDomain: env.KINDE_COOKIE_DOMAIN ?? undefined,
  };
};

export const KindeConfig = buildKindeConfig();
