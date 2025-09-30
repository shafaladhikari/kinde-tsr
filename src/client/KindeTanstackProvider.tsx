import { type ReactNode } from 'react';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { getClientSession } from './store';
import { useSessionSync } from './use-store-sync';
import { KindeConfig } from '../config';

export type KindeTanstackProviderProps = {
  children: ReactNode;
};

export const KindeTanstackProvider = ({ children, ...props }: KindeTanstackProviderProps) => {
  const { loading } = useSessionSync();

  console.log('KindeConfig', KindeConfig);

  if (loading) {
    return null;
  }

  return (
    <KindeProvider
      clientId={KindeConfig.KINDE_CLIENT_ID}
      domain={KindeConfig.KINDE_ISSUER_URL}
      redirectUri={KindeConfig.callbackUrl}
      store={getClientSession()}
      logoutUri={KindeConfig.logoutUrl}
      {...props}
    >
      {children}
    </KindeProvider>
  );
};

