import React, { useState, useRef, useMemo } from "react";
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  RefreshCw, 
  Printer, 
  FileText, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Sparkles, 
  CheckCheck,
  CheckSquare
} from "lucide-react";

export function MonthlyActivityFormatter({
  addToast,
}: {
  addToast: (msg: string) => void;
}) {
  const [data, setData] = useState<any[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [nameHeader, setNameHeader] = useState("Mandal Name");
  const [uploadDateTime, setUploadDateTime] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Form State for Manual Data Entry & Editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formTotalGps, setFormTotalGps] = useState("");
  const [formActivities, setFormActivities] = useState<Record<string, { entered: string; notEntered: string }>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});

  const predefinedActivities = [
    "Nursery",
    "Plantation",
    "Vaikunta Dhamam",
    "Dump Yard",
    "Water Supply",
    "GP Meetings",
    "Gram Sabha",
    "Record",
    "Approvals and",
    "Deaths",
    "Recipts",
    "Expenditure",
    "Cheque Details",
    "Salary Details",
    "VWSC Banl Balance",
    "MGNRE Bank",
    "Payment of",
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
    const defaultUploadDateTime = `${day}-${month}-${year} ${formattedTime}`;

    try {
      const XLSX = await import("xlsx-js-style");
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (!result) return;

          let rawData: any[][] = [];

          // 1. Try HTML table decoding first if file contains HTML markup
          try {
            const textDecoder = new TextDecoder("utf-8");
            const decodedText = textDecoder.decode(result as ArrayBuffer);

            if (decodedText.includes("<table") || decodedText.includes("<tr") || decodedText.includes("<td")) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(decodedText, "text/html");
              const htmlRows: string[][] = [];

              doc.querySelectorAll("tr").forEach((tr) => {
                const rowCells: string[] = [];
                tr.querySelectorAll("th, td").forEach((cell) => {
                  const cellText = (cell.textContent || "").trim();
                  const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
                  rowCells.push(cellText);
                  for (let k = 1; k < colspan; k++) {
                    rowCells.push("");
                  }
                });
                if (rowCells.some((c) => c.length > 0)) {
                  htmlRows.push(rowCells);
                }
              });

              if (htmlRows.length > 0) {
                rawData = htmlRows;
              }
            }
          } catch (htmlErr) {
            console.warn("DOMParser HTML check skipped:", htmlErr);
          }

          // 2. Fallback to standard XLSX array parsing if not HTML
          if (!rawData || rawData.length === 0) {
            const workbook = XLSX.read(result, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            rawData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: ""
            });
          }

          if (!rawData || rawData.length === 0) {
            addToast("Excel ఫైల్ ఖాళీగా ఉంది.");
            return;
          }

          // Detect any date/time in header rows (0-5) or fallback to upload date & time
          let detectedDateTime = defaultUploadDateTime;
          for (let i = 0; i < Math.min(rawData.length, 6); i++) {
            const rowText = (rawData[i] || []).join(" ");
            const match = rowText.match(/(?:date|as on|report date|on)?[:\s]*(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp][Mm])?)?)/i);
            if (match && match[1] && match[1].length >= 8) {
              detectedDateTime = match[1].trim();
              break;
            }
          }
          setUploadDateTime(detectedDateTime);

          let headerRowIndex = -1;
          let panchayatColIndex = -1;
          let totalGpColIndex = -1;
          let detectedHeaderName = "Mandal Name";

          // Find the header row by looking for Panchayat/Mandal/Village/Gram/Name or 'S.No'
          for (let i = 0; i < Math.min(rawData.length, 30); i++) {
            const row = rawData[i];
            if (!row) continue;
            for (let j = 0; j < Math.min(row.length, 10); j++) {
              const val = String(row[j] || "").toLowerCase().trim();
              if (val.includes("mandal") || val.includes("panchayat") || val.includes("gp name") || val.includes("gram") || val === "name" || val.includes("village") || val === "gp" || val === "s.no" || val === "sl.no") {
                headerRowIndex = i;
                break;
              }
            }
            if (headerRowIndex !== -1) break;
          }

          // Fallback if header row not found
          if (headerRowIndex === -1) {
             for (let i = 0; i < Math.min(rawData.length, 10); i++) {
                const row = rawData[i];
                if (row && row.length > 3) {
                   headerRowIndex = i;
                   break;
                }
             }
          }
          if (headerRowIndex === -1) headerRowIndex = 0;

          // Specifically find the Name column and Total No. of GPs column in header row
          const headerRow = rawData[headerRowIndex] || [];
          for (let j = 0; j < Math.min(headerRow.length, 10); j++) {
            const val = String(headerRow[j] || "").toLowerCase().trim();
            if (val.includes("mandal")) {
              panchayatColIndex = j;
              detectedHeaderName = "Mandal Name";
            } else if (val.includes("panchayat") || val.includes("gp name") || val.includes("gram") || val.includes("village")) {
              if (panchayatColIndex === -1) {
                panchayatColIndex = j;
                detectedHeaderName = "Panchayat Name";
              }
            }
            if (val.includes("total no") || val.includes("total gp") || val.includes("total no. of gp") || val === "total gps") {
              totalGpColIndex = j;
            }
          }

          // If not found explicitly, determine based on data sample
          if (panchayatColIndex === -1) {
            const col0Header = String(headerRow[0] || "").toLowerCase().trim();
            const sampleDataCol0 = String(rawData[headerRowIndex + 1]?.[0] || "").trim();
            if (col0Header.includes("s.no") || col0Header.includes("sl.no") || !isNaN(Number(sampleDataCol0))) {
              panchayatColIndex = 1;
            } else {
              panchayatColIndex = 0;
            }
          }

          if (totalGpColIndex === -1 && panchayatColIndex + 1 < headerRow.length) {
            const nextHeader = String(headerRow[panchayatColIndex + 1] || "").toLowerCase().trim();
            if (nextHeader.includes("total") || nextHeader.includes("gp") || nextHeader.includes("no")) {
              totalGpColIndex = panchayatColIndex + 1;
            }
          }

          setNameHeader(detectedHeaderName);

          let foundActivities: string[] = [];
          let activityColMapping: Record<string, number> = {};

          // Extract activities by scanning rows prior to headerRowIndex
          for (let r = 0; r < headerRowIndex; r++) {
            const row = rawData[r] || [];
            row.forEach((cellVal: any, cIdx: number) => {
              const val = String(cellVal || "").trim();
              if (
                val.length > 1 &&
                !val.toLowerCase().includes("telangana") &&
                !val.toLowerCase().includes("report") &&
                !val.toLowerCase().includes("panchayat") &&
                !val.toLowerCase().includes("mandal") &&
                !val.toLowerCase().includes("s.no") &&
                !val.toLowerCase().includes("sl.no") &&
                !val.toLowerCase().includes("total")
              ) {
                if (!foundActivities.includes(val)) {
                  foundActivities.push(val);
                }
                if (activityColMapping[val] === undefined) {
                  activityColMapping[val] = cIdx;
                }
              }
            });
          }

          // Fallback to predefined activities if scanning prior rows produced no activities
          if (foundActivities.length === 0) {
             foundActivities = predefinedActivities;
             const startOffset = totalGpColIndex !== -1 ? totalGpColIndex + 1 : panchayatColIndex + 1;
             foundActivities.forEach((act, idx) => {
                activityColMapping[act] = startOffset + (idx * 2);
             });
          }

          const rows = rawData.slice(headerRowIndex + 1);

          const parsedData = rows.map((row) => {
              let pNameVal = row[panchayatColIndex];
              let pName = String(pNameVal || "").trim();

              // Fallback: If pName is numeric (e.g. S.No like 1, 2, 3), inspect column panchayatColIndex + 1
              if (!isNaN(Number(pName)) && pName !== "") {
                const altVal = String(row[panchayatColIndex + 1] ?? row[1] ?? "").trim();
                if (altVal && isNaN(Number(altVal))) {
                  pName = altVal;
                  pNameVal = altVal;
                }
              }
              
              // Clean name (strip leading serial numbers)
              let cleanPName = pName.replace(/^[\d\s.\-)]+/, "").trim();
              if (!cleanPName) cleanPName = pName.trim();
              const lowerPName = cleanPName.toLowerCase();

              // Filter out invalid non-data rows
              if (
                !cleanPName ||
                cleanPName.length < 2 ||
                /^\d+$/.test(cleanPName) ||
                lowerPName.includes("grand") ||
                lowerPName.includes("report") ||
                lowerPName.includes("telangana") ||
                lowerPName.includes("total") ||
                lowerPName.includes("subtotal") ||
                lowerPName.includes("sub-total") ||
                lowerPName.includes("summary") ||
                lowerPName.includes("panchayat name") ||
                lowerPName.includes("mandal name") ||
                lowerPName.includes("gp name") ||
                lowerPName.includes("gram panchayat") ||
                lowerPName.includes("attendance") ||
                lowerPName.includes("designation") ||
                lowerPName.includes("page ") ||
                lowerPName.includes("printed") ||
                lowerPName.includes("generated") ||
                lowerPName.startsWith("mandal:") ||
                lowerPName.startsWith("mandal name:") ||
                lowerPName === "s.no" ||
                lowerPName === "sl.no" ||
                lowerPName === "s no" ||
                lowerPName === "sl no" ||
                lowerPName === "nil" ||
                lowerPName === "null" ||
                lowerPName === "n/a" ||
                lowerPName === "na"
              ) {
                 return null;
              }

              const record: any = {
                "S.No": 0, // Assigned later
                "Panchayat Name": cleanPName.toUpperCase(),
                "TotalGPs": 0,
              };

              let explicitTotalGps = 0;
              if (totalGpColIndex !== -1 && row[totalGpColIndex] !== undefined) {
                const parsedNum = parseInt(String(row[totalGpColIndex]).replace(/[^\d]/g, ""), 10);
                if (!isNaN(parsedNum) && parsedNum > 0) {
                  explicitTotalGps = parsedNum;
                }
              }

              foundActivities.forEach((act) => {
                const colIdx = activityColMapping[act] ?? (panchayatColIndex + 1 + (foundActivities.indexOf(act) * 2));
                const val = row[colIdx];
                const notVal = row[colIdx + 1];
                
                const vStr = String(val || "").trim().toLowerCase();
                const vNum = parseInt(vStr.replace(/[^\d]/g, ""), 10);
                const notNum = parseInt(String(notVal || "0").replace(/[^\d]/g, ""), 10);

                let enteredCount = 0;
                let notEnteredCount = 0;

                if (!isNaN(vNum) && (vNum > 1 || !isNaN(notNum))) {
                  // Numerical report row (e.g. Mandal Summary row)
                  enteredCount = vNum;
                  notEnteredCount = isNaN(notNum) ? 0 : notNum;
                } else if (
                  vStr === "1" || 
                  vStr === "yes" || 
                  vStr === "entered" || 
                  vStr === "y" || 
                  vStr === "true" ||
                  vStr === "done" ||
                  vNum === 1
                ) {
                  enteredCount = 1;
                  notEnteredCount = 0;
                } else {
                  enteredCount = 0;
                  notEnteredCount = 1;
                }

                record[act] = {
                  Entered: enteredCount,
                  NotEntered: notEnteredCount,
                };
              });

              // Determine TotalGPs for this row
              if (explicitTotalGps > 0) {
                record["TotalGPs"] = explicitTotalGps;
              } else {
                let maxActivitySum = 0;
                foundActivities.forEach((act) => {
                  const actSum = (record[act]?.Entered || 0) + (record[act]?.NotEntered || 0);
                  if (actSum > maxActivitySum) maxActivitySum = actSum;
                });
                record["TotalGPs"] = maxActivitySum > 0 ? maxActivitySum : 1;
              }
              
              return record;
            }).filter(Boolean);

          if (parsedData.length === 0) {
             addToast(`డేటా మ్యాప్ కాలేదు. ఫైల్ హెడర్ సరైన స్థానంలో ఉందో లేదో చూడండి.`);
             return;
          }

          // Deduplicate rows by Name
          const uniqueMap = new Map<string, any>();
          parsedData.forEach((rec) => {
            if (!rec) return;
            const pKey = rec["Panchayat Name"];
            if (!uniqueMap.has(pKey)) {
              uniqueMap.set(pKey, rec);
            } else {
              const existing = uniqueMap.get(pKey);
              foundActivities.forEach((act) => {
                existing[act].Entered += rec[act]?.Entered || 0;
                existing[act].NotEntered += rec[act]?.NotEntered || 0;
              });
              existing["TotalGPs"] = Math.max(existing["TotalGPs"], rec["TotalGPs"]);
            }
          });

          const finalRows = Array.from(uniqueMap.values());
          finalRows.forEach((row, i) => row["S.No"] = i + 1);

          setActivities(foundActivities);
          setData(finalRows);
          addToast("ఫైల్ విజ‌య‌వంతంగా ప్రాసెస్ చేయబడింది!");
          if (fileRef.current) fileRef.current.value = ""; // reset for next upload

        } catch (innerErr: any) {
          console.error("Inner Parsing Error:", innerErr);
          addToast("Parsing Error: " + (innerErr?.message || "అపరిచిత పొరపాటు"));
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error(err);
      addToast("Failed to initialize parser: " + (err?.message || "Unknown Error"));
    }
  };

  // Styled Excel Export with Page Setup Properties
  const handleExportExcel = async () => {
    if (!data.length) return;
    try {
      const XLSX = await import("xlsx-js-style");
      
      const ws_data: any[][] = [];
      const headerRow1 = ["Telangana State"];
      const headerRow2 = [
        uploadDateTime
          ? `Monthly Activity Data Entry Report - (${uploadDateTime})`
          : "Monthly Activity Data Entry Report",
      ];
      
      const headerRow3 = ["S.No", nameHeader, "Total No. of Gp's"];
      const headerRow4 = ["", "", ""];
      
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

      let grandTotalGps = 0;

      data.forEach((row, idx) => {
        const totalGpsNum = Number(row["TotalGPs"] || 0);
        grandTotalGps += totalGpsNum;
        const sheetRow: any[] = [idx + 1, row["Panchayat Name"], totalGpsNum];
        
        activities.forEach((act) => {
          const actData = row[act] || { Entered: 0, NotEntered: 0 };
          sheetRow.push(actData.Entered, actData.NotEntered);
          totals[act].entered += actData.Entered || 0;
          totals[act].notEntered += actData.NotEntered || 0;
        });
        
        ws_data.push(sheetRow);
      });

      // Total Row
      const totalRow: any[] = ["Total", "", grandTotalGps];
      activities.forEach((act) => {
        totalRow.push(totals[act].entered, totals[act].notEntered);
      });
      ws_data.push(totalRow);

      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // Add Merges
      const totalCols = 3 + activities.length * 2;
      const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } }, // Telangana State
        { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } }, // Monthly Activity Data Entry Report
        { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } }, // S.No
        { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } }, // Panchayat/Mandal Name
        { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } }, // Total No. of Gp's
        { s: { r: ws_data.length - 1, c: 0 }, e: { r: ws_data.length - 1, c: 1 } }, // Merge "Total" across S.No & Name cols
      ];
      
      activities.forEach((_, idx) => {
        const startCol = 3 + idx * 2;
        merges.push({ s: { r: 2, c: startCol }, e: { r: 2, c: startCol + 1 } });
      });

      ws["!merges"] = merges;

      // Page Setup for Excel Print / Export
      ws["!pageSetup"] = {
        orientation: "landscape",
        paperSize: 9, // A4
        scale: 80,
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0
      };
      ws["!margins"] = { left: 0.25, right: 0.25, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };

      // Apply cell styling matching government blue (#11518E), green (#92D050), red (#FF0000)
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
          
          if (R === 0 || R === 1 || R === 2) {
            bgColor = "11518E"; // Government Blue
            fontColor = "FFFFFF";
            isBold = true;
          } else if (R === 3) {
            bgColor = "FFFFFF"; // White for Entered / Not Entered
            fontColor = "000000";
            isBold = true;
          } else if (R === range.e.r) {
            bgColor = "FFFFFF";
            fontColor = "000000";
            isBold = true; // Total Row
          } else {
             // Data Rows styling
             if (C >= 3) {
               const val = Number(cell.v || 0);
               const isEnteredCol = (C - 3) % 2 === 0;
               if (isEnteredCol) {
                 if (val > 0) {
                   bgColor = "92D050"; // Vibrant Green
                   isBold = true;
                 } else {
                   bgColor = "FFFFFF";
                 }
               } else {
                 if (val > 0) {
                   bgColor = "FF0000"; // Vibrant Red
                   fontColor = "FFFFFF";
                   isBold = true;
                 } else {
                   bgColor = "FFFFFF";
                 }
               }
             } else if (C === 1 || C === 2) {
               isBold = true;
             }
          }

          cell.s = {
            font: { bold: isBold, color: { rgb: fontColor }, name: "Arial", sz: 9 },
            fill: { fgColor: { rgb: bgColor } },
            alignment: { horizontal: C === 1 ? "left" : "center", vertical: "center" },
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
      XLSX.utils.book_append_sheet(wb, ws, "Monthly Activity Report");
      XLSX.writeFile(wb, "Monthly_Activity_Data_Entry_Report_PageSetup.xlsx");
      addToast("పేజీ సెటప్‌తో కూడిన స్టైల్డ్ ఎక్సెల్ ఫైల్ డౌన్లోడ్ అయింది!");
    } catch (err) {
      console.error(err);
      addToast("ఎక్సెల్ ఫైల్ జనరేట్ చేయడం సాధ్యపడలేదు.");
    }
  };

  // PDF Export with Landscape Page Setup
  const handleExportPdf = async () => {
    if (!data.length) return;
    try {
      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      const autoTable = (autoTableModule.default || autoTableModule) as any;

      const doc = new jsPDF("l", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Top Banners
      doc.setFillColor(17, 81, 142); // #11518E
      doc.rect(0, 0, pageWidth, 12, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("Telangana State", pageWidth / 2, 7.5, { align: "center" });

      doc.setFillColor(17, 81, 142);
      doc.rect(0, 12, pageWidth, 8, "F");
      doc.setFontSize(9);
      const pdfSubtitle = uploadDateTime
        ? `Monthly Activity Data Entry Report - (${uploadDateTime})`
        : "Monthly Activity Data Entry Report";
      doc.text(pdfSubtitle, pageWidth / 2, 17.5, { align: "center" });

      // Table Headers
      const head1: any[] = [
        { content: "S.No", rowSpan: 2, styles: { halign: "center", valign: "middle", fillColor: [17, 81, 142], textColor: [255, 255, 255] } },
        { content: nameHeader, rowSpan: 2, styles: { halign: "center", valign: "middle", fillColor: [17, 81, 142], textColor: [255, 255, 255] } },
        { content: "Total No. of Gp's", rowSpan: 2, styles: { halign: "center", valign: "middle", fillColor: [17, 81, 142], textColor: [255, 255, 255] } },
      ];

      activities.forEach((act) => {
        head1.push({
          content: act,
          colSpan: 2,
          styles: { halign: "center", valign: "middle", fillColor: [17, 81, 142], textColor: [255, 255, 255] },
        });
      });

      const head2: any[] = [];
      activities.forEach(() => {
        head2.push(
          { content: "Entered", styles: { halign: "center", fillColor: [255, 255, 255], textColor: [0, 0, 0] } },
          { content: "Not Entered", styles: { halign: "center", fillColor: [255, 255, 255], textColor: [0, 0, 0] } }
        );
      });

      const bodyRows: any[][] = [];
      let grandTotalGps = 0;

      data.forEach((row, idx) => {
        const totalGpsNum = Number(row["TotalGPs"] || 0);
        grandTotalGps += totalGpsNum;
        const r: any[] = [idx + 1, row["Panchayat Name"], totalGpsNum];
        activities.forEach((act) => {
          const entry = row[act] || { Entered: 0, NotEntered: 0 };
          r.push(entry.Entered, entry.NotEntered);
        });
        bodyRows.push(r);
      });

      // Total Row
      const totalsRow: any[] = ["Total", "", grandTotalGps];
      activities.forEach((act) => {
        const totalEnt = data.reduce((acc, r) => acc + (r[act]?.Entered || 0), 0);
        const totalNEnt = data.reduce((acc, r) => acc + (r[act]?.NotEntered || 0), 0);
        totalsRow.push(totalEnt, totalNEnt);
      });
      bodyRows.push(totalsRow);

      autoTable(doc, {
        startY: 22,
        head: [head1, head2],
        body: bodyRows,
        theme: "grid",
        styles: {
          fontSize: 5.5,
          cellPadding: 0.8,
          halign: "center",
          valign: "middle",
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          font: "helvetica",
          textColor: [0, 0, 0],
        },
        headStyles: {
          fontSize: 5.5,
          fontStyle: "bold",
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 26, halign: "left", fontStyle: "bold" },
          2: { cellWidth: 14, halign: "center", fontStyle: "bold" },
        },
        didParseCell: (dataCell) => {
          const { row, column } = dataCell;
          if (row.section === "body") {
            if (row.index === bodyRows.length - 1) {
              // Total Row
              dataCell.cell.styles.fontStyle = "bold";
              dataCell.cell.styles.fillColor = [240, 240, 240];
            } else if (column.index >= 3) {
              const val = Number(dataCell.cell.text[0] || 0);
              const isEnteredCol = (column.index - 3) % 2 === 0;
              if (isEnteredCol) {
                if (val > 0) {
                  dataCell.cell.styles.fillColor = [146, 208, 80]; // Green #92D050
                  dataCell.cell.styles.fontStyle = "bold";
                } else {
                  dataCell.cell.styles.fillColor = [255, 255, 255]; // White
                }
              } else {
                if (val > 0) {
                  dataCell.cell.styles.fillColor = [255, 0, 0]; // Red #FF0000
                  dataCell.cell.styles.textColor = [255, 255, 255];
                  dataCell.cell.styles.fontStyle = "bold";
                } else {
                  dataCell.cell.styles.fillColor = [255, 255, 255]; // White
                }
              }
            }
          }
        },
        didDrawPage: (dataArg) => {
          doc.setFontSize(6);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text("Telangana State • Monthly Activity Data Entry Report (A4 Landscape)", 10, pageHeight - 4);
          doc.text(`Page ${dataArg.pageNumber}`, pageWidth - 20, pageHeight - 4);
        },
      });

      doc.save("Monthly_Activity_Data_Entry_Report_A4.pdf");
      addToast("A4 ల్యాండ్‌స్కేప్ పేజీ సెటప్‌తో PDF డౌన్‌లోడ్ అయింది!");
    } catch (err) {
      console.error(err);
      addToast("PDF జనరేట్ చేయడం సాధ్యపడలేదు.");
    }
  };

  // Direct A4 Landscape Window Print
  const handlePrint = () => {
    if (!data.length) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const grandTotalGps = data.reduce((acc, row) => acc + (row["TotalGPs"] || 0), 0);

    let tableHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Telangana State - Monthly Activity Data Entry Report</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 4mm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 8px;
            background: #fff;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
          }
          th, td {
            border: 1px solid #000000;
            padding: 3px 2px;
            text-align: center;
          }
          .title-bg {
            background-color: #11518E !important;
            color: #ffffff !important;
            font-weight: bold;
            font-size: 13px;
          }
          .subtitle-bg {
            background-color: #11518E !important;
            color: #ffffff !important;
            font-weight: bold;
            font-size: 11px;
          }
          .act-header {
            background-color: #11518E !important;
            color: #ffffff !important;
            font-weight: bold;
            font-size: 9px;
          }
          .sub-header {
            background-color: #ffffff !important;
            color: #000000 !important;
            font-weight: bold;
            font-size: 8px;
          }
          .p-name {
            text-align: left;
            font-weight: bold;
            padding-left: 6px;
          }
          .cell-green {
            background-color: #92D050 !important;
            color: #000000 !important;
            font-weight: bold;
          }
          .cell-red {
            background-color: #FF0000 !important;
            color: #ffffff !important;
            font-weight: bold;
          }
          .cell-white {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .total-row {
            background-color: #ffffff !important;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th colspan="${3 + activities.length * 2}" class="title-bg">Telangana State</th>
            </tr>
            <tr>
              <th colspan="${3 + activities.length * 2}" class="subtitle-bg">Monthly Activity Data Entry Report ${uploadDateTime ? `- (${uploadDateTime})` : ""}</th>
            </tr>
            <tr>
              <th rowspan="2" class="act-header">S.No</th>
              <th rowspan="2" class="act-header">${nameHeader}</th>
              <th rowspan="2" class="act-header">Total No. of Gp's</th>
              ${activities.map((a) => `<th colspan="2" class="act-header">${a}</th>`).join("")}
            </tr>
            <tr>
              ${activities.map(() => `<th class="sub-header">Entered</th><th class="sub-header">Not Entered</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${data
              .map(
                (row, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td class="p-name">${row["Panchayat Name"]}</td>
                <td style="font-weight:bold;">${row["TotalGPs"] || 0}</td>
                ${activities
                  .map((act) => {
                    const entry = row[act] || { Entered: 0, NotEntered: 0 };
                    const entCls = entry.Entered > 0 ? "cell-green" : "cell-white";
                    const nEntCls = entry.NotEntered > 0 ? "cell-red" : "cell-white";
                    return `<td class="${entCls}">${entry.Entered}</td><td class="${nEntCls}">${entry.NotEntered}</td>`;
                  })
                  .join("")}
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td colspan="2" style="text-align: center; font-weight: bold;">Total</td>
              <td style="font-weight:bold;">${grandTotalGps}</td>
              ${activities
                .map((act) => {
                  const tEnt = data.reduce((acc, r) => acc + (r[act]?.Entered || 0), 0);
                  const tNEnt = data.reduce((acc, r) => acc + (r[act]?.NotEntered || 0), 0);
                  return `<td style="font-weight:bold;">${tEnt}</td><td style="font-weight:bold;">${tNEnt}</td>`;
                })
                .join("")}
            </tr>
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(tableHtml);
    printWindow.document.close();
  };

  const grandTotalGps = data.reduce((acc, row) => acc + (row["TotalGPs"] || 0), 0);

  // Active activities list for data entry
  const activeActivities = activities.length > 0 ? activities : predefinedActivities;

  // Real-time Form Validation states
  const isNameValid = formName.trim().length >= 2;
  const formTotalGpsNum = parseInt(formTotalGps, 10);
  const isTotalGpsValid = !isNaN(formTotalGpsNum) && formTotalGpsNum > 0;
  const isUploadDateTimeValid = uploadDateTime.trim().length >= 8;

  // Real-time calculation of activity counts validated
  const activitiesStatus = useMemo(() => {
    let completedCount = 0;
    activeActivities.forEach((act) => {
      const ent = parseInt(formActivities[act]?.entered || "0", 10) || 0;
      const notEnt = parseInt(formActivities[act]?.notEntered || "0", 10) || 0;
      if (isTotalGpsValid && ent + notEnt === formTotalGpsNum) {
        completedCount++;
      }
    });
    return {
      completedCount,
      totalActs: activeActivities.length,
      allMatched: isTotalGpsValid && completedCount === activeActivities.length,
      progressPercent: isTotalGpsValid 
        ? Math.round((completedCount / activeActivities.length) * 100) 
        : 0,
    };
  }, [activeActivities, formActivities, isTotalGpsValid, formTotalGpsNum]);

  // Open Add Form
  const handleOpenAddForm = () => {
    setEditingIndex(null);
    setFormName("");
    setFormTotalGps("");
    const initialAct: Record<string, { entered: string; notEntered: string }> = {};
    activeActivities.forEach((act) => {
      initialAct[act] = { entered: "0", notEntered: "0" };
    });
    setFormActivities(initialAct);
    setFormTouched({});
    setIsFormOpen(true);
  };

  // Open Edit Form for specific row
  const handleOpenEditForm = (idx: number) => {
    const row = data[idx];
    if (!row) return;
    setEditingIndex(idx);
    setFormName(row["Panchayat Name"] || "");
    const totalGpsVal = String(row["TotalGPs"] || 0);
    setFormTotalGps(totalGpsVal);
    const initialAct: Record<string, { entered: string; notEntered: string }> = {};
    activeActivities.forEach((act) => {
      const actData = row[act] || { Entered: 0, NotEntered: 0 };
      initialAct[act] = {
        entered: String(actData.Entered || 0),
        notEntered: String(actData.NotEntered || 0),
      };
    });
    setFormActivities(initialAct);
    setFormTouched({});
    setIsFormOpen(true);
  };

  // Quick Action: Mark all as Entered
  const handleMarkAllEntered = () => {
    if (!isTotalGpsValid) {
      addToast("ముందుగా సరైన మొత్తం GPల సంఖ్యను నమోదు చేయండి.");
      return;
    }
    const updated = { ...formActivities };
    activeActivities.forEach((act) => {
      updated[act] = { entered: String(formTotalGpsNum), notEntered: "0" };
    });
    setFormActivities(updated);
    addToast("అన్ని యాక్టివిటీలకు 'సమర్పించినవి' విలువలు సెట్ చేయబడ్డాయి.");
  };

  // Quick Action: Auto-balance Not Entered
  const handleAutoBalance = () => {
    if (!isTotalGpsValid) {
      addToast("ముందుగా సరైన మొత్తం GPల సంఖ్యను నమోదు చేయండి.");
      return;
    }
    const updated = { ...formActivities };
    activeActivities.forEach((act) => {
      const ent = parseInt(updated[act]?.entered || "0", 10) || 0;
      const remaining = Math.max(0, formTotalGpsNum - ent);
      updated[act] = { entered: String(ent), notEntered: String(remaining) };
    });
    setFormActivities(updated);
    addToast("సమర్పించని GPల సంఖ్య ఆటో-బ్యాలెన్స్ చేయబడింది.");
  };

  // Save Record
  const handleSaveForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isNameValid) {
      addToast("దయచేసి సరైన పేరు నమోదు చేయండి (కనీసం 2 అక్షరాలు).");
      return;
    }
    if (!isTotalGpsValid) {
      addToast("దయచేసి సరైన మొత్తం GPల సంఖ్యను నమోదు చేయండి.");
      return;
    }

    if (activities.length === 0) {
      setActivities(predefinedActivities);
    }

    const currentActs = activities.length > 0 ? activities : predefinedActivities;
    const newRecord: any = {
      "Panchayat Name": formName.trim(),
      "TotalGPs": formTotalGpsNum,
    };

    currentActs.forEach((act) => {
      const ent = parseInt(formActivities[act]?.entered || "0", 10) || 0;
      const notEnt = parseInt(formActivities[act]?.notEntered || "0", 10) || 0;
      newRecord[act] = {
        Entered: ent,
        NotEntered: notEnt,
      };
    });

    if (editingIndex !== null && editingIndex >= 0 && editingIndex < data.length) {
      const updated = [...data];
      updated[editingIndex] = { ...updated[editingIndex], ...newRecord };
      setData(updated);
      addToast("రికార్డు విజయవంతంగా నవీకరించబడింది!");
    } else {
      newRecord["S.No"] = data.length + 1;
      setData([...data, newRecord]);
      addToast("కొత్త డేటా ఎంట్రీ విజయవంతంగా జోడించబడింది!");
    }

    if (!uploadDateTime) {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
      setUploadDateTime(`${day}-${month}-${year} ${formattedTime}`);
    }

    setIsFormOpen(false);
  };

  const handleDeleteRow = (idx: number) => {
    if (window.confirm("ఈ రికార్డును తొలగించాలనుకుంటున్నారా?")) {
      const filtered = data.filter((_, i) => i !== idx);
      filtered.forEach((r, i) => r["S.No"] = i + 1);
      setData(filtered);
      addToast("రికార్డు తొలగించబడింది.");
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 mt-6 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="text-sky-700" /> E-Panchayat Monthly Activity Report
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Upload raw data file to generate exact Telangana State activity data entry report format with page setup.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            ref={fileRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            <Upload size={16} />
            {fileName ? "ఫైల్ మార్చు" : "Upload Raw File"}
          </button>

          <button
            onClick={handleOpenAddForm}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
            title="కొత్త డేటా ఎంట్రీ ఫారం ఓపెన్ చేయండి (New Data Entry Form)"
          >
            <Plus size={16} />
            కొత్త ఎంట్రీ (Add Entry)
          </button>

          {data.length > 0 && (
            <>
              {uploadDateTime && (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                  isUploadDateTimeValid 
                    ? "bg-emerald-50/80 border border-emerald-300 text-emerald-950" 
                    : "bg-blue-50 border border-blue-200 text-blue-900"
                }`}>
                  <span className="text-slate-600 font-bold whitespace-nowrap">తేదీ & సమయం:</span>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={uploadDateTime}
                      onChange={(e) => setUploadDateTime(e.target.value)}
                      className={`bg-white border rounded-lg px-2 py-0.5 text-xs font-bold focus:outline-none min-w-[155px] pr-6 transition-all ${
                        isUploadDateTimeValid
                          ? "border-emerald-500 text-emerald-900 focus:ring-1 focus:ring-emerald-500"
                          : "border-slate-300 text-slate-800"
                      }`}
                      title="రిపోర్ట్ తేదీ మరియు సమయం (మార్చుకోవచ్చు)"
                    />
                    <div className="absolute right-1.5 pointer-events-none">
                      {isUploadDateTimeValid ? (
                        <CheckCircle2 size={14} className="text-emerald-600 animate-in zoom-in" />
                      ) : (
                        <AlertCircle size={14} className="text-amber-500" />
                      )}
                    </div>
                  </div>
                  {isUploadDateTimeValid && (
                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-md font-bold">
                      <Check size={10} /> Valid
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#11518E] text-white font-bold text-xs rounded-xl hover:bg-[#0d3f6f] transition-all shadow-sm"
                title="Download formatted Excel with Page Setup"
              >
                <Download size={16} />
                Excel (Page Setup)
              </button>

              <button
                onClick={handleExportPdf}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-all shadow-sm"
                title="Export A4 Landscape PDF Report"
              >
                <FileText size={16} />
                PDF (A4 Landscape)
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                title="Print or Save as PDF"
              >
                <Printer size={16} />
                Print / Save PDF
              </button>
            </>
          )}
        </div>
      </div>

      {!data.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-[24px] p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-sky-300 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-700 mb-4 group-hover:scale-105 transition-transform">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-700 mb-2">Upload Raw Activity Data File</h3>
            <p className="text-slate-500 font-medium text-xs max-w-sm">
              Select a raw .xls or .xlsx report file to generate the official color-coded report format with page setup.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Upload size={14} /> ఫైల్ ఎంచుకోండి (Choose File)
            </span>
          </div>

          <div
            onClick={handleOpenAddForm}
            className="border-2 border-dashed border-emerald-200 rounded-[24px] p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-emerald-50/40 hover:border-emerald-400 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
              <Plus size={28} />
            </div>
            <h3 className="text-lg font-black text-emerald-950 mb-2">నేరుగా డేటా నమోదు (Manual Data Entry)</h3>
            <p className="text-slate-500 font-medium text-xs max-w-sm">
              రియల్-టైమ్ చెక్‌మార్క్ వాలిడేషన్‌తో పంచాయతీ / మండల వివరాలు మరియు 17 కార్యాచరణల డేటాను సులభంగా నమోదు చేయండి.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl group-hover:bg-emerald-700 shadow-sm transition-colors">
              <Plus size={14} /> కొత్త ఎంట్రీ ఫారం (Open Form)
            </span>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black custom-scrollbar pb-4 bg-white">
          <div className="inline-block min-w-max">
            <table className="w-full border-collapse bg-white text-xs font-medium border border-black">
              <thead>
                <tr>
                  <th
                    colSpan={4 + activities.length * 2}
                    className="bg-[#11518E] text-white py-2 px-3 border border-black text-center font-bold text-sm tracking-wide"
                  >
                    Telangana State
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={4 + activities.length * 2}
                    className="bg-[#11518E] text-white py-2 px-3 border border-black text-center font-bold text-xs tracking-wide"
                  >
                    Monthly Activity Data Entry Report {uploadDateTime ? `- (${uploadDateTime})` : ""}
                  </th>
                </tr>
                <tr>
                  <th rowSpan={2} className="py-2 px-3 border border-black bg-[#11518E] text-white text-center font-bold">
                    S.No
                  </th>
                  <th rowSpan={2} className="py-2 px-4 border border-black bg-[#11518E] text-white text-center font-bold min-w-[150px]">
                    {nameHeader}
                  </th>
                  <th rowSpan={2} className="py-2 px-3 border border-black bg-[#11518E] text-white text-center font-bold min-w-[100px]">
                    Total No. of Gp's
                  </th>
                  {activities.map((a, i) => (
                    <th key={i} colSpan={2} className="py-2 px-3 border border-black bg-[#11518E] text-white text-center font-bold text-xs">
                      {a}
                    </th>
                  ))}
                  <th rowSpan={2} className="py-2 px-2 border border-black bg-[#11518E] text-white text-center font-bold text-xs min-w-[70px]">
                    చర్యలు
                  </th>
                </tr>
                <tr>
                  {activities.map((_, i) => (
                    <React.Fragment key={`sub-${i}`}>
                      <th className="py-1.5 px-2 border border-black bg-white text-black text-center text-[10px] font-bold">
                        Entered
                      </th>
                      <th className="py-1.5 px-2 border border-black bg-white text-black text-center text-[10px] font-bold">
                        Not Entered
                      </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-1.5 px-2 border border-black text-center font-bold w-10 text-slate-800">
                      {idx + 1}
                    </td>
                    <td className="py-1.5 px-4 border border-black whitespace-nowrap font-bold text-slate-800 text-left">
                      {row["Panchayat Name"]}
                    </td>
                    <td className="py-1.5 px-2 border border-black text-center font-bold text-xs text-slate-900 bg-slate-50">
                      {row["TotalGPs"] || 0}
                    </td>
                    {activities.map((act, actIdx) => {
                      const entry = row[act] || { Entered: 0, NotEntered: 0 };
                      
                      const isEnt = entry.Entered > 0;
                      const isNotEnt = entry.NotEntered > 0;

                      return (
                        <React.Fragment key={`${idx}-${actIdx}`}>
                          <td 
                            className={`py-1.5 px-2 border border-black text-center font-bold text-xs ${
                              isEnt ? "bg-[#92D050] text-black" : "bg-white text-black"
                            }`}
                          >
                            {entry.Entered}
                          </td>
                          <td 
                            className={`py-1.5 px-2 border border-black text-center font-bold text-xs ${
                              isNotEnt ? "bg-[#FF0000] text-white" : "bg-white text-black"
                            }`}
                          >
                            {entry.NotEntered}
                          </td>
                        </React.Fragment>
                      );
                    })}
                    <td className="py-1.5 px-2 border border-black text-center whitespace-nowrap bg-white">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditForm(idx)}
                          className="p-1.5 text-sky-700 hover:bg-sky-100/70 rounded-lg transition-colors inline-flex items-center"
                          title="సవరించండి (Edit Record)"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1.5 text-rose-600 hover:bg-rose-100/70 rounded-lg transition-colors inline-flex items-center"
                          title="తొలగించండి (Delete Record)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-white font-bold border-t-2 border-black">
                  <td colSpan={2} className="py-2 px-4 border border-black text-center font-black text-slate-900 text-xs">
                    Total
                  </td>
                  <td className="py-2 px-2 border border-black text-center font-black text-slate-900 bg-slate-100 text-xs">
                    {grandTotalGps}
                  </td>
                  {activities.map((act, idx) => {
                    const totalEnt = data.reduce((acc, row) => acc + (row[act]?.Entered || 0), 0);
                    const totalNEnt = data.reduce((acc, row) => acc + (row[act]?.NotEntered || 0), 0);
                    return (
                      <React.Fragment key={`tot-${idx}`}>
                        <td className="py-2 px-2 border border-black text-center font-black text-black bg-white text-xs">
                          {totalEnt}
                        </td>
                        <td className="py-2 px-2 border border-black text-center font-black text-black bg-white text-xs">
                          {totalNEnt}
                        </td>
                      </React.Fragment>
                    );
                  })}
                  <td className="py-2 px-2 border border-black text-center font-black text-slate-400 bg-slate-50 text-xs">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Entry & Edit Modal with Real-time Validation Indicators */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                  <CheckSquare size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    {editingIndex !== null ? "నెలవారీ రికార్డు సవరణ (Edit Monthly Record)" : "కొత్త నెలవారీ కార్యాచరణ డేటా ఎంట్రీ"}
                  </h3>
                  <p className="text-slate-500 font-medium text-xs">
                    ప్రతి ఫీల్డ్‌లో సరైన డేటా ఎంటర్ చేసినప్పుడు రియల్-టైమ్ ఆకుపచ్చ చెక్‌మార్క్ (<CheckCircle2 size={12} className="inline text-emerald-600" />) కనిపిస్తుంది.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                title="మూసివేయి (Close)"
              >
                <X size={20} />
              </button>
            </div>

            {/* Real-time Validation Progress & Status Banner */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">ధృవీకరణ పురోగతి:</span>
                <span className="text-xs font-black text-emerald-700">
                  {activitiesStatus.completedCount} / {activitiesStatus.totalActs} కార్యాచరణలు సరిపోయాయి ({activitiesStatus.progressPercent}%)
                </span>
              </div>
              <div className="w-full sm:w-48 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${activitiesStatus.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveForm} className="overflow-y-auto p-6 space-y-6 flex-1 custom-scrollbar">
              {/* Basic Fields */}
              <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/80">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> ప్రాథమిక సమాచారం (Basic Details)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      పంచాయతీ / మండల పేరు <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="ఉదాహరణ: Mandal Name లేదా Panchayat"
                        value={formName}
                        onChange={(e) => {
                          setFormName(e.target.value);
                          setFormTouched((prev) => ({ ...prev, name: true }));
                        }}
                        onBlur={() => setFormTouched((prev) => ({ ...prev, name: true }))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all pr-10 ${
                          isNameValid
                            ? "border-emerald-500 bg-emerald-50/20 text-slate-900 focus:ring-2 focus:ring-emerald-400/30"
                            : formTouched["name"]
                            ? "border-rose-400 bg-rose-50/20 text-slate-900 focus:ring-2 focus:ring-rose-400/30"
                            : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-sky-400/30"
                        }`}
                      />
                      <div className="absolute right-3 pointer-events-none">
                        {isNameValid ? (
                          <CheckCircle2 size={18} className="text-emerald-600 animate-in zoom-in" />
                        ) : formTouched["name"] ? (
                          <AlertCircle size={18} className="text-rose-500" />
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-1 min-h-[18px]">
                      {isNameValid ? (
                        <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 animate-in fade-in">
                          <Check size={12} className="text-emerald-600" /> సరైన పేరు నమోదైంది (Valid Name)
                        </p>
                      ) : formTouched["name"] ? (
                        <p className="text-[11px] text-rose-600 font-medium">దయచేసి కనీసం 2 అక్షరాలు గల పేరు రాయండి.</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">మండలం లేదా పంచాయతీ పేరు నమోదు చేయండి.</p>
                      )}
                    </div>
                  </div>

                  {/* Total GPs field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      మొత్తం గ్రామ పంచాయతీల సంఖ్య (Total No. of GPs) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="number"
                        min="1"
                        placeholder="ఉదాహరణ: 20"
                        value={formTotalGps}
                        onChange={(e) => {
                          setFormTotalGps(e.target.value);
                          setFormTouched((prev) => ({ ...prev, totalGps: true }));
                        }}
                        onBlur={() => setFormTouched((prev) => ({ ...prev, totalGps: true }))}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none transition-all pr-10 ${
                          isTotalGpsValid
                            ? "border-emerald-500 bg-emerald-50/20 text-slate-900 focus:ring-2 focus:ring-emerald-400/30"
                            : formTouched["totalGps"]
                            ? "border-rose-400 bg-rose-50/20 text-slate-900 focus:ring-2 focus:ring-rose-400/30"
                            : "border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-sky-400/30"
                        }`}
                      />
                      <div className="absolute right-3 pointer-events-none">
                        {isTotalGpsValid ? (
                          <CheckCircle2 size={18} className="text-emerald-600 animate-in zoom-in" />
                        ) : formTouched["totalGps"] ? (
                          <AlertCircle size={18} className="text-rose-500" />
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-1 min-h-[18px]">
                      {isTotalGpsValid ? (
                        <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 animate-in fade-in">
                          <Check size={12} className="text-emerald-600" /> ధృవీకరించబడింది: {formTotalGpsNum} పంచాయతీలు (Valid GP Count)
                        </p>
                      ) : formTouched["totalGps"] ? (
                        <p className="text-[11px] text-rose-600 font-medium">దయచేసి 1 లేదా అంతకంటే ఎక్కువ సంఖ్య నమోదు చేయండి.</p>
                      ) : (
                        <p className="text-[11px] text-slate-400">మొత్తం GPల సంఖ్య నమోదు చేయండి.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 17 Activities Fields with Real-Time Validation */}
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-3 mb-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500" /> కార్యాచరణల డేటా ఎంట్రీ & రియల్-టైమ్ వాలిడేషన్
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      ప్రతి కార్యాచరణలో Entered మరియు Not Entered విలువల మొత్తం, Total GPs కు సమానమైనప్పుడు ఆకుపచ్చ చెక్‌మార్క్ వస్తుంది.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleMarkAllEntered}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-xl border border-emerald-200 transition-colors"
                      title="అన్నింటికీ Entered = Total GPs గా సెట్ చేస్తుంది"
                    >
                      అన్నీ Entered
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoBalance}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-bold rounded-xl border border-sky-200 transition-colors"
                      title="సమర్పించని వాటిని (Not Entered = Total GPs - Entered) ఆటోమేటిక్‌గా గణిస్తుంది"
                    >
                      ఆటో బ్యాలెన్స్
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {activeActivities.map((act) => {
                    const entStr = formActivities[act]?.entered ?? "0";
                    const notEntStr = formActivities[act]?.notEntered ?? "0";
                    const entNum = parseInt(entStr || "0", 10) || 0;
                    const notEntNum = parseInt(notEntStr || "0", 10) || 0;
                    const isSumMatched = isTotalGpsValid && entNum + notEntNum === formTotalGpsNum;
                    const isOver = isTotalGpsValid && entNum + notEntNum > formTotalGpsNum;
                    const isUnder = isTotalGpsValid && entNum + notEntNum < formTotalGpsNum;

                    return (
                      <div
                        key={act}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isSumMatched
                            ? "bg-emerald-50/30 border-emerald-300 ring-1 ring-emerald-400/20"
                            : isOver
                            ? "bg-rose-50/30 border-rose-200"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-slate-800 tracking-tight">
                            {act}
                          </span>
                          {/* Real-time Indicator Pill */}
                          {isSumMatched ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs animate-in zoom-in">
                              <CheckCircle2 size={12} className="text-emerald-600" />
                              సరిపోయింది ({entNum + notEntNum}/{formTotalGpsNum})
                            </span>
                          ) : isOver ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                              అధికం: {entNum + notEntNum}/{formTotalGpsNum}
                            </span>
                          ) : isUnder ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                              మొత్తం: {entNum + notEntNum}/{formTotalGpsNum}
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">
                              మొత్తం: {entNum + notEntNum}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {/* Entered Input */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-600">Entered:</span>
                              {entNum >= 0 && (
                                <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold">
                                  <Check size={10} className="text-emerald-600 mr-0.5" /> Ok
                                </span>
                              )}
                            </div>
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                min="0"
                                value={entStr}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormActivities((prev) => ({
                                    ...prev,
                                    [act]: {
                                      entered: val,
                                      notEntered: prev[act]?.notEntered ?? "0",
                                    },
                                  }));
                                }}
                                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold focus:outline-none transition-all pr-6 ${
                                  entNum > 0
                                    ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-black focus:ring-1 focus:ring-emerald-500"
                                    : "bg-slate-50/60 border-slate-200 text-slate-800 focus:bg-white"
                                }`}
                              />
                              {entNum >= 0 && (
                                <div className="absolute right-2 pointer-events-none">
                                  <CheckCircle2 size={12} className="text-emerald-600" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Not Entered Input */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-bold text-slate-600">Not Entered:</span>
                              {notEntNum >= 0 && (
                                <span className="inline-flex items-center text-[10px] text-emerald-700 font-bold">
                                  <Check size={10} className="text-emerald-600 mr-0.5" /> Ok
                                </span>
                              )}
                            </div>
                            <div className="relative flex items-center">
                              <input
                                type="number"
                                min="0"
                                value={notEntStr}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormActivities((prev) => ({
                                    ...prev,
                                    [act]: {
                                      entered: prev[act]?.entered ?? "0",
                                      notEntered: val,
                                    },
                                  }));
                                }}
                                className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-bold focus:outline-none transition-all pr-6 ${
                                  notEntNum > 0
                                    ? "bg-rose-50/70 border-rose-300 text-rose-900 font-black focus:ring-1 focus:ring-rose-500"
                                    : "bg-slate-50/60 border-slate-200 text-slate-800 focus:bg-white"
                                }`}
                              />
                              {notEntNum >= 0 && (
                                <div className="absolute right-2 pointer-events-none">
                                  <CheckCircle2 size={12} className="text-emerald-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Validation Message Banner */}
              {activitiesStatus.allMatched ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-900 animate-in fade-in">
                  <CheckCheck size={20} className="text-emerald-600 shrink-0" />
                  <span>అన్ని 17 కార్యాచరణల డేటా మరియు మొత్తం GPల సంఖ్య విజయవంతంగా సరిపోయాయి! ఎంట్రీని సేవ్ చేయవచ్చు.</span>
                </div>
              ) : isNameValid && isTotalGpsValid ? (
                <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl flex items-center gap-2.5 text-xs font-semibold text-sky-900">
                  <CheckCircle2 size={18} className="text-sky-600 shrink-0" />
                  <span>ప్రాథమిక వివరాలు ధృవీకరించబడ్డాయి. కార్యాచరణల సంఖ్యలను కూడా సరిపోల్చి సేవ్ చేయండి.</span>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-2xl flex items-center gap-2.5 text-xs font-medium text-slate-600">
                  <AlertCircle size={18} className="text-slate-400 shrink-0" />
                  <span>సేవ్ చేయడానికి దయచేసి పంచాయతీ/మండల పేరు మరియు మొత్తం GPల సంఖ్యను నమోదు చేయండి.</span>
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200/60 font-bold text-xs transition-colors"
              >
                రద్దు (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSaveForm}
                disabled={!isNameValid || !isTotalGpsValid}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-sm ${
                  isNameValid && isTotalGpsValid
                    ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    : "bg-slate-300 cursor-not-allowed text-slate-500"
                }`}
              >
                <Check size={16} />
                {editingIndex !== null ? "నవీకరించు (Update Record)" : "ఎంట్రీని సేవ్ చేయి (Save Entry)"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
