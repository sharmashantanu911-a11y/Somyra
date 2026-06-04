import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      sourcemap: false,
      cssMinify: 'lightningcss',
      modulePreload: {
        polyfill: false,
        resolveDependencies: (filename, deps, { hostId, hostType }) => {
          // Only filter modulepreload for the index.html entry, not for lazy chunks
          if (hostType !== 'html') return deps;
          return deps.filter((dep) => {
            // Don't preload supabase on the landing page (saves 50KB gzip)
            if (dep.includes('vendor-supabase')) return false;
            return true;
          });
        }
      },
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
            manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-dom/client'],
            'router': ['react-router-dom'],
            'vendor-motion': ['motion'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-lucide': ['lucide-react'],
          }
        }
      }
    },
  };
});
