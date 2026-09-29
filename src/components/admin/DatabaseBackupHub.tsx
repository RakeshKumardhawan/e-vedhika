import React, { useState, useEffect, useRef } from 'react';
import { Database, DownloadCloud, UploadCloud, RefreshCw, HardDrive, History, AlertTriangle, CheckCircle2, ShieldAlert, FileText, Info } from 'lucide-react';
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, limit, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { BackupsView } from '../BackupsView';
import { logSystemActivity } from '../SecurityLogsSection';

export function DatabaseBackupHub() {
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
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
          list.push({ 
            id: doc.id, 
            title: doc.data().fileName || "Untitled Snapshot",
            notes: doc.data().type || "Manual JSON Snapshot",
            timestamp: doc.data().timestamp || Date.now(),
            size: doc.data().size || "0 KB",
            recordCount: doc.data().totalRecords || 0,
            createdBy: doc.data().adminEmail || "Admin",
            ...doc.data() 
          });
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

  const handleCreateSnapshot = async (title: string, notes: string) => {
    setIsExporting(true);
    try {
      const collectionsToBackup = [
        "users", "reports", "posts", "suggestions", "gos", "formats", 
        "telemetryLogs", "security_logs", "notifications", "changelog", "site_settings"
      ];

      const backupPayload: Record<string, any[]> = {
        _metadata: [{
          exportDate: new Date().toISOString(),
          timestamp: Date.now(),
          exportedBy: auth.currentUser?.email || "Super Admin",
          project: "e-vedhika-258f2",
          title: title || "Manual Export",
          notes
        }]
      };

      let totalRecords = 0;
      for (const colName of collectionsToBackup) {
        try {
          const snap = await getDocs(collection(db, colName));
          const docsData: any[] = [];
          snap.forEach((d) => { docsData.push({ _id: d.id, ...d.data() }); });
          backupPayload[colName] = docsData;
          totalRecords += docsData.length;
        } catch (colErr) {
          console.warn(`Could not export collection ${colName}:`, colErr);
        }
      }

      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
      const sizeLabel = blob.size > 1048576 ? `${(blob.size / (1024 * 1024)).toFixed(2)} MB` : `${(blob.size / 1024).toFixed(2)} KB`;

      const fileName = `e_vedhika_backup_${new Date().toISOString().slice(0, 10)}_${Date.now()}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await addDoc(collection(db, "system_backups"), {
        fileName,
        title: title || fileName,
        notes: notes || "Manual JSON Snapshot",
        date: new Date().toLocaleString("en-IN"),
        timestamp: Date.now(),
        size: sizeLabel,
        totalRecords,
        adminEmail: auth.currentUser?.email || "Admin",
        type: "Manual JSON Snapshot"
      });

      await logSystemActivity("BACKUP", "Snapshot Created", `Created snapshot with ${totalRecords} records`, { fileName }, "success");
    } catch (err: any) {
      console.error("Backup error:", err);
      alert("Backup failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreSnapshot = async (id: string) => {
    alert("Restoring snapshot " + id + ". Note: Full restoration is a privileged operation that requires Super Admin console access to prevent data loss.");
  };

  const handleDeleteSnapshot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snapshot record?")) return;
    try {
      await deleteDoc(doc(db, "system_backups", id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <BackupsView 
      snapshots={backups}
      onCreateSnapshot={handleCreateSnapshot}
      onRestoreSnapshot={handleRestoreSnapshot}
      onDeleteSnapshot={handleDeleteSnapshot}
      isRestoring={isRestoring}
    />
  );
}
