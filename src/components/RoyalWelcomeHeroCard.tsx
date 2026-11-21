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

  // Dynamic royal time greeting based on local time
  let greetingEn = "Good Morning";
  let greetingTe = "శుభోదయం";
  let GreetingIcon = Sunrise;
  let greetingColor = "from-amber-300 via-yellow-200 to-amber-400";
  let greetingGlow = "shadow-amber-500/20";

  if (hours >= 5 && hours < 12) {
    greetingEn = "Good Morning";
    greetingTe = "శుభోదయం";
    GreetingIcon = Sunrise;
    greetingColor = "from-amber-300 via-yellow-200 to-amber-400";
    greetingGlow = "shadow-amber-500/20";
  } else if (hours >= 12 && hours < 17) {
    greetingEn = "Good Afternoon";
    greetingTe = "శుభ మధ్యాహ్నం";
    GreetingIcon = Sun;
    greetingColor = "from-amber-300 via-orange-300 to-yellow-200";
    greetingGlow = "shadow-orange-500/20";
  } else if (hours >= 17 && hours < 21) {
    greetingEn = "Good Evening";
    greetingTe = "శుభ సాయంత్రం";
    GreetingIcon = Sunset;
    greetingColor = "from-orange-300 via-rose-300 to-amber-200";
    greetingGlow = "shadow-rose-500/20";
  } else {
    greetingEn = "Good Night";
    greetingTe = "శుభరాత్రి";
    GreetingIcon = Moon;
    greetingColor = "from-indigo-300 via-sky-200 to-cyan-300";
    greetingGlow = "shadow-indigo-500/20";
  }

  // Determine user name cleanly
  const rawName = userProfile?.name || currentUser?.displayName || userProfile?.displayName || "";
  const nameToDisplay = rawName.trim() || (currentUser?.email ? currentUser.email.split("@")[0] : "Rakesh Dhawan");

  // Formatted date string
  const dateFormatted = currentTime.toLocaleDateString("en-IN", {
    weekday: "short",
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
    <div className="w-full max-w-[1600px] mx-auto mb-4 space-y-2.5">
      {/* Royal Card Container - Sweet, Sleek, Compact & Luxury */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-amber-400/25 bg-gradient-to-br from-[#030d22] via-[#08183a] to-[#040f26] text-white">
        {/* Soft Ambient Gold & Cyan Glows */}
        <div className="absolute -top-16 -left-16 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Bar inside Card */}
        <div className="relative z-10 px-4 sm:px-6 pt-2.5 pb-2 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-[10px] tracking-wider uppercase shadow-sm">
              <Crown size={12} className="text-amber-300" />
              ROYAL GOVERNANCE PORTAL
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400 text-[11px]">
              <Calendar size={12} className="text-slate-400" />
              {dateFormatted}
            </span>
          </div>

          {/* Sweet Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "card"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles size={11} />
              Welcome Dashboard
            </button>
            <button
              type="button"
              onClick={() => setViewMode("banner")}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "banner"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon size={11} />
              Official Banner
            </button>
          </div>
        </div>

        {/* Mode 1: Sweet & Compact Royal Welcome Dashboard */}
        {viewMode === "card" && (
          <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left Content */}
              <div className="space-y-2 flex-1">
                {/* Greeting Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-amber-400/25 backdrop-blur-md shadow-sm">
                  <GreetingIcon size={13} className="text-amber-400 animate-pulse" />
                  <span className={`text-xs font-bold bg-gradient-to-r ${greetingColor} bg-clip-text text-transparent`}>
                    {greetingTe} • {greetingEn}!
                  </span>
                </div>

                {/* Primary Welcome Heading */}
                <div className="space-y-0.5">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight flex flex-wrap items-center gap-2">
                    <span>Welcome,</span>
                    <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-sm font-mandali">
                      {nameToDisplay}
                    </span>
                    <Sparkles className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6 inline-block animate-pulse" />
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-cyan-300">
                    ఈ-వేదిక (E-Vedhika) • AP &amp; TS పంచాయతీ సాంకేతిక సేవల కేంద్రం
                  </p>
                </div>

                {/* Micro Badges (Clean & Sweet - NO NIC Gateway) */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/25 text-blue-200">
                    <ShieldCheck size={12} className="text-cyan-400" />
                    Official Verified Portal
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/25 text-purple-200">
                    ⚡ 17-Step Auto Configuration
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/25 text-emerald-200">
                    🏛️ All Problems One Solution
                  </span>
                </div>
              </div>

              {/* Right Emblem - Vivid Glowing Royal Holographic EV Circle */}
              <div className="shrink-0 flex items-center justify-center self-center md:self-auto py-2">
                <div className="relative group/logo flex items-center justify-center">
                  {/* Outer Pulsing Cyan & Gold Neon Glow Halos */}
                  <div className="absolute -inset-4 rounded-full bg-cyan-400/40 blur-xl animate-pulse pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-400/50 via-blue-500/40 to-amber-400/50 blur-lg animate-pulse pointer-events-none" />

                  {/* Soft expanding ping ripple */}
                  <div className="absolute -inset-2 rounded-full border-2 border-cyan-400/40 animate-ping opacity-30 pointer-events-none" />

                  {/* Outer rotating neon cyber conic-border */}
                  <div
                    className="absolute -inset-1 rounded-full opacity-90 animate-spin pointer-events-none"
                    style={{
                      animationDuration: "8s",
                      background: "conic-gradient(from 0deg, #00f0ff, #3b82f6, #facc15, #00f0ff)",
                      filter: "drop-shadow(0 0 12px rgba(6, 182, 212, 0.9))"
                    }}
                  />

                  {/* Core Glowing Medallion */}
                  <div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-slate-950 flex items-center justify-center"
                    style={{
                      boxShadow: "0 0 25px rgba(6, 182, 212, 0.85), 0 0 50px rgba(14, 165, 233, 0.5), inset 0 0 18px rgba(6, 182, 212, 0.5)"
                    }}
                  >
                    {/* Concentric rotating dashed neon ring */}
                    <svg className="absolute inset-0 w-full h-full animate-spin pointer-events-none" style={{ animationDuration: "14s" }} viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.85)"
                        strokeWidth="2.5"
                        strokeDasharray="14 7"
                        strokeLinecap="round"
                        filter="drop-shadow(0 0 4px #00f0ff)"
                      />
                    </svg>

                    {/* Concentric inner glow border */}
                    <div className="absolute inset-1 rounded-full border border-cyan-300/40 shadow-[0_0_10px_rgba(6,182,212,0.6)] pointer-events-none" />

                    {/* Inner deep-space core with animated radial cyan flare */}
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#051736] to-[#020a1a] flex flex-col items-center justify-center relative overflow-hidden z-10 border border-cyan-500/30">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.5)_0%,_transparent_75%)] animate-pulse" />
                      
                      <span className="text-2xl sm:text-3xl font-black bg-gradient-to-b from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.9)] tracking-wider select-none">
                        EV
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-amber-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.85)] -mt-0.5 select-none">
                        E-VEDHIKA
                      </span>
                    </div>
                  </div>
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
                className="w-full h-auto object-cover max-h-[320px] sm:max-h-[380px] md:max-h-[420px]"
                loading="eager"
              />
            </picture>
          </div>
        )}

        {/* Bottom Bar: Clean & Sweet (Completely removed 24/7 Live NIC Gateway) */}
        {dataLoading ? (
          <div className="p-2 sm:p-2.5 bg-slate-950/95 border-t border-amber-400/20 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="font-semibold text-amber-200 text-xs">
                పోర్టల్ సమాచారం &amp; తాజా ఉత్తర్వులు లోడ్ అవుతున్నాయి...
              </span>
            </div>
            <div className="w-full sm:w-40 bg-slate-800 rounded-full h-1 overflow-hidden border border-amber-400/30">
              <div className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 animate-pulse w-full" />
            </div>
          </div>
        ) : (
          <div className="p-2 sm:p-2.5 bg-slate-950/90 border-t border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="font-medium text-slate-300 text-[11px] sm:text-xs">
                AP &amp; TS పంచాయతీ సాంకేతిక సేవల కేంద్రం
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-[11px] text-amber-300/90 hidden sm:inline font-medium">
                🏛️ అధికారిక డిజిటల్ వేదిక
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.e-vedhika.in"
                className="text-[11px] font-mono text-cyan-400/90 hover:text-cyan-300 font-semibold"
              >
                🌐 www.e-vedhika.in
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 5 Core Feature Quick Buttons - Sweet, Sleek & Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        <button
          type="button"
          onClick={() => handleNav("/ubd_tracker", "ubd_tracker")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-blue-950 hover:from-blue-900 hover:to-indigo-950 text-white rounded-xl border border-blue-800/30 hover:border-cyan-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
            <Settings size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-cyan-300 truncate">UBD Settings &amp; DSK</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">లైవ్ రికార్డ్స్ &amp; ట్రాకర్</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/workspace/dsr", "workspace")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-indigo-950 hover:from-indigo-900 hover:to-blue-950 text-white rounded-xl border border-indigo-800/30 hover:border-indigo-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
            <BarChart3 size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-indigo-300 truncate">DSR Analyzer</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">హాజరు &amp; శానిటేషన్</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/farmer_registry", "farmer_registry")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-emerald-950 hover:from-emerald-900 hover:to-slate-900 text-white rounded-xl border border-emerald-800/30 hover:border-emerald-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
            <Wheat size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-emerald-300 truncate">Farmer Registry</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">రైతు సర్వే &amp; వివరాలు</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/gos_formats", "gos_formats")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-amber-950 hover:from-amber-900 hover:to-slate-900 text-white rounded-xl border border-amber-800/30 hover:border-amber-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
            <FileText size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-amber-300 truncate">GOs &amp; Formats</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">అధికారిక జీవోలు</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/software_hub", "software_hub")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-purple-950 hover:from-purple-900 hover:to-slate-900 text-white rounded-xl border border-purple-800/30 hover:border-purple-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left col-span-2 sm:col-span-1"
        >
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
            <Download size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-purple-300 truncate">Software Hub</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">టోకెన్ డ్రైవర్లు &amp; టూల్స్</div>
          </div>
        </button>
      </div>
    </div>
  );
}
