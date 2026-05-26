import React, { useState } from "react";
import { FileSpreadsheet, FileUp, Download, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

export function ExcelMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mergedDataSummary, setMergedDataSummary] = useState<{ totalRows: number, totalCols: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError(null);
      setSuccess(null);
      setMergedDataSummary(null);
    }
  };

  const handleMergeAndDownload = async () => {
    if (files.length < 2) {
      setError("కనీసం 2 ఫైల్స్ ని ఎంచుకోండి. (Please select at least 2 files)");
      return;
    }

    setIsMerging(true);
    setError(null);
    setSuccess(null);

    try {
      let XLSX: any = null;
      XLSX = await import("xlsx");

      let allRows: any[] = [];
      let allKeys = new Set<string>();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(dataBuffer, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // defval ensures missing cells are empty strings
        rows.forEach(row => {
          Object.keys(row).forEach(key => allKeys.add(key));
          allRows.push(row);
        });
      }

      if (allRows.length === 0) {
        throw new Error("ఎంచుకున్న ఫైల్స్ లో ఎలాంటి డేటా లేదు. (No data found in selected files)");
      }

      // Ensure all columns are captured by providing the explicit header array
      const header = Array.from(allKeys);
      
      // Export as a new Excel file
      const ws = XLSX.utils.json_to_sheet(allRows, { header });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Merged Data");
      
      const fileName = `Merged_Excel_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setMergedDataSummary({ totalRows: allRows.length, totalCols: allKeys.size });
      setSuccess(`విజయవంతంగా ${files.length} ఫైల్స్ ని మెర్జ్ చేయబడ్డాయి. (Successfully merged ${files.length} files)`);
    } catch (e: any) {
      console.error("Excel Merge Error:", e);
      setError("మెర్జ్ చేయడంలో లోపం తలెత్తింది: " + (e.message || "Unknown error"));
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-100 text-green-700 rounded-xl">
          <FileSpreadsheet size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Bulk Excel Merger</h3>
          <p className="text-sm text-slate-500">ఎక్సెల్ ఫైల్స్ ను బల్క గా మెర్జ్ చేయండి (Merge multiple Excel files seamlessly)</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 transition-colors relative cursor-pointer group">
          <input
            type="file"
            multiple
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center text-center opacity-80 group-hover:opacity-100">
            <FileUp size={48} className="text-slate-400 mb-4 group-hover:text-blue-500 transition-colors" />
            <h4 className="text-base font-bold text-slate-700 mb-1">Click to Browse Data Files</h4>
            <p className="text-sm text-slate-500">Only .xlsx or .xls files. Choose multiple files.</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-sm font-bold text-slate-700 mb-2">
              ఎంచుకున్న ఫైల్స్ ({files.length}):
            </p>
            <ul className="text-xs text-slate-600 space-y-1 max-h-32 overflow-y-auto pl-4 list-disc">
              {files.map((f, i) => (
                <li key={i} className="truncate">{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100">
            <CheckCircle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">{success}</p>
              {mergedDataSummary && (
                <p className="text-xs mt-1 opacity-80">
                  Total Rows: {mergedDataSummary.totalRows} | Total Columns Maintained: {mergedDataSummary.totalCols}
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleMergeAndDownload}
          disabled={isMerging || files.length < 2}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
        >
          {isMerging ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              మెర్జింగ్ జరుగుతోంది... (Merging...)
            </>
          ) : (
            <>
              <Download size={20} />
              ఫైల్స్ మెర్జ్ చేసి డౌన్‌లోడ్ చేయండి
            </>
          )}
        </button>
      </div>
    </div>
  );
}
