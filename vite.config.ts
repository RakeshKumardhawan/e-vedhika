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
        manifestFilename: 'manifest.json',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'ev-logo-v2.png'],
        manifest: {
          name: 'E-Vedhika',
          short_name: 'E-Vedhika',
          description: 'E-Vedhika: Comprehensive Digital Portal for Panchayat Secretaries - All Problems One Solution',
          theme_color: '#0d3b66',
          background_color: '#0d3b66',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
          orientation: 'any',
          start_url: '/',
          scope: '/',
          lang: 'te',
          dir: 'ltr',
          categories: ['productivity', 'government', 'utilities', 'business'],
          icons: [
            {
              src: '/ev-logo-v2.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/ev-logo-v2.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/ev-logo-v2.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/ev-logo-v2.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Dashboard / హోమ్‌పేజీ',
              short_name: 'Home',
              description: 'Go to E-Vedhika Main Dashboard',
              url: '/',
              icons: [{ src: '/ev-logo-v2.png', sizes: '192x192' }]
            },
            {
              name: 'Posts / తాజా సమాచారం',
              short_name: 'Posts',
              description: 'View Latest Village & Panchayat Updates',
              url: '/?tab=posts',
              icons: [{ src: '/ev-logo-v2.png', sizes: '192x192' }]
            },
            {
              name: 'GOs & Formats / జీవోలు & ఫార్మాట్‌లు',
              short_name: 'GOs',
              description: 'Access Government Orders and Registers',
              url: '/?tab=gos_formats',
              icons: [{ src: '/ev-logo-v2.png', sizes: '192x192' }]
            },
            {
              name: 'Media Vault / మీడియా వాల్ట్',
              short_name: 'Vault',
              description: 'Access Media Vault & Resources',
              url: '/?tab=vault',
              icons: [{ src: '/ev-logo-v2.png', sizes: '192x192' }]
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallbackDenylist: [/^\/api/],
          maximumFileSizeToCacheInBytes: 15 * 1024 * 1024 // 15MiB
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
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true' ? { overlay: false } : false,
    },
  };
});
