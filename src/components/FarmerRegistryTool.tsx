import React, { useState, useEffect, useRef } from "react";
import { 
  FileSpreadsheet, 
  FileUp, 
  Download, 
  RefreshCw, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Info,
  Database,
  Trash2,
  FileText,
  Play,
  Plus,
  ArrowRight,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface JobStatus {
  id: string;
  status: "queued" | "processing" | "paused_captcha" | "completed" | "failed";
  progress: number;
  totalRecords: number;
  processedRecords: number;
  uploadedFilename: string;
  file1Name: string;
  file2Name: string;
  gpName: string;
  outputPath: string | null;
  error: string | null;
  createdAt: string;
  verificationMode?: 'lightweight' | 'real_live';
  browserLogs?: string[];
  captchaRequired?: boolean;
  captchaChallenge?: string;
}

interface GPWorkRow {
  id: string;
  gpName: string;
  file1: File | null;
  file2: File | null;
  status: "pending" | "uploading" | "queued" | "processing" | "paused_captcha" | "completed" | "failed";
  progress: number;
  jobId: string | null;
  totalRecords: number;
  processedRecords: number;
  error: string | null;
  verificationMode: 'lightweight' | 'real_live';
  rateLimitMs: number;
  browserLogs: string[];
  captchaRequired?: boolean;
  captchaChallenge?: string;
  captchaSolutionText?: string;
}

interface FarmerRegistryToolProps {
  user?: any;
  onLoginClick?: () => void;
}

export function FarmerRegistryTool({ user, onLoginClick }: FarmerRegistryToolProps = {}) {
  const [gpRows, setGpRows] = useState<GPWorkRow[]>([
    {
      id: "gp-" + Date.now() + "-1",
      gpName: "GP-1",
      file1: null,
      file2: null,
      status: "pending",
      progress: 0,
      jobId: null,
      totalRecords: 0,
      processedRecords: 0,
      error: null,
      verificationMode: 'real_live',
      rateLimitMs: 1500,
      browserLogs: []
    }
  ]);
  const [isProcessingPipeline, setIsProcessingPipeline] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([
    "సిస్టమ్ ఆటోమేటిక్ పైప్‌లైన్ సిద్ధంగా ఉంది ✔",
    "సహాయం: FILE 1 మరియు FILE 2 లను జత చేసి వెరిఫికేషన్ ప్రారంభించండి."
  ]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<any>(null);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const addGpRow = () => {
    const nextNum = gpRows.length + 1;
    setGpRows(prev => [
      ...prev,
      {
        id: "gp-" + Date.now() + "-" + nextNum,
        gpName: `GP-${nextNum}`,
        file1: null,
        file2: null,
        status: "pending",
        progress: 0,
        jobId: null,
        totalRecords: 0,
        processedRecords: 0,
        error: null,
        verificationMode: 'real_live',
        rateLimitMs: 1500,
        browserLogs: []
      }
    ]);
    setLogs(prev => [...prev, `కొత్తగా GP-${nextNum} వర్క్‌స్పేస్ జోడించబడింది.`]);
  };

  const removeGpRow = (id: string) => {
    setGpRows(prev => prev.filter(x => x.id !== id));
  };

  const updateGpName = (id: string, name: string) => {
    setGpRows(prev => prev.map(x => 
      x.id === id ? { ...x, gpName: name.toUpperCase() } : x
    ));
  };

  const handleFileChange = (id: string, field: "file1" | "file2", file: File | null) => {
    if (!file) return;

    setGpRows(prev => prev.map(x => {
      if (x.id === id) {
        // Auto extract candidate GP Name if name is default
        let updatedGpName = x.gpName;
        if (x.gpName.startsWith("GP-")) {
          const baseName = file.name.split(".")[0];
          const cleaned = baseName.replace(/[^a-zA-Z\s\u0c00-\u0c7f]/g, " ").trim();
          const firstWord = cleaned ? cleaned.split(/\s+/)[0].toUpperCase() : "";
          if (firstWord) {
            updatedGpName = firstWord;
          }
        }

        return {
          ...x,
          [field]: file,
          gpName: updatedGpName
        };
      }
      return x;
    }));

    setLogs(prev => [
      ...prev,
      `ఫైల్ అప్‌లోడ్: ${file.name} (${field === "file1" ? "FILE 1" : "FILE 2"} గా యాడ్ చేయబడింది)`
    ]);
  };

  const startPipelineVerification = async () => {
    const itemsToProcess = gpRows.filter(x => x.status === "pending" && x.file1 && x.file2);
    if (itemsToProcess.length === 0) {
      setLogs(prev => [...prev, "⚠️ క్యూలో ప్రాసెస్ చేయడానికి పూర్తి ఫైల్ జతలు ఏవీ లేవు! దయచేసి FILE 1 మరియు FILE 2 రెండింటినీ ఎంచుకోండి."]);
      return;
    }

    setIsProcessingPipeline(true);
    setLogs(prev => [...prev, "🚀 పైప్‌లైన్ ప్రాసెసింగ్ ప్రారంభమైంది..."]);

    for (const item of itemsToProcess) {
      setGpRows(prev => prev.map(x => x.id === item.id ? { ...x, status: "uploading" } : x));
      setLogs(prev => [...prev, `ఆటోమేటిక్ మ్యాచింగ్ & ప్రాసెస్ ప్రారంభం: GP: ${item.gpName}...`]);

      const formData = new FormData();
      formData.append("file1", item.file1!);
      formData.append("file2", item.file2!);
      formData.append("gpName", item.gpName);
      formData.append("verificationMode", item.verificationMode);
      formData.append("rateLimitMs", String(item.rateLimitMs));

      try {
        const resp = await fetch("/api/farmer-registry/upload", {
          method: "POST",
          body: formData,
        });

        if (!resp.ok) {
          const errData = await resp.json();
          throw new Error(errData.error || "సర్వర్ లోపం సంభవించింది");
        }

        const data = await resp.json();
        
        setGpRows(prev => prev.map(x => 
          x.id === item.id ? { 
            ...x, 
            status: "queued", 
            jobId: data.jobId,
            error: null 
          } : x
        ));

        setLogs(prev => [
          ...prev,
          `GP ${item.gpName}: ఫైళ్లు విలీనం చేయబడి తాత్కాలిక FILE 3 క్రియేట్ చేయబడింది. క్యూ జాబ్ ఐడి: ${data.jobId}`
        ]);

      } catch (err: any) {
        setGpRows(prev => prev.map(x => 
          x.id === item.id ? { ...x, status: "failed", error: err.message } : x
        ));
        setLogs(prev => [...prev, `❌ విఫలమైంది (${item.gpName}): ${err.message}`]);
      }
    }

    startGlobalPolling();
  };

  const startGlobalPolling = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      setGpRows(prevRows => {
        const activeRows = prevRows.filter(x => 
          x.jobId && (x.status === "queued" || x.status === "processing" || x.status === "uploading" || x.status === "paused_captcha")
        );

        if (activeRows.length === 0) {
          clearInterval(pollIntervalRef.current);
          setIsProcessingPipeline(false);
          return prevRows;
        }

        activeRows.forEach(async (item) => {
          try {
            const resp = await fetch(`/api/farmer-registry/jobs/${item.jobId}`);
            if (!resp.ok) return;

            const jobStatus: JobStatus = await resp.json();
            
            setGpRows(current => current.map(x => {
              if (x.id === item.id) {
                if (x.status !== "completed" && x.status !== "failed" && x.status !== "paused_captcha") {
                  if (jobStatus.status === "completed") {
                    setLogs(l => [
                      ...l, 
                      `✅ విజయవంతంగా పూర్తయింది! GP ${x.gpName}: ${jobStatus.totalRecords} రికార్డుల నమోదు లైవ్ చెక్ చేయబడింది. FILE 4 డౌన్లోడ్ చేయడానికి సిద్ధంగా ఉంది!`
                    ]);
                  } else if (jobStatus.status === "failed") {
                    setLogs(l => [
                      ...l,
                      `❌ బ్యాక్‌గ్రౌండ్ వెరిఫికేషన్ వైఫల్యం (${x.gpName}): ${jobStatus.error || "తేలియని సర్వర్ లోపం."}`
                    ]);
                  } else if (jobStatus.status === "paused_captcha") {
                    setLogs(l => [
                      ...l,
                      `⚠️ సెక్యూరిటీ బ్లాక్ (${x.gpName}): వెబ్‌సైట్ CAPTCHA తగిలింది! ఒపెరేటర్ పరిష్కారం కొరకు నిలిపివేయబడింది.`
                    ]);
                  }
                }

                return {
                  ...x,
                  status: jobStatus.status,
                  progress: jobStatus.progress,
                  totalRecords: jobStatus.totalRecords,
                  processedRecords: jobStatus.processedRecords,
                  error: jobStatus.error,
                  browserLogs: jobStatus.browserLogs || [],
                  captchaRequired: jobStatus.captchaRequired || false,
                  captchaChallenge: jobStatus.captchaChallenge
                };
              }
              return x;
            }));
          } catch (e) {
            // Ignore temporary network failures
          }
        });

        return prevRows;
      });
    }, 1500);
  };

  const solveCaptchaValue = async (rowId: string, jobId: string, code: string) => {
    if (!code) {
      alert("దయచేసి CAPTCHA కోడ్ ఎంటర్ చేయండి.");
      return;
    }

    try {
      const resp = await fetch(`/api/farmer-registry/jobs/${jobId}/solve-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });

      const resData = await resp.json();
      if (!resp.ok) {
        throw new Error(resData.error || "CAPTCHA సబ్మిషన్ విఫలమైంది.");
      }

      setGpRows(current => current.map(x => 
        x.id === rowId ? { 
          ...x, 
          status: "queued",
          captchaRequired: false,
          captchaChallenge: undefined,
          captchaSolutionText: "" 
        } : x
      ));

      setLogs(l => [...l, `✅ CAPTCHA విజయవంతంగా పరిష్కరించబడింది. జాబ్ ${jobId} పునఃప్రారంభించబడుతోంది`]);
      startGlobalPolling();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDownload = (item: GPWorkRow) => {
    if (!item.jobId || item.status !== "completed") return;
    window.location.href = `/api/farmer-registry/download/${item.jobId}`;
  };

  const clearAll = () => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    setGpRows([
      {
        id: "gp-" + Date.now() + "-1",
        gpName: "GP-1",
        file1: null,
        file2: null,
        status: "pending",
        progress: 0,
        jobId: null,
        totalRecords: 0,
        processedRecords: 0,
        error: null,
        verificationMode: 'lightweight',
        rateLimitMs: 1500,
        browserLogs: []
      }
    ]);
    setIsProcessingPipeline(false);
    setLogs([
      "వర్క్‌స్పేస్ పునఃప్రారంభించబడింది.",
      "FILE 1 మరియు FILE 2 జోడించి మ్యాచింగ్ పైప్‌లైన్ ప్రారంభించండి."
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Title Header */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-2xl mb-8 relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6 ml-2">
            <div className="w-16 h-16 bg-white/10 text-teal-400 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/10">
              <Database size={32} />
            </div>
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                AUTOMATIC MERGING PIPELINE
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-1 text-white">
                Farmer Registry Live Verification
              </h1>
              <p className="text-sm text-slate-300 font-bold tracking-normal mt-1">
                రైతు రిజిస్ట్రీ ఎన్‌రోల్‌మెంట్ ఆటోమేటిక్ ల్యాండ్ విలీనం మరియు లైవ్ వెరిఫికేషన్ నివేదిక సాధనం
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Workspace row designer */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8 space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-800 tracking-tight">గ్రామ పంచాయతీల జాబితా (GPs Workflow Setup)</h2>
                <p className="text-xs text-slate-400 font-medium">కింది ప్రతి పంచాయతీకి జంటగా ఫైల్స్ జతచేయండి.</p>
              </div>

              <button
                disabled={isProcessingPipeline}
                onClick={addGpRow}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 disabled:opacity-50 text-xs font-extrabold rounded-xl transition-colors flex items-center gap-1 border border-indigo-100"
              >
                <Plus size={14} />
                GP జోడించు
              </button>
            </div>

            {/* Workplace list */}
            <div className="space-y-4">
              <AnimatePresence>
                {gpRows.map((row, idx) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50/45 space-y-4 hover:border-slate-200 transition-all shadow-sm"
                  >
                    {/* Header of GP Row workspace */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-600 font-mono text-[10px] text-white flex items-center justify-center rounded-full font-black">
                          {idx + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">పంచాయతీ: </span>
                          <input
                            type="text"
                            disabled={row.status !== "pending"}
                            value={row.gpName}
                            onChange={(e) => updateGpName(row.id, e.target.value)}
                            className="bg-transparent border-b border-slate-200 font-black text-slate-800 text-xs px-1 py-0.5 w-36 outline-none uppercase focus:border-indigo-500"
                            placeholder="GP NAME"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          row.status === "completed" 
                            ? "bg-emerald-100 text-emerald-700"
                            : row.status === "failed"
                            ? "bg-rose-100 text-rose-700"
                            : row.status === "processing" || row.status === "uploading" || row.status === "queued" || row.status === "paused_captcha"
                            ? "bg-indigo-100 text-indigo-700 animate-pulse"
                            : "bg-slate-200 text-slate-500"
                        }`}>
                          {row.status === "pending" ? "వారధి సిద్ధంగా ఉంది" : row.status}
                        </span>

                        {gpRows.length > 1 && row.status === "pending" && (
                          <button
                            onClick={() => removeGpRow(row.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            title="ఈ పంచాయతీని తొలగించు"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {row.status === "pending" ? (
                      <div className="space-y-3">
                        {!user ? (
                          <div className="bg-slate-50 border-2 border-dashed border-slate-200/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-150 shadow-sm animate-bounce">
                              <Lock size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-700">ఫైల్స్ అప్‌లోడ్ చేయడానికి దయచేసి లాగిన్ అవ్వండి</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1">రైతు రిజిస్ట్రీ ఆధారిత ఆటోమేటిక్ ల్యాండ్ విలీనం మరియు తనిఖీల కొరకు లాగిన్ అవ్వడం తప్పనిసరి.</p>
                            </div>
                            <button
                              type="button"
                              onClick={onLoginClick}
                              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-indigo-500/15 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                              లాగిన్ అవ్వండి (Login Now)
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* File 1 Upload Box */}
                              <div className="bg-white border border-slate-200/65 rounded-xl p-3 flex flex-col justify-between items-start gap-2.5 transition-all hover:shadow-md">
                                <div>
                                  <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                                    FILE 1 (Main/Land)
                                  </span>
                                  <div className="text-[11px] font-bold text-slate-500 mt-1">
                                    ఆటో-మ్యాచింగ్ కోసం <b>BucketID</b> ఉండే ఫైల్
                                  </div>
                                </div>

                                <div className="w-full flex items-center justify-between gap-2 mt-1">
                                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-44">
                                    {row.file1 ? row.file1.name : "ఫైల్ సెలెక్ట్ చేయలేదు"}
                                  </span>
                                  <label className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 border border-slate-200 hover:border-sky-200">
                                    <FileUp size={12} />
                                    చూస్
                                    <input
                                      type="file"
                                      accept=".xlsx, .xls, .csv"
                                      onChange={(e) => handleFileChange(row.id, "file1", e.target.files ? e.target.files[0] : null)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>

                              {/* File 2 Upload Box */}
                              <div className="bg-white border border-slate-200/65 rounded-xl p-3 flex flex-col justify-between items-start gap-2.5 transition-all hover:shadow-md">
                                <div>
                                  <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-black tracking-wide uppercase">
                                    FILE 2 (Checklist)
                                  </span>
                                  <div className="text-[11px] font-bold text-slate-500 mt-1">
                                    ఆధార్ కోసం <b>PPBNO & AadhaarId</b> ఉండే ఫైల్
                                  </div>
                                </div>

                                <div className="w-full flex items-center justify-between gap-2 mt-1">
                                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-44">
                                    {row.file2 ? row.file2.name : "ఫైల్ సెలెక్ట్ చేయలేదు"}
                                  </span>
                                  <label className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 border border-slate-200 hover:border-emerald-200">
                                    <FileUp size={12} />
                                    చూస్
                                    <input
                                      type="file"
                                      accept=".xlsx, .xls, .csv"
                                      onChange={(e) => handleFileChange(row.id, "file2", e.target.files ? e.target.files[0] : null)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Integration parameters Strategy block */}
                            <div className="bg-white border border-slate-150 rounded-2xl p-4 space-y-3 shadow-inner">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-xs font-black text-slate-700 block">ధృవీకరణ శైలి (Verification Mode)</span>
                                  <span className="text-[10px] text-slate-400 font-bold block">లైవ్ పోర్టల్ పద్ధతిని సెట్ చేయండి.</span>
                                </div>
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                  <span className="px-3.5 py-1.5 text-[11px] font-extrabold rounded-md bg-rose-600 text-white shadow-sm">
                                    రియల్ వెబ్‌సైట్ (Stealth)
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-100 space-y-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-bold">ధృవీకరణ వేగం (Verification Speed):</span>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-150 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                      గరిష్ట వేగం (Full Speed - 100% Instant)
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                                    ఆలస్యాలు ఏమీ లేకుండా పూర్తి వేగంతో తనిఖీ జరుగుతుంది.
                                  </p>
                                </div>

                                <div className="text-[10px] bg-emerald-50 rounded-xl p-3 border border-emerald-200/50 flex gap-2 text-emerald-850 font-medium leading-relaxed">
                                  <Info size={14} className="flex-shrink-0 text-emerald-700 mt-0.5" />
                                  <div>
                                    <b>స్మార్ట్ ఆటోమేషన్:</b> నిజమైన అగ్రిస్టాక్ పోర్టల్ తనిఖీలలో ఎలాంటి ఆలస్యం మరియు CAPTCHA అడ్డంకులు లేకుండా సులువుగా, వేగంగా సమయం ఆదా చేస్తూ ధృవీకరణ పూర్తి చేయబడుతుంది.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      /* Execution details (uploading, queued, processing, complete, failed) */
                      <div className="bg-white/80 rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-stretch gap-3">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                              {row.status === "completed" ? (
                                <CheckCircle className="text-emerald-600" size={18} />
                              ) : row.status === "failed" ? (
                                <AlertTriangle className="text-rose-600" size={18} />
                              ) : (
                                <Loader2 className="animate-spin text-indigo-600" size={18} />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-700">
                                {row.status === "uploading" && "శాటిలైట్ ఫైళ్లు విలీనం చేయబడుతున్నాయి..."}
                                {row.status === "queued" && `వెరిఫికేషన్ క్యూలో ఉంది (${row.verificationMode === "real_live" ? "రియల్ లైవ్ మోడ్" : "లైట్ వేగం"})...`}
                                {row.status === "processing" && `అగ్రిస్టాక్ పోర్టల్‌లో లైవ్ చెక్ జరపబడుతోంది (${row.verificationMode === "real_live" ? "Stealth" : "Analytic"})...`}
                                {row.status === "completed" && "పూర్తిగా నివేదిక సిద్ధంగా ఉంది!"}
                                {row.status === "failed" && "ప్రక్రియ విఫలమైంది."}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {row.file1?.name} &amp; {row.file2?.name}
                              </p>
                            </div>
                          </div>

                          {row.status === "completed" && (
                            user ? (
                              <button
                                onClick={() => handleDownload(row)}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-emerald-500/15 transition-all hover:-translate-y-0.5"
                              >
                                <Download size={12} />
                                <span>FINAL FILE 4</span>
                              </button>
                            ) : (
                              <button
                                onClick={onLoginClick}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-indigo-500/15 transition-all hover:-translate-y-0.5"
                              >
                                <Lock size={12} />
                                <span>లాగిన్ అవ్వండి (Login to Download)</span>
                              </button>
                            )
                          )}
                        </div>

                        {/* Progress Bar */}
                        {(row.status === "processing" || row.status === "queued" || row.status === "uploading" || row.status === "paused_captcha") && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                              <span>మొత్తం ప్రగతి: ({row.processedRecords} / {row.totalRecords || "?"})</span>
                              <span>{row.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-full transition-all duration-350"
                                style={{ width: `${row.progress}%` }}
                              />
                            </div>
                          </div>
                        )}



                        {row.status === "failed" && (
                          <div className="text-[11px] text-rose-500 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                            వైద్యి లోపం: {row.error || "ఆధార్ కాలమ్ తప్పుగా ఉంది లేదా PPBNO మ్యాచ్ కాలేదు."}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Actions Panel */}
            {gpRows.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <button
                  onClick={clearAll}
                  disabled={isProcessingPipeline}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1 border border-slate-200"
                >
                  <Trash2 size={14} />
                  సర్వం రీసెట్ చేయి
                </button>

                {user ? (
                  <button
                    disabled={isProcessingPipeline || gpRows.filter(x => x.status === "pending" && x.file1 && x.file2).length === 0}
                    onClick={startPipelineVerification}
                    className={`flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-lg ${
                      !isProcessingPipeline && gpRows.filter(x => x.status === "pending" && x.file1 && x.file2).length > 0
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/15 hover:-translate-y-0.5"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isProcessingPipeline ? (
                      <>
                        <Loader2 className="animate-spin" size={15} />
                        <span>ఆటోమేటిక్ పైప్‌లైన్ రన్నింగ్ లో ఉంది...</span>
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        <span>ఆటోమేటిక్ పైప్‌లైన్ ప్రారంభించు (Start Pipeline)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/15 hover:-translate-y-0.5 animate-pulse"
                  >
                    <Lock size={14} />
                    <span>లాగిన్ అవ్వండి (Login to Start Pipeline)</span>
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Consolidated Help & Instructions Info Panel */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 text-slate-700 shadow-sm mt-8 space-y-4">
            <div className="flex items-center gap-2.5 border-b border-emerald-150 pb-3 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                  పూర్తిగా ఆటోమేటిక్ పైప్‌లైన్ పద్ధతి (Automatic Pipeline Workflow)
                </h3>
                <p className="text-[10px] text-emerald-700 font-bold">మ్యాన్యువల్ శ్రమ లేకుండా 100% ఆటో-మ్యాచింగ్ వెరిఫికేషన్</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-semibold leading-relaxed">
              ఈ వ్యవస్థ ద్వారా <b>FILE 1 మరియు FILE 2</b> ల నుండి <b>BucketID = PPBNO</b> ఆధారంగా ఆటోమేటిక్ విలీన ప్రక్రియను పూర్తి చేస్తుంది. 
              మీకు ఎటువంటి మ్యాన్యువల్ విలీనాలు లేదా తాత్కాలిక ఫైల్ అప్‌లోడ్స్ అవసరం లేదు.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white/60 rounded-2xl p-4 border border-emerald-100/50 space-y-2.5">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <p className="text-xs text-slate-600 font-medium">GP పేరుతో పాటు <b>FILE 1 (Main/Land) మరియు FILE 2 (Checklist)</b> ని జోడించండి.</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <p className="text-xs text-slate-600 font-medium">సిస్టమ్ <b>FILE1.BucketID = FILE2.PPBNO</b> ద్వారా ఫైళ్లను ఆటోమేటిక్‌గా విలీనం (Merge) చేస్తుంది.</p>
                </div>
              </div>

              <div className="bg-white/60 rounded-2xl p-4 border border-emerald-100/50 space-y-2.5">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <p className="text-xs text-slate-600 font-medium">సర్వర్ అంతర్గతంగా తాత్కాలిక <b>FILE 3</b> ని సృష్టించి, అందులోని ఆధార్ నంబర్లను ఎంచుకుంటుంది (యూజర్‌కు ఇది కనిపించదు).</p>
                </div>
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <p className="text-xs text-slate-600 font-medium">చివరగా అన్ని వివరాలతో కూడిన <b>FINAL FILE 4</b> ని నివేదికగా అందిస్తుంది, దీనిని మీరు నేరుగా డౌన్‌లోడ్ చేసుకోవచ్చు.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
