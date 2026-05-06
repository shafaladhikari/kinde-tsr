import { KindeContext, KindeProvider } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";
import { storageSettings } from "@kinde-oss/kinde-auth-react/utils";
import { ClientOnly } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { KindeConfig } from "../../config";
import { useSessionSync } from "../hooks/internal/use-session-sync";
import { getClientSession } from "../store";

export type KindeTanstackProviderProps = {
  children: ReactNode;
  waitForInitialLoad?: boolean;
};

// Provided during SSR and while the client session is loading.
// Must be non-null so useKindeAuth() doesn't throw "must be used within a KindeProvider".
// isLoading: true signals to consumers that auth state is not yet resolved.
// "as unknown as KindeContextProps" is intentional: the no-op stubs can't satisfy
// the full parameter signatures of methods like refreshToken, but that's fine for SSR.
const ssrFallbackContext = {
  isAuthenticated: false,
  isLoading: true,
  user: undefined,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  getIdToken: async () => undefined,
  getToken: async () => undefined,
  getAccessToken: async () => undefined,
  getClaim: async () => null,
  getClaims: async () => null,
  getOrganization: async () => null,
  getCurrentOrganization: async () => null,
  getFlag: async () => null,
  getUserProfile: async () => null,
  getPermission: async () => ({
    permissionKey: "",
    orgCode: null,
    isGranted: false,
  }),
  getPermissions: async () => ({ orgCode: null, permissions: [] }),
  getUserOrganizations: async () => null,
  getRoles: async () => [],
  refreshToken: async () => ({ success: false as const }),
  generatePortalUrl: async () => ({ url: new URL("about:blank") }),
} as unknown as KindeContextProps;

const FallbackKindeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <KindeContext.Provider value={ssrFallbackContext}>
      {children}
    </KindeContext.Provider>
  );
};

export const KindeTanstackProvider = ({
  children,
  waitForInitialLoad,
}: KindeTanstackProviderProps) => {
  return (
    <ClientOnly
      fallback={
        <FallbackKindeContextProvider>{children}</FallbackKindeContextProvider>
      }
    >
      <KindeProviderClient waitForInitialLoad={waitForInitialLoad}>
        {children}
      </KindeProviderClient>
    </ClientOnly>
  );
};

const KindeProviderClient = ({
  children,
  waitForInitialLoad,
}: KindeTanstackProviderProps) => {
  const { loading, refreshHandler } = useSessionSync();
  storageSettings.onRefreshHandler = refreshHandler;

  if (loading && waitForInitialLoad) {
    return (
      <FallbackKindeContextProvider>{children}</FallbackKindeContextProvider>
    );
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
