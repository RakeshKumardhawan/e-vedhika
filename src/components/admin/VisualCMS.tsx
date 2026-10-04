import React, { useState } from 'react';
import { LayoutDashboard, Save, Plus, FileEdit, Trash2, Link as LinkIcon, RefreshCw, Eye } from 'lucide-react';

export function VisualCMS() {
  const [pages, setPages] = useState([
    { id: 1, title: 'Home', path: '/', status: 'Published', lastUpdated: '2 hours ago' },
    { id: 2, title: 'About Us', path: '/about', status: 'Published', lastUpdated: '1 day ago' },
    { id: 3, title: 'Contact', path: '/contact', status: 'Draft', lastUpdated: '3 days ago' },
    { id: 4, title: 'Privacy Policy', path: '/privacy', status: 'Published', lastUpdated: '1 week ago' }
  ]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-blue-600" /> Visual Public Page & Content Manager (CMS)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage public-facing pages, navbar items, and dynamic URL routes visually.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all flex items-center gap-1.5">
            <RefreshCw size={14} /> Refresh Cache
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5">
            <Plus size={14} /> Create New Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pages List */}
        <div className="lg:col-span-2 border border-slate-100 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Dynamic Pages Router</h4>
          </div>
          <ul className="divide-y divide-slate-100">
            {pages.map((page) => (
              <li key={page.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-slate-900 text-sm">{page.title}</h5>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${page.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {page.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><LinkIcon size={12} /> {page.path}</span>
                    <span>• Updated {page.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={16} /></button>
                   <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><FileEdit size={16} /></button>
                   <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Global Layout Elements */}
        <div className="space-y-4">
          <div className="border border-slate-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">Global Elements</h4>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-0.5">Primary Navbar</h5>
                  <p className="text-[10px] text-slate-500">Manage top navigation links</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><FileEdit size={14} /></button>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-0.5">Main Footer</h5>
                  <p className="text-[10px] text-slate-500">Manage footer columns & links</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><FileEdit size={14} /></button>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-slate-800 text-xs mb-0.5">SEO Meta Defaults</h5>
                  <p className="text-[10px] text-slate-500">Global title tags & descriptions</p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg"><FileEdit size={14} /></button>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5">
              <Save size={14} /> Save Layout Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
