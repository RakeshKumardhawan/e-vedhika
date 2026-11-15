import test from 'node:test';
import assert from 'node:assert/strict';
import {
  decodeBase64Payload,
  extractMergedTelemetryPayload,
  classifyTelemetryHealth,
  normalizeTelemetryRecord,
  buildFirestoreTelemetryFields,
  parseFirestoreTelemetryDoc,
} from './telemetryParser';

test('decodeBase64Payload decodes standard and URL-safe Base64 JSON payloads', () => {
  const sample = {
    pcId: 'EVD-TS-1024',
    pcName: 'WARANGAL-GP-01',
    userName: 'Ramesh',
    officeLocation: 'Hanamkonda GP',
    healthScore: 92,
    dscStatus: 'ProxKey Active',
    edgeIeMode: 'IE5 Quirks Active',
    status: 'SUCCESS',
  };
  const b64 = Buffer.from(JSON.stringify(sample), 'utf-8').toString('base64');
  const decoded = decodeBase64Payload(b64);
  assert.deepEqual(decoded, sample);

  // Simulate '+' turning into space in form-urlencoded without proper '+' encoding
  const withSpaces = b64.replace(/\+/g, ' ');
  assert.deepEqual(decodeBase64Payload(withSpaces), sample);
});

test('decodeBase64Payload returns null safely for invalid input', () => {
  assert.equal(decodeBase64Payload(''), null);
  assert.equal(decodeBase64Payload('not-valid-json-base64!!!'), null);
  assert.equal(decodeBase64Payload(undefined), null);
});

test('extractMergedTelemetryPayload merges query Base64 and JSON bodies properly', () => {
  const sample = { pcId: 'EVD-AP-55', pcName: 'GUNTUR-GP', healthScore: 65 };
  const b64 = Buffer.from(JSON.stringify(sample), 'utf-8').toString('base64');

  const fromGet = extractMergedTelemetryPayload(undefined, { payload_b64: b64 });
  assert.equal(fromGet.pcId, 'EVD-AP-55');
  assert.equal(fromGet.pcName, 'GUNTUR-GP');
  assert.equal(fromGet.healthScore, 65);

  const fromPostForm = extractMergedTelemetryPayload({ payload_b64: b64 }, {});
  assert.equal(fromPostForm.pcId, 'EVD-AP-55');
  assert.equal(fromPostForm.pcName, 'GUNTUR-GP');
});

test('classifyTelemetryHealth categorizes healthy, warning, and critical thresholds accurately', () => {
  assert.equal(classifyTelemetryHealth(95, 'SUCCESS'), 'healthy');
  assert.equal(classifyTelemetryHealth(70, 'ONLINE'), 'healthy');
  assert.equal(classifyTelemetryHealth(69, 'ONLINE'), 'warning');
  assert.equal(classifyTelemetryHealth(50, 'SUCCESS'), 'warning');
  assert.equal(classifyTelemetryHealth(49, 'SUCCESS'), 'critical');
  assert.equal(classifyTelemetryHealth(95, 'ERROR: Port 8080 blocked'), 'critical');
});

test('normalizeTelemetryRecord validates identity and clamps health/RAM metrics', () => {
  assert.equal(normalizeTelemetryRecord({}), null);

  const normalized = normalizeTelemetryRecord(
    {
      pcId: 'EVD-9901',
      pcName: 'KHAMMAM-GP-03',
      userName: 'Srinivas',
      officeLocation: 'Khammam Rural',
      healthScore: '84',
      ramUsagePct: '52',
      dscStatus: 'ePass2003 Connected',
      edgeIeMode: 'IE5 Quirks Active',
      status: 'SUCCESS',
    },
    '2026-11-15T10:00:00.000Z'
  );

  assert.deepEqual(normalized, {
    pcId: 'EVD-9901',
    pcName: 'KHAMMAM-GP-03',
    userName: 'Srinivas',
    officeLocation: 'Khammam Rural',
    healthScore: 84,
    dscStatus: 'ePass2003 Connected',
    edgeIeMode: 'IE5 Quirks Active',
    status: 'SUCCESS',
    ramUsagePct: 52,
    lastUpdated: '2026-11-15T10:00:00.000Z',
  });
});

test('buildFirestoreTelemetryFields & parseFirestoreTelemetryDoc round-trip telemetry cleanly', () => {
  const fields = buildFirestoreTelemetryFields(
    {
      id: 'TEL-TEST-101',
      pcId: 'EVD-TS-77',
      pcName: 'NALGONDA-GP-02',
      userName: 'Mahesh',
      officeLocation: 'Nalgonda GP',
      healthScore: 42,
      ramUsagePct: 78,
      ramUsageMB: 210,
      cpuUsage: 14.5,
      dscStatus: 'DSC Missing',
      edgeIeMode: 'IE5 Quirks Active',
      status: 'ERROR: DSC Not Found',
      lastSeen: '2026-11-15 12:00:00',
    },
    'v1.0.9',
    '2026.11.12.R4',
    1763200000
  );

  assert.equal(fields.healthScore.integerValue, '42');
  assert.equal(fields.ramUsagePct.integerValue, '78');
  assert.equal(fields.edgeIeMode.stringValue, 'IE5 Quirks Active');

  const parsed = parseFirestoreTelemetryDoc({
    name: 'projects/e-vedhika-258f2/databases/(default)/documents/telemetryLogs/TEL-TEST-101',
    fields,
  });

  assert.ok(parsed);
  assert.equal(parsed.pcId, 'EVD-TS-77');
  assert.equal(parsed.pcName, 'NALGONDA-GP-02');
  assert.equal(parsed.healthScore, 42);
  assert.equal(parsed.healthSeverity, 'critical');
  assert.equal(parsed.ramUsagePct, 78);
  assert.equal(parsed.edgeIeMode, 'IE5 Quirks Active');
  assert.equal(parsed.lastHeartbeatEpoch, 1763200000);
});
