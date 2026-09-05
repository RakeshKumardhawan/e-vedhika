import React, { useState } from 'react';
import { Shield, ShieldAlert, Ban, Zap, AlertTriangle, Save, RefreshCw, ServerCrash } from 'lucide-react';

export function DDoSProtection() {
  const [rateLimit, setRateLimit] = useState(100);
  const [blockDuration, setBlockDuration] = useState(15);
  const [isSaving, setIsSaving] = useState(false);
  const [blockedIPs, setBlockedIPs] = useState([
    { ip: "192.168.1.104", reason: "Excessive Requests (API)", date: "2 mins ago" },
    { ip: "45.33.22.11", reason: "SQL Injection Pattern Detected", date: "15 mins ago" },
    { ip: "203.0.113.89", reason: "Brute Force Login Attempt", date: "1 hour ago" }
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleUnblock = (ip: string) => {
    setBlockedIPs(prev => prev.filter(item => item.ip !== ip));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert size={20} className="text-rose-600" /> API Rate Limiting & DDoS Protection
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Configure automated IP blocking rules, rate limits, and brute-force protection to safeguard the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all flex items-center gap-1.5">
            <RefreshCw size={14} /> Refresh Logs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" /> WAF Configuration
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Global Rate Limit (req/min)</label>
                <input 
                  type="number" 
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Max API requests per minute per IP address.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Auto-Block Duration (minutes)</label>
                <input 
                  type="number" 
                  value={blockDuration}
                  onChange={(e) => setBlockDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-xs font-bold text-slate-700">Enable AI Bot Detection Filtering</span>
                </label>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                  <span className="text-xs font-bold text-slate-700">Block Tor & Anonymous VPNs</span>
                </label>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full mt-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} 
              {isSaving ? 'Applying Rules...' : 'Save Protection Rules'}
            </button>
          </div>
        </div>

        {/* Live Blocked Traffic Table */}
        <div className="lg:col-span-2 border border-slate-100 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-rose-50 px-4 py-3 border-b border-rose-100 flex items-center justify-between">
            <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-2">
              <ServerCrash size={14} /> Active Blocked IP Addresses
            </h4>
            <span className="bg-rose-200 text-rose-800 px-2 py-0.5 rounded text-[10px] font-bold">
              {blockedIPs.length} Blocked
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Block Reason</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {blockedIPs.length > 0 ? (
                  blockedIPs.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{item.ip}</td>
                      <td className="p-3 text-slate-600 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-500" /> {item.reason}
                      </td>
                      <td className="p-3 text-slate-500 font-medium">{item.date}</td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => handleUnblock(item.ip)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:text-rose-600 text-slate-600 rounded-lg text-xs font-bold transition-all shadow-xs"
                        >
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400">
                      <Ban size={24} className="mx-auto mb-2 opacity-20" />
                      <p className="text-xs font-bold">No IPs currently blocked.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
