import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Download, ChevronLeft, ChevronRight,
  Building, Maximize2, Minimize2, ExternalLink, ShieldCheck, AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { UBD_REAL_RECORDS, UbdRecord } from '../data/ubdRecordsData';

interface UBDTrackerProps {
  user?: any;
  addToast?: (msg: string) => void;
}

export function UBDTracker({ user, addToast }: UBDTrackerProps) {
  const [selectedState, setSelectedState] = useState<'TS' | 'AP'>('TS');
  const [registerType, setRegisterType] = useState<'BIR' | 'DEA'>('BIR');
  const [unitIdInput, setUnitIdInput] = useState('');
  const [activeUnitId, setActiveUnitId] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'preview'>('table');
  const recordsPerPage = 15;

  // Retrieve current active records ONLY when an ID is active and genuine
  const { gpName, district, mandal, currentRecords, isGenuineFound } = useMemo(() => {
    const cleanId = activeUnitId.trim();
    if (!cleanId) {
      return { gpName: '', district: '', mandal: '', currentRecords: [], isGenuineFound: false };
    }

    const isDeath = registerType === 'DEA';

    // Check exact parsed genuine records from official server
    if (UBD_REAL_RECORDS[cleanId]) {
      const data = UBD_REAL_RECORDS[cleanId];
      const records = isDeath && data.death ? data.death : data.birth;
      return {
        gpName: data.gpName,
        district: data.district,
        mandal: data.mandal,
        currentRecords: records || [],
        isGenuineFound: true
      };
    }

    // Not in local cache
    return {
      gpName: `Gram Panchayat #${cleanId}`,
      district: '',
      mandal: '',
      currentRecords: [],
      isGenuineFound: false
    };
  }, [activeUnitId, registerType]);

  // Filter records based on table search
  const filteredRecords = useMemo(() => {
    if (!tableSearch.trim()) return currentRecords;
    const term = tableSearch.toLowerCase().trim();
    return currentRecords.filter(r => {
      return (
        (r.sno && r.sno.toLowerCase().includes(term)) ||
        (r.regNo && r.regNo.toLowerCase().includes(term)) ||
        (r.regYear && r.regYear.toLowerCase().includes(term)) ||
        (r.childName && r.childName.toLowerCase().includes(term)) ||
        (r.deceasedName && r.deceasedName.toLowerCase().includes(term)) ||
        (r.motherName && r.motherName.toLowerCase().includes(term)) ||
        (r.fatherName && r.fatherName.toLowerCase().includes(term)) ||
        (r.relativeName && r.relativeName.toLowerCase().includes(term)) ||
        (r.gender && r.gender.toLowerCase().includes(term))
      );
    });
  }, [currentRecords, tableSearch]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredRecords.slice(start, start + recordsPerPage);
  }, [filteredRecords, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = unitIdInput.trim();
    if (!clean) {
      if (addToast) addToast("Please enter a Reg.Unit ID or Office ID");
      return;
    }
    setActiveUnitId(clean);
    setTableSearch('');
    setCurrentPage(1);
    if (addToast) addToast(`Loaded UBD Records for Unit ID: ${clean}`);
  };

  const getDirectPortalUrl = (officeCode?: string) => {
    const cleanId = (officeCode || activeUnitId || unitIdInput).trim();
    if (selectedState === 'AP') {
      return 'https://epanchayat.ap.gov.in/UBDMIS/';
    }
    if (!cleanId) {
      return 'https://ubdmis.telangana.gov.in/';
    }
    if (registerType === 'DEA') {
      return `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDEA_Details.do?officeCode=${cleanId}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
    }
    return `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDetails.do?officeCode=${cleanId}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
  };

  const handleExportExcel = () => {
    if (filteredRecords.length === 0) return;
    const isDeath = registerType === 'DEA';
    const exportRows = filteredRecords.map(r => {
      if (isDeath) {
        return {
          "Sl. No": r.sno,
          "Reg. No": r.regNo,
          "Reg. Year": r.regYear,
          "Reg. Date": r.regDate,
          "Date of Death": r.dod,
          "Gender": r.gender,
          "Deceased Name": r.deceasedName,
          "Relative Name": r.relativeName
        };
      }
      return {
        "Sl. No": r.sno,
        "Reg. No": r.regNo,
        "Reg. Year": r.regYear,
        "Reg. Date": r.regDate,
        "Date of Birth": r.dob,
        "Gender": r.gender,
        "Child Name": r.childName,
        "Mother Name": r.motherName,
        "Father Name": r.fatherName
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UBDMIS_Register");
    XLSX.writeFile(wb, `UBD_${selectedState}_${registerType}_Unit_${activeUnitId}.xlsx`);
    if (addToast) addToast("Excel Report exported successfully!");
  };

  return (
    <div 
      className={`w-full space-y-4 font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-4 sm:p-6 overflow-y-auto' : ''
      }`}
    >
      {/* Main Control Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* State Switcher (Only Telangana & AP) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Portal:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedState('TS')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedState === 'TS' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                Telangana UBD MIS
              </button>
              <button
                type="button"
                onClick={() => setSelectedState('AP')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedState === 'AP' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                Andhra Pradesh UBD MIS
              </button>
            </div>
          </div>

          {/* Register Mode (Birth vs Death) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Register:</span>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => { setRegisterType('BIR'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  registerType === 'BIR'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                👶 Birth Register
              </button>
              <button
                type="button"
                onClick={() => { setRegisterType('DEA'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  registerType === 'DEA'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                🕊️ Death Register
              </button>
            </div>
          </div>
        </div>

        {/* Unit ID Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-lg">
            <div className="relative flex-1">
              <input
                type="text"
                value={unitIdInput}
                onChange={(e) => setUnitIdInput(e.target.value)}
                placeholder="ENTER REG  UNIT ID OR OFFICE ID"
                className="w-full px-3.5 py-2.5 pl-9 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 shadow-inner tracking-wider"
              />
              <Building size={15} className="absolute left-3 top-3 text-slate-400" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Search size={14} /> Search Data
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeUnitId && filteredRecords.length > 0 && (
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Download size={13} /> Export Excel
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </form>
      </div>

      {/* Real Live UBD MIS Data Display Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden space-y-4 p-5 sm:p-7">
        {/* Authentic Government Header Replica */}
        <div className="text-center py-4 border-b-2 border-blue-900 bg-gradient-to-b from-blue-50/70 to-transparent rounded-2xl">
          <h2 className="text-base sm:text-lg font-black text-blue-950 uppercase tracking-wide">
            {selectedState === 'TS' ? 'GOVERNMENT OF TELANGANA' : 'GOVERNMENT OF ANDHRA PRADESH'}
          </h2>
          <h3 className="text-xs sm:text-sm font-extrabold text-blue-900 uppercase">
            UNIFIED BIRTH &amp; DEATH REGISTRATION - MANAGEMENT INFORMATION SYSTEM (UBDMIS)
          </h3>
          
          {/* Only show GP name, Unit ID, Mandal, and Total Records when an ID is active */}
          {activeUnitId && (
            <>
              <p className="text-xs text-slate-700 font-bold mt-1.5">
                {registerType === 'BIR' ? 'Birth Register Details' : 'Death Register Details'} for Local Body &mdash; Gram Panchayat: <span className="text-blue-900 underline font-black">{gpName}</span> (Unit ID: <span className="font-mono text-blue-900 font-black">{activeUnitId}</span>)
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-slate-600">
                {district && (
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">District: {district}</span>
                )}
                {mandal && (
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 rounded-md">Mandal: {mandal}</span>
                )}
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">Total Records: {filteredRecords.length}</span>
                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                  Official UBDMIS Records
                </span>
              </div>
            </>
          )}

          {!activeUnitId && (
            <p className="text-xs text-slate-500 font-medium mt-1.5">
              {registerType === 'BIR' ? 'Birth Register' : 'Death Register'} Details for Local Body &mdash; Enter Reg.Unit ID to view records
            </p>
          )}
        </div>

        {/* Content View: Empty State vs Records Table / Preview */}
        {!activeUnitId ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-xs">
              <Building size={26} />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              Please enter a Reg.Unit ID or Office ID above to load official records
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Type your Gram Panchayat's Reg.Unit ID in the search box and click "Search Data" to view signed register records.
            </p>
          </div>
        ) : (
          <>
            {/* View Mode & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="inline-flex bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'table' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    📊 Records Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🏛️ Official Portal Preview
                  </button>
                </div>
              </div>

              {viewMode === 'table' ? (
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => { setTableSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Filter names, reg no, date..."
                    className="w-full px-3 py-1.5 pl-8 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                  <Search size={13} className="absolute left-2.5 top-2 text-slate-400" />
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-600">
                  Showing official portal signed register for <strong className="text-blue-900">{gpName}</strong>
                </div>
              )}
            </div>

            {viewMode === 'preview' ? (
              /* Authentic Official Portal Replica Preview */
              <div className="p-4 sm:p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl overflow-x-auto font-serif">
                <table width="100%" border={0} className="text-center mb-3">
                  <tbody>
                    <tr>
                      <td className="font-bold text-sm sm:text-base text-blue-950 uppercase tracking-wide">
                        UNIFIED BIRTH &amp; DEATH REGISTRATION-MANAGEMENT INFORMATION SYSTEM<br />
                        {selectedState === 'TS' ? 'GOVERNMENT OF TELANGANA' : 'GOVERNMENT OF ANDHRA PRADESH'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="100%" border={0} className="text-center mb-3">
                  <tbody>
                    <tr className="text-xs sm:text-sm font-semibold text-slate-800">
                      <td>
                        {registerType === 'BIR' ? 'Birth Register Details' : 'Death Register Details'} for the Local Body &nbsp; &nbsp; Gram Panchayat:&nbsp; <b>{gpName}</b> as on {new Date().toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="px-4 py-1 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 text-xs font-bold border border-slate-400 rounded cursor-pointer"
                  >
                    Export
                  </button>
                </div>
                <table width="100%" border={1} className="border-collapse border border-slate-400 text-xs bg-white text-left">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 font-bold border border-slate-400">
                      <th className="p-2 text-center border border-slate-400">Sl. No</th>
                      <th className="p-2 border border-slate-400">Reg. No</th>
                      <th className="p-2 border border-slate-400">Reg. Year</th>
                      <th className="p-2 border border-slate-400">Reg. Date</th>
                      <th className="p-2 border border-slate-400">{registerType === 'DEA' ? 'Date of Death' : 'Date of Birth'}</th>
                      <th className="p-2 border border-slate-400">Gender</th>
                      <th className="p-2 border border-slate-400">{registerType === 'DEA' ? 'Deceased Name' : 'Child Name'}</th>
                      <th className="p-2 border border-slate-400">{registerType === 'DEA' ? 'Relative Name' : 'Mother Name'}</th>
                      {registerType === 'BIR' && (
                        <th className="p-2 border border-slate-400">Father Name</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.length > 0 ? (
                      currentRecords.map((r, idx) => (
                        <tr key={idx} className="border border-slate-300">
                          <td className="p-2 text-center border border-slate-300">{r.sno || idx + 1}</td>
                          <td className="p-2 border border-slate-300">{r.regNo || "-"}</td>
                          <td className="p-2 border border-slate-300">{r.regYear || "-"}</td>
                          <td className="p-2 border border-slate-300">{r.regDate || "-"}</td>
                          <td className="p-2 border border-slate-300">{r.dob || r.dod || "-"}</td>
                          <td className="p-2 border border-slate-300">{r.gender || "-"}</td>
                          <td className="p-2 font-bold border border-slate-300">{r.childName || r.deceasedName || "-"}</td>
                          <td className="p-2 border border-slate-300">{r.motherName || r.relativeName || "-"}</td>
                          {registerType === 'BIR' && (
                            <td className="p-2 border border-slate-300">{r.fatherName || "-"}</td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={registerType === 'BIR' ? 9 : 8} className="p-6 text-center text-slate-500 font-bold">
                          No registered records found for Gram Panchayat #{activeUnitId} in this register.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (

            {/* The Authentic Government UBDMIS Table */}
            <div className="border border-blue-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-blue-900 text-white font-bold border-b border-blue-950">
                      <th className="p-3 text-center w-12 border-r border-blue-800">Sl. No</th>
                      <th className="p-3 border-r border-blue-800">Reg. No</th>
                      <th className="p-3 border-r border-blue-800">Reg. Year</th>
                      <th className="p-3 border-r border-blue-800">Reg. Date</th>
                      <th className="p-3 border-r border-blue-800">
                        {registerType === 'DEA' ? 'Date of Death' : 'Date of Birth'}
                      </th>
                      <th className="p-3 border-r border-blue-800">Gender</th>
                      <th className="p-3 border-r border-blue-800">
                        {registerType === 'DEA' ? 'Deceased Name' : 'Child Name'}
                      </th>
                      <th className="p-3 border-r border-blue-800">
                        {registerType === 'DEA' ? 'Relative Name' : 'Mother Name'}
                      </th>
                      {registerType === 'BIR' && (
                        <th className="p-3">Father Name</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {paginatedRecords.length > 0 ? (
                      paginatedRecords.map((r, idx) => (
                        <tr 
                          key={idx}
                          className={`hover:bg-blue-50/80 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                        >
                          <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-200">
                            {r.sno || (currentPage - 1) * recordsPerPage + idx + 1}
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-700 border-r border-slate-200">
                            {r.regNo || "-"}
                          </td>
                          <td className="p-3 font-bold text-slate-800 border-r border-slate-200">
                            {r.regYear || "-"}
                          </td>
                          <td className="p-3 text-slate-700 border-r border-slate-200">
                            {r.regDate || "-"}
                          </td>
                          <td className="p-3 text-slate-700 font-semibold border-r border-slate-200">
                            {r.dob || r.dod || "-"}
                          </td>
                          <td className="p-3 border-r border-slate-200">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              r.gender?.toLowerCase() === 'female' 
                                ? 'bg-pink-100 text-pink-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {r.gender || "-"}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                            {r.childName || r.deceasedName || "-"}
                          </td>
                          <td className="p-3 text-slate-700 border-r border-slate-200">
                            {r.motherName || r.relativeName || "-"}
                          </td>
                          {registerType === 'BIR' && (
                            <td className="p-3 text-slate-700">
                              {r.fatherName || "-"}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={registerType === 'BIR' ? 9 : 8} className="p-8 text-center text-slate-500 font-bold">
                          No matching records found.
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
                    Page {currentPage} of {totalPages} ({filteredRecords.length} total entries)
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
          )}
        </>
      )}
      </div>
    </div>
  );
}

export default UBDTracker;