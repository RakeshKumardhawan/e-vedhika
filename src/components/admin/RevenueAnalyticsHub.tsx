import React, { useState, useEffect } from 'react';
import { DollarSign, Shield, CheckCircle2, AlertCircle, RefreshCw, Globe, ExternalLink, Code } from 'lucide-react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

export function RevenueAnalyticsHub() {
  const [adConfig, setAdConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adsTxtVerified, setAdsTxtVerified] = useState<boolean | null>(null);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "site_settings", "home_page"));
      if (snap.exists()) {
        setAdConfig(snap.data()?.ads || {});
      } else {
        const fallbackSnap = await getDoc(doc(db, "settings", "site_config"));
        setAdConfig(fallbackSnap.data()?.ads || {});
      }

      // Check ads.txt endpoint
      try {
        const adsRes = await fetch('/ads.txt');
        if (adsRes.ok) {
          const txt = await adsRes.text();
          setAdsTxtVerified(txt.includes('pub-') || txt.includes('google.com'));
        } else {
          setAdsTxtVerified(false);
        }
      } catch {
        setAdsTxtVerified(false);
      }
    } catch (e) {
      console.warn("Could not fetch ad config:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const isAdSenseEnabled = Boolean(adConfig?.adsenseEnabled);
  const publisherId = adConfig?.adsenseClient || "Not Configured";
  const sidebarSlot = adConfig?.adsenseSlotSidebar || "Not Configured";
  const inArticleSlot = adConfig?.adsenseSlotInArticle || "Not Configured";
  const globalAdsEnabled = adConfig?.globalAdsEnabled ?? true;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <DollarSign size={20} className="text-emerald-600" /> Google AdSense & Monetization Hub
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Active configuration, publisher status, slot mapping, and ads.txt verification.
            </p>
          </div>
          <button 
            onClick={fetchConfig}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Real Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Global Ad Serving</span>
              <Shield size={14} className={globalAdsEnabled ? "text-emerald-600" : "text-amber-600"} />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className={`text-xl font-black ${globalAdsEnabled ? "text-emerald-700" : "text-amber-700"}`}>
                {globalAdsEnabled ? "Active (Enabled)" : "Disabled"}
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Master switch for portal ads</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Google AdSense</span>
              <DollarSign size={14} className={isAdSenseEnabled ? "text-blue-600" : "text-slate-400"} />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className={`text-xl font-black ${isAdSenseEnabled ? "text-blue-700" : "text-slate-700"}`}>
                {isAdSenseEnabled ? "Enabled" : "Disabled"}
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Google Ad script integration</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">ads.txt Route</span>
              <Globe size={14} className={adsTxtVerified ? "text-emerald-600" : "text-amber-600"} />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className={`text-xl font-black ${adsTxtVerified ? "text-emerald-700" : "text-amber-700"}`}>
                {adsTxtVerified ? "Verified (/ads.txt)" : "Pending Check"}
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Served at domain root for crawler</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Custom HTML Ads</span>
              <Code size={14} className="text-purple-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-800">
                {adConfig?.customAdsEnabled ? "Enabled" : "Disabled"}
              </h4>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Direct partner sponsor slots</p>
          </div>
        </div>

        {/* Configuration Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Current AdSense Slot Configuration
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Publisher Client ID</span>
              <span className="font-mono font-bold text-slate-800 break-all">{publisherId}</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Sidebar Slot ID</span>
              <span className="font-mono font-bold text-slate-800">{sidebarSlot}</span>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1">In-Article Slot ID</span>
              <span className="font-mono font-bold text-slate-800">{inArticleSlot}</span>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong>ℹ️ Real-time Ad Revenue Telemetry:</strong> Google AdSense earnings, impressions, and CTR metrics are hosted exclusively inside your official <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-blue-700 inline-flex items-center gap-1">Google AdSense Console <ExternalLink size={12} /></a>. To update ad slot IDs or toggle ad visibility on this website, manage your settings in the Ad Management section.
          </div>
        </div>
      </div>
    </div>
  );
}
