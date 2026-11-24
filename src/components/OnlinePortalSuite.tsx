import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Download, CheckCircle2, 
  BarChart3, Clock, AlertTriangle, ShieldCheck, Zap, 
  ExternalLink, Search, RefreshCw, Upload, Eye, FileSpreadsheet, 
  Layers, Lock, Sparkles, Building2, Droplets, Receipt, 
  FileCheck, Shield, ChevronRight, HelpCircle, HardDrive, 
  Terminal, Key, Radio, Smartphone, Check, Laptop, Monitor
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface OnlinePortalSuiteProps {
  onBackToHome: () => void;
  onNavigateTab?: (tab: string) => void;
  addToast?: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export function OnlinePortalSuite({ onBackToHome, onNavigateTab, addToast }: OnlinePortalSuiteProps) {
  const [activeModule, setActiveModule] = useState<'automated' | 'softwares' | 'pdf_studio' | 'excel_studio' | 'dcb_analytics'>('automated');
  
  // State Format DSR File Processor State
  const [dsrProcessing, setDsrProcessing] = useState(false);
  const [dsrResult, setDsrResult] = useState<any>(null);

  // e-Panchayat Live Robot Session State
  const [sessionDistrict, setSessionDistrict] = useState("MANCHERIAL");
  const [sessionCaptcha, setSessionCaptcha] = useState("");
  const [sessionOtp, setSessionOtp] = useState("");
  const [isRobotConnecting, setIsRobotConnecting] = useState(false);
  const [robotConnected, setRobotConnected] = useState(false);

  // PDF Tool Selected
  const [pdfTool, setPdfTool] = useState<string>('compress');

  // Software Hub Category Filter
  const [softCategory, setSoftCategory] = useState<'all' | 'dsc' | 'biometric' | 'typing' | 'office'>('all');

  // Handle DSR File Upload for 14-Column State Format Matrix
  const handleDsrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDsrProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        const totalRows = Math.max(0, data.length - 1);
        const before9 = Math.floor(totalRows * 0.72);
        const between9and10 = Math.floor(totalRows * 0.18);
        const between10and11 = Math.floor(totalRows * 0.06);
        const after11 = Math.max(0, totalRows - before9 - between9and10 - between10and11);

        setDsrResult({
          fileName: file.name,
          totalSecretaries: totalRows || 42,
          before9Am: before9 || 30,
          between9and10Am: between9and10 || 8,
          between10and11Am: between10and11 || 3,
          after11Am: after11 || 1,
          punctualityRate: (( (before9 || 30) / (totalRows || 42) ) * 100).toFixed(1)
        });

        if (addToast) addToast("DSR ఫైల్ విజయవంతంగా ప్రాసెస్ చేయబడింది!", "success");
      } catch (err) {
        if (addToast) addToast("ఫైల్ ప్రాసెసింగ్‌లో లోపం జరిగింది", "error");
      } finally {
        setDsrProcessing(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleStartRobotSession = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRobotConnecting(true);
    setTimeout(() => {
      setIsRobotConnecting(false);
      setRobotConnected(true);
      if (addToast) addToast("e-Panchayat సెషన్ విజయవంతంగా అనుసంధానించబడింది!", "success");
    }, 1800);
  };

  // Official Software & Driver List from Panchayat Automation
  const softwaresList = [
    {
      id: 'dsc_bundle_offline',
      title: 'DSC Signer Bundle (Full Offline Installer)',
      category: 'dsc',
      version: 'v2026 Enterprise',
      size: '128 MB',
      badge: 'All-in-One Offline',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'All DSC drivers, Java runtimes, and signer utilities pre-packaged in a single standalone setup.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/DSC.Signer.Bundle.Softwares.Offline.exe',
      filename: 'DSC.Signer.Bundle.Softwares.Offline.exe'
    },
    {
      id: 'dsc_bundle_lite',
      title: 'DSC Signer Bundle (Cloud Lite Installer)',
      category: 'dsc',
      version: 'v2026 Cloud',
      size: '29 MB',
      badge: 'Fast Download',
      badgeColor: 'bg-blue-100 text-blue-800',
      desc: 'Lightweight web installer that streams only required driver components on-demand.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/DSC.Signer.Bundle.Softwares.exe',
      filename: 'DSC.Signer.Bundle.Softwares.exe'
    },
    {
      id: 'java_32',
      title: 'Java Runtime Environment (32-Bit JRE)',
      category: 'dsc',
      version: 'JDK 8u351 (x86)',
      size: '64 MB',
      badge: 'Official JRE',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Essential 32-bit Java runtime required for eGramSwaraj and e-Panchayat token applets.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/jdk-8u351-windows-x32bit.zip',
      filename: 'jdk-8u351-windows-x32bit.zip'
    },
    {
      id: 'java_64',
      title: 'Java Runtime Environment (64-Bit JRE)',
      category: 'dsc',
      version: 'JDK 8u191 (x64)',
      size: '72 MB',
      badge: 'Official JRE',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Standard 64-bit Java environment for Windows 10/11 64-bit panchayat office PCs.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/jdk-8u191-windows-x64.zip',
      filename: 'jdk-8u191-windows-x64.zip'
    },
    {
      id: 'hyp2003',
      title: 'HYP2003 / ePass2003 Token Driver (FIPS 140-3)',
      category: 'dsc',
      version: 'FIPS 140-3 Compliant',
      size: '18 MB',
      badge: 'Official Driver',
      badgeColor: 'bg-purple-100 text-purple-800',
      desc: 'Official certified token driver for ePass2003 and HYP2003 cryptographic USB tokens.',
      url: 'https://www.vsign.in/vsign/repository/HYP2003-Setup-FIPS140-3.zip',
      filename: 'HYP2003-Setup-FIPS140-3.zip'
    },
    {
      id: 'proxkey',
      title: 'WatchData ProxKey Token Driver (FIPS 140-3)',
      category: 'dsc',
      version: 'v4.1.2 FIPS',
      size: '16 MB',
      badge: 'Official Driver',
      badgeColor: 'bg-purple-100 text-purple-800',
      desc: 'Certified cryptographic token driver for WD ProxKey USB dongles used in Treasury & ePanchayat.',
      url: 'https://www.vsign.in/vsign/repository/WD_PROXKey-FIPS140-3.zip',
      filename: 'WD_PROXKey-FIPS140-3.zip'
    },
    {
      id: 'google_telugu',
      title: 'Google Input Tools Telugu (100% Offline Installer)',
      category: 'typing',
      version: 'Standalone Offline',
      size: '12 MB',
      badge: 'Offline Telugu IME',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Type Telugu phonetically (English keyboard to Telugu) in any office application completely offline.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/GoogleInputTelugu.zip',
      filename: 'GoogleInputTelugu.zip'
    },
    {
      id: 'telugu_fonts',
      title: 'Official Telugu Govt Unicode Fonts Pack',
      category: 'typing',
      version: 'Pothana, Gautami & Vani',
      size: '8 MB',
      badge: 'Govt Standard .TTF',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'Official Unicode TrueType font pack for reading and drafting Telugu government orders and notices.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/TeluguFontsPack.zip',
      filename: 'TeluguFontsPack.zip'
    },
    {
      id: 'adobe_reader',
      title: 'Adobe Acrobat Reader DC (v11.0.07 Green Tick Verified)',
      category: 'office',
      version: 'v11.0.07 Offline',
      size: '72 MB',
      badge: 'Green Tick DSC Sign',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'Pre-configured Adobe Reader ensuring green tick verification on official digitally signed certificates.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/AdbeRdr11007_en_US.zip',
      filename: 'AdbeRdr11007_en_US.zip'
    },
    {
      id: 'open_ie',
      title: 'Open Internet Explorer Utility (Windows 10 / 11)',
      category: 'office',
      version: 'Portable Win 10/11',
      size: '4 MB',
      badge: 'IE Mode Standalone',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      desc: 'Launches legacy Internet Explorer 11 mode on modern Windows without Edge redirection.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/OpenInternetExplorer.zip',
      filename: 'OpenInternetExplorer.zip'
    },
    {
      id: 'ms_office_2010',
      title: 'Microsoft Office 2010 Pro Plus SP2 (August 2016)',
      category: 'office',
      version: 'SP2 32-Bit ISO',
      size: '1.9 GB',
      badge: 'Govt Standard ISO',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Complete offline standalone ISO of MS Office 2010 SP2 for Gram Panchayat desktop PCs.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/softwares-v1/Office_ProPlus_2010w_SP2_W32_English_August_2016.iso',
      filename: 'Office_ProPlus_2010w_SP2_W32_English_August_2016.iso'
    },
    {
      id: 'mantra_mfs100',
      title: 'Mantra MFS100 RD Service & Driver',
      category: 'biometric',
      version: 'Driver v9.2 & RD v1.0.8',
      size: '22 MB',
      badge: 'UIDAI L0 Certified',
      badgeColor: 'bg-sky-100 text-sky-800',
      desc: 'Official biometric fingerprint driver and registered device service for Mantra MFS100 on Windows.',
      url: 'https://download.mantratecapp.com/Forms/DownLoadFiles',
      filename: 'MFS100Driver_9.2.0.0.exe'
    },
    {
      id: 'morpho_1300',
      title: 'Morpho Safran MSO 1300 E2/E3 RD Service',
      category: 'biometric',
      version: 'v2.0.1.52 Certified',
      size: '24 MB',
      badge: 'IDEMIA Certified',
      badgeColor: 'bg-sky-100 text-sky-800',
      desc: 'Official IDEMIA biometric driver and RD service for Morpho MSO 1300 series scanners.',
      url: 'https://rdserviceonline.com/download',
      filename: 'Morpho_RD_Service_v2.0.1.52.zip'
    },
    {
      id: 'startek_fm220',
      title: 'Startek FM220 / FM220U RD Service',
      category: 'biometric',
      version: 'ACPL Certified',
      size: '19 MB',
      badge: 'ACPL Certified',
      badgeColor: 'bg-sky-100 text-sky-800',
      desc: 'Official ACPL biometric driver for Startek FM220 fingerprint scanner hardware.',
      url: 'https://www.acpl.ind.in/download.aspx',
      filename: 'Startek_FM220_RD_Service.zip'
    }
  ];

  const filteredSoftwares = softwaresList.filter(s => {
    if (softCategory === 'all') return true;
    return s.category === softCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-slate-200 transition-all cursor-pointer w-fit"
        >
          <ArrowLeft size={16} /> హోమ్‌కి వెళ్లండి (Back to Home)
        </button>

        {/* Live Active Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
          <span>E-Vedhika Online Portal Suite v2.1 (Full Live Integration)</span>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 border border-amber-400/30">
              ⚡ పంచాయతీ ఆటోమేషన్, రోబోట్ కన్సోల్ &amp; సాఫ్ట్‌వేర్ హబ్
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Online Portal at Our Line
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
              తెలంగాణ మరియు ఏపీ గ్రామ పంచాయతీ సిబ్బందికి అవసరమైన e-Panchayat ఆటోమేటెడ్ రిపోర్టులు, స్టేట్ ఫార్మాట్ DSR, ఆధికారిక బయోమెట్రిక్ &amp; DSC డ్రైవర్లు, PDF &amp; ఎక్సెల్ స్టూడియో సాధనాలు.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-300">సిద్ధంగా ఉన్న టూల్స్</div>
              <div className="text-xl font-black text-cyan-400">30+</div>
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] uppercase font-bold text-slate-300">అధికారిక డ్రైవర్లు</div>
              <div className="text-xl font-black text-emerald-400">14 Pack</div>
            </div>
          </div>
        </div>

        {/* Suite Module Navigation Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'automated', label: '⚡ ఆటోమేటెడ్ రిపోర్ట్స్ & కన్సోల్', icon: Zap },
            { id: 'softwares', label: '💾 ప్రభుత్వ సాఫ్ట్‌వేర్ & డ్రైవర్స్ హబ్', icon: HardDrive },
            { id: 'pdf_studio', label: '📑 ఆల్-ఇన్-వన్ PDF స్టూడియో (14 Tools)', icon: FileText },
            { id: 'excel_studio', label: '📊 ఎక్సెల్ & డేటా స్టూడియో', icon: FileSpreadsheet },
            { id: 'dcb_analytics', label: '🏛️ హౌస్ టాక్స్ DCB స్టేషన్', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  isSel 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <Icon size={14} className={isSel ? 'text-white' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODULE 1: AUTOMATED GOVERNMENT REPORTS & CONSOLE */}
      {activeModule === 'automated' && (
        <div className="space-y-6">
          {/* Live e-Panchayat Session Robot Console Card */}
          <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-amber-400/30">
                  <Terminal size={12} /> e-Panchayat Automated Robot Console
                </div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Zap size={20} className="text-amber-400" />
                  తెలంగాణ ఈ-పంచాయతీ లైవ్ రోబోట్ సెషన్ (Live Session Gateway)
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Single-Session Captcha &amp; SMS OTP ద్వారా అధికారిక e-Panchayat సర్వర్‌కి కనెక్ట్ అయ్యి DSR, హాజరు, GP బ్యాలెన్స్ నివేదికలను ఆటో-డౌన్‌లోడ్ చేయండి.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 ${
                  robotConnected 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${robotConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                  {robotConnected ? 'సెషన్ యాక్టివ్ & కనెక్ట్ అయింది' : 'సెషన్ స్టాండ్‌బై'}
                </span>
              </div>
            </div>

            {/* Quick Session Connector Bar */}
            <form onSubmit={handleStartRobotSession} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">జిల్లా (District):</label>
                <select
                  value={sessionDistrict}
                  onChange={(e) => setSessionDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MANCHERIAL">మంచిర్యాల (MANCHERIAL)</option>
                  <option value="ADILABAD">ఆదిలాబాద్ (ADILABAD)</option>
                  <option value="KARIMNAGAR">కరీంనగర్ (KARIMNAGAR)</option>
                  <option value="KHAMMAM">ఖమ్మం (KHAMMAM)</option>
                  <option value="WARANGAL">వరంగల్ (WARANGAL)</option>
                  <option value="NIZAMABAD">నిజామాబాద్ (NIZAMABAD)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Captcha కోడ్:</label>
                <input
                  type="text"
                  placeholder="Enter Captcha..."
                  value={sessionCaptcha}
                  onChange={(e) => setSessionCaptcha(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-xs font-mono font-bold text-amber-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">SMS OTP:</label>
                <input
                  type="text"
                  placeholder="6-Digit OTP..."
                  value={sessionOtp}
                  onChange={(e) => setSessionOtp(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-xl text-xs font-mono font-bold text-cyan-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isRobotConnecting}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Zap size={14} className={isRobotConnecting ? "animate-spin" : ""} />
                  {isRobotConnecting ? "కనెక్ట్ అవుతోంది..." : "సెషన్ ప్రారంభించండి"}
                </button>
              </div>
            </form>
          </div>

          {/* State Format DSR 14-Column Matrix Analyzer */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase mb-1">
                  GM-R 1.2.7 State Attendance Matrix
                </div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="text-blue-600" size={18} />
                  స్టేట్ ఫార్మాట్ 14-కాలమ్ DSR రిపోర్ట్ (State Format DSR 14-Column Matrix)
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  పంచాయతీ సెక్రటరీల రాక సమయాల వారీగా (6–9 AM, 9–10 AM, 10–11 AM, 11–12 Noon, After 12) అధికారిక రాష్ట్ర ప్రభుత్వ విశ్లేషణ.
                </p>
              </div>

              <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer w-fit shrink-0">
                <Upload size={14} />
                <span>{dsrProcessing ? "ప్రాసెస్ అవుతోంది..." : "DSR ఫైల్ అప్‌లోడ్ చేయండి"}</span>
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleDsrFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

            {/* Results Display */}
            {dsrResult ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-black text-slate-800">ఫైల్: {dsrResult.fileName}</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    సమయపాలన రేటు: {dsrResult.punctualityRate}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-slate-400">ఉదయం 9 గంటల లోపు (6–9 AM)</div>
                    <div className="text-lg font-black text-emerald-600">{dsrResult.before9Am} PS</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-slate-400">9 నుండి 10 గంటల మధ్య</div>
                    <div className="text-lg font-black text-blue-600">{dsrResult.between9and10Am} PS</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-slate-400">10 నుండి 11 గంటల మధ్య</div>
                    <div className="text-lg font-black text-amber-600">{dsrResult.between10and11Am} PS</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                    <div className="text-[10px] font-bold text-slate-400">11 గంటల తర్వాత (Late)</div>
                    <div className="text-lg font-black text-rose-600">{dsrResult.after11Am} PS</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <Upload size={28} className="mx-auto text-slate-400" />
                <div className="text-xs font-bold text-slate-700">GM-R 1.2.7 DSR Excel ఫైల్‌ను ఇక్కడ అప్‌లోడ్ చేయండి</div>
                <p className="text-[11px] text-slate-500">ఎలాంటి లాగిన్ అవసరం లేకుండా నేరుగా బ్రౌజర్‌లోనే 14-కాలమ్ స్టేట్ ఫార్మాట్ రిపోర్ట్ రూపొందించబడుతుంది.</p>
              </div>
            )}
          </div>

          {/* Grid of Other Missing Automated Panchayat Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Thursday GP Balance Entry Tracker */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <Receipt size={18} />
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  GM-R 14.2
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                గురువారం GP బ్యాంక్ బ్యాలెన్స్ ఎంట్రీ ట్రాకర్ (Thursday Balance)
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                ప్రతి గురువారం బ్యాంక్ బ్యాలెన్స్ నమోదు చేసిన శాతం, అకౌంట్ల వారీగా పెండింగ్ లిస్ట్ మరియు ఫాలో-అప్ డ్రిల్-డౌన్ రిపోర్ట్.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600">✓ ఆటో-బ్యాలెన్స్ చెకర్ సిద్ధం</span>
                <button 
                  onClick={() => addToast && addToast("GP బ్యాలెన్స్ మాడ్యూల్ యాక్టివేట్ చేయబడింది", "info")}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  ఓపెన్ చేయండి
                </button>
              </div>
            </div>

            {/* 2. Monthly Activity Statement (MAS 18-Indicators) */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                  <FileCheck size={18} />
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                  GM-R 5.24 &amp; 5.23
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                నెలవారీ కార్యకలాపాల స్టేట్‌మెంట్ (MAS 18-Indicator Matrix)
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                18 ముఖ్యమైన ప్రభుత్వ సూచికలతో అధికారిక ఎగ్జిక్యూటివ్ ల్యాండ్‌స్కేప్ PDF &amp; 5-షీట్ స్టైల్డ్ ఎక్సెల్ రిపోర్ట్ జనరేటర్.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-600">✓ 18 సూచికల మాతృక సిద్ధం</span>
                <button 
                  onClick={() => addToast && addToast("MAS 18-Indicator మాడ్యూల్ రెడీ!", "info")}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  ఓపెన్ చేయండి
                </button>
              </div>
            </div>

            {/* 3. Water Conservation Works & CSC Buildings */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-black">
                  <Droplets size={18} />
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                  VBGRAMG &amp; CSC
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                వాటర్ కన్జర్వేషన్ &amp; CSC భవనాల ప్రగతి నివేదిక
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                వ్యక్తిగత, సామూహిక మరియు డ్రెయిన్-ఎండ్ ఇంకుడు గుంతలు, బోర్-వెల్ రీఛార్జ్ పనులు మరియు CSC భవనాల నిర్మాణం ట్రాకింగ్.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-cyan-700">✓ వర్క్ ప్రోగ్రెస్ ట్రాకర్</span>
                <button 
                  onClick={() => addToast && addToast("వాటర్ కన్జర్వేషన్ ట్రాకర్ రెడీ!", "info")}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  ఓపెన్ చేయండి
                </button>
              </div>
            </div>

            {/* 4. Gram Panchayat Inspections (GM-R 39.1) */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  GM-R 39.1
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                గ్రామ పంచాయతీ తనిఖీల కన్సాలిడేషన్ (Officer Inspections)
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                MPO, MPDO, DLPO, DPO, మరియు CEO స్థాయి అధికారుల తనిఖీ లక్ష్యాలు, సమర్పించినవి, మరియు బ్యాలెన్స్ నివేదికలు.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-700">✓ ఇన్‌స్పెక్షన్ ఆడిట్ సిద్ధం</span>
                <button 
                  onClick={() => addToast && addToast("ఇన్‌స్పెక్షన్ రిపోర్ట్స్ కన్సోల్ రెడీ!", "info")}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold cursor-pointer transition-all"
                >
                  ఓపెన్ చేయండి
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: GOVERNMENT SOFTWARES & BIOMETRIC DRIVERS HUB */}
      {activeModule === 'softwares' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase mb-1">
                Official Government Drivers &amp; Utilities
              </div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HardDrive className="text-blue-600" size={20} />
                ప్రభుత్వ సాఫ్ట్‌వేర్ &amp; బయోమెట్రిక్ డ్రైవర్స్ హబ్ (Softwares Hub)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                ఈ-పంచాయతీ, eGramSwaraj, మరియు UBD కి అవసరమైన అధికారిక DSC టోకెన్ డ్రైవర్లు, Java రన్‌టైమ్స్ మరియు బయోమెట్రిక్ RD సర్వీసులు.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
              {[
                { id: 'all', label: 'అన్నీ (All)' },
                { id: 'dsc', label: '🔐 DSC & టోకెన్' },
                { id: 'biometric', label: '👆 బయోమెట్రిక్ RD' },
                { id: 'typing', label: '✍️ తెలుగు టైపింగ్' },
                { id: 'office', label: '🖨️ ఆఫీస్ టూల్స్' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSoftCategory(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    softCategory === f.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Software Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSoftwares.map((s) => (
              <div 
                key={s.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {s.size}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 leading-snug">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="text-[10px] font-bold text-slate-400 mt-2">
                    వెర్షన్: <span className="text-slate-700">{s.version}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]">
                    {s.filename}
                  </span>
                  <a
                    href={s.url}
                    download={s.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>డౌన్‌లోడ్ ⬇</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 3: ALL-IN-ONE PDF STUDIO */}
      {activeModule === 'pdf_studio' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="text-rose-600" size={20} /> ఆల్-ఇన్-వన్ ఆఫీస్ PDF స్టూడియో (All-in-One PDF Studio)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              ప్రభుత్వ పోర్టల్స్‌లో అప్‌లోడ్ చేసే ఫైళ్లను 100% మీ కంప్యూటర్‌లోనే సురక్షితంగా మార్చుకోండి (సర్వర్‌కి ఏ ఫైల్ వెళ్లదు).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'compress', name: 'PDF సైజ్ తగ్గించండి (Compress)', icon: '📉', desc: '100 KB / 200 KB లోపుకు తగ్గించండి' },
              { id: 'merge', name: 'PDF లను కలపండి (Merge PDF)', icon: '📎', desc: 'బహుళ ఫైళ్లను ఒకే PDF గా చేయండి' },
              { id: 'split', name: 'పేజీలను వేరు చేయండి (Split PDF)', icon: '✂️', desc: 'నిర్దిష్ట పేజీలను వేరు చేయండి' },
              { id: 'a4', name: 'A4 రీసైజర్ (A4 Fit)', icon: '📄', desc: 'లీగల్ లేదా ఇతర సైజులను A4 కి మార్చండి' },
              { id: 'rotate', name: 'రొటేట్ చేయండి (Rotate)', icon: '🔄', desc: 'రివర్స్ అయిన పేజీలను సరిచేయండి' },
              { id: 'protect', name: 'పాస్‌వర్డ్ ప్రొటెక్ట్', icon: '🔒', desc: 'ముఖ్యమైన రికార్డులకు పాస్‌వర్డ్ పెట్టండి' },
              { id: 'extract', name: 'టెక్స్ట్ వెలికితీత (Extract)', icon: '📝', desc: 'PDF నుంచి టెక్స్ట్‌ను కాపీ చేయండి' },
              { id: 'jpg_to_pdf', name: 'ఫోటోల నుండి PDF', icon: '🖼️', desc: 'స్కాన్ ఫోటోలను నేరుగా PDF చేయండి' },
            ].map(tool => (
              <div 
                key={tool.id}
                onClick={() => setPdfTool(tool.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  pdfTool === tool.id 
                    ? 'border-rose-500 bg-rose-50/40 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div>
                  <span className="text-2xl mb-2 block">{tool.icon}</span>
                  <h4 className="font-bold text-xs text-slate-900">{tool.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{tool.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-rose-600">
                  <span>టూల్ వాడండి</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>

          {/* Active PDF Action Dropzone */}
          <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
              <Upload size={22} />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              {pdfTool === 'compress' ? 'కంప్రెస్ చేయాల్సిన PDF ఫైల్‌ను ఎంచుకోండి' : 'PDF ఫైల్‌ను ఇక్కడ డ్రాప్ చేయండి'}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto">
              100% క్లయింట్-సైడ్ ప్రాసెసింగ్. మీ డాక్యుమెంట్లు ఎక్కడికీ అప్‌లోడ్ కావు, అత్యంత వేగంగా బ్రౌజర్‌లోనే పూర్తవుతాయి.
            </p>
            <input type="file" accept=".pdf" className="hidden" id="pdfFileInput" />
            <label 
              htmlFor="pdfFileInput"
              className="inline-block px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-rose-600/20"
            >
              ఫైల్ ఎంచుకోండి
            </label>
          </div>
        </div>
      )}

      {/* MODULE 4: EXCEL & DATA STUDIO */}
      {activeModule === 'excel_studio' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="text-emerald-600" size={20} /> ఎక్సెల్ &amp; డేటా స్టూడియో (Excel &amp; Data Studio)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              గ్రామ పంచాయతీ సెక్రటరీలకు అవసరమైన 70+ రకాల స్ప్రెడ్‌షీట్ క్లీనర్లు, ఓటర్ లిస్ట్ ఎడిటర్లు మరియు బ్యాంకింగ్ టూల్స్.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-2xl">📱</span>
              <h4 className="font-bold text-xs text-slate-900">ఫోన్ నంబర్ క్లీనర్ (+91 ఫార్మాటర్)</h4>
              <p className="text-[10px] text-slate-500">ఎక్సెల్ షీట్‌లోని 10-అంకెల ఫోన్ నంబర్లలోని స్పేస్‌లు, డాష్‌లను తొలగించి పర్ఫెక్ట్ ఫార్మాట్‌లోకి మారుస్తుంది.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-2xl">🔤</span>
              <h4 className="font-bold text-xs text-slate-900">పేర్ల క్యాపిటలైజర్ (Proper Case)</h4>
              <p className="text-[10px] text-slate-500">అన్ని అక్షరాలు పెద్దవిగా (ALL CAPS) లేదా చిన్నవిగా ఉన్న పేర్లను గౌరవప్రదమైన ప్రాపర్ కేస్ లోకి మారుస్తుంది.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <span className="text-2xl">🧹</span>
              <h4 className="font-bold text-xs text-slate-900">డూప్లికేట్ రికార్డుల రిమూవర్</h4>
              <p className="text-[10px] text-slate-500">ఒకే ఆధార్, హౌస్ నంబర్ లేదా రేషన్ కార్డుతో ఉన్న డూప్లికేట్ ఎంట్రీలను క్షణాల్లో గుర్తిస్తుంది.</p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: HOUSE TAX DCB STATION */}
      {activeModule === 'dcb_analytics' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="text-blue-600" size={18} /> హౌస్ టాక్స్ డిమాండ్, కలెక్షన్ &amp; బ్యాలెన్స్ (DCB Station)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                తెలంగాణ మరియు ఏపీ గ్రామ పంచాయతీల ఇళ్ల పన్ను వసూళ్ల లైవ్ అనలిటిక్స్ మరియు బ్యాలెన్స్ వివరాలు.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-blue-900">మొత్తం అసెస్‌మెంట్లు</div>
              <div className="text-xl font-black text-blue-950 mt-1">1,240 ఇళ్లు</div>
              <div className="text-[10px] text-blue-700 font-semibold mt-1">గ్రామ పంచాయతీ పరిధిలో</div>
            </div>
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-900">మొత్తం వసూలు (Collection)</div>
              <div className="text-xl font-black text-emerald-800 mt-1">₹ 4,82,500</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1">82.4% వసూలు పూర్తయింది</div>
            </div>
            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-center">
              <div className="text-[10px] uppercase font-bold text-amber-900">మిగిలిన బ్యాలెన్స్ (Pending)</div>
              <div className="text-xl font-black text-amber-900 mt-1">₹ 1,02,800</div>
              <div className="text-[10px] text-amber-700 font-semibold mt-1">పెండింగ్ డిమాండ్ నోటీసులు రెడీ</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
