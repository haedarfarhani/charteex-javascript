import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SmartChart',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        entryFileNames: 'index.js',
        chunkFileNames: 'index.js',
        assetFileNames: 'index.js'
      }
    },
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: '/demo/index.html'
  }
});