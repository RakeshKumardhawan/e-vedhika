import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/',
    plugins: [
      react(), 
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks: true
      }),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'ev-logo-v2.png'],
        manifest: {
          id: '/',
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
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
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
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: '/pwa-512x512.png',
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
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/sitemap\.txt$/, /^\/robots\.txt$/, /^\/ads\.txt$/],
          maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25MiB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /\.(?:js|css)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
              },
            },
          ],
        },
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
            if (req.url && (req.url.startsWith('/api/v1/posts/feed') || req.url.startsWith('/api/posts/feed'))) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
              res.end(JSON.stringify({
                status: "success",
                portal: "E-Vedhika Digital Portal",
                website: "https://www.e-vedhika.in",
                total_posts: 1,
                last_updated: new Date().toISOString(),
                posts: [
                  {
                    id: "feed_1",
                    title: "E-Vedhika Digital Administration Portal Active",
                    category: "UPDATES",
                    content: "ఈ-వేదిక (E-Vedhika) - All Problems One Solution. తెలంగాణ & ఏపీ పంచాయతీ ఆపరేటర్లు మరియు మండల ఆపరేటర్ల పోర్టల్.",
                    author: "Admin",
                    created_at: new Date().toISOString(),
                    image_url: "https://www.e-vedhika.in/ev-logo-v2.png",
                    file_url: null,
                    pinned: true,
                    link: "https://www.e-vedhika.in/"
                  }
                ]
              }));
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
      target: 'esnext',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'vendor-ui': ['lucide-react', 'sweetalert2', 'motion/react'],
            'vendor-charts': ['recharts'],
            'vendor-excel': ['xlsx'],
            'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas'],
            'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'lucide-react',
        'recharts',
        'motion/react',
      ],
    },
    define: {
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true' ? { overlay: false } : false,
    },
  };
});
