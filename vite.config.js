import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: './', // relative paths for easy static hosting (GitHub Pages, Netlify, offline)
  server: {
    port: 3000,
    open: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
});
