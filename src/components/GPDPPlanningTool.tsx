import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { 
  CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, 
  FileSpreadsheet, FileDown, ClipboardList, Plus, Trash2, 
  MapPin, Sparkles, Filter, Search, Check, ListChecks, Info, Lock, CheckCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GPDP_THEMES, 
  GPDP_MASTER_ACTIVITIES, 
  GPDPActivityItem 
} from '../data/gpdpMasterData';

// Interfaces
export interface Allocation {
  id: string;
  fundType: 'Own Fund' | 'SFC' | 'Untied' | 'Tied';
  subType: string;
  theme: string;
  activity: string;
  type: 'Tied' | 'Untied';
  focusArea?: string;
  amount: number;
}

// Interactive Table for each Sankalp Theme
interface SankalpThemeTableProps {
  themeName: string;
  themeCode: string;
  masterData: GPDPActivityItem[];
  allocations: Allocation[];
  onAdd: (fundType: 'Own Fund' | 'SFC' | 'Untied', theme: string, activity: string, type: 'Tied' | 'Untied', focusArea: string, amount: number) => void;
  onRemove: (id: string) => void;
  remainingFunds: {
    ownFund: number;
    sfc: number;
    untied: number;
  };
}

function SankalpThemeTable({
  themeName,
  themeCode,
  masterData,
  allocations,
  onAdd,
  onRemove,
  remainingFunds
}: SankalpThemeTableProps) {
  const [search, setSearch] = useState('');
  // Local state for row inputs: activityId -> { fundType, amount }
  const [rowInputs, setRowInputs] = useState<{ [actId: string]: { fundType: 'Own Fund' | 'SFC' | 'Untied'; amount: string } }>({});

  // Theme master activities: Strictly UNTIED ONLY for Sankalp Themes!
  const themeActivities = useMemo(() => {
    return masterData.filter(a => 
      a.type === 'Untied' && (
        a.themeName.toLowerCase().includes(themeName.toLowerCase()) ||
        themeName.toLowerCase().includes(`theme ${a.themeNumber}`) ||
        themeName.toLowerCase().includes(`t${a.themeNumber}`)
      )
    );
  }, [masterData, themeName]);

  const totalThemeActivities = themeActivities.length;
  // 1/4th Rule with Ceil rounding (e.g., 45 / 4 = 11.25 -> 12)
  const maxQuota = Math.ceil(totalThemeActivities / 4);

  // Filtered by search
  const displayedActivities = useMemo(() => {
    if (!search.trim()) return themeActivities;
    const q = search.toLowerCase();
    return themeActivities.filter(a => 
      a.activityName.toLowerCase().includes(q) || 
      a.focusArea.toLowerCase().includes(q) ||
      a.masterCode.toLowerCase().includes(q)
    );
  }, [themeActivities, search]);

  // Current allocated count for this theme in Sankalp
  const allocatedFromThisTheme = useMemo(() => {
    return allocations.filter(a => 
      a.subType === 'Sankalp' && 
      (a.theme.toLowerCase().includes(themeName.toLowerCase()) || themeName.toLowerCase().includes(a.theme.toLowerCase()))
    );
  }, [allocations, themeName]);

  const isQuotaReached = allocatedFromThisTheme.length >= maxQuota;
  const allFundsExhausted = remainingFunds.ownFund <= 0 && remainingFunds.sfc <= 0 && remainingFunds.untied <= 0;

  // Default first available fund with balance
  const defaultAvailableFund: 'Own Fund' | 'SFC' | 'Untied' = useMemo(() => {
    if (remainingFunds.ownFund > 0) return 'Own Fund';
    if (remainingFunds.sfc > 0) return 'SFC';
    if (remainingFunds.untied > 0) return 'Untied';
    return 'Own Fund';
  }, [remainingFunds]);

  const handleRowFundChange = (actId: string, fType: 'Own Fund' | 'SFC' | 'Untied') => {
    setRowInputs(prev => ({
      ...prev,
      [actId]: {
        fundType: fType,
        amount: prev[actId]?.amount || ''
      }
    }));
  };

  const handleRowAmountChange = (actId: string, amtStr: string) => {
    setRowInputs(prev => ({
      ...prev,
      [actId]: {
        fundType: prev[actId]?.fundType || defaultAvailableFund,
        amount: amtStr
      }
    }));
  };

  const handleAllocate = (act: GPDPActivityItem) => {
    const input = rowInputs[act.id] || { fundType: defaultAvailableFund, amount: '' };
    const currentChoice = input.fundType;
    const isChoiceExhausted = (currentChoice === 'Own Fund' && remainingFunds.ownFund <= 0) ||
                             (currentChoice === 'SFC' && remainingFunds.sfc <= 0) ||
                             (currentChoice === 'Untied' && remainingFunds.untied <= 0);
    const effectiveFund = (!currentChoice || isChoiceExhausted) ? defaultAvailableFund : currentChoice;

    const amt = Math.ceil(Number(input.amount));
    if (!amt || amt <= 0) return;
    onAdd(effectiveFund, act.themeName, act.activityName, act.type, act.focusArea, amt);
    // Clear input for this row
    setRowInputs(prev => {
      const next = { ...prev };
      delete next[act.id];
      return next;
    });
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
      {/* Theme Header & 1/4th Quota Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-blue-600 text-white shadow-xs">
              {themeCode}
            </span>
            <h4 className="font-black text-slate-800 text-base sm:text-lg">{themeName}</h4>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Total Theme Activities: <span className="font-black text-slate-700">{totalThemeActivities}</span> &bull; 
            1/4th Statutory Quota Limit: <span className="font-black text-blue-700">Max {maxQuota} Activities</span>
          </p>
        </div>

        {/* Quota Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 ${
            isQuotaReached 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-white text-blue-900 border-blue-200'
          }`}>
            <span>Selected:</span>
            <span className="text-sm font-black text-blue-700">{allocatedFromThisTheme.length}</span>
            <span>/ {maxQuota}</span>
            {isQuotaReached && <CheckCircle size={14} className="text-amber-700 ml-1" />}
          </div>
        </div>
      </div>

      {/* Quota reached notification banner */}
      {isQuotaReached && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
          <Info size={16} className="text-amber-600 shrink-0" />
          <span>This Sankalp Theme has reached its maximum 1/4th activity limit ({maxQuota}/{maxQuota}). To add another activity, remove an existing one.</span>
        </div>
      )}

      {/* Search Input within Theme */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${totalThemeActivities} activities in ${themeName}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {search && (
          <button 
            type="button" 
            onClick={() => setSearch('')}
            className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1 bg-slate-200 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Direct Interactive Activities Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100/90 text-slate-700 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-12 text-center">S.No</th>
              <th className="py-2.5 px-3 min-w-[220px]">Master Activity</th>
              <th className="py-2.5 px-3 hidden md:table-cell">Focus Area</th>
              <th className="py-2.5 px-3 min-w-[150px]">Fund Source (30% Sankalp)</th>
              <th className="py-2.5 px-3 min-w-[120px]">Amount (₹)</th>
              <th className="py-2.5 px-3 w-28 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedActivities.map((act, index) => {
              const existingAlloc = allocations.find(a => a.subType === 'Sankalp' && a.activity.trim().toLowerCase() === act.activityName.trim().toLowerCase());
              const isAllocated = !!existingAlloc;
              const input = rowInputs[act.id] || { fundType: defaultAvailableFund, amount: '' };

              return (
                <tr key={act.id} className={`transition-colors ${isAllocated ? 'bg-emerald-50/50' : 'hover:bg-slate-50/70'}`}>
                  {/* S.No / Status icon */}
                  <td className="py-3 px-3 text-center font-bold text-slate-500">
                    {isAllocated ? (
                      <CheckCircle2 size={16} className="text-emerald-600 inline" />
                    ) : (
                      index + 1
                    )}
                  </td>

                  {/* Activity Name & Master Code */}
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800 text-xs leading-snug">
                      {act.activityName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1.5">
                      <span>Code: {act.masterCode}</span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">{act.type}</span>
                    </div>
                  </td>

                  {/* Focus Area */}
                  <td className="py-3 px-3 hidden md:table-cell text-slate-600 font-medium">
                    {act.focusArea || '-'}
                  </td>

                  {/* Fund Source Selection (with exhausted blocking & dynamic auto-switch) */}
                  <td className="py-3 px-3">
                    {isAllocated ? (
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 font-black text-[11px]">
                        {existingAlloc.fundType}
                      </span>
                    ) : (() => {
                      const currentChoice = input.fundType;
                      const isChoiceExhausted = (currentChoice === 'Own Fund' && remainingFunds.ownFund <= 0) ||
                                               (currentChoice === 'SFC' && remainingFunds.sfc <= 0) ||
                                               (currentChoice === 'Untied' && remainingFunds.untied <= 0);
                      const effectiveFund = (!currentChoice || isChoiceExhausted) ? defaultAvailableFund : currentChoice;

                      return (
                        <select
                          disabled={isQuotaReached || allFundsExhausted}
                          value={effectiveFund}
                          onChange={e => handleRowFundChange(act.id, e.target.value as 'Own Fund' | 'SFC' | 'Untied')}
                          className="w-full p-2 text-xs rounded-lg border border-slate-300 font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                        >
                          <option 
                            value="Own Fund" 
                            disabled={remainingFunds.ownFund <= 0}
                            className={remainingFunds.ownFund <= 0 ? 'text-slate-400 bg-slate-100' : ''}
                          >
                            Own Fund {remainingFunds.ownFund <= 0 ? '(0 / Blocked)' : `(Bal: ₹${remainingFunds.ownFund.toLocaleString('en-IN')})`}
                          </option>
                          <option 
                            value="SFC" 
                            disabled={remainingFunds.sfc <= 0}
                            className={remainingFunds.sfc <= 0 ? 'text-slate-400 bg-slate-100' : ''}
                          >
                            SFC Grant {remainingFunds.sfc <= 0 ? '(0 / Blocked)' : `(Bal: ₹${remainingFunds.sfc.toLocaleString('en-IN')})`}
                          </option>
                          <option 
                            value="Untied" 
                            disabled={remainingFunds.untied <= 0}
                            className={remainingFunds.untied <= 0 ? 'text-slate-400 bg-slate-100' : ''}
                          >
                            15th FC Untied {remainingFunds.untied <= 0 ? '(0 / Blocked)' : `(Bal: ₹${remainingFunds.untied.toLocaleString('en-IN')})`}
                          </option>
                        </select>
                      );
                    })()}
                  </td>

                  {/* Amount Input or Display */}
                  <td className="py-3 px-3">
                    {isAllocated ? (
                      <span className="font-black text-emerald-800 text-xs">
                        ₹{existingAlloc.amount.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          disabled={isQuotaReached || allFundsExhausted}
                          placeholder={allFundsExhausted ? "30% Done (₹0)" : "Amount"}
                          value={input.amount}
                          onChange={e => handleRowAmountChange(act.id, e.target.value)}
                          className="w-full pl-6 pr-2 py-2 text-xs rounded-lg border border-slate-300 font-bold text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                        />
                      </div>
                    )}
                  </td>

                  {/* Action Button */}
                  <td className="py-3 px-3 text-center">
                    {isAllocated ? (
                      <button
                        type="button"
                        onClick={() => onRemove(existingAlloc.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors font-bold text-xs"
                        title="Remove Allocation"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isQuotaReached || allFundsExhausted || !input.amount || Number(input.amount) <= 0}
                        onClick={() => handleAllocate(act)}
                        className="inline-flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg font-black text-xs hover:bg-blue-700 active:scale-95 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} /> Add
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {displayedActivities.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-400 italic">
                  No matching activities found for &ldquo;{search}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function GPDPPlanningTool({ addToast }: { addToast: (s: string) => void }) {
  const [step, setStep] = useState(0);
  const [activeAllocTab, setActiveAllocTab] = useState<'tied' | 'sankalp' | 'untied' | 'other'>('tied');
  const [masterData] = useState<GPDPActivityItem[]>(GPDP_MASTER_ACTIVITIES);
  
  const [gpDetails, setGpDetails] = useState({ gpName: '', mandal: '', district: '' });
  const [isPilot, setIsPilot] = useState<boolean>(false);
  
  // Available themes based on pilot status
  const availableThemesList = useMemo(() => {
    return isPilot ? GPDP_THEMES : GPDP_THEMES.filter(t => !t.pilotOnly);
  }, [isPilot]);

  // Selected Sankalp themes (Default to Theme 4 and Theme 5)
  const [selectedSankalpThemes, setSelectedSankalpThemes] = useState<string[]>([
    "Theme 4 - Water Sufficient Village",
    "Theme 5 - Clean and Green Village"
  ]);

  // Fund entries
  const [funds, setFunds] = useState({
    ownFund: '50000',
    sfc: '50000',
    untied: '100000',
    tied: '100000'
  });

  const [allocations, setAllocations] = useState<Allocation[]>([]);

  // Derived Funds
  const ownFundAmt = Number(funds.ownFund) || 0;
  const sfcAmt = Number(funds.sfc) || 0;
  const untiedAmt = Number(funds.untied) || 0;
  const tiedAmt = Number(funds.tied) || 0;

  // Percentage Calculations with Math.ceil (even 0.01 / 1.1 becomes +1)
  // Sankalp Themes: 30% from Own Fund, SFC, Untied
  // Tied: Flexible Total Tied Grant (No rigid 50-50 lock!)
  // Untied: 30% Sankalp, 20% Road Maintenance, 50% Flexible
  const limits = useMemo(() => ({
    ownSankalp: Math.ceil(ownFundAmt * 0.3),
    ownOther: Math.max(0, ownFundAmt - Math.ceil(ownFundAmt * 0.3)),
    sfcSankalp: Math.ceil(sfcAmt * 0.3),
    sfcOther: Math.max(0, sfcAmt - Math.ceil(sfcAmt * 0.3)),
    untiedSankalp: Math.ceil(untiedAmt * 0.3),
    untiedRoad: Math.ceil(untiedAmt * 0.2),
    untiedFlexible: Math.max(0, untiedAmt - Math.ceil(untiedAmt * 0.3) - Math.ceil(untiedAmt * 0.2)),
    tiedTotal: tiedAmt
  }), [ownFundAmt, sfcAmt, untiedAmt, tiedAmt]);

  const calcAllocated = (fundType: string, subType?: string) => {
    return allocations
      .filter(a => a.fundType === fundType && (!subType || a.subType === subType))
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
      tiedTotal: calcAllocated('Tied')
    };
  }, [allocations]);

  // Remaining Balances
  const remainingFunds = useMemo(() => ({
    sankalpOwn: Math.max(0, limits.ownSankalp - currentStatus.ownSankalp),
    sankalpSfc: Math.max(0, limits.sfcSankalp - currentStatus.sfcSankalp),
    sankalpUntied: Math.max(0, limits.untiedSankalp - currentStatus.untiedSankalp),
    ownOther: Math.max(0, limits.ownOther - currentStatus.ownOther),
    sfcOther: Math.max(0, limits.sfcOther - currentStatus.sfcOther),
    untiedRoad: Math.max(0, limits.untiedRoad - currentStatus.untiedRoad),
    untiedFlexible: Math.max(0, limits.untiedFlexible - currentStatus.untiedFlexible),
    tiedTotal: Math.max(0, limits.tiedTotal - currentStatus.tiedTotal)
  }), [limits, currentStatus]);

  // Sequential Stage Progress & Completion checks
  const isTiedCompleted = limits.tiedTotal === 0 || remainingFunds.tiedTotal === 0;
  const totalSankalpBudget = limits.ownSankalp + limits.sfcSankalp + limits.untiedSankalp;
  const totalSankalpAllocated = currentStatus.ownSankalp + currentStatus.sfcSankalp + currentStatus.untiedSankalp;
  const totalSankalpRemaining = remainingFunds.sankalpOwn + remainingFunds.sankalpSfc + remainingFunds.sankalpUntied;
  const isSankalpCompleted = totalSankalpBudget === 0 || totalSankalpRemaining === 0;

  const totalUntiedBudget = limits.untiedRoad + limits.untiedFlexible;
  const totalUntiedAllocated = currentStatus.untiedRoad + currentStatus.untiedFlexible;
  const totalUntiedRemaining = remainingFunds.untiedRoad + remainingFunds.untiedFlexible;
  const isUntiedCompleted = totalUntiedBudget === 0 || totalUntiedRemaining === 0;

  const totalOtherBudget = limits.ownOther + limits.sfcOther;
  const totalOtherAllocated = currentStatus.ownOther + currentStatus.sfcOther;
  const totalOtherRemaining = remainingFunds.ownOther + remainingFunds.sfcOther;
  const isOtherCompleted = totalOtherBudget === 0 || totalOtherRemaining === 0;

  const isAllGPDPCompleted = isTiedCompleted && isSankalpCompleted && isUntiedCompleted && isOtherCompleted;

  // Step names
  const STEPS = [
    { id: 'gp_setup', label: 'GP Setup & Themes', num: '1' },
    { id: 'funds_entry', label: 'Budget Estimates', num: '2' },
    { id: 'activity_alloc', label: 'Fund Allocations', num: '3' },
    { id: 'review_export', label: 'Review & Export', num: '4' }
  ];

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setStep(s => Math.max(s - 1, 0));

  const validateStep = () => {
    if (step === 0) {
      if (!gpDetails.gpName.trim() || !gpDetails.mandal.trim() || !gpDetails.district.trim()) {
        addToast("Please enter Gram Panchayat, Mandal, and District details.");
        return false;
      }
      if (selectedSankalpThemes.length < 1 || selectedSankalpThemes.length > 2) {
        addToast("Please select 1 or 2 Sankalp Themes.");
        return false;
      }
    }
    if (step === 1) {
      if (!funds.ownFund && !funds.sfc && !funds.untied && !funds.tied) {
        addToast("Please enter at least one fund allocation amount.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step === 1) {
        // Direct sequential start in Step 3
        if (limits.tiedTotal > 0 && remainingFunds.tiedTotal > 0) {
          setActiveAllocTab('tied');
        } else if (!isSankalpCompleted) {
          setActiveAllocTab('sankalp');
        } else {
          setActiveAllocTab('untied');
        }
      }
      goNext();
    }
  };

  // Add Sankalp allocation directly from Sankalp Theme Table
  const addSankalpAllocation = (
    fundType: 'Own Fund' | 'SFC' | 'Untied',
    theme: string,
    activity: string,
    type: 'Tied' | 'Untied',
    focusArea: string,
    amt: number
  ) => {
    // Sankalp themes only accept Untied activities
    if (type !== 'Untied') {
      addToast("Error: Only Untied activities can be allocated under Sankalp themes.");
      return;
    }

    // Check if this activity is already allocated in Sankalp
    const alreadyInSankalp = allocations.some(a => a.subType === 'Sankalp' && a.activity.trim().toLowerCase() === activity.trim().toLowerCase());
    if (alreadyInSankalp) {
      addToast("This activity is already allocated under Sankalp. Repetition is not allowed.");
      return;
    }

    // Check balance for the selected fund
    let allowedRemaining = 0;
    if (fundType === 'Own Fund') allowedRemaining = remainingFunds.sankalpOwn;
    if (fundType === 'SFC') allowedRemaining = remainingFunds.sankalpSfc;
    if (fundType === 'Untied') allowedRemaining = remainingFunds.sankalpUntied;

    if (amt > allowedRemaining) {
      addToast(`Amount exceeds available ${fundType} Sankalp balance (₹${allowedRemaining.toLocaleString('en-IN')}).`);
      return;
    }

    const newRemaining = allowedRemaining - amt;
    setAllocations(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      fundType,
      subType: 'Sankalp',
      theme,
      activity,
      type,
      focusArea,
      amount: amt
    }]);

    if (newRemaining === 0) {
      if (fundType === 'Own Fund' && remainingFunds.sankalpSfc > 0) {
        addToast(`✓ Own Fund 30% కోటా పూర్తయింది (బ్యాలెన్స్ ₹0)! తదుపరి ఫండ్ SFC Grant కి మారింది.`);
      } else if (fundType === 'SFC' && remainingFunds.sankalpUntied > 0) {
        addToast(`✓ SFC Grant 30% కోటా పూర్తయింది (బ్యాలెన్స్ ₹0)! తదుపరి ఫండ్ 15th FC Untied కి మారింది.`);
      } else if (fundType === 'Untied' || (remainingFunds.sankalpOwn <= 0 && remainingFunds.sankalpSfc <= 0)) {
        addToast(`🎉 సంకల్ప 30% నిధులు 100% పూర్తయ్యాయి (బ్యాలెన్స్ ₹0)! మెయిన్ GPDP ప్లాన్ కి వెళ్ళండి.`);
      } else {
        addToast(`${activity} added to ${fundType} under Sankalp!`);
      }
    } else {
      addToast(`${activity} added to ${fundType} under Sankalp! (Bal: ₹${newRemaining.toLocaleString('en-IN')})`);
    }
  };

  // Add General allocation (Tied, Road, Flexible, Own Other, SFC Other)
  const addGeneralAllocation = (
    fundType: 'Own Fund' | 'SFC' | 'Untied' | 'Tied',
    subType: string,
    theme: string,
    activity: string,
    type: 'Tied' | 'Untied',
    focusArea: string,
    amountStr: string
  ) => {
    const amt = Math.ceil(Number(amountStr));
    if (!amt || amt <= 0) {
      addToast("Please enter a valid amount.");
      return;
    }
    if (!activity) {
      addToast("Please select an activity.");
      return;
    }

    // Rule: Strict segregation between Tied and Untied
    if (fundType === 'Tied' && type !== 'Tied') {
      addToast("Error: Tied grant can ONLY be used for Tied activities (Theme 4 & Theme 5).");
      return;
    }
    if (fundType !== 'Tied' && type === 'Tied') {
      addToast("Error: Tied activities cannot be allocated under Untied / Own / SFC funds.");
      return;
    }

    const alreadyInSection = allocations.some(a => a.fundType === fundType && a.subType === subType && a.activity.trim().toLowerCase() === activity.trim().toLowerCase());
    if (alreadyInSection) {
      addToast("This activity is already added in this section.");
      return;
    }

    // Balance check
    let allowedRemaining = 0;
    if (fundType === 'Tied') allowedRemaining = remainingFunds.tiedTotal;
    if (fundType === 'Untied' && subType === 'Road Maintenance') allowedRemaining = remainingFunds.untiedRoad;
    if (fundType === 'Untied' && subType === 'Flexible') allowedRemaining = remainingFunds.untiedFlexible;
    if (fundType === 'Own Fund' && subType === 'Other') allowedRemaining = remainingFunds.ownOther;
    if (fundType === 'SFC' && subType === 'Other') allowedRemaining = remainingFunds.sfcOther;

    if (amt > allowedRemaining) {
      addToast(`Amount exceeds available balance of ₹${allowedRemaining.toLocaleString('en-IN')}`);
      return;
    }

    setAllocations(prev => [...prev, {
      id: `${Date.now()}-${Math.random()}`,
      fundType,
      subType,
      theme,
      activity,
      type,
      focusArea,
      amount: amt
    }]);
    addToast("Activity allocated successfully!");
  };

  const removeAllocation = (id: string) => {
    setAllocations(prev => prev.filter(a => a.id !== id));
  };

  // Generic Search & Select Section for Tied / Roads / Flexible / Other
  const [tiedSelTheme, setTiedSelTheme] = useState('');
  const [tiedSelActId, setTiedSelActId] = useState('');
  const [tiedAmtInput, setTiedAmtInput] = useState('');

  const [roadSelActId, setRoadSelActId] = useState('');
  const [roadAmtInput, setRoadAmtInput] = useState('');

  const [flexSelTheme, setFlexSelTheme] = useState('');
  const [flexSelActId, setFlexSelActId] = useState('');
  const [flexAmtInput, setFlexAmtInput] = useState('');

  const [ownOtherSelTheme, setOwnOtherSelTheme] = useState('');
  const [ownOtherSelActId, setOwnOtherSelActId] = useState('');
  const [ownOtherAmtInput, setOwnOtherAmtInput] = useState('');

  const [sfcOtherSelTheme, setSfcOtherSelTheme] = useState('');
  const [sfcOtherSelActId, setSfcOtherSelActId] = useState('');
  const [sfcOtherAmtInput, setSfcOtherAmtInput] = useState('');

  // Tied activities (Theme 4 Drinking Water & Theme 5 Sanitation Tied activities ONLY)
  const tiedActivities = useMemo(() => {
    return masterData.filter(a => {
      if (a.type !== 'Tied') return false;
      if (a.themeNumber !== 4 && a.themeNumber !== 5) return false;
      if (tiedSelTheme && !a.themeName.toLowerCase().includes(tiedSelTheme.toLowerCase())) return false;
      return true;
    });
  }, [masterData, tiedSelTheme]);

  // Road activities (Theme 6 Road/Culvert Untied activities only)
  const roadActivities = useMemo(() => {
    return masterData.filter(a => 
      a.type === 'Untied' &&
      a.themeNumber === 6 && (
        a.focusArea.toLowerCase().includes('road') || 
        a.activityName.toLowerCase().includes('road') || 
        a.activityName.toLowerCase().includes('culvert') ||
        a.activityName.toLowerCase().includes('paver')
      )
    );
  }, [masterData]);

  // Flexible activities
  const flexibleActivities = useMemo(() => {
    return masterData.filter(a => {
      if (a.type !== 'Untied') return false;
      if (flexSelTheme && !a.themeName.toLowerCase().includes(flexSelTheme.toLowerCase())) return false;
      return true;
    });
  }, [masterData, flexSelTheme]);

  // Own Other activities
  const ownOtherActivities = useMemo(() => {
    return masterData.filter(a => {
      if (a.type !== 'Untied') return false;
      if (ownOtherSelTheme && !a.themeName.toLowerCase().includes(ownOtherSelTheme.toLowerCase())) return false;
      return true;
    });
  }, [masterData, ownOtherSelTheme]);

  // SFC Other activities
  const sfcOtherActivities = useMemo(() => {
    return masterData.filter(a => {
      if (a.type !== 'Untied') return false;
      if (sfcOtherSelTheme && !a.themeName.toLowerCase().includes(sfcOtherSelTheme.toLowerCase())) return false;
      return true;
    });
  }, [masterData, sfcOtherSelTheme]);

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sheet 1: GP Details
    const wsDetails = XLSX.utils.json_to_sheet([
      { Field: "Gram Panchayat (GP)", Value: gpDetails.gpName },
      { Field: "Mandal", Value: gpDetails.mandal },
      { Field: "District", Value: gpDetails.district },
      { Field: "GP Type", Value: isPilot ? "Pilot GP (11 Themes)" : "Standard GP (9 Themes)" },
      { Field: "Selected Sankalp Themes", Value: selectedSankalpThemes.join(", ") },
      { Field: "Own Fund (INR)", Value: ownFundAmt },
      { Field: "SFC Grant (INR)", Value: sfcAmt },
      { Field: "15th FC Untied (INR)", Value: untiedAmt },
      { Field: "15th FC Tied (INR)", Value: tiedAmt }
    ]);
    XLSX.utils.book_append_sheet(wb, wsDetails, "GP Details");

    // Sheet 2: Allocations
    const allocData = allocations.map((a, i) => ({
      "S.No": i + 1,
      "Fund Type": a.fundType,
      "Sub Type": a.subType,
      "Theme": a.theme,
      "Activity Name": a.activity,
      "Focus Area": a.focusArea || "",
      "Grant Type": a.type,
      "Allocated Amount (INR)": a.amount
    }));
    const wsAlloc = XLSX.utils.json_to_sheet(allocData);
    XLSX.utils.book_append_sheet(wb, wsAlloc, "GPDP Allocations");

    // Sheet 3: Master Activities Reference (All 423 rows)
    const masterSheetData = masterData.map((m, i) => ({
      "S.No": i + 1,
      "Master Code": m.masterCode,
      "Theme Number": m.themeNumber,
      "Theme Name": m.themeName,
      "Activity Name": m.activityName,
      "Focus Area": m.focusArea,
      "Type": m.type
    }));
    const wsMaster = XLSX.utils.json_to_sheet(masterSheetData);
    XLSX.utils.book_append_sheet(wb, wsMaster, "Master Activities List");

    XLSX.writeFile(wb, `GPDP_${gpDetails.gpName || 'Plan'}_2026-27.xlsx`);
    addToast("Excel report downloaded successfully!");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.text("Gram Panchayat Development Plan (GPDP) Budget Plan 2026-27", 14, 18);
    
    doc.setFontSize(10);
    doc.text(`GP: ${gpDetails.gpName || 'N/A'} | Mandal: ${gpDetails.mandal || 'N/A'} | District: ${gpDetails.district || 'N/A'}`, 14, 26);
    doc.text(`Sankalp Themes: ${selectedSankalpThemes.join(", ")}`, 14, 32);
    
    (doc as any).autoTable({
      startY: 38,
      head: [['S.No', 'Fund Type', 'Sub Type', 'Theme', 'Activity Name', 'Type', 'Amount (INR)']],
      body: allocations.map((a, i) => [
        i + 1,
        a.fundType, 
        a.subType, 
        `Theme ${a.theme.replace(/[^0-9]/g, '') || a.theme}`, 
        a.activity, 
        a.type, 
        a.amount.toLocaleString('en-IN')
      ]),
      styles: { fontSize: 7, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 22 },
        2: { cellWidth: 26 },
        3: { cellWidth: 20 },
        4: { cellWidth: 75 },
        5: { cellWidth: 16 },
        6: { cellWidth: 22, halign: 'right' }
      }
    });
    
    doc.save(`GPDP_Report_${gpDetails.gpName || 'GP'}_2026-27.pdf`);
    addToast("PDF report downloaded successfully!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 sm:p-8 rounded-3xl shadow-lg text-white flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold backdrop-blur-md">
            <Sparkles size={14} className="text-amber-300" />
            Official Master List ({masterData.length} Activities in English)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Gram Panchayat Development Plan (GPDP) 2026-27
          </h2>
          <p className="text-blue-100 text-sm font-medium max-w-2xl">
            Streamlined 4-Step Planning: GP Profile, Budget Estimates, Direct Activity Tables & One-Click Audit Export.
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl shrink-0">
          {STEPS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (idx < step) setStep(idx);
                else if (idx === step + 1 && validateStep()) setStep(idx);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                step === idx 
                  ? 'bg-white text-blue-900 shadow-sm' 
                  : step > idx 
                    ? 'bg-blue-800/60 text-blue-200 hover:bg-blue-800' 
                    : 'text-blue-300 opacity-60'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === idx ? 'bg-blue-600 text-white' : step > idx ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white'}`}>
                {step > idx ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100 min-h-[550px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 pb-20"
          >
            {/* STEP 1 (Step 0): GP Setup & Themes */}
            {step === 0 && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Step 1: Gram Panchayat Setup & Sankalp Themes
                  </h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">
                    Enter your Gram Panchayat details, select GP category, and choose 1-2 Sankalp priority themes.
                  </p>
                </div>

                {/* Section A: GP Details */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-blue-700 font-black text-sm">
                    <MapPin size={18} />
                    <span>Location Details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 mb-1.5 block uppercase tracking-wider">
                        GP Name *
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white" 
                        value={gpDetails.gpName} 
                        onChange={e => setGpDetails({...gpDetails, gpName: e.target.value})} 
                        placeholder="e.g. Gangadhara" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-700 mb-1.5 block uppercase tracking-wider">
                        Mandal Name *
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white" 
                        value={gpDetails.mandal} 
                        onChange={e => setGpDetails({...gpDetails, mandal: e.target.value})} 
                        placeholder="e.g. Gangadhara" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-700 mb-1.5 block uppercase tracking-wider">
                        District Name *
                      </label>
                      <input 
                        type="text" 
                        className="w-full p-3.5 rounded-xl border border-slate-200 font-bold text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white" 
                        value={gpDetails.district} 
                        onChange={e => setGpDetails({...gpDetails, district: e.target.value})} 
                        placeholder="e.g. Karimnagar" 
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Pilot GP Status */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-700 block uppercase tracking-wider">
                    Select Gram Panchayat Category:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setIsPilot(false)} 
                      className={`p-5 rounded-2xl border-2 transition-all text-left relative ${!isPilot ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-md shadow-blue-600/10' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-black text-base">Standard GP</span>
                        {!isPilot && <CheckCircle2 className="text-blue-600" size={18} />}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Standard GPs have 9 Themes (Themes 1 to 9).
                      </p>
                      <span className="text-[11px] font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                        9 Themes Applicable
                      </span>
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setIsPilot(true)} 
                      className={`p-5 rounded-2xl border-2 transition-all text-left relative ${isPilot ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-md shadow-blue-600/10' : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-black text-base">Pilot GP (FRA & PESA)</span>
                        {isPilot && <CheckCircle2 className="text-blue-600" size={18} />}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Forest / PESA GPs have 11 Themes (including Theme 10 FRA & Theme 11 PESA).
                      </p>
                      <span className="text-[11px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                        11 Themes Applicable
                      </span>
                    </button>
                  </div>
                </div>

                {/* Section C: Sankalp Themes Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-700 block uppercase tracking-wider">
                      Select Priority Sankalp Themes (1 or 2):
                    </label>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      Selected: {selectedSankalpThemes.length} / 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableThemesList.map(t => {
                      const themeKey = t.name;
                      const isSelected = selectedSankalpThemes.includes(themeKey) || selectedSankalpThemes.includes(t.code) || selectedSankalpThemes.some(st => st.includes(`Theme ${t.id}`));
                      
                      return (
                        <button 
                          type="button"
                          key={t.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSankalpThemes(selectedSankalpThemes.filter(st => st !== themeKey && !st.includes(`Theme ${t.id}`)));
                            } else {
                              if (selectedSankalpThemes.length >= 2) {
                                addToast("Maximum 2 Sankalp Themes allowed.");
                              } else {
                                setSelectedSankalpThemes([...selectedSankalpThemes, themeKey]);
                              }
                            }
                          }}
                          className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-start gap-3 ${isSelected ? 'border-blue-600 bg-blue-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                                <Check size={14} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 mr-2">{t.code}</span>
                            <span className={`font-black text-xs sm:text-sm ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                              {t.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-950 font-medium leading-relaxed">
                    <strong>Direct Sankalp Tables</strong>: In Step 3, complete activity tables for selected Sankalp themes will be displayed directly with the 1/4th quota counter and live fund source selector (Own / SFC / Untied).
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 (Step 1): Budget Estimates */}
            {step === 1 && (
              <div className="space-y-8 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Step 2: Gram Panchayat Budget Estimates
                  </h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">
                    Enter the estimated budget for each grant source. Statutory shares will be automatically calculated.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'ownFund' as const, label: 'Own Fund (GP Revenue)', hint: 'Taxes, fees, non-tax revenue', limitDesc: `30% Sankalp: ₹${limits.ownSankalp.toLocaleString('en-IN')} | 70% Other: ₹${limits.ownOther.toLocaleString('en-IN')}` },
                    { key: 'sfc' as const, label: 'SFC Grant (State Finance Commission)', hint: 'State Finance Commission grant', limitDesc: `30% Sankalp: ₹${limits.sfcSankalp.toLocaleString('en-IN')} | 70% Other: ₹${limits.sfcOther.toLocaleString('en-IN')}` },
                    { key: 'untied' as const, label: '15th FC Untied Grant', hint: '15th Finance Commission Untied', limitDesc: `30% Sankalp: ₹${limits.untiedSankalp.toLocaleString('en-IN')} | 20% Roads: ₹${limits.untiedRoad.toLocaleString('en-IN')} | 50% Flexible: ₹${limits.untiedFlexible.toLocaleString('en-IN')}` },
                    { key: 'tied' as const, label: '15th FC Tied Grant', hint: 'Flexible for Drinking Water & Sanitation', limitDesc: `Total Tied: ₹${limits.tiedTotal.toLocaleString('en-IN')} (Flexible Drinking Water & Sanitation)` }
                  ].map(f => (
                    <div key={f.key} className="bg-slate-50 p-5 rounded-3xl border border-slate-200 flex flex-col justify-between gap-3">
                      <div>
                        <label className="font-black text-slate-800 text-sm block">{f.label}</label>
                        <span className="text-[11px] text-slate-400 font-semibold">{f.hint}</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₹</span>
                        <input 
                          type="number" 
                          className="w-full p-3.5 pl-8 rounded-2xl border border-slate-300 font-black text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base bg-white" 
                          value={funds[f.key]} 
                          onChange={e => setFunds({...funds, [f.key]: e.target.value})} 
                          placeholder="0" 
                        />
                      </div>
                      <div className="text-[11px] font-bold text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                        {f.limitDesc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Fund Calculated Banner */}
                <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-3xl flex justify-between items-center font-bold shadow-md">
                  <div>
                    <div className="text-xs text-blue-200 uppercase font-bold tracking-wider">Total Estimated GP Budget</div>
                    <div className="text-sm text-blue-100">Combined from all 4 fund sources</div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black">
                    ₹{(ownFundAmt + sfcAmt + untiedAmt + tiedAmt).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 (Step 2): Fund Allocations (Sequential Process: Tied -> Sankalp -> Main Plan) */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Step 3: GPDP Activity & Budget Allocations
                  </h3>
                  <p className="text-slate-500 font-medium text-sm mt-1">
                    ప్రభుత్వ మార్గదర్శకాల ప్రకారం క్రమపద్ధతిలో: <strong>1. టైడ్ గ్రాంట్ (త్రాగునీరు & పారిశుధ్యం)</strong> &rarr; <strong>2. సంకల్ప థీమ్స్ (30%)</strong> &rarr; <strong>3. మెయిన్ ప్లాన్ (మిగిలిన 70% & Untied పనులు)</strong> కేటాయించండి.
                  </p>
                </div>

                {/* Sequential Stage Visual Breadcrumb */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  {/* Step 1: Tied */}
                  <div 
                    onClick={() => setActiveAllocTab('tied')}
                    className={`cursor-pointer p-3 rounded-xl border transition-all ${
                      activeAllocTab === 'tied' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : isTiedCompleted 
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/70' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <div className="flex items-center gap-1.5">
                        <span>💧 1. 15th FC Tied</span>
                        {isTiedCompleted && <CheckCircle2 size={15} className={activeAllocTab === 'tied' ? 'text-blue-200' : 'text-emerald-600'} />}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                        activeAllocTab === 'tied' ? 'bg-blue-700 text-white' : isTiedCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isTiedCompleted ? '₹0 Bal (100%)' : `Bal: ₹${remainingFunds.tiedTotal.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold mt-1 opacity-90">
                      థీమ్ 4 (త్రాగునీరు) & థీమ్ 5 (పారిశుధ్యం)
                    </div>
                  </div>

                  {/* Step 2: Sankalp */}
                  <div 
                    onClick={() => setActiveAllocTab('sankalp')}
                    className={`cursor-pointer p-3 rounded-xl border transition-all ${
                      activeAllocTab === 'sankalp' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : isSankalpCompleted 
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/70' 
                          : !isTiedCompleted 
                            ? 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100/70' 
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <div className="flex items-center gap-1.5">
                        <span>🌟 2. Sankalp (30%)</span>
                        {isSankalpCompleted && <CheckCircle2 size={15} className={activeAllocTab === 'sankalp' ? 'text-blue-200' : 'text-emerald-600'} />}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                        activeAllocTab === 'sankalp' ? 'bg-blue-700 text-white' : isSankalpCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isSankalpCompleted ? '₹0 Bal (100%)' : `Bal: ₹${totalSankalpRemaining.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold mt-1 opacity-90">
                      Own Fund, SFC & Untied 30% కోటా
                    </div>
                  </div>

                  {/* Step 3: Main GPDP Plan */}
                  <div 
                    onClick={() => setActiveAllocTab('untied')}
                    className={`cursor-pointer p-3 rounded-xl border transition-all ${
                      activeAllocTab === 'untied' || activeAllocTab === 'other'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : (isUntiedCompleted && isOtherCompleted) 
                          ? 'bg-emerald-50 text-emerald-950 border-emerald-200 hover:bg-emerald-100/70' 
                          : (!isTiedCompleted || !isSankalpCompleted)
                            ? 'bg-slate-50 text-slate-500 border-slate-200 opacity-90'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <div className="flex items-center gap-1.5">
                        <span>🛣️ 3. Main GPDP Plan</span>
                        {(isUntiedCompleted && isOtherCompleted) && <CheckCircle2 size={15} className={(activeAllocTab === 'untied' || activeAllocTab === 'other') ? 'text-blue-200' : 'text-emerald-600'} />}
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                        (activeAllocTab === 'untied' || activeAllocTab === 'other') ? 'bg-blue-700 text-white' : (isUntiedCompleted && isOtherCompleted) ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {(isUntiedCompleted && isOtherCompleted) ? '₹0 Bal (100%)' : `Bal: ₹${(totalUntiedRemaining + totalOtherRemaining).toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold mt-1 opacity-90">
                      Roads (20%), Flex (50%) & Other (70%)
                    </div>
                  </div>
                </div>

                {/* Fund Source Tab Pills */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  {[
                    { 
                      id: 'tied' as const, 
                      label: '💧 1. 15th FC Tied (Theme 4 & 5)', 
                      budget: limits.tiedTotal, 
                      allocated: currentStatus.tiedTotal,
                      isDone: isTiedCompleted 
                    },
                    { 
                      id: 'sankalp' as const, 
                      label: '🌟 2. Sankalp Themes (30%)', 
                      budget: totalSankalpBudget, 
                      allocated: totalSankalpAllocated,
                      isDone: isSankalpCompleted 
                    },
                    { 
                      id: 'untied' as const, 
                      label: '🛣️ 3. 15th FC Untied (Roads & Flex)', 
                      budget: limits.untiedRoad + limits.untiedFlexible, 
                      allocated: currentStatus.untiedRoad + currentStatus.untiedFlexible,
                      isDone: isUntiedCompleted 
                    },
                    { 
                      id: 'other' as const, 
                      label: '🏛️ 4. Own & SFC (70% Other)', 
                      budget: limits.ownOther + limits.sfcOther, 
                      allocated: currentStatus.ownOther + currentStatus.sfcOther,
                      isDone: isOtherCompleted 
                    },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveAllocTab(tab.id)}
                      className={`flex-1 min-w-[160px] p-3 rounded-xl text-left transition-all ${
                        activeAllocTab === tab.id
                          ? 'bg-white shadow-sm border border-slate-200 text-blue-900 font-black'
                          : 'text-slate-600 hover:bg-slate-200/60 font-bold'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-1">
                          {tab.label}
                          {tab.isDone && <CheckCircle2 size={12} className="text-emerald-600" />}
                        </span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${tab.isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          ₹{tab.allocated.toLocaleString('en-IN')} / ₹{tab.budget.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${tab.isDone ? 'bg-emerald-600' : 'bg-blue-600'}`}
                          style={{ width: `${tab.budget > 0 ? Math.min(100, (tab.allocated / tab.budget) * 100) : 0}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                {/* TAB 1: 15TH FC TIED (FLEXIBLE - STRICTLY THEME 4 & 5 TIED ACTIVITIES ONLY) */}
                {activeAllocTab === 'tied' && (
                  <div className="space-y-6">
                    {/* Guidance / Status Box */}
                    {!isTiedCompleted ? (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-950 rounded-2xl font-bold text-xs border border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">దశ 1 (Step 1)</span>
                            <h4 className="text-sm font-black text-blue-900">15th FC టైడ్ నిధుల కేటాయింపు (త్రాగునీరు & పారిశుధ్యం)</h4>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold mt-1">
                            నిబంధనల ప్రకారం మొదట మొత్తం టైడ్ నిధులను (₹{limits.tiedTotal.toLocaleString('en-IN')}) కేటాయించి బ్యాలెన్స్ ₹0 చేయాలి. టైడ్ నిధులు పూర్తి చేసిన తర్వాతే సంకల్ప థీమ్స్ కి వెళ్ళాలి.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="bg-white px-3 py-1.5 rounded-xl border border-blue-200 text-xs font-black">
                            Total: ₹{limits.tiedTotal.toLocaleString('en-IN')}
                          </div>
                          <div className="px-3 py-1.5 rounded-xl text-xs font-black bg-blue-100 text-blue-900 border border-blue-300">
                            ఇంకా మిగిలింది: ₹{remainingFunds.tiedTotal.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl font-bold text-xs border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-black text-emerald-900">🎉 15th FC టైడ్ నిధులు (100%) విజయవంతంగా కేటాయించబడ్డాయి (₹0 బ్యాలెన్స్)!</h4>
                            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                              ఇప్పుడు తదుపరి దశ అయిన <strong>సంకల్ప ప్రాధాన్యత థీమ్స్ (30% నిధుల)</strong> కేటాయింపుకు వెళ్ళండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAllocTab('sankalp')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
                        >
                          <span>సంకల్ప థీమ్స్ (30%) కి కొనసాగండి</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* Tied Add Form */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                      <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
                        Add Tied Activity (Strictly Theme 4 & 5 Tied):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <select
                          className="p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={tiedSelTheme}
                          onChange={e => { setTiedSelTheme(e.target.value); setTiedSelActId(''); }}
                        >
                          <option value="">All Tied Themes (Theme 4 & 5)</option>
                          <option value="Theme 4">Theme 4 - Drinking Water (Tied)</option>
                          <option value="Theme 5">Theme 5 - Sanitation (Tied)</option>
                        </select>

                        <select
                          className="sm:col-span-2 p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={tiedSelActId}
                          onChange={e => setTiedSelActId(e.target.value)}
                        >
                          <option value="">Select Tied Activity ({tiedActivities.length} available)</option>
                          {tiedActivities.map(a => (
                            <option key={a.id} value={a.id}>
                              [Theme {a.themeNumber}] {a.activityName}
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              placeholder={remainingFunds.tiedTotal <= 0 ? "Tied ₹0 Done" : "Amount"}
                              disabled={remainingFunds.tiedTotal <= 0}
                              value={tiedAmtInput}
                              onChange={e => setTiedAmtInput(e.target.value)}
                              className="w-full pl-7 pr-2 py-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={remainingFunds.tiedTotal <= 0 || !tiedSelActId || !tiedAmtInput}
                            onClick={() => {
                              const act = tiedActivities.find(a => a.id === tiedSelActId);
                              if (!act) return;
                              addGeneralAllocation('Tied', 'Tied Grant', act.themeName, act.activityName, act.type, act.focusArea, tiedAmtInput);
                              setTiedSelActId('');
                              setTiedAmtInput('');
                            }}
                            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold text-xs transition-all shadow-xs flex items-center justify-center shrink-0 disabled:opacity-50"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Allocated Tied Activities */}
                    <div className="space-y-2">
                      <div className="text-xs font-black text-slate-700">Allocated Tied Activities:</div>
                      {allocations.filter(a => a.fundType === 'Tied').map(a => (
                        <div key={a.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                          <div className="truncate flex-1 pr-3">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-black text-blue-800 bg-blue-50 px-2 py-0.5 rounded">{a.theme}</span>
                              <span className="font-semibold text-slate-500">{a.focusArea}</span>
                            </div>
                            <div className="font-bold text-slate-900 text-sm">{a.activity}</div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-black text-slate-900 text-sm">₹{a.amount.toLocaleString('en-IN')}</span>
                            <button
                              type="button"
                              onClick={() => removeAllocation(a.id)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {allocations.filter(a => a.fundType === 'Tied').length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          No Tied activities allocated yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: SANKALP THEMES DIRECT TABLES */}
                {activeAllocTab === 'sankalp' && (
                  <div className="space-y-6">
                    {/* Pre-check Warning if Tied not completed */}
                    {!isTiedCompleted && (
                      <div className="p-4 bg-amber-50 text-amber-950 rounded-2xl font-bold text-xs border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-start gap-2">
                          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-amber-900">ముందుగా 15th FC టైడ్ నిధులు పూర్తి చేయండి:</span>
                            <p className="text-xs text-amber-800 font-semibold mt-0.5">
                              ఇంకా ₹{remainingFunds.tiedTotal.toLocaleString('en-IN')} టైడ్ నిధులు మిగిలి ఉన్నాయి. ప్రభుత్వ నియమం ప్రకారం మొదట టైడ్ గ్రాంట్‌ను కేటాయించి బ్యాలెన్స్ ₹0 చేయండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAllocTab('tied')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0"
                        >
                          టైడ్ నిధుల కేటాయింపుకు వెళ్ళండి ⬅️
                        </button>
                      </div>
                    )}

                    {/* Success notification if Sankalp Completed */}
                    {isSankalpCompleted && (
                      <div className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl font-bold text-xs border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-black text-emerald-900">🎉 సంకల్ప 30% నిధులు (Own, SFC, Untied) 100% పూర్తయ్యాయి (₹0 బ్యాలెన్స్)!</h4>
                            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                              ఇప్పుడు తదుపరి దశ అయిన <strong>మెయిన్ GPDP ప్లాన్ (మిగిలిన 70% & Untied పనుల)</strong> కేటాయింపుకు వెళ్ళండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAllocTab('untied')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
                        >
                          <span>మెయిన్ GPDP పనులకు వెళ్ళండి</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}

                    {/* Live Sankalp Funds Balances Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 text-blue-950 rounded-2xl font-bold text-xs border border-blue-100 shadow-xs">
                      <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
                        <div className="text-slate-500">Own Fund (30% Sankalp):</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-black text-sm text-blue-700">₹{limits.ownSankalp.toLocaleString('en-IN')}</span>
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded ${remainingFunds.sankalpOwn <= 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                            {remainingFunds.sankalpOwn <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Bal: ₹${remainingFunds.sankalpOwn.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
                        <div className="text-slate-500">SFC Grant (30% Sankalp):</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-black text-sm text-blue-700">₹{limits.sfcSankalp.toLocaleString('en-IN')}</span>
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded ${remainingFunds.sankalpSfc <= 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                            {remainingFunds.sankalpSfc <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Bal: ₹${remainingFunds.sankalpSfc.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/80 p-3 rounded-xl border border-blue-100">
                        <div className="text-slate-500">15th FC Untied (30% Sankalp):</div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="font-black text-sm text-blue-700">₹{limits.untiedSankalp.toLocaleString('en-IN')}</span>
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded ${remainingFunds.sankalpUntied <= 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'}`}>
                            {remainingFunds.sankalpUntied <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Bal: ₹${remainingFunds.sankalpUntied.toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Theme Tables for each Selected Sankalp Theme */}
                    <div className="space-y-6">
                      {selectedSankalpThemes.map(themeName => {
                        const themeMeta = availableThemesList.find(t => 
                          t.name.toLowerCase().includes(themeName.toLowerCase()) || 
                          themeName.toLowerCase().includes(t.code.toLowerCase()) ||
                          themeName.toLowerCase().includes(`theme ${t.id}`)
                        );
                        const code = themeMeta ? themeMeta.code : themeName.split(' - ')[0];

                        return (
                          <SankalpThemeTable
                            key={themeName}
                            themeName={themeName}
                            themeCode={code}
                            masterData={masterData}
                            allocations={allocations}
                            onAdd={addSankalpAllocation}
                            onRemove={removeAllocation}
                            remainingFunds={{
                              ownFund: remainingFunds.sankalpOwn,
                              sfc: remainingFunds.sankalpSfc,
                              untied: remainingFunds.sankalpUntied
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: 15TH FC UNTIED (ROADS 20% & FLEXIBLE 50%) */}
                {activeAllocTab === 'untied' && (
                  <div className="space-y-6">
                    {/* Pre-check Warning if Sankalp or Tied not completed */}
                    {!isSankalpCompleted && (
                      <div className="p-4 bg-amber-50 text-amber-950 rounded-2xl font-bold text-xs border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-start gap-2">
                          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-amber-900">సంకల్ప 30% నిధులు ఇంకా మిగిలి ఉన్నాయి:</span>
                            <p className="text-xs text-amber-800 font-semibold mt-0.5">
                              సంకల్ప ప్రాధాన్యత కోటాలో ఇంకా ₹{totalSankalpRemaining.toLocaleString('en-IN')} నిధులు కేటాయించాల్సి ఉంది. దయచేసి సంకల్ప 30% పూర్తి చేసిన తర్వాత మెయిన్ ప్లాన్ పూర్తి చేయండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAllocTab('sankalp')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0"
                        >
                          సంకల్ప కేటాయింపుకు వెళ్ళండి ⬅️
                        </button>
                      </div>
                    )}

                    {/* Celebration if all GPDP funds completed */}
                    {isAllGPDPCompleted && (
                      <div className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl font-bold text-xs border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-black text-emerald-900">🎉 అభినందనలు! మొత్తం గ్రామ పంచాయతీ బడ్జెట్ 100% పక్కాగా కేటాయించబడింది (₹0 బ్యాలెన్స్)!</h4>
                            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                              టైడ్, సంకల్ప, మరియు మెయిన్ ప్లాన్ నిధులన్నీ కేటాయించబడ్డాయి. ప్లాన్ రివ్యూ మరియు PDF/Excel ఎగుమతి కొరకు Step 4 కి కొనసాగండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
                        >
                          <span>Step 4: Review & Export ➔</span>
                        </button>
                      </div>
                    )}

                    {/* Road Maintenance Section (20%) */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">Road Maintenance & Culverts (20% Limit)</h4>
                          <span className="text-xs text-slate-500">Theme 6 Internal Roads, CC Roads, Drains & Pavers</span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${remainingFunds.untiedRoad <= 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>
                          {remainingFunds.untiedRoad <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Remaining: ₹${remainingFunds.untiedRoad.toLocaleString('en-IN')} / Limit: ₹${limits.untiedRoad.toLocaleString('en-IN')}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select
                          className="sm:col-span-2 p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={roadSelActId}
                          onChange={e => setRoadSelActId(e.target.value)}
                        >
                          <option value="">Select Road Activity ({roadActivities.length} available)</option>
                          {roadActivities.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.activityName} ({a.focusArea})
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              placeholder={remainingFunds.untiedRoad <= 0 ? "Roads ₹0 Done" : "Amount"}
                              disabled={remainingFunds.untiedRoad <= 0}
                              value={roadAmtInput}
                              onChange={e => setRoadAmtInput(e.target.value)}
                              className="w-full pl-7 pr-2 py-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={remainingFunds.untiedRoad <= 0 || !roadSelActId || !roadAmtInput}
                            onClick={() => {
                              const act = roadActivities.find(a => a.id === roadSelActId);
                              if (!act) return;
                              addGeneralAllocation('Untied', 'Road Maintenance', act.themeName, act.activityName, act.type, act.focusArea, roadAmtInput);
                              setRoadSelActId('');
                              setRoadAmtInput('');
                            }}
                            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold text-xs transition-all shadow-xs flex items-center justify-center shrink-0 disabled:opacity-50"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Allocated Road Activities */}
                      <div className="space-y-1.5">
                        {allocations.filter(a => a.fundType === 'Untied' && a.subType === 'Road Maintenance').map(a => (
                          <div key={a.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 text-xs">
                            <span className="font-bold text-slate-800">{a.activity}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">₹{a.amount.toLocaleString('en-IN')}</span>
                              <button type="button" onClick={() => removeAllocation(a.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Flexible Priorities (50%) */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">Flexible Village Priorities (50% Limit)</h4>
                          <span className="text-xs text-slate-500">Any Theme Untied Priorities</span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${remainingFunds.untiedFlexible <= 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>
                          {remainingFunds.untiedFlexible <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Remaining: ₹${remainingFunds.untiedFlexible.toLocaleString('en-IN')} / Limit: ₹${limits.untiedFlexible.toLocaleString('en-IN')}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <select
                          className="p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={flexSelTheme}
                          onChange={e => { setFlexSelTheme(e.target.value); setFlexSelActId(''); }}
                        >
                          <option value="">All Themes</option>
                          {availableThemesList.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>

                        <select
                          className="sm:col-span-2 p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={flexSelActId}
                          onChange={e => setFlexSelActId(e.target.value)}
                        >
                          <option value="">Select Activity ({flexibleActivities.length} available)</option>
                          {flexibleActivities.map(a => (
                            <option key={a.id} value={a.id}>
                              [Theme {a.themeNumber}] {a.activityName}
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              placeholder={remainingFunds.untiedFlexible <= 0 ? "Flex ₹0 Done" : "Amount"}
                              disabled={remainingFunds.untiedFlexible <= 0}
                              value={flexAmtInput}
                              onChange={e => setFlexAmtInput(e.target.value)}
                              className="w-full pl-7 pr-2 py-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={remainingFunds.untiedFlexible <= 0 || !flexSelActId || !flexAmtInput}
                            onClick={() => {
                              const act = flexibleActivities.find(a => a.id === flexSelActId);
                              if (!act) return;
                              addGeneralAllocation('Untied', 'Flexible', act.themeName, act.activityName, act.type, act.focusArea, flexAmtInput);
                              setFlexSelActId('');
                              setFlexAmtInput('');
                            }}
                            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold text-xs transition-all shadow-xs flex items-center justify-center shrink-0 disabled:opacity-50"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Allocated Flexible Activities */}
                      <div className="space-y-1.5">
                        {allocations.filter(a => a.fundType === 'Untied' && a.subType === 'Flexible').map(a => (
                          <div key={a.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 text-xs">
                            <div>
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 mr-2">{a.theme}</span>
                              <span className="font-bold text-slate-800">{a.activity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">₹{a.amount.toLocaleString('en-IN')}</span>
                              <button type="button" onClick={() => removeAllocation(a.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: OWN FUND & SFC (70% OTHER PRIORITIES) */}
                {activeAllocTab === 'other' && (
                  <div className="space-y-6">
                    {/* Pre-check Warning if Sankalp not completed */}
                    {!isSankalpCompleted && (
                      <div className="p-4 bg-amber-50 text-amber-950 rounded-2xl font-bold text-xs border border-amber-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-start gap-2">
                          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-amber-900">సంకల్ప 30% నిధులు ఇంకా మిగిలి ఉన్నాయి:</span>
                            <p className="text-xs text-amber-800 font-semibold mt-0.5">
                              సంకల్ప ప్రాధాన్యత కోటాలో ఇంకా ₹{totalSankalpRemaining.toLocaleString('en-IN')} నిధులు కేటాయించాల్సి ఉంది. దయచేసి సంకల్ప 30% పూర్తి చేసిన తర్వాత మిగిలిన 70% పనులకు కేటాయించండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveAllocTab('sankalp')}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0"
                        >
                          సంకల్ప కేటాయింపుకు వెళ్ళండి ⬅️
                        </button>
                      </div>
                    )}

                    {/* Celebration if all GPDP funds completed */}
                    {isAllGPDPCompleted && (
                      <div className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl font-bold text-xs border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-black text-emerald-900">🎉 అభినందనలు! మొత్తం గ్రామ పంచాయతీ బడ్జెట్ 100% పక్కాగా కేటాయించబడింది (₹0 బ్యాలెన్స్)!</h4>
                            <p className="text-xs text-emerald-800 font-semibold mt-0.5">
                              ప్లాన్ రివ్యూ మరియు PDF & Excel రిపోర్ట్‌లను డౌన్‌లోడ్ చేయడానికి Step 4 కి వెళ్ళండి.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95"
                        >
                          <span>Step 4: Review & Export ➔</span>
                        </button>
                      </div>
                    )}

                    {/* Own Fund 70% Other Priorities */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">Own Fund Other Priorities (70% Limit)</h4>
                          <span className="text-xs text-slate-500">GP Revenue for general village development</span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${remainingFunds.ownOther <= 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>
                          {remainingFunds.ownOther <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Remaining: ₹${remainingFunds.ownOther.toLocaleString('en-IN')} / Limit: ₹${limits.ownOther.toLocaleString('en-IN')}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <select
                          className="p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={ownOtherSelTheme}
                          onChange={e => { setOwnOtherSelTheme(e.target.value); setOwnOtherSelActId(''); }}
                        >
                          <option value="">All Themes</option>
                          {availableThemesList.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>

                        <select
                          className="sm:col-span-2 p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={ownOtherSelActId}
                          onChange={e => setOwnOtherSelActId(e.target.value)}
                        >
                          <option value="">Select Activity ({ownOtherActivities.length} available)</option>
                          {ownOtherActivities.map(a => (
                            <option key={a.id} value={a.id}>
                              [Theme {a.themeNumber}] {a.activityName}
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              placeholder={remainingFunds.ownOther <= 0 ? "Own ₹0 Done" : "Amount"}
                              disabled={remainingFunds.ownOther <= 0}
                              value={ownOtherAmtInput}
                              onChange={e => setOwnOtherAmtInput(e.target.value)}
                              className="w-full pl-7 pr-2 py-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={remainingFunds.ownOther <= 0 || !ownOtherSelActId || !ownOtherAmtInput}
                            onClick={() => {
                              const act = ownOtherActivities.find(a => a.id === ownOtherSelActId);
                              if (!act) return;
                              addGeneralAllocation('Own Fund', 'Other', act.themeName, act.activityName, act.type, act.focusArea, ownOtherAmtInput);
                              setOwnOtherSelActId('');
                              setOwnOtherAmtInput('');
                            }}
                            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold text-xs transition-all shadow-xs flex items-center justify-center shrink-0 disabled:opacity-50"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Allocated Own Other Activities */}
                      <div className="space-y-1.5">
                        {allocations.filter(a => a.fundType === 'Own Fund' && a.subType === 'Other').map(a => (
                          <div key={a.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 text-xs">
                            <div>
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 mr-2">{a.theme}</span>
                              <span className="font-bold text-slate-800">{a.activity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">₹{a.amount.toLocaleString('en-IN')}</span>
                              <button type="button" onClick={() => removeAllocation(a.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SFC Grant 70% Other Priorities */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <div>
                          <h4 className="font-black text-slate-800 text-sm">SFC Grant Other Priorities (70% Limit)</h4>
                          <span className="text-xs text-slate-500">State Finance Commission grant for other works</span>
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${remainingFunds.sfcOther <= 0 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>
                          {remainingFunds.sfcOther <= 0 ? '₹0 (పూర్తయింది - Blocked)' : `Remaining: ₹${remainingFunds.sfcOther.toLocaleString('en-IN')} / Limit: ₹${limits.sfcOther.toLocaleString('en-IN')}`}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <select
                          className="p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={sfcOtherSelTheme}
                          onChange={e => { setSfcOtherSelTheme(e.target.value); setSfcOtherSelActId(''); }}
                        >
                          <option value="">All Themes</option>
                          {availableThemesList.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>

                        <select
                          className="sm:col-span-2 p-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={sfcOtherSelActId}
                          onChange={e => setSfcOtherSelActId(e.target.value)}
                        >
                          <option value="">Select Activity ({sfcOtherActivities.length} available)</option>
                          {sfcOtherActivities.map(a => (
                            <option key={a.id} value={a.id}>
                              [Theme {a.themeNumber}] {a.activityName}
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                            <input
                              type="number"
                              placeholder={remainingFunds.sfcOther <= 0 ? "SFC ₹0 Done" : "Amount"}
                              disabled={remainingFunds.sfcOther <= 0}
                              value={sfcOtherAmtInput}
                              onChange={e => setSfcOtherAmtInput(e.target.value)}
                              className="w-full pl-7 pr-2 py-3 rounded-xl border border-slate-300 font-bold text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                            />
                          </div>
                          <button
                            type="button"
                            disabled={remainingFunds.sfcOther <= 0 || !sfcOtherSelActId || !sfcOtherAmtInput}
                            onClick={() => {
                              const act = sfcOtherActivities.find(a => a.id === sfcOtherSelActId);
                              if (!act) return;
                              addGeneralAllocation('SFC', 'Other', act.themeName, act.activityName, act.type, act.focusArea, sfcOtherAmtInput);
                              setSfcOtherSelActId('');
                              setSfcOtherAmtInput('');
                            }}
                            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 font-bold text-xs transition-all shadow-xs flex items-center justify-center shrink-0 disabled:opacity-50"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Allocated SFC Other Activities */}
                      <div className="space-y-1.5">
                        {allocations.filter(a => a.fundType === 'SFC' && a.subType === 'Other').map(a => (
                          <div key={a.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 text-xs">
                            <div>
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 mr-2">{a.theme}</span>
                              <span className="font-bold text-slate-800">{a.activity}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900">₹{a.amount.toLocaleString('en-IN')}</span>
                              <button type="button" onClick={() => removeAllocation(a.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 (Step 3): Final Review & Downloads */}
            {step === 3 && (
              <div className="space-y-8 py-2">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">Step 4: Final Review & Export</h3>
                  <p className="text-slate-500 font-bold text-sm">Review your finalized budget plan and download official reports.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-3 border-b pb-2 text-sm flex items-center gap-1.5">
                      <MapPin size={16} className="text-blue-600" /> Gram Panchayat Details
                    </h4>
                    <p className="text-xs font-bold text-slate-600 py-0.5">GP Name: <span className="text-slate-900 font-black">{gpDetails.gpName || 'N/A'}</span></p>
                    <p className="text-xs font-bold text-slate-600 py-0.5">Mandal: <span className="text-slate-900 font-black">{gpDetails.mandal || 'N/A'}</span></p>
                    <p className="text-xs font-bold text-slate-600 py-0.5">District: <span className="text-slate-900 font-black">{gpDetails.district || 'N/A'}</span></p>
                    <p className="text-xs font-bold text-slate-600 py-0.5">GP Type: <span className="text-blue-700 font-black">{isPilot ? 'Pilot GP (11 Themes)' : 'Standard GP (9 Themes)'}</span></p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-slate-800 mb-3 border-b pb-2 text-sm flex items-center gap-1.5">
                      <ClipboardList size={16} className="text-blue-600" /> Selected Sankalp Themes
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedSankalpThemes.map(t => (
                        <li key={t} className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                          <Check size={12} className="text-blue-600" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Fund Summary Card */}
                <div className="bg-blue-50/70 p-6 rounded-3xl border border-blue-100">
                  <h4 className="font-black text-blue-900 mb-4 text-base">Fund Allocation Summary</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="text-xs font-black text-slate-700">Own Fund (GP Revenue)</div>
                        <div className="text-[11px] text-slate-400 font-bold">Total: ₹{ownFundAmt.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-sm font-black text-blue-700">
                        ₹{(currentStatus.ownSankalp + currentStatus.ownOther).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="text-xs font-black text-slate-700">SFC Grant</div>
                        <div className="text-[11px] text-slate-400 font-bold">Total: ₹{sfcAmt.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-sm font-black text-blue-700">
                        ₹{(currentStatus.sfcSankalp + currentStatus.sfcOther).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="text-xs font-black text-slate-700">15th FC Untied Grant</div>
                        <div className="text-[11px] text-slate-400 font-bold">Total: ₹{untiedAmt.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-sm font-black text-blue-700">
                        ₹{(currentStatus.untiedSankalp + currentStatus.untiedRoad + currentStatus.untiedFlexible).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm flex justify-between items-center">
                      <div>
                        <div className="text-xs font-black text-slate-700">15th FC Tied Grant</div>
                        <div className="text-[11px] text-slate-400 font-bold">Total: ₹{tiedAmt.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="text-sm font-black text-blue-700">
                        ₹{currentStatus.tiedTotal.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Allocated Activities List */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-white">
                  <h4 className="font-black text-slate-800 text-sm mb-3">Allocated Activities List ({allocations.length})</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {allocations.map((a, idx) => (
                      <div key={a.id} className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="truncate flex-1 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-500">{idx + 1}.</span>
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                              {a.theme}
                            </span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${a.type === 'Tied' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {a.type}
                            </span>
                          </div>
                          <span className="font-black text-slate-800 text-sm">{a.activity}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{a.fundType} &bull; {a.subType}</span>
                        </div>
                        <span className="font-black text-slate-900 shrink-0 text-sm">₹{a.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {allocations.length === 0 && (
                      <p className="text-xs text-slate-400 italic text-center py-4">No activities allocated yet.</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={exportExcel} 
                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    <FileSpreadsheet size={20} /> Download Complete Excel (.xlsx)
                  </button>
                  <button 
                    type="button"
                    onClick={exportPDF} 
                    className="flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-sm sm:text-base hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20 active:scale-95"
                  >
                    <FileDown size={20} /> Download Official PDF Report (.pdf)
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center border-t border-slate-100 bg-white/95 backdrop-blur-sm rounded-b-3xl">
          <button 
            type="button"
            onClick={goPrev} 
            disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-colors ${step === 0 ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            <ArrowLeft size={18} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button 
              type="button"
              onClick={handleNext} 
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 active:scale-95"
            >
              Next Step <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              type="button"
              onClick={exportExcel} 
              className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <FileSpreadsheet size={18} /> Download Excel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
