// @vitest-environment node
// typeof window === "undefined" in this environment, matching real SSR conditions.
import { describe, expect, it, vi } from "vitest";

// Mock useContext to return null — simulating no KindeProvider during SSR.
// vi.mock is hoisted above imports by vitest, so useKindeAuth gets the mock.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, useContext: () => null };
});

const { useKindeAuth } = await import("./use-kinde-auth");

describe("useKindeAuth (SSR — window is undefined)", () => {
  it("returns unauthenticated initial state", () => {
    const result = useKindeAuth();
    expect(result.isAuthenticated).toBe(false);
    expect(result.isLoading).toBe(true);
    expect(result.user).toBeUndefined();
  });

  it("returns undefined for data fields — not a function", () => {
    const result = useKindeAuth();
    expect(result.error).toBeUndefined();
    expect(typeof result.error).toBe("undefined");
  });

  it("rejects with a clear error when a method is called before auth is ready", async () => {
    const result = useKindeAuth();
    await expect(result.getToken()).rejects.toThrow(
      'useKindeAuth: "getToken" was called before auth is ready — check isLoading before calling auth methods'
    );
  });
});
