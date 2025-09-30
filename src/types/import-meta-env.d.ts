declare global {
  interface ImportMetaEnv {
    [key: `VITE_${string}`]: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
