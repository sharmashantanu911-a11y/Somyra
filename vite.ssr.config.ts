import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  ssr: {
    noExternal: true,
  },
  build: {
    ssr: 'src/ssr.tsx',
    outDir: '.ssr',
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        format: 'esm',
        entryFileNames: 'ssr.mjs',
      },
    },
  },
});
