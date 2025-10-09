import { useEffect, useState } from 'react';
import { getSession } from '../server/fns/get-session';
import { getClientSession } from './store';

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
  return { loading };
};
