import { setActiveStorage } from '@kinde/js-utils';
import { TanstackStore } from './store';

let session: TanstackStore | null = null;

export const initSession = () => {
  if (session) return;
  session = new TanstackStore();
  setActiveStorage(session);
};

export const getSession = () => {
  if (!session) {
    initSession();
  }
  return session!;
};
