import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
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
  ShieldCheck,
  Building,
  MessageSquare,
  FileDown,
  Globe,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";
import {
  LiveWebsiteItem,
  DEFAULT_LIVE_WEBSITES,
  LiveWebsitesManager,
} from "./admin/LiveWebsitesManager";

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

  if (hours >= 5 && hours < 12) {
    greetingEn = "Good Morning";
    greetingTe = "శుభోదయం";
    GreetingIcon = Sunrise;
    greetingColor = "from-amber-300 via-yellow-200 to-amber-400";
  } else if (hours >= 12 && hours < 17) {
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

  // Keep local user in sync with props and Firebase Auth
  const [activeUser, setActiveUser] = useState<any>(currentUser || auth.currentUser);

  useEffect(() => {
    if (currentUser) {
      setActiveUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setActiveUser(u);
      }
    });
    return () => unsub();
  }, []);

  const effectiveUser = activeUser || currentUser || auth.currentUser;
  const isAnonymous = Boolean(effectiveUser?.isAnonymous);

  // Calculate full name with comprehensive priority:
  // 1. Surname + Name or Name + Surname from profile
  // 2. FullName from profile
  // 3. DisplayName from Firebase Auth user
  // 4. Username from profile
  // 5. DisplayName from profile
  // 6. Email prefix fallback
  let fullName = "";
  if (userProfile?.surname || userProfile?.name) {
    const s = (userProfile.surname || "").trim();
    const n = (userProfile.name || "").trim();
    if (s && n) {
      fullName = `${s} ${n}`;
    } else if (n) {
      fullName = n;
    } else if (s) {
      fullName = s;
    }
  }
  if (!fullName && userProfile?.fullName && typeof userProfile.fullName === "string") {
    fullName = userProfile.fullName.trim();
  }
  if (!fullName && effectiveUser?.displayName && typeof effectiveUser.displayName === "string") {
    fullName = effectiveUser.displayName.trim();
  }
  if (!fullName && userProfile?.displayName && typeof userProfile.displayName === "string") {
    fullName = userProfile.displayName.trim();
  }
  if (!fullName && userProfile?.username && typeof userProfile.username === "string" && userProfile.username !== "User" && userProfile.username !== "System User") {
    fullName = userProfile.username.trim();
  }
  if (!fullName && effectiveUser?.email && typeof effectiveUser.email === "string") {
    fullName = effectiveUser.email.split("@")[0].trim();
  }
  if (!fullName && userProfile?.email && typeof userProfile.email === "string") {
    fullName = userProfile.email.split("@")[0].trim();
  }

  const isLoggedIn = Boolean(
    (!isAnonymous && (effectiveUser?.uid || effectiveUser?.email)) ||
    (userProfile && (userProfile.name || userProfile.surname || userProfile.username || userProfile.email)) ||
    fullName
  );
  const nameToDisplay = fullName.trim();

  // Admin check for managing live websites
  const userRole = (userProfile?.role || effectiveUser?.role || "").toLowerCase();
  const userEmail = (effectiveUser?.email || userProfile?.email || "").toLowerCase();
  const isAdmin = Boolean(
    ["admin", "super_admin", "editor", "moderator"].includes(userRole) ||
    userEmail === "rakeshkumardhawan123@gmail.com" ||
    userEmail.includes("evedhikasupport@gmail.com")
  );

  // Live Websites state loaded in real-time from Firestore
  const [liveWebsites, setLiveWebsites] = useState<LiveWebsiteItem[]>(DEFAULT_LIVE_WEBSITES);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    let unsub = () => {};
    try {
      if (db) {
        unsub = onSnapshot(
          doc(db, "site_settings", "live_websites"),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (Array.isArray(data.websites) && data.websites.length > 0) {
                const sorted = [...data.websites].sort(
                  (a, b) => (a.order || 0) - (b.order || 0)
                );
                setLiveWebsites(sorted);
              } else {
                setLiveWebsites(DEFAULT_LIVE_WEBSITES);
              }
            } else {
              setLiveWebsites(DEFAULT_LIVE_WEBSITES);
            }
          },
          (err) => {
            console.warn("Failed to listen to live_websites in Hero, using defaults:", err);
            setLiveWebsites(DEFAULT_LIVE_WEBSITES);
          }
        );
      }
    } catch (e) {
      setLiveWebsites(DEFAULT_LIVE_WEBSITES);
    }
    return () => unsub();
  }, []);

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

        {/* Main Content Area */}
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
                  {isLoggedIn && nameToDisplay ? (
                    <>
                      <span>Welcome,</span>
                      <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 bg-clip-text text-transparent drop-shadow-sm font-mandali">
                        {nameToDisplay}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>Welcome to</span>
                      <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 bg-clip-text text-transparent drop-shadow-sm font-mandali">
                        e-Vedhika
                      </span>
                    </>
                  )}
                  <Sparkles className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6 inline-block animate-pulse" />
                </h1>
                <p className="text-xs sm:text-sm font-medium text-cyan-300">
                  ఈ-వేదిక (E-Vedhika) • TS పంచాయతీ సాంకేతిక సేవల కేంద్రం
                </p>
              </div>

              {/* Micro Badges */}
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

                {/* 🌐 Live Websites configured from Admin Panel - right beside 'All Problems One Solution' */}
                {liveWebsites
                  .filter((site) => site.active)
                  .map((site) => (
                    <a
                      key={site.id}
                      href={site.url}
                      target={site.url.startsWith("http") ? "_blank" : undefined}
                      rel={site.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!site.url.startsWith("http")) {
                          e.preventDefault();
                          handleNav(site.url);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-300 text-emerald-200 hover:text-white transition-all shadow-xs group cursor-pointer active:scale-95 select-none"
                      title={site.notes ? `${site.name} • ${site.notes}` : `${site.name} (క్లిక్ చేసి ఓపెన్ చేయండి)`}
                    >
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                      </span>
                      <span className="font-bold tracking-tight text-emerald-100 group-hover:text-white">
                        {site.name}
                      </span>
                      <ExternalLink
                        size={10}
                        className="text-emerald-400/80 group-hover:text-emerald-200 group-hover:translate-x-0.5 transition-transform shrink-0"
                      />
                    </a>
                  ))}

                {/* Admin Quick Manage Button - visible only to Admin */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-950/60 hover:bg-amber-900/90 border border-amber-500/40 hover:border-amber-300 text-amber-300 hover:text-amber-100 text-[10px] font-black tracking-wide shadow-xs transition-all cursor-pointer active:scale-95"
                    title="లైవ్ వెబ్‌సైట్లను సవరించండి (Admin Only)"
                  >
                    <Settings size={11} className="text-amber-400 animate-spin-slow" />
                    <span>+ లైవ్ వెబ్సైట్లు మేనేజ్ చేయండి</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Emblem - Vivid Glowing Royal Holographic EV Circle with Spinning Ring */}
            <div className="shrink-0 flex items-center justify-center self-center md:self-auto py-2">
              <div className="relative group/logo flex items-center justify-center">
                {/* Outer Ambient Glow Halos */}
                <div className="absolute -inset-4 rounded-full bg-cyan-400/35 blur-xl animate-pulse pointer-events-none" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-400/40 via-blue-500/30 to-amber-400/40 blur-lg animate-pulse pointer-events-none" />

                {/* Main Medallion SVG with authentic header spinning ring */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center">
                  <svg
                    viewBox="0 0 64 64"
                    className="w-full h-full drop-shadow-[0_0_20px_rgba(14,165,233,0.7)] select-none"
                  >
                    <defs>
                      <linearGradient id="heroCoreG" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0d2a4a" />
                        <stop offset="100%" stopColor="#040f26" />
                      </linearGradient>
                      <linearGradient id="heroRingG" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>

                    {/* Rotating Dashed Ring - uses global .logo-ring matching header logo */}
                    <circle
                      className="logo-ring"
                      cx="32"
                      cy="32"
                      r="29"
                      fill="none"
                      stroke="url(#heroRingG)"
                      strokeWidth="2.8"
                      strokeDasharray="10 5"
                      strokeLinecap="round"
                    />

                    {/* Inner Colored Accent Disc */}
                    <circle cx="32" cy="32" r="25" fill="url(#heroCoreG)" stroke="rgba(34, 211, 238, 0.45)" strokeWidth="0.8" />
                    
                    {/* Deep Space Core */}
                    <circle cx="32" cy="32" r="21" fill="#020817" />

                    {/* Central EV Text */}
                    <text
                      x="50%"
                      y="46%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="17"
                      fontWeight="900"
                      fontFamily="Segoe UI, system-ui, sans-serif"
                      letterSpacing="0.5px"
                    >
                      EV
                    </text>

                    {/* Subtitle E-VEDHIKA */}
                    <text
                      x="50%"
                      y="64%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="#facc15"
                      fontSize="5"
                      fontWeight="900"
                      letterSpacing="1.2px"
                      fontFamily="Segoe UI, system-ui, sans-serif"
                    >
                      E-VEDHIKA
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean & Sweet */}
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
                TS పంచాయతీ సాంకేతిక సేవల కేంద్రం
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

      {/* 6 Core Feature Quick Buttons - Sweet, Sleek & Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
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
          onClick={() => handleNav("/workspace", "workspace")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-indigo-950 hover:from-indigo-900 hover:to-blue-950 text-white rounded-xl border border-indigo-800/30 hover:border-indigo-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
            <Building size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-indigo-300 truncate">Mana Panchayath</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">డిజిటల్ వర్క్‌స్పేస్</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/suggestions", "suggestions")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-pink-950 hover:from-pink-900 hover:to-slate-900 text-white rounded-xl border border-pink-800/30 hover:border-pink-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 group-hover:scale-105 transition-transform shrink-0">
            <MessageSquare size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-pink-300 truncate">Public Feedback</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">సలహాలు &amp; సూచనలు</div>
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
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-purple-950 hover:from-purple-900 hover:to-slate-900 text-white rounded-xl border border-purple-800/30 hover:border-purple-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform shrink-0">
            <Download size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-purple-300 truncate">Software Hub</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">టోకెన్ డ్రైవర్లు &amp; టూల్స్</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleNav("/online_portal", "online_portal")}
          className="p-2 sm:p-2.5 bg-gradient-to-br from-slate-900 to-amber-950 hover:from-amber-900 hover:to-slate-900 text-white rounded-xl border border-amber-800/30 hover:border-amber-400/50 shadow-sm flex items-center gap-2 transition-all group cursor-pointer text-left"
        >
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform shrink-0">
            <Globe size={15} />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-amber-300 truncate">Online portal at your line</div>
            <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">త్వరలో ప్రారంభం (Soon)</div>
          </div>
        </button>
      </div>

      {/* Admin Quick Live Websites Modal */}
      {showAdminModal && isAdmin && (
        <div className="fixed inset-0 z-[12000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
            <LiveWebsitesManager
              user={effectiveUser}
              isModal={true}
              onClose={() => setShowAdminModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
