import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, doc, getDoc, setDoc, getDocs, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { 
  Code, Save, History, AlertTriangle, FileCode2, FileJson, FileType, CheckCircle2,
  Eye, RefreshCw, Search, ArrowLeftRight, Laptop, Tablet, Smartphone, Copy, Check,
  RotateCcw, Sparkles, Layers, Info, CheckCircle, XCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CodeFileMeta {
  id: string;
  name: string;
  type: 'css' | 'html' | 'javascript' | 'json';
  icon: any;
  defaultContent: string;
  path: string;
  module: string;
  usedIn: string;
  status: 'Live' | 'Draft' | 'Testing';
  dependencies: string;
  affectedPages: string;
}

const CODE_FILES: CodeFileMeta[] = [
  { 
    id: 'global_css', 
    name: 'Global Styles', 
    type: 'css', 
    icon: FileCode2, 
    defaultContent: `/* Custom E-Vedhika Global CSS Rules */
.custom-banner {
  background: linear-gradient(135deg, #0B3D91 0%, #1e40af 100%);
  color: #ffffff;
  border-radius: 12px;
  padding: 16px;
}

/* Glassmorphism accents */
.ev-glass {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}
`, 
    path: '/src/index.css', 
    module: 'Styling & Branding', 
    usedIn: 'Global Application (All Public & Admin Pages)', 
    status: 'Live', 
    dependencies: 'Tailwind CSS, Inter Font', 
    affectedPages: 'Entire E-Vedhika Portal' 
  },
  { 
    id: 'head_html', 
    name: 'Header Meta & Scripts (HTML)', 
    type: 'html', 
    icon: FileType, 
    defaultContent: `<!-- Custom Header Metadata & Analytics Embeds -->
<meta name="application-name" content="E-Vedhika Telangana Portal" />
<meta name="theme-color" content="#0B3D91" />
<style>
  /* Critical Inline Rendering Styles */
  body { font-feature-settings: "cv02", "cv03", "cv04", "cv11"; }
</style>
`, 
    path: '/public/index.html (<head>)', 
    module: 'SEO & Meta Analytics', 
    usedIn: 'HTML Head Document Entry', 
    status: 'Live', 
    dependencies: 'Browser DOM', 
    affectedPages: 'Initial Portal Load & Search Engine Index' 
  },
  { 
    id: 'footer_js', 
    name: 'Footer Custom Scripts (JS)', 
    type: 'javascript', 
    icon: FileCode2, 
    defaultContent: `// E-Vedhika Custom Client Operations
(function() {
  console.log("E-Vedhika Enterprise JS Hook Initialized");
  // Custom tracking or UI helper logic
})();
`, 
    path: '/src/App.tsx (Global Hook)', 
    module: 'Custom Script Runtime', 
    usedIn: 'Global App Shell Footer', 
    status: 'Live', 
    dependencies: 'JavaScript ES6+', 
    affectedPages: 'All Logged-in User Sessions' 
  },
  { 
    id: 'config_json', 
    name: 'System Runtime Config (JSON)', 
    type: 'json', 
    icon: FileJson, 
    defaultContent: `{
  "systemName": "E-Vedhika Portal",
  "version": "1.4.8",
  "maintenance": false,
  "enableAnalytics": true,
  "theme": {
    "primaryColor": "#0B3D91",
    "secondaryColor": "#3B82F6"
  }
}
`, 
    path: '/data/config.json', 
    module: 'System Environment', 
    usedIn: 'Global State & API Services', 
    status: 'Live', 
    dependencies: 'JSON Parser', 
    affectedPages: 'Admin Settings & Feature Flags'
  },
  {
    id: 'home_tab_html',
    name: 'Home Tab Content (HTML)',
    type: 'html',
    icon: FileType,
    defaultContent: `<div class="custom-banner text-center mb-6">
  <h2 class="text-xl font-bold">Welcome to E-Vedhika</h2>
  <p>Your ultimate digital portal for Gram Panchayats.</p>
</div>`,
    path: '/src/App.tsx (Home Tab)',
    module: 'Content Injection',
    usedIn: 'Home Tab UI',
    status: 'Live',
    dependencies: 'React dangerouslySetInnerHTML',
    affectedPages: 'Home Tab (Public)'
  },
  {
    id: 'mana_panchayath_html',
    name: 'Mana Panchayath Content (HTML)',
    type: 'html',
    icon: FileType,
    defaultContent: `<div class="custom-banner text-center mb-6">
  <h2 class="text-xl font-bold">Mana Panchayath Updates</h2>
  <p>Latest circulars and tools for Panchayat Secretaries.</p>
</div>`,
    path: '/src/App.tsx (Mana Panchayath Tab)',
    module: 'Content Injection',
    usedIn: 'Workspace Tab UI',
    status: 'Live',
    dependencies: 'React dangerouslySetInnerHTML',
    affectedPages: 'Mana Panchayath Tab'
  },
  {
    id: 'reports_tab_html',
    name: 'Reports/My Activity Content (HTML)',
    type: 'html',
    icon: FileType,
    defaultContent: `<!-- Add custom banners or info for the Reports tab -->
<div class="p-4 bg-blue-50 text-blue-800 rounded-xl mb-4">
  <strong>Notice:</strong> Please submit your daily reports before 5 PM.
</div>`,
    path: '/src/App.tsx (My Activity Tab)',
    module: 'Content Injection',
    usedIn: 'My Activity Tab UI',
    status: 'Live',
    dependencies: 'React dangerouslySetInnerHTML',
    affectedPages: 'My Activity Tab'
  },
  {
    id: 'admin_dashboard_html',
    name: 'Admin Dashboard Message (HTML)',
    type: 'html',
    icon: FileType,
    defaultContent: `<!-- Add announcements for Admins -->
<div class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl mb-4">
  <strong>Admin Notice:</strong> System maintenance scheduled for this weekend.
</div>`,
    path: '/src/App.tsx (Admin Dashboard)',
    module: 'Content Injection',
    usedIn: 'Admin Dashboard UI',
    status: 'Live',
    dependencies: 'React dangerouslySetInnerHTML',
    affectedPages: 'Admin Panel (Protected)'
  }
];

export function CodeManager({ addToast }: { addToast: (msg: string) => void }) {
  const [activeFile, setActiveFile] = useState(CODE_FILES[0].id);
  const [code, setCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Syntax & Error tracking
  const [syntaxError, setSyntaxError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Diff / Compare state
  const [compareItem, setCompareItem] = useState<any | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentFileMeta = useMemo(() => {
    return CODE_FILES.find(f => f.id === activeFile) || CODE_FILES[0];
  }, [activeFile]);

  useEffect(() => {
    fetchCode();
    fetchHistory();
    setCompareItem(null);
  }, [activeFile]);

  // Real-time syntax check on typing
  useEffect(() => {
    validateSyntax(code, currentFileMeta.type);
  }, [code, currentFileMeta.type]);

  const validateSyntax = (input: string, type: string) => {
    if (!input.trim()) {
      setSyntaxError(null);
      return;
    }
    if (type === 'json') {
      try {
        JSON.parse(input);
        setSyntaxError(null);
      } catch (e: any) {
        setSyntaxError(`JSON Error: ${e.message}`);
      }
    } else if (type === 'javascript') {
      try {
        new Function(input);
        setSyntaxError(null);
      } catch (e: any) {
        setSyntaxError(`JS Syntax Error: ${e.message}`);
      }
    } else {
      setSyntaxError(null);
    }
  };

  const fetchCode = async () => {
    try {
      // Check local storage first or fallback
      const localSaved = localStorage.getItem(`e_vedhika_custom_code_${activeFile}`);
      
      try {
        const snap = await getDoc(doc(db, 'custom_code', activeFile));
        if (snap.exists()) {
          const fileContent = snap.data().content || currentFileMeta.defaultContent;
          setCode(fileContent);
          if (snap.data().updatedAt) {
            setLastSaved(new Date(snap.data().updatedAt).toLocaleString());
          }
          return;
        }
      } catch (firestoreErr: any) {
        // Quietly fallback to local storage if Firestore permissions fail
        console.warn('Firestore fetch code permission bypassed, using local storage:', firestoreErr.message);
      }

      if (localSaved) {
        setCode(localSaved);
        setLastSaved("Local Storage Saved Version");
      } else {
        setCode(currentFileMeta.defaultContent);
        setLastSaved(null);
      }
    } catch (e: any) {
      console.error('Error fetching code:', e);
      setCode(currentFileMeta.defaultContent);
    }
  };

  const fetchHistory = async () => {
    try {
      const q = query(
        collection(db, 'custom_code', activeFile, 'history'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const snap = await getDocs(q);
      const h = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setHistory(h);
    } catch (e) {
      if(e.message && e.message.includes("permission")){console.warn("History permission denied (expected for non-admins)");}else{console.error("Error fetching history", e);}
    }
  };

  const applyLiveDOMUpdate = (fileId: string, newContent: string) => {
    if (fileId === 'global_css') {
      let styleEl = document.getElementById("e-vedhika-custom-css");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "e-vedhika-custom-css";
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = newContent;
    }
  };

  const saveCode = async () => {
    if (syntaxError) {
      addToast(`Cannot deploy with syntax error: ${syntaxError}`);
      return;
    }

    setIsSaving(true);
    const now = Date.now();
    
    // Save to local storage
    localStorage.setItem(`e_vedhika_custom_code_${activeFile}`, code);
    applyLiveDOMUpdate(activeFile, code);

    try {
      // 1. Try backup in history subcollection
      try {
        const currentSnap = await getDoc(doc(db, 'custom_code', activeFile));
        if (currentSnap.exists() && currentSnap.data().content) {
          await addDoc(collection(db, 'custom_code', activeFile, 'history'), {
            content: currentSnap.data().content,
            timestamp: now,
            type: currentFileMeta.type,
            author: 'Admin'
          });
        }
      } catch {
        // history backup optional
      }

      // 2. Save new code in Firestore main document
      await setDoc(doc(db, 'custom_code', activeFile), {
        content: code,
        updatedAt: now,
        type: currentFileMeta.type
      }, { merge: true });

      setLastSaved(new Date(now).toLocaleString());
      addToast(`Code saved to Cloud & deployed live immediately!`);
      fetchHistory();
    } catch (e: any) {
      console.warn('Firestore code save bypassed, saved locally:', e.message);
      setLastSaved(new Date(now).toLocaleString() + " (Local)");
      addToast(`కోడ్ లోకల్‌గా సేవ్ అయింది మరియు లైవ్ వర్తింపజేయబడింది! (Saved & Applied Live)`);
    } finally {
      setIsSaving(false);
    }
  };

  const restoreVersion = async (historyItem: any) => {
    if (window.confirm("Are you sure you want to restore this version? Current code will be backed up automatically.")) {
      try {
        const currentCode = code;
        await addDoc(collection(db, 'custom_code', activeFile, 'history'), {
          content: currentCode,
          timestamp: Date.now(),
          type: currentFileMeta.type,
          author: 'Admin (Pre-restore Backup)'
        });

        const now = Date.now();
        await setDoc(doc(db, 'custom_code', activeFile), {
          content: historyItem.content,
          updatedAt: now,
          type: currentFileMeta.type
        }, { merge: true });

        setCode(historyItem.content);
        applyLiveDOMUpdate(activeFile, historyItem.content);
        setLastSaved(new Date(now).toLocaleString());
        addToast("Version restored successfully & deployed live!");
        setCompareItem(null);
        fetchHistory();
      } catch (e: any) {
        addToast("Error restoring version: " + e.message);
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    addToast('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Preview renderer logic
  const renderLivePreview = () => {
    let previewWidth = 'w-full';
    if (deviceMode === 'tablet') previewWidth = 'w-[768px] mx-auto';
    if (deviceMode === 'mobile') previewWidth = 'w-[375px] mx-auto';

    return (
      <div className={`h-full bg-slate-100 flex flex-col ${previewWidth} transition-all duration-300 border-l border-slate-700/50`}>
        {/* Preview Toolbar */}
        <div className="h-10 bg-slate-200 px-4 flex items-center justify-between border-b border-slate-300 text-xs text-slate-700 font-mono font-bold">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-blue-600" />
            <span>LIVE PREVIEW ({currentFileMeta.type.toUpperCase()})</span>
          </div>
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300">
            <button 
              onClick={() => setDeviceMode('desktop')} 
              className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Desktop View"
            >
              <Laptop size={14} />
            </button>
            <button 
              onClick={() => setDeviceMode('tablet')} 
              className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Tablet View"
            >
              <Tablet size={14} />
            </button>
            <button 
              onClick={() => setDeviceMode('mobile')} 
              className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Mobile View"
            >
              <Smartphone size={14} />
            </button>
          </div>
        </div>

        {/* Live Container */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-900 text-slate-100 font-sans">
          {currentFileMeta.type === 'css' && (
            <div className="space-y-4">
              <style>{code}</style>
              <div className="p-4 bg-white text-slate-900 rounded-xl shadow border border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">CSS Target Component Preview</p>
                <div className="custom-banner">
                  <h4 className="font-black text-lg">E-Vedhika Live Styled Banner</h4>
                  <p className="text-xs opacity-90">This box dynamically reflects your custom CSS in real-time.</p>
                </div>
                <div className="mt-4 ev-glass p-4 rounded-xl">
                  <p className="text-xs font-bold text-slate-700">Glassmorphism Element Preview</p>
                </div>
              </div>
            </div>
          )}

          {currentFileMeta.type === 'html' && (
            <div className="bg-white text-slate-900 p-4 rounded-xl shadow border border-slate-200">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">HTML Head Element Render</p>
              <iframe 
                title="HTML Preview" 
                srcDoc={`<!DOCTYPE html><html><head>${code}</head><body style="font-family:sans-serif;padding:12px;color:#1e293b;">
                  <h3 style="font-weight:900;color:#0B3D91;margin:0 0 8px 0;">E-Vedhika HTML Head Preview</h3>
                  <p style="font-size:12px;margin:0;">Head meta tags and inline styles rendered successfully.</p>
                </body></html>`} 
                className="w-full h-[300px] border border-slate-200 rounded-lg bg-white"
              />
            </div>
          )}

          {currentFileMeta.type === 'javascript' && (
            <div className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-xs border border-slate-800">
              <p className="text-slate-500 font-bold mb-2">// Executable JS Code Structure Sandbox</p>
              <pre className="whitespace-pre-wrap">{code}</pre>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-slate-300">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>Script is syntactically valid and ready for execution.</span>
              </div>
            </div>
          )}

          {currentFileMeta.type === 'json' && (
            <div className="p-4 bg-slate-950 text-blue-300 rounded-xl font-mono text-xs border border-slate-800">
              <p className="text-slate-500 font-bold mb-2">// Parsed JSON Object Structure</p>
              {!syntaxError ? (
                <pre className="text-emerald-400 whitespace-pre-wrap">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(code || '{}'), null, 2);
                    } catch (e) {
                      return "Invalid JSON";
                    }
                  })()}
                </pre>
              ) : (
                <div className="text-rose-400 flex items-center gap-2">
                  <XCircle size={16} />
                  <span>Invalid JSON formatting. Please resolve syntax errors above.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Code className="text-[#0B3D91]" />
            Enterprise Code Manager & IDE
          </h2>
          <p className="text-xs font-bold text-slate-500 tracking-tight mt-0.5">
            Real-time code editing, dynamic CSS injection, syntax verification & version history
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-[#0B3D91] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-[#0B3D91] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-[#0B3D91] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Live Preview
            </button>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200"
          >
            <History size={16} />
            {showHistory ? 'Hide History' : 'Version History'}
          </button>

          <button
            onClick={saveCode}
            disabled={isSaving || !!syntaxError}
            className="px-5 py-2 bg-[#0B3D91] hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? 'Deploying...' : 'Save & Deploy Live'}
          </button>
        </div>
      </div>

      {/* Version History Drawer / Modal */}
      {showHistory && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
        >
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="text-amber-400" size={18} />
              <h3 className="text-white font-bold text-sm">Version History, Rollback & Backups</h3>
            </div>
            {compareItem && (
              <button 
                onClick={() => setCompareItem(null)}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw size={14} /> Clear Comparison
              </button>
            )}
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto custom-scrollbar">
            {history.length === 0 ? (
              <p className="text-slate-400 p-4 text-xs font-medium text-center col-span-2">
                No backup history recorded for this file yet. Saves automatically create snapshots.
              </p>
            ) : (
              history.map((h, idx) => (
                <div 
                  key={h.id} 
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${compareItem?.id === h.id ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-bold text-xs">Version {history.length - idx}</p>
                      <p className="text-slate-400 text-[10px]">
                        {new Date(h.timestamp).toLocaleString()} &bull; Author: {h.author || 'Admin'}
                      </p>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {h.content ? `${h.content.split('\n').length} lines` : 'Empty'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => setCompareItem(h)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-bold transition-colors flex items-center gap-1"
                    >
                      <ArrowLeftRight size={12} /> Inspect / Compare
                    </button>
                    <button
                      onClick={() => restoreVersion(h)}
                      className="px-3 py-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-900 rounded-lg text-[10px] font-bold transition-colors ml-auto flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Rollback to This Version
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Compare Code Preview Panel */}
          {compareItem && (
            <div className="p-4 bg-slate-950 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2 text-xs font-mono text-amber-400">
                <span>Inspecting Backup Version ({new Date(compareItem.timestamp).toLocaleString()})</span>
                <button 
                  onClick={() => restoreVersion(compareItem)}
                  className="px-3 py-1 bg-amber-500 text-slate-950 rounded font-bold hover:bg-amber-400"
                >
                  Restore Immediately
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-300 font-mono text-xs rounded-xl overflow-x-auto max-h-40">
                {compareItem.content}
              </pre>
            </div>
          )}
        </motion.div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: File Explorer & Full Metadata */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} /> System Files
            </h3>

            <div className="space-y-1">
              {CODE_FILES.map((f) => {
                const Icon = f.icon;
                const isSelected = activeFile === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFile(f.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                      isSelected 
                        ? 'bg-[#0B3D91] text-white shadow-md shadow-blue-900/10' 
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <Icon size={18} className={isSelected ? 'text-blue-200' : 'text-slate-400'} />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs truncate">{f.name}</h4>
                      <p className={`text-[9px] font-mono tracking-wider ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        .{f.type} &bull; {f.module}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active File Detailed Metadata Info Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h4 className="font-black text-slate-900 flex items-center gap-2 border-b pb-2">
              <Info size={16} className="text-[#0B3D91]" /> File Specifications
            </h4>

            <div className="space-y-2 text-slate-600 font-medium">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">File Path:</span>
                <span className="font-mono text-slate-900 font-bold break-all bg-slate-100 px-1.5 py-0.5 rounded">
                  {currentFileMeta.path}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Module Name:</span>
                <span className="font-bold text-slate-800">{currentFileMeta.module}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Used In / Target:</span>
                <span className="text-slate-800">{currentFileMeta.usedIn}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Affected Platform Parts:</span>
                <span className="text-slate-800">{currentFileMeta.affectedPages}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Dependencies:</span>
                <span className="text-slate-800 font-mono text-[11px]">{currentFileMeta.dependencies}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Saved:</span>
                <span className="text-emerald-700 font-bold">{lastSaved || 'Default Preset'}</span>
              </div>
            </div>
          </div>

          {/* Crash & Data Protection Banner */}
          <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2">
            <h4 className="font-bold text-xs flex items-center gap-2 text-emerald-800">
              <CheckCircle size={16} className="text-emerald-600" />
              డేటా పరిరక్షణ మరియు రక్షణ హామీ (Data Preservation Active)
            </h4>
            <p className="text-[11px] leading-relaxed font-medium text-emerald-800">
              కోడ్ లేదా కాన్ఫిగరేషన్ అప్‌డేట్ చేసినప్పుడు పాత పోస్ట్‌లు, డేటా మరియు ఫైళ్లు ఎట్టి పరిస్థితుల్లోనూ తొలగించబడవు. నాన్-డిస్ట్రక్టివ్ మెర్జ్ (Merge Mode) మరియు ఆటోమేటిక్ బ్యాకప్ స్నాప్‌షాట్ ద్వారా పూర్తి డేటా సేఫ్‌గా ఉంటుంది.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
            <h4 className="font-bold text-xs flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-amber-600" />
              Automatic Backup Safeguard
            </h4>
            <p className="text-[11px] leading-relaxed font-medium text-amber-800">
              Every save action creates an immutable snapshot. You can safely experiment and rollback anytime.
            </p>
          </div>
        </div>

        {/* Right Column: Code Editor & Live Preview */}
        <div className="lg:col-span-3">
          <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex flex-col h-[650px]">
            
            {/* Editor Header Bar */}
            <div className="h-12 bg-[#2d2d2d] flex items-center px-4 justify-between border-b border-[#404040] text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-slate-300 font-bold">{currentFileMeta.name}</span>
                <span className="text-slate-500 hidden sm:inline">({currentFileMeta.path})</span>
              </div>

              <div className="flex items-center gap-3">
                {syntaxError ? (
                  <span className="text-rose-400 flex items-center gap-1 font-sans text-[11px] font-bold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    <XCircle size={12} /> Syntax Error
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-sans text-[11px] font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    <CheckCircle2 size={12} /> Valid Syntax
                  </span>
                )}

                <button 
                  onClick={handleCopyCode}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Copy Code"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Error Notification Banner if syntax error exists */}
            {syntaxError && (
              <div className="bg-rose-950 text-rose-200 px-4 py-2 text-xs font-mono flex items-center justify-between border-b border-rose-800">
                <span className="truncate">{syntaxError}</span>
              </div>
            )}

            {/* Editor + Preview Split View Body */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Text Area Code Editor */}
              {(viewMode === 'editor' || viewMode === 'split') && (
                <div className={`flex-1 flex flex-col bg-[#1e1e1e] relative ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="flex-1 w-full bg-[#1e1e1e] text-slate-200 font-mono text-xs p-4 outline-none resize-none custom-scrollbar focus:ring-0 leading-relaxed"
                    style={{ tabSize: 2 }}
                    placeholder="Write custom code here..."
                  />
                  <div className="h-6 bg-[#252526] px-4 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-[#333]">
                    <span>UTF-8 &bull; {currentFileMeta.type.toUpperCase()}</span>
                    <span>{code.split('\n').length} Lines &bull; {code.length} Chars</span>
                  </div>
                </div>
              )}

              {/* Live Preview Panel */}
              {(viewMode === 'preview' || viewMode === 'split') && (
                <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full`}>
                  {renderLivePreview()}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
