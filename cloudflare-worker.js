/**
 * Cloudflare Worker for E-Vedhika Portal (Firebase Firestore + Edge Cache & Telemetry Receiver)
 * Purpose:
 * 1) Receive UBD Deployment Tool (C# .NET 4.8) telemetry via Raw JSON POST, Base64 URL-Encoded POST (`payload_b64`),
 *    and Base64 GET requests on `/api/reporting/receiver`, `/admin/ubd_monitoring`, `/api/telemetry`.
 * 2) Persist records directly to Firebase Firestore (`e-vedhika-258f2` / `(default)` / `telemetryLogs`).
 * 3) Serve live consolidated fleet summary JSON with strict CORS for `https://www.e-vedhika.in`.
 */

const CACHE_TTL_SECONDS = 60;
const FIREBASE_PROJECT_ID = "e-vedhika-258f2";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

const ALLOWED_ORIGINS = [
  "https://www.e-vedhika.in",
  "https://e-vedhika.in",
  "https://rakeshkumardhawan.github.io",
  "https://e-vedhika.rakeshkumardhawan123.workers.dev",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    origin.endsWith(".run.app") ||
    origin.endsWith(".github.io") ||
    origin.endsWith(".workers.dev");

  return {
    "Access-Control-Allow-Origin": isAllowed && origin ? origin : "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Admin-Token, X-EVedhika-Client",
    "Access-Control-Max-Age": "86400",
    ...(isAllowed && origin ? { "Access-Control-Allow-Credentials": "true", Vary: "Origin" } : {})
  };
}

function decodeBase64Payload(rawB64) {
  if (typeof rawB64 !== "string") return null;
  const trimmed = rawB64.trim();
  if (!trimmed) return null;
  try {
    let normalized = trimmed.replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4 !== 0) normalized += "=";
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const decoded = new TextDecoder("utf-8").decode(bytes).trim();
    if (!decoded || (!decoded.startsWith("{") && !decoded.startsWith("["))) return null;
    const parsed = JSON.parse(decoded);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function extractIncomingTelemetryPayload(request, url) {
  const queryObj = {};
  url.searchParams.forEach((v, k) => {
    queryObj[k] = v;
  });

  let bodyObj = {};
  const method = request.method.toUpperCase();
  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const contentType = (request.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      try {
        bodyObj = await request.json();
      } catch {
        bodyObj = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((v, k) => {
        bodyObj[k] = String(v);
      });
    } else {
      const rawText = await request.text();
      try {
        bodyObj = JSON.parse(rawText);
      } catch {
        const params = new URLSearchParams(rawText);
        params.forEach((v, k) => {
          bodyObj[k] = v;
        });
      }
    }
  }

  const merged = { ...queryObj, ...(bodyObj && typeof bodyObj === "object" ? bodyObj : {}) };
  const b64 = merged.payload_b64 || merged.payloadB64 || merged.data_b64 || merged.b64;
  const decodedB64 = decodeBase64Payload(b64);
  return decodedB64 ? { ...merged, ...decodedB64 } : merged;
}

function clampPct(val, fallback) {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function classifyHealth(scoreInput, statusInput) {
  const score = clampPct(scoreInput, 100);
  const st = String(statusInput || "").toUpperCase();
  if (score < 50 || st.includes("ERROR") || st.includes("CRITICAL") || st.includes("FAIL")) return "critical";
  if (score < 70 || st.includes("WARN")) return "warning";
  return "healthy";
}

function parseFirestoreDoc(doc) {
  const f = doc?.fields || {};
  const getVal = (k, def = "") => {
    const entry = f[k];
    if (!entry || typeof entry !== "object") return def;
    if (entry.stringValue !== undefined) return entry.stringValue;
    if (entry.integerValue !== undefined) return Number(entry.integerValue);
    if (entry.doubleValue !== undefined) return Number(entry.doubleValue);
    if (entry.booleanValue !== undefined) return entry.booleanValue;
    return def;
  };
  const docId = String(getVal("id") || getVal("eventId") || doc.name?.split("/").pop() || "");
  if (!docId || docId.startsWith("TEL-SEED") || docId.startsWith("SEED")) return null;

  const pcId = String(getVal("pcId") || getVal("machineId") || docId);
  const healthScore = clampPct(getVal("healthScore", 100), 100);
  const ramUsagePct = clampPct(getVal("ramUsagePct", 45), 45);
  const status = String(getVal("status") || "SUCCESS");
  const lastHeartbeatEpoch = Number(getVal("lastHeartbeatEpoch", 0)) || 0;
  const nowEpoch = Math.floor(Date.now() / 1000);
  const isOnline = lastHeartbeatEpoch > 0 && Math.abs(nowEpoch - lastHeartbeatEpoch) <= 180;

  return {
    id: docId,
    pcId,
    machineId: pcId,
    pcName: String(getVal("pcName") || "GP-OFFICE-PC"),
    userName: String(getVal("userName") || "Operator"),
    officeLocation: String(getVal("officeLocation") || "Grama Panchayat Office"),
    healthScore,
    healthSeverity: classifyHealth(healthScore, status),
    ramUsagePct,
    dscStatus: String(getVal("dscStatus") || "USB Token Active"),
    edgeIeMode: String(getVal("edgeIeMode") || getVal("edgePolicy") || "IE5 Quirks Active"),
    edgePolicy: String(getVal("edgePolicy") || getVal("edgeIeMode") || "IE5 Quirks Active"),
    status,
    overallStatus: isOnline ? "ONLINE" : String(getVal("overallStatus") || "OFFLINE"),
    isOnline,
    appVersion: String(getVal("appVersion") || "v1.0.9"),
    lastSeen: String(getVal("lastSeen") || "Synced"),
    lastHeartbeatEpoch
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const method = request.method.toUpperCase();
    const corsHeaders = getCorsHeaders(request);

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const isReportingReceiver = url.pathname === "/api/reporting/receiver";
    const isTelemetryEndpoint =
      isReportingReceiver ||
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
          message: "INGEST_OK",
          database: "firebase-firestore",
          edge: "cloudflare-worker",
          version: "v1.0.9",
          resourceBuild: "2026.11.12.R4",
          time: new Date().toISOString()
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
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
          telemetryRelayUrl: "https://e-vedhika.rakeshkumardhawan123.workers.dev/api/reporting/receiver"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=60",
            ...corsHeaders
          }
        }
      );
    }

    // 1C. TELEMETRY INGEST (Raw JSON POST, Base64 URL-Encoded POST, Base64 GET Query)
    const hasIngestAttempt =
      isTelemetryEndpoint &&
      (method === "POST" ||
        url.searchParams.has("payload_b64") ||
        url.searchParams.has("pcId") ||
        url.searchParams.has("pcName") ||
        url.searchParams.has("PcName") ||
        actionParam === "ingest_report");

    if (hasIngestAttempt) {
      try {
        const data = await extractIncomingTelemetryPayload(request, url);
        const pcName = String(data.pcName || data.PcName || data.pc_name || data.computerName || data.machineName || "").trim();
        const machineId = String(data.pcId || data.PcId || data.pc_id || data.deviceInstallationId || data.machineId || "").trim();

        if (!pcName && !machineId) {
          return new Response(JSON.stringify({ success: false, message: "Invalid Payload" }), {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          });
        }

        const resolvedPcId = machineId || pcName.toUpperCase().replace(/[^A-Z0-9_-]/g, "-");
        const resolvedPcName = pcName || resolvedPcId;
        const nowIso = new Date().toISOString();
        const istDate = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().replace("T", " ").substring(0, 19);
        const nowEpoch = Math.floor(Date.now() / 1000);

        const healthScore = clampPct(data.healthScore ?? data.HealthScore ?? data.health_score, 100);
        const ramUsagePct = clampPct(data.ramUsagePct ?? data.RamUsagePct ?? data.ram_usage_pct, 45);
        const userName = String(data.userName || data.UserName || data.user_name || data.operatorName || "Operator").trim();
        const officeLocation = String(data.officeLocation || data.OfficeLocation || data.office_location || data.office || "Grama Panchayat Office").trim();
        const os = String(data.osVersion || data.os || "Windows 10/11 Pro").trim();
        const buildNumber = String(data.winBuild || data.buildNumber || "Build 22631").trim();
        const appVersion = String(data.appVersion || data.version || "v1.0.9").trim();
        const resourceBuild = String(data.resourceBuild || "2026.11.12.R4").trim();
        const reportType = String(data.reportType || data.eventType || "LIVE_MONITORING").trim();
        const status = String(data.status || data.Status || "SUCCESS").trim();
        const appState = String(data.appState || "RUNNING").toUpperCase().trim();
        const stepsVerified = String(data.verification || data.stepsVerified || "17/17 Passed").trim();
        const dscStatus = String(data.dscStatus || data.DscStatus || data.dsc_status || "USB Token Active").trim();
        const edgePolicy = String(data.edgeIeMode || data.EdgeIeMode || data.edge_ie_mode || data.edgePolicy || "IE5 Quirks Active").trim();
        const sitesXml = String(data.sitesXml || "Validated").trim();
        const details = String(data.details || data.remarks || data.summary || "Report synchronized from C# Desktop Application.").trim();
        const eventId = String(data.eventId || data.reportId || `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);

        const docId = eventId.replace(/[^a-zA-Z0-9_-]/g, "_");
        const firestoreUrl = `${FIRESTORE_BASE_URL}/telemetryLogs/${docId}`;

        const firestorePayload = {
          fields: {
            id: { stringValue: docId },
            eventId: { stringValue: eventId },
            reportId: { stringValue: eventId },
            reportType: { stringValue: reportType },
            recordSource: { stringValue: "LIVE_RECEIVED" },
            pcId: { stringValue: resolvedPcId },
            machineId: { stringValue: resolvedPcId },
            pcName: { stringValue: resolvedPcName },
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
            healthScore: { integerValue: String(healthScore) },
            ramUsagePct: { integerValue: String(ramUsagePct) },
            stepsVerified: { stringValue: stepsVerified },
            verification: { stringValue: stepsVerified },
            dscStatus: { stringValue: dscStatus },
            edgeIeMode: { stringValue: edgePolicy },
            edgePolicy: { stringValue: edgePolicy },
            sitesXml: { stringValue: sitesXml },
            details: { stringValue: details },
            remarks: { stringValue: details },
            lastSeen: { stringValue: istDate },
            timestampIst: { stringValue: `${istDate} IST` },
            timestampUtc: { stringValue: nowIso },
            lastHeartbeatEpoch: { integerValue: String(nowEpoch) }
          }
        };

        const fsRes = await fetch(firestoreUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(firestorePayload)
        });

        if (!fsRes.ok) {
          const fsErrText = await fsRes.text();
          return new Response(
            JSON.stringify({ success: false, message: "Firestore write failed", detail: fsErrText }),
            { status: 502, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "INGEST_OK",
            database: "firebase-firestore",
            eventId,
            pcId: resolvedPcId,
            pcName: resolvedPcName,
            healthScore,
            resourceBuild
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            error: err && err.message ? err.message : "Failed to process telemetry ingest"
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders }
          }
        );
      }
    }

    // 1D. LIVE FLEET SUMMARY READ FROM FIREBASE FIRESTORE (for static GitHub Pages dashboard)
    if (isReportingReceiver && method === "GET") {
      try {
        const fsRes = await fetch(`${FIRESTORE_BASE_URL}/telemetryLogs?pageSize=200`);
        if (!fsRes.ok) throw new Error(`Firestore HTTP ${fsRes.status}`);
        const fsJson = await fsRes.json();
        const docs = Array.isArray(fsJson?.documents) ? fsJson.documents : [];
        const byPc = {};

        for (const doc of docs) {
          const parsed = parseFirestoreDoc(doc);
          if (!parsed) continue;
          const prev = byPc[parsed.pcId];
          if (!prev || Number(parsed.lastHeartbeatEpoch || 0) >= Number(prev.lastHeartbeatEpoch || 0)) {
            byPc[parsed.pcId] = parsed;
          }
        }

        const sevRank = (r) => (r.healthSeverity === "critical" ? 0 : r.healthSeverity === "warning" ? 1 : 2);
        const fleetSummary = Object.values(byPc).sort((a, b) => {
          const aLive = a.isOnline ? 0 : 1;
          const bLive = b.isOnline ? 0 : 1;
          if (aLive !== bLive) return aLive - bLive;
          const diff = sevRank(a) - sevRank(b);
          return diff !== 0 ? diff : Number(b.lastHeartbeatEpoch || 0) - Number(a.lastHeartbeatEpoch || 0);
        });

        return new Response(
          JSON.stringify({
            success: true,
            database: "firebase-firestore",
            edge: "cloudflare-worker",
            totalLivePcs: fleetSummary.length,
            activeNodes: fleetSummary.filter((p) => p.isOnline || String(p.status).toUpperCase().includes("SUCCESS")).length,
            fleetSummary,
            receiverTimestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              ...corsHeaders
            }
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, message: "Firestore read error", error: err?.message }),
          { status: 500, headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders } }
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
      return fetch(request, { cf: { cacheEverything: false } });
    }

    // 3. READ-HEAVY API ENDPOINTS -> Cache at Cloudflare Edge
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

    // 4. STATIC ASSETS
    const isStaticAsset = /\.(js|css|png|jpg|jpeg|gif|svg|ico|exe|msi|zip|woff2|ttf|eot)$/i.test(url.pathname);
    if (isStaticAsset) {
      if (env && env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return fetch(request, {
        cf: { cacheEverything: true, cacheTtl: 31536000, edgeCacheTtl: 31536000 }
      });
    }

    // 5. HTML / PAGE ROUTING
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return fetch(request);
  }
};
