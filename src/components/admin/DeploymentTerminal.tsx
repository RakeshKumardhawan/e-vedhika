import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, AlertOctagon, CheckCircle, Clock } from 'lucide-react';

export function DeploymentTerminal() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const mockLogs = [
    "[SYSTEM] Initiating Secure SSH Connection to Render...",
    "[GITHUB] Fetching latest commit hash: a1b2c3d4...",
    "[NPM] Running npm install --production...",
    "[VITE] Building application payload...",
    "✔ Build completed in 14.2s",
    "[DOCKER] Building container image e-vedhika-web:latest...",
    "[FIREBASE] Syncing Firestore security rules...",
    "✔ Rules deployed successfully.",
    "[SERVER] Restarting instances gracefully...",
    "🚀 Deployment Successful! Live on www.e-vedhika.in",
  ];

  const handleDeploy = () => {
    setIsDeploying(true);
    setLogs(["[SYSTEM] Manual deployment triggered by Super Admin..."]);
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < mockLogs.length) {
        setLogs(prev => [...prev, mockLogs[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsDeploying(false);
      }
    }, 800);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[600px]">
      {/* Terminal Header */}
      <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <TerminalIcon size={16} className="text-emerald-400" />
          <h3 className="text-sm font-mono font-bold text-slate-300">Live Deployment & Server Logs Hub</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40 border border-emerald-600/50 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
          >
            <Play size={14} /> {isDeploying ? 'Deploying...' : 'Trigger Re-deploy'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600/20 text-amber-400 hover:bg-amber-600/40 border border-amber-600/50 rounded-lg text-xs font-mono font-bold transition-all">
            <RotateCcw size={14} /> Rollback
          </button>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#0D1117] font-mono text-xs leading-relaxed space-y-2">
        <div className="text-slate-500 mb-4">
          E-Vedhika Master Terminal v2.1.0 (Connected to Firebase & Render)<br />
          Type 'help' to see available commands or use the UI triggers above.
        </div>
        
        {logs.map((log, index) => (
          <div key={index} className="flex gap-3">
            <span className="text-slate-600 select-none">
              {new Date().toLocaleTimeString([], { hour12: false })}
            </span>
            <span className={`
              ${log?.includes('[SYSTEM]') ? 'text-blue-400' : ''}
              ${log?.includes('[GITHUB]') ? 'text-purple-400' : ''}
              ${log?.includes('✔') || log?.includes('🚀') ? 'text-emerald-400 font-bold' : ''}
              ${log?.includes('Error') ? 'text-rose-400' : 'text-slate-300'}
            `}>
              {log}
            </span>
          </div>
        ))}
        {isDeploying && (
          <div className="flex items-center gap-2 text-emerald-500/70 animate-pulse mt-2">
            <span className="w-2 h-4 bg-emerald-500/70 inline-block"></span> Processing...
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>
      
      {/* CLI Input */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center gap-3">
        <span className="text-emerald-500 font-mono font-bold">root@e-vedhika:~#</span>
        <input 
          type="text" 
          disabled
          placeholder="Terminal input is in read-only visual mode for this demo..." 
          className="flex-1 bg-transparent border-none text-slate-300 font-mono text-xs focus:outline-none placeholder-slate-600"
        />
      </div>
    </div>
  );
}
