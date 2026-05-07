import { useContext } from "react";
import { KindeContext } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";

// During SSR or before KindeProvider mounts, context is null.
// Method stubs throw a clear error so consumers get an actionable message
// instead of a cryptic TypeError when they forget to check isLoading first.
const SSR_DEFAULTS = new Proxy(
  { isAuthenticated: false as const, isLoading: true as const, user: undefined },
  {
    get(target, prop: PropertyKey) {
      if (typeof prop === "symbol") return Reflect.get(target, prop);
      if (prop in target) return target[prop as keyof typeof target];
      return () => {
        throw new Error(
          `useKindeAuth: "${String(prop)}" was called before auth is ready — check isLoading before calling auth methods`
        );
      };
    },
  }
) as unknown as Omit<KindeContextProps, "register">;

export const useKindeAuth = (): Omit<KindeContextProps, "register"> => {
  const ctx = useContext(KindeContext);
  if (!ctx) return SSR_DEFAULTS;
  const { register: _register, ...rest } = ctx;
  return rest;
};
