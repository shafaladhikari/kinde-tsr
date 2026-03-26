import { KindeContext, KindeProvider } from '@kinde-oss/kinde-auth-react';
import { storageSettings } from '@kinde-oss/kinde-auth-react/utils';
import { ClientOnly } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { KindeConfig } from '../../config';
import { useSessionSync } from '../hooks/internal/use-session-sync';
import { getClientSession } from '../store';

export type KindeTanstackProviderProps = {
  children: ReactNode;
  waitForInitialLoad?: boolean;
};

const FallbackKindeContextProvider = ({ children }: { children: ReactNode }) => {
  return <KindeContext.Provider value={null}>{children}</KindeContext.Provider>;
};

export const KindeTanstackProvider = ({ children, waitForInitialLoad }: KindeTanstackProviderProps) => {
  return (
    <ClientOnly fallback={<FallbackKindeContextProvider>{children}</FallbackKindeContextProvider>}>
      <KindeProviderClient waitForInitialLoad={waitForInitialLoad}>{children}</KindeProviderClient>
    </ClientOnly>
  );
};

const KindeProviderClient = ({ children, waitForInitialLoad }: KindeTanstackProviderProps) => {
  const { loading, refreshHandler } = useSessionSync();
  storageSettings.onRefreshHandler = refreshHandler;

  if (loading && waitForInitialLoad) {
    return <FallbackKindeContextProvider>{children}</FallbackKindeContextProvider>;
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
