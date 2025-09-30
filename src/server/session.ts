import { setActiveStorage } from '@kinde/js-utils';
import { TanstackStore } from './store';

let serverSession: TanstackStore | null = null;

const initServerSession = () => {
  if (serverSession) return;
  serverSession = new TanstackStore();
  setActiveStorage(serverSession);
};

export const getServerSession = () => {
  if (!serverSession) {
    initServerSession();
  }
  return serverSession!;
}
