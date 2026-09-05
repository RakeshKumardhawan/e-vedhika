import React, { useState } from 'react';
import { Languages, Type, Globe2, Save, CheckCircle2 } from 'lucide-react';

export function LocalizationManager() {
  const [activeLang, setActiveLang] = useState<'en' | 'te'>('te');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Languages size={20} className="text-[#0B3D91]" /> Multi-Language & Telugu Localization
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage dictionary strings, UI translations, and default fallback languages.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#0B3D91] hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md"
        >
          {saved ? <CheckCircle2 size={14} /> : <Save size={14} />} 
          {saved ? 'Saved!' : 'Save Translations'}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveLang('te')}
          className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${activeLang === 'te' ? 'bg-blue-50 border-blue-200 text-[#0B3D91] shadow-sm font-black' : 'bg-white border-slate-200 text-slate-500 font-bold'}`}
        >
          <Type size={18} /> తెలుగు (Telugu) - 98% Complete
        </button>
        <button 
          onClick={() => setActiveLang('en')}
          className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${activeLang === 'en' ? 'bg-blue-50 border-blue-200 text-[#0B3D91] shadow-sm font-black' : 'bg-white border-slate-200 text-slate-500 font-bold'}`}
        >
          <Globe2 size={18} /> English - 100% Complete
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
         <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 grid grid-cols-2 gap-4">
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">String Key</h4>
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Translated Value ({activeLang.toUpperCase()})</h4>
         </div>
         <div className="overflow-y-auto flex-1 p-4 space-y-4">
           {[
             { key: 'navbar.home', valTe: 'హోమ్', valEn: 'Home' },
             { key: 'navbar.about', valTe: 'మా గురించి', valEn: 'About Us' },
             { key: 'navbar.contact', valTe: 'సంప్రదించండి', valEn: 'Contact' },
             { key: 'btn.read_more', valTe: 'ఇంకా చదవండి', valEn: 'Read More' },
             { key: 'footer.rights', valTe: 'సర్వ హక్కులు ప్రత్యేకించబడినవి.', valEn: 'All Rights Reserved.' },
           ].map((item) => (
             <div key={item.key} className="grid grid-cols-2 gap-4 items-center">
               <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs font-mono text-slate-600">
                 {item.key}
               </div>
               <input 
                 type="text" 
                 defaultValue={activeLang === 'te' ? item.valTe : item.valEn}
                 className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
