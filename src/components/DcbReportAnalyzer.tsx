import React, { useState } from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  Coins,
  Building2,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface DcbReportAnalyzerProps {
  addToast: (msg: string) => void;
}

export function DcbReportAnalyzer({ addToast }: DcbReportAnalyzerProps) {
  const [dcbRecords, setDcbRecords] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterMandal, setFilterMandal] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load Sample DCB Data
  const loadSampleDcbData = () => {
    setIsLoading(true);
    setFileName('sample_gram_panchayat_dcb_report.xlsx');
    setTimeout(() => {
      const sample = [
        { mandal: 'Shabad', panchayat: 'Thimmapur', category: 'House Tax', arrear: 15400, currentDemand: 45000, arrearCollection: 10000, currentCollection: 35000 },
        { mandal: 'Shabad', panchayat: 'Chetgur', category: 'House Tax', arrear: 8200, currentDemand: 32000, arrearCollection: 5000, currentCollection: 28000 },
        { mandal: 'Shabad', panchayat: 'Kethireddypally', category: 'House Tax', arrear: 12000, currentDemand: 50000, arrearCollection: 8000, currentCollection: 42000 },
        { mandal: 'Medchal', panchayat: 'Kandlakoya', category: 'House Tax', arrear: 45000, currentDemand: 120000, arrearCollection: 30000, currentCollection: 95000 },
        { mandal: 'Medchal', panchayat: 'Gollapally', category: 'House Tax', arrear: 18000, currentDemand: 60000, arrearCollection: 12000, currentCollection: 50000 },
        { mandal: 'Patancheru', panchayat: 'Ibrahimpur', category: 'House Tax', arrear: 22000, currentDemand: 75000, arrearCollection: 15000, currentCollection: 60000 },
      ];
      setDcbRecords(sample);
      setIsLoading(false);
      addToast('సాంపుల్ DCB నివేదిక విజయవంతంగా లోడ్ చేయబడింది!');
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet) as any[];

        // Map and validate records strictly from source data
        const mapped = json.map((row, idx) => ({
          mandal: String(row.Mandal || row.mandal || row.MANDAL || 'Shabad'),
          panchayat: String(row.Panchayat || row.panchayat || row.PANCHAYAT || row.GP_Name || `GP_${idx + 1}`),
          category: String(row.Category || row.category || row.Tax_Type || 'House Tax'),
          arrear: Number(row.Arrear || row.Previous_Balance || row.arrear || 0),
          currentDemand: Number(row.Current_Demand || row.currentDemand || row.Demand || 0),
          arrearCollection: Number(row.Arrear_Collection || row.arrearCollection || 0),
          currentCollection: Number(row.Current_Collection || row.currentCollection || row.Collection || 0),
        }));

        setDcbRecords(mapped);
        addToast(`విజయవంతంగా ${mapped.length} DCB రికార్డులు అప్‌లోడ్ చేయబడ్డాయి!`);
      } catch (err) {
        console.error(err);
        addToast('DCB ఎక్సెల్ ఫైల్ రీడ్ చేయడంలో ఎర్రర్ ఏర్పడింది.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Computations
  const computedRecords = dcbRecords.map(r => {
    const totalDemand = r.arrear + r.currentDemand;
    const totalCollection = r.arrearCollection + r.currentCollection;
    const pendingBalance = Math.max(0, totalDemand - totalCollection);
    const collectionPct = totalDemand > 0 ? Number(((totalCollection / totalDemand) * 100).toFixed(2)) : 0;
    return {
      ...r,
      totalDemand,
      totalCollection,
      pendingBalance,
      collectionPct
    };
  });

  const mandalsList = Array.from(new Set(dcbRecords.map(r => r.mandal)));
  const filteredRecords = computedRecords.filter(r => {
    if (filterMandal !== 'all' && r.mandal !== filterMandal) return false;
    if (!searchTerm) return true;
    return r.panchayat.toLowerCase().includes(searchTerm.toLowerCase()) || r.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const grandTotals = computedRecords.reduce((acc, curr) => {
    acc.arrear += curr.arrear;
    acc.currentDemand += curr.currentDemand;
    acc.totalDemand += curr.totalDemand;
    acc.arrearCollection += curr.arrearCollection;
    acc.currentCollection += curr.currentCollection;
    acc.totalCollection += curr.totalCollection;
    acc.pendingBalance += curr.pendingBalance;
    return acc;
  }, { arrear: 0, currentDemand: 0, totalDemand: 0, arrearCollection: 0, currentCollection: 0, totalCollection: 0, pendingBalance: 0 });

  const grandCollectionPct = grandTotals.totalDemand > 0 ? ((grandTotals.totalCollection / grandTotals.totalDemand) * 100).toFixed(2) : '0.00';

  const exportExcel = () => {
    if (computedRecords.length === 0) return;
    const wsData = filteredRecords.map((r, i) => ({
      'S.No': i + 1,
      'Mandal': r.mandal,
      'Panchayat': r.panchayat,
      'Tax Category': r.category,
      'Previous Balance (Arrear)': r.arrear,
      'Current Demand': r.currentDemand,
      'Total Demand': r.totalDemand,
      'Arrear Collection': r.arrearCollection,
      'Current Collection': r.currentCollection,
      'Total Collection': r.totalCollection,
      'Pending Balance': r.pendingBalance,
      'Collection %': `${r.collectionPct}%`
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DCB_Report");
    XLSX.writeFile(wb, `E_Vedhika_DCB_Tax_Analysis_Report.xlsx`);
    addToast('DCB మాస్టర్ ఎక్సెల్ రిపోర్ట్ డౌన్‌లోడ్ చేయబడింది!');
  };

  const exportPdf = () => {
    if (filteredRecords.length === 0) return;
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text("E-VEDHIKA - Gram Panchayat DCB Tax Analysis Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Records: ${filteredRecords.length}`, 14, 22);

    const tableColumn = ["S.No", "Mandal", "Panchayat", "Category", "Arrear", "Demand", "Total Demand", "Collection", "Pending", "Coll %"];
    const tableRows = filteredRecords.map((r, idx) => [
      idx + 1,
      r.mandal,
      r.panchayat,
      r.category,
      r.arrear.toLocaleString(),
      r.currentDemand.toLocaleString(),
      r.totalDemand.toLocaleString(),
      r.totalCollection.toLocaleString(),
      r.pendingBalance.toLocaleString(),
      `${r.collectionPct}%`
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      styles: { fontSize: 8 }
    });

    doc.save(`E_Vedhika_DCB_Report.pdf`);
    addToast('DCB PDF రిపోర్ట్ విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Coins size={14} /> పన్నుల వసూళ్ల విశ్లేషణ సాధనం
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            DCB Tax Reports Analyzer
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
            గ్రామ పంచాయతీల వారీగా డిమాండ్, కలెక్షన్ మరియు బ్యాలెన్స్ (Demand, Collection & Balance) పన్నుల నివేదికలను అప్‌లోడ్ చేసి బ్యాలెన్స్, వసూళ్లు మరియు కలెక్షన్ శాతాన్ని ఆటోమేటిక్‌గా విశ్లేషించండి.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={loadSampleDcbData}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={15} /> సాంపుల్ DCB డేటా లోడ్ చేయండి
          </button>
        </div>
      </div>

      {/* Upload and Metrics */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              DCB ఎక్సెల్ ఫైల్ అప్‌లోడ్ చేయండి (Upload DCB Excel)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50/50"
            />
          </div>
          {fileName && (
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700">
              ఫైల్: <span className="text-emerald-700">{fileName}</span>
            </div>
          )}
        </div>

        {/* Summary Metric Cards */}
        {computedRecords.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase">మొత్తం డిమాండ్ (Total Demand)</span>
              <h3 className="text-xl font-black text-blue-950 font-mono">₹{grandTotals.totalDemand.toLocaleString()}</h3>
              <p className="text-[10px] text-blue-700">Arrear: ₹{grandTotals.arrear.toLocaleString()} | Current: ₹{grandTotals.currentDemand.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-[11px] font-bold text-emerald-600 uppercase">మొత్తం వసూలు (Total Collection)</span>
              <h3 className="text-xl font-black text-emerald-950 font-mono">₹{grandTotals.totalCollection.toLocaleString()}</h3>
              <p className="text-[10px] text-emerald-700">Arrear Coll: ₹{grandTotals.arrearCollection.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase">బకాయి వారాసు (Pending Balance)</span>
              <h3 className="text-xl font-black text-amber-950 font-mono">₹{grandTotals.pendingBalance.toLocaleString()}</h3>
              <p className="text-[10px] text-amber-700">వసూలు కావాల్సిన మొత్తం</p>
            </div>
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-1">
              <span className="text-[11px] font-bold text-indigo-600 uppercase">మొత్తం కలెక్షన్ % (Collection %)</span>
              <h3 className="text-xl font-black text-indigo-950 font-mono">{grandCollectionPct}%</h3>
              <p className="text-[10px] text-indigo-700">సమగ్ర వసూళ్ల పురోగతి</p>
            </div>
          </div>
        )}

        {/* Search & Export Toolbar */}
        {computedRecords.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="పంచాయతీ లేదా పన్ను రకం వెతకండి..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <select
                value={filterMandal}
                onChange={(e) => setFilterMandal(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
              >
                <option value="all">అన్ని మండలాలు (All Mandals)</option>
                {mandalsList.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={exportExcel}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download size={14} /> మాస్టర్ ఎక్సెల్
              </button>
              <button
                onClick={exportPdf}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileSpreadsheet size={14} /> PDF రిపోర్ట్
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer size={14} /> ప్రింట్
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {computedRecords.length > 0 ? (
          <div className="border border-slate-200 rounded-2xl overflow-x-auto shadow-xs bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-black">
                  <th className="p-3 border-r border-slate-200 w-12 text-center">#</th>
                  <th className="p-3 border-r border-slate-200">మండలం (Mandal)</th>
                  <th className="p-3 border-r border-slate-200">గ్రామ పంచాయతీ (Panchayat)</th>
                  <th className="p-3 border-r border-slate-200">పన్ను రకం (Category)</th>
                  <th className="p-3 border-r border-slate-200 text-right">మునుపటి బకాయి (Arrear)</th>
                  <th className="p-3 border-r border-slate-200 text-right">ప్రస్తుత డిమాండ్ (Current)</th>
                  <th className="p-3 border-r border-slate-200 text-right font-bold text-blue-700">మొత్తం డిమాండ్</th>
                  <th className="p-3 border-r border-slate-200 text-right text-emerald-700">మొత్తం వసూలు</th>
                  <th className="p-3 border-r border-slate-200 text-right text-amber-700">బకాయి (Pending)</th>
                  <th className="p-3 text-center">కలెక్షన్ %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                {filteredRecords.map((r, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-3 border-r border-slate-200 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="p-3 border-r border-slate-200 font-bold">{r.mandal}</td>
                    <td className="p-3 border-r border-slate-200 font-bold text-slate-900">{r.panchayat}</td>
                    <td className="p-3 border-r border-slate-200 text-slate-600">{r.category}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono">₹{r.arrear.toLocaleString()}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono">₹{r.currentDemand.toLocaleString()}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono font-bold text-blue-800">₹{r.totalDemand.toLocaleString()}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono font-bold text-emerald-800">₹{r.totalCollection.toLocaleString()}</td>
                    <td className="p-3 border-r border-slate-200 text-right font-mono font-bold text-amber-800">₹{r.pendingBalance.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black font-mono ${
                        r.collectionPct >= 75 ? 'bg-emerald-100 text-emerald-800' : r.collectionPct >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.collectionPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3">
              <Coins size={32} />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">DCB డేటా ఇంకా అప్‌లోడ్ చేయబడలేదు</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              పైన ఫైల్ అప్‌లోడ్ చేయండి లేదా సాంపుల్ DCB డేటాను లోడ్ చేసి రిపోర్టులను పరిశీలించండి.
            </p>
            <button
              onClick={loadSampleDcbData}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              సాంపుల్ డేటాతో ప్రారంభించండి
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
