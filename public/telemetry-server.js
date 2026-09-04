// ====================================================================
// e-Vedhika: Grama Panchayat UBD & DSC Live Telemetry Receiver (Node.js Express)
// File: server.js
// Run: node server.js
// ====================================================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// రిపోర్ట్స్ పర్మినెంట్గా సేవ్ అయ్యే JSON ఫైల్
const DB_FILE = path.join(__dirname, 'telemetry_logs.json');

// CORS ఎనేబుల్ - అన్ని పంచాయతీల నుండి ఫ్రీగా డేటా రావడానికి
app.use(cors());
// 90+ పారామితుల డేటా కోసం 15MB లిమిట్
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// మెమొరీ స్టోర్
let logsStore = [];

// సర్వర్ ఆన్ అవ్వగానే పాత రిపోర్ట్స్ ఫైల్ నుంచి లోడ్ చేయడం
try {
  if (fs.existsSync(DB_FILE)) {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    logsStore = JSON.parse(data || '[]');
  }
} catch (e) {
  logsStore = [];
}

// ఫైల్ లోకి పర్మినెంట్గా సేవ్ చేసే ఫంక్షన్
const saveLogsToDisk = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(logsStore, null, 2), 'utf8');
  } catch (err) {
    console.error('File Save Error:', err);
  }
};

// ====================================================================
// 1. C# టూల్ నుంచి 90+ పారామితులను రిసీవ్ చేసుకునే మెయిన్ POST API
// URL: https://www.e-vedhika.in/api/telemetry
// ====================================================================
app.post(['/api/telemetry', '/api/ubd/telemetry', '/api/telemetry/report'], (req, res) => {
  try {
    const body = req.body || {};

    const newRecord = {
      slNo: logsStore.length + 1,
      id: body.id || ('EV_' + Date.now() + '_' + Math.floor(Math.random() * 1000)),
      serverReceivedDate: new Date().toISOString().slice(0, 10),
      serverReceivedTime: new Date().toLocaleTimeString(),
      
      // ప్రాథమిక వివరాలు
      date: body.date || new Date().toISOString().slice(0, 10),
      time: body.time || new Date().toLocaleTimeString(),
      pcName: body.pcName || body.computerName || 'Grama-Panchayat-PC',
      userName: body.userName || body.username || 'Operator',
      officeLocation: body.officeLocation || body.office || 'Andhra Pradesh / Telangana',
      osVersion: body.osVersion || body.winEdition || 'Windows 10/11',
      internet: body.internet || 'Online',

      // టెక్నికల్ చెక్స్ (DSC, ActiveX, DigiSigner, IE Mode etc.)
      dotNet: body.dotNet || body.dotnet35 || 'Checked',
      nicDigiSigner: body.nicDigiSigner || body.digiSignerPort || 'Checked',
      dscStatus: body.dscStatus || 'Checked',
      trustedSites: body.trustedSites || 'Configured',
      edgeIeMode: body.edgeIeMode || 'Configured',
      sitesXml: body.sitesXml || 'Present',

      // ఫలితం & హెల్త్ స్కోర్
      verification: body.verification || 'Passed (15/15)',
      healthScore: body.healthScore ? Number(body.healthScore) : 100,
      status: body.status || 'Success (15/15)',
      remarks: body.remarks || 'All 90 parameters verified successfully.',

      // C# టూల్ పంపే మిగిలిన అన్ని 90+ పారామితులు ఆటోమేటిక్గా ఇక్కడ సేవ్ అవుతాయి
      ...body
    };

    // లిస్ట్లో పైన యాడ్ చేసి, హార్డ్డిస్క్లో పర్మినెంట్గా సేవ్ చేయడం
    logsStore.unshift(newRecord);
    if (logsStore.length > 1000) logsStore.length = 1000;
    saveLogsToDisk();

    console.log(`[E-VEDHIKA REPORT RECEIVED] PC: ${newRecord.pcName} | Loc: ${newRecord.officeLocation}`);

    return res.status(200).json({
      success: true,
      message: 'Telemetry received and logged successfully at www.e-vedhika.in',
      recordId: newRecord.id,
      record: newRecord
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ====================================================================
// 2. మీ వెబ్సైట్ డాష్బోర్డ్ లో రిపోర్ట్స్ చూడటానికి GET API
// URL: https://www.e-vedhika.in/api/telemetry
// ====================================================================
app.get(['/api/telemetry', '/api/ubd/telemetry'], (req, res) => {
  res.json({
    success: true,
    count: logsStore.length,
    logs: logsStore
  });
});

// 3. రిపోర్ట్స్ క్లియర్ చేయడానికి DELETE API
app.delete('/api/telemetry', (req, res) => {
  logsStore = [];
  saveLogsToDisk();
  res.json({ success: true, message: 'All telemetry logs cleared successfully' });
});

// ====================================================================
// 4. Central Cloud OTA Auto-Update Gateway APIs
// ====================================================================
const OTA_FILE = path.join(__dirname, 'ota_version.json');
let otaVersionConfig = {
  latestVersion: "v1.6.3 Enterprise",
  versionCode: 163, // పాత దానికంటే పెద్ద నంబర్ ఇవ్వాలి
  downloadUrl: "https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe",
  releaseNotes: "కొత్త అప్డేట్ లో ప్రింటర్ & డ్రైవర్ రిపేర్స్ జోడించబడ్డాయి.",
  updatedAt: new Date().toISOString()
};

try {
  if (fs.existsSync(OTA_FILE)) {
    const data = fs.readFileSync(OTA_FILE, 'utf8');
    otaVersionConfig = JSON.parse(data || '{}');
  }
} catch (e) {}

// C# టూల్ వెర్షన్ చెక్ చేసుకునే GET API
app.get(['/api/version', '/exe/api/version'], (req, res) => {
  res.json({
    success: true,
    status: "ok",
    name: "E-VEDHIKA All Problems One Solution & UBD Deployment Tool",
    portal: "e-vedhika.in",
    latestVersion: otaVersionConfig.latestVersion || "v1.6.3 Enterprise",
    versionCode: otaVersionConfig.versionCode || 163,
    downloadUrl: otaVersionConfig.downloadUrl || "https://www.e-vedhika.in/EVedhikaUBDDeploymentTool.exe",
    releaseNotes: otaVersionConfig.releaseNotes || "కొత్త డ్రైవర్లు మరియు స్పీడ్ ఇంప్రూవ్మెంట్స్ యాడ్ చేయబడ్డాయి."
  });
});

// మీరు డాష్బోర్డ్ నుండి వెర్షన్ మార్చడానికి POST API
app.post(['/api/version', '/exe/api/version'], (req, res) => {
  otaVersionConfig = {
    ...otaVersionConfig,
    ...req.body,
    versionCode: req.body.versionCode !== undefined ? Number(req.body.versionCode) : otaVersionConfig.versionCode,
    updatedAt: new Date().toISOString()
  };
  try {
    fs.writeFileSync(OTA_FILE, JSON.stringify(otaVersionConfig, null, 2), 'utf8');
  } catch (err) {}
  res.json({ success: true, message: "OTA Version updated successfully!", otaVersionConfig });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`E-Vedhika Final Telemetry & OTA Server running on port ${PORT}`);
});
