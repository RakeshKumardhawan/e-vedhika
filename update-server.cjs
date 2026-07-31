const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'server.ts'), 'utf8');

const newTelemetryLogic = `
// 1. ఇన్-మెమోరీ టెలిమెట్రీ & రిమోట్ క్యూ డేటాబేస్ స్టోర్
const telemetryLogsStore: any[] = [
  {
    slNo: 1,
    date: new Date().toISOString().slice(0, 10),
    time: '10:42:15',
    pcName: 'TS-SEC-MND-01',
    userName: 'Sec_Cyberabad',
    district: 'Ranga Reddy',
    mandal: 'Cyberabad Zone 1',
    panchayat: 'Cyberabad GP',
    secretaryName: 'Srinivas Rao',
    secretaryMobile: '9849012345',
    ipAddress: '192.168.1.104',
    macAddress: '00-1A-2B-3C-4D-5E',
    osVersion: 'Win11 Pro (64-bit)',
    internet: 'Online',
    dotNet: 'v3.5 & v4.8 Active',
    nicDigiSigner: 'Port 8080 Active',
    dscStatus: 'USB Token Connected',
    trustedSites: 'Zone 2 Configured',
    edgeIeMode: 'IE5 Quirks Active',
    sitesXml: 'Active',
    verification: 'Passed',
    version: 'v2.4',
    status: 'Success (15/15)',
    remarks: 'Edge IE Mode & USB DSC Token ready for UBD portal'
  }
];

const remoteQueueStore: any[] = [
  {
    id: 'REM-201',
    pcName: 'GP-SEC-DESK-09',
    userName: 'Secretary Srinivas',
    office: 'Khammam Urban Grama Panchayat',
    district: 'Khammam',
    anyDeskId: '984 210 432',
    issue: 'USB DSC Token driver showing Error Code 1201 in IE Mode',
    requestedTime: '5 mins ago',
    queueStatus: 'waiting',
    queueNumber: 1
  }
];

// 2. HTTP POST API: C# టూల్ నుండి లైవ్ నివేదికను స్వీకరించడం
app.post('/api/telemetry', (req, res) => {
  try {
    const payload = req.body;

    const newRecord = {
      slNo: telemetryLogsStore.length + 1,
      date: payload.date || new Date().toISOString().slice(0, 10),
      time: payload.time || new Date().toLocaleTimeString(),
      pcName: payload.pcName || 'Unknown-PC',
      userName: payload.userName || 'Panchayat-User',
      district: payload.district || 'Telangana District',
      mandal: payload.mandal || 'Mandal Office',
      panchayat: payload.panchayat || 'Grama Panchayat',
      secretaryName: payload.secretaryName || 'Grama Secretary',
      secretaryMobile: payload.secretaryMobile || 'N/A',
      ipAddress: payload.ipAddress || '192.168.1.1',
      macAddress: payload.macAddress || '00-00-00-00-00-00',
      osVersion: payload.osVersion || 'Windows OS',
      internet: payload.internet || 'Online',
      dotNet: payload.dotNet || 'v3.5 & v4.8 Active',
      nicDigiSigner: payload.nicDigiSigner || 'Port 8080 Active',
      dscStatus: payload.dscStatus || 'Connected',
      trustedSites: payload.trustedSites || 'Zone 2 Configured',
      edgeIeMode: payload.edgeIeMode || 'IE5 Quirks Active',
      sitesXml: payload.sitesXml || 'Active',
      verification: payload.verification || 'Passed',
      version: payload.version || 'v2.4',
      status: payload.status || 'Success (15/15)',
      remarks: payload.remarks || 'Deployed successfully'
    };

    telemetryLogsStore.unshift(newRecord);
    console.log(\`[CENTRAL TELEMETRY LOGGED] \${newRecord.pcName} - \${newRecord.status}\`);

    // Optional: save to firestore as well
    try {
      const db = admin.firestore();
      db.collection("telemetryLogs").add({
        pcName: newRecord.pcName,
        office: \`\${newRecord.panchayat}, \${newRecord.mandal}\`,
        status: newRecord.status,
        reportSummary: newRecord.remarks,
        timestamp: newRecord.date + ' ' + newRecord.time,
        ip: req.ip || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }).catch(e => console.error(e));
    } catch(e) {}

    return res.status(200).json({
      success: true,
      message: 'Telemetry report logged successfully at e-vedhika.onrender.com',
      record: newRecord
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. HTTP GET API: టెలిమెట్రీ నివేదికల లిస్ట్ పొందుట
app.get('/api/telemetry', (req, res) => {
  res.json({ success: true, count: telemetryLogsStore.length, logs: telemetryLogsStore });
});

// 4. HTTP POST & GET API: రిమోట్ డెస్క్‌టాప్ క్యూ మేనేజర్ API
app.post('/api/remote-queue', (req, res) => {
  const { action, id, queueStatus, pcName, userName, office, district, anyDeskId, issue } = req.body;

  if (action === 'update' && id) {
    const item = remoteQueueStore.find(q => q.id === id);
    if (item) {
      item.queueStatus = queueStatus || item.queueStatus;
      return res.json({ success: true, message: 'Queue status updated', item });
    }
  }

  const newItem = {
    id: \`REM-\${Math.floor(200 + Math.random() * 800)}\`,
    pcName: pcName || 'GP-SECRETARY-PC',
    userName: userName || 'Panchayat Secretary',
    office: office || 'Gram Panchayat Office',
    district: district || 'Telangana District',
    anyDeskId: anyDeskId || '991 204 883',
    issue: issue || 'DSC Token signature timeout in IE Mode',
    requestedTime: 'Just now',
    queueStatus: 'waiting',
    queueNumber: remoteQueueStore.filter(q => q.queueStatus === 'waiting').length + 1
  };

  remoteQueueStore.unshift(newItem);
  res.json({ success: true, message: 'Remote request added to queue', item: newItem });
});

app.get('/api/remote-queue', (req, res) => {
  res.json({ success: true, queue: remoteQueueStore });
});
`;

if (content.includes('// EXE Telemetry Endpoint')) {
  // Replace the old telemetry logic
  content = content.replace(
    /\/\/\s*EXE Telemetry Endpoint\s*app\.post\(['"]\/api\/telemetry['"][\s\S]*?\}\);/m,
    newTelemetryLogic
  );
} else {
  // Insert before Gemini Proxy
  content = content.replace('// Gemini Proxy', newTelemetryLogic + '\n\n  // Gemini Proxy');
}

fs.writeFileSync(path.join(__dirname, 'server.ts'), content);
