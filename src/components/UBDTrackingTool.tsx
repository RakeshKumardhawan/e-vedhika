import React, { useState } from "react";
import { 
  Search, FileText, AlertCircle, ExternalLink, Download, 
  RefreshCw, CheckCircle2, Building, ShieldAlert, Sparkles, Filter
} from "lucide-react";
import * as XLSX from "xlsx";

export default function UBDTrackingTool({ addToast }: { addToast?: (msg: string) => void }) {
  const [section, setSection] = useState("Birth");
  const [unitId, setUnitId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [officialUrl, setOfficialUrl] = useState("");
  const [recordsData, setRecordsData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  async function searchRecords(e: React.FormEvent) {
    e.preventDefault();

    const id = unitId.trim();

    if (!/^\d+$/.test(id)) {
      setError("దయచేసి సరైన Unit ID (అంకెలు మాత్రమే) నమోదు చేయండి.");
      return;
    }

    setLoading(true);
    setError("");
    setOfficialUrl("");
    setRecordsData(null);
    setSearchTerm("");
    setCurrentPage(1);

    try {
      const response = await fetch("/api/ubd/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          section,
          unitId: id
        })
      });

      const contentType = response.headers.get("content-type") || "";
      let data: any = {};

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const textResp = await response.text();
        console.warn("[UBD Tracking] Received non-JSON response from server:", textResp.substring(0, 100));
        const isDeath = section === "Death" || section === "DEA" || String(section).toLowerCase().includes("death");
        const fallbackOfficialUrl = isDeath
          ? `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDEA_Details.do?officeCode=${id}&status=A&rlb_type=3&pstcode=35&style=bluetheme`
          : `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatusDetails.do?officeCode=${id}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
        
        data = {
          error: "తెలంగాణ ప్రభుత్వ UBDMIS పోర్టల్ (ubdmis.telangana.gov.in) తో నెట్‌వర్క్ కనెక్షన్ టైమౌట్ అయింది. అధికారిక సర్వర్ ఇంట్రానెట్/ఫైర్‌వాల్ సెక్యూరిటీ ఆంక్షల వల్ల నేరుగా డేటా రాలేదు. అధికారిక పేజీని నేరుగా ఓపెన్ చేసి చూడవచ్చు.",
          officialUrl: fallbackOfficialUrl
        };
      }

      if (data.officialUrl) {
        setOfficialUrl(data.officialUrl);
      }

      if (!response.ok || data.error) {
        throw new Error(
          data.error || data.message || "రికార్డులను పొందలేకపోయాము."
        );
      }

      setRecordsData(data);
      if (addToast) {
        addToast(`Unit ID [${id}] కొరకు ${data.totalRecords || 0} రికార్డులు కనుగొనబడ్డాయి!`);
      }
    } catch (err: any) {
      setError(
        err.message || "సర్వర్‌తో కనెక్షన్ విఫలమైంది."
      );
    } finally {
      setLoading(false);
    }
  }

  // Filter records locally if present
  const filteredRecords = React.useMemo(() => {
    if (!recordsData || !Array.isArray(recordsData.records)) return [];
    if (!searchTerm.trim()) return recordsData.records;
    const term = searchTerm.toLowerCase();
    return recordsData.records.filter((r: any) => 
      String(r.name || "").toLowerCase().includes(term) ||
      String(r.regNo || "").toLowerCase().includes(term) ||
      String(r.status || "").toLowerCase().includes(term) ||
      String(r.eventDate || "").toLowerCase().includes(term)
    );
  }, [recordsData, searchTerm]);

  // Paginated records
  const paginatedRecords = React.useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredRecords.slice(start, start + recordsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;

  const exportToExcel = () => {
    if (!filteredRecords || filteredRecords.length === 0) return;
    const excelData = filteredRecords.map((r: any, idx: number) => ({
      "S.No": r.sno || idx + 1,
      "Application/Reg No": r.regNo,
      "Name": r.name,
      "Date": r.eventDate,
      "Gender": r.gender,
      "Status": r.status,
      "Unit ID": unitId,
      "Section": section
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `UBD_${section}_Unit_${unitId}`);
    XLSX.writeFile(wb, `UBD_${section}_Unit_${unitId}_Report.xlsx`);
    if (addToast) addToast("Excel రిపోర్ట్ డౌన్‌లోడ్ చేయబడింది!");
  };

  return (
    <main className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-[11px] font-black uppercase tracking-widest border border-blue-500/30">
            <Sparkles size={12} className="text-blue-400" /> Official Telangana UBD MIS
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome to UBD Tracking Tool
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            తెలంగాణ జనన మరియు మరణ నమోదు వివరాల ట్రాకింగ్.
          </p>
        </div>
      </div>

      {/* Entry Form Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
        <form onSubmit={searchRecords} className="space-y-5">
          {/* Section Selection */}
          <div className="space-y-2">
            <label htmlFor="section" className="block text-xs font-black uppercase tracking-wider text-slate-700">
              నమోదు విభాగం (Section)
            </label>
            <div className="relative">
              <select
                id="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-3.5 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/80 font-bold text-slate-800 text-sm appearance-none shadow-xs cursor-pointer"
              >
                <option value="Birth">Birth — జననం</option>
                <option value="Death">Death — మరణం</option>
              </select>
              <div className="absolute right-4 top-4 pointer-events-none text-slate-500 text-xs font-bold">
                ▼
              </div>
            </div>
          </div>

          {/* Unit ID Input */}
          <div className="space-y-2">
            <label htmlFor="unitId" className="block text-xs font-black uppercase tracking-wider text-slate-700">
              Unit ID (ఆఫీస్ కోడ్)
            </label>
            <div className="relative">
              <input
                id="unitId"
                type="text"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                placeholder="Unit ID నమోదు చేయండి (ఉదా: 10209)"
                inputMode="numeric"
                required
                className="w-full p-3.5 pl-11 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/80 font-mono font-black text-slate-800 text-sm shadow-inner"
              />
              <Building size={18} className="absolute left-3.5 top-4 text-slate-400" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" /> వెతుకుతున్నాము...
              </>
            ) : (
              <>
                <Search size={18} /> Search Records
              </>
            )}
          </button>
        </form>

        {/* Error Banner */}
        {error && (
          <div role="alert" className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-rose-950">
                  స్టేటస్ సూచన / సమస్య వివరాలు
                </h4>
                <p className="text-xs font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            {/* Direct Official Link Fallback Button */}
            {officialUrl && (
              <div className="pt-2 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-rose-800">
                  అధికారిక UBDMIS పోర్టల్ ద్వారా నేరుగా చూడాలనుకుంటే:
                </span>
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  <ExternalLink size={14} /> అధికారిక UBDMIS పేజీ తెరవండి &rarr;
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      {recordsData && (
        <section className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 space-y-6">
          {/* Header Summary Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {section === "Birth" ? "జనన నమోదు వివరాలు" : "మరణ నమోదు వివరాలు"}
                </span>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-mono font-bold border border-slate-200">
                  Unit ID: {unitId}
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-800">
                {section === "Birth" ? "జనన నమోదు వివరాలు (Birth Records)" : "మరణ నమోదు వివరాలు (Death Records)"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportToExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Download size={14} /> Excel లోకి డౌన్‌లోడ్ (.xlsx)
              </button>
              {recordsData.officialUrl && (
                <a
                  href={recordsData.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <ExternalLink size={14} /> అధికారిక సోర్స్
                </a>
              )}
            </div>
          </div>

          {/* Search Filter Bar inside Results */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="ఫలితాలలో వెతకండి..."
                className="w-full p-2.5 pl-9 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 bg-white font-medium text-xs text-slate-800"
              />
              <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
            </div>

            <span className="text-xs font-bold text-slate-600">
              మొత్తం రికార్డులు: <strong className="text-blue-700 font-extrabold">{recordsData.totalRecords || filteredRecords.length}</strong>
            </span>
          </div>

          {/* Table View */}
          {filteredRecords.length > 0 ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800 text-white font-black border-b border-slate-700">
                      <th className="p-3 text-center w-12">S.No</th>
                      <th className="p-3">Application / Reg No</th>
                      <th className="p-3">పేరు (Name)</th>
                      <th className="p-3">నమోదు/సంఘటన తేదీ (Date)</th>
                      <th className="p-3">లింగం (Gender)</th>
                      <th className="p-3">స్టేటస్ (Status)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {paginatedRecords.map((r: any, idx: number) => (
                      <tr key={idx} className="hover:bg-blue-50/60 transition-colors">
                        <td className="p-3 text-center font-bold text-slate-500">
                          {r.sno || (currentPage - 1) * recordsPerPage + idx + 1}
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-700">
                          {r.regNo || "-"}
                        </td>
                        <td className="p-3 font-black text-slate-900">
                          {r.name || "-"}
                        </td>
                        <td className="p-3 text-slate-700 font-semibold">
                          {r.eventDate || "-"}
                        </td>
                        <td className="p-3 text-slate-700">
                          {r.gender || "-"}
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-md text-[11px] border border-emerald-200">
                            {r.status || "Approved / Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      &larr; Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <AlertCircle size={24} className="mx-auto text-slate-400" />
              <p>ఈ Unit ID కి సంబంధించి ఎటువంటి ప్రత్యక్ష రికార్డులు లభించలేదు.</p>
            </div>
          )}

          {/* Raw JSON Debug/Developer Payload View (as requested in sample component) */}
          <details className="p-4 bg-slate-900 text-slate-200 rounded-2xl text-xs font-mono">
            <summary className="cursor-pointer font-bold text-slate-400 hover:text-white">
              🛠️ Raw API Data Payload (JSON)
            </summary>
            <pre className="mt-3 overflow-x-auto p-3 bg-black/50 rounded-xl text-[11px] text-emerald-400">
              {JSON.stringify(recordsData, null, 2)}
            </pre>
          </details>
        </section>
      )}
    </main>
  );
}
