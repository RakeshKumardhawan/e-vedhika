import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, ExternalLink, RefreshCw, Copy, Check, Maximize2, Minimize2, 
  Sparkles, ShieldCheck, ArrowUpRight, Search, Building2, MonitorSmartphone,
  ChevronRight, ArrowLeft
} from 'lucide-react';

interface UBDTrackerProps {
  user?: any;
  addToast?: (msg: string) => void;
}

export function UBDTracker({ user, addToast }: UBDTrackerProps) {
  // State for selected portal: 'TS_MIS' | 'AP_MIS' | 'TS_PERM'
  const [selectedPortal, setSelectedPortal] = useState<'TS_MIS' | 'AP_MIS' | 'TS_PERM'>('TS_MIS');
  const [registerType, setRegisterType] = useState<'BIR' | 'DEA'>('BIR');
  const [unitIdInput, setUnitIdInput] = useState('');
  const [activeUnitId, setActiveUnitId] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [key, setKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Compute active government URL
  const getActiveUrl = () => {
    if (selectedPortal === 'AP_MIS') {
      return 'https://epanchayat.ap.gov.in/UBDMIS/';
    }
    if (selectedPortal === 'TS_PERM') {
      return 'https://ubd.telangana.gov.in/';
    }
    // TS_MIS:
    if (activeUnitId) {
      if (registerType === 'DEA') {
        return `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDEA_Details.do?officeCode=${encodeURIComponent(activeUnitId)}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
      }
      return `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDetails.do?officeCode=${encodeURIComponent(activeUnitId)}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
    }
    return 'https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus.do?rlb_type=3&pstcode=35&style=bluetheme';
  };

  const activeUrl = getActiveUrl();

  const handleApplyUnitId = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = unitIdInput.trim();
    setActiveUnitId(clean);
    if (!clean) {
      if (addToast) addToast("తెలంగాణ మొత్తం UBDMIS రిజిస్టర్ నివేదిక లోడ్ చేయబడింది");
    } else {
      if (addToast) addToast(`Unit ID [${clean}] ${registerType === 'BIR' ? 'జనన' : 'మరణ'} రిజిస్టర్ లైవ్ ప్రివ్యూ లోడ్ చేయబడింది!`);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    if (addToast) addToast("లైవ్ లింక్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWindow = () => {
    window.open(
      activeUrl,
      'UBD_Live_Portal_Window',
      'width=1280,height=850,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
    );
    if (addToast) addToast("UBDMIS లైవ్ వర్క్‌స్టేషన్ విండో ఓపెన్ చేయబడింది!");
  };

  const handleReload = () => {
    setKey(prev => prev + 1);
    if (addToast) addToast("లైవ్ ప్రివ్యూ రీలోడ్ చేయబడుతోంది...");
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full space-y-4 transition-all duration-300 font-['Mandali',sans-serif] ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 overflow-y-auto' : ''
      }`}
    >
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-black uppercase tracking-wider border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>UBDMIS Official Live Portal Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Globe className="text-blue-400" size={24} />
              UBD వెబ్‌సైట్ లైవ్ ప్రివ్యూ &amp; వర్క్‌స్టేషన్
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              తెలంగాణ మరియు ఏపీ UBDMIS అధికారిక పోర్టల్స్, జనన-మరణాల రిజిస్టర్లు నేరుగా ఇక్కడే లైవ్‌గా వీక్షించండి.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenWindow}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <MonitorSmartphone size={16} /> లైవ్ విండోలో తెరవండి ↗
            </button>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <ExternalLink size={14} /> అధికారిక సైట్
            </a>
          </div>
        </div>
      </div>

      {/* Control & Switcher Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        {/* Portal & State Switchers */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Portals */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">పోర్టల్:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setSelectedPortal('TS_MIS'); }}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedPortal === 'TS_MIS' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                తెలంగాణ UBD MIS
              </button>
              <button
                type="button"
                onClick={() => { setSelectedPortal('AP_MIS'); }}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedPortal === 'AP_MIS' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                ఆంధ్రప్రదేశ్ UBD MIS
              </button>
              <button
                type="button"
                onClick={() => { setSelectedPortal('TS_PERM'); }}
                className={`px-4 py-2 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedPortal === 'TS_PERM' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                TS UBD (భవన అనుమతులు)
              </button>
            </div>
          </div>

          {/* Register Mode (Birth vs Death) - for TS MIS */}
          {selectedPortal === 'TS_MIS' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">రిజిస్టర్:</span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRegisterType('BIR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    registerType === 'BIR'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  👶 జనన నమోదు (Birth)
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterType('DEA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    registerType === 'DEA'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  🕊️ మరణ నమోదు (Death)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Unit ID Jump (Optional) */}
        {selectedPortal === 'TS_MIS' && (
          <form onSubmit={handleApplyUnitId} className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Search size={14} className="text-blue-600" />
              ప్రత్యేక Unit ID (ఆఫీస్ కోడ్) ఉంటే నేరుగా వెళ్ళండి:
            </span>
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <input
                type="text"
                value={unitIdInput}
                onChange={(e) => setUnitIdInput(e.target.value)}
                placeholder="ఉదా: 10209 లేదా ఖాళీగా ఉంచితే పూర్తి రాష్ట్ర నివేదిక"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/60"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                ఓపెన్ చేయి
              </button>
              {activeUnitId && (
                <button
                  type="button"
                  onClick={() => { setUnitIdInput(''); setActiveUnitId(''); }}
                  className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  మొత్తం నివేదిక
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Embedded Live Preview Browser Frame */}
      <div className="w-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        {/* Browser Chrome Top Header */}
        <div className="bg-slate-950 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 text-xs">
          {/* Window Buttons & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
                {selectedPortal === 'TS_MIS' ? 'Telangana UBDMIS' : selectedPortal === 'AP_MIS' ? 'AP UBDMIS' : 'TS UBD Building Permissions'}
              </span>
            </div>
          </div>

          {/* URL Address Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-300 font-mono text-[11px]">
            <span className="text-emerald-400 text-xs">🔒</span>
            <span className="truncate flex-1 select-all">{activeUrl}</span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Copy URL"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReload}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl transition-all cursor-pointer"
              title="రీఫ్రెష్ చేయండి"
            >
              <RefreshCw size={14} />
            </button>
            <button
              type="button"
              onClick={handleOpenWindow}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="ప్రత్యేక లైవ్ విండోలో ఓపెన్ చేయండి"
            >
              <MonitorSmartphone size={13} />
              <span className="hidden sm:inline">లైవ్ విండో</span>
            </button>
            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl transition-all cursor-pointer"
              title="క్రొత్త ట్యాబ్‌లో ఓపెన్ చేయండి"
            >
              <ArrowUpRight size={14} />
            </a>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl transition-all cursor-pointer"
              title={isFullscreen ? "సాధారణ వీక్షణ" : "ఫుల్ స్క్రీన్"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        {/* Live Helper Floating Notice */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-blue-200">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-blue-400 shrink-0" />
            <span>
              <strong>లైవ్ వర్క్‌స్పేస్ సూచన:</strong> ప్రభుత్వ UBDMIS సెక్యూరిటీ నిబంధనల వల్ల ఫ్రేమ్‌లో బ్లాక్ అయినట్లు అనిపిస్తే, కుడివైపున ఉన్న <strong>"లైవ్ విండో"</strong> బటన్ ద్వారా నేరుగా ఒకే క్లిక్‌తో ఓపెన్ చేయవచ్చు.
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenWindow}
            className="underline hover:text-white font-bold ml-2 whitespace-nowrap cursor-pointer"
          >
            ఇప్పుడే తెరవండి &rarr;
          </button>
        </div>

        {/* Preview Frame Viewport */}
        <div className="relative w-full h-[650px] sm:h-[800px] bg-white">
          <iframe
            key={key}
            src={activeUrl}
            title="UBDMIS Live Portal Preview"
            className="w-full h-full border-none"
            allow="fullscreen; geolocation"
          />
        </div>
      </div>
    </div>
  );
}
export default UBDTracker;
