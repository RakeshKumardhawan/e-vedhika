import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '',
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'E-Vedhika Portal',
          short_name: 'E-Vedhika',
          description: 'E-Vedhika All problems one solution',
          theme_color: '#0d3b66',
          background_color: '#0d3b66',
          display: 'standalone',
          orientation: 'portrait',
          icons: [
            {
              src: 'ev-logo-v2.svg',
              sizes: 'any',
              type: 'image/svg+xml',
              purpose: 'any maskable'
            },
            {
              src: 'ev-logo-v2.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'ev-logo-v2.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
        
          navigateFallbackDenylist: [/^\/api/],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024 // 10MiB
        }
      }),
      {
        name: 'google-verification',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/google46d0fa093843f771.html') {
              res.setHeader('Content-Type', 'text/html');
              res.end('google-site-verification: google46d0fa093843f771.html');
              return;
            }
            next();
          });
        }
      }
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
