import { SessionBase, type SessionManager, StorageKeys } from '@kinde/js-utils';
import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server';

export class TanstackStore<V extends string = StorageKeys> extends SessionBase<V> implements SessionManager<V> {
  async destroySession(): Promise<void> {
    const keys = Object.values(StorageKeys);
    keys.forEach((key) => {
      deleteCookie(key);
    });
  }

  async setSessionItem(itemKey: V | StorageKeys, itemValue: unknown): Promise<void> {
    setCookie(itemKey, itemValue as string);
  }

  async getSessionItem(itemKey: V | StorageKeys): Promise<unknown | null> {
    return getCookie(itemKey);
  }

  async removeSessionItem(itemKey: V | StorageKeys): Promise<void> {
    deleteCookie(itemKey);
  }
}
