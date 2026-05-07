import { useContext } from "react";
import { KindeContext } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";

// During SSR or before KindeProvider mounts, context is null.
// isLoading: true prevents consumers from calling methods before they're available.
const SSR_DEFAULTS = {
  isAuthenticated: false,
  isLoading: true,
  user: undefined,
} as unknown as Omit<KindeContextProps, "register">;

export const useKindeAuth = (): Omit<KindeContextProps, "register"> => {
  const ctx = useContext(KindeContext);
  if (!ctx) return SSR_DEFAULTS;
  const { register: _register, ...rest } = ctx;
  return rest;
};
