import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowUpDown, 
  Filter,
  RefreshCw,
  HelpCircle,
  Database
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface UnsupportedExcelViewerProps {
  addToast: (msg: string) => void;
}

export function UnsupportedExcelViewer({ addToast }: UnsupportedExcelViewerProps) {
  const [fileData, setFileData] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [fileTypeDetected, setFileTypeDetected] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'diagnostics'>('preview');

  // Load Sample HTML .xls (Govt Portal format simulation)
  const loadSampleHtmlXls = () => {
    setIsLoading(true);
    setFileName('sample_gov_portal_report.xls');
    setFileTypeDetected('Government Portal HTML-based .xls (<table><tr><td>)');
    
    setTimeout(() => {
      const sampleHtmlData = [
        ['S.No', 'District', 'Mandal', 'Panchayat Name', 'Secretary Name', 'DSR Status', 'Attendance %', 'Last Updated'],
        ['1', 'Rangareddy', 'Shabad', 'Thimmapur', 'K. Ramesh Kumar', 'Submitted', '95.5%', '14-Nov-2026 08:30 AM'],
        ['2', 'Rangareddy', 'Shabad', 'Chetgur', 'M. Venkat Reddy', 'Pending', '0.0%', '14-Nov-2026 09:15 AM'],
        ['3', 'Medchal', 'Medchal', 'Kandlakoya', 'P. Srilatha', 'Submitted', '100.0%', '14-Nov-2026 08:00 AM'],
        ['4', 'Sangareddy', 'Patancheru', 'Ibrahimpur', 'B. Suresh Goud', 'Submitted', '92.0%', '14-Nov-2026 08:45 AM'],
        ['5', 'Warangal', 'Hasanparthy', 'Devunur', 'Ch. Padma', 'Leave', '0.0%', '13-Nov-2026 05:00 PM'],
      ];
      setHeaders(sampleHtmlData[0]);
      setFileData(sampleHtmlData.slice(1));
      setIsLoading(false);
      addToast('సఫలీకృతమైంది! సాంపుల్ గవర్నమెంట్ HTML .xls ఫైల్ లోడ్ చేయబడింది.');
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);

    const reader = new FileReader();
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'xls' || ext === 'html' || ext === 'htm' || file.type.includes('html') || file.type.includes('text')) {
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          // Check if it's HTML table based .xls
          if (content.includes('<table') || content.includes('<TR') || content.includes('<td')) {
            setFileTypeDetected('HTML-Based .xls Table Format (Govt Portal Export)');
            
            // Parse HTML tables using DOMParser
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const tables = doc.querySelectorAll('table');
            
            if (tables.length > 0) {
              // Pick the largest table by row count
              let bestTable = tables[0];
              let maxRows = 0;
              tables.forEach(t => {
                const rows = t.querySelectorAll('tr').length;
                if (rows > maxRows) {
                  maxRows = rows;
                  bestTable = t;
                }
              });

              const extractedRows: any[][] = [];
              bestTable.querySelectorAll('tr').forEach(tr => {
                const rowCells: string[] = [];
                tr.querySelectorAll('th, td').forEach(cell => {
                  rowCells.push(cell.textContent?.trim() || '');
                });
                if (rowCells.length > 0) {
                  extractedRows.push(rowCells);
                }
              });

              if (extractedRows.length > 0) {
                setHeaders(extractedRows[0]);
                setFileData(extractedRows.slice(1));
                addToast(`విజయవంతంగా ${extractedRows.length - 1} రికార్డులు ఎక్స్‌ట్రాక్ట్ చేయబడ్డాయి!`);
              } else {
                throw new Error('No table rows found in HTML');
              }
            } else {
              throw new Error('No HTML tables found');
            }
          } else {
            // Standard CSV or text parse
            setFileTypeDetected('Plain Text / CSV Format');
            const lines = content.split('\n').map(l => l.split(',').map(c => c.trim().replace(/^["']|["']$/g, '')));
            if (lines.length > 0) {
              setHeaders(lines[0]);
              setFileData(lines.slice(1).filter(l => l.length > 1));
            }
          }
        } catch (err: any) {
          console.error(err);
          addToast('ఫైల్ పార్సింగ్ ఎర్రర్: ఇది వాలిడ్ HTML లేదా ఎక్సెల్ టేబుల్ కాదు.');
          setFileTypeDetected('Unsupported / Corrupted Format');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    } else {
      // Binary .xls or .xlsx via SheetJS
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          setFileTypeDetected(ext === 'xls' ? 'Binary BIFF8 .xls Format' : 'OpenXML .xlsx Format');
          if (json.length > 0) {
            setHeaders(json[0].map(String));
            setFileData(json.slice(1).filter(row => row.some(cell => cell !== '')));
            addToast('బైనరీ ఎక్సెల్ ఫైల్ విజయవంతంగా ఓపెన్ చేయబడింది!');
          }
        } catch (err: any) {
          console.error(err);
          addToast('బైనరీ ఎక్సెల్ ఫైల్ రీడ్ చేయడంలో విఫలమైంది.');
          setFileTypeDetected('Corrupted or Encrypted Excel');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const filteredData = fileData.filter(row => {
    if (!searchTerm) return true;
    return row.some(cell => String(cell).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const exportCleanExcel = () => {
    if (fileData.length === 0) {
      addToast('ఎక్స్పోర్ట్ చేయడానికి డేటా లేదు!');
      return;
    }
    const wsData = [headers, ...fileData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ConvertedSheet");
    XLSX.writeFile(wb, `E_Vedhika_Converted_${fileName || 'report'}.xlsx`);
    addToast('క్లీన్ .xlsx ఫైల్ విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!');
  };

  const exportCleanCsv = () => {
    if (fileData.length === 0) return;
    const wsData = [headers, ...fileData];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `E_Vedhika_Converted_${fileName || 'report'}.csv`;
    link.click();
    addToast('CSV ఫైల్ విజయవంతంగా డౌన్‌లోడ్ చేయబడింది!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <FileSpreadsheet size={14} /> ప్రభుత్వ పోర్టల్ HTML .xls వ్యూయర్ & కన్వర్టర్
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Unsupported / HTML Excel File Viewer
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
            గ్రామ పంచాయతీ మరియు ప్రభుత్వ పోర్టల్స్ నుండి డౌన్‌లోడ్ చేసినప్పుడు సాధారణ MS Excel లో ఓపెన్ అవ్వకుండా "File format and extension don't match" అని ఎర్రర్ వచ్చే HTML-based .xls, Binary .xls మరియు .xlsx ఫైళ్లను బ్రౌజర్‌లో నేరుగా ఓపెన్ చేసి క్లీన్ .xlsx లేదా CSV గా మార్చుకోండి.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={loadSampleHtmlXls}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={15} /> సాంపుల్ HTML .xls లోడ్ చేయండి
          </button>
        </div>
      </div>

      {/* Upload Zone & Diagnostics bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              ఎక్సెల్ లేదా HTML .xls ఫైల్‌ని ఎంచుకోండి (Select File)
            </label>
            <input
              type="file"
              accept=".xls,.xlsx,.html,.htm,.csv,text/html,application/vnd.ms-excel"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-200 rounded-xl p-2 bg-slate-50/50"
            />
          </div>
          {fileName && (
            <div className="flex flex-col gap-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500">ఫైల్ పేరు (File Name): <strong className="text-slate-900">{fileName}</strong></span>
              <span className="text-[11px] font-bold text-blue-700">గుర్తించిన ఫార్మాట్: <strong>{fileTypeDetected}</strong></span>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-600">ఫైల్ విశ్లేషించబడుతోంది (Parsing file contents)...</p>
          </div>
        )}

        {!isLoading && fileData.length > 0 && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="ఫైల్‌లో డేటాను వెతకండి (Search records)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-slate-600">
                  మొత్తం రికార్డులు: <strong className="text-blue-700">{filteredData.length}</strong>
                </span>
                <button
                  onClick={exportCleanExcel}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download size={14} /> క్లీన్ .xlsx డౌన్‌లోడ్
                </button>
                <button
                  onClick={exportCleanCsv}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileText size={14} /> CSV డౌన్‌లోడ్
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer size={14} /> ప్రింట్
                </button>
              </div>
            </div>

            {/* Table Preview */}
            <div className="border border-slate-200 rounded-2xl overflow-x-auto shadow-xs bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-black">
                    <th className="p-3 border-r border-slate-200 w-12 text-center">#</th>
                    {headers.map((h, idx) => (
                      <th key={idx} className="p-3 border-r border-slate-200 font-bold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-700">
                  {filteredData.slice(0, 100).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-blue-50/50 transition-colors">
                      <td className="p-3 border-r border-slate-200 text-center text-slate-400 font-mono text-[11px]">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 border-r border-slate-200 whitespace-nowrap">
                          {String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length > 100 && (
                <div className="p-3 bg-slate-50 text-center text-xs font-bold text-slate-500 border-t border-slate-200">
                  ప్రదర్శన కోసం మొదటి 100 రికార్డులు మాత్రమే చూపబడుతున్నాయి (మొత్తం: {filteredData.length}). పూర్తి డేటా కోసం .xlsx డౌన్‌లోడ్ చేయండి.
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoading && fileData.length === 0 && !fileName && (
          <div className="py-16 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
              <Database size={32} />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1">ఫైల్ ఇంకా ఎంచుకోబడలేదు</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              పైన ఉన్న ఫైల్ అప్‌లోడ్ బాక్స్ ద్వారా లేదా "సాంపుల్ HTML .xls లోడ్ చేయండి" బటన్ ద్వారా మీ నివేదికను పరిశీలించండి.
            </p>
            <button
              onClick={loadSampleHtmlXls}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              సాంపుల్ ఫైల్‌తో టెస్ట్ చేయండి
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
