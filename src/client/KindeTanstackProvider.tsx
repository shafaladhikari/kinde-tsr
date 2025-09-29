import { StorageKeys } from '@kinde/js-utils';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { ClientOnly } from '@tanstack/react-router';
import { type ReactNode, useEffect } from 'react';
import { clientStore } from './store';

export type KindeTanstackProviderProps = {
  children: ReactNode;
};

export const KindeTanstackProvider = ({ children, ...props }: KindeTanstackProviderProps) => {
  return (
    <ClientOnly>
      <ClientOnlyKindeProvider {...props}>{children}</ClientOnlyKindeProvider>
    </ClientOnly>
  );
}

const ClientOnlyKindeProvider = ({ children, ...props }: KindeTanstackProviderProps) => {
  useEffect(() => {
    fetch(`${import.meta.env.VITE_KINDE_SITE_URL}/api/auth/setup`)
      .then((res) => res.json())
      .then(async (data) => {
        await Promise.all([
          clientStore.setSessionItem(StorageKeys.accessToken, data.accessToken),
          clientStore.setSessionItem(StorageKeys.idToken, data.idToken),
          clientStore.setSessionItem(StorageKeys.refreshToken, data.refreshToken),
        ]);
      });
  }, []);
  return (
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_ISSUER_URL}
      redirectUri={`${import.meta.env.VITE_KINDE_SITE_URL}/api/auth/callback`}
      store={clientStore}
      logoutUri={`${import.meta.env.VITE_KINDE_SITE_URL}/api/auth/logout`}
      {...props}
    >
      {children}
    </KindeProvider>
  );
};
