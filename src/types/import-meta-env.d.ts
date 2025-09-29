declare global {
  interface ImportMetaEnv {
    readonly VITE_KINDE_CLIENT_ID: string;
    readonly VITE_KINDE_ISSUER_URL: string;
    readonly VITE_KINDE_SITE_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
