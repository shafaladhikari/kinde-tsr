import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import type { ReactNode } from 'react';
import { KindeConfig } from '../config';
import { getClientSession } from './store';
import { useSessionSync } from './use-store-sync';

export type KindeTanstackProviderProps = {
  children: ReactNode;
};

export const KindeTanstackProvider = ({ children, ...props }: KindeTanstackProviderProps) => {
  const { loading } = useSessionSync();

  if (loading) {
    return null;
  }

  return (
    <KindeProvider
      clientId={KindeConfig.env.KINDE_CLIENT_ID}
      domain={KindeConfig.env.KINDE_ISSUER_URL}
      redirectUri={KindeConfig.callbackUrl}
      store={getClientSession()}
      logoutUri={KindeConfig.logoutUrl}
      {...props}
    >
      {children}
    </KindeProvider>
  );
};
