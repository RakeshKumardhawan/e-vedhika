/**
 * UnderConstruction.tsx
 * Shows "Under Construction" page for /online_portal
 * Admin access via: /online_portal?admin=ev2026secure
 * Once unlocked, stores key in sessionStorage for the tab session.
 */

import React, { useState } from "react";
import { Construction, Lock, ArrowRight, ShieldCheck } from "lucide-react";

const ADMIN_SECRET = "ev2026secure"; // Change this to your preferred secret

export function checkAdminAccess(): boolean {
  // Check URL param
  const params = new URLSearchParams(window.location.search);
  const keyParam = params.get("admin") || params.get("key");
  if (keyParam === ADMIN_SECRET) {
    sessionStorage.setItem("ev_admin_access", ADMIN_SECRET);
    // Clean URL (remove ?admin= from address bar)
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, "", cleanUrl);
    return true;
  }
  // Check sessionStorage (persists within same browser tab)
  return sessionStorage.getItem("ev_admin_access") === ADMIN_SECRET;
}

interface GuardProps {
  children: React.ReactNode;
}

export function OnlinePortalGuard({ children }: GuardProps) {
  const [unlocked, setUnlocked] = useState(() => checkAdminAccess());
  if (unlocked) {
    return <>{children}</>;
  }
  return <UnderConstruction onAdminAccess={() => setUnlocked(true)} />;
}

interface Props {
  onAdminAccess: () => void;
}

export function UnderConstruction({ onAdminAccess }: Props) {
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (inputKey.trim() === ADMIN_SECRET) {
      sessionStorage.setItem("ev_admin_access", ADMIN_SECRET);
      onAdminAccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center animate-pulse">
              <Construction className="w-14 h-14 text-orange-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-300" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">E-Vedhika</span>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Under Construction
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            ఆన్‌లైన్ రిపోర్టింగ్ మాడ్యూల్ త్వరలో అందుబాటులోకి వస్తుంది.
            <br />
            <span className="text-slate-500">Online Reporting Module — Coming Soon</span>
          </p>
        </div>

        {/* Progress bar decoration */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Development Progress</span>
            <span>85%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-gradient-to-r from-orange-500 to-blue-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Admin Access Form */}
        <div className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-4 backdrop-blur-sm transition-all duration-300 ${shake ? "animate-bounce" : ""}`}>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Admin Access Only</span>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3">
            <input
              type="password"
              placeholder="Admin Access Key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-slate-700/50 border text-white placeholder-slate-500 text-sm outline-none focus:ring-2 transition-all ${
                error
                  ? "border-red-500/60 focus:ring-red-500/30"
                  : "border-slate-600/50 focus:ring-blue-500/30 focus:border-blue-500/50"
              }`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs text-left animate-fade-in">
                ❌ తప్పు Key — Admin మాత్రమే access చేయగలరు
              </p>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-slate-600 text-xs">
          © 2026 E-Vedhika — All Rights Reserved
        </p>
      </div>
    </div>
  );
}
