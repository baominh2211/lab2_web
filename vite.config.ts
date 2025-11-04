import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsxFactory: 'createElement',
    jsxFragment: 'createFragment',
  },
  server: {
    port: 3000,
    open: true
  }
});