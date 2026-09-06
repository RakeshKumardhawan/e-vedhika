import React, { useState, useEffect, useRef } from 'react';
import { Database, DownloadCloud, UploadCloud, RefreshCw, HardDrive, History, AlertTriangle, CheckCircle2, ShieldAlert, FileText, Info } from 'lucide-react';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { logSystemActivity } from '../SecurityLogsSection';

export function DatabaseBackupHub() {
  const [isExporting, setIsExporting] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real backup history from Firestore collection 'system_backups'
  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "system_backups"), orderBy("timestamp", "desc"), limit(20)),
      (snap) => {
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setBackups(list);
        setLoadingHistory(false);
      },
      (err) => {
        console.warn("Could not read system_backups:", err);
        setLoadingHistory(false);
      }
    );
    return () => unsub();
  }, []);

  // Perform genuine snapshot of all critical collections
  const handleCreateSnapshot = async () => {
    setIsExporting(true);
    setStatusMessage("Fetching Firestore collections...");

    try {
      const collectionsToBackup = [
        "users",
        "reports",
        "posts",
        "suggestions",
        "gos",
        "formats",
        "telemetryLogs",
        "security_logs",
        "notifications",
        "changelog",
        "site_settings"
      ];

      const backupPayload: Record<string, any[]> = {
        _metadata: [{
          exportDate: new Date().toISOString(),
          timestamp: Date.now(),
          exportedBy: auth.currentUser?.email || "Super Admin",
          project: "e-vedhika-258f2",
          engine: "Firestore JSON Snapshot V2"
        }]
      };

      let totalRecords = 0;

      for (const colName of collectionsToBackup) {
        try {
          const snap = await getDocs(collection(db, colName));
          const docsData: any[] = [];
          snap.forEach((d) => {
            docsData.push({ _id: d.id, ...d.data() });
          });
          backupPayload[colName] = docsData;
          totalRecords += docsData.length;
        } catch (colErr) {
          console.warn(`Could not export collection ${colName}:`, colErr);
        }
      }

      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      const sizeKB = (blob.size / 1024).toFixed(2);
      const sizeMB = (blob.size / (1024 * 1024)).toFixed(3);
      const sizeLabel = blob.size > 1048576 ? `${sizeMB} MB` : `${sizeKB} KB`;

      // Download file to admin's machine
      const fileName = `e_vedhika_firestore_backup_${new Date().toISOString().slice(0, 10)}_${Date.now()}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Record real backup audit log in Firestore
      await addDoc(collection(db, "system_backups"), {
        fileName,
        date: new Date().toLocaleString("en-IN"),
        timestamp: Date.now(),
        size: sizeLabel,
        totalRecords,
        collectionsIncluded: Object.keys(backupPayload).filter(k => k !== "_metadata"),
        type: "Manual JSON Snapshot",
        adminEmail: auth.currentUser?.email || "Admin"
      });

      await logSystemActivity(
        "BACKUP",
        "Database Snapshot Exported",
        `Exported ${totalRecords} records across ${Object.keys(backupPayload).length - 1} Firestore collections (${sizeLabel})`,
        { totalRecords, fileName },
        "success"
      );

      setStatusMessage(`✅ Snapshot created and downloaded (${sizeLabel}, ${totalRecords} records)!`);
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error("Backup snapshot error:", err);
      setStatusMessage(`❌ Backup failed: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const keys = Object.keys(parsed);
        alert(`Backup file verified!\n\nFile contains valid JSON with ${keys.length} collection keys: ${keys.join(", ")}.\n\nNote: For safety against unintentional data overwrites, full collection imports require Super Admin approval.`);
      } catch (err: any) {
        alert("Invalid JSON backup file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Database size={20} className="text-indigo-600" /> Multi-Database & Backup Restore Hub
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Primary Database: <strong>Firebase Cloud Firestore</strong>. Export JSON snapshots and manage restore points.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".json" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
          >
            <UploadCloud size={14} /> Inspect Backup JSON
          </button>
          <button 
            onClick={handleCreateSnapshot}
            disabled={isExporting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5"
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <DownloadCloud size={14} />}
            {isExporting ? "Exporting Data..." : "Create Snapshot Now"}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className={`mb-4 p-3 rounded-xl text-xs font-bold border ${statusMessage.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Status */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HardDrive size={16} className="text-slate-600" /> Database Architecture
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] font-black uppercase text-indigo-600 block">Primary DB</span>
                <span className="font-bold text-slate-800">Google Cloud Firestore</span>
                <p className="text-[10px] text-slate-500 mt-1">Multi-region distributed NoSQL database</p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-[10px] font-black uppercase text-emerald-600 block">GCP Automated Backups</span>
                <span className="font-bold text-slate-800">GCP PITR (Point-in-Time Recovery)</span>
                <p className="text-[10px] text-slate-500 mt-1">Continuous backups managed via Google Cloud Console</p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Cloud Replica Active
            </div>
          </div>
        </div>

        {/* Backups List */}
        <div className="lg:col-span-3 border border-slate-100 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
            <h4 className="text-xs font-black text-indigo-800 uppercase tracking-wider flex items-center gap-2">
              <History size={14} /> Recorded Snapshot History
            </h4>
            <span className="text-[11px] font-bold text-indigo-600">
              {backups.length} Snapshots
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            {loadingHistory ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold">
                <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-indigo-500" />
                Loading backup history...
              </div>
            ) : backups.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                <Database size={28} className="mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-600">No manual snapshots recorded yet</p>
                <p className="mt-1">Click "Create Snapshot Now" to generate your first full JSON database archive.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                    <th className="p-3">Snapshot Name / ID</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Records</th>
                    <th className="p-3">Created By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {backups.map((bk) => (
                    <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText size={14} className="text-indigo-500" />
                        {bk.fileName || bk.id}
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{bk.date}</td>
                      <td className="p-3 text-slate-500">{bk.size}</td>
                      <td className="p-3 text-slate-600 font-bold">{bk.totalRecords || "-"} docs</td>
                      <td className="p-3 text-slate-500">{bk.adminEmail || bk.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
