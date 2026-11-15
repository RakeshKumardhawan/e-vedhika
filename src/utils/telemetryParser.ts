export interface NormalizedTelemetrySummary {
  pcId: string;
  pcName: string;
  userName: string;
  officeLocation: string;
  healthScore: number;
  ramUsagePct: number;
  dscStatus: string;
  edgeIeMode: string;
  status: string;
  lastUpdated: string;
}

export type TelemetryHealthSeverity = 'healthy' | 'warning' | 'critical';

/**
 * Safely decodes a Base64 (standard, URL-safe, or URL-encoded space) JSON payload string.
 */
export function decodeBase64Payload(rawB64: unknown): Record<string, any> | null {
  if (typeof rawB64 !== 'string') return null;
  const trimmed = rawB64.trim();
  if (!trimmed) return null;

  try {
    // Handle URL-encoded spaces becoming ' ' instead of '+', and URL-safe '-' / '_'
    let normalized = trimmed
      .replace(/ /g, '+')
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    while (normalized.length % 4 !== 0) {
      normalized += '=';
    }

    const decoded = Buffer.from(normalized, 'base64').toString('utf-8').trim();
    if (!decoded || (!decoded.startsWith('{') && !decoded.startsWith('['))) {
      return null;
    }

    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, any>;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Merges raw JSON body, URL query parameters, and decoded Base64 payload_b64 into one object.
 */
export function extractMergedTelemetryPayload(
  rawBody: unknown,
  rawQuery?: Record<string, any>
): Record<string, any> {
  let bodyObj: Record<string, any> = {};

  if (rawBody && typeof rawBody === 'object' && !Array.isArray(rawBody)) {
    bodyObj = { ...(rawBody as Record<string, any>) };
  } else if (typeof rawBody === 'string' && rawBody.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(rawBody.trim());
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        bodyObj = parsed;
      }
    } catch {
      // Ignore malformed JSON string
    }
  }

  const queryObj = rawQuery && typeof rawQuery === 'object' ? rawQuery : {};
  const mergedPreBase64: Record<string, any> = { ...queryObj, ...bodyObj };

  const b64Candidate =
    mergedPreBase64.payload_b64 ||
    mergedPreBase64.payloadB64 ||
    mergedPreBase64.data_b64 ||
    mergedPreBase64.b64;

  const decodedB64 = decodeBase64Payload(b64Candidate);
  if (decodedB64) {
    return { ...mergedPreBase64, ...decodedB64 };
  }

  return mergedPreBase64;
}

/**
 * Classifies PC telemetry card severity matching the dashboard threshold rules:
 * - critical: healthScore < 50 OR status includes 'ERROR' / 'CRITICAL' / 'FAIL'
 * - warning: healthScore < 70
 * - healthy: healthScore >= 70
 */
export function classifyTelemetryHealth(
  healthScoreInput: unknown,
  statusInput?: unknown
): TelemetryHealthSeverity {
  const numericScore = Number(healthScoreInput);
  const score = Number.isFinite(numericScore) ? numericScore : 100;
  const statusStr = String(statusInput || '').toUpperCase();

  if (
    score < 50 ||
    statusStr.includes('ERROR') ||
    statusStr.includes('CRITICAL') ||
    statusStr.includes('FAIL')
  ) {
    return 'critical';
  }
  if (score < 70 || statusStr.includes('WARN')) {
    return 'warning';
  }
  return 'healthy';
}

function clampPercentage(value: unknown, fallback: number): number {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/**
 * Normalizes any incoming C# .NET 4.8 / HTTP telemetry payload and enforces required identity fields.
 */
export function normalizeTelemetryRecord(
  payload: Record<string, any>,
  nowIso: string = new Date().toISOString()
): NormalizedTelemetrySummary | null {
  const pcId = String(
    payload.pcId ||
      payload.PcId ||
      payload.pc_id ||
      payload.machineId ||
      payload.MachineId ||
      ''
  ).trim();
  const pcName = String(
    payload.pcName ||
      payload.PcName ||
      payload.PCName ||
      payload.pc_name ||
      payload.computerName ||
      payload.ComputerName ||
      payload.machineName ||
      ''
  ).trim();

  if (!pcId && !pcName) {
    return null;
  }

  const resolvedId = pcId || pcName.toUpperCase().replace(/[^A-Z0-9_-]/g, '-');
  const resolvedName = pcName || resolvedId;

  return {
    pcId: resolvedId,
    pcName: resolvedName,
    userName: String(
      payload.userName || payload.UserName || payload.user_name || payload.user || 'Operator'
    ).trim(),
    officeLocation: String(
      payload.officeLocation ||
        payload.OfficeLocation ||
        payload.office_location ||
        payload.location ||
        payload.panchayat ||
        'Grama Panchayat Office'
    ).trim(),
    healthScore: clampPercentage(
      payload.healthScore ?? payload.HealthScore ?? payload.health_score,
      100
    ),
    dscStatus: String(
      payload.dscStatus || payload.DscStatus || payload.dsc_status || 'USB Token Active'
    ).trim(),
    edgeIeMode: String(
      payload.edgeIeMode ||
        payload.EdgeIeMode ||
        payload.edge_ie_mode ||
        payload.edgePolicy ||
        'IE5 Quirks Active'
    ).trim(),
    status: String(payload.status || payload.Status || 'SUCCESS').trim(),
    ramUsagePct: clampPercentage(
      payload.ramUsagePct ?? payload.RamUsagePct ?? payload.ram_usage_pct,
      45
    ),
    lastUpdated: nowIso,
  };
}

/**
 * Builds Firebase Firestore REST API v1 `fields` object for a telemetry record.
 */
export function buildFirestoreTelemetryFields(
  record: Record<string, any>,
  gatewayVersion = 'v1.0.9',
  resourceBuild = '2026.11.12.R4',
  nowEpochSec: number = Math.floor(Date.now() / 1000)
): Record<string, any> {
  const docId = String(record.id || record.eventId || `EVT-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_');
  const str = (v: unknown, def = '') => ({ stringValue: String(v ?? def) });
  const intVal = (v: unknown, def = 0) => {
    const n = Number(v);
    return { integerValue: String(Number.isFinite(n) ? Math.round(n) : def) };
  };
  const dblVal = (v: unknown, def = 0) => {
    const n = Number(v);
    return { doubleValue: Number.isFinite(n) ? n : def };
  };

  const nowIso = new Date(nowEpochSec * 1000).toISOString();
  const formattedUtc = nowIso.slice(0, 19).replace('T', ' ');
  const healthScore = clampPercentage(record.healthScore ?? record.health_score, 100);
  const ramUsagePct = clampPercentage(record.ramUsagePct ?? record.ram_usage_pct, 45);
  const edgeIeMode = String(record.edgeIeMode || record.edgePolicy || 'IE5 Quirks Active');

  return {
    id: str(docId),
    eventId: str(record.eventId || record.id || docId),
    reportId: str(record.reportId || record.id || docId),
    reportType: str(record.reportType || record.eventType || 'LIVE_MONITORING'),
    recordSource: str(record.recordSource || 'LIVE_RECEIVED'),
    pcId: str(record.pcId || record.machineId || 'EVD-PC-01'),
    machineId: str(record.machineId || record.pcId || 'EVD-PC-01'),
    pcName: str(record.pcName || 'GP-OFFICE-PC'),
    userName: str(record.userName || 'Operator'),
    officeLocation: str(record.officeLocation || 'Grama Panchayat Office'),
    district: str(record.district || 'Telangana'),
    state: str(record.state || 'Telangana'),
    os: str(record.osVersion || record.os || 'Windows 10/11 Pro'),
    osVersion: str(record.osVersion || record.os || 'Windows 10/11 Pro'),
    buildNumber: str(record.buildNumber || record.winBuild || 'Build 22631'),
    appVersion: str(record.appVersion || record.version || gatewayVersion),
    version: str(record.version || record.appVersion || gatewayVersion),
    resourceBuild: str(record.resourceBuild || resourceBuild),
    status: str(record.status || 'SUCCESS'),
    overallStatus: str(record.overallStatus || 'ONLINE'),
    appState: str(record.appState || 'RUNNING'),
    healthScore: intVal(healthScore, 100),
    ramUsagePct: intVal(ramUsagePct, 45),
    ramUsageMB: intVal(record.ramUsageMB ?? record.memoryUsageMB, 120),
    cpuUsage: dblVal(record.cpuUsage ?? record.cpuUsagePct, 3.5),
    stepsVerified: str(record.verification || record.stepsVerified || '17/17 Passed'),
    verification: str(record.verification || record.stepsVerified || '17/17 Passed'),
    dscStatus: str(record.dscStatus || 'USB Token Active'),
    edgeIeMode: str(edgeIeMode),
    edgePolicy: str(edgeIeMode),
    sitesXml: str(record.sitesXml || 'Validated'),
    details: str(record.remarks || record.details || 'Report synchronized from C# Desktop Application'),
    remarks: str(record.remarks || record.details || 'Report synchronized from C# Desktop Application'),
    date: str(record.date || nowIso.slice(0, 10)),
    time: str(record.time || formattedUtc.slice(11)),
    lastSeen: str(record.lastSeen && record.lastSeen !== 'Just Now' ? record.lastSeen : formattedUtc),
    timestampIst: str(record.timestampIst || `${formattedUtc} IST`),
    lastHeartbeatEpoch: intVal(record.lastHeartbeatEpoch ?? nowEpochSec, nowEpochSec),
  };
}

/**
 * Parses a Firebase Firestore REST API v1 document back into a normalized telemetry object.
 */
export function parseFirestoreTelemetryDoc(
  doc: { name?: string; fields?: Record<string, any> },
  gatewayVersion = 'v1.0.9',
  resourceBuild = '2026.11.12.R4'
): Record<string, any> | null {
  const f = doc?.fields || {};
  const getVal = (k: string, def: any = '') => {
    const entry = f[k];
    if (!entry || typeof entry !== 'object') return def;
    if (entry.stringValue !== undefined) return entry.stringValue;
    if (entry.integerValue !== undefined) return Number(entry.integerValue);
    if (entry.doubleValue !== undefined) return Number(entry.doubleValue);
    if (entry.booleanValue !== undefined) return entry.booleanValue;
    return def;
  };

  const docId = String(getVal('id') || getVal('eventId') || doc.name?.split('/').pop() || '');
  if (!docId || docId.startsWith('TEL-SEED') || docId.startsWith('SEED')) {
    return null;
  }

  const pcId = String(getVal('pcId') || getVal('machineId') || docId);
  const edgeIeMode = String(getVal('edgeIeMode') || getVal('edgePolicy') || 'IE5 Quirks Active');
  const healthScore = clampPercentage(getVal('healthScore', 100), 100);
  const ramUsagePct = clampPercentage(getVal('ramUsagePct', 45), 45);
  const status = String(getVal('status') || 'SUCCESS');

  return {
    id: docId,
    eventId: String(getVal('eventId') || docId),
    reportId: String(getVal('reportId') || docId),
    reportType: String(getVal('reportType') || getVal('eventType') || 'LIVE_MONITORING'),
    recordSource: String(getVal('recordSource') || 'LIVE_RECEIVED'),
    pcId,
    machineId: pcId,
    pcName: String(getVal('pcName') || 'GP-OFFICE-PC'),
    userName: String(getVal('userName') || 'Operator'),
    officeLocation: String(getVal('officeLocation') || getVal('panchayat') || 'Grama Panchayat Office'),
    district: String(getVal('district') || 'Telangana'),
    state: String(getVal('state') || 'Telangana'),
    os: String(getVal('os') || getVal('osVersion') || 'Windows 10/11 Pro'),
    osVersion: String(getVal('osVersion') || getVal('os') || 'Windows 10/11 Pro'),
    buildNumber: String(getVal('buildNumber') || getVal('winBuild') || 'Build 22631'),
    appVersion: String(getVal('appVersion') || getVal('version') || gatewayVersion),
    version: String(getVal('version') || getVal('appVersion') || gatewayVersion),
    resourceBuild: String(getVal('resourceBuild') || resourceBuild),
    status,
    overallStatus: String(getVal('overallStatus') || 'ONLINE'),
    appState: String(getVal('appState') || 'RUNNING'),
    healthScore,
    healthSeverity: classifyTelemetryHealth(healthScore, status),
    ramUsagePct,
    ramUsageMB: Number(getVal('ramUsageMB', 120)) || 120,
    cpuUsage: Number(getVal('cpuUsage', 3.5)) || 3.5,
    stepsVerified: String(getVal('stepsVerified') || getVal('verification') || '17/17 Passed'),
    verification: String(getVal('verification') || getVal('stepsVerified') || '17/17 Passed'),
    dscStatus: String(getVal('dscStatus') || 'USB Token Active'),
    edgeIeMode,
    edgePolicy: edgeIeMode,
    sitesXml: String(getVal('sitesXml') || 'Validated'),
    remarks: String(getVal('remarks') || getVal('details') || 'Telemetry report synchronized from Firestore'),
    details: String(getVal('details') || getVal('remarks') || 'Telemetry report synchronized from Firestore'),
    lastSeen: String(getVal('lastSeen') || getVal('date') || new Date().toISOString().slice(0, 19).replace('T', ' ')),
    timestampIst: String(getVal('timestampIst') || `${getVal('lastSeen') || new Date().toISOString().slice(0, 19).replace('T', ' ')} IST`),
    lastHeartbeatEpoch: Number(getVal('lastHeartbeatEpoch') || 0) || Math.floor(Date.now() / 1000),
  };
}
