import React, { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("evedhika_cookie_consent");
      if (!consent) {
        // Small delay so it animates in cleanly without blocking initial load
        const t = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(t);
      }
    } catch (e) {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("evedhika_cookie_consent", "accepted");
    } catch (e) {}
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[99990] bg-slate-900/95 text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
          <Cookie size={18} />
        </div>
        <div className="space-y-1.5 flex-1 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-white text-sm flex items-center gap-1.5">
              Cookie Consent
            </h4>
            <button
              onClick={handleAccept}
              className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed font-medium">
            E-Vedhika uses cookies to ensure optimal performance, support PWA offline storage, and personalize advertisements with Google AdSense.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md text-xs cursor-pointer"
            >
              Accept
            </button>
            <Link
              to="/cookie-policy"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all text-xs font-semibold"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
