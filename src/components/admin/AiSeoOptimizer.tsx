import React, { useState } from 'react';
import { Search, Sparkles, Target, Zap, RefreshCw } from 'lucide-react';

export function AiSeoOptimizer() {
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{title: string, desc: string, keywords: string} | null>(null);

  const handleOptimize = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResults({
        title: "Master React Hooks: UseEffect & UseState Explained | E-Vedhika",
        desc: "Learn how to build scalable React applications using advanced hook patterns. A complete guide for modern frontend developers.",
        keywords: "react hooks, frontend development, usestate, useeffect, javascript framework"
      });
      setIsGenerating(false);
    }, 2500);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-xs h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Search size={20} className="text-indigo-600" /> AI-Powered SEO Meta & Keyword Optimizer
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Intelligent tool that auto-generates optimized meta titles, descriptions, and focus keywords.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target URL or Article Content</label>
            <textarea 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste URL or raw article text here..."
              className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <button 
            onClick={handleOptimize}
            disabled={!url.trim() || isGenerating}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />} 
            {isGenerating ? 'Analyzing Content...' : 'Generate Meta Tags & Keywords'}
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          {results ? (
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  <Target size={12} /> Meta Title <span className="ml-auto text-emerald-600">{results.title.length}/60 chars</span>
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-blue-700 cursor-copy hover:bg-slate-50 transition-colors">
                  {results.title}
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  <Zap size={12} /> Meta Description <span className="ml-auto text-emerald-600">{results.desc.length}/160 chars</span>
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 cursor-copy hover:bg-slate-50 transition-colors">
                  {results.desc}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                  <Search size={12} /> Focus Keywords
                </label>
                <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-mono text-indigo-600 cursor-copy hover:bg-slate-50 transition-colors">
                  {results.keywords}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Sparkles size={32} className="mb-3 opacity-20" />
              <p className="text-sm font-bold text-slate-500">Waiting for input...</p>
              <p className="text-xs text-center mt-1 max-w-xs">Enter your content on the left, and our AI will generate perfectly sized, high-ranking SEO tags.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
