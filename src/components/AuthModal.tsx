import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Loader2, UserCheck, ShieldCheck } from "lucide-react";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { EVAnimatedLogo } from "./EVAnimatedLogo";

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
  const [isSignup, setIsSignup] = useState(false);
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
    <div className="fixed inset-0 z-[11000] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[390px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200/80"
      >
        <div className="bg-gradient-to-b from-[#0f2e4a] to-[#0a1f33] px-4 py-4 text-white text-center relative flex flex-col items-center border-b border-indigo-950/20">
          <button
            aria-label="Close auth modal"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 cursor-pointer"
          >
            <X size={14} />
          </button>

          <div className="mb-1.5 bg-white/5 p-1.5 rounded-full border border-white/10 shadow-xs">
            <EVAnimatedLogo size={28} />
          </div>

          <h2
            className="text-base font-bold uppercase tracking-wider leading-none mb-1 flex items-center gap-1"
            style={{
              color: "#fbe947",
              fontFamily: "sans-serif",
            }}
          >
            E<span style={{ color: "#facc15" }}>-</span>VEDHIKA
          </h2>
          <p className="text-[10px] font-semibold text-white/85 uppercase tracking-widest">
            {isSignup
              ? "గూగుల్ ఖాతాతో సైన్ అప్ (Google Sign Up)"
              : "గూగుల్ ఖాతాతో లాగిన్ (Google Sign In)"}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 bg-white custom-scrollbar">
          {/* Mandatory Profile Notice */}
          <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-left">
            <UserCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-amber-950 font-semibold">
              <span className="font-black text-amber-800 block mb-0.5">
                ముఖ్య గమనిక (Mandatory Profile Step):
              </span>
              {isSignup
                ? "Google తో సైన్ అప్ అయిన వెంటనే ముందుగా మీ ప్రొఫైల్ వివరాలను (ఇంటి పేరు, పేరు, జిల్లా, మండలం, గ్రామ పంచాయతీ, హోదా) పూర్తి చేస్తేనే పోర్టల్ యాక్సెస్ లభిస్తుంది."
                : "Google తో లాగిన్ అయిన తర్వాత మీ ప్రొఫైల్ వివరాలు అసంపూర్తిగా ఉంటే, ముందుగా ప్రొఫైల్ పూర్తి చేసిన తర్వాతే పోర్టల్ యాక్సెస్ లభిస్తుంది."}
            </div>
          </div>

          {/* Google Sign In / Sign Up Button */}
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
            className="w-full bg-white border-2 border-slate-200 hover:border-indigo-600 py-3 px-4 rounded-xl font-bold text-slate-800 hover:text-indigo-900 text-xs sm:text-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm cursor-pointer group disabled:opacity-60"
          >
            {googleLoading ? (
              <>
                <Loader2 className="animate-spin text-indigo-600" size={18} />
                <span>గూగుల్‌తో కనెక్ట్ అవుతోంది...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24">
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
                <span>
                  {isSignup
                    ? "Google తో సైన్ అప్ చేయండి (Sign Up with Google)"
                    : "Google తో లాగిన్ అవ్వండి (Continue with Google)"}
                </span>
              </>
            )}
          </button>

          <div className="mt-4 p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center flex items-center justify-center gap-2">
            <ShieldCheck size={14} className="text-indigo-600 shrink-0" />
            <p className="text-[10px] text-slate-600 font-medium leading-snug">
              Google లాగిన్ ఆలస్యం అయితే పైన ఉన్న ↗ గుర్తుపై క్లిక్ చేసి కొత్త ట్యాబ్‌లో ఓపెన్ చేయండి.
            </p>
          </div>

          <div className="mt-3.5 text-center pb-0.5">
            <button
              aria-label={isSignup ? "Switch to Sign In" : "Switch to Sign Up"}
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#0f2e4a] hover:text-indigo-600 font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
            >
              {isSignup
                ? "ఇప్పటికే ఖాతా ఉందా? Google తో లాగిన్ అవ్వండి"
                : "కొత్త యూజరా? Google తో సైన్ అప్ చేయండి"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
