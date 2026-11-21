import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Settings,
  BarChart3,
  Wheat,
  FileText,
  Download,
  Calendar,
  Crown,
  ShieldCheck,
  Image as ImageIcon
} from "lucide-react";

interface RoyalWelcomeHeroCardProps {
  userProfile?: any;
  currentUser?: any;
  setCurrentTab: (tab: string) => void;
  dataLoading?: boolean;
}

export function RoyalWelcomeHeroCard({
  userProfile,
  currentUser,
  setCurrentTab,
  dataLoading = false,
}: RoyalWelcomeHeroCardProps) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<"card" | "banner">("card");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours();

  // Dynamic royal time greeting
  let greetingEn = "Good Morning";
  let greetingTe = "శుభోదయం";
  let GreetingIcon = Sunrise;
  let greetingColor = "from-amber-300 via-yellow-200 to-amber-400";

  if (hours >= 12 && hours < 17) {
    greetingEn = "Good Afternoon";
    greetingTe = "శుభ మధ్యాహ్నం";
    GreetingIcon = Sun;
    greetingColor = "from-amber-300 via-orange-300 to-yellow-200";
  } else if (hours >= 17 && hours < 21) {
    greetingEn = "Good Evening";
    greetingTe = "శుభ సాయంత్రం";
    GreetingIcon = Sunset;
    greetingColor = "from-orange-300 via-rose-300 to-amber-200";
  } else {
    greetingEn = "Good Night";
    greetingTe = "శుభరాత్రి";
    GreetingIcon = Moon;
    greetingColor = "from-indigo-300 via-sky-200 to-cyan-300";
  }

  // Determine user name
  const rawName = userProfile?.name || currentUser?.displayName || userProfile?.displayName || "";
  const nameToDisplay = rawName.trim() || (currentUser?.email ? currentUser.email.split("@")[0] : "Rakesh Dhawan");

  // Formatted date string
  const dateFormatted = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleNav = (target: string, tabId?: string) => {
    if (tabId) {
      setCurrentTab(tabId);
    }
    if (target.startsWith("/")) {
      navigate(target);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto mb-6 space-y-3">
      {/* Royal Card Container */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-amber-400/30 bg-gradient-to-br from-[#051126] via-[#091b38] to-[#030d20] text-white">
        {/* Ambient Royal Gold & Cyan Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent pointer-events-none" />

        {/* View Switcher Top Bar */}
        <div className="relative z-10 px-4 sm:px-6 pt-3 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-[10px] tracking-wider uppercase">
              <Crown size={12} className="text-amber-300" />
              ROYAL GOVERNANCE PORTAL
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 text-[11px]">
              <Calendar size={12} className="text-slate-400" />
              {dateFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 p-0.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "card"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles size={11} />
              Welcome Dashboard
            </button>
            <button
              type="button"
              onClick={() => setViewMode("banner")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "banner"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon size={11} />
              Official Banner
            </button>
          </div>
        </div>

        {/* Mode 1: Royal Welcome Dashboard */}
        {viewMode === "card" && (
          <div className="relative z-10 p-5 sm:p-7 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left / Main Column */}
              <div className="lg:col-span-8 space-y-4">
                {/* Royal Greeting Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-amber-400/30 backdrop-blur-md shadow-inner">
                  <GreetingIcon size={15} className="text-amber-400 animate-pulse" />
                  <span className={`text-xs sm:text-sm font-extrabold bg-gradient-to-r ${greetingColor} bg-clip-text text-transparent`}>
                    {greetingTe} • {greetingEn}!
                  </span>
                </div>

                {/* Primary Welcome Heading with User Name */}
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-mandali leading-tight flex flex-wrap items-center gap-2 sm:gap-3">
                    <span>Welcome,</span>
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                      {nameToDisplay}
                    </span>
                    <Sparkles className="text-amber-400 w-6 h-6 sm:w-8 sm:h-8 inline-block animate-pulse" />
                  </h1>
                  <p className="text-sm sm:text-base font-semibold text-cyan-300 tracking-wide font-sans">
                    ఈ-వేదిక (E-Vedhika) • All Problems One Solution
                  </p>
                </div>

                {/* Royal Subtitle */}
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-mandali">
                  తెలంగాణ &amp; ఆంధ్రప్రదేశ్ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు పౌరుల సమగ్ర డిజిటల్ గవర్నెన్స్ అధికారిక సాంకేతిక పోర్టల్.
                </p>

                {/* Quick Info Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-200 font-medium">
                    <ShieldCheck size={13} className="text-cyan-400" />
                    <span>Official Verified Portal</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>24/7 Live NIC Gateway</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 font-medium">
                    <span>⚡ 17-Step Auto Configuration</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Holographic Crest / EV Seal */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4">
                <div className="relative group/logo">
                  {/* Glowing ambient ring */}
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/30 via-amber-400/30 to-blue-600/30 blur-xl animate-pulse" />
                  
                  {/* Circular Holographic EV Seal */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-amber-400 to-blue-500 shadow-2xl flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-slate-950 border-2 border-slate-800 flex flex-col items-center justify-center p-2 text-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-radial-gradient from-blue-600/20 via-transparent to-transparent" />
                      <span className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-md tracking-wider">
                        EV
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 mt-1">
                        E-VEDHIKA
                      </span>
                      <span className="text-[7px] text-slate-400 font-bold tracking-widest uppercase">
                        GOV UTILITY
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[11px] font-mono text-cyan-300/80 font-bold">
                  🌐 www.e-vedhika.in
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Official Banner Image View */}
        {viewMode === "banner" && (
          <div className="relative w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            <picture className="w-full block">
              <source srcSet="/banner.png" type="image/png" media="(min-width: 1024px)" />
              <img
                src="/banner.jpg"
                alt="E-Vedhika | All Problems One Solution - Official Portal"
                className="w-full h-auto object-cover max-h-[380px] sm:max-h-[460px] md:max-h-[500px]"
                loading="eager"
              />
            </picture>
          </div>
        )}

        {/* Bottom Bar: Loading Shimmer or Live Network Status */}
        {dataLoading ? (
          <div className="p-3 sm:p-3.5 bg-slate-950/95 border-t border-amber-400/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 sm:px-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
              </span>
              <span className="text-xs sm:text-sm font-bold text-amber-200">
                పోర్టల్ సమాచారం &amp; తాజా ఉత్తర్వులు లోడ్ అవుతున్నాయి...
              </span>
              <span className="text-[11px] text-slate-400 hidden md:inline">
                (Syncing live governance records...)
              </span>
            </div>
            <div className="w-full sm:w-48 bg-slate-800 rounded-full h-1.5 overflow-hidden border border-amber-400/30">
              <div className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 animate-pulse w-full" />
            </div>
          </div>
        ) : (
          <div className="p-2.5 sm:p-3 bg-slate-950/95 border-t border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-emerald-300">24/7 Live NIC Gateway Active</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">AP &amp; TS పంచాయతీ సాంకేతిక సేవల కేంద్రం</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-amber-300/90 font-medium">
                🏛️ అధికారిక డిజిటల్ వేదిక
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5 Core Feature Quick Buttons matching the Banner tags */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
        <button
          type="button"
          onClick={() => handleNav("/ubd_tracker", "ubd_tracker")}
          className="p-3 bg-gradient-to-br from-slate-900 to-blue-950 hover:from-blue-900 hover:to-indigo-950 text-white rounded-xl sm:rounded-2xl border border-blue-800/40 hover:border-cyan-400/60 shadow-md hover:shadow-cyan-500/10 flex items-center gap-2.5 transition-all group cursor-pointer text-left"
        >
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
            <Settings size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-cyan-300 truncate">UBD Settings &amp; DSK</div>
            <div className="text-[10px] text-slate-400 truncate">లైవ్ రికార్డ్స్ &amp; ట్రాకర్</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/workspace/dsr", "workspace")}
          className="p-3 bg-gradient-to-br from-slate-900 to-indigo-950 hover:from-indigo-900 hover:to-blue-950 text-white rounded-xl sm:rounded-2xl border border-indigo-800/40 hover:border-indigo-400/60 shadow-md hover:shadow-indigo-500/10 flex items-center gap-2.5 transition-all group cursor-pointer text-left"
        >
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
            <BarChart3 size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-indigo-300 truncate">DSR Analyzer</div>
            <div className="text-[10px] text-slate-400 truncate">హాజరు &amp; శానిటేషన్</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/farmer_registry", "farmer_registry")}
          className="p-3 bg-gradient-to-br from-slate-900 to-emerald-950 hover:from-emerald-900 hover:to-slate-900 text-white rounded-xl sm:rounded-2xl border border-emerald-800/40 hover:border-emerald-400/60 shadow-md hover:shadow-emerald-500/10 flex items-center gap-2.5 transition-all group cursor-pointer text-left"
        >
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
            <Wheat size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-emerald-300 truncate">Farmer Registry</div>
            <div className="text-[10px] text-slate-400 truncate">రైతు సర్వే &amp; వివరాలు</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/gos_formats", "gos_formats")}
          className="p-3 bg-gradient-to-br from-slate-900 to-amber-950 hover:from-amber-900 hover:to-slate-900 text-white rounded-xl sm:rounded-2xl border border-amber-800/40 hover:border-amber-400/60 shadow-md hover:shadow-amber-500/10 flex items-center gap-2.5 transition-all group cursor-pointer text-left"
        >
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
            <FileText size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-amber-300 truncate">GOs &amp; Formats</div>
            <div className="text-[10px] text-slate-400 truncate">అధికారిక జీవోలు</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/software_hub", "software_hub")}
          className="p-3 bg-gradient-to-br from-slate-900 to-purple-950 hover:from-purple-900 hover:to-slate-900 text-white rounded-xl sm:rounded-2xl border border-purple-800/40 hover:border-purple-400/60 shadow-md hover:shadow-purple-500/10 flex items-center gap-2.5 transition-all group cursor-pointer text-left col-span-2 sm:col-span-1"
        >
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
            <Download size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-purple-300 truncate">Software Hub</div>
            <div className="text-[10px] text-slate-400 truncate">టోకెన్ డ్రైవర్లు &amp; టూల్స్</div>
          </div>
        </button>
      </div>
    </div>
  );
}
