import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/**/*.{ts,tsx,js,jsx}', '!./src/**/*.test.{ts,tsx}'],
  bundle: true,
  clean: true,
  minify: false,
  sourcemap: true,
  treeshake: true,
  format: 'esm',
  outDir: './dist',
  dts: true,
  esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: 'js' })],
  external: [
    'react',
    'react-native',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    'react-router-dom',
    '@tanstack/react-router',
    '@tanstack/react-start',
    '@tanstack/start-server-core',
    '@tanstack/router-core',
    'node:stream',
    'node:stream/web',
    'node:async_hooks',
    'node:fs',
    'node:path',
  ],
});
