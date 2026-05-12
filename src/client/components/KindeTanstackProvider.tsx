import { KindeContext, KindeProvider } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";
import { storageSettings } from "@kinde-oss/kinde-auth-react/utils";
import { ClientOnly } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { KindeConfig } from "../../config";
import { useSessionSync } from "../hooks/internal/use-session-sync";
import { getClientSession } from "../store";

export type KindeTanstackProviderProps = {
  children: ReactNode;
  waitForInitialLoad?: boolean;
};

// Non-method fields from KindeContextProps (via State). Listed explicitly so the
// Proxy trap never intercepts them and returns a function instead of their real value.
const loadingBase = {
  isAuthenticated: false as const,
  isLoading: true as const,
  user: undefined,
  error: undefined,
};

// Returning undefined for thenable keys prevents loadingContext from being
// mistaken for a Promise by `await`, `Promise.resolve()`, or async utilities
// that probe for `.then` on values.
const THENABLE_KEYS = new Set(["then", "catch", "finally"]);

// Provided whenever KindeTanstackProvider is mounted but auth is not yet resolved
// (during SSR or client-side loading with waitForInitialLoad). Keeping this non-null
// means KindeContext is null *only* when no provider is present at all — so
// useKindeAuth can throw immediately without needing a typeof window check.
const loadingContext = new Proxy(loadingBase, {
  get(target, prop: PropertyKey) {
    if (typeof prop === "symbol") return Reflect.get(target, prop);
    if (THENABLE_KEYS.has(prop as string)) return undefined;
    if (prop in target) return target[prop as keyof typeof target];
    return async () => {
      throw new Error(
        `useKindeAuth: "${String(prop)}" was called before auth is ready — check isLoading before calling auth methods`
      );
    };
  },
}) as unknown as KindeContextProps;

// KindeContext is always non-null inside this provider (loading or not).
// null context means the component tree is outside KindeTanstackProvider entirely.
export const FallbackKindeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <KindeContext.Provider value={loadingContext}>{children}</KindeContext.Provider>
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

  useEffect(() => {
    storageSettings.onRefreshHandler = refreshHandler;
  }, [refreshHandler]);

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
