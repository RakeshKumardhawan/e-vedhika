/**
 * Cloudflare Worker for E-Vedhika Portal (Firebase Load Balancer & Edge Cache)
 * Purpose: Drastically reduce Firebase & Origin server loads by caching static assets,
 * Firestore read queries, and read-heavy API responses at Cloudflare Edge nodes globally,
 * while routing UBD Telemetry & selective reads/writes efficiently.
 */

const CACHE_TTL_SECONDS = 60; // 1 minute edge cache for read APIs to cut Firestore read spikes

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // CORS Preflight handling for Edge APIs & Telemetry
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": request.headers.get("Origin") || "https://www.e-vedhika.in",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Admin-Token, X-EVedhika-Client",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    // 1. UBD OTA VERSION CHECK AT EDGE (Zero Firebase Load)
    if (
      (url.pathname === "/admin/ubd_monitoring" || url.pathname === "/admin/ubd_monitoring.php" || url.pathname === "/api/telemetry") &&
      (url.searchParams.get("action") === "ota_check" || url.searchParams.get("action") === "check_update" || url.searchParams.get("action") === "version")
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          name: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
          appName: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
          executableName: "EVedhika_Setup_v1.0.9.exe",
          currentVersion: "v1.0.9",
          latestVersion: "v1.0.9",
          latestResourceBuild: "2026.11.11.R3",
          resourceBuild: "2026.11.11.R3",
          manifestVersion: "2026.11.11.R3",
          versionCode: 10090,
          releaseDate: "2026-11-11",
          downloadUrl: "https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_v1.0.9.exe",
          githubRepo: "https://github.com/RakeshKumardhawan/UBDTOOLS",
          updateRequired: false,
          silent: false,
          sha256: "4d54ba00f532b15793a70e0d4c03ca03d81b1cc23f0e6a1fa0cba4860f0720c9",
          signatureStatus: "Verified (E-Vedhika Authenticode)",
          telemetryRelayUrl: "https://www.e-vedhika.in/admin/ubd_monitoring"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=60",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // 2. DYNAMIC MUTATIONS & AUTHENTICATED CALLS -> Bypass Cache Completely
    const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const hasAuthHeader =
      request.headers.has("Authorization") ||
      request.headers.has("X-Admin-Auth") ||
      request.headers.has("X-Admin-Key") ||
      request.headers.has("X-Admin-Token");
    const isBypassPath =
      url.pathname.startsWith("/api/admin/") ||
      url.pathname.startsWith("/api/upload") ||
      url.pathname.startsWith("/api/chat") ||
      url.pathname.startsWith("/api/comments") ||
      url.pathname.startsWith("/api/like") ||
      url.pathname.includes("/auth/");

    if (isMutation || hasAuthHeader || isBypassPath) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return fetch(request, {
        cf: {
          cacheEverything: false
        }
      });
    }

    // 3. READ-HEAVY API ENDPOINTS -> Cache at Cloudflare Edge to reduce Firebase read load
    if (url.pathname.startsWith("/api/")) {
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);

      let response = await cache.match(cacheKey);
      if (!response) {
        response = env && env.ASSETS ? await env.ASSETS.fetch(request) : await fetch(request);

        if (response.status === 200) {
          const headers = new Headers(response.headers);
          headers.set("Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`);
          headers.set("X-EVedhika-Cache", "HIT-CLOUDFLARE-EDGE");

          response = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
          });

          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
      }
      return response;
    }

    // 4. STATIC ASSETS (.js, .css, .png, .jpg, .svg, .exe, .woff2, etc.)
    const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|exe|msi|zip|woff2|ttf|eot)$/i.test(url.pathname);
    if (isStaticAsset) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return fetch(request, {
        cf: {
          cacheEverything: true,
          cacheTtl: 31536000,
          edgeCacheTtl: 31536000
        }
      });
    }

    // 5. HTML / PAGE ROUTING -> Serve from static assets or origin
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return fetch(request);
  }
};
