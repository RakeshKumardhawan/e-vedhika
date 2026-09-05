import React from 'react';
import { Lock, Activity, Globe, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

export function SslUptimeWatchdog() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-600" /> SSL Expiry & Global Uptime Watchdog
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Automated monitoring tracking domain health, SSL certificates, and global server availability.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border border-emerald-100">
          <RefreshCw size={14} /> Run Manual Check
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
             <Activity size={24} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500 uppercase">Global Uptime (30d)</p>
             <p className="text-2xl font-black text-slate-900">99.99%</p>
           </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
             <Lock size={24} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500 uppercase">SSL Expires In</p>
             <p className="text-2xl font-black text-slate-900">84 Days</p>
           </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
             <Globe size={24} />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500 uppercase">Avg Response Time</p>
             <p className="text-2xl font-black text-slate-900">124ms</p>
           </div>
        </div>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe size={14} /> Edge Nodes Ping Status
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800 border-b border-slate-700 text-[10px] font-black uppercase text-slate-400">
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Response Time</th>
                <th className="p-3 text-right">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 text-xs font-mono bg-slate-900 text-slate-300">
              {['New York, USA', 'London, UK', 'Mumbai, IND', 'Tokyo, JPN', 'Sydney, AUS'].map((loc, i) => (
                <tr key={loc}>
                  <td className="p-3 font-bold">{loc}</td>
                  <td className="p-3 text-emerald-400 flex items-center gap-1"><ShieldCheck size={12}/> Online</td>
                  <td className="p-3">{80 + (i * 25)}ms</td>
                  <td className="p-3 text-right text-slate-500">Just now</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
