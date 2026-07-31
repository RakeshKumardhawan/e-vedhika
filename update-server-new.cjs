const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'server.ts'), 'utf8');

// Update express.json() to handle 10mb limit for live remote screen frames
content = content.replace('app.use(express.json());', 'app.use(express.json({ limit: \'10mb\' }));');

// Remove old telemetry logic block
const oldLogicStart = '// 1. ఇన్-మెమోరీ టెలిమెట్రీ & రిమోట్ క్యూ డేటాబేస్ స్టోర్';
const oldLogicEndMatch = content.match(/app\.get\('\/api\/remote-queue'[\s\S]*?\}\);/);

if (content.includes(oldLogicStart) && oldLogicEndMatch) {
   const startIndex = content.indexOf(oldLogicStart);
   const endIndex = oldLogicEndMatch.index + oldLogicEndMatch[0].length;
   
   const newLogic = `// In-Memory Cloud Stores for Telemetry & Remote Queue
const telemetryLogsStore: any[] = [];
const remoteQueueStore: any[] = [];
const remoteScreenFramesStore: Record<string, { image: string; timestamp: number }> = {};
const pendingRemoteCommandsStore: Record<string, any[]> = {};

// 1. C# Executable నుండి వచ్చే Telemetry డేటాను రికార్డు చేసే API Route (Post)
app.post('/api/telemetry', (req, res) => {
  try {
    const body = req.body || {};
    const newRecord = {
      slNo: telemetryLogsStore.length + 1,
      date: body.date || new Date().toISOString().slice(0, 10),
      time: body.time || new Date().toLocaleTimeString(),
      pcName: body.pcName || 'Unknown-PC',
      userName: body.userName || 'Gram-Panchayat-User',
      healthScore: body.healthScore ? Number(body.healthScore) : 100,
      status: body.status || 'SUCCESS',
      ...body
    };

    telemetryLogsStore.unshift(newRecord);
    console.log(\`[CENTRAL TELEMETRY] \${newRecord.pcName} (\${newRecord.userName}) -> \${newRecord.status}\`);

    // Save to firestore as well
    try {
      const db = admin.firestore();
      db.collection("telemetryLogs").add({
        pcName: newRecord.pcName,
        office: \`\${newRecord.panchayat || ''}, \${newRecord.mandal || ''}\`,
        status: newRecord.status,
        reportSummary: newRecord.remarks || '',
        timestamp: newRecord.date + ' ' + newRecord.time,
        ip: req.ip || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }).catch(e => console.error(e));
    } catch(e) {}

    return res.status(200).json({
      success: true,
      message: 'Telemetry logged successfully to central server',
      recordId: newRecord.slNo
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Web UI కోసం Telemetry Logs అందించే API Route (Get)
app.get('/api/telemetry', (req, res) => {
  res.json({ success: true, count: telemetryLogsStore.length, logs: telemetryLogsStore });
});

// 3. Remote Assistance Request Queue API Routes
app.post('/api/remote-queue', (req, res) => {
  const { pcName, userName, status, remoteType } = req.body || {};
  const newItem = {
    id: \`REM-\${Date.now().toString().slice(-4)}\`,
    pcName: pcName || 'GP-DESK-PC',
    userName: userName || 'Panchayat User',
    office: 'Grama Panchayat Office',
    district: 'Telangana State',
    issue: 'Live Assistance Session Active',
    requestedTime: 'Just Now',
    queueStatus: 'waiting',
    queueNumber: remoteQueueStore.length + 1,
    remoteType: remoteType || 'Native_EVedhika_BuiltIn'
  };
  remoteQueueStore.unshift(newItem);
  res.json({ success: true, item: newItem });
});

app.get('/api/remote-queue', (req, res) => {
  res.json({ success: true, queue: remoteQueueStore });
});

// 4. Native Remote Desktop Live Screen Stream (POST from C# EXE / GET from Web)
app.post('/api/remote-stream', (req, res) => {
  const { pcName, image, timestamp } = req.body || {};
  if (pcName && image) {
    remoteScreenFramesStore[pcName] = { image, timestamp: timestamp || Date.now() };
  }
  return res.status(200).json({ success: true });
});

app.get('/api/remote-stream', (req, res) => {
  const pcName = req.query.pcName as string;
  if (pcName && remoteScreenFramesStore[pcName]) {
    return res.json({ success: true, ...remoteScreenFramesStore[pcName] });
  }
  return res.json({ success: false, message: 'No live screen frame' });
});

// 5. Remote Commands (Mouse Click / Keyboard Inputs sent to C# EXE)
app.post('/api/remote-commands', (req, res) => {
  const { pcName, type, x, y, key } = req.body || {};
  if (pcName && type) {
    if (!pendingRemoteCommandsStore[pcName]) pendingRemoteCommandsStore[pcName] = [];
    pendingRemoteCommandsStore[pcName].push({ type, x, y, key, timestamp: Date.now() });
  }
  return res.json({ success: true });
});

app.get('/api/remote-commands', (req, res) => {
  const pcName = req.query.pcName as string;
  if (pcName && pendingRemoteCommandsStore[pcName]?.length > 0) {
    const cmds = [...pendingRemoteCommandsStore[pcName]];
    pendingRemoteCommandsStore[pcName] = [];
    return res.json({ success: true, commands: cmds });
  }
  return res.json({ success: true, commands: [] });
});`;

   content = content.substring(0, startIndex) + newLogic + content.substring(endIndex);
   fs.writeFileSync(path.join(__dirname, 'server.ts'), content);
   console.log('Successfully updated server.ts');
} else {
   console.error('Could not find target logic to replace.');
}
