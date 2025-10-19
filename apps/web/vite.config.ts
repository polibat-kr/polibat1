import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/pages',
  publicDir: path.resolve(__dirname, 'public'),
  server: {
    port: 8000,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/scripts': path.resolve(__dirname, './src/scripts'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/pages/index.html'),
      },
    },
  },
});
