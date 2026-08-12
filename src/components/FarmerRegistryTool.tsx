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
  Lock,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth } from "../../firebase";
import { AuthModal } from "./AuthModal";
import { requireLoginAlert } from "../App";

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
  handleGoogleLogin: () => void;
  addToast: (msg: string) => void;
}

export function FarmerRegistryTool({ 
  user, 
  onLoginClick,
  handleGoogleLogin,
  addToast
}: FarmerRegistryToolProps) {
  const [showAuthLocal, setShowAuthLocal] = useState(false);
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

    if (requireLoginAlert(user)) return;

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
      `File upload: ${file.name} (added as ${field === "file1" ? "FILE 1" : "FILE 2"})`
    ]);
  };

  const startPipelineVerification = async () => {
    if (!user) {
      addToast("Please login first to upload files.");
      onLoginClick?.();
      return;
    }

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
      formData.append("uid", user.uid);

      try {
        const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
        const resp = await fetch("/api/farmer-registry/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
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
            const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
            const resp = await fetch(`/api/farmer-registry/jobs/${item.jobId}`, {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });
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
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
      const resp = await fetch(`/api/farmer-registry/jobs/${jobId}/solve-captcha`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
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

  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  const handleDownload = async (item: GPWorkRow) => {
    if (!item.jobId || item.status !== "completed") return;
    
    // Format: [PANCHAYAT_NAME] FARMER REGISTRY BALANCE FARMERS.xlsx
    const cleanGpName = item.gpName.trim().toUpperCase();
    const fileName = `${cleanGpName} FARMER REGISTRY BALANCE FARMERS`.replace(/\s+/g, ' ') + ".xlsx";
    
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : "";
    const link = document.createElement("a");
    link.href = `/api/farmer-registry/download/${item.jobId}?token=${token}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show feedback after a small delay
    setTimeout(() => {
      setShowFeedback(item.id);
    }, 1500);
  };

  const shareReport = async (item: GPWorkRow) => {
    if (!item.jobId || item.status !== "completed") return;

    const shareUrl = window.location.origin + "/Farmer_Registry";
    const shareText = `*E-Vedhika | Farmer Registry Verification Result*\n\nGP: ${item.gpName}\nStatus: Verified ✅\n\nDownload Final File 4: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Farmer Registry Report",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert("రిపోర్ట్ లింక్ కాపీ చేయబడింది! (Link copied to clipboard)");
      } catch (err) {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
      }
    }
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
        verificationMode: 'real_live',
        rateLimitMs: 1500,
        browserLogs: []
      }
    ]);
    setIsProcessingPipeline(false);
    setLogs([
      "వర్క్‌స్పేస్ పునఃప్రారంభించబడింది.",
      "ప్రభుత్వ రైతు రిజిస్ట్రీ నుండి నేరుగా డేటా క్రాస్-వెరిఫికేషన్ సిద్ధంగా ఉంది."
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
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <p className="text-sm text-slate-300 font-bold tracking-normal">
                  రైతు రిజిస్ట్రీ ఎన్‌రోల్‌మెంట్ ఆటోమేటిక్ ల్యాండ్ విలీనం మరియు లైవ్ వెరిఫికేషన్ నివేదిక సాధనం
                </p>
                <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">100% Website Status Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* New Status Update Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600/10 border border-indigo-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm"
        >
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">ముఖ్య గమనిక (Status Tracking Guide)</h4>
            <p className="text-xs text-indigo-800 font-bold mt-1 leading-relaxed">
              మీరు అప్లోడ్ చేసిన ఫైల్స్ యొక్క స్టేటస్ ను ఇప్పుడు 100% ఈ వెబ్సైట్ ద్వారానే నేరుగా చూసుకోవచ్చు. 
              ప్రతి రికార్డు వెరిఫికేషన్ ప్రోగ్రెస్ ను రియల్-టైమ్ లో ట్రాక్ చేయబడుతుంది.
            </p>
          </div>
        </motion.div>

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
                          {row.status === "pending" ? "వారధి సిద్ధంగా ఉంది" : row.status.replace('_', ' ')}
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
                              <p className="text-xs font-black text-slate-700">ముందుగా లాగిన్ చేయండి</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1">ముందుకు సాగడానికి మరియు ఫైల్స్ అప్లోడ్ చేయడానికి దయచేసి లాగిన్ అవ్వండి.</p>
                            </div>
                            <button
                              type="button"
                              onClick={onLoginClick}
                              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-indigo-500/15 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                              లాగిన్ చేసి ముందుకు సాగండి (Login to Continue)
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
                                  <span className="text-xs font-black text-slate-700 block text-emerald-700">అధికారిక డేటా క్రాస్-వెరిఫికేషన్ (Official Portal Cross-Verification)</span>
                                  <span className="text-[10px] text-slate-400 font-bold block">ప్రభుత్వ రైతు రిజిస్ట్రీ పోర్టల్ నుండి నేరుగా డేటా ప్రాసెస్ చేయబడుతుంది.</span>
                                </div>
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                  <span className="px-3.5 py-1.5 text-[11px] font-extrabold rounded-md bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
                                    <ShieldCheck size={12} />
                                    లైవ్ వెరిఫైడ్ (LIVE)
                                  </span>
                                </div>
                              </div>

                              <div className="pt-2 border-t border-slate-100 space-y-3">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-500 font-bold">ధృవీకరణ వేగం (Verification Speed):</span>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded border border-emerald-150 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                      గరిష్ట వేగం (Full Speed - 100% Website Tracking)
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                                    వెబ్సైట్ ద్వారానే 100% పారదర్శకంగా తనిఖీ ప్రక్రియను పర్యవేక్షించవచ్చు.
                                  </p>
                                </div>

                                <div className="text-[10px] bg-emerald-50 rounded-xl p-3 border border-emerald-200/50 flex gap-2 text-emerald-850 font-medium leading-relaxed">
                                  <Info size={14} className="flex-shrink-0 text-emerald-700 mt-0.5" />
                                  <div>
                                    <b>స్మార్ట్ ఆటోమేషన్:</b> మీరు అప్లోడ్ చేసిన ఫైల్స్ ను సిస్టిమ్ ఆటోమేటిక్ గా అగ్రిస్టాక్ వెబ్సైట్ తో పోల్చి చూస్తుంది. దీనివల్ల మీరు మ్యాన్యువల్ గా చెక్ చేయవలసిన అవసరం లేదు.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                              row.status === "completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              row.status === "failed" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                              "bg-indigo-50 text-indigo-600 border border-indigo-100"
                            }`}>
                              {row.status === "completed" ? (
                                <CheckCircle className="text-emerald-600" size={22} />
                              ) : row.status === "failed" ? (
                                <AlertTriangle className="text-rose-600" size={22} />
                              ) : (
                                <Loader2 className="animate-spin text-indigo-600" size={22} />
                              )}
                            </div>
                            <div>
                               <div className="flex items-center gap-2">
                                  <p className="text-sm font-black text-slate-800">
                                    {row.status === "uploading" && "శాటిలైట్ ఫైళ్లు విలీనం చేయబడుతున్నాయి..."}
                                    {row.status === "queued" && `వెరిఫికేషన్ క్యూలో ఉంది...`}
                                    {row.status === "processing" && `అగ్రిస్టాక్ పోర్టల్‌లో లైవ్ చెక్...`}
                                    {row.status === "completed" && "పూర్తిగా నివేదిక సిద్ధంగా ఉంది!"}
                                    {row.status === "failed" && "ప్రక్రియ విఫలమైంది."}
                                  </p>
                                  {row.status === "processing" && (
                                    <span className="text-[10px] font-black text-indigo-600 animate-pulse bg-indigo-50 px-1.5 py-0.5 rounded">WEBSITE TRACKING LIVE</span>
                                  )}
                               </div>
                              <p className="text-[11px] text-slate-400 font-bold truncate max-w-[200px] md:max-w-xs">
                                {row.file1?.name} &amp; {row.file2?.name}
                              </p>
                            </div>
                          </div>

                          {row.status === "completed" && (
                            <div className="space-y-4">
                              <div className="sm:shrink-0 flex items-center gap-2">
                                <button
                                  onClick={() => handleDownload(row)}
                                  className="flex-1 sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[14px] text-[13px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-1 active:scale-95 group-hover:scale-105"
                                >
                                  <Download size={14} className="animate-bounce" />
                                  <span>FINAL FILE DOWNLOAD</span>
                                </button>
                                <button
                                  onClick={() => shareReport(row)}
                                  className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-[14px] transition-all hover:-translate-y-1 active:scale-95 border border-indigo-100"
                                  title="రిపోర్ట్ షేర్ చేయండి (Share Status)"
                                >
                                  <Share2 size={16} />
                                </button>
                              </div>

                              {showFeedback === row.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center gap-3 text-center"
                                >
                                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                                    <RefreshCw size={20} />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-indigo-900">మీకు మా సేవ నచ్చిందా? (Did you like our service?)</p>
                                    <div className="flex gap-4 mt-3">
                                      <button 
                                        onClick={async () => {
                                          try {
                                            const token = await auth.currentUser?.getIdToken();
                                            await fetch(`/api/farmer-jobs/${row.id}/feedback`, {
                                              method: "POST",
                                              headers: { 
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}` 
                                              },
                                              body: JSON.stringify({ feedback: "yes" })
                                            });
                                          } catch (e) {}
                                          addToast("ధన్యవాదాలు! (Thank you for your feedback!)");
                                          setShowFeedback(null);
                                        }}
                                        className="px-4 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                      >
                                        అవును (Yes) 👍
                                      </button>
                                      <button 
                                        onClick={async () => {
                                          try {
                                            const token = await auth.currentUser?.getIdToken();
                                            await fetch(`/api/farmer-jobs/${row.id}/feedback`, {
                                              method: "POST",
                                              headers: { 
                                                "Content-Type": "application/json",
                                                "Authorization": `Bearer ${token}` 
                                              },
                                              body: JSON.stringify({ feedback: "no" })
                                            });
                                          } catch (e) {}
                                          addToast("మేము మా సేవను మెరుగుపరుస్తాము. (We will improve our service.)");
                                          setShowFeedback(null);
                                        }}
                                        className="px-4 py-1.5 bg-white border border-indigo-200 text-slate-500 rounded-xl text-[10px] font-black hover:bg-slate-100 transition-all shadow-sm"
                                      >
                                        లేదు (No) 👎
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          )}

                          {row.status === "paused_captcha" && row.captchaRequired && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3 shadow-md border-b-4 border-b-amber-500">
                               <div className="flex items-center gap-2">
                                  <Lock size={16} className="text-amber-600" />
                                  <span className="text-xs font-black text-amber-900 uppercase">సెక్యూరిటీ వెరిఫికేషన్ (Solve CAPTCHA)</span>
                               </div>
                               <div className="flex flex-col sm:flex-row items-center gap-3">
                                  <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-inner">
                                     <img src={row.captchaChallenge} alt="Captcha" className="h-10 w-auto" />
                                  </div>
                                  <div className="flex-1 w-full sm:w-auto">
                                     <input 
                                        type="text"
                                        placeholder="కోడ్ ఎంటర్ చేయండి"
                                        value={row.captchaSolutionText || ""}
                                        onChange={(e) => {
                                           const val = e.target.value;
                                           setGpRows(prev => prev.map(x => x.id === row.id ? { ...x, captchaSolutionText: val } : x));
                                        }}
                                        className="w-full px-4 py-2 rounded-xl border-2 border-amber-200 focus:border-amber-500 outline-none font-black text-center tracking-widest text-lg"
                                     />
                                  </div>
                                  <button
                                     onClick={() => solveCaptchaValue(row.id, row.jobId!, row.captchaSolutionText || "")}
                                     className="w-full sm:w-auto px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                  >
                                     SUBMIT
                                  </button>
                               </div>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {(row.status === "processing" || row.status === "queued" || row.status === "uploading" || row.status === "paused_captcha") && (
                          <div className="space-y-2 mt-1 px-1">
                            <div className="flex justify-between items-end">
                              <div>
                                 <span className="text-[11px] font-black text-slate-600 block">రియల్-టైమ్ ప్రోగ్రెస్</span>
                                 <span className="text-[10px] font-bold text-slate-400">ప్రస్తుత రికార్డు: {row.processedRecords} / {row.totalRecords || "?"}</span>
                              </div>
                              <div className="text-right">
                                <motion.span 
                                  key={row.progress}
                                  initial={{ scale: 1.2, color: "#4f46e5" }}
                                  animate={{ scale: 1, color: "#64748b" }}
                                  className="text-xl font-black italic tracking-tighter"
                                >
                                  {row.progress}%
                                </motion.span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${row.progress}%` }}
                                className="h-full rounded-full relative overflow-hidden shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                style={{ 
                                  background: "linear-gradient(90deg, #4f46e5, #0ea5e9, #10b981)",
                                  backgroundSize: "200% 100%"
                                }}
                              >
                                <motion.div 
                                  animate={{ x: ["0%", "100%"] }}
                                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2"
                                />
                              </motion.div>
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

              {showAuthLocal && (
                <AuthModal
                  onClose={() => setShowAuthLocal(false)}
                  addToast={addToast}
                  handleGoogleLogin={handleGoogleLogin}
                />
              )}
            </div>

            {/* Actions Panel */}
            {gpRows.length > 0 && (
              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-3">
                <button
                  onClick={clearAll}
                  disabled={isProcessingPipeline}
                  className="px-5 py-4 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-50 text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm active:scale-95"
                >
                  <RefreshCw size={14} className={isProcessingPipeline ? "animate-spin" : ""} />
                  సర్వం రీసెట్ చేయి
                </button>

                {user ? (
                  <button
                    disabled={isProcessingPipeline || gpRows.filter(x => x.status === "pending" && x.file1 && x.file2).length === 0}
                    onClick={startPipelineVerification}
                    className={`flex-1 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-3 transition-all shadow-xl ${
                      !isProcessingPipeline && gpRows.filter(x => x.status === "pending" && x.file1 && x.file2).length > 0
                        ? "bg-slate-900 border-b-4 border-slate-950 hover:bg-slate-800 text-white shadow-slate-900/10 hover:-translate-y-1 active:translate-y-0.5 active:border-b-0"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isProcessingPipeline ? (
                      <>
                        <Loader2 className="animate-spin text-indigo-400" size={18} />
                        <span>పైప్‌లైన్ ప్రాసెసింగ్ లో ఉంది...</span>
                      </>
                    ) : (
                      <>
                        <span className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
                          <Play size={12} className="ml-0.5" />
                        </span>
                        <span>ఆటోమేటిక్ పైప్‌లైన్ ప్రారంభించు (START PIPELINE)</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={onLoginClick}
                    className="flex-1 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-3 transition-all shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/15 hover:-translate-y-1 animate-pulse"
                  >
                    <Lock size={16} />
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
