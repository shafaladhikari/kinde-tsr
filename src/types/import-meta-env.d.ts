declare global {
  interface ImportMetaEnv {
    readonly VITE_KINDE_CLIENT_ID: string;
    readonly VITE_KINDE_ISSUER_URL: string;
    readonly VITE_KINDE_REDIRECT_URI: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
