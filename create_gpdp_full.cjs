const fs = require('fs');

const code = `import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  CheckCircle2, AlertCircle, Upload, Download, ArrowRight, ArrowLeft, 
  FileSpreadsheet, FileDown, Activity, ClipboardList, Plus, Trash2, 
  MapPin, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces
interface MasterActivity {
  theme: string;
  activityName: string;
  type: 'Tied' | 'Untied';
}

interface Allocation {
  id: string;
  fundType: 'Own Fund' | 'SFC' | 'Untied' | 'Tied';
  subType: string;
  theme: string;
  activity: string;
  type: 'Tied' | 'Untied';
  amount: number;
}

const THEMES_ALL = [
  "T1 - Poverty Free and Enhanced Livelihoods",
  "T2 - Healthy Village",
  "T3 - Child Friendly Village",
  "T4 - Water Sufficient Village",
  "T5 - Clean and Green Village",
  "T6 - Self-sufficient Infrastructure",
  "T7 - Socially Just and Socially Secure Village",
  "T8 - Village with Good Governance",
  "T9 - Women Friendly Village",
  "T10 - Forest Rights Act",
  "T11 - PESA Theme"
];

// Fallback data in case Excel is not uploaded
const DEFAULT_ACTIVITIES: MasterActivity[] = [
  { theme: "T4 - Water Sufficient Village", activityName: "తాగునీటి పైపులైన్ మరమ్మత్తు (Drinking Water Pipeline)", type: "Tied" },
  { theme: "T4 - Water Sufficient Village", activityName: "కొత్త బోర్ వేయడం (New Borewell)", type: "Tied" },
  { theme: "T4 - Water Sufficient Village", activityName: "వాటర్ ట్యాంక్ క్లీనింగ్ (Water Tank Cleaning)", type: "Untied" },
  { theme: "T5 - Clean and Green Village", activityName: "చెత్త సేకరణ వాహనం కొనుగోలు (Solid Waste Vehicle)", type: "Tied" },
  { theme: "T5 - Clean and Green Village", activityName: "మురుగు కాలువల నిర్మాణం (Drainage Construction)", type: "Tied" },
  { theme: "T5 - Clean and Green Village", activityName: "మొక్కలు నాటడం (Plantation)", type: "Untied" },
  { theme: "T1 - Poverty Free and Enhanced Livelihoods", activityName: "స్కిల్ డెవలప్మెంట్ ట్రైనింగ్ (Skill Training)", type: "Untied" },
  { theme: "T2 - Healthy Village", activityName: "ఆరోగ్య శిబిరం (Health Camp)", type: "Untied" },
  { theme: "T3 - Child Friendly Village", activityName: "అంగన్వాడీ భవన మరమ్మత్తు (Anganwadi Repair)", type: "Untied" },
  { theme: "T6 - Self-sufficient Infrastructure", activityName: "సిమెంట్ రోడ్డు నిర్మాణం (CC Road Construction)", type: "Untied" },
  { theme: "T6 - Self-sufficient Infrastructure", activityName: "రోడ్డు మరమ్మత్తు మరియు నిర్వహణ (Road Maintenance)", type: "Untied" },
  { theme: "T7 - Socially Just and Socially Secure Village", activityName: "సామాజిక భద్రత ప్రచారం (Social Security Awareness)", type: "Untied" },
  { theme: "T8 - Village with Good Governance", activityName: "పంచాయతీ భవన రంగులు (Panchayat Building Painting)", type: "Untied" },
  { theme: "T9 - Women Friendly Village", activityName: "మహిళా సంఘం షెడ్ (Women SHG Shed)", type: "Untied" }
];

export function GPDPPlanningTool({ addToast }: { addToast: (s: string) => void }) {
  const [step, setStep] = useState(0);
  const [masterData, setMasterData] = useState<MasterActivity[]>(DEFAULT_ACTIVITIES);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [gpDetails, setGpDetails] = useState({ gpName: '', mandal: '', district: '' });
  const [isPilot, setIsPilot] = useState<boolean | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedSankalpThemes, setSelectedSankalpThemes] = useState<string[]>([]);
  
  const [funds, setFunds] = useState({
    ownFund: '', sfc: '', untied: '', tied: ''
  });
  
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  // Derived Funds
  const ownFundAmt = Number(funds.ownFund) || 0;
  const sfcAmt = Number(funds.sfc) || 0;
  const untiedAmt = Number(funds.untied) || 0;
  const tiedAmt = Number(funds.tied) || 0;

  const limits = useMemo(() => ({
    ownSankalp: ownFundAmt * 0.3,
    ownOther: ownFundAmt * 0.7,
    sfcSankalp: sfcAmt * 0.3,
    sfcOther: sfcAmt * 0.7,
    untiedSankalp: untiedAmt * 0.3,
    untiedRoad: untiedAmt * 0.2,
    untiedFlexible: untiedAmt * 0.5,
    tiedWater: tiedAmt * 0.5,
    tiedSanitation: tiedAmt * 0.5
  }), [ownFundAmt, sfcAmt, untiedAmt, tiedAmt]);

  const calcAllocated = (fundType: string, subType: string) => {
    return allocations.filter(a => a.fundType === fundType && a.subType === subType)
      .reduce((sum, a) => sum + a.amount, 0);
  };

  const currentStatus = useMemo(() => {
    return {
      ownSankalp: calcAllocated('Own Fund', 'Sankalp'),
      ownOther: calcAllocated('Own Fund', 'Other'),
      sfcSankalp: calcAllocated('SFC', 'Sankalp'),
      sfcOther: calcAllocated('SFC', 'Other'),
      untiedSankalp: calcAllocated('Untied', 'Sankalp'),
      untiedRoad: calcAllocated('Untied', 'Road Maintenance'),
      untiedFlexible: calcAllocated('Untied', 'Flexible'),
      tiedWater: calcAllocated('Tied', 'Drinking Water'),
      tiedSanitation: calcAllocated('Tied', 'Sanitation'),
    };
  }, [allocations]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];
        
        const parsed: MasterActivity[] = data.map(row => ({
          theme: row['Theme'] || row['థీమ్'] || 'Unknown Theme',
          activityName: row['Activity'] || row['Work'] || row['పని'] || 'Unknown Activity',
          type: (row['Type'] || row['Tied/Untied'] || row['రకం'] || 'Untied').toString().includes('Tied') ? 'Tied' : 'Untied'
        }));
        
        if (parsed.length > 0) {
          setMasterData(parsed);
          setIsDataLoaded(true);
          addToast("Excel Data Loaded Successfully");
        } else {
          addToast("No valid data found in Excel");
        }
      } catch (err) {
        addToast("Error parsing Excel file");
      }
    };
    reader.readAsBinaryString(file);
  };

  const STEPS = [
    { id: 'start', label: 'ప్రారంభం' },
    { id: 'gp_details', label: 'వివరాలు' },
    { id: 'pilot', label: 'థీమ్స్' },
    { id: 'sankalp', label: 'సంకల్ప్' },
    { id: 'funds', label: 'నిధులు' },
    { id: 'tied_alloc', label: 'టైడ్ కేటాయింపు' },
    { id: 'own_alloc', label: 'స్వంత కేటాయింపు' },
    { id: 'sfc_alloc', label: 'SFC కేటాయింపు' },
    { id: 'untied_alloc', label: 'అన్టైడ్ కేటాయింపు' },
    { id: 'review', label: 'సమీక్ష & డౌన్లోడ్' }
  ];

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setStep(s => Math.max(s - 1, 0));

  const validateStep = () => {
    if (step === 1) {
      if (!gpDetails.gpName || !gpDetails.mandal || !gpDetails.district) {
        addToast("దయచేసి గ్రామ పంచాయతీ, మండలం, జిల్లా వివరాలను పూర్తి చేయండి.");
        return false;
      }
    }
    if (step === 2) {
      if (isPilot === null) {
        addToast("దయచేసి పైలట్ GP అవునా కాదా ఎంచుకోండి.");
        return false;
      }
    }
    if (step === 3) {
      if (selectedSankalpThemes.length < 1 || selectedSankalpThemes.length > 2) {
        addToast("సంకల్ప్ కోసం కనీసం 1, గరిష్టంగా 2 థీమ్స్ మాత్రమే ఎంచుకోవాలి.");
        return false;
      }
    }
    if (step === 4) {
      if (!funds.ownFund && !funds.sfc && !funds.untied && !funds.tied) {
        addToast("కనీసం ఒక ఫండ్ వివరాలు నమోదు చేయండి.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) goNext();
  };

  const addAllocation = (fundType: any, subType: string, theme: string, activity: string, type: 'Tied'|'Untied', amountStr: string) => {
    const amt = Number(amountStr);
    if (!amt || amt <= 0) {
      addToast("సరైన మొత్తాన్ని నమోదు చేయండి."); return;
    }
    if (!theme || !activity) {
      addToast("థీమ్ మరియు పనిని ఎంచుకోండి."); return;
    }
    
    // Limits check
    let currentAllocated = calcAllocated(fundType, subType);
    let allowedLimit = 0;
    if (fundType === 'Own Fund' && subType === 'Sankalp') allowedLimit = limits.ownSankalp;
    if (fundType === 'Own Fund' && subType === 'Other') allowedLimit = limits.ownOther;
    if (fundType === 'SFC' && subType === 'Sankalp') allowedLimit = limits.sfcSankalp;
    if (fundType === 'SFC' && subType === 'Other') allowedLimit = limits.sfcOther;
    if (fundType === 'Untied' && subType === 'Sankalp') allowedLimit = limits.untiedSankalp;
    if (fundType === 'Untied' && subType === 'Road Maintenance') allowedLimit = limits.untiedRoad;
    if (fundType === 'Untied' && subType === 'Flexible') allowedLimit = limits.untiedFlexible;
    if (fundType === 'Tied' && subType === 'Drinking Water') allowedLimit = limits.tiedWater;
    if (fundType === 'Tied' && subType === 'Sanitation') allowedLimit = limits.tiedSanitation;

    if (currentAllocated + amt > allowedLimit) {
      addToast("అందుబాటులో ఉన్న మొత్తానికి మించి కేటాయించలేరు.");
      return;
    }

    setAllocations([...allocations, {
      id: Math.random().toString(),
      fundType, subType, theme, activity, type, amount: amt
    }]);
  };

  const removeAllocation = (id: string) => {
    setAllocations(allocations.filter(a => a.id !== id));
  };

  const renderAllocationForm = (fundType: any, subType: string, allowedThemes: string[], allowedTypes: ('Tied'|'Untied')[], maxAmount: number, currentAlloc: number, extraFilter?: (a: MasterActivity) => boolean) => {
    const [selTheme, setSelTheme] = useState('');
    const [selAct, setSelAct] = useState('');
    const [amt, setAmt] = useState('');

    const availableActivities = masterData.filter(a => {
      if (allowedThemes.length > 0 && !allowedThemes.includes(a.theme)) return false;
      if (!allowedTypes.includes(a.type)) return false;
      if (selTheme && a.theme !== selTheme) return false;
      if (extraFilter && !extraFilter(a)) return false;
      return true;
    });

    const uniqueThemes = Array.from(new Set(availableActivities.map(a => a.theme)));

    return (
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800">{subType} (అందుబాటులో: ₹{(maxAmount - currentAlloc).toLocaleString('en-IN')})</h4>
          <span className="text-xs font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">మొత్తం: ₹{maxAmount.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select className="p-3 rounded-xl border border-slate-300 font-semibold text-sm" value={selTheme} onChange={e => {setSelTheme(e.target.value); setSelAct('');}}>
            <option value="">థీమ్ ఎంచుకోండి</option>
            {uniqueThemes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <select className="p-3 rounded-xl border border-slate-300 font-semibold text-sm col-span-1 md:col-span-2" value={selAct} onChange={e => setSelAct(e.target.value)}>
            <option value="">పనిని ఎంచుకోండి</option>
            {availableActivities.filter(a => !selTheme || a.theme === selTheme).map(a => (
              <option key={a.activityName} value={a.activityName}>{a.activityName} ({a.type})</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input type="number" placeholder="₹" className="w-full p-3 rounded-xl border border-slate-300 font-semibold text-sm" value={amt} onChange={e => setAmt(e.target.value)} />
            <button 
              onClick={() => {
                const actType = availableActivities.find(a => a.activityName === selAct)?.type || 'Untied';
                addAllocation(fundType, subType, selTheme || availableActivities.find(a => a.activityName === selAct)?.theme || '', selAct, actType as 'Tied'|'Untied', amt);
                setSelAct(''); setAmt('');
              }}
              className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {allocations.filter(a => a.fundType === fundType && a.subType === subType).map(a => (
            <div key={a.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-sm">
              <div className="truncate flex-1"><span className="text-xs text-slate-400 block">{a.theme}</span><span className="font-bold text-slate-700">{a.activity}</span> <span className="text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-500">{a.type}</span></div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-800">₹{a.amount.toLocaleString('en-IN')}</span>
                <button onClick={() => removeAllocation(a.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: Details
    const wsDetails = XLSX.utils.json_to_sheet([
      { Field: "గ్రామ పంచాయతీ (GP)", Value: gpDetails.gpName },
      { Field: "మండలం (Mandal)", Value: gpDetails.mandal },
      { Field: "జిల్లా (District)", Value: gpDetails.district },
      { Field: "పైలట్ GP (Pilot GP)", Value: isPilot ? "అవును (Yes)" : "కాదు (No)" },
    ]);
    XLSX.utils.book_append_sheet(wb, wsDetails, "GP Details");

    // Allocations
    const allocData = allocations.map(a => ({
      "Fund Type": a.fundType,
      "Sub Type": a.subType,
      "Theme": a.theme,
      "Activity": a.activity,
      "Tied/Untied": a.type,
      "Amount": a.amount
    }));
    const wsAlloc = XLSX.utils.json_to_sheet(allocData);
    XLSX.utils.book_append_sheet(wb, wsAlloc, "Allocations");

    XLSX.writeFile(wb, "GPDP_Plan_Budget.xlsx");
    addToast("Excel Downloaded Successfully!");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("GPDP Planning & Budget Allocation Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(\`GP Name: \${gpDetails.gpName}\`, 14, 30);
    doc.text(\`Mandal: \${gpDetails.mandal}\`, 14, 38);
    doc.text(\`District: \${gpDetails.district}\`, 14, 46);
    
    (doc as any).autoTable({
      startY: 55,
      head: [['Fund Type', 'Sub Type', 'Theme', 'Activity', 'Type', 'Amount']],
      body: allocations.map(a => [a.fundType, a.subType, a.theme, a.activity, a.type, a.amount.toLocaleString('en-IN')]),
    });
    
    doc.save("GPDP_Report.pdf");
    addToast("PDF Downloaded Successfully!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center justify-center sm:justify-start gap-2">
            <ClipboardList className="text-blue-600" />
            గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP)
          </h2>
          <p className="text-slate-500 font-bold text-sm mt-1">
            Planning & Budget Allocation Tool
          </p>
        </div>
        <div className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
          దశ (Step) {step + 1} / {STEPS.length}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100 min-h-[500px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Step 0: Start & Upload */}
            {step === 0 && (
              <div className="text-center space-y-8 py-10">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <ClipboardList size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">స్వాగతం (Welcome)</h3>
                  <p className="text-slate-500 font-semibold max-w-lg mx-auto">
                    ఈ టూల్ ద్వారా మీరు గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP) మరియు బడ్జెట్ కేటాయింపును సులభంగా పూర్తి చేయవచ్చు.
                  </p>
                </div>
                
                <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
                  <Upload className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-bold text-slate-600 mb-4">Master Excel ఫైల్ ఉంటే అప్‌లోడ్ చేయండి (లేదా డీఫాల్ట్ డేటాతో కొనసాగండి)</p>
                  <input type="file" accept=".xlsx" onChange={handleFileUpload} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  {isDataLoaded && <p className="text-green-600 text-xs font-bold mt-2 flex items-center justify-center gap-1"><CheckCircle2 size={14}/> డేటా లోడ్ చేయబడింది</p>}
                </div>
                
                <button onClick={handleNext} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                  ప్రారంభించండి
                </button>
              </div>
            )}

            {/* Step 1: GP Details */}
            {step === 1 && (
              <div className="max-w-xl mx-auto space-y-6 py-6">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2"><MapPin className="text-blue-500"/> గ్రామ పంచాయతీ వివరాలు</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-slate-600 mb-1 block">గ్రామ పంచాయతీ పేరు *</label>
                    <input type="text" className="w-full p-4 rounded-xl border border-slate-200 font-bold focus:border-blue-500 outline-none" value={gpDetails.gpName} onChange={e => setGpDetails({...gpDetails, gpName: e.target.value})} placeholder="GP Name" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 mb-1 block">మండలం పేరు *</label>
                    <input type="text" className="w-full p-4 rounded-xl border border-slate-200 font-bold focus:border-blue-500 outline-none" value={gpDetails.mandal} onChange={e => setGpDetails({...gpDetails, mandal: e.target.value})} placeholder="Mandal Name" />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-600 mb-1 block">జిల్లా పేరు *</label>
                    <input type="text" className="w-full p-4 rounded-xl border border-slate-200 font-bold focus:border-blue-500 outline-none" value={gpDetails.district} onChange={e => setGpDetails({...gpDetails, district: e.target.value})} placeholder="District Name" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pilot GP */}
            {step === 2 && (
              <div className="max-w-xl mx-auto space-y-8 py-6 text-center">
                <h3 className="text-2xl font-black text-slate-800">ఇది పైలట్ GPనా? (Is this a Pilot GP?)</h3>
                <div className="flex justify-center gap-4">
                  <button onClick={() => {setIsPilot(true); setSelectedThemes(THEMES_ALL);}} className={\`flex-1 py-6 rounded-2xl border-2 font-black text-lg transition-all \${isPilot === true ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}\`}>
                    అవును (Yes)<br/><span className="text-sm font-bold opacity-70">11 Themes Applicable</span>
                  </button>
                  <button onClick={() => {setIsPilot(false); setSelectedThemes(THEMES_ALL.slice(0, 9));}} className={\`flex-1 py-6 rounded-2xl border-2 font-black text-lg transition-all \${isPilot === false ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}\`}>
                    కాదు (No)<br/><span className="text-sm font-bold opacity-70">9 Themes Applicable</span>
                  </button>
                </div>
                {isPilot !== null && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold text-sm text-left">
                    <CheckCircle2 size={18} className="inline mr-2 mb-0.5" />
                    అందుబాటులో ఉన్న థీమ్స్ అప్‌డేట్ చేయబడ్డాయి.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Sankalp */}
            {step === 3 && (
              <div className="space-y-6 py-6">
                <h3 className="text-2xl font-black text-slate-800">సంకల్ప్ థీమ్స్ (Sankalp Themes)</h3>
                <p className="text-slate-500 font-bold text-sm">దయచేసి సంకల్ప్ కోసం గరిష్టంగా 2 థీమ్స్ మాత్రమే ఎంచుకోండి.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
                  {selectedThemes.map(t => {
                    const isSelected = selectedSankalpThemes.includes(t);
                    return (
                      <button 
                        key={t}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSankalpThemes(selectedSankalpThemes.filter(st => st !== t));
                          } else {
                            if (selectedSankalpThemes.length >= 2) {
                              addToast("సంకల్ప్ కోసం గరిష్టంగా 2 థీమ్స్ మాత్రమే ఎంచుకోవచ్చు.");
                            } else {
                              setSelectedSankalpThemes([...selectedSankalpThemes, t]);
                            }
                          }
                        }}
                        className={\`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 \${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}\`}
                      >
                        {isSelected ? <CheckSquare className="text-blue-600 shrink-0 mt-0.5" /> : <Square className="text-slate-400 shrink-0 mt-0.5" />}
                        <span className={\`font-bold text-sm \${isSelected ? 'text-blue-900' : 'text-slate-700'}\`}>{t}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Funds Entry */}
            {step === 4 && (
              <div className="max-w-2xl mx-auto space-y-6 py-6">
                <h3 className="text-2xl font-black text-slate-800">నిధుల వివరాలు (Fund Entry)</h3>
                <div className="space-y-4">
                  {[
                    { key: 'ownFund', label: 'స్వంత నిధులు (Own Fund)' },
                    { key: 'sfc', label: 'SFC' },
                    { key: 'untied', label: 'అన్టైడ్ ఫండ్ (Untied Fund)' },
                    { key: 'tied', label: 'టైడ్ ఫండ్ (Tied Fund)' }
                  ].map(f => (
                    <div key={f.key} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <label className="w-1/2 font-black text-slate-700">{f.label}</label>
                      <div className="w-1/2 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                        <input 
                          type="number" 
                          className="w-full p-3 pl-8 rounded-xl border border-slate-300 font-black focus:border-blue-500 outline-none text-lg" 
                          value={(funds as any)[f.key]} 
                          onChange={e => setFunds({...funds, [f.key]: e.target.value})} 
                          placeholder="0" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Tied Alloc */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800">టైడ్ నిధుల కేటాయింపు (Tied Allocation)</h3>
                <div className="flex gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl font-bold text-sm">
                  <div className="flex-1">మొత్తం: ₹{tiedAmt.toLocaleString('en-IN')}</div>
                  <div className="flex-1">తాగునీరు (50%): ₹{limits.tiedWater.toLocaleString('en-IN')}</div>
                  <div className="flex-1">పారిశుధ్యం (50%): ₹{limits.tiedSanitation.toLocaleString('en-IN')}</div>
                </div>
                
                {renderAllocationForm('Tied', 'Drinking Water', ['T4 - Water Sufficient Village'], ['Tied'], limits.tiedWater, currentStatus.tiedWater)}
                {renderAllocationForm('Tied', 'Sanitation', ['T5 - Clean and Green Village'], ['Tied'], limits.tiedSanitation, currentStatus.tiedSanitation)}
              </div>
            )}

            {/* Step 6: Own Fund Alloc */}
            {step === 6 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800">స్వంత నిధుల కేటాయింపు (Own Fund Allocation)</h3>
                <div className="flex gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl font-bold text-sm">
                  <div className="flex-1">మొత్తం: ₹{ownFundAmt.toLocaleString('en-IN')}</div>
                  <div className="flex-1">సంకల్ప్ (30%): ₹{limits.ownSankalp.toLocaleString('en-IN')}</div>
                  <div className="flex-1">ఇతర అన్టైడ్ పనులు (70%): ₹{limits.ownOther.toLocaleString('en-IN')}</div>
                </div>
                
                {renderAllocationForm('Own Fund', 'Sankalp', selectedSankalpThemes, ['Untied'], limits.ownSankalp, currentStatus.ownSankalp)}
                {renderAllocationForm('Own Fund', 'Other', selectedThemes, ['Untied'], limits.ownOther, currentStatus.ownOther)}
              </div>
            )}

            {/* Step 7: SFC Alloc */}
            {step === 7 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800">SFC కేటాయింపు (SFC Allocation)</h3>
                <div className="flex gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl font-bold text-sm">
                  <div className="flex-1">మొత్తం: ₹{sfcAmt.toLocaleString('en-IN')}</div>
                  <div className="flex-1">సంకల్ప్ (30%): ₹{limits.sfcSankalp.toLocaleString('en-IN')}</div>
                  <div className="flex-1">ఇతర అన్టైడ్ పనులు (70%): ₹{limits.sfcOther.toLocaleString('en-IN')}</div>
                </div>
                
                {renderAllocationForm('SFC', 'Sankalp', selectedSankalpThemes, ['Untied'], limits.sfcSankalp, currentStatus.sfcSankalp)}
                {renderAllocationForm('SFC', 'Other', selectedThemes, ['Untied'], limits.sfcOther, currentStatus.sfcOther)}
              </div>
            )}

            {/* Step 8: Untied Alloc */}
            {step === 8 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-800">అన్టైడ్ నిధుల కేటాయింపు (Untied Allocation)</h3>
                <div className="flex gap-4 p-4 bg-blue-50 text-blue-800 rounded-xl font-bold text-sm flex-wrap">
                  <div className="w-full sm:w-auto">మొత్తం: ₹{untiedAmt.toLocaleString('en-IN')}</div>
                  <div className="w-full sm:w-auto">సంకల్ప్ (30%): ₹{limits.untiedSankalp.toLocaleString('en-IN')}</div>
                  <div className="w-full sm:w-auto">రోడ్డు నిర్వహణ (20%): ₹{limits.untiedRoad.toLocaleString('en-IN')}</div>
                  <div className="w-full sm:w-auto">ఇష్టానుసారం (50%): ₹{limits.untiedFlexible.toLocaleString('en-IN')}</div>
                </div>
                
                {renderAllocationForm('Untied', 'Sankalp', selectedSankalpThemes, ['Untied'], limits.untiedSankalp, currentStatus.untiedSankalp)}
                
                {/* Road Maintenance - extra filter to only allow road works */}
                {renderAllocationForm('Untied', 'Road Maintenance', selectedThemes, ['Untied'], limits.untiedRoad, currentStatus.untiedRoad, 
                  (a) => a.activityName.toLowerCase().includes('road') || a.activityName.includes('రోడ్డు') || a.activityName.includes('maintenance') || a.activityName.includes('మరమ్మత్తు')
                )}
                
                {renderAllocationForm('Untied', 'Flexible', selectedThemes, ['Untied'], limits.untiedFlexible, currentStatus.untiedFlexible)}
              </div>
            )}

            {/* Step 9: Review & Download */}
            {step === 9 && (
              <div className="space-y-8 py-6">
                <div className="text-center">
                  <h3 className="text-3xl font-black text-slate-800 mb-2">తుది సమీక్ష (Final Review)</h3>
                  <p className="text-slate-500 font-bold text-sm">కేటాయింపులను సరిచూసుకుని రిపోర్ట్ డౌన్లోడ్ చేసుకోండి.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-3 border-b pb-2">గ్రామ పంచాయతీ (GP Details)</h4>
                    <p className="text-sm font-bold text-slate-600">పేరు: <span className="text-slate-900">{gpDetails.gpName}</span></p>
                    <p className="text-sm font-bold text-slate-600">మండలం: <span className="text-slate-900">{gpDetails.mandal}</span></p>
                    <p className="text-sm font-bold text-slate-600">జిల్లా: <span className="text-slate-900">{gpDetails.district}</span></p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-3 border-b pb-2">సంకల్ప్ థీమ్స్ (Sankalp Themes)</h4>
                    <ul className="list-disc pl-4 text-sm font-bold text-slate-700">
                      {selectedSankalpThemes.map(t => <li key={t}>{t}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-black text-blue-900 mb-4 text-lg">నిధుల సారాంశం (Fund Summary)</h4>
                  <div className="space-y-4">
                    {/* Own Fund */}
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                      <span className="font-bold text-slate-700">స్వంత నిధులు (Own Fund)</span>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold">Total: ₹{ownFundAmt.toLocaleString('en-IN')}</div>
                        <div className="text-sm font-black text-blue-700">Allocated: ₹{(currentStatus.ownSankalp + currentStatus.ownOther).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    {/* SFC */}
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                      <span className="font-bold text-slate-700">SFC</span>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold">Total: ₹{sfcAmt.toLocaleString('en-IN')}</div>
                        <div className="text-sm font-black text-blue-700">Allocated: ₹{(currentStatus.sfcSankalp + currentStatus.sfcOther).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    {/* Untied */}
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                      <span className="font-bold text-slate-700">అన్టైడ్ నిధులు (Untied Fund)</span>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold">Total: ₹{untiedAmt.toLocaleString('en-IN')}</div>
                        <div className="text-sm font-black text-blue-700">Allocated: ₹{(currentStatus.untiedSankalp + currentStatus.untiedRoad + currentStatus.untiedFlexible).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                    {/* Tied */}
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-blue-100">
                      <span className="font-bold text-slate-700">టైడ్ నిధులు (Tied Fund)</span>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold">Total: ₹{tiedAmt.toLocaleString('en-IN')}</div>
                        <div className="text-sm font-black text-blue-700">Allocated: ₹{(currentStatus.tiedWater + currentStatus.tiedSanitation).toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button onClick={exportExcel} className="flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 active:scale-95">
                    <FileSpreadsheet size={20} /> ఎక్సెల్ డౌన్లోడ్ చేయండి (Excel)
                  </button>
                  <button onClick={exportPDF} className="flex items-center justify-center gap-2 bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95">
                    <FileDown size={20} /> PDF డౌన్లోడ్ చేయండి (PDF)
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {step > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center border-t border-slate-100 bg-white/80 backdrop-blur-sm rounded-b-3xl">
            <button 
              onClick={goPrev} 
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={18} /> వెనుకకు (Back)
            </button>
            {step < STEPS.length - 1 && (
              <button 
                onClick={handleNext} 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
              >
                తదుపరి (Next) <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/GPDPPlanningTool.tsx', code);
console.log('Done!');
