import { getValidatedKindeEnv, type KindeEnv } from './env';
import { stringbool, trimTrailingSlash } from './utils';

type KindeConfig = {
  env: KindeEnv;
  isDebugMode: boolean;
  postLoginRedirectUrl: string;
  postLogoutRedirectUrl: string;
  callbackUrl: string;
};

const buildKindeConfig = (): KindeConfig => {
  const env = getValidatedKindeEnv();

  return {
    env,
    isDebugMode: stringbool(env.KINDE_DEBUG_MODE),
    postLoginRedirectUrl: trimTrailingSlash(env.KINDE_POST_LOGIN_REDIRECT_URL) ?? env.VITE_KINDE_SITE_URL,
    postLogoutRedirectUrl: trimTrailingSlash(env.KINDE_POST_LOGOUT_REDIRECT_URL) ?? env.VITE_KINDE_SITE_URL,
    callbackUrl: `${env.VITE_KINDE_SITE_URL}/api/auth/callback`,
  };
};

export const KindeConfig = buildKindeConfig();
