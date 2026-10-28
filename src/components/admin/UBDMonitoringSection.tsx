import React, { useState } from 'react';
import { Activity, ExternalLink, Radio, ChevronRight, RefreshCw, Maximize2 } from 'lucide-react';
import { TelegramNotificationCard } from './TelegramNotificationCard';

interface UBDMonitoringSectionProps {
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export function UBDMonitoringSection({ addToast }: UBDMonitoringSectionProps) {
  const [isLiveOpen, setIsLiveOpen] = useState(true);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const handlePreview = async (type: "daily" | "monthly") => {
    setIsPreviewLoading(true);
    setPreviewData(null);
    try {
      if (type === "daily") {
        setPreviewTitle("Daily GP Health Report Preview");
        setDownloadUrl("/api/reports/download-excel");
        const res = await fetch("/api/telemetry");
        const data = await res.json();
        if (data.success && Array.isArray(data.logs)) {
          setPreviewData(data.logs);
        }
      } else {
        setPreviewTitle("Monthly Master Report Preview");
        setDownloadUrl("/api/reports/monthly-excel");
        const res = await fetch("/admin/monthly_reports_archive.json");
        const data = await res.json();
        // Archive structure is {"YYYY-MM": [...]}
        const allLogs = (data && typeof data === 'object' && !Array.isArray(data)) ? Object.values(data).flat() : (Array.isArray(data) ? data : []);
        setPreviewData(allLogs);
      }
    } catch (err) {
      if (addToast) addToast("Failed to load preview data", "error");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-left animate-in fade-in duration-300">
      
      {/* Main Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[36px] text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1.5">
              <Activity size={13} className="animate-pulse" />
              UBD Monitoring
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            UBD Monitoring Center
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium mt-1">
            Live status and telemetry console for E-Vedhika UBD Deployment Tool (EXE).
          </p>
        </div>
      </div>

      {/* Live Monitoring Card */}
      <div className="bg-white rounded-[36px] border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200">
        
        <div 
          onClick={() => setIsLiveOpen(!isLiveOpen)}
          className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Radio size={28} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Live Monitoring
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Live data and office ID sync records of Telangana Grama Panchayat desktop clients.
              </p>
            </div>
          </div>

          <button className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5">
            <span>{isLiveOpen ? "Collapse" : "View Data"}</span>
            <ChevronRight size={16} className={`transition-transform duration-200 ${isLiveOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {isLiveOpen && (
          <div className="p-4 sm:p-6 bg-slate-950 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 text-white">
              <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> LIVE STREAM ACTIVE
                </span>
                <span>•</span>
                <span>URL: <code className="text-blue-300">admin/exe_ubd_live.html</code></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const iframe = document.getElementById('ubdLiveIframe') as HTMLIFrameElement;
                    if (iframe) iframe.src = iframe.src;
                    if (addToast) addToast("Telemetry refreshed!", "info");
                  }}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <RefreshCw size={13} /> Refresh
                </button>

                <a
                  href="/admin/exe_ubd_live.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Maximize2 size={13} /> Full Screen
                </a>
              </div>
            </div>

            <div className="relative w-full h-[800px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              {isIframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10 text-slate-400 gap-3">
                  <RefreshCw size={28} className="animate-spin text-blue-500" />
                  <p className="text-xs font-mono">Loading Live Telemetry Stream...</p>
                </div>
              )}
              <iframe
                id="ubdLiveIframe"
                src="/admin/exe_ubd_live.html"
                title="UBD Live Monitoring Console"
                className="w-full h-full border-0"
                onLoad={() => setIsIframeLoading(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Data & Reports Center Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Data & Reports Center</h3>
            <p className="text-xs text-slate-500 font-bold">Preview data tables before downloading Excel files.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Excel Preview */}
          <button 
            onClick={() => handlePreview("daily")}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group text-left w-full cursor-pointer"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Daily Health Report</h4>
            <p className="text-[10px] text-slate-500 mt-1">Preview Data</p>
          </button>

          {/* Monthly Master Preview */}
          <button 
            onClick={() => handlePreview("monthly")}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group text-left w-full cursor-pointer"
          >
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Monthly Master</h4>
            <p className="text-[10px] text-slate-500 mt-1">Monthly Master Preview</p>
          </button>

          {/* Consolidated JSON */}
          <a 
            href="/admin/consolidated_health.json" 
            target="_blank"
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all group"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Consolidated Data</h4>
            <p className="text-[10px] text-slate-500 mt-1">Raw JSON: consolidated_health.json</p>
          </a>

          {/* Monthly Archive JSON */}
          <a 
            href="/admin/monthly_reports_archive.json" 
            target="_blank"
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition-all group"
          >
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Activity size={20} />
            </div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Monthly Archive</h4>
            <p className="text-[10px] text-slate-500 mt-1">Raw JSON: monthly_reports_archive.json</p>
          </a>
        </div>
      </div>

      {/* Preview Section */}
      {(isPreviewLoading || previewData) && (
        <div className="mt-8 bg-white rounded-[36px] border border-slate-200 p-6 sm:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-300 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{previewTitle}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                {isPreviewLoading ? "Loading Data..." : `Showing ${previewData?.length} Records`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {previewData && (
                <a 
                  href={downloadUrl}
                  target="_blank"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition-all shadow-md flex items-center gap-2"
                >
                  <Maximize2 size={14} /> Download Excel (.xlsx)
                </a>
              )}
              <button 
                onClick={() => setPreviewData(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>

          {isPreviewLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
              <RefreshCw size={32} className="animate-spin text-blue-600" />
              <p className="font-bold text-sm">Fetching report data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-100">
              <table className="w-full text-left border-collapse bg-white text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <th className="p-4">PC ID</th>
                    <th className="p-4">PC Name & User</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">District</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Health</th>
                    <th className="p-4">Date/Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {previewData?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-blue-600">{row.pcId || "N/A"}</td>
                      <td className="p-4">
                        <p className="font-black text-slate-900">{row.pcName || row.pc_name || "Unknown"}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{row.userName || row.user || "N/A"}</p>
                      </td>
                      <td className="p-4 font-medium text-slate-600">{row.officeLocation || row.panchayat || "N/A"}</td>
                      <td className="p-4 font-black text-slate-800">{row.district || "N/A"}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          String(row.status || "").includes("SUCCESS") ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {row.status || "REPORTED"}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-slate-900">{row.healthScore}%</span>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${row.healthScore}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-[10px]">
                        {row.date || row.serverReceivedDate} <br />
                        {row.time || row.serverReceivedTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Telegram Configuration & PC Mute Gateway */}
      <TelegramNotificationCard addToast={addToast} />
    </div>
  );
}

