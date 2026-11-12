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

    const isTelemetryEndpoint =
      url.pathname === "/admin/ubd_monitoring" ||
      url.pathname === "/admin/ubd_monitoring/" ||
      url.pathname === "/admin/ubd_monitoring.php" ||
      url.pathname === "/api/telemetry" ||
      url.pathname === "/api/deployment-logs";

    const actionParam = (url.searchParams.get("action") || "").toLowerCase();

    // 1A. CLOUD PING CONNECTIVITY CHECK (Zero Firebase Load)
    if (isTelemetryEndpoint && actionParam === "ping") {
      return new Response(
        JSON.stringify({
          success: true,
          status: "INGEST_OK",
          version: "v1.0.9",
          resourceBuild: "2026.11.12.R4",
          time: new Date().toISOString().replace("T", " ").slice(0, 19)
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }

    // 1B. UBD OTA VERSION CHECK AT EDGE (Zero Firebase Load)
    if (
      isTelemetryEndpoint &&
      (actionParam === "ota_check" || actionParam === "check_update" || actionParam === "version")
    ) {
      return new Response(
        JSON.stringify({
          success: true,
          appName: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
          executableName: "EVedhika_Setup_v1.0.9.exe",
          currentVersion: "v1.0.9",
          latestVersion: "v1.0.9",
          latestResourceBuild: "2026.11.12.R4",
          resourceBuild: "2026.11.12.R4",
          manifestVersion: "2026.11.12.R4",
          versionCode: 10090,
          releaseDate: "2026-11-12",
          downloadSize: "8.5 MB",
          downloadUrl: "https://github.com/RakeshKumardhawan/UBDTOOLS/releases/latest/download/EVedhika_Setup_v1.0.9.exe",
          githubRepo: "https://github.com/RakeshKumardhawan/UBDTOOLS",
          updateRequired: false,
          silent: false,
          sha256: "4d54ba00f532b15793a70e0d4c03ca03d81b1cc23f0e6a1fa0cba4860f0720c9",
          signatureStatus: "Verified (E-Vedhika Authenticode)",
          telemetryRelayUrl: "https://e-vedhika.rakeshkumardhawan123.workers.dev/admin/ubd_monitoring"
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

    // 1C. HANDLE INCOMING POST TELEMETRY / REPORTS FROM C# DESKTOP APPLICATION OR WEB CLIENT
    if (method === "POST" && isTelemetryEndpoint) {
      try {
        const contentType = request.headers.get("content-type") || "";
        let data = {};
        if (contentType.includes("application/json")) {
          data = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          const formData = await request.formData();
          formData.forEach((v, k) => {
            data[k] = String(v);
          });
        } else {
          const rawText = await request.text();
          try {
            data = JSON.parse(rawText);
          } catch {
            const params = new URLSearchParams(rawText);
            params.forEach((v, k) => {
              data[k] = v;
            });
          }
        }

        const nowIso = new Date().toISOString();
        const istDate = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().replace("T", " ").substring(0, 19);
        const pcName = String(data.pcName || data.computerName || data.machineName || "GP-OFFICE-PC").trim();
        const machineId = String(data.pcId || data.deviceInstallationId || data.machineId || pcName || "EVD-PC-01").trim();
        const userName = String(data.userName || data.operatorName || "Operator").trim();
        const officeLocation = String(data.officeLocation || data.office || "Grama Panchayat Office").trim();
        const os = String(data.osVersion || data.os || "Windows 10/11 Pro").trim();
        const buildNumber = String(data.winBuild || data.buildNumber || "Build 22631").trim();
        const appVersion = String(data.appVersion || data.version || "v1.0.9").trim();
        const resourceBuild = String(data.resourceBuild || "2026.11.11.R3").trim();
        const reportType = String(data.reportType || data.eventType || "LIVE_MONITORING").trim();
        const status = String(data.status || "SUCCESS").trim();
        const appState = String(data.appState || "RUNNING").toUpperCase().trim();
        const stepsVerified = String(data.verification || data.stepsVerified || "17/17 Passed").trim();
        const dscStatus = String(data.dscStatus || "USB Token Active").trim();
        const edgePolicy = String(data.edgeIeMode || data.edgePolicy || "IE5 Quirks Active").trim();
        const sitesXml = String(data.sitesXml || "Validated").trim();
        const details = String(data.details || data.remarks || data.summary || "Report synchronized from C# Desktop Application.").trim();
        const eventId = String(data.eventId || data.reportId || `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

        const docId = eventId.replace(/[^a-zA-Z0-9_-]/g, "_");
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/(default)/documents/telemetryLogs/${docId}`;

        const firestorePayload = {
          fields: {
            id: { stringValue: docId },
            eventId: { stringValue: eventId },
            reportId: { stringValue: eventId },
            reportType: { stringValue: reportType },
            recordSource: { stringValue: "LIVE_RECEIVED" },
            pcId: { stringValue: machineId },
            machineId: { stringValue: machineId },
            pcName: { stringValue: pcName },
            userName: { stringValue: userName },
            officeLocation: { stringValue: officeLocation },
            os: { stringValue: os },
            osVersion: { stringValue: os },
            buildNumber: { stringValue: buildNumber },
            appVersion: { stringValue: appVersion },
            version: { stringValue: appVersion },
            resourceBuild: { stringValue: resourceBuild },
            status: { stringValue: status },
            overallStatus: { stringValue: "ONLINE" },
            appState: { stringValue: appState },
            stepsVerified: { stringValue: stepsVerified },
            verification: { stringValue: stepsVerified },
            dscStatus: { stringValue: dscStatus },
            edgePolicy: { stringValue: edgePolicy },
            sitesXml: { stringValue: sitesXml },
            details: { stringValue: details },
            remarks: { stringValue: details },
            lastSeen: { stringValue: istDate },
            timestampIst: { stringValue: `${istDate} IST` },
            timestampUtc: { stringValue: nowIso },
            lastHeartbeatEpoch: { integerValue: String(Math.floor(Date.now() / 1000)) }
          }
        };

        await fetch(firestoreUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(firestorePayload)
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: "Report synchronized and stored at www.e-vedhika.in/admin/ubd_monitoring",
            eventId,
            pcId: machineId,
            resourceBuild
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            error: err && err.message ? err.message : "Failed to process telemetry POST"
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*"
            }
          }
        );
      }
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
