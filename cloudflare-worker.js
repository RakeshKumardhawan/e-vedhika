/**
 * Cloudflare Worker for E-Vedhika Portal
 * Purpose: Drastically reduce Firebase & Origin server loads by caching static assets
 * and read-heavy API responses at Cloudflare Edge nodes globally.
 */

const CACHE_TTL_SECONDS = 60; // 1 minute cache for read APIs to cut Firestore read spikes

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();

    // 1. DYNAMIC MUTATIONS & AUTHENTICATED CALLS -> Bypass Cache Completely
    const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const hasAuthHeader = request.headers.has("Authorization") || request.headers.has("X-Admin-Auth") || request.headers.has("X-Admin-Key");
    const isBypassPath = 
      url.pathname.startsWith("/api/admin/") ||
      url.pathname.startsWith("/api/upload") ||
      url.pathname.startsWith("/api/chat") ||
      url.pathname.startsWith("/api/comments") ||
      url.pathname.startsWith("/api/like") ||
      url.pathname.includes("/auth/");

    if (isMutation || hasAuthHeader || isBypassPath) {
      // Pass directly to origin without caching
      return fetch(request, {
        cf: {
          cacheEverything: false
        }
      });
    }

    // 2. READ-HEAVY API ENDPOINTS (e.g. GET /api/v1/posts/feed, GET /api/updates)
    if (url.pathname.startsWith("/api/")) {
      const cache = caches.default;
      const cacheKey = new Request(url.toString(), request);

      // Check Cloudflare Edge Cache first
      let response = await cache.match(cacheKey);

      if (!response) {
        // Fetch fresh data from origin
        response = await fetch(request);

        // Only cache HTTP 200 OK responses
        if (response.status === 200) {
          const headers = new Headers(response.headers);
          headers.set("Cache-Control", `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`);
          headers.set("X-EVedhika-Cache", "HIT-CLOUDFLARE-EDGE");

          response = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: headers
          });

          // Store in Cloudflare Edge Cache asynchronously
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
      }

      return response;
    }

    // 3. STATIC ASSETS (.js, .css, .png, .jpg, .svg, .exe, .woff2, etc.)
    const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|exe|msi|zip|woff2|ttf|eot)$/i.test(url.pathname);

    if (isStaticAsset) {
      return fetch(request, {
        cf: {
          cacheEverything: true,
          cacheTtl: 31536000, // 1 year
          edgeCacheTtl: 31536000
        }
      });
    }

    // 4. HTML / PAGE ROUTING -> Default fetch with revalidation
    return fetch(request);
  }
};
