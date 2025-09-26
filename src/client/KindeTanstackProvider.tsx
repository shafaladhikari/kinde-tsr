import { KindeProvider } from "@kinde-oss/kinde-auth-react";

export const KindeTanstackProvider = ({ children }: { children: React.ReactNode }) => {
  console.log('kinde client id', import.meta.env.VITE_KINDE_CLIENT_ID);
  return (
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_ISSUER_URL}
      redirectUri={`${import.meta.env.VITE_KINDE_REDIRECT_URI}/api/auth/callback`}
    >
      {children}
    </KindeProvider>
  )
};