import type { RefreshTokenResult } from '@kinde/js-utils';
import { useCallback, useEffect, useState } from 'react';
import { getSession } from '../../../server/fns/get-session';
import { getClientSession } from '../../store';

export const useSessionSync = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getSession()
      .then(async (data) => {
        const session = getClientSession();
        if (data.message === 'SESSION_TERMINATE') {
          await session.destroySession();
        } else {
          await session.setItems(data.items);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const refreshHandler = useCallback(async (): Promise<RefreshTokenResult> => {
    console.log('refreshHandler: firing');
    const session = getClientSession();
    const getSessionResult = await getSession();

    if (getSessionResult.message === 'SESSION_TERMINATE') {
      await session.destroySession();
      return {
        success: false,
        error: 'User is unauthenticated or refresh failed',
      };
    }

    await session.setItems(getSessionResult.items);

    return {
      success: true,
      idToken: getSessionResult.items.idToken,
      accessToken: getSessionResult.items.accessToken,
    };
  }, []);
  return { loading, refreshHandler };
};
