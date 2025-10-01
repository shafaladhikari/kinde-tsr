# Kinde Auth SDK for TanStack Start
Official Kinde SDK for [TanStack Start](https://tanstack.com/start) - a full-stack React framework built on TanStack Router.

## Installation
```bash
nypm add @kinde/tsr
```

## Prerequisites
- A [Kinde](https://kinde.com/) account
- TanStack Start project (requires `@tanstack/react-router` and `@tanstack/react-start` v1.132.25 or higher)

## Environment Variables
Create a `.env` file in your project root with the following variables:
```env
VITE_KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
VITE_KINDE_ISSUER_URL=https://your_subdomain.kinde.com
VITE_KINDE_SITE_URL=http://localhost:3000
```
> **Note:** Variables prefixed with `VITE_` are exposed to the client-side. The `KINDE_CLIENT_SECRET` should only be used on the server-side.

### Getting your Kinde credentials

1. Go to your [Kinde dashboard](https://app.kinde.com/)
2. Navigate to **Settings > Applications**
3. Select your application or create a new one
4. Copy your credentials:
-  **Client ID** → `VITE_KINDE_CLIENT_ID`
-  **Client secret** → `KINDE_CLIENT_SECRET`
-  **Domain** → `VITE_KINDE_ISSUER_URL`
5. Set your **Site URL** (e.g., `http://localhost:3000` for development) → `VITE_KINDE_SITE_URL`
6. Configure your callback URLs in Kinde:
- Allowed callback URLs: `http://localhost:3000/api/auth/callback`
- Allowed logout redirect URLs: `http://localhost:3000`

## Setup
### 1. Wrap your application with KindeTanstackProvider
In your root route file (typically `src/routes/__root.tsx`), wrap your application with the `KindeTanstackProvider`:
```tsx
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { KindeTanstackProvider } from "@kinde/kinde-auth-tanstack-start";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en">
      <head>{/* Your head content */}</head>
      <body>
        <KindeTanstackProvider>
          <Outlet />
        </KindeTanstackProvider>
      </body>
    </html>
  );
}
```
### 2. Create auth handler route
Create a catch-all auth route at `src/routes/api.auth.$.ts`:

```tsx
import { kindeAuthHandler } from "@kinde/kinde-auth-tanstack-start/server";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => kindeAuthHandler(request),
    },
  },
});
```

This route handles all authentication flows including:
-  `/api/auth/login`
-  `/api/auth/logout`
-  `/api/auth/callback`
-  `/api/auth/register`
-  `/api/auth/create-org`

## Usage
### Client-side authentication
Use the `useKindeAuth` hook to access authentication state and user information:
```tsx
import {
  useKindeAuth,
  LoginLink,
  LogoutLink,
} from "@kinde/kinde-auth-tanstack-start";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useKindeAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.givenName}!</p>

          <LogoutLink>Logout</LogoutLink>
        </>
      ) : (
        <LoginLink>Sign in</LoginLink>
      )}
    </div>
  );
}
```

### Server-side authentication
Use server functions to access user data in loaders:

```tsx
import { createFileRoute } from "@tanstack/react-router";

import {
  getUserProfile,
  isAuthenticated,
} from "@kinde/kinde-auth-tanstack-start/server";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,

  loader: async () => {
    const user = await getUserProfile();

    const isAuthed = await isAuthenticated();

    return {
      user,

      isAuthed,
    };
  },
});

function Dashboard() {
  const { user } = Route.useLoaderData();

  return <div>Welcome, {user?.givenName}!</div>;
}
```

### Protected routes
Protect routes by combining `KindeAuthMiddleware` with the `protect` utility:
```tsx
import { createFileRoute } from "@tanstack/react-router";

import {
  KindeAuthMiddleware,
  protect,
  getUserProfile,
} from "@kinde/kinde-auth-tanstack-start/server";

export const Route = createFileRoute("/protected")({
  component: ProtectedPage,

  server: {
    middleware: [KindeAuthMiddleware], // Ensures user is logged in and token is refreshed
  },

  beforeLoad: () =>
    protect({
      has: {
        permissions: ["read:protected"], // Required permissions

        // roles: ['admin'], // Optional: required roles

        // featureFlags: ['new-dashboard'] // Optional: required feature flags
        // billingEntitlements: ['pro'] // Optional: required billing entitlements
      },

      redirectTo: "/", // Redirect destination if access is denied, defaults to KINDE_SITE_URL
    }),

  loader: async () => {
    const user = await getUserProfile();

    return { user };
  },
});

function ProtectedPage() {
  const { user } = Route.useLoaderData();

  return <div>Protected content for {user?.givenName}</div>;
}
```
The `protect` utility checks if the user has the required permissions/roles/feature flags/billing entitlements and redirects them if they don't have access.

## Development
For local development, ensure your environment variables are set correctly:
```env
VITE_KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
VITE_KINDE_ISSUER_URL=https://your_subdomain.kinde.com
VITE_KINDE_SITE_URL=http://localhost:3000
```
Make sure to configure the callback URLs in your Kinde dashboard to match your local development URL.

## Production
When deploying to production:
1. Update your environment variables with production values
2. Update `VITE_KINDE_SITE_URL` to your production domain
3. Add your production domain to the allowed callback URLs in Kinde dashboard:
- Allowed callback URLs: `https://yourdomain.com/api/auth/callback`
- Allowed logout redirect URLs: `https://yourdomain.com`

## Resources
- [Kinde Documentation](https://kinde.com/docs/)
- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)

## Support
For issues and questions:

- [GitHub Issues](https://github.com/kinde-oss/kinde-auth-tsr/issues)
- [Kinde Support](https://kinde.com/support/)
