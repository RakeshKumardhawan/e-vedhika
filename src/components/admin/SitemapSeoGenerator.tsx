import React, { useState, useEffect } from 'react';
import { Globe, FileCode2, RefreshCw, CheckCircle, Search, Settings, AlertCircle, Save } from 'lucide-react';
import { auth } from '../../../firebase';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  priority: string;
  changefreq: string;
}

export function SitemapSeoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingRobots, setIsSavingRobots] = useState(false);
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [robotsText, setRobotsText] = useState("User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://www.e-vedhika.in/sitemap.xml");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSitemapData = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/sitemap-urls', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUrls(data);
      } else {
        setErrorMsg("Failed to load real sitemap URLs from server.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Error connecting to sitemap API.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial robots.txt content from public/ or server
  const fetchRobotsText = async () => {
    try {
      const res = await fetch('/robots.txt');
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          setRobotsText(text);
        }
      }
    } catch (e) {
      console.warn("Could not load current robots.txt, using default template", e);
    }
  };

  useEffect(() => {
    fetchSitemapData();
    fetchRobotsText();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/regenerate-sitemap', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        setStatusMsg("సitemap విజయవంతంగా పునరుత్పత్తి చేయబడింది! (Sitemap successfully regenerated!)");
        await fetchSitemapData();
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || "Sitemap regeneration failed.");
      }
    } catch (err: any) {
      setErrorMsg("Error triggering sitemap regeneration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveRobots = async () => {
    setIsSavingRobots(true);
    setStatusMsg("");
    setErrorMsg("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/save-robots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ robotsContent: robotsText })
      });
      
      if (res.ok) {
        setStatusMsg("robots.txt విజయవంతంగా సేవ్ చేయబడింది! (robots.txt saved successfully!)");
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || "Failed to save robots.txt.");
      }
    } catch (err: any) {
      setErrorMsg("Error saving robots.txt to server.");
    } finally {
      setIsSavingRobots(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Globe size={20} className="text-emerald-600" /> Automated Sitemap & robots.txt Generator
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage search engine indexing, crawler rules, and XML sitemaps automatically with Firestore sync.</p>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle size={16} /> {statusMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions & robots.txt */}
        <div className="space-y-6">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <FileCode2 size={16} className="text-emerald-600" /> XML Sitemap Status
            </h4>
            <p className="text-xs text-slate-600 mb-4">
              {loading ? 'Sitemap is loading...' : `Your sitemap contains ${urls.length} live and dynamic URLs.`}
            </p>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />} 
              {isGenerating ? 'Crawling Pages...' : 'Regenerate Sitemap.xml'}
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
             <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Settings size={16} className="text-slate-600" /> robots.txt Editor
            </h4>
            <textarea 
              value={robotsText}
              onChange={(e) => setRobotsText(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
            <button 
              onClick={handleSaveRobots}
              disabled={isSavingRobots}
              className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSavingRobots ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              {isSavingRobots ? 'Saving...' : 'Save robots.txt'}
            </button>
          </div>
        </div>

        {/* Indexed URLs Table */}
        <div className="lg:col-span-2 border border-slate-100 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Search size={14} /> Indexed URLs
            </h4>
            <button 
              onClick={fetchSitemapData}
              disabled={loading}
              className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> Refresh List
            </button>
          </div>
          <div className="overflow-x-auto flex-1 max-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500 sticky top-0">
                  <th className="p-3 bg-slate-50">Location (URL)</th>
                  <th className="p-3 bg-slate-50">Last Modified</th>
                  <th className="p-3 bg-slate-50">Priority</th>
                  <th className="p-3 bg-slate-50">Change Freq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">
                      <RefreshCw size={16} className="animate-spin mx-auto mb-2 text-slate-300" />
                      యూఆర్‌ఎల్‌లు లోడ్ అవుతున్నాయి... (Loading URLs...)
                    </td>
                  </tr>
                ) : urls.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">
                      సitemapలో ఎటువంటి యూఆర్‌ఎల్‌లు లేవు. (No URLs in sitemap. Click regenerate to create one.)
                    </td>
                  </tr>
                ) : (
                  urls.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-blue-600 hover:underline cursor-pointer font-medium truncate max-w-[280px]">
                        <a href={item.loc} target="_blank" rel="noopener noreferrer">{item.loc}</a>
                      </td>
                      <td className="p-3 text-slate-500">{item.lastmod}</td>
                      <td className="p-3 text-slate-600">{item.priority}</td>
                      <td className="p-3 text-slate-500">{item.changefreq}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
