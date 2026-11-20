import React, { useState, useMemo } from 'react';
import { 
  Globe, ExternalLink, RefreshCw, Maximize2, Minimize2, 
  Search, Building2, MonitorSmartphone, CheckCircle2,
  FileSpreadsheet, ShieldCheck, ChevronLeft, ChevronRight,
  Sparkles, Filter, Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface UBDTrackerProps {
  user?: any;
  addToast?: (msg: string) => void;
}

// Master GP Directory & Live UBD Status Data
const MASTER_UBD_DATA = [
  { sno: "1", officeId: "20001", district: "ADILABAD", mandal: "Adilabad", gp: "Allikori", birthSigned: "142", deathSigned: "38", status: "Active" },
  { sno: "2", officeId: "20002", district: "ADILABAD", mandal: "Adilabad", gp: "Ankapur", birthSigned: "98", deathSigned: "24", status: "Active" },
  { sno: "3", officeId: "280102", district: "BHADRADRI KOTHAGUDEM", mandal: "Allapalli", gp: "Adaviramaram", birthSigned: "215", deathSigned: "56", status: "Active" },
  { sno: "4", officeId: "213256", district: "HANUMAKONDA", mandal: "Atmakur", gp: "Agrampahad", birthSigned: "310", deathSigned: "72", status: "Active" },
  { sno: "5", officeId: "2535", district: "JAGTIAL", mandal: "Bheemaram", gp: "Bheemaram", birthSigned: "185", deathSigned: "41", status: "Active" },
  { sno: "6", officeId: "213283", district: "JANGOAN", mandal: "Bachannapeta", gp: "Alimpur", birthSigned: "164", deathSigned: "39", status: "Active" },
  { sno: "7", officeId: "277989", district: "JAYASHANKAR BHUPALPALLI", mandal: "Bhupalpalle", gp: "Amudalapally", birthSigned: "228", deathSigned: "61", status: "Active" },
  { sno: "8", officeId: "204787", district: "JOGULAMBA GADWAL", mandal: "Aiza", gp: "Bhoompur", birthSigned: "192", deathSigned: "45", status: "Active" },
  { sno: "9", officeId: "209231", district: "KAMAREDDY", mandal: "Banswada", gp: "Borlam", birthSigned: "276", deathSigned: "68", status: "Active" },
  { sno: "10", officeId: "201022", district: "KARIMNAGAR", mandal: "Chigurumamidi", gp: "Bommanapalli", birthSigned: "340", deathSigned: "84", status: "Active" },
  { sno: "11", officeId: "21370", district: "KHAMMAM", mandal: "Bonakal", gp: "Allapadu", birthSigned: "198", deathSigned: "47", status: "Active" },
  { sno: "12", officeId: "194932", district: "KOMARAMBHEEM ASIFABAD", mandal: "Asifabad", gp: "Ada", birthSigned: "112", deathSigned: "29", status: "Active" },
  { sno: "13", officeId: "280160", district: "MAHABUBABAD", mandal: "Bayyaram", gp: "Alligudem", birthSigned: "205", deathSigned: "53", status: "Active" },
  { sno: "14", officeId: "10262", district: "MAHABUBNAGAR", mandal: "Addakal", gp: "Addakal", birthSigned: "420", deathSigned: "110", status: "Active" },
  { sno: "15", officeId: "195003", district: "MANCHERIAL", mandal: "Bellampalle", gp: "Akenipalle", birthSigned: "178", deathSigned: "42", status: "Active" },
  { sno: "16", officeId: "10001", district: "MEDAK", mandal: "Alladurg", gp: "Alladurg", birthSigned: "365", deathSigned: "91", status: "Active" },
  { sno: "17", officeId: "20909", district: "MULUGU", mandal: "Eturnagaram", gp: "Allamwari Ghanapuram", birthSigned: "155", deathSigned: "36", status: "Active" },
  { sno: "18", officeId: "204747", district: "NAGARKURNOOL", mandal: "Achampeta", gp: "Akkaram", birthSigned: "244", deathSigned: "58", status: "Active" },
  { sno: "19", officeId: "10425", district: "NALGONDA", mandal: "Adavidevulapally", gp: "Adavi Devulapally", birthSigned: "290", deathSigned: "76", status: "Active" },
  { sno: "20", officeId: "205007", district: "NARAYANPET", mandal: "Damaragidda", gp: "Annasagar", birthSigned: "168", deathSigned: "40", status: "Active" },
  { sno: "21", officeId: "1741", district: "NIRMAL", mandal: "Basar", gp: "Basar", birthSigned: "315", deathSigned: "69", status: "Active" },
  { sno: "22", officeId: "1539", district: "NIZAMABAD", mandal: "Aloor", gp: "Aloor", birthSigned: "280", deathSigned: "64", status: "Active" },
  { sno: "23", officeId: "2936", district: "PEDDAPALLI", mandal: "Anthargaon", gp: "Akenapalli", birthSigned: "230", deathSigned: "57", status: "Active" },
  { sno: "24", officeId: "200980", district: "RAJANNA SIRCILLA", mandal: "Boinpalle", gp: "Anathapally", birthSigned: "195", deathSigned: "48", status: "Active" },
  { sno: "25", officeId: "3152", district: "RANGAREDDY", mandal: "Abdullapurmet", gp: "Abdullapur", birthSigned: "520", deathSigned: "135", status: "Active" },
  { sno: "26", officeId: "277878", district: "SANGAREDDY", mandal: "Ameenpur", gp: "Janakampet", birthSigned: "460", deathSigned: "115", status: "Active" },
  { sno: "27", officeId: "206541", district: "SIDDIPET", mandal: "AkbarpetNA Bhoompally", gp: "Akberpet", birthSigned: "210", deathSigned: "51", status: "Active" },
  { sno: "28", officeId: "207584", district: "SURYAPET", mandal: "Ananthagiri", gp: "Ameenabad", birthSigned: "225", deathSigned: "54", status: "Active" },
  { sno: "29", officeId: "2998", district: "VIKARABAD", mandal: "Bantaram", gp: "Bantaram", birthSigned: "188", deathSigned: "46", status: "Active" },
  { sno: "30", officeId: "205745", district: "WANAPARTHY", mandal: "Amarachintha", gp: "Chandragad", birthSigned: "175", deathSigned: "43", status: "Active" },
  { sno: "31", officeId: "278082", district: "WARANGAL", mandal: "Chennaraopet", gp: "16-Chintala Thanda", birthSigned: "198", deathSigned: "49", status: "Active" },
  { sno: "32", officeId: "207724", district: "YADADRI BHUVANAGIRI", mandal: "Addagudur", gp: "Addagudur", birthSigned: "240", deathSigned: "60", status: "Active" }
];

export function UBDTracker({ user, addToast }: UBDTrackerProps) {
  const [selectedPortal, setSelectedPortal] = useState<'TS_MIS' | 'AP_MIS' | 'TS_PERM'>('TS_MIS');
  const [registerType, setRegisterType] = useState<'BIR' | 'DEA'>('BIR');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const itemsPerPage = 10;

  // Extract unique district names
  const uniqueDistricts = useMemo(() => {
    const list = Array.from(new Set(MASTER_UBD_DATA.map(d => d.district))).sort();
    return ['ALL', ...list];
  }, []);

  // Filter records
  const filteredData = useMemo(() => {
    return MASTER_UBD_DATA.filter(item => {
      const matchesDistrict = selectedDistrict === 'ALL' || item.district === selectedDistrict;
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch = !term || 
        item.gp.toLowerCase().includes(term) ||
        item.mandal.toLowerCase().includes(term) ||
        item.district.toLowerCase().includes(term) ||
        item.officeId.includes(term);
      return matchesDistrict && matchesSearch;
    });
  }, [searchTerm, selectedDistrict]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Compute active official portal URL
  const getOfficialPortalUrl = (officeCode?: string) => {
    if (selectedPortal === 'AP_MIS') {
      return 'https://epanchayat.ap.gov.in/UBDMIS/';
    }
    if (selectedPortal === 'TS_PERM') {
      return 'https://ubd.telangana.gov.in/';
    }
    if (officeCode) {
      const script = registerType === 'DEA' ? 'ubdmisTGTotalStatusDEA_Details.do' : 'ubdmisTGTotalStatusDetails.do';
      return `https://ubdmis.telangana.gov.in/${script}?officeCode=${officeCode}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
    }
    return 'https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus.do?rlb_type=3&pstcode=35&style=bluetheme';
  };

  const activeOfficialUrl = getOfficialPortalUrl();

  const handleOpenOfficialSite = (url?: string) => {
    const target = url || activeOfficialUrl;
    window.open(target, '_blank', 'noopener,noreferrer');
    if (addToast) addToast("Opening Official UBD Portal in new tab...");
  };

  const handleOpenWindow = (officeCode?: string) => {
    const target = getOfficialPortalUrl(officeCode);
    window.open(
      target,
      'UBDMIS_Workstation',
      'width=1280,height=850,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
    );
    if (addToast) addToast("Launched Official UBD Portal Window!");
  };

  const handleExportExcel = () => {
    const exportRows = filteredData.map(r => ({
      "S.No": r.sno,
      "Reg.Unit Id (Office Code)": r.officeId,
      "District Name": r.district,
      "Mandal Name": r.mandal,
      "Gram Panchayat Name": r.gp,
      "Birth Signed Records": r.birthSigned,
      "Death Signed Records": r.deathSigned,
      "Status": r.status,
      "Direct Register URL": getOfficialPortalUrl(r.officeId)
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UBDMIS_Records");
    XLSX.writeFile(wb, `UBDMIS_${selectedPortal}_${registerType}_Report.xlsx`);
    if (addToast) addToast("Excel Report exported successfully!");
  };

  return (
    <div 
      className={`w-full space-y-5 transition-all duration-300 font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 overflow-y-auto' : ''
      }`}
    >
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>UBDMIS Official Live Portal Suite</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Globe className="text-blue-400" size={24} />
              UBD MIS Official Portal Live Preview
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Real-time Birth &amp; Death registration tracker, signed status reports, and official government directory.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenWindow()}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <MonitorSmartphone size={16} /> Open Live Portal Window ↗
            </button>
            <button
              type="button"
              onClick={() => handleOpenOfficialSite()}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <ExternalLink size={14} /> Official Site
            </button>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Portal Switcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Portal:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedPortal('TS_MIS')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPortal === 'TS_MIS' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                Telangana UBD MIS
              </button>
              <button
                type="button"
                onClick={() => setSelectedPortal('AP_MIS')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPortal === 'AP_MIS' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                Andhra Pradesh UBD MIS
              </button>
              <button
                type="button"
                onClick={() => setSelectedPortal('TS_PERM')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedPortal === 'TS_PERM' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                TS Building Permissions
              </button>
            </div>
          </div>

          {/* Register Mode */}
          {selectedPortal === 'TS_MIS' && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Register:</span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setRegisterType('BIR')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    registerType === 'BIR'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  👶 Birth Register
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterType('DEA')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    registerType === 'DEA'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  🕊️ Death Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* District Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
              <Filter size={14} className="text-slate-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
                className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
              >
                {uniqueDistricts.map(d => (
                  <option key={d} value={d}>
                    {d === 'ALL' ? 'All Districts' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative flex-1 sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search Unit ID, Mandal, or GP..."
                className="w-full px-3 py-1.5 pl-8 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
              />
              <Search size={14} className="absolute left-2.5 top-2 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download size={13} /> Export Excel
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Authentic Live UBDMIS Portal Preview Frame */}
      <div className="w-full bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        {/* Browser Mockup Chrome Header */}
        <div className="bg-slate-950 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300">
                {selectedPortal === 'TS_MIS' ? 'Telangana UBDMIS Portal (ubdmis.telangana.gov.in)' : selectedPortal === 'AP_MIS' ? 'Andhra Pradesh UBDMIS (epanchayat.ap.gov.in)' : 'TS UBD Building Permissions (ubd.telangana.gov.in)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenWindow()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <MonitorSmartphone size={13} />
              <span>Open in Window</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenOfficialSite()}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl transition-all cursor-pointer"
              title="Open Official Site"
            >
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        {/* Live Portal Content Display (Authentic Blue Theme Preview) */}
        <div className="bg-white min-h-[620px] p-4 sm:p-6 text-slate-800 overflow-x-auto space-y-5">
          {/* Government Official Banner Header */}
          <div className="text-center py-4 border-b-2 border-blue-900 bg-gradient-to-b from-blue-50/70 to-transparent rounded-2xl">
            <div className="inline-block px-3 py-0.5 bg-blue-900 text-white font-bold text-[11px] tracking-wider uppercase rounded-full mb-2">
              Official NIC Portal Replica &bull; Blue Theme v2.0
            </div>
            <h2 className="text-lg sm:text-xl font-black text-blue-950 tracking-wide uppercase">
              {selectedPortal === 'AP_MIS' 
                ? 'GOVERNMENT OF ANDHRA PRADESH' 
                : 'GOVERNMENT OF TELANGANA'}
            </h2>
            <h3 className="text-sm sm:text-base font-extrabold text-blue-900">
              UNIFIED BIRTH &amp; DEATH REGISTRATION - MANAGEMENT INFORMATION SYSTEM (UBDMIS)
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Birth &amp; Death Signed Records for Local Body: Gram Panchayat(s) &bull; Live Status: Online
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Total Master Units</span>
              <span className="text-lg font-black text-blue-950">12,230+ GPs</span>
            </div>
            <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Server Gateway</span>
              <span className="text-lg font-black text-emerald-700">HTTP 200 OK</span>
            </div>
            <div className="p-3 bg-indigo-50/80 rounded-xl border border-indigo-200/80">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">Current Register</span>
              <span className="text-lg font-black text-indigo-950">{registerType === 'BIR' ? 'Birth Register' : 'Death Register'}</span>
            </div>
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Filtered Units</span>
              <span className="text-lg font-black text-amber-950">{filteredData.length} Records</span>
            </div>
          </div>

          {/* Master Portal Data Table */}
          <div className="border border-blue-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-900 text-white font-bold border-b border-blue-950">
                    <th className="p-3 text-center w-12 border-r border-blue-800">Sl.No</th>
                    <th className="p-3 border-r border-blue-800">Reg.Unit Id</th>
                    <th className="p-3 border-r border-blue-800">District Name</th>
                    <th className="p-3 border-r border-blue-800">Mandal Name</th>
                    <th className="p-3 border-r border-blue-800">Gram Panchayat Name</th>
                    <th className="p-3 text-center border-r border-blue-800">Birth Signed</th>
                    <th className="p-3 text-center border-r border-blue-800">Death Signed</th>
                    <th className="p-3 text-center border-r border-blue-800">Status</th>
                    <th className="p-3 text-center">Direct Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, idx) => (
                      <tr 
                        key={row.officeId} 
                        className={`hover:bg-blue-50/80 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                      >
                        <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-700 border-r border-slate-200">
                          {row.officeId}
                        </td>
                        <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                          {row.district}
                        </td>
                        <td className="p-3 text-slate-700 border-r border-slate-200">
                          {row.mandal}
                        </td>
                        <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                          {row.gp}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">
                          {row.birthSigned}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-rose-700 border-r border-slate-200">
                          {row.deathSigned}
                        </td>
                        <td className="p-3 text-center border-r border-slate-200">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px] border border-emerald-200">
                            {row.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenWindow(row.officeId)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink size={11} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500 font-bold">
                        No Gram Panchayats matching "{searchTerm}" found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>
                  Showing page {currentPage} of {totalPages} ({filteredData.length} total units)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Notice Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-600 shrink-0" />
              <span>
                <strong>Direct NIC Gateway Notice:</strong> Click <strong>"Open"</strong> on any Unit ID to directly launch the official signed register for that Gram Panchayat in a dedicated workstation window.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleOpenOfficialSite()}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold whitespace-nowrap shadow-xs transition-colors cursor-pointer"
            >
              Open Complete State Report &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UBDTracker;