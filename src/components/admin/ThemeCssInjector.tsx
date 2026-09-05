import React, { useState } from 'react';
import { Palette, Code, Save, RefreshCw, Layout, Eye } from 'lucide-react';

export function ThemeCssInjector() {
  const [isSaving, setIsSaving] = useState(false);
  const [customCSS, setCustomCSS] = useState('/* Add custom CSS rules here */\n.custom-banner {\n  background: linear-gradient(90deg, #1e3a8a, #3b82f6);\n  color: white;\n}');
  const [customJS, setCustomJS] = useState('// Inject Google Analytics or tracking pixels here\nconsole.log("E-Vedhika custom scripts loaded.");');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Palette size={20} className="text-purple-600" /> Multi-Theme & Custom CSS/JS Injector
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Inject custom styles, theme variables, and tracking scripts safely into the public portal.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />} 
          {isSaving ? 'Injecting...' : 'Save & Inject Globally'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* CSS Injector */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Code size={14} className="text-pink-400" /> styles.custom.css
            </h4>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">Public</span>
          </div>
          <textarea
            value={customCSS}
            onChange={(e) => setCustomCSS(e.target.value)}
            className="flex-1 w-full h-[300px] p-4 bg-[#0D1117] text-pink-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* JS Injector */}
        <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Code size={14} className="text-amber-400" /> scripts.head.js
            </h4>
            <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">&lt;head&gt; tags</span>
          </div>
          <textarea
            value={customJS}
            onChange={(e) => setCustomJS(e.target.value)}
            className="flex-1 w-full h-[300px] p-4 bg-[#0D1117] text-amber-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
