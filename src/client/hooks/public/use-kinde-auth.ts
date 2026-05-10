import { useContext } from "react";
import { KindeContext } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";

/**
 * Non-method fields from KindeContextProps (via State). Listed explicitly so
 * the Proxy trap never intercepts them and returns a function instead of their
 * real value (e.g. `error` is `string | undefined`, not a function).
 */
const ssrBase = {
  isAuthenticated: false as const,
  isLoading: true as const,
  user: undefined,
  error: undefined,
};

/**
 * Safe defaults returned during SSR (when `typeof window === "undefined"`).
 *
 * Data fields (`isAuthenticated`, `isLoading`, `user`, `error`) are served
 * directly from `ssrBase`. Any method call (e.g. `getToken()`) returns a
 * rejected Promise with an actionable error instead of throwing synchronously,
 * so Promise chains (`.catch`) handle it correctly.
 *
 * Symbol-keyed properties (used internally by JS) are forwarded to `ssrBase`
 * via `Reflect.get` so serialisation and iteration behave normally.
 */
// Returning undefined for thenable keys prevents SSR_DEFAULTS from being
// mistaken for a Promise by `await`, `Promise.resolve()`, or async utilities
// that probe for `.then` on values.
const THENABLE_KEYS = new Set(["then", "catch", "finally"]);

const SSR_DEFAULTS = new Proxy(ssrBase, {
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

/**
 * Returns the Kinde auth context for the current user.
 *
 * **Behavioural divergence from the raw `@kinde-oss/kinde-auth-react` export:**
 *
 * | Scenario | Original export | This wrapper |
 * |---|---|---|
 * | Null context during SSR (`typeof window === "undefined"`) | Throws `"Oooops! useKindeAuth must be used within a KindeProvider"` | Returns `SSR_DEFAULTS` — `isLoading: true`, `isAuthenticated: false` |
 * | Null context on the client (missing `KindeTanstackProvider`) | Throws `"Oooops! useKindeAuth must be used within a KindeProvider"` | Throws `"useKindeAuth must be used within a KindeProvider"` |
 * | Method called before hydration (e.g. `getToken()`) | Throws synchronously at the `useContext` call site | Returns a rejected Promise with `"…was called before auth is ready — check isLoading"` |
 *
 * The SSR behaviour change is intentional: TanStack Start renders route
 * components on the server, so the hook must not throw during SSR.
 * Consumers should always guard method calls with `if (!isLoading)` or
 * `if (isAuthenticated)` before invoking async methods.
 */
export const useKindeAuth = (): KindeContextProps => {
  const ctx = useContext(KindeContext);
  if (!ctx) {
    if (typeof window === "undefined") {
      return SSR_DEFAULTS;
    }
    // Client-side null context means KindeTanstackProvider is missing
    throw new Error("useKindeAuth must be used within a KindeProvider");
  }
  return ctx;
};
