import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, RefreshCw } from "lucide-react";

export function MonthlyActivityFormatter({
  addToast,
}: {
  addToast: (msg: string) => void;
}) {
  const [data, setData] = useState<any[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const predefinedActivities = [
    "Nursery",
    "Plantation",
    "Vaikunta Dhamam",
    "Dump Yard",
    "Water Supply",
    "GP Meetings",
    "Gram Sabha",
    "Record Maintenance",
    "Approvals and Certificates",
    "Deaths",
    "Receipts",
    "Expenditure",
    "Cheque Details",
    "Salary Details",
    "VWSC Banl Balance",
    "MGNRE Bank Balance",
    "Payment of Electricity",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    try {
      const XLSX = await import("xlsx-js-style");
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (!result) return;
          const workbook = XLSX.read(result, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: ""
          });

          if (!rawData || rawData.length === 0) {
            addToast("Excel file is empty.");
            return;
          }

          let headerRowIndex = -1;
          let panchayatColIndex = -1;

          // 1. Find the header row by looking for Panchayat/Village/Gram/Name
          for (let i = 0; i < Math.min(rawData.length, 30); i++) {
            const row = rawData[i];
            if (!row) continue;
            for (let j = 0; j < Math.min(row.length, 10); j++) {
              const val = String(row[j] || "").toLowerCase().trim();
              if (val.includes("panchayat") || val.includes("gp name") || val.includes("gram") || val === "name" || val.includes("village") || val === "gp") {
                headerRowIndex = i;
                panchayatColIndex = j;
                break;
              }
            }
            if (panchayatColIndex !== -1) break;
          }

          // 2. Fallback: finding header row with most text
          if (headerRowIndex === -1) {
             let maxCols = 0;
             for (let i = 0; i < Math.min(rawData.length, 20); i++) {
                const row = rawData[i] || [];
                let textCols = 0;
                for (let j=0; j<row.length; j++) if (String(row[j]).trim().length > 0) textCols++;
                if (textCols > maxCols && textCols > 2) {
                   maxCols = textCols;
                   headerRowIndex = i;
                }
             }
          }
          if (headerRowIndex === -1) headerRowIndex = 0;

          // 3. Fallback: guessing the panchayat name column (Find a column with mostly non-numeric strings)
          if (panchayatColIndex === -1) {
            let bestCol = 0;
            let maxStrings = 0;
            for(let c=0; c < 5; c++) {
               let strCount = 0;
               for(let r=headerRowIndex+1; r < Math.min(rawData.length, headerRowIndex+20); r++) {
                  const val = String(rawData[r]?.[c] || "").trim();
                  if (val.length > 2 && isNaN(Number(val))) strCount++;
               }
               if (strCount > maxStrings) {
                  maxStrings = strCount;
                  bestCol = c;
               }
            }
            panchayatColIndex = bestCol;
          }

          const headers = rawData[headerRowIndex] || [];
          const rows = rawData.slice(headerRowIndex + 1);

          let foundActivities: string[] = [];
          let activityColMapping: Record<string, number> = {};

          for (let j = panchayatColIndex + 1; j < headers.length; j++) {
            const valStr = String(headers[j] || "").trim();
            // Ignore empty headers and common non-activity headers
            if (valStr.length > 0 && !valStr.toLowerCase().includes("total") && !valStr.toLowerCase().includes("blank") && !valStr.toLowerCase().includes("entered")) {
              if (!foundActivities.includes(valStr)) {
                 foundActivities.push(valStr);
                 activityColMapping[valStr] = j;
              }
            }
          }

          // If headers couldn't be parsed properly, use predefined and just take columns sequentially
          if (foundActivities.length === 0) {
             foundActivities = predefinedActivities;
             foundActivities.forEach((act, idx) => {
                activityColMapping[act] = panchayatColIndex + 1 + idx;
             });
          }

          const parsedData = rows.map((row, idx) => {
              const pNameVal = row[panchayatColIndex];
              const pName = String(pNameVal || "").trim();
              
              // Filter out invalid names (e.g. empty, pure numbers, headers, totals, single chars)
              if (pName === "" || pName.length < 2 || !isNaN(Number(pName)) || pName.toLowerCase().includes("total") || pName.toLowerCase().includes("grand") || pName.toLowerCase().includes("panchayat")) {
                 return null;
              }

              const record: any = {
                "S.No": 0, // Assigned later
                "Panchayat Name": pNameVal,
              };

              foundActivities.forEach((act) => {
                const colIdx = activityColMapping[act];
                const val = row[colIdx];
                
                let isEntered = false;
                const vStr = String(val || "").trim().toLowerCase();
                
                if (
                   vStr === "1" || 
                   vStr === "yes" || 
                   vStr === "entered" || 
                   vStr === "y" || 
                   vStr === "true" ||
                   vStr === "done"
                ) {
                  isEntered = true;
                } else if (!isNaN(Number(vStr)) && Number(vStr) > 0) {
                  isEntered = true; 
                } else if (vStr.length > 0 && vStr !== "0" && vStr !== "no" && vStr !== "not entered" && vStr !== "n" && vStr !== "false" && vStr !== "-") {
                  isEntered = true;
                }

                record[act] = {
                  Entered: isEntered ? 1 : 0,
                  NotEntered: isEntered ? 0 : 1,
                };
              });
              
              return record;
            }).filter(Boolean);

          if (parsedData.length === 0) {
             const debugInfo = JSON.stringify(rawData.slice(0, 5));
             addToast(`Parsing Error: Data could not be mapped. Header detected at row ${headerRowIndex}.`);
             console.error("RAW DATA:", debugInfo);
             return;
          }

          // Resequence valid rows
          parsedData.forEach((row, i) => row["S.No"] = i + 1);

          setActivities(foundActivities);
          setData(parsedData);
          if (fileRef.current) fileRef.current.value = ""; // reset for next upload

        } catch (innerErr: any) {
          console.error("Inner Parsing Error:", innerErr);
          addToast("Parsing Error: " + (innerErr?.message || "Unknown error"));
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error(err);
      addToast("Failed to initialize parser: " + (err?.message || "Unknown Error"));
    }
  };

  const handleExport = async () => {
    if (!data.length) return;
    try {
      const XLSX = await import("xlsx-js-style");
      
      const ws_data: any[][] = [];
      const headerRow1 = ["Telangana State"];
      const headerRow2 = ["Monthly Activity Data Entry Report"];
      
      const headerRow3 = ["S.No", "Panchayat Name"];
      const headerRow4 = ["", ""];
      
      activities.forEach((act) => {
        headerRow3.push(act, ""); // Span 2 cols
        headerRow4.push("Entered", "Not Entered");
      });

      ws_data.push(headerRow1);
      ws_data.push(headerRow2);
      ws_data.push(headerRow3);
      ws_data.push(headerRow4);

      let totals: Record<string, { entered: number; notEntered: number }> = {};
      activities.forEach((act) => {
        totals[act] = { entered: 0, notEntered: 0 };
      });

      data.forEach((row, idx) => {
        const sheetRow: any[] = [idx + 1, row["Panchayat Name"]];
        
        activities.forEach((act) => {
          const actData = row[act] || { Entered: 0, NotEntered: 0 };
          sheetRow.push(actData.Entered, actData.NotEntered);
          totals[act].entered += actData.Entered || 0;
          totals[act].notEntered += actData.NotEntered || 0;
        });
        
        ws_data.push(sheetRow);
      });

      // Total Row
      const totalRow: any[] = ["Total", ""];
      activities.forEach((act) => {
        totalRow.push(totals[act].entered, totals[act].notEntered);
      });
      ws_data.push(totalRow);

      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // Add Merges
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 2 + activities.length * 2 - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 2 + activities.length * 2 - 1 } },
        { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } }, // S.No
        { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } }, // Panchayat Name
      ];
      
      activities.forEach((_, idx) => {
        const startCol = 2 + idx * 2;
        merges.push({ s: { r: 2, c: startCol }, e: { r: 2, c: startCol + 1 } });
      });

      ws["!merges"] = merges;

      // Apply styles
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1:A1");
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: R };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          if (!ws[cellRef]) ws[cellRef] = { t: "s", v: "" };

          const cell = ws[cellRef];
          let bgColor = "FFFFFF";
          let fontColor = "000000";
          let isBold = false;
          
          if (R === 0 || R === 1) {
            bgColor = "1E5F99";
            fontColor = "FFFFFF";
            isBold = true;
          } else if (R === 2 || R === 3) {
            bgColor = "F2F2F2";
            isBold = true;
          } else if (R === range.e.r) {
            isBold = true; // Total Row
          } else {
             // Data Rows styling logic similar to screenshot
             if (C >= 2) {
               const val = cell.v || 0;
               const isEnteredCol = C % 2 === 0;
               if (val === 1 && isEnteredCol) bgColor = "92D050";
               else if (val === 1 && !isEnteredCol) bgColor = "FF0000";
               else if (val === 0 && !isEnteredCol) {
                 // check if preceding Entered was 0, if yes, color yellow
                 const prevCellRef = XLSX.utils.encode_cell({ c: C-1, r: R });
                 const prevVal = ws[prevCellRef]?.v || 0;
                 if (prevVal === 0) {
                     // sometimes yellow
                     bgColor = "FFFF00";
                 }
               }
             }
          }

          cell.s = {
            font: { bold: isBold, color: { rgb: fontColor } },
            fill: { fgColor: { rgb: bgColor } },
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Activity Report");
      XLSX.writeFile(wb, "Formatted_Activity_Report.xlsx");
      addToast("File exported successfully");
    } catch (err) {
      console.error(err);
      addToast("Failed to export file.");
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 mt-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="text-indigo-600" /> E-Panchayat Monthly Activity Report
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Upload raw data file to generate a styled state report.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            ref={fileRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Upload size={18} />
            {fileName ? "Change File" : "Upload Raw File"}
          </button>
          
          {data.length > 0 && (
             <button
               onClick={handleExport}
               className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30"
             >
               <Download size={18} />
               Export Styled Excel
             </button>
          )}
        </div>
      </div>

      {!data.length ? (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-[24px] p-16 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-6">
            <Upload size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-700 mb-2">Upload Raw Data File</h3>
          <p className="text-slate-500 font-medium">Select a CSV or Excel file to format</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 hide-scrollbar pb-6">
          <div className="inline-block min-w-max">
            <table className="w-full border-collapse bg-white text-xs font-medium">
              <thead>
                <tr>
                  <th
                    colSpan={2 + activities.length * 2}
                    className="bg-[#0b3b66] text-white p-3 border border-[#000000] text-center font-bold"
                  >
                    Telangana State
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={2 + activities.length * 2}
                    className="bg-[#0b3b66] text-white p-3 border border-[#000000] text-center font-bold"
                  >
                    Monthly Activity Data Entry Report
                  </th>
                </tr>
                <tr>
                  <th rowSpan={2} className="p-2 border border-[#000000] bg-slate-50 text-center font-bold text-slate-800">S.No</th>
                  <th rowSpan={2} className="p-2 border border-[#000000] bg-slate-50 text-center font-bold text-slate-800">Panchayat Name</th>
                  {activities.map((a, i) => (
                    <th key={i} colSpan={2} className="p-2 border border-[#000000] bg-[#0b3b66] text-white text-center font-bold">
                      {a}
                    </th>
                  ))}
                </tr>
                <tr>
                  {activities.map((_, i) => (
                    <React.Fragment key={`sub-${i}`}>
                      <th className="p-2 border border-[#000000] bg-slate-100 text-center text-[10px] uppercase font-bold text-slate-800">Entered</th>
                      <th className="p-2 border border-[#000000] bg-slate-100 text-center text-[10px] uppercase font-bold text-slate-800">Not Entered</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2 border border-[#000000] text-center w-12">{idx + 1}</td>
                    <td className="p-2 border border-[#000000] whitespace-nowrap px-4 font-bold text-slate-700">{row["Panchayat Name"]}</td>
                    {activities.map((act, actIdx) => {
                      const entry = row[act] || { Entered: 0, NotEntered: 0 };
                      
                      let entColor = "transparent";
                      if (entry.Entered === 1) entColor = "#92d050";
                      else if (entry.Entered === 0 && entry.NotEntered === 1) entColor = "#ffff00"; // Example logic for yellow

                      let nEntColor = "transparent";
                      if (entry.NotEntered === 1) nEntColor = "#ff0000";
                      
                      return (
                        <React.Fragment key={`${idx}-${actIdx}`}>
                          <td 
                            className="p-2 border border-[#000000] text-center font-bold text-black"
                            style={{ backgroundColor: entColor }}
                          >
                            {entry.Entered}
                          </td>
                          <td 
                            className="p-2 border border-[#000000] text-center font-bold text-black"
                            style={{ backgroundColor: nEntColor }}
                          >
                            {entry.NotEntered}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="p-3 border border-[#000000] text-right font-black text-slate-800 bg-slate-100">
                    Total
                  </td>
                  {activities.map((act, idx) => {
                    const totalEnt = data.reduce((acc, row) => acc + (row[act]?.Entered || 0), 0);
                    const totalNEnt = data.reduce((acc, row) => acc + (row[act]?.NotEntered || 0), 0);
                    return (
                      <React.Fragment key={`tot-${idx}`}>
                        <td className="p-2 border border-[#000000] text-center font-black bg-slate-100">{totalEnt}</td>
                        <td className="p-2 border border-[#000000] text-center font-black bg-slate-100">{totalNEnt}</td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
