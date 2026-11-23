import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Loader2, ShieldCheck, UserCheck } from "lucide-react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

interface AuthModalProps {
  onClose: () => void;
  addToast: (msg: string) => void;
  handleGoogleLogin: () => void;
  districtsData?: Record<string, string[]>;
}

export function AuthModal({
  onClose,
  handleGoogleLogin,
}: AuthModalProps) {
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && !user.isAnonymous) {
        onClose();
      }
    });
    return () => unsub();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[11000] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3.5">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-full max-w-[410px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col border border-slate-200/90"
      >
        {/* Header - Royal Navy Elegance with Glowing Spinning Emblem */}
        <div className="bg-gradient-to-b from-[#0d2a4a] via-[#09223a] to-[#06182a] px-6 pt-6 pb-5 text-white text-center relative flex flex-col items-center border-b border-amber-400/20">
          <button
            type="button"
            aria-label="Close auth modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-full transition-all active:scale-90 cursor-pointer backdrop-blur-sm"
          >
            <X size={16} />
          </button>

          {/* Authentic E-Vedhika Logo Medallion with Rotating Dashed Ring */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Outer Soft Halos */}
            <div className="absolute -inset-2 rounded-full bg-cyan-400/25 blur-lg pointer-events-none" />
            <div className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0">
                <defs>
                  <linearGradient id="authModalG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                  <linearGradient id="authModalRingG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#0ea5e9" />
                  </linearGradient>
                </defs>

                {/* Rotating Dashed Ring */}
                <circle
                  className="logo-ring"
                  cx="32"
                  cy="32"
                  r="29"
                  fill="none"
                  stroke="url(#authModalRingG)"
                  strokeWidth="2.8"
                  strokeDasharray="10 5"
                  strokeLinecap="round"
                />

                {/* Inner Colored Accent Disc */}
                <circle cx="32" cy="32" r="25" fill="url(#authModalG)" stroke="rgba(34, 211, 238, 0.45)" strokeWidth="0.8" />
                
                {/* Deep Core */}
                <circle cx="32" cy="32" r="21" fill="#020817" />

                {/* Central EV Text */}
                <text
                  x="50%"
                  y="53%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="18"
                  fontWeight="900"
                  fontFamily="Segoe UI, sans-serif"
                >
                  EV
                </text>
              </svg>
            </div>
          </div>

          <h2
            className="text-lg font-black uppercase tracking-wider leading-none mb-1.5 flex items-center gap-1"
            style={{
              color: "#fbe947",
              fontFamily: '"Arial Black", Impact, sans-serif',
              letterSpacing: "0.8px",
            }}
          >
            E<span style={{ color: "#facc15" }}>-</span>VEDHIKA
          </h2>
          <p className="text-[11px] font-bold text-cyan-200/90 tracking-wide">
            గూగుల్ ఖాతాతో లాగిన్ • Google Sign In
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-white space-y-4">
          {/* Profile Notice Card - Clean & Sweet Design */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/30 border border-amber-200/90 text-left shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-amber-500/15 text-amber-700">
                <UserCheck size={14} />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                ముఖ్య గమనిక (Profile Step)
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-950/85 font-medium pl-6">
              Google తో లాగిన్ అయిన తర్వాత మీ ప్రొఫైల్ వివరాలు అసంపూర్తిగా ఉంటే, ముందుగా ప్రొఫైల్ పూర్తి చేసిన తర్వాతే పోర్టల్ సేవలు ప్రారంభమవుతాయి.
            </p>
          </div>

          {/* Clean, Neat & High-End Google Login Button */}
          <button
            aria-label="Continue with Google"
            type="button"
            disabled={googleLoading}
            onClick={async () => {
              if (googleLoading) return;
              setGoogleLoading(true);
              const safetyTimer = setTimeout(() => {
                setGoogleLoading(false);
              }, 4000);

              try {
                await handleGoogleLogin();
              } catch (e) {
                console.error("Google Auth error:", e);
              } finally {
                clearTimeout(safetyTimer);
                setGoogleLoading(false);
              }
            }}
            className="w-full bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 active:border-blue-500 py-3.5 px-5 rounded-2xl font-bold text-slate-700 hover:text-slate-900 text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm hover:shadow-md cursor-pointer group disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 className="animate-spin text-blue-600" size={19} />
                <span className="font-semibold text-slate-600">గూగుల్‌తో కనెక్ట్ అవుతోంది...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0 group-hover:scale-105 transition-transform">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="tracking-wide">Google తో లాగిన్ అవ్వండి (Continue with Google)</span>
              </>
            )}
          </button>

          {/* Secure Trust Badge */}
          <div className="pt-1 flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-semibold">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>సురక్షితమైన అధికారిక లాగిన్ (100% Verified &amp; Secure)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
