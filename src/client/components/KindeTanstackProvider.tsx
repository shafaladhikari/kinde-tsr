import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { ClientOnly } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { KindeConfig } from '../../config';
import { getClientSession } from '../store';
import { useSessionSync } from '../use-store-sync';

export type KindeTanstackProviderProps = {
  children: ReactNode;
  waitForInitialLoad?: boolean;
};

export const KindeTanstackProvider = ({ children, waitForInitialLoad }: KindeTanstackProviderProps) => {
  return (
    <ClientOnly>
      <KindeProviderClient waitForInitialLoad={waitForInitialLoad}>{children}</KindeProviderClient>
    </ClientOnly>
  );
};

const KindeProviderClient = ({ children, waitForInitialLoad }: KindeTanstackProviderProps) => {
  const { loading } = useSessionSync();

  if (loading && waitForInitialLoad) {
    return null;
  }

  return (
    <KindeProvider
      clientId={KindeConfig.env.KINDE_CLIENT_ID}
      domain={KindeConfig.env.KINDE_ISSUER_URL}
      redirectUri={KindeConfig.callbackUrl}
      store={getClientSession()}
      logoutUri={KindeConfig.logoutUrl}
      forceChildrenRender
    >
      {children}
    </KindeProvider>
  );
};
