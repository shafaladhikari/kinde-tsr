import { has, isAuthenticated } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../config';

// TODO:
// Temporary fix due to lack of type export
export type HasParams = Parameters<typeof has>[0];

export type ProtectOptions = {
  has: HasParams;
  redirectTo: string;
};

export const protect = async (options: ProtectOptions) => {
  const isAuthed = await isAuthenticated();
  if (!isAuthed) {
    throw redirect({ to: options.redirectTo ?? KindeConfig.loginUrl });
  }
  const canView = await has(options.has);
  if (!canView) {
    throw redirect({ to: options.redirectTo ?? KindeConfig.loginUrl });
  }
  return true;
};
