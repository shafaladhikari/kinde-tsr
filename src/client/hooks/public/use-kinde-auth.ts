import { useContext } from "react";
import { KindeContext } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";

/**
 * Returns the Kinde auth context for the current user.
 *
 * **Behavioural divergence from the raw `@kinde-oss/kinde-auth-react` export:**
 *
 * | Scenario | Original export | This wrapper |
 * |---|---|---|
 * | SSR or `waitForInitialLoad` loading | Throws `"Oooops! useKindeAuth must be used within a KindeProvider"` | Returns `isLoading: true`, `isAuthenticated: false` via `KindeTanstackProvider`'s `loadingContext` |
 * | Missing `KindeTanstackProvider` on the client | Throws `"Oooops! useKindeAuth must be used within a KindeProvider"` | Throws `"useKindeAuth must be used within a KindeProvider"` |
 * | Method called before hydration (e.g. `getToken()`) | Throws synchronously | Returns a rejected Promise with `"…was called before auth is ready — check isLoading"` |
 *
 * SSR safety is enforced structurally: `KindeTanstackProvider` always provides a
 * non-null `loadingContext` during SSR and initial load, so `KindeContext` is null
 * only when the component tree is genuinely outside the provider.
 *
 * Always guard method calls with `if (!isLoading)` or `if (isAuthenticated)`
 * before invoking async methods.
 */
export const useKindeAuth = (): KindeContextProps => {
  const ctx = useContext(KindeContext);
  if (!ctx) throw new Error("useKindeAuth must be used within a KindeProvider");
  return ctx;
};
