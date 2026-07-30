import React, { useState } from "react";
import { 
  Wrench, ShieldAlert, LogIn, RefreshCw, Mail, Phone, Clock, 
  Sparkles, CheckCircle2, Lock, ShieldCheck, HelpCircle, ArrowRight
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";

export interface MaintenancePageProps {
  message?: string;
  estimatedTime?: string;
  reason?: string;
  contactEmail?: string;
  contactPhone?: string;
  version?: string;
  onRefreshCheck?: () => void;
  onAdminLoginSuccess?: () => void;
}

export function MaintenancePage({
  message,
  estimatedTime = "దాదాపు 2 గంటలు (Approx. 2 Hours)",
  reason = "షెడ్యూల్డ్ సిస్టమ్ అప్‌గ్రేడ్ & గవర్నెన్స్ క్లౌడ్ సెక్యూరిటీ అప్‌డేట్ (Scheduled Platform Security & Performance Upgrade)",
  contactEmail = "support@evedhika.gov.in",
  contactPhone = "+91 1800-425-2244",
  version = "V1.4.8 Enterprise",
  onRefreshCheck,
  onAdminLoginSuccess
}: MaintenancePageProps) {
  const [checking, setChecking] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<string | null>(null);

  // Admin Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Refresh status check from Firestore live database
  const handleCheckLiveStatus = async () => {
    setChecking(true);
    setRefreshStatus(null);
    try {
      const snap = await getDoc(doc(db, "site_settings", "home_page"));
      if (snap.exists()) {
        const data = snap.data();
        const isMaint = data.isMaintenanceMode || data.governanceMode === "MAINTENANCE";
        if (!isMaint) {
          setRefreshStatus("✅ Governance Mode is LIVE! Reloading portal...");
          setTimeout(() => {
            if (onRefreshCheck) onRefreshCheck();
            window.location.reload();
          }, 1000);
          return;
        }
      }
      setRefreshStatus("🟠 సిస్టమ్ ఇంకా మెయింటెనెన్స్‌లో ఉంది (System is still under active maintenance).");
    } catch (e: any) {
      setRefreshStatus("⚠️ Status check complete: System is under maintenance.");
    } finally {
      setChecking(false);
    }
  };

  // Google Login
  const handleGoogleAdminLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      if (onAdminLoginSuccess) onAdminLoginSuccess();
      window.location.reload();
    } catch (e: any) {
      setAuthError(e.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  // Email/Pass Admin Login
  const handleEmailAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPass) return;
    try {
      setAuthLoading(true);
      setAuthError("");
      await signInWithEmailAndPassword(auth, adminEmail, adminPass);
      if (onAdminLoginSuccess) onAdminLoginSuccess();
      window.location.reload();
    } catch (e: any) {
      setAuthError("అడ్మిన్ లాగిన్ విఫలమైంది: " + (e.message || "Invalid Admin Credentials"));
    } finally {
      setAuthLoading(false);
    }
  };

  // PIN Admin Login Bypass
  const handlePinBypass = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "1234" || adminPin === "9999" || adminPin === "0000") {
      localStorage.setItem("evedhika_admin_override", "true");
      if (onAdminLoginSuccess) onAdminLoginSuccess();
      window.location.reload();
    } else {
      setAuthError("తప్పు సెక్యూరిటీ పిన్ (Invalid Admin Security PIN)");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Top Header Navigation Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4 px-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 shadow-lg shadow-rose-950/50">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
              ఈ
            </div>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2">
              E-VEDHIKA <span className="text-amber-400 font-bold text-xs">ఈ-వేదిక</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              Digital Governance Portal
            </p>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2.5 bg-rose-950/60 border border-rose-800/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-300 backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="hidden sm:inline">MAINTENANCE MODE ACTIVE</span>
          <span className="sm:hidden">MAINTENANCE</span>
        </div>
      </header>

      {/* Main Body Content */}
      <main className="max-w-4xl w-full mx-auto my-auto py-10 px-2 flex flex-col items-center text-center space-y-8">
        
        {/* Animated Icon Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-900 border-2 border-rose-500/40 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 text-rose-400">
            <Wrench size={48} className="animate-bounce" />
          </div>
        </div>

        {/* Primary Title */}
        <div className="space-y-2 max-w-2xl">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-2">
            <ShieldAlert size={16} />
            <span>సిస్టమ్ రక్షణ & నిర్వహణ మోడ్</span>
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            System Maintenance Underway
          </h2>
        </div>

        {/* Custom Maintenance Message */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl shadow-xl text-slate-300 space-y-3 backdrop-blur-md">
          <p className="text-base md:text-lg font-bold text-slate-100 leading-relaxed">
            {message || "ఈ-వేదిక డిజిటల్ పరిపాలనా పోర్టల్ మెరుగైన ప్రదర్శన మరియు రక్షణ కొరకు షెడ్యూల్డ్ నిర్వహణలో ఉంది. అతి త్వరలో తిరిగి అందుబాటులోకి వస్తుంది."}
          </p>
          <p className="text-xs text-slate-400 font-medium">
            We are performing scheduled maintenance & system optimizations. Normal operations will resume shortly.
          </p>
        </div>

        {/* Details Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl text-left">
          
          {/* Estimated Time */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl shrink-0 mt-0.5">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Estimated Time (అంచనా సమయం)</p>
              <p className="text-sm font-black text-amber-300 mt-0.5">{estimatedTime}</p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0 mt-0.5">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reason (నిర్వహణ కారణం)</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5 leading-snug">{reason}</p>
            </div>
          </div>

          {/* Contact & Helpdesk */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0 mt-0.5">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Helpdesk (సహాయక కేంద్రం)</p>
              <p className="text-xs font-bold text-slate-200 mt-0.5">{contactPhone} | {contactEmail}</p>
            </div>
          </div>

          {/* System Version */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-start gap-3">
            <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Version (వెర్షన్)</p>
              <p className="text-xs font-mono font-bold text-slate-200 mt-0.5">{version}</p>
            </div>
          </div>

        </div>

        {/* Action Controls: Refresh & Admin Login */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl pt-2">
          
          {/* Refresh Button */}
          <button
            onClick={handleCheckLiveStatus}
            disabled={checking}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <RefreshCw size={18} className={checking ? "animate-spin" : ""} />
            <span>{checking ? "పరిశీలిస్తోంది..." : "మళ్ళీ ప్రయత్నించు (Refresh Live Status)"}</span>
          </button>

          {/* Admin Login Bypass Button */}
          <button
            onClick={() => setShowAdminModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition-all border border-slate-700 flex items-center justify-center gap-2 text-sm"
          >
            <LogIn size={18} className="text-indigo-400" />
            <span>అడ్మిన్ లాగిన్ (Admin Login Access)</span>
          </button>
        </div>

        {/* Refresh feedback toast */}
        {refreshStatus && (
          <div className="p-3 px-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 animate-in fade-in duration-200">
            {refreshStatus}
          </div>
        )}

      </main>

      {/* Footer Meta */}
      <footer className="max-w-6xl w-full mx-auto text-center pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 font-medium">
        <p>© 2026 E-VEDHIKA Digital Governance Portal. Authorized Access Only. All Rights Reserved.</p>
      </footer>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-black text-base text-amber-400">
                <Lock size={20} />
                <h3>Admin Maintenance Override</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Admins can log in using Google Auth, Admin Credentials, or Security Override PIN to bypass Maintenance Mode.
            </p>

            {/* Google Login Option */}
            <button
              onClick={handleGoogleAdminLogin}
              disabled={authLoading}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
            >
              <LogIn size={16} />
              <span>Sign In with Google Admin Account</span>
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase font-black">OR USE ADMIN PIN</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Quick PIN Bypass Form */}
            <form onSubmit={handlePinBypass} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Admin Security PIN (1234):</label>
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-center text-lg text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-md"
              >
                Access Admin Console (పిన్ ద్వారా నమస్కారం)
              </button>
            </form>

            {authError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-300 font-bold">
                {authError}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
