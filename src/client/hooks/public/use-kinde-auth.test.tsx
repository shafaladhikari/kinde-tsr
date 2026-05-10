import { KindeContext } from "@kinde-oss/kinde-auth-react";
import type { KindeContextProps } from "@kinde-oss/kinde-auth-react";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { useKindeAuth } from "./use-kinde-auth";

const mockCtx: KindeContextProps = {
  isAuthenticated: true,
  isLoading: false,
  user: { id: "user_1", email: "test@example.com", givenName: "Test", familyName: "User", picture: null },
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
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
} as unknown as KindeContextProps;

const nullContextWrapper = ({ children }: { children: ReactNode }) => (
  <KindeContext.Provider value={null}>{children}</KindeContext.Provider>
);

const realContextWrapper = ({ children }: { children: ReactNode }) => (
  <KindeContext.Provider value={mockCtx}>{children}</KindeContext.Provider>
);

describe("useKindeAuth", () => {
  describe("when context is null on the client (missing KindeTanstackProvider)", () => {
    it("throws a missing provider error", () => {
      expect(() =>
        renderHook(() => useKindeAuth(), { wrapper: nullContextWrapper })
      ).toThrow("useKindeAuth must be used within a KindeProvider");
    });
  });

  describe("when context has a value", () => {
    it("returns auth state from context", () => {
      const { result } = renderHook(() => useKindeAuth(), { wrapper: realContextWrapper });
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user?.email).toBe("test@example.com");
    });

    it("passes through login, logout, and register", () => {
      const { result } = renderHook(() => useKindeAuth(), { wrapper: realContextWrapper });
      expect(result.current.login).toBe(mockCtx.login);
      expect(result.current.logout).toBe(mockCtx.logout);
      expect(result.current.register).toBe(mockCtx.register);
    });
  });
});
