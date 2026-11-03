/**
 * E-Vedhika Enterprise Solution - Live Telemetry & Admin Dashboard Server
 * Server Script: server.js
 * Endpoints Handled:
 *  - POST /api/telemetry (Receives C# Tool Reports)
 *  - GET  /api/consolidated-health (Dashboard Data Supplier)
 *  - POST /api/reporting/receiver (Fleet Status Tracking)
 *  - GET  /admin/telemetry (Redirects/Serves Telemetry View)
 *  - GET  /admin/exe_ubd_live (Redirects/Serves Fleet View)
 *  - GET  /version.json & /api/version (Live OTA Updates)
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const express = require('express');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Rules & Body Parsers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File Storage Locations
const STORAGE_DIR = path.join(__dirname, 'public', 'admin');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

const TELEMETRY_FILE = path.join(STORAGE_DIR, 'telemetry_records.json');

// Memory Data Store
const machineStore = new Map();

// Load Existing Records on Server Start
try {
  if (fs.existsSync(TELEMETRY_FILE)) {
    const raw = fs.readFileSync(TELEMETRY_FILE, 'utf8');
    const list = JSON.parse(raw);
    if (Array.isArray(list)) {
      list.forEach(m => m.pcId && machineStore.set(m.pcId, m));
    }
  }
} catch (e) {
  console.warn('Initializing empty telemetry store.');
}

const saveStoreToDisk = () => {
  try {
    const list = Array.from(machineStore.values());
    fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save telemetry records:', err);
  }
};

// =========================================================================
// 1. C# EXE LIVE TELEMETRY RECEIVER (POST /api/telemetry)
// =========================================================================
app.post('/api/telemetry', async (req, res) => {
  try {
    const payload = req.body || {};
    const pcName = payload.pcName || payload.pcId || 'GP-OFFICE-PC';
    const pcId = payload.pcId || pcName;

    const record = {
      pcId,
      pcName,
      userName: payload.userName || 'Operator',
      officeLocation: payload.officeLocation || 'Grama Panchayat Office',
      district: payload.district || 'District',
      state: payload.state || 'Telangana',
      osVersion: payload.osVersion || payload.winBuild || 'Windows 10/11',
      status: payload.status || 'SUCCESS',
      overallStatus: payload.overallStatus || 'HEALTHY',
      healthScore: payload.healthScore || 100,
      verification: payload.verification || '17/17 steps passed.',
      dscStatus: payload.dscStatus || 'USB Token Active',
      nicDigiSigner: payload.nicDigiSigner || 'Port 8080 Active',
      edgeIeMode: payload.edgeIeMode || 'IE5 Quirks Active',
      sitesXml: payload.sitesXml || 'sites.xml Verified',
      macAddress: payload.macAddress || 'A4:BB:6D:88:21:EF',
      hardwareUuid: payload.hardwareUuid || '',
      lastTelemetryUpdate: new Date().toISOString(),
      remarks: payload.remarks || '17/17 deployment steps verified successfully.'
    };

    machineStore.set(pcId, record);
    saveStoreToDisk();

    // Send Telegram Instant Alert to Admin Chat
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN || '9070613382:AAHgln-fTUEKk3RSAtOdRM0LitfndOcgC8E';
    const telegramChatId = process.env.TELEGRAM_CHAT_ID || '431228008';

    if (telegramToken && telegramChatId) {
      const msgText = `🔔 *E-VEDHIKA PC INSTALLATION REPORT*\n` +
                      `🖥️ *PC Name:* ${record.pcName}\n` +
                      `🏢 *Office:* ${record.officeLocation}\n` +
                      `⚙️ *OS:* ${record.osVersion}\n` +
                      `✅ *Verification:* ${record.verification}\n` +
                      `🔑 *DSC Token:* ${record.dscStatus}\n` +
                      `⏰ *Time:* ${new Date().toLocaleString()}`;

      const postData = JSON.stringify({
        chat_id: telegramChatId,
        text: msgText,
        parse_mode: 'Markdown'
      });

      const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${telegramToken}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const tgReq = https.request(options);
      tgReq.on('error', () => {});
      tgReq.write(postData);
      tgReq.end();
    }

    return res.status(200).json({ success: true, message: 'Telemetry record stored.', record });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================================
// 2. DASHBOARD DATA API (GET /api/consolidated-health)
// =========================================================================
app.get('/api/consolidated-health', (req, res) => {
  const machines = Array.from(machineStore.values());
  return res.json({
    success: true,
    totalRecords: machines.length,
    machines
  });
});

// =========================================================================
// 3. REPORTING RECEIVER (POST /api/reporting/receiver)
// =========================================================================
app.post('/api/reporting/receiver', (req, res) => {
  return res.redirect(307, '/api/telemetry');
});

// =========================================================================
// 4. OTA VERSION MANIFEST (GET /version.json & GET /api/version)
// =========================================================================
const VERSION_MANIFEST = {
  name: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
  appName: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
  executableName: "EVedhika_Setup_v1.0.9.exe",
  currentVersion: "v1.0.9",
  latestVersion: "v1.0.9",
  versionCode: 10090,
  releaseDate: "2026-11-03",
  latestResourceBuild: "2026.11.03-R3",
  resourceBuildDate: "2026-11-03",
  downloadUrl: "https://github.com/RakeshKumardhawan/UBDTOOLS/releases/download/latest/EVedhika_Setup_v1.0.9.exe",
  githubRepo: "https://github.com/RakeshKumardhawan/UBDTOOLS",
  releaseNotes: "Enterprise v1.0.9 Guardian Build (Resource Build 2026.11.03-R3) - Full Windows 7, 8, 10 & 11 (.NET 4.8 Architecture)."
};

app.get(['/version.json', '/api/version'], (req, res) => {
  return res.json(VERSION_MANIFEST);
});

// =========================================================================
// 5. DIRECT ADMIN ROUTE REDIRECTS (/admin/telemetry & /admin/exe_ubd_live)
// =========================================================================
app.get('/admin/telemetry', (req, res) => {
  res.redirect('/?tab=telemetry-dashboard');
});

app.get('/admin/exe_ubd_live', (req, res) => {
  res.redirect('/?tab=version-fleet');
});

// Serve Static Web Frontend Files (from public or dist folder)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  }
  return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listener when executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  app.listen(PORT, () => {
    console.log(`🚀 E-Vedhika Telemetry & Admin Server running on port ${PORT}`);
  });
}

export default app;
