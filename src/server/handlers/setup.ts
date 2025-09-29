import { StorageKeys } from '@kinde/js-utils';
import { redirect } from '@tanstack/react-router';
import { KindeConfig } from '../../config';
import { kindeLog } from '../../logger';
import type { KindeRouteHandler } from '../types';

export const setupHandler: KindeRouteHandler = async (_, session) => {
  kindeLog.info('setupHandler: firing');
  const [accessToken, idToken, refreshToken] = await Promise.all([
    session.getSessionItem(StorageKeys.accessToken),
    session.getSessionItem(StorageKeys.idToken),
    session.getSessionItem(StorageKeys.refreshToken),
  ]);
  return new Response(
    JSON.stringify({
      accessToken: accessToken as string,
      idToken: idToken as string,
      refreshToken: refreshToken as string,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
