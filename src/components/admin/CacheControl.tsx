import React, { useState } from 'react';
import { Globe, RefreshCw, Server, AlertCircle, CheckCircle2 } from 'lucide-react';

export function CacheControl() {
  const [isPurging, setIsPurging] = useState(false);
  const [purgeStatus, setPurgeStatus] = useState<string | null>(null);

  const handlePurge = () => {
    setIsPurging(true);
    setPurgeStatus(null);
    setTimeout(() => {
      setIsPurging(false);
      setPurgeStatus('Success');
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Globe size={20} className="text-blue-600" /> Global CDN & Cache Invalidation Control
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage edge cache, invalidate stale assets, and force CDN updates globally.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Server size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Purge Everything</h4>
              <p className="text-[10px] text-slate-500 font-medium">Instantly clear all cached resources globally.</p>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-slate-200 mb-4 text-xs text-slate-600">
            <p><strong>Warning:</strong> Purging all cache will temporarily increase load on your origin server as all edge nodes fetch fresh content.</p>
          </div>

          <button 
            onClick={handlePurge}
            disabled={isPurging}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isPurging ? (
              <><RefreshCw size={16} className="animate-spin" /> Purging CDN Edges...</>
            ) : (
              <><RefreshCw size={16} /> Purge All Cache</>
            )}
          </button>
          
          {purgeStatus === 'Success' && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} /> Cache successfully invalidated across all global nodes.
            </div>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 opacity-70">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-slate-200 rounded-lg text-slate-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Selective Purge (URLs)</h4>
              <p className="text-[10px] text-slate-500 font-medium">Clear specific URLs from the cache.</p>
            </div>
          </div>
          <div className="space-y-3">
            <textarea 
              disabled
              placeholder="e.g., https://e-vedhika.in/styles.css"
              className="w-full h-24 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <button disabled className="w-full py-2 bg-slate-300 text-slate-500 rounded-xl text-sm font-black transition-all">
              Purge Custom URLs
            </button>
            <p className="text-[9px] text-slate-400 text-center">Available in Enterprise Tier</p>
          </div>
        </div>
      </div>
    </div>
  );
}
