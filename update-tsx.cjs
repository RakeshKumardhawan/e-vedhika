const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, 'src/components/ExeUbdLiveMonitoring.tsx'), 'utf8');

// 1. Add useEffect to imports
content = content.replace(
  "import React, { useState } from 'react';",
  "import React, { useState, useEffect } from 'react';"
);

// 2. Add state hooks and remove hardcoded data
const oldStateBlock = `  // 16 Columns Central Telemetry Data
  const [centralTelemetryLogs] = useState([
    {
      slNo: 1,
      date: '2026-07-31',
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
      javaInstalled: 'Java 8 Executable',
      nicDigiSigner: 'Port 8080 Active',
      dscStatus: 'USB Token Connected',
      trustedSites: 'Zone 2 Configured',
      edgeIeMode: 'IE5 Quirks Active',
      sitesXml: 'Active',
      verification: 'Passed',
      version: 'v2.4',
      status: 'Success (15/15)',
      remarks: 'Edge IE Mode & USB DSC Token ready for UBD portal'
    },
    {
      slNo: 2,
      date: '2026-07-31',
      time: '10:15:02',
      pcName: 'PANCHAYAT-PC-04',
      userName: 'Panchayat_Sec_Nlg',
      district: 'Nalgonda',
      mandal: 'Nalgonda Urban',
      panchayat: 'Nalgonda GP 02',
      secretaryName: 'K. Rajeshwari',
      secretaryMobile: '9440188223',
      ipAddress: '192.168.2.45',
      macAddress: '00-2B-3C-4D-5E-6F',
      osVersion: 'Win10 Pro (64-bit)',
      internet: 'Online',
      dotNet: 'v3.5 Auto-Repaired',
      javaInstalled: 'Java 8 Executable',
      nicDigiSigner: 'Port 8080 Active',
      dscStatus: 'USB Token Connected',
      trustedSites: 'Zone 2 Configured',
      edgeIeMode: 'IE5 Quirks Active',
      sitesXml: 'Active',
      verification: 'Passed',
      version: 'v2.4',
      status: 'Success (15/15)',
      remarks: 'Auto-repaired .NET 3.5 framework successfully'
    }
  ]);

  // Live Remote Desktop Sharing & Waiting Queue
  const [remoteQueue, setRemoteQueue] = useState([
    {
      id: 'REM-201',
      pcName: 'GP-SEC-DESK-09',
      userName: 'Secretary Srinivas',
      office: 'Khammam Urban Grama Panchayat',
      district: 'Khammam',
      anyDeskId: '984 210 432',
      issue: 'USB DSC Token driver showing Error Code 1201 in IE Mode',
      requestedTime: '5 mins ago',
      queueStatus: 'waiting' as 'waiting' | 'in_progress' | 'connected' | 'resolved',
      queueNumber: 1
    },
    {
      id: 'REM-202',
      pcName: 'PANCHAYAT-PC-12',
      userName: 'Secretary Rajeshwari',
      office: 'Suryapet Mandal Office',
      district: 'Suryapet',
      anyDeskId: '772 194 009',
      issue: 'Need help installing .NET Framework 3.5 offline installer',
      requestedTime: '12 mins ago',
      queueStatus: 'waiting' as 'waiting' | 'in_progress' | 'connected' | 'resolved',
      queueNumber: 2
    }
  ]);`;

const newStateHooks = `  const [centralTelemetryLogs, setCentralTelemetryLogs] = useState<any[]>([]);
  const [remoteQueue, setRemoteQueue] = useState<any[]>([]);
  const [liveScreenFrame, setLiveScreenFrame] = useState<string | null>(null);

  // 1. Live Telemetry & Remote Requests Fetch Loop
  const fetchLiveCloudData = async () => {
    try {
      const telemRes = await fetch('/api/telemetry');
      if (telemRes.ok) {
        const data = await telemRes.json();
        if (data.logs && Array.isArray(data.logs)) {
          setCentralTelemetryLogs(data.logs);
        }
      }

      const remoteRes = await fetch('/api/remote-queue');
      if (remoteRes.ok) {
        const data = await remoteRes.json();
        if (data.queue && Array.isArray(data.queue)) {
          setRemoteQueue(data.queue);
        }
      }
    } catch (e) {
      console.warn('Syncing error:', e);
    }
  };

  useEffect(() => {
    fetchLiveCloudData();
    const interval = setInterval(fetchLiveCloudData, 10000); // 10 Sec Live Fetch
    return () => clearInterval(interval);
  }, []);

  // 2. Native Remote Desktop Live Screen Stream Rendering Loop
  useEffect(() => {
    let interval: any = null;
    if (activeRemoteModal) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(\`/api/remote-stream?pcName=\${encodeURIComponent(activeRemoteModal.pcName)}\`);
          const data = await res.json();
          if (data.success && data.image) {
            setLiveScreenFrame(\`data:image/jpeg;base64,\${data.image}\`);
          }
        } catch { }
      }, 400); // Frame Refresh Rate
    } else {
      setLiveScreenFrame(null);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [activeRemoteModal]);`;

content = content.replace(oldStateBlock, newStateHooks);

// 3. Update the remote dialog content to show the live image stream if available
const oldDialogContent = `<div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center flex-col p-4">
                <Video className="w-12 h-12 text-emerald-400 animate-pulse mb-2" />
                <p className="font-bold text-sm">{activeRemoteModal.userName} గారి కంప్యూటర్ స్క్రీన్ యాక్టివ్‌గా ఉంది</p>
                <p className="text-xs text-slate-400">Desk ID: {activeRemoteModal.anyDeskId}</p>
                <button 
                  onClick={() => alert(\`Sent remote fix command to \${activeRemoteModal.pcName}: Edge IE Mode & DSC Token restarted\`)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Fix IE Mode & USB Token Remotely
                </button>
              </div>`;

const newDialogContent = `<div className="aspect-video bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center flex-col p-0 overflow-hidden relative">
                {liveScreenFrame ? (
                  <img src={liveScreenFrame} alt="Live Remote Screen" className="w-full h-full object-contain bg-black" />
                ) : (
                  <>
                    <Video className="w-12 h-12 text-emerald-400 animate-pulse mb-2" />
                    <p className="font-bold text-sm">{activeRemoteModal.userName} గారి కంప్యూటర్ స్క్రీన్ యాక్టివ్‌గా ఉంది</p>
                    <p className="text-xs text-slate-400">Desk ID: {activeRemoteModal.anyDeskId}</p>
                    <p className="text-xs text-emerald-400 mt-2 animate-pulse">Waiting for live video frame from {activeRemoteModal.pcName}...</p>
                  </>
                )}
                
                <div className="absolute bottom-4 right-4">
                  <button 
                    onClick={() => {
                      fetch('/api/remote-commands', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pcName: activeRemoteModal.pcName, type: 'fix' })
                      });
                      alert(\`Sent remote fix command to \${activeRemoteModal.pcName}: Edge IE Mode & DSC Token restarted\`);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg"
                  >
                    Fix IE Mode & USB Token Remotely
                  </button>
                </div>
              </div>`;

content = content.replace(oldDialogContent, newDialogContent);

// Optional: check if telemetry table rendering needs fallback for empty state
const oldTableBody = `{centralTelemetryLogs.map((log) => (`;
const newTableBody = `{centralTelemetryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="p-8 text-center text-slate-500 font-medium bg-white">
                      Waiting for live telemetry reports from Panchayat PCs... (కంప్యూటర్ల నుండి రిపోర్టులు కోసం ఎదురుచూస్తున్నాము)
                    </td>
                  </tr>
                ) : centralTelemetryLogs.map((log) => (`;

content = content.replace(oldTableBody, newTableBody);

fs.writeFileSync(path.join(__dirname, 'src/components/ExeUbdLiveMonitoring.tsx'), content);
console.log('Successfully updated ExeUbdLiveMonitoring.tsx');
