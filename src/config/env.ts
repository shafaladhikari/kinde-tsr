import { trimTrailingSlash } from './utils';

export const kindeEssentialServerEnvVars = ['KINDE_CLIENT_SECRET'] as const;
export const kindeEssentialClientEnvVars = ['KINDE_CLIENT_ID', 'KINDE_ISSUER_URL', 'KINDE_SITE_URL'] as const;
export const kindeOptionalEnvVars = [
  'KINDE_DEBUG_MODE',
  'KINDE_POST_LOGIN_REDIRECT_URL',
  'KINDE_POST_LOGOUT_REDIRECT_URL',
  'KINDE_AUTH_API_PATH',
  'KINDE_AUTH_LOGIN_ROUTE',
  'KINDE_AUTH_LOGOUT_ROUTE',
  'KINDE_AUTH_REGISTER_ROUTE',
  'KINDE_AUTH_CALLBACK_ROUTE',
  'KINDE_AUTH_HEALTH_ROUTE',
  'KINDE_AUTH_CREATE_ORG_ROUTE',
  'KINDE_COOKIE_DOMAIN',
  'KINDE_AUDIENCE',
] as const;
export const kindeEnvVars = [...kindeEssentialServerEnvVars, ...kindeEssentialClientEnvVars, ...kindeOptionalEnvVars];

export type KindeEssentialServerEnvVars = (typeof kindeEssentialServerEnvVars)[number];
export type KindeEssentialClientEnvVars = (typeof kindeEssentialClientEnvVars)[number];
export type KindeOptionalEnvVars = (typeof kindeOptionalEnvVars)[number];
export type KindeEnvVars = (typeof kindeEnvVars)[number];
export type KindeEnv = {
  [K in KindeEssentialServerEnvVars | KindeEssentialClientEnvVars | KindeOptionalEnvVars]: string;
};

const getKindeEnvVar = (varName: KindeEnvVars) => {
  return process.env[varName] || import.meta.env[`VITE_${varName}`];
};

export const getValidatedKindeEnv = () => {
  const env: Partial<KindeEnv> = {};
  if (typeof window === 'undefined') {
    kindeEssentialServerEnvVars.forEach((varName) => {
      const varValue = getKindeEnvVar(varName);
      if (!varValue) {
        throw new Error(`[Kinde] ${varName} is not set in the environment variables`);
      }

      env[varName] = varValue;
    });
  }

  kindeOptionalEnvVars.forEach((varName) => {
    env[varName] = getKindeEnvVar(varName);
  });

  kindeEssentialClientEnvVars.forEach((varName) => {
    const varValue = getKindeEnvVar(varName);
    if (!varValue) {
      throw new Error(`[Kinde] ${varName} is not set in the environment variables`);
    }
    if (varName === 'KINDE_ISSUER_URL' || varName === 'KINDE_SITE_URL') {
      env[varName] = trimTrailingSlash(varValue)!;
    } else {
      env[varName] = varValue;
    }
  });

  return env as KindeEnv;
};
