import React, { useState, useMemo } from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  GitCompare,
  Layers,
  Wand2,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Table,
  RefreshCw,
  FileText,
  ArrowRightLeft,
} from "lucide-react";
import XLSX from "xlsx-js-style";
import { ExcelMerger } from "./ExcelMerger";

interface CompareResult {
  headers: string[];
  keyColumn: string;
  matching: Record<string, any>[];
  missingOrDeleted: Record<string, any>[];
  newRecords: Record<string, any>[];
  modified: Record<string, any>[];
  duplicates: Record<string, any>[];
}

export function ExcelStudioManager({
  user,
  addToast,
}: {
  user?: any;
  addToast: (msg: string) => void;
}) {
  const [activeStudioTab, setActiveStudioTab] = useState<
    "compare" | "merge_append" | "transform_clean" | "formula_assistant"
  >("compare");

  // --- TAB 1: COMPARE TWO / MULTIPLE EXCEL FILES ---
  const [fileAName, setFileAName] = useState<string>("");
  const [fileARows, setFileARows] = useState<Record<string, any>[]>([]);
  const [fileAHeaders, setFileAHeaders] = useState<string[]>([]);

  const [fileBName, setFileBName] = useState<string>("");
  const [fileBRows, setFileBRows] = useState<Record<string, any>[]>([]);
  const [fileBHeaders, setFileBHeaders] = useState<string[]>([]);

  const [selectedKeyCol, setSelectedKeyCol] = useState<string>("");
  const [comparePreviewTab, setComparePreviewTab] = useState<
    "matching" | "missingOrDeleted" | "newRecords" | "modified" | "duplicates"
  >("modified");

  // --- TAB 3: TRANSFORM & CLEAN STUDIO ---
  const [workFileName, setWorkFileName] = useState<string>("");
  const [workHeaders, setWorkHeaders] = useState<string[]>([]);
  const [workRows, setWorkRows] = useState<Record<string, any>[]>([]);
  const [selectedTransformCol, setSelectedTransformCol] = useState<string>("");
  const [secondTransformCol, setSecondTransformCol] = useState<string>("");
  const [splitDelimiter, setSplitDelimiter] = useState<string>(",");
  const [emptyCellSummary, setEmptyCellSummary] = useState<
    { column: string; emptyCount: number }[] | null
  >(null);

  const readExcelFileToRows = async (
    file: File
  ): Promise<{ headers: string[]; rows: Record<string, any>[] }> => {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, {
      defval: "",
    });
    const headers =
      rows.length > 0
        ? Object.keys(rows[0])
        : [];
    return { headers, rows };
  };

  const handleUploadFileA = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { headers, rows } = await readExcelFileToRows(file);
      setFileAName(file.name);
      setFileAHeaders(headers);
      setFileARows(rows);
      if (headers.length > 0 && !selectedKeyCol) {
        setSelectedKeyCol(headers[0]);
      }
      addToast(`File 1 (${file.name}) లోడ్ చేయబడింది (${rows.length} rows)`);
    } catch (err: any) {
      addToast(`File 1 లోపం: ${err?.message || "Invalid file"}`);
    }
  };

  const handleUploadFileB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { headers, rows } = await readExcelFileToRows(file);
      setFileBName(file.name);
      setFileBHeaders(headers);
      setFileBRows(rows);
      addToast(`File 2 (${file.name}) లోడ్ చేయబడింది (${rows.length} rows)`);
    } catch (err: any) {
      addToast(`File 2 లోపం: ${err?.message || "Invalid file"}`);
    }
  };

  const sharedHeaders = useMemo(() => {
    const set = new Set<string>([...fileAHeaders, ...fileBHeaders]);
    return Array.from(set);
  }, [fileAHeaders, fileBHeaders]);

  const compareResult = useMemo<CompareResult | null>(() => {
    if (fileARows.length === 0 || fileBRows.length === 0) return null;
    const keyCol = selectedKeyCol || fileAHeaders[0] || "";
    if (!keyCol) return null;

    const mapA = new Map<string, Record<string, any>>();
    const mapB = new Map<string, Record<string, any>>();
    const duplicates: Record<string, any>[] = [];

    fileARows.forEach((r, idx) => {
      const k = String(r[keyCol] ?? "").trim();
      const normKey = k ? k.toLowerCase() : `__row_a_${idx}`;
      if (k && mapA.has(normKey)) {
        duplicates.push({ Source_File: fileAName || "File 1", ...r });
      } else {
        mapA.set(normKey, r);
      }
    });

    fileBRows.forEach((r, idx) => {
      const k = String(r[keyCol] ?? "").trim();
      const normKey = k ? k.toLowerCase() : `__row_b_${idx}`;
      if (k && mapB.has(normKey)) {
        duplicates.push({ Source_File: fileBName || "File 2", ...r });
      } else {
        mapB.set(normKey, r);
      }
    });

    const matching: Record<string, any>[] = [];
    const missingOrDeleted: Record<string, any>[] = [];
    const newRecords: Record<string, any>[] = [];
    const modified: Record<string, any>[] = [];

    mapA.forEach((rowA, normKey) => {
      if (!mapB.has(normKey)) {
        missingOrDeleted.push(rowA);
      } else {
        const rowB = mapB.get(normKey)!;
        const changedCols: string[] = [];
        sharedHeaders.forEach((col) => {
          const valA = String(rowA[col] ?? "").trim();
          const valB = String(rowB[col] ?? "").trim();
          if (valA !== valB) {
            changedCols.push(`${col}: "${valA}" → "${valB}"`);
          }
        });

        if (changedCols.length === 0) {
          matching.push(rowB);
        } else {
          modified.push({
            ...rowB,
            Changed_Columns_Summary: changedCols.join(" | "),
          });
        }
      }
    });

    mapB.forEach((rowB, normKey) => {
      if (!mapA.has(normKey)) {
        newRecords.push(rowB);
      }
    });

    return {
      headers: sharedHeaders,
      keyColumn: keyCol,
      matching,
      missingOrDeleted,
      newRecords,
      modified,
      duplicates,
    };
  }, [fileARows, fileBRows, selectedKeyCol, fileAHeaders, sharedHeaders, fileAName, fileBName]);

  const handleDownloadComparisonWorkbook = () => {
    if (!compareResult) return;
    const wb = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([
      {
        "Metric (పోలిక విభాగం)": "Total Matching Records (సరిపోలినవి)",
        Count: compareResult.matching.length,
      },
      {
        "Metric (పోలిక విభాగం)":
          "Missing / Deleted Records (File 1 లో ఉండి File 2 లో లేనివి)",
        Count: compareResult.missingOrDeleted.length,
      },
      {
        "Metric (పోలిక విభాగం)":
          "New Records (File 2 లో కొత్తగా వచ్చినవి)",
        Count: compareResult.newRecords.length,
      },
      {
        "Metric (పోలిక విభాగం)":
          "Modified / Changed Records (విలువలు మారినవి)",
        Count: compareResult.modified.length,
      },
      {
        "Metric (పోలిక విభాగం)": "Duplicate Records (డూప్లికేట్ రికార్డులు)",
        Count: compareResult.duplicates.length,
      },
    ]);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary_Counts");

    const appendCategorySheet = (name: string, rows: Record<string, any>[]) => {
      const ws =
        rows.length > 0
          ? XLSX.utils.json_to_sheet(rows)
          : XLSX.utils.aoa_to_sheet([["No records in this category"]]);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    appendCategorySheet("Matching_Records", compareResult.matching);
    appendCategorySheet("Missing_Records", compareResult.missingOrDeleted);
    appendCategorySheet("New_Records", compareResult.newRecords);
    appendCategorySheet("Modified_Records", compareResult.modified);
    appendCategorySheet("Duplicate_Records", compareResult.duplicates);

    XLSX.writeFile(
      wb,
      `E_Vedhika_Comparison_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    addToast(
      "అన్ని పోలిక విభాగాలు వేర్వేరు షీట్లలో (Separate Sheets) కొత్త Excel ఫైల్‌గా డౌన్‌లోడ్ అయ్యాయి!"
    );
  };

  // --- TAB 3 HANDLERS: DATA CLEANING & TRANSFORMATION ---
  const handleUploadWorkFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { headers, rows } = await readExcelFileToRows(file);
      setWorkFileName(file.name);
      setWorkHeaders(headers);
      setWorkRows(rows);
      setEmptyCellSummary(null);
      if (headers.length > 0) {
        setSelectedTransformCol(headers[0]);
        setSecondTransformCol(headers[1] || headers[0]);
      }
      addToast(`${file.name} లోడ్ చేయబడింది (${rows.length} rows)`);
    } catch (err: any) {
      addToast(`లోపం: ${err?.message || "Invalid file"}`);
    }
  };

  const handleCleanWhitespace = () => {
    if (workRows.length === 0) return;
    const cleaned = workRows.map((row) => {
      const next: Record<string, any> = {};
      workHeaders.forEach((h) => {
        const val = row[h];
        next[h] =
          typeof val === "string" ? val.replace(/\s+/g, " ").trim() : val;
      });
      return next;
    });
    setWorkRows(cleaned);
    addToast("అన్ని సెల్స్‌లోని అదనపు ఖాళీలు (Extra Spaces) తొలగించబడ్డాయి!");
  };

  const handleRemoveDuplicates = () => {
    if (workRows.length === 0) return;
    const seen = new Set<string>();
    const deduped: Record<string, any>[] = [];
    workRows.forEach((r) => {
      const key = selectedTransformCol
        ? String(r[selectedTransformCol] ?? "").trim().toLowerCase()
        : JSON.stringify(r);
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(r);
      }
    });
    const removedCount = workRows.length - deduped.length;
    setWorkRows(deduped);
    addToast(`${removedCount} డూప్లికేట్ రికార్డులు తొలగించబడ్డాయి!`);
  };

  const handleDetectEmptyCells = () => {
    if (workRows.length === 0) return;
    const summary = workHeaders.map((h) => {
      const emptyCount = workRows.filter(
        (r) => String(r[h] ?? "").trim() === ""
      ).length;
      return { column: h, emptyCount };
    });
    setEmptyCellSummary(summary);
    addToast("ఖాళీ సెల్స్ (Empty Cells) తనిఖీ పూర్తయింది!");
  };

  const handleTransposeData = () => {
    if (workRows.length === 0) return;
    const aoa: any[][] = [
      workHeaders,
      ...workRows.map((r) => workHeaders.map((h) => r[h] ?? "")),
    ];
    const transposed: any[][] = aoa[0].map((_, colIndex) =>
      aoa.map((row) => row[colIndex])
    );
    const newHeaders = transposed[0].map((h: any, idx: number) =>
      String(h || `Col_${idx + 1}`)
    );
    const newRows = transposed.slice(1).map((r) => {
      const obj: Record<string, any> = {};
      newHeaders.forEach((h, i) => {
        obj[h] = r[i] ?? "";
      });
      return obj;
    });
    setWorkHeaders(newHeaders);
    setWorkRows(newRows);
    addToast("డేటా విజయవంతంగా Transpose (Rows ↔ Columns) చేయబడింది!");
  };

  const handleUnpivotColumns = () => {
    if (workRows.length === 0 || !selectedTransformCol) return;
    const idCol = selectedTransformCol;
    const valueCols = workHeaders.filter((h) => h !== idCol);
    const unpivoted: Record<string, any>[] = [];
    workRows.forEach((r) => {
      valueCols.forEach((col) => {
        unpivoted.push({
          [idCol]: r[idCol],
          Attribute_Column: col,
          Value: r[col],
        });
      });
    });
    setWorkHeaders([idCol, "Attribute_Column", "Value"]);
    setWorkRows(unpivoted);
    addToast(`డేటా విజయవంతంగా Unpivot చేయబడింది (${unpivoted.length} rows)!`);
  };

  const handleSplitColumn = () => {
    if (workRows.length === 0 || !selectedTransformCol) return;
    const delim = splitDelimiter || ",";
    const colA = `${selectedTransformCol}_Part1`;
    const colB = `${selectedTransformCol}_Part2`;
    const updatedRows = workRows.map((r) => {
      const raw = String(r[selectedTransformCol] ?? "");
      const parts = raw.split(delim);
      return {
        ...r,
        [colA]: (parts[0] || "").trim(),
        [colB]: parts.slice(1).join(delim).trim(),
      };
    });
    const nextHeaders = Array.from(new Set([...workHeaders, colA, colB]));
    setWorkHeaders(nextHeaders);
    setWorkRows(updatedRows);
    addToast(`"${selectedTransformCol}" కాలమ్ రెండు భాగాలుగా విభజించబడింది!`);
  };

  const handleCombineColumns = () => {
    if (
      workRows.length === 0 ||
      !selectedTransformCol ||
      !secondTransformCol
    )
      return;
    const combinedCol = `${selectedTransformCol}_${secondTransformCol}`;
    const updatedRows = workRows.map((r) => ({
      ...r,
      [combinedCol]: `${String(r[selectedTransformCol] ?? "").trim()} ${String(
        r[secondTransformCol] ?? ""
      ).trim()}`.trim(),
    }));
    const nextHeaders = Array.from(new Set([...workHeaders, combinedCol]));
    setWorkHeaders(nextHeaders);
    setWorkRows(updatedRows);
    addToast("రెండు కాలమ్స్ విజయవంతంగా కంబైన్ చేయబడ్డాయి!");
  };

  const handleExportTransformed = (format: "xlsx" | "csv") => {
    if (workRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(workRows, { header: workHeaders });
    const base = (workFileName || "Cleaned_Data").replace(/\.(xlsx|xls|csv)$/i, "");
    if (format === "xlsx") {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Processed_Data");
      XLSX.writeFile(wb, `${base}_Processed.xlsx`);
      addToast("కొత్త Excel (.xlsx) ఫైల్ డౌన్‌లోడ్ చేయబడింది!");
    } else {
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}_Processed.csv`;
      a.click();
      URL.revokeObjectURL(url);
      addToast("కొత్త CSV ఫైల్ డౌన్‌లోడ్ చేయబడింది!");
    }
  };

  const PANCHAYAT_FORMULAS = [
    {
      name: "VLOOKUP (రెండు షీట్ల మధ్య GP డేటా మ్యాచింగ్)",
      syntax: "=VLOOKUP(A2, Sheet2!$A$2:$E$500, 3, FALSE)",
      descTe:
        "మొదటి షీట్‌లోని GP పేరు లేదా ఆధార్/PPB నంబర్ (A2) ఆధారంగా రెండవ షీట్ నుండి 3వ కాలమ్ విలువను తీసుకురావడానికి.",
    },
    {
      name: "XLOOKUP (ఆధునిక ఎక్సెల్ లుకప్ - ఎర్రర్ లేకుండా)",
      syntax: '=XLOOKUP(A2, Sheet2!A:A, Sheet2!C:C, "Not Found")',
      descTe:
        "VLOOKUP కంటే సులభంగా ఎడమ లేదా కుడి వైపు కాలమ్‌ను వెతికి, దొరకకపోతే 'Not Found' అని చూపించడానికి.",
    },
    {
      name: "COUNTIF (హాజరైన కార్యదర్శుల సంఖ్య లెక్కింపు)",
      syntax: '=COUNTIF(D2:D150, "Present")',
      descTe:
        "హాజరు కాలమ్ (D2:D150) లో ఎంతమంది 'Present' అయ్యారో లెక్కించడానికి.",
    },
    {
      name: "COUNTIFS (మండలం + హాజరు రెండు షరతులతో లెక్కింపు)",
      syntax: '=COUNTIFS(B2:B500, "Ibrahimpatnam", D2:D500, "Present")',
      descTe:
        "ఒక నిర్దిష్ట మండలంలో ఎంతమంది Present అయ్యారో ఒకే ఫార్ములాతో లెక్కించడానికి.",
    },
    {
      name: "SUMIF (మండల వారీగా పన్ను వసూలు మొత్తం)",
      syntax: '=SUMIF(B2:B500, "Gajwel", F2:F500)',
      descTe:
        "గజ్వేల్ మండలానికి చెందిన అన్ని గ్రామ పంచాయతీల పన్ను వసూళ్ల (F కాలమ్) మొత్తాన్ని కూడటానికి.",
    },
    {
      name: "IF / IFS (DCB వసూలు శాతం ఆధారంగా గ్రేడ్)",
      syntax: '=IFS(G2>=90, "A+ Excellent", G2>=70, "B Good", TRUE, "Pending")',
      descTe:
        "పన్ను వసూలు శాతం 90% పైన ఉంటే A+, 70% పైన ఉంటే B, లేకపోతే Pending అని ఆటోమేటిక్‌గా చూపడానికి.",
    },
    {
      name: "INDEX & MATCH (ఫ్లెక్సిబుల్ 2-Way లుకప్)",
      syntax: "=INDEX(Sheet2!$C$2:$C$500, MATCH(A2, Sheet2!$A$2:$A$500, 0))",
      descTe:
        "ఎక్సెల్ పాత వెర్షన్లలో ఎడమవైపు ఉన్న కాలమ్ విలువను కూడా వేగంగా వెతకడానికి.",
    },
    {
      name: "TEXTJOIN (పెండింగ్ GPల పేర్లను కామాతో కలపడానికి)",
      syntax: '=TEXTJOIN(", ", TRUE, A2:A25)',
      descTe:
        "DSR లేదా MAS పెండింగ్ ఉన్న గ్రామ పంచాయతీల పేర్లను వాట్సాప్ మెసేజ్ కోసం ఒకే సెల్‌లో కామాతో కలపడానికి.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-[#0d3b66] via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/30 text-cyan-200 text-xs font-black">
            <FileSpreadsheet size={14} /> 28-IN-1 ADVANCED EXCEL FILE MANAGER & STUDIO
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            ఎక్సెల్ ఫైల్ మేనేజర్ & అడ్వాన్స్‌డ్ ఎక్సెల్ స్టూడియో (Excel Studio)
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            ఒరిజినల్ ఎక్సెల్ ఫైళ్లను ఎప్పుడూ ఓవర్‌రైట్ చేయకుండా (Non-Destructive Processing), రెండు లేదా అంతకంటే ఎక్కువ ఎక్సెల్ ఫైళ్ల పోలిక (Compare), మెర్జ్ (Merge), అన్‌పివట్ (Unpivot), ట్రాన్స్‌పోజ్ (Transpose), డూప్లికేట్ల తొలగింపు మరియు CSV కన్వర్షన్ ఒకే చోట.
          </p>
        </div>

        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            {
              id: "compare",
              label: "1. Compare Two Excel Files (పోలిక & Separate Sheets)",
              icon: GitCompare,
            },
            {
              id: "merge_append",
              label: "2. Merge Multiple Files & Combine Sheets",
              icon: Layers,
            },
            {
              id: "transform_clean",
              label: "3. Clean, Unpivot, Transpose, Split & CSV Studio",
              icon: Wand2,
            },
            {
              id: "formula_assistant",
              label: "4. Panchayat Formula Assistant (VLOOKUP / COUNTIFS)",
              icon: Calculator,
            },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveStudioTab(t.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  activeStudioTab === t.id
                    ? "bg-amber-400 text-slate-950 shadow-md"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/15"
                }`}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: COMPARE TWO EXCEL FILES */}
      {activeStudioTab === "compare" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-2">
                మొదటి ఎక్సెల్ ఫైల్ (File 1 - Base / Old File)
              </h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/40 rounded-2xl p-6 cursor-pointer text-center">
                <Upload size={28} className="text-blue-600 mb-2" />
                <span className="text-xs font-black text-slate-800">
                  {fileAName || "File 1 ఎంచుకోండి (.xlsx / .xls / .csv)"}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {fileARows.length > 0
                    ? `${fileARows.length} రికార్డులు లోడ్ అయ్యాయి`
                    : "Click to upload Base Excel"}
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleUploadFileA}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-2">
                రెండవ ఎక్సెల్ ఫైల్ (File 2 - Target / New File)
              </h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/40 rounded-2xl p-6 cursor-pointer text-center">
                <Upload size={28} className="text-indigo-600 mb-2" />
                <span className="text-xs font-black text-slate-800">
                  {fileBName || "File 2 ఎంచుకోండి (.xlsx / .xls / .csv)"}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {fileBRows.length > 0
                    ? `${fileBRows.length} రికార్డులు లోడ్ అయ్యాయి`
                    : "Click to upload Target Excel"}
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleUploadFileB}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {fileAHeaders.length > 0 && fileBHeaders.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs font-black text-slate-700">
                    పోలిక ఆధార కాలమ్ (Matching Key Column):
                  </label>
                  <select
                    value={selectedKeyCol}
                    onChange={(e) => setSelectedKeyCol(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-800 outline-none"
                  >
                    {fileAHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {compareResult && (
                  <button
                    type="button"
                    onClick={handleDownloadComparisonWorkbook}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Download size={16} /> 6 Separate Sheets తో Comparison Excel డౌన్‌లోడ్
                  </button>
                )}
              </div>

              {compareResult && (
                <>
                  {/* Comparison Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      {
                        id: "matching",
                        label: "Matching Records (సరిపోలినవి)",
                        count: compareResult.matching.length,
                        color: "bg-emerald-50 border-emerald-200 text-emerald-800",
                      },
                      {
                        id: "missingOrDeleted",
                        label: "Missing / Deleted (తొలగించబడినవి)",
                        count: compareResult.missingOrDeleted.length,
                        color: "bg-rose-50 border-rose-200 text-rose-800",
                      },
                      {
                        id: "newRecords",
                        label: "New Records (కొత్త రికార్డులు)",
                        count: compareResult.newRecords.length,
                        color: "bg-blue-50 border-blue-200 text-blue-800",
                      },
                      {
                        id: "modified",
                        label: "Modified Records (మారినవి)",
                        count: compareResult.modified.length,
                        color: "bg-amber-50 border-amber-200 text-amber-900",
                      },
                      {
                        id: "duplicates",
                        label: "Duplicate Records (డూప్లికేట్లు)",
                        count: compareResult.duplicates.length,
                        color: "bg-purple-50 border-purple-200 text-purple-800",
                      },
                    ].map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setComparePreviewTab(card.id as any)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          card.color
                        } ${
                          comparePreviewTab === card.id
                            ? "ring-2 ring-slate-900 shadow-md"
                            : "opacity-85 hover:opacity-100"
                        }`}
                      >
                        <span className="text-[11px] font-bold block">
                          {card.label}
                        </span>
                        <span className="text-2xl font-black mt-1 block">
                          {card.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Preview Table */}
                  <div className="overflow-x-auto max-h-[50vh] border border-slate-200 rounded-2xl">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead className="bg-slate-800 text-white sticky top-0">
                        <tr>
                          <th className="py-2.5 px-3 border-r border-slate-700">#</th>
                          {Object.keys(
                            (compareResult as any)[comparePreviewTab]?.[0] || {
                              Status: "",
                            }
                          ).map((h) => (
                            <th
                              key={h}
                              className="py-2.5 px-3 border-r border-slate-700 whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {((compareResult as any)[comparePreviewTab] || [])
                          .slice(0, 100)
                          .map((r: any, idx: number) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-bold text-slate-400">
                                {idx + 1}
                              </td>
                              {Object.keys(r).map((k) => (
                                <td
                                  key={k}
                                  className="py-2 px-3 whitespace-nowrap text-slate-700 font-medium"
                                >
                                  {String(r[k] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        {((compareResult as any)[comparePreviewTab] || []).length ===
                          0 && (
                          <tr>
                            <td
                              colSpan={10}
                              className="py-8 text-center text-slate-400 font-bold"
                            >
                              ఈ విభాగంలో రికార్డులు ఏవీ లేవు.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MERGE MULTIPLE EXCEL FILES (EXISTING + MULTI-SHEET) */}
      {activeStudioTab === "merge_append" && (
        <ExcelMerger user={user} addToast={addToast} />
      )}

      {/* TAB 3: DATA CLEANING, UNPIVOT, TRANSPOSE, SPLIT, COMBINE & CSV */}
      {activeStudioTab === "transform_clean" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-800">
                డేటా క్లీనింగ్, ట్రాన్స్‌పోజ్, అన్‌పివట్ & కాలమ్ టూల్స్
              </h3>
              <p className="text-xs text-slate-500">
                ఫైల్ అప్‌లోడ్ చేసి కావలసిన ఆపరేషన్ క్లిక్ చేసి కొత్త `.xlsx` లేదా `.csv` గా డౌన్‌లోడ్ చేసుకోండి.
              </p>
            </div>
            <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-2">
              <Upload size={15} /> ఎక్సెల్ / CSV ఫైల్ ఎంచుకోండి
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleUploadWorkFile}
                className="hidden"
              />
            </label>
          </div>

          {workRows.length > 0 && (
            <>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-600 block mb-1">
                    ప్రధాన కాలమ్ ఎంపిక (Primary Column):
                  </label>
                  <select
                    value={selectedTransformCol}
                    onChange={(e) => setSelectedTransformCol(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {workHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-600 block mb-1">
                    రెండవ కాలమ్ (Combine కోసం):
                  </label>
                  <select
                    value={secondTransformCol}
                    onChange={(e) => setSecondTransformCol(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {workHeaders.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-black text-slate-600 block mb-1">
                    Split Delimiter (విభజన గుర్తు):
                  </label>
                  <input
                    type="text"
                    value={splitDelimiter}
                    onChange={(e) => setSplitDelimiter(e.target.value)}
                    placeholder=", లేదా - లేదా /"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handleCleanWhitespace}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  ✨ Clean Extra Spaces (డేటా క్లీనింగ్)
                </button>
                <button
                  type="button"
                  onClick={handleRemoveDuplicates}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  🗑️ Remove Duplicates (డూప్లికేట్ల తొలగింపు)
                </button>
                <button
                  type="button"
                  onClick={handleDetectEmptyCells}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  🔍 Empty Cell Detection (ఖాళీ సెల్స్ గుర్తింపు)
                </button>
                <button
                  type="button"
                  onClick={handleTransposeData}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  🔄 Transpose Data (Rows ↔ Columns)
                </button>
                <button
                  type="button"
                  onClick={handleUnpivotColumns}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  📊 Unpivot Columns (Wide → Tall)
                </button>
                <button
                  type="button"
                  onClick={handleSplitColumn}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  ✂️ Split Column
                </button>
                <button
                  type="button"
                  onClick={handleCombineColumns}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-xl text-xs font-black cursor-pointer"
                >
                  🔗 Combine 2 Columns
                </button>
              </div>

              {emptyCellSummary && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <h4 className="text-xs font-black text-amber-900 mb-2">
                    కాలమ్ వారీగా ఖాళీ సెల్స్ నివేదిక (Empty Cells Report):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {emptyCellSummary.map((item) => (
                      <span
                        key={item.column}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-bold text-slate-700"
                      >
                        {item.column}:{" "}
                        <strong className="text-rose-600">
                          {item.emptyCount} empty
                        </strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600">
                  ప్రస్తుత రోస్: <strong>{workRows.length}</strong> | కాలమ్స్:{" "}
                  <strong>{workHeaders.length}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportTransformed("xlsx")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} /> Download New Excel (.xlsx)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportTransformed("csv")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText size={14} /> Convert to CSV (.csv)
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 4: FORMULA ASSISTANT */}
      {activeStudioTab === "formula_assistant" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PANCHAYAT_FORMULAS.map((f, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-sm font-black text-[#0d3b66]">{f.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {f.descTe}
                </p>
              </div>
              <div className="flex items-center justify-between gap-2 bg-slate-900 text-emerald-300 px-3.5 py-2.5 rounded-xl font-mono text-xs">
                <code className="truncate">{f.syntax}</code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(f.syntax);
                    addToast("ఫార్ములా కాపీ చేయబడింది!");
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-sans font-bold shrink-0 cursor-pointer flex items-center gap-1"
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ExcelStudioManager;
