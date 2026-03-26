import { redirect } from '@tanstack/react-router';
import { kindeLog } from '../logger';
import { has } from '@kinde/js-utils';
import { getSession } from './fns/get-session';

// TODO:
// Temporary fix due to lack of type export
type HasParams = Parameters<typeof has>[0];
export type ProtectParams = {
  has?: HasParams;
  redirectTo?: string;
};


export const protect = async (params?: ProtectParams) => {
  kindeLog.info('protect: Starting protection check');
  const sessionResult = await getSession();

  if (sessionResult.message !== 'SESSION_VALID') {
    kindeLog.info('protect: User is not authenticated, redirecting to:', params?.redirectTo);
    throw redirect({
      to: params?.redirectTo ?? '/',
    });
  }

  if (params?.has) {
    kindeLog.info('protect: User provided hasParams, checking if user meets the required conditions', params.has);
    let doesHave = false;
    try { 
      doesHave = await has(params.has);
    }
    catch (error) {
      kindeLog.error('protect: Error occurred while checking user permissions', error);
      throw redirect({
        to: params?.redirectTo ?? '/',
      });
    }

    if (!doesHave) {
      kindeLog.info('protect: User does not meet the required conditions, redirecting to:', params?.redirectTo);
      throw redirect({
        to: params?.redirectTo ?? '/',
      });
    }
  }
}