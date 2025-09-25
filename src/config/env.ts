import { trimTrailingSlash } from './utils';

export const kindeEssentialEnvVars = [
  'KINDE_CLIENT_ID',
  'KINDE_CLIENT_SECRET',
  'KINDE_ISSUER_URL',
  'KINDE_SITE_URL',
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

    if (varName === 'KINDE_ISSUER_URL' || varName === 'KINDE_SITE_URL') {
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
