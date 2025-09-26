import { trimTrailingSlash } from './utils';

export const kindeEssentialEnvVars = [
  'VITE_KINDE_CLIENT_ID',
  'KINDE_CLIENT_SECRET',
  'VITE_KINDE_ISSUER_URL',
  'VITE_KINDE_SITE_URL',
] as const;
export const kindeOptionalEnvVars = [
  'KINDE_DEBUG_MODE',
  'KINDE_POST_LOGIN_REDIRECT_URL',
  'KINDE_POST_LOGOUT_REDIRECT_URL',
] as const;
export const kindeEnvVars = [...kindeEssentialEnvVars, ...kindeOptionalEnvVars];

export type KindeEssentialEnvVars = (typeof kindeEssentialEnvVars)[number];
export type KindeOptionalEnvVars = (typeof kindeOptionalEnvVars)[number];
export type KindeEnvVars = (typeof kindeEnvVars)[number];
export type KindeEnv = {
  [K in KindeEssentialEnvVars]: string;
} & {
  [K in KindeOptionalEnvVars]?: string;
};

const getKindeEnvVar = (varName: KindeEnvVars) => {
  return process.env[varName];
};

export const getValidatedKindeEnv = () => {
  const env: Partial<KindeEnv> = {};
  kindeEssentialEnvVars.forEach((varName) => {
    const varValue = getKindeEnvVar(varName);
    if (!varValue) {
      throw new Error(`[Kinde] ${varName} is not set in the environment variables`);
    }

    if (varName === 'VITE_KINDE_ISSUER_URL' || varName === 'VITE_KINDE_SITE_URL') {
      env[varName] = trimTrailingSlash(varValue)!;
    } else {
      env[varName] = varValue;
    }
  });

  kindeOptionalEnvVars.forEach((varName) => {
    env[varName] = getKindeEnvVar(varName);
  });

  return env as KindeEnv;
};
