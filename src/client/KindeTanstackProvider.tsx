import { KindeProvider } from "@kinde-oss/kinde-auth-react";
import { useEffect } from "react";
import { clientStore } from "./store";

export default function KindeTanstackProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch('/api/auth/setup')
  }, [])

  return (
    <KindeProvider
      clientId={import.meta.env.VITE_KINDE_CLIENT_ID}
      domain={import.meta.env.VITE_KINDE_ISSUER_URL}
      redirectUri={`${import.meta.env.VITE_KINDE_REDIRECT_URI}/api/auth/callback`}
      store={clientStore}
    >
      {children}
    </KindeProvider>
  )
};