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
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/api/ubd/search')) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

              if (req.method === 'OPTIONS') {
                res.statusCode = 200;
                res.end();
                return;
              }

              const handleSearch = async (body: any) => {
                const { section, unitId } = body || {};
                const id = String(unitId || '').trim();

                if (!id || !/^\d+$/.test(id)) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "దయచేసి సరైన Unit ID (అంకెలు మాత్రమే) నమోదు చేయండి." }));
                  return;
                }

                const isDeath = section === "Death" || section === "DEA" || String(section).toLowerCase().includes("death");
                const sectionName = isDeath ? "Death" : "Birth";

                const targetUrl = isDeath
                  ? `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDEA_Details.do?officeCode=${id}&status=A&rlb_type=3&pstcode=35&style=bluetheme`
                  : `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDetails.do?officeCode=${id}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;

                try {
                  const controller = new AbortController();
                  const timeout = setTimeout(() => controller.abort(), 8000);

                  const response = await fetch(targetUrl, {
                    signal: controller.signal,
                    headers: {
                      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                    }
                  });
                  clearTimeout(timeout);

                  if (!response.ok) {
                    res.statusCode = 502;
                    res.end(JSON.stringify({
                      error: `తెలంగాణ ప్రభుత్వ UBDMIS పోర్టల్ (ubdmis.telangana.gov.in) నుండి Error Code ${response.status} వచ్చింది. అధికారిక పోర్టల్ స్పందించడం లేదు.`,
                      officialUrl: targetUrl
                    }));
                    return;
                  }

                  const html = await response.text();
                  const cheerio = await import('cheerio');
                  const $ = cheerio.load(html);
                  const records: any[] = [];

                  $("table").each((_, table) => {
                    const rows = $(table).find("tr");
                    if (rows.length > 1) {
                      rows.each((rowIndex, row) => {
                        const cells = $(row).find("td, th").map((_, c) => $(c).text().trim()).get();
                        if (cells.length >= 3 && !cells[0].toLowerCase().includes("sl") && !cells[0].toLowerCase().includes("s.no") && !cells[0].toLowerCase().includes("total")) {
                          records.push({
                            sno: cells[0] || String(records.length + 1),
                            regNo: cells[1] || `REG-${id}-${records.length + 1}`,
                            name: cells[2] || "-",
                            eventDate: cells[3] || "-",
                            gender: cells[4] || "-",
                            status: cells[5] || "Approved / Active",
                            details: cells.slice(6).join(" ")
                          });
                        }
                      });
                    }
                  });

                  res.statusCode = 200;
                  res.end(JSON.stringify({
                    success: true,
                    section: sectionName,
                    unitId: id,
                    totalRecords: records.length,
                    records,
                    officialUrl: targetUrl
                  }));

                } catch (fetchErr: any) {
                  res.statusCode = 502;
                  res.end(JSON.stringify({
                    error: `తెలంగాణ ప్రభుత్వ UBDMIS పోర్టల్ (ubdmis.telangana.gov.in) తో నెట్‌వర్క్ కనెక్షన్ టైమౌట్ అయింది. అధికారిక సర్వర్ ఇంట్రానెట్/ఫైర్‌వాల్ సెక్యూరిటీ ఆంక్షల వల్ల నేరుగా డేటా రాలేదు. అధికారిక పేజీని నేరుగా ఓపెన్ చేసి చూడవచ్చు.`,
                    officialUrl: targetUrl
                  }));
                }
              };

              if ((req as any).body && typeof (req as any).body === 'object') {
                await handleSearch((req as any).body);
                return;
              }

              let bodyStr = '';
              let hasEnded = false;
              req.on('data', chunk => { bodyStr += chunk.toString(); });
              req.on('end', async () => {
                hasEnded = true;
                try {
                  const body = bodyStr ? JSON.parse(bodyStr) : {};
                  await handleSearch(body);
                } catch (jsonErr: any) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: "Invalid JSON Payload" }));
                }
              });

              // Fallback timeout if stream was consumed earlier
              setTimeout(async () => {
                if (!hasEnded) {
                  await handleSearch({});
                }
              }, 1000);
              return;
            }
            if (req.url === '/google46d0fa093843f771.html') {
              res.setHeader('Content-Type', 'text/html');
              res.end('google-site-verification: google46d0fa093843f771.html');
              return;
            }
            if (req.url && (req.url.startsWith('/api/v1/posts/create') || (req.url.startsWith('/api/v1/posts/feed') && req.method === 'POST'))) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
              res.end(JSON.stringify({
                status: "success",
                message: "పోస్ట్ విజయవంతంగా పబ్లిష్ చేయబడింది (Post successfully published)",
                postId: "dev_post_" + Date.now(),
                link: "https://www.e-vedhika.in/?tab=posts"
              }));
              return;
            }
            if (req.url && (req.url.startsWith('/api/v1/posts/feed') || req.url.startsWith('/api/posts/feed'))) {
              res.setHeader('Content-Type', 'application/json; charset=utf-8');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
            if (req.url && (req.url.startsWith('/admin/exe_ubd_live') || req.url.startsWith('/exe_ubd_live'))) {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
              if (req.method === 'OPTIONS') {
                res.statusCode = 200;
                res.end();
                return;
              }
              const urlObj = new URL(req.url, 'http://localhost:3000');
              const action = (urlObj.searchParams.get('action') || '').toLowerCase().trim();
              const format = (urlObj.searchParams.get('format') || '').toLowerCase().trim();

              if (action === 'check_update' || action === 'version') {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({
                  success: true,
                  name: 'E-VEDHIKA All Problems One Solution & UBD Deployment Tool',
                  appName: 'E-VEDHIKA All Problems One Solution & UBD Deployment Tool',
                  executableName: 'EVedhika_Setup_v1.0.7.exe',
                  currentVersion: 'v1.0.7',
                  latestVersion: 'v1.0.7',
                  versionCode: 10070,
                  releaseDate: '2026-10-17',
                  downloadUrl: 'https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_v1.0.7.exe',
                  githubRepo: 'https://github.com/RakeshKumardhawan/UBDTOOLS',
                  updateRequired: false,
                  silent: false,
                  releaseNotes: 'Enterprise v1.0.7: Instant Install Reporting, Zone 2 Automation, Telegram Live Heartbeat & Windows 7/8/10/11 Full Support.',
                  publisher: 'E-Vedhika.in (Rakesh Dhawan)',
                  telemetryRelayUrl: 'https://www.e-vedhika.in/admin/exe_ubd_live'
                }, null, 2));
                return;
              }

              if (action === 'get_news' || action === 'news' || action === 'posts_feed' || action === 'get_posts' || action === 'feed') {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                const announcements = [
                  {
                    id: 1,
                    title: 'IMPORTANT: v1.0.7 Update Released',
                    content: 'Brand new v1.0.7 release with Direct Telegram & Cloud Telemetry, immediate installation reporting, zero-manual auto-repair, and full Windows 7/8/10/11 compatibility.',
                    date: new Date().toISOString().slice(0, 10),
                    importance: 'High',
                    category: 'Software Update',
                    author: 'Rakesh Dhawan (Admin)'
                  },
                  {
                    id: 2,
                    title: 'UBD Portal Security Guidelines',
                    content: 'Ensure Edge IE Mode and Zone 2 Trusted Sites configuration are kept verified. AutoRepair Guardian automatically secures all policies.',
                    date: new Date().toISOString().slice(0, 10),
                    importance: 'Medium',
                    category: 'Security',
                    author: 'E-Vedhika Security Desk'
                  }
                ];
                res.end(JSON.stringify({
                  success: true,
                  status: 'ACTIVE_FEED',
                  endpoint: '/api/v1/posts/feed',
                  count: announcements.length,
                  posts: announcements,
                  feed: announcements,
                  announcements: announcements,
                  news: announcements
                }, null, 2));
                return;
              }

              if (action === 'export' || format === 'json') {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({
                  success: true,
                  count: 0,
                  logs: []
                }, null, 2));
                return;
              }

              if (urlObj.searchParams.get('clear') === '1') {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ success: true, message: 'Logs cleared successfully' }));
                return;
              }

              if (req.method === 'POST') {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({
                  success: true,
                  message: 'Consolidated health report logged successfully!',
                  receivedAt: new Date().toISOString()
                }));
                return;
              }
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
      strictPort: true,
      allowedHosts: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify - file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true' ? { overlay: false } : false,
    },
  };
});
