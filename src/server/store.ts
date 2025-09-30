import { SessionBase, type SessionManager, StorageKeys, splitString, storageSettings } from '@kinde/js-utils';
import { deleteCookie, getCookie, getCookies, setCookie } from '@tanstack/react-start/server';
import { KindeConfig } from '../config';

export class TanstackStore<V extends string = StorageKeys> extends SessionBase<V> implements SessionManager<V> {
  async destroySession(): Promise<void> {
    const keys = Object.values(StorageKeys);
    keys.forEach((key) => {
      deleteCookie(key);
    });
  }

  async setSessionItem(itemKey: V | StorageKeys, itemValue: unknown): Promise<void> {
    await this.removeSessionItem(itemKey);
    if (typeof itemValue === 'string') {
      splitString(itemValue, storageSettings.maxLength).forEach((splitValue, index) => {
        setCookie(`${storageSettings.keyPrefix}${itemKey}${index}`, splitValue, {
          domain: KindeConfig.cookieDomain,
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
      });
    }

    return;
  }

  async getSessionItem(itemKey: V | StorageKeys): Promise<unknown | null> {
    const cookies = getCookies();

    if (!cookies[`${storageSettings.keyPrefix}${itemKey}0`]) {
      return null;
    }

    let itemValue = '';
    let index = 0;
    let key = `${storageSettings.keyPrefix}${itemKey}${index}`;
    while (cookies[key]) {
      itemValue += getCookie(key);
      index++;
      key = `${storageSettings.keyPrefix}${itemKey}${index}`;
    }

    return itemValue;
  }

  async removeSessionItem(itemKey: V | StorageKeys): Promise<void> {
    const cookies = getCookies();
    for (const key in cookies) {
      if (key.startsWith(`${storageSettings.keyPrefix}${itemKey}`)) {
        deleteCookie(key);
      }
    }
  }
}
