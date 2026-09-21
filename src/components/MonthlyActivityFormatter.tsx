import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, RefreshCw, Printer, FileText, Copy } from "lucide-react";

export function MonthlyActivityFormatter({
  addToast,
}: {
  addToast: (msg: string) => void;
}) {
  const [data, setData] = useState<any[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [nameHeader, setNameHeader] = useState("Mandal Name");
  const fileRef = useRef<HTMLInputElement>(null);

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
      const headerRow2 = ["Monthly Activity Data Entry Report"];
      
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
      doc.text("Monthly Activity Data Entry Report", pageWidth / 2, 17.5, { align: "center" });

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
              <th colspan="${3 + activities.length * 2}" class="subtitle-bg">Monthly Activity Data Entry Report</th>
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

          {data.length > 0 && (
            <>
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
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 sm:p-16 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-sky-300 transition-all cursor-pointer"
        >
          <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-700 mb-4">
            <Upload size={28} />
          </div>
          <h3 className="text-xl font-black text-slate-700 mb-2">Upload Raw Activity Data File</h3>
          <p className="text-slate-500 font-medium text-xs">
            Select a raw .xls or .xlsx report file to generate the official color-coded report format with page setup.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black custom-scrollbar pb-4 bg-white">
          <div className="inline-block min-w-max">
            <table className="w-full border-collapse bg-white text-xs font-medium border border-black">
              <thead>
                <tr>
                  <th
                    colSpan={3 + activities.length * 2}
                    className="bg-[#11518E] text-white py-2 px-3 border border-black text-center font-bold text-sm tracking-wide"
                  >
                    Telangana State
                  </th>
                </tr>
                <tr>
                  <th
                    colSpan={3 + activities.length * 2}
                    className="bg-[#11518E] text-white py-2 px-3 border border-black text-center font-bold text-xs tracking-wide"
                  >
                    Monthly Activity Data Entry Report
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
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
