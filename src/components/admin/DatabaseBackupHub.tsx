import React, { useState } from 'react';
import { Database, DownloadCloud, UploadCloud, RefreshCw, HardDrive, History, AlertTriangle } from 'lucide-react';

export function DatabaseBackupHub() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [backups, setBackups] = useState([
    { id: 'bk_9823', date: '2026-09-05 02:00 AM', size: '24.5 MB', type: 'Automated (Cron)' },
    { id: 'bk_9822', date: '2026-09-04 02:00 AM', size: '24.2 MB', type: 'Automated (Cron)' },
    { id: 'bk_manual_1', date: '2026-09-02 14:30 PM', size: '23.8 MB', type: 'Manual Admin Trigger' },
  ]);

  const handleRestore = () => {
    if(!confirm("WARNING: This will overwrite current production data with this backup. Are you sure?")) return;
    setIsRestoring(true);
    setTimeout(() => setIsRestoring(false), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Database size={20} className="text-indigo-600" /> Multi-Database & Backup Restore Hub
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage Firestore backups, upload snapshots, and restore databases securely.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-black transition-all flex items-center gap-1.5">
            <UploadCloud size={14} /> Upload Backup
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5">
            <DownloadCloud size={14} /> Create Snapshot Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Status */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
           <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HardDrive size={16} className="text-slate-600" /> Storage Status
           </h4>
           <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs font-bold mb-1">
                 <span className="text-slate-600">Primary Database</span>
                 <span className="text-indigo-600">24.5 MB / 1 GB</span>
               </div>
               <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-600 w-[2.5%]"></div>
               </div>
             </div>
             <div className="pt-4 border-t border-slate-200">
               <p className="text-[10px] text-slate-500 mb-2">Automated daily backups are active. Snapshots are retained for 30 days.</p>
               <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Replication Healthy
               </div>
             </div>
           </div>
        </div>

        {/* Backups List */}
        <div className="lg:col-span-3 border border-slate-100 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
             <h4 className="text-xs font-black text-indigo-800 uppercase tracking-wider flex items-center gap-2">
              <History size={14} /> Available Restore Points
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <th className="p-3">Snapshot ID</th>
                  <th className="p-3">Creation Date</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {backups.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-800">{bk.id}</td>
                    <td className="p-3 text-slate-600 font-medium">{bk.date}</td>
                    <td className="p-3 text-slate-500">{bk.size}</td>
                    <td className="p-3 text-slate-500">{bk.type}</td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                       <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger" title="Download ZIP">
                         <DownloadCloud size={16} />
                       </button>
                       <button 
                         onClick={handleRestore}
                         disabled={isRestoring}
                         className="px-3 py-1.5 bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 disabled:opacity-50"
                       >
                         {isRestoring ? <RefreshCw size={12} className="animate-spin" /> : <AlertTriangle size={12} />}
                         Restore
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
