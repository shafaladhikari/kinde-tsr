import { KindeContext } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useKindeAuth } from "./use-kinde-auth";

function createMockKindeContext(
  overrides: Partial<KindeContextProps> = {}
): Partial<KindeContextProps> {
  return {
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    getIdToken: vi.fn(),
    getToken: vi.fn(),
    getAccessToken: vi.fn(),
    getClaim: vi.fn(),
    getClaims: vi.fn(),
    getOrganization: vi.fn(),
    getCurrentOrganization: vi.fn(),
    getFlag: vi.fn(),
    getUserProfile: vi.fn(),
    getPermission: vi.fn(),
    getPermissions: vi.fn(),
    getUserOrganizations: vi.fn(),
    getRoles: vi.fn(),
    refreshToken: vi.fn(),
    generatePortalUrl: vi.fn(),
    ...overrides,
  };
}

const mockCtx = createMockKindeContext({
  isAuthenticated: true,
  user: { id: "user_1", email: "test@example.com", givenName: "Test", familyName: "User", picture: undefined },
});

const wrapper = (value: Partial<KindeContextProps> | null) =>
  ({ children }: { children: ReactNode }) => (
    <KindeContext.Provider value={value as KindeContextProps}>{children}</KindeContext.Provider>
  );

describe("useKindeAuth", () => {
  describe("when context is null (missing KindeTanstackProvider)", () => {
    it("throws a missing provider error", () => {
      expect(() =>
        renderHook(() => useKindeAuth(), { wrapper: wrapper(null) })
      ).toThrow("useKindeAuth must be used within a KindeProvider");
    });
  });

  describe("when context is loading (SSR or waitForInitialLoad — provided by KindeTanstackProvider)", () => {
    it("returns isLoading: true and isAuthenticated: false", () => {
      const { result } = renderHook(() => useKindeAuth(), {
        wrapper: wrapper(createMockKindeContext({ isLoading: true, isAuthenticated: false })),
      });
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("when context has a value", () => {
    it("returns auth state from context", () => {
      const { result } = renderHook(() => useKindeAuth(), { wrapper: wrapper(mockCtx) });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user?.email).toBe("test@example.com");
    });

    it("passes through login, logout, and register", () => {
      const { result } = renderHook(() => useKindeAuth(), { wrapper: wrapper(mockCtx) });
      expect(result.current.login).toBe(mockCtx.login);
      expect(result.current.logout).toBe(mockCtx.logout);
      expect(result.current.register).toBe(mockCtx.register);
    });
  });
});
