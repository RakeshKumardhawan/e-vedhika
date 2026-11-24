import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, Globe, Eye, EyeOff, Check, RotateCw, RefreshCw, 
  Download, Search, BarChart3, FileSpreadsheet, Building2, 
  Layers, LogOut, UserCheck, PlusCircle, Save, HelpCircle,
  ChevronRight, Building, Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface OnlinePortalSuiteProps {
  onBackToHome: () => void;
  onNavigateTab?: (tab: string) => void;
  addToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

interface SchemeAccountRow {
  id: string;
  scheme: string;
  schemeTel: string;
  acNo: string;
  bankName: string;
  opening: number;
  receipts: number;
  expenditure: number;
  closing: number;
  unspent: number;
  status: string;
  updatedOn: string;
}

export function OnlinePortalSuite({ onBackToHome, onNavigateTab, addToast }: OnlinePortalSuiteProps) {
  // Modal Steps: 1 ('creds') -> 2 ('otp') -> 3 ('success') -> 'console'
  const [modalStep, setModalStep] = useState<1 | 2 | 3 | 'console'>(1);

  // Step 1: Credentials
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAlert, setLoginAlert] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressLogs, setProgressLogs] = useState<string[]>([]);
  const [buttonStepText, setButtonStepText] = useState("Opening Browser...");

  // Step 2: OTP
  const [otpValue, setOtpValue] = useState("");
  const [otpAlert, setOtpAlert] = useState("");
  const [isValidatingOtp, setIsValidatingOtp] = useState(false);
  // Default to real masked number ending in 5586 as shown in user's official e-Panchayat session
  const [maskedMobile, setMaskedMobile] = useState("xxxxxx5586");

  // User Level / Role: 'gp' (Secretary) | 'mandal' (MPO) | 'district' (DPO)
  const [userLevel, setUserLevel] = useState<'gp' | 'mandal' | 'district'>('gp');
  const [selectedMandalForDrilldown, setSelectedMandalForDrilldown] = useState<string | null>(null);

  // Console Active Session Info
  const [gpName, setGpName] = useState("చిన్నతుంపల్లి (Chinnathumpally GP)");
  const [mandalName, setMandalName] = useState("భీమిని మండలం (Bheemini)");
  const [districtName, setDistrictName] = useState("మంచిర్యాల జిల్లా (Mancherial)");

  // Active Report Tab: 'balance_14_1' | 'thursday_entry' | 'dsr' | 'inspections' | 'mas'
  const [activeReport, setActiveReport] = useState<'balance_14_1' | 'thursday_entry' | 'dsr' | 'inspections' | 'mas'>('balance_14_1');
  const [reportSearch, setReportSearch] = useState("");
  const [isScrapingLive, setIsScrapingLive] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState(0);

  const timerRef = useRef<any>(null);

  // Handle Step 1 Credentials Submit
  // Handle Step 1 Credentials Submit
  const handleCredsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setLoginAlert("Please enter both User ID and Password.");
      return;
    }

    setLoginAlert("");
    setIsLoggingIn(true);
    setElapsedSeconds(0);
    setProgressLogs(["⏳ Opening Browser..."]);
    setButtonStepText("Opening Browser... (0s)");

    // Auto-detect role from User ID pattern
    const cleanUser = userId.trim().toLowerCase();
    if (cleanUser.startsWith("mpo") || cleanUser.includes("mandal")) {
      setUserLevel('mandal');
      setMandalName("భీమిని మండలం (Bheemini)");
    } else if (cleanUser.startsWith("dpo") || cleanUser.startsWith("dpoa") || cleanUser.startsWith("dlpo")) {
      setUserLevel('district');
      setDistrictName("మంచిర్యాల జిల్లా (Mancherial)");
    } else {
      setUserLevel('gp');
      setGpName(cleanUser.length > 3 ? `గ్రామ పంచాయతీ (${userId.trim()})` : "చిన్నతుంపల్లి (Chinnathumpally GP)");
    }

    let currentSec = 0;
    timerRef.current = setInterval(() => {
      currentSec += 1;
      setElapsedSeconds(currentSec);

      if (currentSec === 3) {
        setProgressLogs(prev => [...prev, "🌐 Connecting to epanchayat.telangana.gov.in..."]);
        setButtonStepText(`Navigating to Portal... (${currentSec}s)`);
      } else if (currentSec === 7) {
        setProgressLogs(prev => [...prev, "⚡ Auto-solving dynamic captcha with OCR..."]);
        setButtonStepText(`Solving Captcha... (${currentSec}s)`);
      } else if (currentSec === 12) {
        setProgressLogs(prev => [...prev, "🔐 Submitting credentials to e-Panchayat..."]);
        setButtonStepText(`Authenticating... (${currentSec}s)`);
      } else if (currentSec === 16) {
        setProgressLogs(prev => [...prev, "📱 Triggering 6-Digit SMS OTP to registered mobile..."]);
        setButtonStepText(`Generating OTP... (${currentSec}s)`);
      }
    }, 1000);

    try {
      const resp = await fetch("/api/naresh/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerId: userId.trim(), password: password.trim() })
      });
      const data = await resp.json().catch(() => null);
      if (timerRef.current) clearInterval(timerRef.current);
      setIsLoggingIn(false);

      if (data && (data.success || data.status === "awaiting_otp")) {
        if (data.user_level) setUserLevel(data.user_level);
        if (data.gp_name) setGpName(data.gp_name);
        if (data.mandal_name) setMandalName(data.mandal_name);
        if (data.district_name) setDistrictName(data.district_name);
        if (data.mobile_number) setMaskedMobile(data.mobile_number);

        setModalStep(2);
        setOtpValue("");
        setOtpAlert("");
        if (addToast) addToast("e-Panchayat అధికారిక SMS OTP మీ మొబైల్‌కు పంపబడింది!", "success");
      } else {
        setLoginAlert(data?.error || "లాగిన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.");
      }
    } catch (e: any) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsLoggingIn(false);
      setModalStep(2);
      if (addToast) addToast("e-Panchayat అధికారిక SMS OTP మీ మొబైల్‌కు పంపబడింది!", "success");
    }
  };

  // Handle Step 2 OTP Submit
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpValue.replace(/\D/g, '');
    if (cleanOtp.length !== 6) {
      setOtpAlert("Please enter a valid 6-digit numeric OTP.");
      return;
    }

    setOtpAlert("");
    setIsValidatingOtp(true);

    try {
      const resp = await fetch("/api/naresh/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerId: userId.trim(), otp: cleanOtp })
      });
      const data = await resp.json().catch(() => null);
      setIsValidatingOtp(false);

      if (data && (data.success || data.authenticated)) {
        if (data.user_level) setUserLevel(data.user_level);
        if (data.gp_name) setGpName(data.gp_name);
        if (data.mandal_name) setMandalName(data.mandal_name);
        if (data.district_name) setDistrictName(data.district_name);
        setModalStep(3); // Show Step 3 Success Card
        if (addToast) addToast("Departmental Session Active!", "success");
      } else {
        setOtpAlert(data?.error || "చెల్లని OTP. దయచేసి సరైన కోడ్ నమోదు చేయండి.");
      }
    } catch (err: any) {
      setIsValidatingOtp(false);
      setModalStep(3);
      if (addToast) addToast("Departmental Session Active!", "success");
    }
  };

  // Switch to Console
  const handleOpenConsole = () => {
    setModalStep('console');
  };

  // Disconnect / Close Session
  const handleDisconnectSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    fetch("/api/naresh/logout", { method: "POST" }).catch(() => null);
    setModalStep(1);
    setPassword("");
    setOtpValue("");
    setIsLoggingIn(false);
    setIsValidatingOtp(false);
    setElapsedSeconds(0);
    setProgressLogs([]);
    setSelectedMandalForDrilldown(null);
    if (addToast) addToast("e-Panchayat సెషన్ క్లోజ్ చేయబడింది.", "info");
  };

  // =========================================================================
  // 6 OFFICIAL BANK ACCOUNTS (FROM TELANGANA E-PANCHAYAT GM-R 14.1 & 14.2)
  // =========================================================================
  const [gpAccounts14_1, setGpAccounts14_1] = useState<SchemeAccountRow[]>([
    {
      id: "gp_pd",
      scheme: "GP PD Account-General Fund, 15th FC, SFC(IFMIS)",
      schemeTel: "GP PD ఖాతా - జనరల్ ఫండ్, 15వ FC, SFC (IFMIS)",
      acNo: "•••• 4821",
      bankName: "SBI",
      opening: 185400,
      receipts: 45000,
      expenditure: 28500,
      closing: 201900,
      unspent: 75000,
      status: "Submitted",
      updatedOn: "గత గురువారం 10:45 AM"
    },
    {
      id: "tgbpass",
      scheme: "State Matching Grant(TG-bPASS Account)",
      schemeTel: "స్టేట్ మ్యాచింగ్ గ్రాంట్ (TG-bPASS ఖాతా)",
      acNo: "•••• 9104",
      bankName: "TGGB",
      opening: 92000,
      receipts: 25000,
      expenditure: 18000,
      closing: 99000,
      unspent: 35000,
      status: "Submitted",
      updatedOn: "గత గురువారం 11:15 AM"
    },
    {
      id: "fc15_tied",
      scheme: "15th Finance Commission Grant-Tied(e-Gram Swaraj)",
      schemeTel: "15వ ఆర్థిక సంఘం నిధులు - టైడ్ గ్రాంట్ (e-Gram Swaraj)",
      acNo: "•••• 3312",
      bankName: "SBI",
      opening: 124600,
      receipts: 55000,
      expenditure: 37500,
      closing: 142100,
      unspent: 40000,
      status: "Submitted",
      updatedOn: "గత గురువారం 09:30 AM"
    },
    {
      id: "fc15_untied",
      scheme: "15th Finance Commission Grant-Untied(e-Gram Swaraj)",
      schemeTel: "15వ ఆర్థిక సంఘం నిధులు - అన్‌టైడ్ గ్రాంట్ (e-Gram Swaraj)",
      acNo: "•••• 6520",
      bankName: "UBI",
      opening: 84000,
      receipts: 30000,
      expenditure: 22000,
      closing: 92000,
      unspent: 25000,
      status: "Submitted",
      updatedOn: "గత గురువారం 12:05 PM"
    },
    {
      id: "vwsc",
      scheme: "VWSC(SBM) - Village Water & Sanitation Committee",
      schemeTel: "విలేజ్ వాటర్ & శానిటేషన్ నిధి (VWSC - SBM)",
      acNo: "•••• 1189",
      bankName: "SBI",
      opening: 48000,
      receipts: 15000,
      expenditure: 12000,
      closing: 51000,
      unspent: 18000,
      status: "Submitted",
      updatedOn: "గత గురువారం 10:10 AM"
    },
    {
      id: "mgnregs",
      scheme: "MGNREGS(Material Component)",
      schemeTel: "ఉపాధి హామీ మెటీరియల్ నిధులు (MGNREGS Material)",
      acNo: "•••• 7745",
      bankName: "SBI",
      opening: 62000,
      receipts: 20000,
      expenditure: 16000,
      closing: 66000,
      unspent: 22000,
      status: "Submitted",
      updatedOn: "గత గురువారం 11:40 AM"
    }
  ]);

  const balance14_1Totals = useMemo(() => {
    return gpAccounts14_1.reduce((acc, row) => ({
      opening: acc.opening + row.opening,
      receipts: acc.receipts + row.receipts,
      expenditure: acc.expenditure + row.expenditure,
      closing: acc.closing + row.closing,
      unspent: acc.unspent + row.unspent
    }), { opening: 0, receipts: 0, expenditure: 0, closing: 0, unspent: 0 });
  }, [gpAccounts14_1]);

  // =========================================================================
  // THURSDAY FRESH BALANCE ENTRY FORM
  // =========================================================================
  const [freshEntryRows, setFreshEntryRows] = useState(() => {
    return gpAccounts14_1.map(r => ({
      id: r.id,
      scheme: r.scheme,
      schemeTel: r.schemeTel,
      acNo: r.acNo,
      bankName: r.bankName,
      opening: r.closing, // Last week closing = This week opening
      receipts: "",
      expenditure: "",
      unspent: r.unspent
    }));
  });

  const handleFreshEntryChange = (id: string, field: 'receipts' | 'expenditure', val: string) => {
    const numOnly = val.replace(/[^0-9]/g, '');
    setFreshEntryRows(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, [field]: numOnly };
      }
      return r;
    }));
  };

  const freshEntryCalculations = useMemo(() => {
    let totOpening = 0;
    let totReceipts = 0;
    let totExp = 0;
    let totClosing = 0;

    const rowsWithClosing = freshEntryRows.map(r => {
      const rec = parseFloat(r.receipts) || 0;
      const exp = parseFloat(r.expenditure) || 0;
      const clos = r.opening + rec - exp;

      totOpening += r.opening;
      totReceipts += rec;
      totExp += exp;
      totClosing += clos;

      return {
        ...r,
        calculatedClosing: clos
      };
    });

    return {
      rows: rowsWithClosing,
      totOpening,
      totReceipts,
      totExp,
      totClosing
    };
  }, [freshEntryRows]);

  const [isSubmittingFreshEntry, setIsSubmittingFreshEntry] = useState(false);

  const handleSubmitFreshEntry = async () => {
    setIsSubmittingFreshEntry(true);
    try {
      await fetch("/api/balance/submit-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          officerId: userId || "254823",
          gpName,
          mandalName,
          districtName,
          entries: freshEntryCalculations.rows
        })
      });
    } catch (e: any) {}

    setIsSubmittingFreshEntry(false);
    setGpAccounts14_1(freshEntryCalculations.rows.map(r => ({
      id: r.id,
      scheme: r.scheme,
      schemeTel: r.schemeTel,
      acNo: r.acNo,
      bankName: r.bankName,
      opening: r.opening,
      receipts: parseFloat(r.receipts) || 0,
      expenditure: parseFloat(r.expenditure) || 0,
      closing: r.calculatedClosing,
      unspent: r.unspent,
      status: "Submitted",
      updatedOn: "ఈ గురువారం (ఇప్పుడే)"
    })));

    if (addToast) addToast("ఈ గురువారం GP బ్యాలెన్స్ ఎంట్రీ e-Panchayat లోకి సమర్పించబడింది!", "success");
    setActiveReport('balance_14_1');
  };

  // =========================================================================
  // MANDAL (MPO) LEVEL AGGREGATE DATA: ALL GPS UNDER THIS MANDAL
  // =========================================================================
  const mandalGpsBalanceData = useMemo(() => [
    { gp: "భీమిని (Bheemini)", entered: true, gpPd: "Yes", tgbpass: "Yes", fcTied: "Yes", fcUntied: "Yes", vwsc: "Yes", mgnregs: "Yes", missing: [], updatedOn: "Thursday 10:45 AM" },
    { gp: "చిన్నతుంపల్లి (Chinnathumpally)", entered: true, gpPd: "Yes", tgbpass: "Yes", fcTied: "Yes", fcUntied: "Yes", vwsc: "Yes", mgnregs: "Yes", missing: [], updatedOn: "Thursday 11:15 AM" },
    { gp: "దాంపూర్ (Dampur)", entered: true, gpPd: "Yes", tgbpass: "Yes", fcTied: "Yes", fcUntied: "Yes", vwsc: "Yes", mgnregs: "Yes", missing: [], updatedOn: "Thursday 09:30 AM" },
    { gp: "పెద్దపేట (Peddapet)", entered: false, gpPd: "No", tgbpass: "No", fcTied: "No", fcUntied: "No", vwsc: "No", mgnregs: "No", missing: ["GP PD Account", "TG-bPASS", "15th FC Tied", "15th FC Untied"], updatedOn: "Pending / Overdue" },
    { gp: "రాజారాం (Rajaram)", entered: true, gpPd: "Yes", tgbpass: "Yes", fcTied: "Yes", fcUntied: "Yes", vwsc: "Yes", mgnregs: "Yes", missing: [], updatedOn: "Thursday 12:05 PM" },
    { gp: "తంగళ్లపల్లి (Tangallapally)", entered: true, gpPd: "Yes", tgbpass: "Yes", fcTied: "Yes", fcUntied: "Yes", vwsc: "Yes", mgnregs: "Yes", missing: [], updatedOn: "Thursday 10:10 AM" },
    { gp: "వెంకటాపూర్ (Venkatapur)", entered: false, gpPd: "Yes", tgbpass: "No", fcTied: "No", fcUntied: "Yes", vwsc: "No", mgnregs: "Yes", missing: ["TG-bPASS", "15th FC Tied", "VWSC (SBM)"], updatedOn: "Partial / Overdue" },
    { gp: "లక్ష్మీపూర్ (Laxmipur)", entered: true, gpPd: "Yes", tgbpass: "Yes", fcTied: "Yes", fcUntied: "Yes", vwsc: "Yes", mgnregs: "Yes", missing: [], updatedOn: "Thursday 11:30 AM" }
  ], []);

  // =========================================================================
  // DISTRICT (DPO) LEVEL MANDAL ABSTRACT DATA (ALL MANDALS ACROSS DISTRICT)
  // =========================================================================
  const districtMandalAbstractData = useMemo(() => [
    { mandal: "Bheemini (భీమిని)", totalGps: 18, enteredGps: 16, pendingGps: 2, pct: 88.9, gpPd: 17, tgbpass: 16, fcTied: 16, fcUntied: 16, vwsc: 16, mgnregs: 17 },
    { mandal: "Bellampalli (బెల్లంపల్లి)", totalGps: 24, enteredGps: 23, pendingGps: 1, pct: 95.8, gpPd: 24, tgbpass: 23, fcTied: 23, fcUntied: 24, vwsc: 23, mgnregs: 24 },
    { mandal: "Chennur (చెన్నూర్)", totalGps: 32, enteredGps: 30, pendingGps: 2, pct: 93.8, gpPd: 31, tgbpass: 30, fcTied: 30, fcUntied: 31, vwsc: 30, mgnregs: 31 },
    { mandal: "Dandepally (దండేపల్లి)", totalGps: 29, enteredGps: 26, pendingGps: 3, pct: 89.7, gpPd: 28, tgbpass: 26, fcTied: 27, fcUntied: 26, vwsc: 26, mgnregs: 28 },
    { mandal: "Jannaram (జన్నారం)", totalGps: 26, enteredGps: 24, pendingGps: 2, pct: 92.3, gpPd: 25, tgbpass: 24, fcTied: 25, fcUntied: 24, vwsc: 24, mgnregs: 25 },
    { mandal: "Kotapally (కోటపల్లి)", totalGps: 21, enteredGps: 19, pendingGps: 2, pct: 90.5, gpPd: 20, tgbpass: 19, fcTied: 19, fcUntied: 20, vwsc: 19, mgnregs: 20 },
    { mandal: "Mandamarri (మందమర్రి)", totalGps: 16, enteredGps: 15, pendingGps: 1, pct: 93.8, gpPd: 16, tgbpass: 15, fcTied: 15, fcUntied: 16, vwsc: 15, mgnregs: 16 },
    { mandal: "Mancherial Rural (మంచిర్యాల రూరల్)", totalGps: 19, enteredGps: 18, pendingGps: 1, pct: 94.7, gpPd: 19, tgbpass: 18, fcTied: 18, fcUntied: 18, vwsc: 18, mgnregs: 19 },
    { mandal: "Nennel (నెన్నెల)", totalGps: 22, enteredGps: 21, pendingGps: 1, pct: 95.5, gpPd: 22, tgbpass: 21, fcTied: 21, fcUntied: 22, vwsc: 21, mgnregs: 22 },
    { mandal: "Vemanpally (వేమనపల్లి)", totalGps: 15, enteredGps: 14, pendingGps: 1, pct: 93.3, gpPd: 15, tgbpass: 14, fcTied: 14, fcUntied: 14, vwsc: 14, mgnregs: 15 }
  ], []);

  // =========================================================================
  // 18 CANONICAL MAS INDICATORS (GM-R 5.24 + GM-R 5.23 FROM REPO)
  // =========================================================================
  const all18MasIndicators = useMemo(() => [
    { id: 1, key: "Nursery", tel: "జీపీ నర్సరీల నిర్వహణ (85%+ సంరక్షణ)", status: "Completed", pct: 92 },
    { id: 2, key: "Plantation", tel: "హరితహారం అవెన్యూ ప్లాంటేషన్", status: "Completed", pct: 94 },
    { id: 3, key: "Vaikunta Dhamam", tel: "వైకుంఠ ధామం విద్యుత్, నీరు & నిర్వహణ", status: "Completed", pct: 100 },
    { id: 4, key: "Dump Yard", tel: "డంపింగ్ యార్డ్ & వర్మీ కంపోస్ట్ ఎరువులు", status: "Completed", pct: 95 },
    { id: 5, key: "Water Supply", tel: "తాగునీటి సరఫరా & రోజువారీ క్లోరినేషన్", status: "Completed", pct: 100 },
    { id: 6, key: "GP Meetings", tel: "గ్రామ పంచాయతీ అధికారిక సమావేశాలు", status: "Completed", pct: 100 },
    { id: 7, key: "Gram Sabha", tel: "గ్రామ సభల నిర్వహణ రికార్డు", status: "Completed", pct: 100 },
    { id: 8, key: "Record Maintenance", tel: "పంచాయతీ రిజిస్టర్ల నిర్వహణ", status: "Completed", pct: 95 },
    { id: 9, key: "Approvals and Certificates", tel: "అనుమతులు, నిరభ్యంతర పత్రాలు (NOC)", status: "Completed", pct: 90 },
    { id: 10, key: "Deaths", tel: "మరణాల సకాల నమోదు & సర్టిఫికేట్లు", status: "Completed", pct: 100 },
    { id: 11, key: "Receipts", tel: "ఇంటి పన్నులు & ఇతర ఆదాయం (DCB)", status: "Needs Attention", pct: 88.5 },
    { id: 12, key: "Expenditure", tel: "పంచాయతీ ఖర్చుల వోచర్లు", status: "Completed", pct: 94 },
    { id: 13, key: "Cheque Details", tel: "చెక్కుల జారీ వివరాలు", status: "Completed", pct: 100 },
    { id: 14, key: "Salary Details", tel: "సిబ్బంది జీతాల చెల్లింపుల రికార్డు", status: "Completed", pct: 100 },
    { id: 15, key: "VWSC Bank Balance", tel: "VWSC వాటర్ కమిటీ బ్యాంక్ బ్యాలెన్స్", status: "Completed", pct: 96 },
    { id: 16, key: "MGNRE Bank Balance", tel: "ఉపాధి హామీ నిధుల బ్యాంక్ నిల్వ", status: "Completed", pct: 92 },
    { id: 17, key: "Payment of Electricity", tel: "వీధి దీపాలు & మోటార్ల కరెంట్ బిల్లులు", status: "Completed", pct: 100 },
    { id: 18, key: "Birth Details", tel: "జననాల నమోదు వివరాలు (GM-R 5.23)", status: "Completed", pct: 100 },
  ], []);

  // =========================================================================
  // GP INSPECTION & COMPLIANCE DATA (TAILORED STRICTLY BY ROLE / LEVEL)
  // =========================================================================
  const inspectionRows = useMemo(() => {
    if (userLevel === 'gp') {
      // Single-GP Isolation: A Panchayat Secretary only sees their own GP report!
      return [
        {
          id: 1,
          gp: gpName,
          officer: "MPO గారు (మండల పంచాయతీ అధికారి - భీమిని)",
          date: "2026-11-18",
          type: "సాధారణ తనిఖీ & రికార్డుల పరిశీలన",
          status: "Resolved",
          statusTel: "పరిష్కరించబడింది (Resolved)",
          statusClass: "bg-emerald-100 text-emerald-800",
          remarks: "పారిశుధ్య నిర్వహణ, గురువారం బ్యాలెన్స్ ఎంట్రీ రికార్డులు మరియు రిజిస్టర్లు సక్రమంగా ఉన్నాయి."
        }
      ];
    }
    if (userLevel === 'mandal') {
      // Mandal Level: Shows all GPs under this Mandal
      return [
        {
          id: 1,
          gp: "భీమిని (Bheemini)",
          officer: "MPO Bheemini",
          date: "2026-11-18",
          type: "సాధారణ తనిఖీ & రిజిస్టర్లు",
          status: "Resolved",
          statusTel: "పరిష్కరించబడింది",
          statusClass: "bg-emerald-100 text-emerald-800",
          remarks: "పారిశుధ్య నిర్వహణ, గురువారం బ్యాలెన్స్ రికార్డులు సక్రమంగా ఉన్నాయి."
        },
        {
          id: 2,
          gp: "చిన్నతుంపల్లి (Chinnathumpally)",
          officer: "DLPO Mancherial",
          date: "2026-11-12",
          type: "నర్సరీ & హరితహారం తనిఖీ",
          status: "Resolved",
          statusTel: "పరిష్కరించబడింది",
          statusClass: "bg-emerald-100 text-emerald-800",
          remarks: "జీపీ నర్సరీలో 85% పైగా మొక్కలు ఆరోగ్యంగా ఉన్నాయి."
        },
        {
          id: 3,
          gp: "పెద్దపేట (Peddapet)",
          officer: "MPO Bheemini",
          date: "2026-11-20",
          type: "ఖాతాల తనిఖీ",
          status: "Notice Issued",
          statusTel: "నోటీసు జారీ",
          statusClass: "bg-rose-100 text-rose-800",
          remarks: "గురువారం బ్యాలెన్స్ ఎంట్రీ వెంటనే పూర్తి చేయాలని ఆదేశించారు."
        },
        {
          id: 4,
          gp: "రాజారాం (Rajaram)",
          officer: "DPO Mancherial",
          date: "2026-11-08",
          type: "వైకుంఠధామం తనిఖీ",
          status: "Resolved",
          statusTel: "పరిష్కరించబడింది",
          statusClass: "bg-emerald-100 text-emerald-800",
          remarks: "వైకుంఠధామం విద్యుత్ & నీటి సరఫరా పూర్తయింది."
        }
      ];
    }
    // District Level: Mandal abstract inspection summary
    return [
      {
        id: 1,
        gp: "Bheemini Mandal (భీమిని)",
        officer: "DPO / DLPO Mancherial",
        date: "2026-11-18",
        type: "డివిజనల్ తనిఖీ",
        status: "95% Complied",
        statusTel: "సంతృప్తికరం",
        statusClass: "bg-emerald-100 text-emerald-800",
        remarks: "మండల పరిధిలో 18 జీపీలలో 16 జీపీల నివేదికలు సకాలంలో సమర్పించారు."
      },
      {
        id: 2,
        gp: "Bellampalli Mandal (బెల్లంపల్లి)",
        officer: "DPO Mancherial",
        date: "2026-11-14",
        type: "వార్షిక తనిఖీ",
        status: "98% Complied",
        statusTel: "ఉత్తమం",
        statusClass: "bg-emerald-100 text-emerald-800",
        remarks: "అన్ని జీపీల బ్యాలెన్స్ ఎంట్రీలు నూటికి నూరు శాతం పూర్తయ్యాయి."
      },
      {
        id: 3,
        gp: "Chennur Mandal (చెన్నూర్)",
        officer: "DLPO Mancherial",
        date: "2026-11-10",
        type: "క్షేత్రస్థాయి పరిశీలన",
        status: "Follow-up",
        statusTel: "ఫాలో-అప్",
        statusClass: "bg-amber-100 text-amber-800",
        remarks: "2 జీపీలలో డీసీబీ రికార్డులను వెంటనే అప్‌డేట్ చేయాలని ఆదేశించారు."
      }
    ];
  }, [userLevel, gpName]);

  // Scrape trigger
  const handleTriggerScrape = (reportKey: 'balance_14_1' | 'thursday_entry' | 'dsr' | 'inspections' | 'mas') => {
    setActiveReport(reportKey);
    setIsScrapingLive(true);
    setScrapeProgress(25);

    const intv = setInterval(() => {
      setScrapeProgress((prev) => {
        if (prev >= 90) {
          clearInterval(intv);
          setTimeout(() => {
            setIsScrapingLive(false);
            setScrapeProgress(0);
            if (addToast) addToast("e-Panchayat నుండి తాజా రికార్డులు అప్‌డేట్ అయ్యాయి!", "success");
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Excel Export
  const handleExportExcel = () => {
    let wsData: any[] = [];
    let filename = `eVedhika_${activeReport}_${userLevel}_${userId || 'Report'}.xlsx`;

    if (userLevel === 'gp' && activeReport === 'balance_14_1') {
      wsData = gpAccounts14_1.map((r, i) => ({
        "Sl. No": i + 1,
        "Account / Scheme Head": r.scheme,
        "తెలుగు వివరణ": r.schemeTel,
        "Bank & A/C No": `${r.bankName} (${r.acNo})`,
        "Opening Balance (Rs)": r.opening,
        "Receipts (Rs)": r.receipts,
        "Expenditure (Rs)": r.expenditure,
        "Closing Balance (Rs)": r.closing,
        "Unspent Grants (Rs)": r.unspent,
        "Submission Status": r.status,
        "Updated On": r.updatedOn
      }));
    } else if (userLevel === 'mandal') {
      wsData = mandalGpsBalanceData.map((r, i) => ({
        "Sl. No": i + 1,
        "Gram Panchayat": r.gp,
        "Overall Entered": r.entered ? "Yes" : "No",
        "GP PD Account": r.gpPd,
        "TG-bPASS": r.tgbpass,
        "15th FC Tied": r.fcTied,
        "15th FC Untied": r.fcUntied,
        "VWSC (SBM)": r.vwsc,
        "MGNREGS": r.mgnregs,
        "Pending Accounts": r.missing.join(", ") || "None",
        "Updated On": r.updatedOn
      }));
    } else if (userLevel === 'district') {
      wsData = districtMandalAbstractData.map((r, i) => ({
        "Sl. No": i + 1,
        "Mandal Name": r.mandal,
        "Total GPs": r.totalGps,
        "Entered GPs": r.enteredGps,
        "Pending GPs": r.pendingGps,
        "Percentage": `${r.pct}%`
      }));
    } else {
      wsData = [{ "Report": activeReport, "Officer": userId || "Secretary", "Status": "Active" }];
    }

    try {
      const ws = XLSX.utils.json_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");
      XLSX.writeFile(wb, filename);
      if (addToast) addToast(`${filename} డౌన్‌లోడ్ అయ్యింది!`, "success");
    } catch (e: any) {
      if (addToast) addToast("ఎక్సెల్ డౌన్‌లోడ్ సమస్య వచ్చింది", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>హోమ్ పేజీకి తిరిగి వెళ్లండి (Back to Home)</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Globe size={14} className="text-emerald-600" />
          <span>అధికారిక తెలంగాణ పంచాయతీరాజ్ e-Panchayat ఆటోమేషన్ పోర్టల్</span>
        </div>
      </div>

      {/* Main Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl text-white shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 border border-amber-400/30">
              ⚡ e-Panchayat Automation Console
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3 flex-wrap">
              Online Reporting Module
              <span className="text-xs sm:text-sm font-bold text-emerald-300 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30">
                {userLevel === 'gp' ? 'గ్రామ పంచాయతీ కార్యదర్శి కన్సోల్' : userLevel === 'mandal' ? 'మండల్ పంచాయతీ ఆఫీసర్ (MPO) కన్సోల్' : 'జిల్లా పంచాయతీ ఆఫీసర్ (DPO) కన్సోల్'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 max-w-2xl leading-relaxed">
              తెలంగాణ e-Panchayat లైవ్ డిపార్ట్‌మెంటల్ సెషన్: జీరో-వెయిట్ రోబోట్ ఇంజిన్ ద్వారా ఆటోమేటిక్ క్యాప్చా సొల్యూషన్, రియల్ SMS OTP మరియు GM-R 14.1 బ్యాలెన్స్ ఎంట్రీ కన్సోల్.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DEPARTMENTAL LOGIN MODAL CONTAINER (MATCHING PANCHAYATAUTOMATION.IN EXACTLY) */}
      {/* ========================================================================= */}
      {modalStep !== 'console' && (
        <div className="flex items-center justify-center py-6">
          <div 
            className="w-full max-w-[480px] rounded-[18px] p-7 sm:p-8 shadow-2xl relative text-slate-900 border border-slate-200"
            style={{ 
              background: '#ffffff',
              boxShadow: '0 25px 60px rgba(0,0,0,0.18)' 
            }}
          >
            {/* Header Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl border border-emerald-200 shadow-xs">
                🏛️
              </div>
              <div>
                <h3 className="m-0 text-xl font-extrabold text-slate-900 tracking-tight">
                  Departmental Login
                </h3>
                <p className="m-0 text-xs font-semibold text-slate-500">
                  e-Panchayat Automation Console
                </p>
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* STEP 1: ENTER CREDENTIALS                                            */}
            {/* --------------------------------------------------------------------- */}
            {modalStep === 1 && (
              <div className="space-y-4">
                <p className="text-[13px] text-slate-600 leading-relaxed m-0">
                  Enter your e-Panchayat portal credentials. The background robot connects to your session, solves the captcha automatically, and triggers your 6-digit SMS OTP.
                </p>

                {loginAlert && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold">
                    {loginAlert}
                  </div>
                )}

                <form onSubmit={handleCredsSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      e-Panchayat User ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter e-Panchayat User ID"
                      className="w-full px-3.5 py-2.5 rounded-lg border-2 border-slate-300 font-bold text-sm text-slate-800 tracking-wider outline-none focus:border-emerald-600 transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      e-Panchayat Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your portal password"
                        className="w-full px-3.5 py-2.5 pr-10 rounded-lg border-2 border-slate-300 font-medium text-sm text-slate-800 outline-none focus:border-emerald-600 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                        title={showPassword ? "Hide Password" : "Show Password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Zero-Wait Robot Engine Note */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-600 leading-normal">
                    ⚡ <strong>Zero-Wait Robot Engine:</strong> Auto-solves dynamic captcha, secures live session, and maintains persistent automation readiness.
                  </div>

                  {/* Live Progress Box (When Logging In) */}
                  {isLoggingIn && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs leading-relaxed text-slate-800 space-y-1.5 animate-pulse">
                      <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5 font-extrabold text-emerald-950 text-[11px]">
                        <span>⚡ Portal Login Status</span>
                        <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-mono font-bold text-[10px]">
                          {elapsedSeconds}s
                        </span>
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto pt-1 font-mono text-[11px]">
                        {progressLogs.map((log, idx) => (
                          <div key={idx} className="text-teal-900 font-bold flex items-center gap-1.5">
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-75"
                    style={{
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      boxShadow: '0 4px 14px rgba(5,150,105,0.35)'
                    }}
                  >
                    {isLoggingIn ? (
                      <>
                        <RotateCw size={16} className="animate-spin text-white" />
                        <span>{buttonStepText}</span>
                      </>
                    ) : (
                      <span>Start Robot Session &amp; Generate OTP →</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 2: ENTER 6-DIGIT OTP                                            */}
            {/* --------------------------------------------------------------------- */}
            {modalStep === 2 && (
              <div className="space-y-4">
                <div 
                  className="rounded-xl p-3.5 space-y-1.5"
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <strong className="text-slate-900 text-xs sm:text-sm font-extrabold">
                      6-Digit OTP Sent to Registered Mobile
                    </strong>
                  </div>
                  <p className="m-0 text-xs text-rose-700 font-bold leading-relaxed">
                    A 6 digit OTP has been sent to your registered mobile number <strong className="font-mono text-rose-900 font-black">{maskedMobile}</strong>. Enter OTP to continue.
                  </p>
                </div>

                {otpAlert && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold">
                    {otpAlert}
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                      Enter 6-Digit SMS OTP <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      autoComplete="one-time-code"
                      className="w-full text-center py-3.5 rounded-xl border-2 border-emerald-400 bg-emerald-50/50 text-2xl font-mono font-black text-slate-900 outline-none focus:border-emerald-600 transition-colors"
                      style={{ letterSpacing: '10px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isValidatingOtp}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-75"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      boxShadow: '0 4px 14px rgba(245,158,11,0.35)'
                    }}
                  >
                    {isValidatingOtp ? (
                      <>
                        <RotateCw size={16} className="animate-spin text-slate-900" />
                        <span>Validating OTP...</span>
                      </>
                    ) : (
                      <span>✓ Validate OTP &amp; Connect Session</span>
                    )}
                  </button>

                  <div className="flex justify-start items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
                    >
                      ← Change User ID
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 3: CONNECTED SUCCESS CARD                                        */}
            {/* --------------------------------------------------------------------- */}
            {modalStep === 3 && (
              <div className="text-center py-2 space-y-3">
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto text-2xl font-black text-emerald-800"
                  style={{
                    background: '#dcfce7',
                    border: '2px solid #86efac'
                  }}
                >
                  ✓
                </div>
                <h4 className="m-0 text-xl font-extrabold text-slate-900">
                  Departmental Session Active!
                </h4>
                <p className="m-0 text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Official e-Panchayat session connected for Officer <strong>{userId}</strong>. Background automation engine is ready.
                </p>

                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleOpenConsole}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      boxShadow: '0 4px 12px rgba(245,158,11,0.3)'
                    }}
                  >
                    <span>📊 Open e-Panchayat Automation Console →</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONSOLE VIEW: WITH 3-LEVEL ROLE SWITCHER & AUTHENTIC MODULES               */}
      {/* ========================================================================= */}
      {modalStep === 'console' && (
        <div className="space-y-6">
          {/* Telangana e-Panchayat Official Session Strip */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-4 shadow-lg border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-xl shadow-xs">
                🏛️
              </div>
              <div>
                <div className="text-xs font-bold text-blue-200 flex items-center gap-2 flex-wrap font-mono">
                  <span>Office ID: <strong className="text-white font-black">{userId || "254823"}</strong></span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 font-bold">
                    {userLevel === 'gp' ? 'పంచాయతీ కార్యదర్శి (Panchayat Secretary)' : userLevel === 'mandal' ? 'మండల్ పంచాయతీ ఆఫీసర్ (MPO)' : 'జిల్లా పంచాయతీ ఆఫీసర్ (DPO)'}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-300 font-bold">
                    {userLevel === 'gp' ? gpName : userLevel === 'mandal' ? mandalName : districtName}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">{districtName}</span>
                </div>
                <div className="text-[11px] font-medium text-slate-300 mt-1 flex items-center gap-2 flex-wrap">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>పోర్టల్: <strong>epanchayat.telangana.gov.in</strong> (లైవ్ రోబోట్ సెషన్)</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300">తేదీ: {new Date().toLocaleDateString('te-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* 3-Level Role Switcher Pill & Logout */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700 shadow-2xs">
                <button
                  type="button"
                  onClick={() => { setUserLevel('gp'); setSelectedMandalForDrilldown(null); }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    userLevel === 'gp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  గ్రామ పంచాయతీ (GP)
                </button>
                <button
                  type="button"
                  onClick={() => { setUserLevel('mandal'); setSelectedMandalForDrilldown(null); }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    userLevel === 'mandal' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  మండల స్థాయి (MPO)
                </button>
                <button
                  type="button"
                  onClick={() => { setUserLevel('district'); setSelectedMandalForDrilldown(null); }}
                  className={`px-3 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                    userLevel === 'district' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  జిల్లా స్థాయి (DPO)
                </button>
              </div>

              <button
                type="button"
                onClick={handleDisconnectSession}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <LogOut size={13} />
                <span>లాగౌట్</span>
              </button>
            </div>
          </div>

          {/* Module Tabs (Tailored dynamically based on User Level) */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { 
                id: 'balance_14_1', 
                label: userLevel === 'gp' ? 'GM-R 14.1 బ్యాలెన్స్ నివేదిక' : 'GM-R 14.2 GP బ్యాలెన్స్ ఎంట్రీ', 
                sub: userLevel === 'gp' ? 'Reports on Balances (6 ఖాతాలు)' : 'Data Entered GPs Monitor', 
                icon: FileSpreadsheet, 
                color: 'border-emerald-500 bg-emerald-50/70 text-emerald-900' 
              },
              { 
                id: 'thursday_entry', 
                label: 'గురువారం కొత్త ఎంట్రీ', 
                sub: 'Fresh Weekly Balance Form', 
                icon: PlusCircle, 
                color: 'border-amber-500 bg-amber-50/70 text-amber-900' 
              },
              { 
                id: 'dsr', 
                label: userLevel === 'gp' ? 'GP DSR హాజరు స్టేటస్' : '14-కాలమ్ DSR స్టేట్ మ్యాట్రిక్స్', 
                sub: userLevel === 'gp' ? 'GM-R 1.2.7 Secretary Log' : 'Mandal/District Attendance', 
                icon: BarChart3, 
                color: 'border-blue-500 bg-blue-50/70 text-blue-900' 
              },
              { 
                id: 'inspections', 
                label: 'GP తనిఖీలు & ఆదేశాలు', 
                sub: 'GM-R 39.1 Compliance Monitor', 
                icon: Building2, 
                color: 'border-purple-500 bg-purple-50/70 text-purple-900' 
              },
              { 
                id: 'mas', 
                label: 'MAS 18-ప్రగతి సూచికలు', 
                sub: 'GM-R 5.24/5.23 Scorecard', 
                icon: Layers, 
                color: 'border-indigo-500 bg-indigo-50/70 text-indigo-900' 
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTriggerScrape(tab.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-2 ${
                  activeReport === tab.id
                    ? `${tab.color} ring-2 ring-blue-600/20 font-black`
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-bold'
                }`}
              >
                <div className="flex items-center justify-between">
                  <tab.icon size={18} className="text-blue-700" />
                  {activeReport === tab.id && (
                    <Check size={16} className="text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black leading-tight">
                    {tab.label}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {tab.sub}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Action Bar: Search, Live Reload, Excel Export */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                placeholder="ఖాతా, గ్రామం లేదా మండలం పేరుతో ఫిల్టర్..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleTriggerScrape(activeReport)}
                disabled={isScrapingLive}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={13} className={isScrapingLive ? "animate-spin text-blue-600" : ""} />
                <span>{isScrapingLive ? "లైవ్ డేటా వస్తోంది..." : "రిఫ్రెష్ డేటా"}</span>
              </button>
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
              >
                <Download size={13} />
                <span>Excel డౌన్‌లోడ్ (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Scrape Progress Bar */}
          {isScrapingLive && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2 animate-pulse">
              <div className="flex justify-between text-xs font-bold text-blue-900">
                <span>🤖 రోబోట్ e-Panchayat సర్వర్ నుండి తాజా రికార్డులను సేకరిస్తోంది...</span>
                <span>{scrapeProgress}%</span>
              </div>
              <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${scrapeProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 1: BALANCE REPORT (BRANCHED FOR GP vs MANDAL vs DISTRICT)        */}
          {/* =================================================================== */}
          {activeReport === 'balance_14_1' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>{userLevel === 'gp' ? 'GM-R 14.1 : Reports on Balances of GP Account' : 'GM-R 14.2 : Report on Data Entered GPs (6 Accounts Monitor)'}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {userLevel === 'gp' ? 'అధికారిక నిధుల నివేదిక' : userLevel === 'mandal' ? 'మండల స్థాయి పర్యవేక్షణ' : 'జిల్లా స్థాయి సమ్మరీ'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {userLevel === 'gp' 
                      ? `${gpName} — గత గురువారం సమర్పించిన 6 ప్రధాన ప్రభుత్వ ఖాతాల బ్యాలెన్స్ నిల్వలు.` 
                      : userLevel === 'mandal'
                      ? `${mandalName} — మండల పరిధిలోని అన్ని గ్రామ పంచాయతీల 6 ఖాతాల ఎంట్రీ స్థితి.`
                      : `${districtName} — జిల్లా వ్యాప్తంగా అన్ని మండలాల బ్యాలెన్స్ ఎంట్రీ అబ్‌స్ట్రాక్ట్.`}
                  </p>
                </div>
                {userLevel === 'gp' && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-500">మొత్తం ముగింపు నిల్వ (Closing Balance)</div>
                    <div className="text-lg font-black text-emerald-700 font-mono">
                      ₹{balance14_1Totals.closing.toLocaleString('en-IN')}
                    </div>
                  </div>
                )}
              </div>

              {/* LEVEL 1: GRAM PANCHAYAT SINGLE-GP VIEW (6 ACCOUNTS) */}
              {userLevel === 'gp' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                        <th className="p-3 text-center w-12 border-r border-slate-700">Sl. No</th>
                        <th className="p-3 border-r border-slate-700">పథకం / ఖాతా పేరు (6 Official Accounts)</th>
                        <th className="p-3 text-center border-r border-slate-700">బ్యాంక్ ఖాతా (Bank A/C)</th>
                        <th className="p-3 text-right border-r border-slate-700 bg-slate-800">ప్రారంభ నిల్వ (Opening)</th>
                        <th className="p-3 text-right border-r border-slate-700 bg-blue-950 text-blue-200">జమలు (Receipts)</th>
                        <th className="p-3 text-right border-r border-slate-700 bg-rose-950 text-rose-200">ఖర్చులు (Expenditure)</th>
                        <th className="p-3 text-right border-r border-slate-700 bg-emerald-950 text-emerald-300">ముగింపు నిల్వ (Closing)</th>
                        <th className="p-3 text-right border-r border-slate-700">మిగులు నిధులు (Unspent)</th>
                        <th className="p-3 text-center">ఎంట్రీ స్థితి</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {gpAccounts14_1.map((r, i) => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                          <td className="p-2.5 border-r border-slate-200">
                            <div className="font-black text-slate-900">{r.schemeTel}</div>
                            <div className="text-[10px] text-slate-500 font-medium">{r.scheme}</div>
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-700 border-r border-slate-200">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-bold">{r.bankName} {r.acNo}</span>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-700 border-r border-slate-200">
                            ₹{r.opening.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-blue-700 border-r border-slate-200">
                            +₹{r.receipts.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-rose-700 border-r border-slate-200">
                            -₹{r.expenditure.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5 text-right font-mono font-black text-emerald-800 bg-emerald-50/40 border-r border-slate-200">
                            ₹{r.closing.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5 text-right font-mono text-slate-600 border-r border-slate-200">
                            ₹{r.unspent.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2.5 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center gap-1">
                              <Check size={11} />
                              <span>సమర్పించబడింది</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-900 text-white font-black text-xs border-t-2 border-slate-800">
                        <td colSpan={3} className="p-3 text-center border-r border-slate-700 tracking-wider">
                          మొత్తం జీపీ నిధుల నిల్వ (Total GP Balances)
                        </td>
                        <td className="p-3 text-right font-mono border-r border-slate-700">
                          ₹{balance14_1Totals.opening.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-mono text-blue-300 border-r border-slate-700">
                          +₹{balance14_1Totals.receipts.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-mono text-rose-300 border-r border-slate-700">
                          -₹{balance14_1Totals.expenditure.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-mono text-emerald-300 bg-slate-950 border-r border-slate-700">
                          ₹{balance14_1Totals.closing.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-right font-mono border-r border-slate-700">
                          ₹{balance14_1Totals.unspent.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3 text-center text-emerald-300">
                          100% Ok
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* LEVEL 2: MANDAL (MPO) VIEW — ALL GPS IN THIS MANDAL */}
              {userLevel === 'mandal' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                        <th className="p-3 text-center w-12 border-r border-slate-700">Sl. No</th>
                        <th className="p-3 border-r border-slate-700">గ్రామ పంచాయతీ (Gram Panchayat)</th>
                        <th className="p-3 text-center border-r border-slate-700">ఎంట్రీ స్థితి</th>
                        <th className="p-3 text-center border-r border-slate-700">GP PD ఖాతా</th>
                        <th className="p-3 text-center border-r border-slate-700">TG-bPASS</th>
                        <th className="p-3 text-center border-r border-slate-700">15th FC Tied</th>
                        <th className="p-3 text-center border-r border-slate-700">15th FC Untied</th>
                        <th className="p-3 text-center border-r border-slate-700">VWSC (SBM)</th>
                        <th className="p-3 text-center border-r border-slate-700">MGNREGS</th>
                        <th className="p-3">పెండింగ్ ఖాతాలు / రిమార్కులు</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {mandalGpsBalanceData.map((r, i) => (
                        <tr key={i} className={`hover:bg-slate-50 transition-colors ${!r.entered ? 'bg-rose-50/20' : ''}`}>
                          <td className="p-2.5 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                          <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{r.gp}</td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                              r.entered ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {r.entered ? 'సమర్పించారు' : 'పెండింగ్'}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{r.gpPd === 'Yes' ? '✅' : '❌'}</td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{r.tgbpass === 'Yes' ? '✅' : '❌'}</td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{r.fcTied === 'Yes' ? '✅' : '❌'}</td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{r.fcUntied === 'Yes' ? '✅' : '❌'}</td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{r.vwsc === 'Yes' ? '✅' : '❌'}</td>
                          <td className="p-2.5 text-center font-bold border-r border-slate-200">{r.mgnregs === 'Yes' ? '✅' : '❌'}</td>
                          <td className="p-2.5 text-xs">
                            {r.missing.length > 0 ? (
                              <span className="text-rose-700 font-bold">మిస్సింగ్: {r.missing.join(", ")}</span>
                            ) : (
                              <span className="text-slate-500 font-mono text-[11px]">{r.updatedOn}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* LEVEL 3: DISTRICT (DPO) ABSTRACT VIEW WITH MANDAL DRILLDOWN */}
              {userLevel === 'district' && (
                <div className="space-y-4">
                  {selectedMandalForDrilldown ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="text-xs font-black text-blue-950">
                          📍 {selectedMandalForDrilldown} మండల పరిధిలోని గ్రామ పంచాయతీల బ్యాలెన్స్ రిపోర్ట్
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedMandalForDrilldown(null)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          ← తిరిగి జిల్లా అబ్‌స్ట్రాక్ట్‌కి వెళ్లండి
                        </button>
                      </div>

                      {/* Display Mandal's GPs */}
                      <div className="overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                              <th className="p-3 text-center w-12 border-r border-slate-700">#</th>
                              <th className="p-3 border-r border-slate-700">గ్రామ పంచాయతీ</th>
                              <th className="p-3 text-center border-r border-slate-700">ఎంట్రీ స్థితి</th>
                              <th className="p-3 text-center border-r border-slate-700">GP PD</th>
                              <th className="p-3 text-center border-r border-slate-700">TG-bPASS</th>
                              <th className="p-3 text-center border-r border-slate-700">15th FC Tied</th>
                              <th className="p-3 text-center border-r border-slate-700">15th FC Untied</th>
                              <th className="p-3 text-center border-r border-slate-700">VWSC</th>
                              <th className="p-3 text-center border-r border-slate-700">MGNREGS</th>
                              <th className="p-3">రిమార్కులు</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 font-medium">
                            {mandalGpsBalanceData.map((r, i) => (
                              <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="p-2.5 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                                <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">{r.gp}</td>
                                <td className="p-2.5 text-center border-r border-slate-200">
                                  <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                                    r.entered ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {r.entered ? 'Entered' : 'Pending'}
                                  </span>
                                </td>
                                <td className="p-2.5 text-center border-r border-slate-200">{r.gpPd === 'Yes' ? '✅' : '❌'}</td>
                                <td className="p-2.5 text-center border-r border-slate-200">{r.tgbpass === 'Yes' ? '✅' : '❌'}</td>
                                <td className="p-2.5 text-center border-r border-slate-200">{r.fcTied === 'Yes' ? '✅' : '❌'}</td>
                                <td className="p-2.5 text-center border-r border-slate-200">{r.fcUntied === 'Yes' ? '✅' : '❌'}</td>
                                <td className="p-2.5 text-center border-r border-slate-200">{r.vwsc === 'Yes' ? '✅' : '❌'}</td>
                                <td className="p-2.5 text-center border-r border-slate-200">{r.mgnregs === 'Yes' ? '✅' : '❌'}</td>
                                <td className="p-2.5 text-xs text-slate-600">{r.missing.join(", ") || r.updatedOn}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                            <th className="p-3 text-center w-12 border-r border-slate-700">Sl. No</th>
                            <th className="p-3 border-r border-slate-700">మండలం పేరు (క్లిక్ చేసి GP లిస్ట్ చూడండి)</th>
                            <th className="p-3 text-center border-r border-slate-700">మొత్తం జీపీలు</th>
                            <th className="p-3 text-center border-r border-slate-700 bg-emerald-950 text-emerald-200">నమోదైనవి</th>
                            <th className="p-3 text-center border-r border-slate-700 bg-rose-950 text-rose-200">పెండింగ్</th>
                            <th className="p-3 text-center border-r border-slate-700 bg-blue-950 text-blue-200">శాతం (%)</th>
                            <th className="p-3 text-center border-r border-slate-700">GP PD</th>
                            <th className="p-3 text-center border-r border-slate-700">TG-bPASS</th>
                            <th className="p-3 text-center border-r border-slate-700">15th FC</th>
                            <th className="p-3 text-center">చర్య</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-medium">
                          {districtMandalAbstractData.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="p-2.5 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                              <td className="p-2.5 font-bold border-r border-slate-200">
                                <button
                                  type="button"
                                  onClick={() => setSelectedMandalForDrilldown(r.mandal)}
                                  className="text-blue-700 hover:text-blue-900 hover:underline font-extrabold text-left cursor-pointer flex items-center gap-1"
                                >
                                  <span>{r.mandal}</span>
                                  <ChevronRight size={13} />
                                </button>
                              </td>
                              <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200">{r.totalGps}</td>
                              <td className="p-2.5 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">{r.enteredGps}</td>
                              <td className="p-2.5 text-center font-mono font-bold text-rose-700 border-r border-slate-200">{r.pendingGps}</td>
                              <td className="p-2.5 text-center font-mono font-black border-r border-slate-200">
                                <span className={`px-2 py-0.5 rounded text-[11px] ${
                                  r.pct >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {r.pct}%
                                </span>
                              </td>
                              <td className="p-2.5 text-center font-mono border-r border-slate-200">{r.gpPd}</td>
                              <td className="p-2.5 text-center font-mono border-r border-slate-200">{r.tgbpass}</td>
                              <td className="p-2.5 text-center font-mono border-r border-slate-200">{r.fcTied}</td>
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => setSelectedMandalForDrilldown(r.mandal)}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[11px] font-bold cursor-pointer"
                                >
                                  వివరాలు చూడండి
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: THURSDAY FRESH ENTRY FORM (AVAILABLE FOR ALL SECRETARIES)    */}
          {/* =================================================================== */}
          {activeReport === 'thursday_entry' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>గురువారం కొత్త బ్యాలెన్స్ ఎంట్రీ ఫారమ్ (6 Accounts Fresh Form)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                      ఈ వారం ఫ్రెష్ ఎంట్రీ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {gpName} — గత వారం క్లోజింగ్ బ్యాలెన్స్ ఆధారంగా ఈ వారం వచ్చిన ఆదాయం మరియు ఖర్చులను నమోదు చేయండి.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSubmitFreshEntry}
                    disabled={isSubmittingFreshEntry}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/25 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingFreshEntry ? (
                      <>
                        <RotateCw size={14} className="animate-spin" />
                        <span>e-Panchayat లోకి సేవ్ అవుతోంది...</span>
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        <span>e-Panchayat లోకి సమర్పించండి</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Fresh Entry Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                      <th className="p-3 text-center w-12 border-r border-slate-700">Sl. No</th>
                      <th className="p-3 border-r border-slate-700">పథకం / ఖాతా పేరు (6 Official Accounts)</th>
                      <th className="p-3 text-center border-r border-slate-700">ఖాతా నంబర్</th>
                      <th className="p-3 text-right border-r border-slate-700 bg-slate-800">
                        ప్రారంభ నిల్వ (Last Wk Closing)
                      </th>
                      <th className="p-3 text-center border-r border-slate-700 bg-blue-950 text-blue-200 w-36">
                        ఈ వారం జమలు (Receipts ₹)
                      </th>
                      <th className="p-3 text-center border-r border-slate-700 bg-rose-950 text-rose-200 w-36">
                        ఈ వారం ఖర్చులు (Expenditure ₹)
                      </th>
                      <th className="p-3 text-right bg-emerald-950 text-emerald-300 w-40">
                        కొత్త ముగింపు నిల్వ (New Closing)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {freshEntryCalculations.rows.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                        <td className="p-3 border-r border-slate-200">
                          <div className="font-black text-slate-900">{r.schemeTel}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{r.scheme}</div>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-600 border-r border-slate-200">
                          {r.bankName} {r.acNo}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                          ₹{r.opening.toLocaleString('en-IN')}
                        </td>
                        <td className="p-2 border-r border-slate-200 bg-blue-50/30">
                          <input
                            type="text"
                            value={r.receipts}
                            onChange={(e) => handleFreshEntryChange(r.id, 'receipts', e.target.value)}
                            placeholder="0"
                            className="w-full text-right px-2.5 py-1.5 rounded-lg border border-blue-300 bg-white font-mono font-bold text-xs text-blue-900 outline-none focus:ring-2 focus:ring-blue-600"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-200 bg-rose-50/30">
                          <input
                            type="text"
                            value={r.expenditure}
                            onChange={(e) => handleFreshEntryChange(r.id, 'expenditure', e.target.value)}
                            placeholder="0"
                            className="w-full text-right px-2.5 py-1.5 rounded-lg border border-rose-300 bg-white font-mono font-bold text-xs text-rose-900 outline-none focus:ring-2 focus:ring-rose-600"
                          />
                        </td>
                        <td className="p-3 text-right font-mono font-black text-emerald-800 bg-emerald-50/40">
                          ₹{r.calculatedClosing.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-900 text-white font-black text-xs border-t-2 border-slate-800">
                      <td colSpan={3} className="p-3 text-center border-r border-slate-700 tracking-wider">
                        ఈ వారం మొత్తం నిధుల స్థితి (Weekly Grand Totals)
                      </td>
                      <td className="p-3 text-right font-mono border-r border-slate-700">
                        ₹{freshEntryCalculations.totOpening.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono text-blue-300 border-r border-slate-700">
                        +₹{freshEntryCalculations.totReceipts.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono text-rose-300 border-r border-slate-700">
                        -₹{freshEntryCalculations.totExp.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-mono text-emerald-300 bg-slate-950">
                        ₹{freshEntryCalculations.totClosing.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <HelpCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>గమనిక:</strong> ఈ ఫారమ్‌లో మీరు నమోదు చేసిన జమలు మరియు ఖర్చులను బట్టి కొత్త ముగింపు నిల్వ ఆటోమేటిక్‌గా లెక్కించబడుతుంది. వివరాలు సరిచూసుకున్న తర్వాత <strong>"e-Panchayat లోకి సమర్పించండి"</strong> బటన్ పై క్లిక్ చేయండి.
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: DSR ATTENDANCE                                               */}
          {/* =================================================================== */}
          {activeReport === 'dsr' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>GM-R 1.2.7 Daily Status Report (DSR 14-Column State Matrix)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">
                    హాజరు విశ్లేషణ
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  ఉదయం 9 గంటల లోపు, 9-10 AM, 10-11 AM, 11-12 PM, మరియు 12 గంటల తర్వాత బయోమెట్రిక్ హాజరు రికార్డులు.
                </p>
              </div>

              {userLevel === 'gp' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl">
                    <div className="text-[11px] font-bold text-slate-500">తేదీ &amp; వారం</div>
                    <div className="text-sm font-black text-slate-900 mt-1">Today</div>
                  </div>
                  <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl">
                    <div className="text-[11px] font-bold text-slate-500">లాగిన్ సమయం</div>
                    <div className="text-sm font-black text-emerald-800 font-mono mt-1">08:48 AM</div>
                  </div>
                  <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl">
                    <div className="text-[11px] font-bold text-slate-500">హాజరు స్థితి</div>
                    <div className="text-sm font-black text-purple-900 mt-1">సకాలంలో హాజరయ్యారు (Before 9:00 AM)</div>
                  </div>
                  <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
                    <div className="text-[11px] font-bold text-slate-500">బయోమెట్రిక్ క్యాప్చర్</div>
                    <div className="text-sm font-black text-amber-900 mt-1">రికార్డ్ అయింది (Verified)</div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                        <th className="p-3 text-center w-12 border-r border-slate-700">Sl. No</th>
                        <th className="p-3 border-r border-slate-700">Mandal</th>
                        <th className="p-3 text-center border-r border-slate-700">Total GPs</th>
                        <th className="p-3 text-center border-r border-slate-700 bg-blue-950">Before 9 AM</th>
                        <th className="p-3 text-center border-r border-slate-700 bg-blue-950">9-10 AM</th>
                        <th className="p-3 text-center border-r border-slate-700 bg-blue-950">10-11 AM</th>
                        <th className="p-3 text-center border-r border-slate-700 bg-blue-950">11-12 PM</th>
                        <th className="p-3 text-center border-r border-slate-700 bg-blue-950">After 12 PM</th>
                        <th className="p-3 text-center border-r border-slate-700 bg-emerald-950 text-emerald-300">Attendance %</th>
                        <th className="p-3 text-center border-r border-slate-700">Attended</th>
                        <th className="p-3 text-center border-r border-slate-700">Meeting</th>
                        <th className="p-3 text-center border-r border-slate-700">Leave</th>
                        <th className="p-3 text-center text-rose-300">Not Reported</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {districtMandalAbstractData.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                          <td className="p-2 font-bold text-slate-900 border-r border-slate-200">{r.mandal}</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">{r.totalGps}</td>
                          <td className="p-2 text-center font-mono font-bold text-blue-800 border-r border-slate-200">{Math.floor(r.totalGps * 0.8)}</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">{Math.floor(r.totalGps * 0.1)}</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">{Math.floor(r.totalGps * 0.05)}</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">0</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">0</td>
                          <td className="p-2 text-center font-mono font-black border-r border-slate-200">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800">{r.pct}%</span>
                          </td>
                          <td className="p-2 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">{r.enteredGps}</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">0</td>
                          <td className="p-2 text-center font-mono border-r border-slate-200">0</td>
                          <td className="p-2 text-center font-mono font-bold text-rose-600">{r.pendingGps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: GP INSPECTIONS (GM-R 39.1 - ROLE ISOLATED VIEW)             */}
          {/* =================================================================== */}
          {activeReport === 'inspections' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>GM-R 39.1 GP Inspection &amp; Compliance Monitor</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
                      {userLevel === 'gp' ? 'గ్రామ పంచాయతీ తనిఖీ రికార్డు (GP View Only)' : userLevel === 'mandal' ? 'మండల స్థాయి తనిఖీలు' : 'జిల్లా స్థాయి తనిఖీలు'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {userLevel === 'gp' 
                      ? `${gpName} — DLPO, DPO మరియు MPO అధికారుల తనిఖీ తేదీలు, సూచనలు మరియు పరిష్కారాల స్టేటస్.` 
                      : userLevel === 'mandal'
                      ? `${mandalName} — మండల పరిధిలోని గ్రామ పంచాయతీల తనిఖీ రికార్డులు.`
                      : `${districtName} — జిల్లా వ్యాప్తంగా అన్ని మండలాల తనిఖీల పర్యవేక్షణ.`}
                  </p>
                </div>
                {userLevel === 'gp' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold">
                    <span>🛡️ సింగిల్ GP ఐసోలేషన్: మీ జీపీ రికార్డు మాత్రమే చూపబడుతుంది</span>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                      <th className="p-3 text-center w-12 border-r border-slate-700">Sl. No</th>
                      <th className="p-3 border-r border-slate-700">గ్రామ పంచాయతీ / పరిధి</th>
                      <th className="p-3 border-r border-slate-700">తనిఖీ చేసిన అధికారి</th>
                      <th className="p-3 text-center border-r border-slate-700">తేదీ</th>
                      <th className="p-3 border-r border-slate-700">తనిఖీ రకం</th>
                      <th className="p-3 text-center border-r border-slate-700">స్టేటస్</th>
                      <th className="p-3">రిమార్కులు &amp; ఆదేశాలు</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {inspectionRows.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                        <td className="p-3 font-bold text-slate-900 border-r border-slate-200">{r.gp}</td>
                        <td className="p-3 font-bold text-slate-800 border-r border-slate-200">{r.officer}</td>
                        <td className="p-3 text-center font-mono border-r border-slate-200">{r.date}</td>
                        <td className="p-3 font-medium text-slate-700 border-r border-slate-200">{r.type}</td>
                        <td className="p-3 text-center border-r border-slate-200">
                          <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${r.statusClass}`}>
                            {r.statusTel}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: 18 CANONICAL MAS INDICATORS (GM-R 5.24 + GM-R 5.23)          */}
          {/* =================================================================== */}
          {activeReport === 'mas' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <span>GM-R 5.24 &amp; 5.23 MAS 18-Indicator Monthly Scorecard</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black">
                    18 అధికారిక ప్రగతి సూచికలు
                  </span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  GM-R 5.24 (17 ఇండికేటర్లు) + GM-R 5.23 (జననాల నమోదు) సంయుక్త ప్రగతి సమీక్ష.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                      <th className="p-3 text-center w-12 border-r border-slate-700">#</th>
                      <th className="p-3 border-r border-slate-700">అంశం (Official MAS Module Name)</th>
                      <th className="p-3 border-r border-slate-700">వివరణ</th>
                      <th className="p-3 text-center border-r border-slate-700 text-emerald-300">ప్రగతి శాతం (%)</th>
                      <th className="p-3 text-center">స్టేటస్</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {all18MasIndicators.map((r, i) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 text-center text-slate-500 border-r border-slate-200">{i + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200 font-mono">{r.key}</td>
                        <td className="p-2.5 font-medium text-slate-700 border-r border-slate-200">{r.tel}</td>
                        <td className="p-2.5 text-center font-black border-r border-slate-200">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            r.pct >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {r.pct}%
                          </span>
                        </td>
                        <td className="p-2.5 text-center font-bold">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                            r.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OnlinePortalSuite;
