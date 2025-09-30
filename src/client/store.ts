import { MemoryStorage, setActiveStorage } from '@kinde/js-utils';

let clientSession: MemoryStorage | null = null;

const initClientSession = () => {
  if (clientSession) return;
  clientSession = new MemoryStorage();
  setActiveStorage(clientSession);
};

export const getClientSession = () => {
  if (!clientSession) {
    initClientSession();
  }
  return clientSession!;
}