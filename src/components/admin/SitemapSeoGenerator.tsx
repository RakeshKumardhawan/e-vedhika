import React, { useState } from 'react';
import { Globe, FileCode2, RefreshCw, CheckCircle, Search, Settings, AlertCircle } from 'lucide-react';

export function SitemapSeoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [urls, setUrls] = useState([
    { loc: 'https://e-vedhika.in/', lastmod: '2026-09-05', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://e-vedhika.in/articles', lastmod: '2026-09-04', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://e-vedhika.in/about', lastmod: '2026-08-15', priority: '0.5', changefreq: 'monthly' },
    { loc: 'https://e-vedhika.in/contact', lastmod: '2026-08-15', priority: '0.5', changefreq: 'yearly' },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setUrls([{ loc: 'https://e-vedhika.in/new-feature', lastmod: new Date().toISOString().split('T')[0], priority: '0.7', changefreq: 'weekly' }, ...urls]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Globe size={20} className="text-emerald-600" /> Automated Sitemap & robots.txt Generator
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage search engine indexing, crawler rules, and XML sitemaps automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions & robots.txt */}
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              <FileCode2 size={16} className="text-emerald-600" /> XML Sitemap Status
            </h4>
            <p className="text-xs text-slate-600 mb-4">Your sitemap contains {urls.length} valid URLs and is accessible to Googlebot.</p>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
              className="w-full h-32 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              defaultValue="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;Disallow: /api/&#10;&#10;Sitemap: https://e-vedhika.in/sitemap.xml"
            />
            <button className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all">
              Save robots.txt
            </button>
          </div>
        </div>

        {/* Indexed URLs Table */}
        <div className="lg:col-span-2 border border-slate-100 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Search size={14} /> Indexed URLs
            </h4>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-500">
                  <th className="p-3">Location (URL)</th>
                  <th className="p-3">Last Modified</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Change Freq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-mono">
                {urls.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-blue-600 hover:underline cursor-pointer font-medium">{item.loc}</td>
                    <td className="p-3 text-slate-500">{item.lastmod}</td>
                    <td className="p-3 text-slate-600">{item.priority}</td>
                    <td className="p-3 text-slate-500">{item.changefreq}</td>
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
