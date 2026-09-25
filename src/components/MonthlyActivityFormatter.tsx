import React, { useState, useRef, useMemo, useEffect } from "react";
import { 
  Upload, 
  Download, 
  Printer, 
  FileText, 
  Check, 
  Building2,
  Landmark,
  Share2,
  Filter,
  X, 
  MessageSquareShare,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Plus,
  Edit3,
  CheckCircle2,
  CheckSquare,
  Pencil
} from "lucide-react";

// Standard 15 MAS Activities
export const STANDARD_MAS_ACTIVITIES = [
  "Nursery",
  "Plantation",
  "Vaikunta Dhamam",
  "Dump Yard",
  "Water Supply",
  "GP Meetings",
  "Gram Sabha",
  "Record Maintenance",
  "Approvals and Certificates",
  "Death",
  "Receipts",
  "Salary Details",
  "VWSC Balance",
  "MGNRE Bank Balance",
  "Birth"
];

export interface MonthlyActivityFormatterProps {
  addToast: (msg: string) => void;
  initialLevel?: "mandal" | "district";
}

export function MonthlyActivityFormatter({
  addToast,
  initialLevel = "mandal",
}: MonthlyActivityFormatterProps) {
  // Mode: "mandal" (Mandal Monthly Activity Monitoring) vs "district" (District Monthly Activity Monitoring)
  const [reportLevel, setReportLevel] = useState<"mandal" | "district">(initialLevel);

  useEffect(() => {
    if (initialLevel && (initialLevel === "mandal" || initialLevel === "district")) {
      setReportLevel(initialLevel);
    }
  }, [initialLevel]);

  // Dynamic columns state
  const [dynamicActivities, setDynamicActivities] = useState<string[]>(STANDARD_MAS_ACTIVITIES);
  
  // Data states
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [mandalData, setMandalData] = useState<any[]>([]);
  
  // File metadata
  const [uploadedFilesLabel, setUploadedFilesLabel] = useState("");
  const [uploadDateTime, setUploadDateTime] = useState<string>("");
  const [mandalNameInput, setMandalNameInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [bulkCopied, setBulkCopied] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingFilter, setPendingFilter] = useState<"all" | "pending" | "completed">("all");

  // Manual Data Entry Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGpName, setNewGpName] = useState("");
  const [newGpStatuses, setNewGpStatuses] = useState<Record<string, number>>({});

  const [actions, setActions] = useState<Record<string, string>>({});

  // Edit Monthly Record (District level)
  const [editingDistrictMandal, setEditingDistrictMandal] = useState<any | null>(null);
  const [tempDistrictActivities, setTempDistrictActivities] = useState<Record<string, { entered: number; notEntered: number }>>({});

  // Edit GP Record (Mandal level)
  const [editingMandalGp, setEditingMandalGp] = useState<any | null>(null);
  const [tempGpName, setTempGpName] = useState("");
  const [tempGpStatuses, setTempGpStatuses] = useState<Record<string, number>>({});

  // Single Unified File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleActionChange = (key: string, value: string) => {
    setActions((prev) => ({ ...prev, [key]: value }));
  };

  // Open District Edit Modal
  const handleOpenEditDistrictRecord = (row: any) => {
    setEditingDistrictMandal(row);
    const actMap: Record<string, { entered: number; notEntered: number }> = {};
    const totGps = row.TotalGPs || 1;
    dynamicActivities.forEach((act) => {
      const actData = row.activities?.[act] || { entered: 0, notEntered: totGps };
      const ent = actData.entered ?? 0;
      const notEnt = actData.notEntered !== undefined ? actData.notEntered : Math.max(0, totGps - ent);
      actMap[act] = { entered: ent, notEntered: notEnt };
    });
    setTempDistrictActivities(actMap);
  };

  // Update Activity in District Edit Modal
  const handleUpdateDistrictActivity = (act: string, field: "entered" | "notEntered", rawVal: string) => {
    const num = rawVal === "" ? 0 : (parseInt(rawVal.replace(/[^\d]/g, ""), 10) || 0);
    setTempDistrictActivities((prev) => {
      const cur = prev[act] || { entered: 0, notEntered: 0 };
      return {
        ...prev,
        [act]: {
          ...cur,
          [field]: num
        }
      };
    });
  };

  // Save District Record
  const handleSaveDistrictRecord = () => {
    if (!editingDistrictMandal) return;
    const targetMandalName = editingDistrictMandal["Mandal Name"];
    const totGps = editingDistrictMandal["TotalGPs"] || 1;

    setDistrictData((prev) => {
      return prev.map((row) => {
        if (row["Mandal Name"] !== targetMandalName) return row;

        const newActivities: Record<string, any> = { ...row.activities };
        let sumPct = 0;

        dynamicActivities.forEach((act) => {
          const item = tempDistrictActivities[act] || { entered: 0, notEntered: 0 };
          const ent = item.entered;
          const notEnt = item.notEntered;
          const pct = totGps > 0 ? (ent / totGps) * 100 : 0;
          const finalPct = Math.min(100, Math.max(0, parseFloat(pct.toFixed(2))));
          newActivities[act] = {
            entered: ent,
            notEntered: notEnt,
            percentage: finalPct
          };
          sumPct += finalPct;
        });

        const overallPct = dynamicActivities.length > 0 ? parseFloat((sumPct / dynamicActivities.length).toFixed(2)) : 0;

        return {
          ...row,
          activities: newActivities,
          "Overall %": overallPct
        };
      });
    });

    addToast(`${targetMandalName} record updated successfully!`);
    setEditingDistrictMandal(null);
  };

  // Open Mandal GP Edit Modal
  const handleOpenEditMandalGp = (gpRow: any) => {
    setEditingMandalGp(gpRow);
    setTempGpName(gpRow["Panchayat Name"] || "");
    setTempGpStatuses({ ...(gpRow.status || {}) });
  };

  // Save Mandal GP
  const handleSaveMandalGp = () => {
    if (!editingMandalGp) return;
    const origName = editingMandalGp["Panchayat Name"];
    const updatedName = tempGpName.trim().toUpperCase() || origName;

    setMandalData((prev) => {
      return prev.map((row) => {
        if (row["Panchayat Name"] !== origName) return row;
        return {
          ...row,
          "Panchayat Name": updatedName,
          status: { ...tempGpStatuses }
        };
      });
    });

    addToast(`${updatedName} details updated successfully!`);
    setEditingMandalGp(null);
  };

  // Delete Mandal GP
  const handleDeleteMandalGp = (gpName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${gpName} Panchayat?`)) return;
    setMandalData((prev) => {
      const updated = prev.filter((r) => r["Panchayat Name"] !== gpName);
      return updated.map((r, idx) => ({ ...r, "S.No": idx + 1 }));
    });
    addToast(`${gpName} Panchayat deleted successfully.`);
  };

  // Delete District Mandal
  const handleDeleteDistrictMandal = (mandalName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${mandalName} Mandal?`)) return;
    setDistrictData((prev) => {
      const updated = prev.filter((r) => r["Mandal Name"] !== mandalName);
      return updated.map((r, idx) => ({ ...r, "S.No": idx + 1 }));
    });
    addToast(`${mandalName} Mandal deleted successfully.`);
  };

  // Generate formatted default timestamp
  const getFormattedDateTime = () => {
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedHours = String(hours).padStart(2, "0");
    return `${monthName} ${day}, ${year} at ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  // Helper clean activity name
  const isReservedNonActivityHeader = (rawText: string): boolean => {
    if (!rawText) return true;
    const clean = rawText
      .toLowerCase()
      .replace(/ entered\s*%/gi, "")
      .replace(/ not entered/gi, "")
      .replace(/ entered/gi, "")
      .replace(/ pending/gi, "")
      .replace(/ status/gi, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

    const reserved = [
      "", "sno", "slno", "serialno", "serialnumber", "no", "s", "sl", "snoentered", "slnoentered",
      "panchayatname", "grampanchayatname", "grampanchayat", "gpname", "panchayat", "village", "villagename", "gp", "nameofgp", "nameofgrampanchayat", "panchayatnameentered", "gpnameentered",
      "mandalname", "mandal", "districtname", "district", "nameofmandal", "nameofdistrict", "mandalnameentered",
      "total", "grandtotal", "totalgps", "totalgp", "overall", "overallpercent", "overallpercentage", "percentage",
      "status", "action", "actions", "remarks", "name", "notentered", "entered",
      "totalnoofgps", "totalnoofgp", "noofgps", "noofgp", "totalgpsentered", "totalgpentered", "noofgpentered"
    ];
    if (reserved.includes(clean)) return true;
    if (clean.startsWith("sno") || clean.startsWith("slno") || clean === "sno" || clean === "slno") return true;
    if (clean.includes("panchayatname") || clean.includes("grampanchayat") || clean.includes("mandalname") || clean.includes("totalno")) return true;
    return false;
  };

  const cleanActivityTitle = (rawText: string): string => {
    if (isReservedNonActivityHeader(rawText)) return "";

    const t = rawText
      .replace(/\n+/g, " ")
      .replace(/[\r\t]+/g, " ")
      .replace(/ entered\s*%/gi, "")
      .replace(/ entered/gi, "")
      .replace(/ not entered/gi, "")
      .replace(/ pending/gi, "")
      .replace(/ status/gi, "")
      .replace(/%/g, "")
      .replace(/_/g, " ")
      .trim();

    if (isReservedNonActivityHeader(t)) return "";

    const lower = t.toLowerCase();
    if (lower.includes("nursery")) return "Nursery";
    if (lower.includes("plantation")) return "Plantation";
    if (lower.includes("vaikunta") || lower.includes("dhamam") || lower.includes("vaikuntha")) return "Vaikunta Dhamam";
    if (lower.includes("dump") || lower.includes("yard")) return "Dump Yard";
    if (lower.includes("water") || lower.includes("supply")) return "Water Supply";
    if (lower.includes("gp meet") || lower.includes("meetings")) return "GP Meetings";
    if (lower.includes("gram sabha") || lower.includes("sabha")) return "Gram Sabha";
    if (lower.includes("record") || lower.includes("maintenance")) return "Record Maintenance";
    if (lower.includes("approval") || lower.includes("certificate")) return "Approvals and Certificates";
    if (lower.includes("death")) return "Death";
    if (lower.includes("receipt") || lower.includes("recipt")) return "Receipts";
    if (lower.includes("expenditure")) return "Expenditure";
    if (lower.includes("cheque")) return "Cheque Details";
    if (lower.includes("salary")) return "Salary Details";
    if (lower.includes("vwsc")) return "VWSC Balance";
    if (lower.includes("mgnre") || lower.includes("nregs")) return "MGNRE Bank Balance";
    if (lower.includes("electricity") || lower.includes("payment of electricity")) return "Payment of Electricity";
    if (lower.includes("birth")) return "Birth";
    if (lower.includes("sanitation")) return "Sanitation";
    if (lower.includes("street light") || lower.includes("lights")) return "Street Lights";
    if (lower.includes("tax") || lower.includes("property tax")) return "Property Tax";
    if (lower.includes("audit")) return "Audit";

    return t.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Match pending activity title
  const isActivityPendingInText = (act: string, pendingText: string): boolean => {
    const pLower = pendingText.toLowerCase();
    const actLower = act.toLowerCase();
    if (pLower.includes(actLower)) return true;

    if (act === "Vaikunta Dhamam" && (pLower.includes("vaikunta") || pLower.includes("dhamam") || pLower.includes("vaikuntha"))) return true;
    if (act === "Dump Yard" && (pLower.includes("dump") || pLower.includes("yard"))) return true;
    if (act === "Water Supply" && (pLower.includes("water") || pLower.includes("supply"))) return true;
    if (act === "GP Meetings" && (pLower.includes("gp meet") || pLower.includes("meetings"))) return true;
    if (act === "Gram Sabha" && (pLower.includes("gram sabha") || pLower.includes("sabha"))) return true;
    if (act === "Record Maintenance" && (pLower.includes("record") || pLower.includes("maintenance"))) return true;
    if (act === "Approvals and Certificates" && (pLower.includes("approval") || pLower.includes("certificate"))) return true;
    if (act === "Death" && pLower.includes("death")) return true;
    if (act === "Receipts" && (pLower.includes("receipt") || pLower.includes("recipt"))) return true;
    if (act === "Salary Details" && pLower.includes("salary")) return true;
    if (act === "VWSC Balance" && pLower.includes("vwsc")) return true;
    if (act === "MGNRE Bank Balance" && (pLower.includes("mgnre") || pLower.includes("bank balance") || pLower.includes("nregs"))) return true;
    if (act === "Birth" && pLower.includes("birth")) return true;

    return false;
  };

  // Helper to accurately extract array of pending activity strings from cell text
  const extractPendingActivitiesList = (rawText: string): string[] => {
    if (!rawText) return [];

    const rawParts = rawText
      .replace(/<br\s*[\/]?>/gi, "\n")
      .split(/\r?\n|(?<=[^\d])\s*(?=\d+[\s.)-])/)
      .map((l) => l.trim())
      .filter(Boolean);

    const pendingList: string[] = [];

    rawParts.forEach((part) => {
      let clean = part.replace(/^\d+[\s.)-]+/, "").trim();
      if (!clean) return;

      const lower = clean.toLowerCase();
      let matchedAct = "";

      if (lower.includes("nursery")) matchedAct = "Nursery";
      else if (lower.includes("plantation")) matchedAct = "Plantation";
      else if (lower.includes("vaikunta") || lower.includes("dhamam") || lower.includes("vaikuntha")) matchedAct = "Vaikunta Dhamam";
      else if (lower.includes("dump") || lower.includes("yard")) matchedAct = "Dump Yard";
      else if (lower.includes("water") || lower.includes("supply")) matchedAct = "Water Supply";
      else if (lower.includes("meeting") || lower.includes("meetings")) matchedAct = "GP Meetings";
      else if (lower.includes("sabha")) matchedAct = "Gram Sabha";
      else if (lower.includes("record") || lower.includes("maintenance")) matchedAct = "Record Maintenance";
      else if (lower.includes("approval") || lower.includes("certificate")) matchedAct = "Approvals and Certificates";
      else if (lower.includes("death")) matchedAct = "Death";
      else if (lower.includes("receipt") || lower.includes("recipt")) matchedAct = "Receipts";
      else if (lower.includes("salary")) matchedAct = "Salary Details";
      else if (lower.includes("vwsc")) matchedAct = "VWSC Balance";
      else if (lower.includes("mgnre") || lower.includes("bank balance") || lower.includes("nregs")) matchedAct = "MGNRE Bank Balance";
      else if (lower.includes("birth")) matchedAct = "Birth";
      else {
        clean = clean.replace(/\s+not\s+entered/i, "").trim();
        if (clean.length > 2 && !clean.toLowerCase().includes("total")) matchedAct = clean;
      }

      if (matchedAct) {
        const full = `${matchedAct} Not Entered`;
        if (!pendingList.includes(full)) {
          pendingList.push(full);
        }
      }
    });

    return pendingList;
  };

  // Unified Parser for ALL Files / Sheets
  const processUnifiedSheets = (sheets: { fileName: string; sheetName: string; rows: any[][] }[]) => {
    let detectedTime = "";
    let detectedMandal = "";

    // 1. Try to detect Timestamp and Mandal Name across all sheets
    for (const sheet of sheets) {
      for (let i = 0; i < Math.min(sheet.rows.length, 8); i++) {
        const rowStr = (sheet.rows[i] || []).join(" ");
        if (!detectedTime) {
          const match = rowStr.match(/(?:month of|as on|report date|on|dated)?[:\s]*([A-Za-z]+\s+\d{1,2},?\s+\d{4}(?:\s+at\s+\d{1,2}:\d{2}(?::\d{2})?\s*[AaPp][Mm])?|\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}(?:\s+at\s+\d{1,2}:\d{2}(?::\d{2})?\s*[AaPp][Mm])?)/i);
          if (match && match[1] && match[1].length >= 8) {
            detectedTime = match[1].trim();
          }
        }
        if (!detectedMandal) {
          const mandalMatch = rowStr.match(/mandal[:\s]+([A-Za-z\s]+)/i);
          if (mandalMatch && mandalMatch[1]) {
            detectedMandal = mandalMatch[1].trim();
          }
        }
      }
    }
    setUploadDateTime(detectedTime || getFormattedDateTime());
    if (detectedMandal) setMandalNameInput(detectedMandal);

    // 2. Classify sheets into: Report 14, Report 13, District Report
    let isDistrict = false;
    let districtRows: any[][] | null = null;

    const report14Sheets: any[][][] = [];
    const report13Sheets: any[][][] = [];

    sheets.forEach((sheet) => {
      const rows = sheet.rows;
      if (!rows || rows.length === 0) return;

      let hasReport14Keyword = false;
      let hasDistrictKeyword = false;
      let hasReport13Keyword = false;

      for (let i = 0; i < Math.min(rows.length, 15); i++) {
        const joined = (rows[i] || []).map((c) => String(c || "").toLowerCase().trim()).join(" ");

        // Report 14: Pending List
        if (joined.includes("pending_activities") || joined.includes("pending activity") || joined.includes("pending activities")) {
          hasReport14Keyword = true;
          break;
        }

        // District Report: Contains Mandal Name / Total No. of Gps without Panchayat Name
        if (
          (joined.includes("mandal name") || joined.includes("mandal")) &&
          !joined.includes("panchayat name") &&
          !joined.includes("gram panchayat")
        ) {
          if (
            joined.includes("total no") ||
            joined.includes("total gp") ||
            joined.includes("no. of gp") ||
            joined.includes("nursery") ||
            joined.includes("plantation") ||
            joined.includes("entered") ||
            joined.includes("%")
          ) {
            hasDistrictKeyword = true;
            break;
          }
        }

        // Check for "Total No. of Gp's" in header
        if (joined.includes("total no") && (joined.includes("gp") || joined.includes("gps"))) {
          hasDistrictKeyword = true;
          break;
        }

        // Report 13: Gram Panchayat Matrix
        if (joined.includes("panchayat name") || joined.includes("gram panchayat")) {
          hasReport13Keyword = true;
          break;
        }
      }

      if (hasReport14Keyword) {
        report14Sheets.push(rows);
      } else if (hasDistrictKeyword) {
        isDistrict = true;
        districtRows = rows;
      } else if (hasReport13Keyword) {
        report13Sheets.push(rows);
      } else {
        // Fallback check
        const firstFew = rows.slice(0, 10).map((r) => r.join(" ").toLowerCase()).join(" ");
        if (firstFew.includes("pending")) {
          report14Sheets.push(rows);
        } else if (firstFew.includes("mandal name") || (firstFew.includes("mandal") && !firstFew.includes("panchayat"))) {
          isDistrict = true;
          districtRows = rows;
        } else {
          report13Sheets.push(rows);
        }
      }
    });

    // 3. IF DISTRICT REPORT
    if (isDistrict && districtRows) {
      parseDistrictSheet(districtRows);
      return;
    }

    // 4. MANDAL REPORT: Extract Report 14 and/or Report 13 and merge seamlessly
    const mandalMap = new Map<string, {
      name: string;
      status: Record<string, number>;
      pendingActivities: string[];
      pendingCount: number;
      percentage: number;
    }>();

    const detectedMandalActivitiesSet = new Set<string>();

    // A. Parse Report 14 sheets
    report14Sheets.forEach((rows) => {
      let r14HeaderIdx = -1;
      let pendingNamesColIdx = -1;
      let pendingCountColIdx = -1;

      for (let i = 0; i < Math.min(rows.length, 15); i++) {
        const row = rows[i] || [];
        const joined = row.map((c) => String(c || "").toLowerCase().trim()).join(" ");
        if (joined.includes("pending_activities") || joined.includes("pending activity") || joined.includes("pending activities")) {
          r14HeaderIdx = i;
          row.forEach((cell, idx) => {
            const cStr = String(cell || "").toLowerCase();
            if (cStr.includes("pending_activities_names") || cStr.includes("pending_activities") || cStr.includes("pending activity")) pendingNamesColIdx = idx;
            if (cStr.includes("pending_activities_count") || cStr.includes("pending_count") || cStr.includes("count")) pendingCountColIdx = idx;
          });
          break;
        }
      }

      if (r14HeaderIdx !== -1 && pendingNamesColIdx !== -1) {
        const bodyRows = rows.slice(r14HeaderIdx + 1);
        bodyRows.forEach((row) => {
          let pName = "";
          for (let c = 0; c < Math.min(row.length, 3); c++) {
            const rawVal = String(row[c] || "").trim();
            const cleanVal = rawVal.replace(/^[\d\s.\-)]+/, "").trim();
            if (cleanVal && isNaN(Number(cleanVal)) && !cleanVal.toLowerCase().includes("total") && cleanVal.length >= 2) {
              pName = cleanVal.toUpperCase();
              break;
            }
          }
          if (!pName || pName.includes("TOTAL") || pName.includes("SUMMARY")) return;

          const rawPendingText = String(row[pendingNamesColIdx] || "").trim();
          let rawCount = 0;
          if (pendingCountColIdx !== -1) {
            rawCount = parseInt(String(row[pendingCountColIdx] || "").replace(/[^\d]/g, ""), 10);
          }

          // Extract real pending activities list accurately
          let pendingActsList = extractPendingActivitiesList(rawPendingText);

          // Fallback if cell had count but extract returned empty
          if (pendingActsList.length === 0 && !isNaN(rawCount) && rawCount > 0) {
            STANDARD_MAS_ACTIVITIES.forEach((act) => {
              if (isActivityPendingInText(act, rawPendingText)) {
                pendingActsList.push(`${act} Not Entered`);
              }
            });
          }

          const finalPendingCount = !isNaN(rawCount) && rawCount > 0 ? rawCount : pendingActsList.length;

          // Compute status for standard activities based on Report 14 explicitly listed pending items
          const statusMap: Record<string, number> = {};
          STANDARD_MAS_ACTIVITIES.forEach((act) => {
            const isPending = pendingActsList.some((p) => isActivityPendingInText(act, p));
            statusMap[act] = isPending ? 0 : 1;
            if (isPending) {
              detectedMandalActivitiesSet.add(act);
            }
          });

          const enteredCount = STANDARD_MAS_ACTIVITIES.length - pendingActsList.length;
          const percentage = parseFloat(((enteredCount / STANDARD_MAS_ACTIVITIES.length) * 100).toFixed(2));

          mandalMap.set(pName, {
            name: pName,
            status: statusMap,
            pendingActivities: pendingActsList,
            pendingCount: finalPendingCount,
            percentage
          });
        });
      }
    });

    // B. Parse Report 13 sheets (Activity Matrix)
    report13Sheets.forEach((rows) => {
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(rows.length, 25); i++) {
        const joined = (rows[i] || []).map((c) => String(c || "").toLowerCase().trim()).join(" ");
        if (joined.includes("panchayat") || joined.includes("nursery") || joined.includes("plantation") || (joined.includes("s.no") && (rows[i + 1] || []).join(" ").toLowerCase().includes("entered"))) {
          headerRowIndex = i;
          break;
        }
      }
      if (headerRowIndex === -1) headerRowIndex = 0;

      const mainHeaderRow = rows[headerRowIndex] || [];
      const subHeaderRow = rows[headerRowIndex + 1] || [];

      // Detect activity columns
      const detectedActCols: { activityName: string; colIdx: number }[] = [];
      const usedCols = new Set<number>();

      for (let c = 0; c < Math.max(mainHeaderRow.length, subHeaderRow.length); c++) {
        const mainText = String(mainHeaderRow[c] || "").trim();
        const subText = String(subHeaderRow[c] || "").trim();
        const combined = `${mainText} ${subText}`.trim();

        const actTitle = cleanActivityTitle(combined) || cleanActivityTitle(mainText);
        if (actTitle && !usedCols.has(c)) {
          detectedActCols.push({ activityName: actTitle, colIdx: c });
          usedCols.add(c);
          detectedMandalActivitiesSet.add(actTitle);
        }
      }

      // If no columns detected, default to standard 15 columns starting after name col
      const finalActCols = detectedActCols.length > 0 
        ? detectedActCols 
        : STANDARD_MAS_ACTIVITIES.map((act, i) => ({ activityName: act, colIdx: 2 + i }));

      if (detectedActCols.length === 0) {
        STANDARD_MAS_ACTIVITIES.forEach((a) => detectedMandalActivitiesSet.add(a));
      }

      const dataStartRow = headerRowIndex + 1 + (subHeaderRow.length > 0 && subHeaderRow.some((x) => String(x).toLowerCase().includes("entered")) ? 1 : 0);
      const bodyRows = rows.slice(dataStartRow);

      bodyRows.forEach((row) => {
        if (!row || row.length < 2) return;
        const rowJoined = row.map((c) => String(c || "").toLowerCase().trim()).join(" ");
        if (rowJoined.includes("total") || rowJoined.startsWith("grand total") || rowJoined.includes("statement showing") || rowJoined.includes("panchayat name")) {
          return;
        }

        let pName = "";
        for (let c = 0; c < Math.min(row.length, 3); c++) {
          const val = String(row[c] || "").trim().replace(/^[\d\s.\-)]+/, "");
          if (val && isNaN(Number(val)) && !val.toLowerCase().includes("total") && val.length >= 2) {
            pName = val.toUpperCase();
            break;
          }
        }
        if (!pName) return;

        const statusMap: Record<string, number> = {};
        const pendingActs: string[] = [];
        let enteredCount = 0;

        finalActCols.forEach((actCol) => {
          const val = String(row[actCol.colIdx] ?? "").trim().toLowerCase();
          const isEnt = val === "1" || val === "yes" || val === "true" || parseInt(val, 10) > 0 ? 1 : 0;
          statusMap[actCol.activityName] = isEnt;
          if (isEnt === 1) {
            enteredCount++;
          } else {
            pendingActs.push(`${actCol.activityName} Not Entered`);
          }
        });

        // Merge with Report 14 if already registered
        const existing = mandalMap.get(pName);
        if (existing) {
          // Report 13 matrix is the primary source of truth for 0/1 status: update status values!
          finalActCols.forEach((actCol) => {
            existing.status[actCol.activityName] = statusMap[actCol.activityName];
          });
        } else {
          // Add Panchayat (e.g. 100% completed GPs that had 0 pending activities in Report 14)
          mandalMap.set(pName, {
            name: pName,
            status: statusMap,
            pendingActivities: pendingActs,
            pendingCount: pendingActs.length,
            percentage: finalActCols.length > 0 ? parseFloat(((enteredCount / finalActCols.length) * 100).toFixed(2)) : 100
          });
        }
      });
    });

    // 5. Build final unified records with guaranteed 100% synchronization
    const activeMandalActivities = (report13Sheets.length > 0 && detectedMandalActivitiesSet.size > 0)
      ? Array.from(detectedMandalActivitiesSet)
      : STANDARD_MAS_ACTIVITIES;

    const finalMandalList = Array.from(mandalMap.values()).map((rec, idx) => {
      // GUARANTEED SYNC: An activity is pending IF AND ONLY IF status is explicitly 0!
      // If status is 1 (or unlisted as pending in Report 14), it is ENTERED!
      const synchronizedPendingList: string[] = [];
      let entCount = 0;

      activeMandalActivities.forEach((act) => {
        const isPending = rec.status?.[act] === 0;
        if (isPending) {
          synchronizedPendingList.push(`${act} Not Entered`);
        } else {
          entCount++;
          if (rec.status) rec.status[act] = 1;
        }
      });

      const totalActs = activeMandalActivities.length;
      const pct = totalActs > 0 ? parseFloat(((entCount / totalActs) * 100).toFixed(2)) : 100;

      return {
        "S.No": idx + 1,
        "Panchayat Name": rec.name,
        status: rec.status,
        pendingActivities: synchronizedPendingList,
        pendingCount: synchronizedPendingList.length,
        percentage: pct
      };
    });

    if (finalMandalList.length === 0) {
      addToast("Panchayat data not found in file. Please select a valid e-Panchayat file.");
      return;
    }

    setDynamicActivities(activeMandalActivities);
    setMandalData(finalMandalList);
    setReportLevel("mandal");
    addToast(`Mandal Report 13 and 14 loaded successfully (Total ${finalMandalList.length} Panchayats)!`);
  };

  // Parse District Percentage Sheet
  const parseDistrictSheet = (rawData: any[][]) => {
    // 1. Find the Sub-header Row (The row containing "Entered" and "Not Entered")
    let sIdx = -1;
    for (let i = 0; i < Math.min(rawData.length, 30); i++) {
      const rowStrings = (rawData[i] || []).map(c => String(c || "").toLowerCase().trim());
      // A sub-header row typically has many "entered" and "not entered" cells
      const matches = rowStrings.filter(s => s === "entered" || s === "not entered" || s.includes("entered %")).length;
      if (matches >= 6) {
        sIdx = i;
        break;
      }
    }

    // 2. Identify the Main Header Row (The row above the sub-header)
    let hIdx = sIdx > 0 ? sIdx - 1 : -1;

    // Fallback if sIdx was not found: search for "Mandal Name"
    if (sIdx === -1) {
      for (let i = 0; i < Math.min(rawData.length, 30); i++) {
        const rowJoined = (rawData[i] || []).map(c => String(c || "").toLowerCase()).join(" ");
        if (rowJoined.includes("mandal name") || rowJoined.includes("total no. of gp")) {
          hIdx = i;
          sIdx = i + 1;
          break;
        }
      }
    }

    if (sIdx === -1 || hIdx === -1) {
      addToast("Could not recognize report headers. Please upload a valid report file.");
      return;
    }

    const mHead = rawData[hIdx] || [];
    const sHead = rawData[sIdx] || [];

    // 3. Detect Mandal and Total GP Columns
    let mCol = -1, tCol = -1;
    // Check both header rows for these labels
    [mHead, sHead].forEach(row => {
      for (let c = 0; c < row.length; c++) {
        const txt = String(row[c] || "").toLowerCase().trim();
        if (mCol === -1 && (txt.includes("mandal name") || txt === "mandal")) mCol = c;
        if (tCol === -1 && (txt.includes("total no") || txt.includes("total gp") || txt.includes("no. of gp") || txt.includes("total no. of gp"))) tCol = c;
      }
    });
    if (mCol === -1) mCol = 1;
    if (tCol === -1) tCol = 2;

    // 4. Map Activity Columns
    const actCols: { name: string; entIdx: number; notEntIdx?: number; isPct: boolean }[] = [];
    const usedIndices = new Set<number>();

    // Scan columns in the sub-header
    for (let c = 0; c < sHead.length; c++) {
      if (c === mCol || c === tCol || usedIndices.has(c)) continue;
      
      const subTxt = String(sHead[c] || "").toLowerCase().trim();
      if (subTxt === "entered" || subTxt === "entered %") {
        // This is an "Entered" column. Find what activity it belongs to.
        // Usually the activity title is in the row above (mHead), possibly to the left if merged.
        let rawTitle = "";
        let scanIdx = c;
        while (scanIdx >= 0) {
          const t = String(mHead[scanIdx] || "").trim();
          if (t) { rawTitle = t; break; }
          // If we hit another "entered" to the left, stop scanning
          if (scanIdx < c && String(sHead[scanIdx] || "").toLowerCase().trim() === "entered") break;
          scanIdx--;
        }

        const cleanTitle = cleanActivityTitle(rawTitle);
        if (cleanTitle && !isReservedNonActivityHeader(cleanTitle)) {
          const isPct = subTxt.includes("%");
          let notEntIdx: number | undefined = undefined;
          if (String(sHead[c + 1] || "").toLowerCase().trim() === "not entered") {
            notEntIdx = c + 1;
          }

          actCols.push({ name: cleanTitle, entIdx: c, notEntIdx, isPct });
          usedIndices.add(c);
          if (notEntIdx !== undefined) usedIndices.add(notEntIdx);
        }
      }
    }

    // 5. Parse Mandal Data Rows
    const dataStart = sIdx + 1;
    const bodyRows = rawData.slice(dataStart);
    const parsed: any[] = [];

    bodyRows.forEach(row => {
      if (!row || row.length < 2) return;
      const rawM = String(row[mCol] || "").trim();
      if (!rawM || rawM.toLowerCase().includes("total") || rawM.toLowerCase().includes("statement") || rawM.toLowerCase().includes("telangana")) return;

      const mName = rawM.replace(/^[\d\s.\-)]+/, "").toUpperCase();
      const tGPs = parseInt(String(row[tCol] || "0").replace(/[^\d]/g, ""), 10) || 1;
      
      const activities: any = {};
      let sumP = 0;

      actCols.forEach(ac => {
        const val = String(row[ac.entIdx] || "0").trim();
        const num = parseFloat(val.replace(/[^\d.]/g, "")) || 0;
        let p = 0;

        if (ac.isPct || val.includes("%")) {
          p = num;
          if (p > 100 && tGPs > 0) p = (num / tGPs) * 100;
        } else {
          // If the number is a count (Entered GPs)
          p = tGPs > 0 ? (num / tGPs) * 100 : 0;
        }
        
        p = Math.min(100, Math.max(0, p));
        activities[ac.name] = { 
          entered: num, 
          notEntered: ac.notEntIdx !== undefined ? (parseFloat(String(row[ac.notEntIdx] || "0").replace(/[^\d.]/g, "")) || 0) : Math.max(0, tGPs - num),
          percentage: parseFloat(p.toFixed(2)) 
        };
        sumP += p;
      });

      parsed.push({
        "S.No": 0, "Mandal Name": mName, "TotalGPs": tGPs, activities,
        "Overall %": actCols.length > 0 ? parseFloat((sumP / actCols.length).toFixed(2)) : 0
      });
    });

    if (parsed.length === 0) {
      addToast("Data could not be recognized. Please upload a valid file.");
      return;
    }

    parsed.forEach((r, i) => r["S.No"] = i + 1);
    setDynamicActivities(actCols.map(a => a.name));
    setDistrictData(parsed);
    setReportLevel("district");
    addToast(`District report loaded successfully (Total ${parsed.length} Mandals)!`);
  };

  // Handle file drop / file select
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processUploadedFiles(Array.from(files));
  };

  const processUploadedFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploadedFilesLabel(files.map((f) => f.name).join(", "));

    try {
      const XLSX = await import("xlsx-js-style");
      const sheetsList: { fileName: string; sheetName: string; rows: any[][] }[] = [];

      for (const file of files) {
        const buffer = await file.arrayBuffer();

        // 1. Try HTML Table parser
        let isHtml = false;
        try {
          const textDecoder = new TextDecoder("utf-8");
          const htmlText = textDecoder.decode(buffer);
          if (htmlText.includes("<table") || htmlText.includes("<tr") || htmlText.includes("<td")) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const htmlRows: string[][] = [];
            doc.querySelectorAll("tr").forEach((tr) => {
              const rowCells: string[] = [];
              tr.querySelectorAll("th, td").forEach((cell) => {
                const tempCell = cell.cloneNode(true) as HTMLElement;
                tempCell.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
                tempCell.querySelectorAll("p, div, li").forEach((el) => el.after("\n"));
                const txt = (tempCell.textContent || "").trim();
                const colspan = parseInt(cell.getAttribute("colspan") || "1", 10);
                rowCells.push(txt);
                for (let k = 1; k < colspan; k++) rowCells.push("");
              });
              if (rowCells.some((c) => c.length > 0)) htmlRows.push(rowCells);
            });
            if (htmlRows.length > 0) {
              sheetsList.push({ fileName: file.name, sheetName: "HTML", rows: htmlRows });
              isHtml = true;
            }
          }
        } catch (e) {
          // ignore HTML error
        }

        // 2. Fallback to XLSX for Excel sheets
        if (!isHtml) {
          const workbook = XLSX.read(buffer, { type: "array" });
          for (const sName of workbook.SheetNames) {
            const sheetRows = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[sName], { header: 1, defval: "" });
            if (sheetRows && sheetRows.length > 0) {
              sheetsList.push({ fileName: file.name, sheetName: sName, rows: sheetRows });
            }
          }
        }
      }

      if (sheetsList.length === 0) {
        addToast("No data found in uploaded files.");
        return;
      }

      processUnifiedSheets(sheetsList);
    } catch (err: any) {
      console.error(err);
      addToast("File processing error: " + (err?.message || "Error"));
    }
  };

  // Clear data handler
  const handleClearData = () => {
    setMandalData([]);
    setDistrictData([]);
    setUploadedFilesLabel("");
    setUploadDateTime("");
    setMandalNameInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    addToast("Data cleared successfully.");
  };

  // Calculations for Mandal Report
  const mandalActivityTotals = useMemo(() => {
    const totals: Record<string, { entered: number; percentage: number }> = {};
    dynamicActivities.forEach((act) => {
      const enteredCount = mandalData.filter((r) => r.status?.[act] === 1).length;
      const pct = mandalData.length > 0 ? (enteredCount / mandalData.length) * 100 : 0;
      totals[act] = {
        entered: enteredCount,
        percentage: parseFloat(pct.toFixed(1))
      };
    });
    return totals;
  }, [mandalData, dynamicActivities]);

  const mandalSummaryStats = useMemo(() => {
    const totalGPs = mandalData.length;
    const completedGPs = mandalData.filter((r) => r.pendingCount === 0).length;
    const pendingGPs = mandalData.filter((r) => r.pendingCount > 0).length;
    const avgPct = totalGPs > 0 ? mandalData.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalGPs : 0;
    return {
      totalGPs,
      completedGPs,
      pendingGPs,
      avgPct: parseFloat(avgPct.toFixed(1))
    };
  }, [mandalData]);

  // Calculations for District Report
  const districtGrandTotalGps = useMemo(() => {
    return districtData.reduce((acc, row) => acc + (row["TotalGPs"] || 0), 0);
  }, [districtData]);

  const districtActivityTotals = useMemo(() => {
    const totals: Record<string, { totalEntered: number; districtPct: number }> = {};
    dynamicActivities.forEach((act) => {
      const totalEnt = districtData.reduce((acc, row) => acc + (row.activities?.[act]?.entered || 0), 0);
      const districtPct = districtGrandTotalGps > 0 ? (totalEnt / districtGrandTotalGps) * 100 : 0;
      totals[act] = {
        totalEntered: totalEnt,
        districtPct: parseFloat(districtPct.toFixed(2))
      };
    });
    return totals;
  }, [districtData, dynamicActivities, districtGrandTotalGps]);

  const districtOverallTotalPct = useMemo(() => {
    if (dynamicActivities.length === 0) return 0;
    const sum = Object.values(districtActivityTotals).reduce((acc, val) => acc + val.districtPct, 0);
    return parseFloat((sum / dynamicActivities.length).toFixed(2));
  }, [districtActivityTotals, dynamicActivities]);

  const districtStats = useMemo(() => {
    if (!districtData.length) return null;
    const sorted = [...districtData].sort((a, b) => (b["Overall %"] || 0) - (a["Overall %"] || 0));
    return {
      totalMandals: districtData.length,
      totalGps: districtGrandTotalGps,
      overallPct: districtOverallTotalPct,
      highestMandal: sorted[0],
      lowestMandal: sorted[sorted.length - 1]
    };
  }, [districtData, districtGrandTotalGps, districtOverallTotalPct]);

  // Filtered lists for search
  const filteredMandalData = useMemo(() => {
    let list = mandalData;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((r) => r["Panchayat Name"]?.toLowerCase().includes(q));
    }
    if (pendingFilter === "pending") {
      list = list.filter((r) => r.pendingCount > 0);
    } else if (pendingFilter === "completed") {
      list = list.filter((r) => r.pendingCount === 0);
    }
    return list;
  }, [mandalData, searchQuery, pendingFilter]);

  const filteredDistrictData = useMemo(() => {
    if (!searchQuery.trim()) return districtData;
    const q = searchQuery.toLowerCase().trim();
    return districtData.filter((r) => r["Mandal Name"]?.toLowerCase().includes(q));
  }, [districtData, searchQuery]);

  // Color coding helper for district percentages (Matching demo.jpeg heatmap exactly)
  const getPercentageColorClass = (pct: number) => {
    if (pct >= 99.99) return "bg-[#22c55e] text-white font-bold";
    if (pct >= 90) return "bg-[#bbf7d0] text-slate-900 font-bold";
    if (pct >= 75) return "bg-[#fef9c3] text-slate-900 font-bold";
    if (pct >= 50) return "bg-[#fef08a] text-slate-900 font-bold";
    return "bg-[#fecdd3] text-slate-900 font-bold";
  };

  // Export Combined Excel for Mandal (Sheet 1 = Report 13, Sheet 2 = Report 14)
  const handleExportMandalExcel = async () => {
    if (!mandalData.length) return;
    try {
      const XLSX = await import("xlsx-js-style");
      const wb = XLSX.utils.book_new();

      // Sheet 1: Report 13 (Matrix)
      const r13Rows: any[][] = [
        [`Statement showing the Monthly activity report for the month of ${uploadDateTime || getFormattedDateTime()}`],
        ["S.No", "Panchayat Name", ...dynamicActivities.map((a) => `${a} Entered`)]
      ];
      mandalData.forEach((row, idx) => {
        const r = [idx + 1, row["Panchayat Name"]];
        dynamicActivities.forEach((act) => {
          r.push(row.status?.[act] ?? 0);
        });
        r13Rows.push(r);
      });
      const totRow: any[] = ["Total", ""];
      dynamicActivities.forEach((act) => {
        totRow.push(mandalActivityTotals[act]?.entered ?? 0);
      });
      r13Rows.push(totRow);
      r13Rows.push([]);
      r13Rows.push(["Generated via E-VEDHIKA | Website: www.e-vedhika.in"]);
      const ws1 = XLSX.utils.aoa_to_sheet(r13Rows);
      XLSX.utils.book_append_sheet(wb, ws1, "Report 13 (Matrix)");

      // Sheet 2: Report 14 (Pending List)
      const r14Rows: any[][] = [
        [`MAS Not Entered Gram Panchayat's and Pending Activity Names Report as on ${uploadDateTime || getFormattedDateTime()}`],
        ["S.NO", "Panchayat Name", "Pending_activities_count", "pending_activities_names"]
      ];
      let sNo = 1;
      mandalData.forEach((row) => {
        if (row.pendingCount > 0) {
          const pText = row.pendingActivities.map((act: string, i: number) => `${i + 1}. ${act}`).join("\n");
          r14Rows.push([sNo++, row["Panchayat Name"], row.pendingCount, pText]);
        }
      });
      r14Rows.push([]);
      r14Rows.push(["Generated via E-VEDHIKA | Website: www.e-vedhika.in"]);
      const ws2 = XLSX.utils.aoa_to_sheet(r14Rows);
      XLSX.utils.book_append_sheet(wb, ws2, "Report 14 (Pending)");

      XLSX.writeFile(wb, "Mandal_MAS_Report_13_and_14.xlsx");
      addToast("Mandal Report 13 & 14 Excel file downloaded successfully!");
    } catch (e) {
      console.error(e);
      addToast("Excel export failed.");
    }
  };

  // Export District Excel
  const handleExportDistrictExcel = async () => {
    if (!districtData.length) return;
    try {
      const XLSX = await import("xlsx-js-style");
      const wb = XLSX.utils.book_new();

      const headers = [
        [`Statement showing the Monthly activity report for the month of ${uploadDateTime || getFormattedDateTime()}`],
        ["S.No", "Mandal Name", "Total GP's", ...dynamicActivities.map((a) => `${a} Entered %`), "Overall %"]
      ];

      const dataRows = districtData.map((row, idx) => {
        const r: any[] = [idx + 1, row["Mandal Name"], row["TotalGPs"]];
        dynamicActivities.forEach((act) => {
          r.push(row.activities?.[act]?.percentage ?? 0);
        });
        r.push(row["Overall %"] ?? 0);
        return r;
      });

      const totalRow: any[] = ["Total", "", districtGrandTotalGps];
      dynamicActivities.forEach((act) => {
        totalRow.push(districtActivityTotals[act]?.districtPct ?? 0);
      });
      totalRow.push(districtOverallTotalPct);

      const allRows = [
        ...headers, 
        ...dataRows, 
        totalRow,
        [],
        ["Generated via E-VEDHIKA | Website: www.e-vedhika.in"]
      ];
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      XLSX.utils.book_append_sheet(wb, ws, "District Report");
      XLSX.writeFile(wb, "District_MAS_Percentage_Report.xlsx");
      addToast("District percentage report Excel file downloaded successfully!");
    } catch (e) {
      console.error(e);
      addToast("Excel export failed.");
    }
  };

  // Export Complete PDF (Exactly matching user's PDF: Page 1 = Report 13, Pages 2-5 = Report 14)
  const handleExportPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      if (reportLevel === "district") {
        if (!districtData.length) return;
        const doc = new jsPDF("l", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(17, 81, 142);
        doc.rect(0, 0, pageWidth, 12, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        const title = `Statement showing the Monthly activity report for the month of ${uploadDateTime || getFormattedDateTime()}`;
        doc.text(title, pageWidth / 2, 7.5, { align: "center" });

        const headers = ["S.No", "Mandal Name", "Total GP's", ...dynamicActivities.map((a) => `${a}\nEntered %`), "Overall\n%"];
        const bodyRows: any[][] = [];

        districtData.forEach((row, idx) => {
          const r: any[] = [idx + 1, row["Mandal Name"], row["TotalGPs"]];
          dynamicActivities.forEach((act) => {
            r.push(row.activities?.[act]?.percentage?.toFixed(2) ?? "0.00");
          });
          r.push((row["Overall %"] ?? 0).toFixed(2));
          bodyRows.push(r);
        });

        const totalsRow: any[] = [districtData.length + 1, "Total", districtGrandTotalGps];
        dynamicActivities.forEach((act) => {
          totalsRow.push((districtActivityTotals[act]?.districtPct ?? 0).toFixed(2));
        });
        totalsRow.push(districtOverallTotalPct.toFixed(2));
        bodyRows.push(totalsRow);

        autoTable(doc, {
          startY: 15,
          head: [headers],
          body: bodyRows,
          theme: "grid",
          styles: { fontSize: 5.5, cellPadding: 0.8, halign: "center", valign: "middle", font: "helvetica", textColor: [0, 0, 0] },
          headStyles: { fontSize: 5.5, fontStyle: "bold", fillColor: [17, 81, 142], textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 7 },
            1: { cellWidth: 24, halign: "left", fontStyle: "bold" },
            2: { cellWidth: 12, halign: "center", fontStyle: "bold" }
          },
          didParseCell: (dataCell: any) => {
            const { row, column } = dataCell;
            if (row.section === "body") {
              if (row.index === bodyRows.length - 1) {
                dataCell.cell.styles.fontStyle = "bold";
                dataCell.cell.styles.fillColor = [240, 240, 240];
              } else if (column.index >= 3) {
                const val = parseFloat(dataCell.cell.text[0] || "0");
                if (val >= 99.99) {
                  dataCell.cell.styles.fillColor = [34, 197, 94];
                  dataCell.cell.styles.textColor = [255, 255, 255];
                  dataCell.cell.styles.fontStyle = "bold";
                } else if (val >= 90) {
                  dataCell.cell.styles.fillColor = [187, 247, 208];
                  dataCell.cell.styles.textColor = [15, 23, 42];
                  dataCell.cell.styles.fontStyle = "bold";
                } else if (val >= 75) {
                  dataCell.cell.styles.fillColor = [254, 249, 195];
                  dataCell.cell.styles.textColor = [15, 23, 42];
                  dataCell.cell.styles.fontStyle = "bold";
                } else if (val >= 50) {
                  dataCell.cell.styles.fillColor = [254, 240, 138];
                  dataCell.cell.styles.textColor = [15, 23, 42];
                  dataCell.cell.styles.fontStyle = "bold";
                } else {
                  dataCell.cell.styles.fillColor = [254, 205, 211];
                  dataCell.cell.styles.textColor = [15, 23, 42];
                  dataCell.cell.styles.fontStyle = "bold";
                }
              }
            }
          },
          didDrawPage: () => {
            const footerText = "Generated via E-VEDHIKA | Website: www.e-vedhika.in";
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(100, 116, 139);
            doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 4, { align: "center" });
          }
        });

        doc.save("District_Monthly_Activity_Report_A4.pdf");
        addToast("District percentage report (PDF) downloaded successfully!");

      } else {
        // MANDAL COMPLETE PDF (Page 1 = Report 13, Pages 2+ = Report 14)
        if (!mandalData.length) return;

        // Page 1: Landscape Report 13 Matrix
        const doc = new jsPDF("l", "mm", "a4");
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(17, 81, 142);
        doc.rect(0, 0, pageWidth, 12, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        const title13 = `Statement showing the Monthly activity report for the month of ${uploadDateTime || getFormattedDateTime()}`;
        doc.text(title13, pageWidth / 2, 7.5, { align: "center" });

        const headers13 = ["S.No", "Panchayat Name", ...dynamicActivities.map((a) => `${a}\nEntered`)];
        const bodyRows13: any[][] = [];

        mandalData.forEach((row, idx) => {
          const r: any[] = [idx + 1, row["Panchayat Name"]];
          dynamicActivities.forEach((act) => {
            r.push(row.status?.[act] ?? 0);
          });
          bodyRows13.push(r);
        });

        const totalsRow13: any[] = ["Total", ""];
        dynamicActivities.forEach((act) => {
          totalsRow13.push(mandalActivityTotals[act]?.entered ?? 0);
        });
        bodyRows13.push(totalsRow13);

        autoTable(doc, {
          startY: 15,
          head: [headers13],
          body: bodyRows13,
          theme: "grid",
          styles: { fontSize: 5.5, cellPadding: 0.8, halign: "center", valign: "middle", font: "helvetica", textColor: [0, 0, 0] },
          headStyles: { fontSize: 5.5, fontStyle: "bold", fillColor: [17, 81, 142], textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 28, halign: "left", fontStyle: "bold" }
          },
          didParseCell: (dataCell: any) => {
            const { row, column } = dataCell;
            if (row.section === "body") {
              if (row.index === bodyRows13.length - 1) {
                dataCell.cell.styles.fontStyle = "bold";
                dataCell.cell.styles.fillColor = [240, 240, 240];
              } else if (column.index >= 2 && column.index < 2 + dynamicActivities.length) {
                const val = Number(dataCell.cell.text[0] || "0");
                if (val === 0) {
                  dataCell.cell.styles.fillColor = [128, 0, 0]; // Maroon #800000
                  dataCell.cell.styles.textColor = [255, 255, 255];
                  dataCell.cell.styles.fontStyle = "bold";
                } else {
                  dataCell.cell.styles.fillColor = [255, 255, 255];
                  dataCell.cell.styles.textColor = [0, 0, 0];
                }
              }
            }
          },
          didDrawPage: () => {
            const footerText = "Generated via E-VEDHIKA | Website: www.e-vedhika.in";
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(100, 116, 139);
            doc.text(footerText, pageWidth / 2, doc.internal.pageSize.getHeight() - 4, { align: "center" });
          }
        });

        // Page 2+: Portrait Report 14 Pending List
        doc.addPage("a4", "p");
        const pWidth = doc.internal.pageSize.getWidth();

        doc.setFillColor(17, 81, 142);
        doc.rect(0, 0, pWidth, 14, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        const title14 = `MAS Not Entered Gram Panchayat's and Pending Activity Names Report as on ${uploadDateTime || getFormattedDateTime()}`;
        doc.text(title14, pWidth / 2, 8.5, { align: "center", maxWidth: pWidth - 10 });

        const headers14 = ["S.NO", "Panchayat Name", "Pending_activities_count", "pending_activities_names"];
        const bodyRows14: any[][] = [];

        let pSerial = 1;
        mandalData.forEach((row) => {
          if (row.pendingCount > 0) {
            const namesFormatted = row.pendingActivities
              .map((act: string, i: number) => `${i + 1}. ${act.replace(/^\d+[\s.)-]+/, "").trim()}`)
              .join("\n");
            bodyRows14.push([pSerial++, row["Panchayat Name"], row.pendingCount, namesFormatted]);
          }
        });

        autoTable(doc, {
          startY: 18,
          head: [headers14],
          body: bodyRows14,
          theme: "grid",
          styles: { fontSize: 7, cellPadding: 2, font: "helvetica", textColor: [0, 0, 0] },
          headStyles: { fontSize: 7.5, fontStyle: "bold", fillColor: [17, 81, 142], textColor: [255, 255, 255] },
          columnStyles: {
            0: { cellWidth: 12, halign: "center" },
            1: { cellWidth: 40, fontStyle: "bold" },
            2: { cellWidth: 35, halign: "center", fontStyle: "bold" },
            3: { cellWidth: 95 }
          },
          didDrawPage: (dataCell: any) => {
            const footerText = `Generated via E-VEDHIKA | Website: www.e-vedhika.in  •  Page ${dataCell.pageNumber}`;
            doc.setFontSize(7.5);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(100, 116, 139);
            doc.text(footerText, pWidth / 2, doc.internal.pageSize.getHeight() - 4, { align: "center" });
          }
        });

        doc.save("Mandal_MAS_Complete_Report_A4.pdf");
        addToast("Mandal MAS comprehensive report (PDF) downloaded successfully!");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to generate PDF.");
    }
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Copy WhatsApp alert for a single Panchayat
  const handleCopyWhatsAppMessage = (row: any, idx: number) => {
    const listText = row.pendingActivities.map((act: string, i: number) => `${i + 1}. ${act}`).join("\n");
    const msg = `*E-Panchayat MAS Pending Activity Alert*\n📍 *Gram Panchayat:* ${row["Panchayat Name"]}\n⚠️ *Pending Activities Count:* ${row.pendingCount}\n📊 *Current Completion:* ${row.percentage}%\n\n*Pending List:*\n${listText}\n\n_Please complete the above pending activities on the e-Panchayat portal immediately._\n\n🌐 _Generated via E-VEDHIKA | www.e-vedhika.in_`;
    navigator.clipboard.writeText(msg);
    setCopiedIndex(idx);
    addToast(`${row["Panchayat Name"]} pending details copied for WhatsApp!`);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Bulk WhatsApp summary for Mandal
  const handleCopyBulkMandalWhatsApp = () => {
    const pendingList = mandalData.filter((r) => r.pendingCount > 0);
    if (pendingList.length === 0) {
      addToast("All Panchayats in the Mandal are 100% completed!");
      return;
    }

    let msg = `*E-Panchayat Monthly Activity Status Report (MAS)*\n🏛️ *Mandal:* ${mandalNameInput || "Mandal"}\n📅 *Report Time:* ${uploadDateTime || getFormattedDateTime()}\n\n📊 *Summary:*\n• Total GPs: ${mandalData.length}\n• 100% Completed: ${mandalSummaryStats.completedGPs}\n• Pending GPs: ${mandalSummaryStats.pendingGPs}\n• Mandal Average Completion: ${mandalSummaryStats.avgPct}%\n\n⚠️ *Pending GP's List:*\n`;

    pendingList.forEach((r, idx) => {
      msg += `\n${idx + 1}. *${r["Panchayat Name"]}* (Pending: ${r.pendingCount}, %: ${r.percentage}%)\n   ${r.pendingActivities.join(", ")}\n`;
    });

    msg += `\n_All concerned Panchayat Secretaries are requested to complete the remaining entries immediately._\n\n🌐 _Generated via E-VEDHIKA | www.e-vedhika.in_`;

    navigator.clipboard.writeText(msg);
    setBulkCopied(true);
    addToast("Mandal pending details copied in WhatsApp broadcast format!");
    setTimeout(() => setBulkCopied(false), 3000);
  };

  // Add GP Entry manually
  const handleManualAddGp = () => {
    if (!newGpName.trim()) {
      addToast("Please enter Panchayat name.");
      return;
    }
    const status: Record<string, number> = {};
    const pendingActs: string[] = [];
    STANDARD_MAS_ACTIVITIES.forEach((act) => {
      const isEnt = newGpStatuses[act] === 1 ? 1 : 0;
      status[act] = isEnt;
      if (isEnt === 0) {
        pendingActs.push(`${act} Not Entered`);
      }
    });

    const pendingCount = pendingActs.length;
    const pct = parseFloat((((STANDARD_MAS_ACTIVITIES.length - pendingCount) / STANDARD_MAS_ACTIVITIES.length) * 100).toFixed(1));

    const newRecord = {
      "Panchayat Name": newGpName.trim().toUpperCase(),
      status,
      pendingActivities: pendingActs,
      pendingCount,
      percentage: pct
    };

    setMandalData((prev) => [...prev, newRecord]);
    setReportLevel("mandal");
    setIsAddModalOpen(false);
    setNewGpName("");
    setNewGpStatuses({});
    addToast(`${newRecord["Panchayat Name"]} details added successfully!`);
  };

  const hasData = (reportLevel === "district" && districtData.length > 0) || (reportLevel === "mandal" && mandalData.length > 0) || mandalData.length > 0 || districtData.length > 0;

  return (
    <div className="bg-white rounded-[32px] p-4 sm:p-8 border border-slate-100 mt-6 shadow-sm">
      {/* Hidden Unified File Input with multiple support */}
      <input
        type="file"
        multiple
        accept=".xlsx, .xls, .csv, .html, .htm"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Manual Data Entry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Plus size={20} />
                </span>
                <h3 className="text-lg font-black text-slate-800">
                  New Panchayat Data Entry (Manual Entry)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gram Panchayat Name *
                </label>
                <input
                  type="text"
                  value={newGpName}
                  onChange={(e) => setNewGpName(e.target.value)}
                  placeholder="e.g. AKKALAPALLI"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Activities Status (17 Activities):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STANDARD_MAS_ACTIVITIES.map((act, idx) => {
                    const isDone = newGpStatuses[act] === 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setNewGpStatuses((prev) => ({
                            ...prev,
                            [act]: isDone ? 0 : 1
                          }))
                        }
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isDone
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span>{act}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isDone ? "Entered (1)" : "Pending (0)"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleManualAddGp}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Monthly Record (District Level Modal) - Exactly Matching User Screenshot */}
      {editingDistrictMandal && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-xs">
                  <CheckSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                    Edit Monthly Record
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Enter valid numbers for Entered & Not Entered; real-time green checkmark (✓) confirms validation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingDistrictMandal(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Validation Progress & Mandal Info */}
            <div className="mb-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span>Mandal: <strong className="text-slate-900 font-black">{editingDistrictMandal["Mandal Name"]}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span>Total GPs: <strong className="text-sky-700 font-black">{editingDistrictMandal["TotalGPs"]}</strong></span>
                </div>
                <div className="text-xs font-bold text-slate-700">
                  Validation Progress:{" "}
                  <span className="text-emerald-700 font-black">
                    {dynamicActivities.filter((act) => {
                      const item = tempDistrictActivities[act] || { entered: 0, notEntered: 0 };
                      return (item.entered + item.notEntered) === (editingDistrictMandal["TotalGPs"] || 0);
                    }).length}{" "}
                    / {dynamicActivities.length} activities matched (
                    {Math.round(
                      (dynamicActivities.filter((act) => {
                        const item = tempDistrictActivities[act] || { entered: 0, notEntered: 0 };
                        return (item.entered + item.notEntered) === (editingDistrictMandal["TotalGPs"] || 0);
                      }).length /
                        (dynamicActivities.length || 1)) *
                        100
                    )}
                    %)
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (dynamicActivities.filter((act) => {
                        const item = tempDistrictActivities[act] || { entered: 0, notEntered: 0 };
                        return (item.entered + item.notEntered) === (editingDistrictMandal["TotalGPs"] || 0);
                      }).length /
                        (dynamicActivities.length || 1)) *
                        100
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Scrollable Grid of 17 Activity Cards */}
            <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pb-2">
                {dynamicActivities.map((act, idx) => {
                  const totGps = editingDistrictMandal["TotalGPs"] || 1;
                  const item = tempDistrictActivities[act] || { entered: 0, notEntered: 0 };
                  const isMatched = (item.entered + item.notEntered) === totGps;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isMatched
                          ? "bg-emerald-50/20 border-emerald-300 shadow-xs"
                          : "bg-amber-50/20 border-amber-300"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-xs sm:text-sm font-black text-slate-800 truncate">
                          {act}
                        </span>
                        {isMatched ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300 shrink-0">
                            <Check size={12} className="stroke-[3]" /> Matched ({item.entered + item.notEntered}/{totGps})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/80 text-amber-800 border border-amber-300 shrink-0">
                            Total: {item.entered + item.notEntered}/{totGps}
                          </span>
                        )}
                      </div>

                      {/* Side-by-side inputs matching user screenshot */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {/* Entered Field */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">Entered:</label>
                            {item.entered >= 0 && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                <Check size={11} className="stroke-[3]" /> Ok
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max={totGps}
                              value={item.entered}
                              onChange={(e) => handleUpdateDistrictActivity(act, "entered", e.target.value)}
                              className="w-full pl-3 pr-8 py-2 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-base font-black text-slate-900 focus:outline-none transition-colors"
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </div>

                        {/* Not Entered Field */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-bold text-slate-700">Not Entered:</label>
                            {item.notEntered >= 0 && (
                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                <Check size={11} className="stroke-[3]" /> Ok
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max={totGps}
                              value={item.notEntered}
                              onChange={(e) => handleUpdateDistrictActivity(act, "notEntered", e.target.value)}
                              className={`w-full pl-3 pr-8 py-2 bg-emerald-50/50 border border-emerald-200 focus:border-emerald-500 rounded-xl text-base font-black focus:outline-none transition-colors ${
                                item.notEntered > 0 ? "text-rose-700" : "text-slate-900"
                              }`}
                            />
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 mt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingDistrictMandal(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDistrictRecord}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check size={16} className="stroke-[3]" />
                <span>Update Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Panchayat Record (Mandal Level Modal) */}
      {editingMandalGp && (
        <div className="fixed inset-0 z-[3000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center shadow-xs">
                  <CheckSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                    Edit Panchayat Record
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Easily update Panchayat name and activities status (Entered / Pending).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMandalGp(null)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panchayat Name input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gram Panchayat Name:
              </label>
              <input
                type="text"
                value={tempGpName}
                onChange={(e) => setTempGpName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-bold text-slate-800 focus:outline-none"
              />
            </div>

            {/* Activity Toggles */}
            <div className="flex-1 overflow-y-auto pr-1.5 custom-scrollbar mb-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Activities Status:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dynamicActivities.map((act, idx) => {
                  const isDone = tempGpStatuses[act] === 1;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setTempGpStatuses((prev) => ({
                          ...prev,
                          [act]: isDone ? 0 : 1
                        }))
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDone
                          ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{act}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                          isDone ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isDone ? "Entered (1)" : "Pending (0)"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingMandalGp(null)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMandalGp}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check size={16} className="stroke-[3]" />
                <span>Update Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INITIAL SCREEN (When No Data Loaded Yet) - Exactly Matching User Screenshot */}
      {!hasData ? (
        <div>
          {/* Header Banner matching screenshot */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <FileSpreadsheet className="text-sky-700" size={26} />
                E-Panchayat Monthly Activity Report
              </h2>
              <p className="text-slate-500 font-medium mt-1 text-xs sm:text-sm">
                Upload raw data file to generate exact Telangana State activity data entry report format with page setup.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#11518E] hover:bg-[#0d3f6f] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                title="Upload Raw File"
              >
                <Upload size={16} /> Upload Raw File
              </button>
            </div>
          </div>

          {/* Upload Activity Data File Card */}
          <div className="max-w-2xl mx-auto my-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#11518E] hover:bg-sky-50/20 rounded-[28px] p-10 text-center bg-white transition-all shadow-xs flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-100 rounded-2xl flex items-center justify-center text-[#11518E] mb-4 border border-blue-100 shadow-2xs transition-colors">
                <Upload size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">
                Upload Raw Activity Data File
              </h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
                Select a raw .xls or .xlsx report file to generate the official color-coded report format with page setup.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-6 py-2.5 bg-[#11518E] hover:bg-[#0d3f6f] text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Upload size={14} /> Choose File
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* OUTPUT VIEW (When File Data Loaded or Added) */
        <div>
          {/* Header Banner and Action Toolbar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 pb-6 border-b border-slate-100 gap-4 print:hidden">
            <div>
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-sky-50 text-sky-800 rounded-2xl">
                  {reportLevel === "district" ? <Building2 size={26} /> : <Landmark size={26} />}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">
                      {reportLevel === "district" ? "District Level Report" : "Mandal Level Report"}
                    </span>
                    {uploadedFilesLabel && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] truncate max-w-[200px]" title={uploadedFilesLabel}>
                        File: {uploadedFilesLabel}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-0.5">
                    {reportLevel === "district"
                      ? "District MAS – District Level Monitoring"
                      : "Mandal MAS – Mandal Level Monitoring"}
                  </h2>
                </div>
              </div>
              <p className="text-slate-500 font-medium mt-1 text-xs sm:text-sm">
                {reportLevel === "district"
                  ? "Percentage analysis, rankings & color-coded comprehensive report for all Mandals in the district."
                  : "Panchayat-wise MAS Report 13 Matrix and Report 14 Pending List comprehensive report."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#11518E] text-white hover:bg-[#0d3f6f] font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
                title="Upload Report 14, Report 13, or both files together"
              >
                <Upload size={14} /> Change File
              </button>

              {reportLevel === "mandal" && (
                <button
                  type="button"
                  onClick={handleCopyBulkMandalWhatsApp}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
                  title="Copy entire Mandal pending summary to WhatsApp"
                >
                  {bulkCopied ? <Check size={14} /> : <MessageSquareShare size={14} />}
                  {bulkCopied ? "Copied!" : "WhatsApp Broadcast"}
                </button>
              )}

              <button
                type="button"
                onClick={reportLevel === "district" ? handleExportDistrictExcel : handleExportMandalExcel}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all border border-slate-200 cursor-pointer"
              >
                <Download size={14} /> Excel
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <FileText size={14} /> PDF (A4 Download)
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-2xs cursor-pointer"
              >
                <Printer size={14} /> Print
              </button>

              <button
                type="button"
                onClick={handleClearData}
                className="flex items-center gap-1.5 px-3 py-2.5 text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all border border-rose-200 cursor-pointer"
                title="Clear Data"
              >
                <Trash2 size={14} /> Clear Data
              </button>
            </div>
          </div>

      {/* OVERVIEW STAT CARDS (When data is loaded) */}
      {reportLevel === "mandal" && mandalData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 print:hidden">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500">Total GPs</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{mandalSummaryStats.totalGPs}</div>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-800">100% Completed</span>
            <div className="text-xl font-black text-emerald-900 mt-0.5">{mandalSummaryStats.completedGPs}</div>
          </div>
          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 shadow-2xs">
            <span className="text-[11px] font-bold text-rose-800">Pending GPs</span>
            <div className="text-xl font-black text-rose-900 mt-0.5">{mandalSummaryStats.pendingGPs}</div>
          </div>
          <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-800">Mandal Avg Completion</span>
            <div className="text-xl font-black text-blue-900 mt-0.5">{mandalSummaryStats.avgPct}%</div>
          </div>
        </div>
      )}

      {reportLevel === "district" && districtData.length > 0 && districtStats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6 print:hidden">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500">Total Mandals</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{districtStats.totalMandals}</div>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500">District Total GPs</span>
            <div className="text-xl font-black text-slate-800 mt-0.5">{districtStats.totalGps}</div>
          </div>
          <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 shadow-2xs">
            <span className="text-[11px] font-bold text-blue-800">District Avg Completion</span>
            <div className="text-xl font-black text-blue-900 mt-0.5">{districtStats.overallPct}%</div>
          </div>
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-800">Top Performing Mandal</span>
            <div className="text-xs font-black text-emerald-950 truncate mt-0.5" title={districtStats.highestMandal?.["Mandal Name"]}>
              {districtStats.highestMandal?.["Mandal Name"]}
            </div>
            <div className="text-xs font-bold text-emerald-700">({districtStats.highestMandal?.["Overall %"]}%)</div>
          </div>
          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-rose-800">Low Progress Mandal</span>
            <div className="text-xs font-black text-rose-950 truncate mt-0.5" title={districtStats.lowestMandal?.["Mandal Name"]}>
              {districtStats.lowestMandal?.["Mandal Name"]}
            </div>
            <div className="text-xs font-bold text-rose-700">({districtStats.lowestMandal?.["Overall %"]}%)</div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MANDAL MAS VIEW: Continuous Complete PDF Layout (Matching User's PDF)      */}
      {/* ========================================================================= */}
      {reportLevel === "mandal" && (
        <>
          {!mandalData.length ? (
            /* Unified Empty State: Single Clean Upload Card */
            <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-8 sm:p-14 flex flex-col items-center justify-center text-center my-4 bg-slate-50/50">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-700 mb-4 border border-blue-100 shadow-2xs">
                <Landmark size={30} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-2">
                Mandal Level MAS Report Upload (Report 14 or Report 13)
              </h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-lg mb-6 leading-relaxed">
                Upload Report 14 (Pending List) or Report 13 file (.xlsx, .xls, .csv or .html) downloaded from e-Panchayat portal. You can also select both files together.
              </p>
              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3.5 bg-[#11518E] text-white text-sm font-bold rounded-xl hover:bg-[#0d3f6f] transition-all flex items-center gap-2.5 shadow-md cursor-pointer"
                >
                  <Upload size={18} /> Upload Report File(s)
                </button>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs mt-2">
                  <AlertCircle size={14} className="text-blue-600" />
                  <span>Uploading Report 14 is sufficient; both Report 13 Matrix and Report 14 Pending List will be generated automatically.</span>
                </div>
              </div>
            </div>
          ) : (
            /* Mandal MAS Complete View (Report 13 + Report 14 in Continuous PDF Flow) */
            <div className="space-y-8">
              {/* Optional Search / Quick GP Filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 print:hidden">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Panchayat Name..."
                    className="w-full bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                    style={{
                      paddingLeft: "28px",
                      paddingRight: "0px",
                      paddingBottom: "4px",
                      paddingTop: "4px",
                      marginBottom: "26px",
                      height: "36.3281px",
                      fontWeight: "bold",
                      fontStyle: "italic",
                      fontFamily: "Georgia, serif",
                    }}
                  />
                  <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPendingFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pendingFilter === "all" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    All ({mandalData.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingFilter("pending")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pendingFilter === "pending" ? "bg-rose-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    Pending ({mandalSummaryStats.pendingGPs})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingFilter("completed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      pendingFilter === "completed" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    100% Completed ({mandalSummaryStats.completedGPs})
                  </button>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SECTION 1: Report 13 Table (Matching Page 1 of PDF)            */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white rounded-xl border border-black overflow-hidden shadow-2xs">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse bg-white text-[11px] font-medium border border-black print:text-[8px]">
                    <thead>
                      <tr>
                        <th
                          colSpan={2 + dynamicActivities.length + 1}
                          className="bg-[#11518E] text-white py-2.5 px-4 text-center font-bold text-xs sm:text-sm tracking-wide border border-black"
                        >
                          Statement showing the Monthly activity report for the month of {uploadDateTime || getFormattedDateTime()}
                        </th>
                      </tr>
                      <tr className="bg-[#0f4c81] text-white text-center font-bold">
                        <th className="py-2 px-2 border border-black w-10">S.No</th>
                        <th className="py-2 px-4 border border-black min-w-[150px] text-left">Panchayat Name</th>
                        {dynamicActivities.map((act, i) => {
                          const actLabel = act.toLowerCase().endsWith("entered") ? act : `${act}\nEntered`;
                          return (
                            <th key={i} className="py-2 px-2 border border-black min-w-[75px] leading-tight whitespace-pre-line text-center">
                              {actLabel}
                            </th>
                          );
                        })}
                        <th className="py-2 px-3 border border-black min-w-[90px] print:hidden">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMandalData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors text-center">
                          <td className="py-1.5 px-2 border border-black font-bold text-slate-800">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-3 border border-black font-black text-slate-900 text-left whitespace-nowrap">
                            {row["Panchayat Name"]}
                          </td>
                          {dynamicActivities.map((act, aIdx) => {
                            const isEnt = row.status?.[act] === 1;
                            return (
                              <td
                                key={aIdx}
                                className={`py-1.5 px-2 border border-black font-bold text-center ${
                                  isEnt
                                    ? "bg-white text-black font-bold"
                                    : "bg-[#800000] text-white font-black"
                                }`}
                              >
                                {isEnt ? "1" : "0"}
                              </td>
                            );
                          })}
                          <td className="py-1.5 px-2 border border-black text-center whitespace-nowrap print:hidden">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenEditMandalGp(row)}
                                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Edit Record"
                              >
                                <Pencil size={16} className="stroke-[2.2]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMandalGp(row["Panchayat Name"])}
                                className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 size={16} className="stroke-[2.2]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-white font-bold border-t-2 border-black text-center">
                        <td className="py-2 px-2 border border-black font-black text-slate-900">
                          {mandalData.length + 1}
                        </td>
                        <td className="py-2 px-3 border border-black font-black text-slate-900 text-left">
                          Total
                        </td>
                        {dynamicActivities.map((act, idx) => (
                          <td
                            key={idx}
                            className="py-2 px-2 border border-black font-black text-center bg-white text-slate-900"
                          >
                            {mandalActivityTotals[act]?.entered ?? 0}
                          </td>
                        ))}
                        <td className="py-2 px-2 border border-black bg-white print:hidden"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Branding footer */}
                <div className="text-center py-2 text-[11px] font-bold text-slate-500 print:text-black border-t border-slate-200">
                  Generated via <span className="text-blue-700 print:text-black font-black">E-VEDHIKA</span> | Website: <span className="text-blue-600 print:text-black">www.e-vedhika.in</span>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SECTION 2: Report 14 Table (Matching Pages 2-5 of PDF)         */}
              {/* ------------------------------------------------------------- */}
              <div className="bg-white rounded-xl border border-black overflow-hidden shadow-2xs print:break-before-page">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full border-collapse bg-white text-xs font-medium border border-black">
                    <thead>
                      <tr>
                        <th
                          colSpan={4}
                          className="bg-[#11518E] text-white py-2.5 px-4 text-center font-bold text-xs sm:text-sm tracking-wide border border-black"
                        >
                          MAS Not Entered Gram Panchayat's and Pending Activity Names Report as on {uploadDateTime || getFormattedDateTime()}
                        </th>
                      </tr>
                      <tr className="bg-[#0f4c81] text-white text-left font-bold text-xs">
                        <th className="py-2 px-3 border border-black w-14 text-center">S.NO</th>
                        <th className="py-2 px-4 border border-black w-60">Panchayat Name</th>
                        <th className="py-2 px-3 border border-black w-48 text-center">Pending_activities_count</th>
                        <th className="py-2 px-4 border border-black">pending_activities_names</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMandalData
                        .filter((r) => r.pendingCount > 0)
                        .map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors align-top">
                            <td className="py-2.5 px-2 border border-black font-bold text-slate-800 text-center">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-4 border border-black font-black text-slate-900">
                              {row["Panchayat Name"]}
                              <div className="mt-2 print:hidden">
                                <button
                                  type="button"
                                  onClick={() => handleCopyWhatsAppMessage(row, idx)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                    copiedIndex === idx
                                      ? "bg-emerald-600 text-white"
                                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                                  }`}
                                  title="Copy WhatsApp Alert"
                                >
                                  {copiedIndex === idx ? <Check size={12} /> : <Share2 size={12} />}
                                  {copiedIndex === idx ? "Copied!" : "Copy WhatsApp Alert"}
                                </button>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 border border-black font-black text-center text-sm text-slate-900 bg-white">
                              {row.pendingCount}
                            </td>
                            <td className="py-2 px-4 border border-black text-slate-900">
                              <div className="space-y-0.5">
                                {row.pendingActivities.map((pAct: string, pIdx: number) => {
                                  const clean = pAct.replace(/^\d+[\s.)-]+/, "").trim();
                                  return (
                                    <div key={pIdx} className="text-xs font-normal text-slate-900 leading-snug">
                                      <span className="font-semibold text-slate-950 mr-1">{pIdx + 1}.</span>
                                      <span>{clean}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      {filteredMandalData.filter((r) => r.pendingCount > 0).length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-emerald-700 font-bold bg-emerald-50">
                            ✓ Congratulations! All Panchayats in the Mandal have successfully submitted 100% activities (No Pending Activities).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Branding footer */}
                <div className="text-center py-2 text-[11px] font-bold text-slate-500 print:text-black border-t border-slate-200">
                  Generated via <span className="text-blue-700 print:text-black font-black">E-VEDHIKA</span> | Website: <span className="text-blue-600 print:text-black">www.e-vedhika.in</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* DISTRICT MAS VIEW: District Percentage Analysis (% Report)                */}
      {/* ========================================================================= */}
      {reportLevel === "district" && (
        <>
          {!districtData.length ? (
            <div className="border-2 border-dashed border-slate-200 rounded-[28px] p-8 sm:p-14 flex flex-col items-center justify-center text-center my-4 bg-slate-50/50">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-700 mb-4 border border-sky-100 shadow-2xs">
                <Building2 size={30} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 mb-2">
                District Level Percentage Report (District MAS)
              </h3>
              <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-lg mb-6 leading-relaxed">
                Upload district level MAS file (.xlsx, .xls, .csv or .html) downloaded from e-Panchayat portal. All Mandals' activity percentages and rankings will be analyzed.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3.5 bg-[#11518E] text-white text-sm font-bold rounded-xl hover:bg-[#0d3f6f] transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Upload size={18} /> Upload District Report File
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 print:hidden">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Mandal Name..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                  <Filter size={14} className="absolute left-3 top-3 text-slate-400" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Showing Mandals: <span className="text-sky-700 font-black">{filteredDistrictData.length}</span> / {districtData.length}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-black custom-scrollbar pb-4 bg-white print:border-none">
                <div className="inline-block min-w-full">
                  <table className="w-full border-collapse bg-white text-[11px] font-medium border border-black print:text-[9px]">
                    <thead>
                      <tr>
                        <th
                          colSpan={3 + dynamicActivities.length + 1 + 1}
                          className="bg-[#11518E] text-white py-2.5 px-3 border border-black text-center font-black text-sm tracking-wide"
                        >
                          Statement showing the Monthly activity report for the month of {uploadDateTime || getFormattedDateTime()}
                        </th>
                      </tr>
                      <tr className="bg-[#0f4c81] text-white text-center font-bold">
                        <th className="py-2 px-2 border border-black">S.No</th>
                        <th className="py-2 px-4 border border-black min-w-[140px] text-left">Mandal Name</th>
                        <th className="py-2 px-2 border border-black min-w-[70px]">Total GP's</th>
                        {dynamicActivities.map((act, i) => (
                          <th key={i} className="py-2 px-2 border border-black min-w-[85px] leading-tight">
                            {act}<br />Entered %
                          </th>
                        ))}
                        <th className="py-2 px-2 border border-black min-w-[75px] bg-[#0d3f6f]">
                          Overall<br />%
                        </th>
                        <th className="py-2 px-3 border border-black min-w-[90px] print:hidden">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDistrictData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors text-center">
                          <td className="py-1.5 px-2 border border-black font-bold text-slate-800">
                            {idx + 1}
                          </td>
                          <td className="py-1.5 px-3 border border-black font-black text-slate-900 text-left whitespace-nowrap">
                            {row["Mandal Name"]}
                          </td>
                          <td className="py-1.5 px-2 border border-black font-bold text-slate-900 bg-slate-50">
                            {row["TotalGPs"]}
                          </td>
                          {dynamicActivities.map((act, aIdx) => {
                            const actInfo = row.activities?.[act] || { percentage: 0 };
                            const pct = actInfo.percentage;
                            const colorCls = getPercentageColorClass(pct);
                            return (
                              <td
                                key={aIdx}
                                className={`py-1.5 px-2 border border-black text-center font-bold ${colorCls}`}
                              >
                                {pct.toFixed(2)}
                              </td>
                            );
                          })}
                          <td className={`py-1.5 px-2 border border-black text-center font-black ${getPercentageColorClass(row["Overall %"] ?? 0)}`}>
                            {(row["Overall %"] ?? 0).toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 border border-black text-center whitespace-nowrap print:hidden">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleOpenEditDistrictRecord(row)}
                                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Edit Record"
                              >
                                <Pencil size={16} className="stroke-[2.2]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDistrictMandal(row["Mandal Name"])}
                                className="text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 size={16} className="stroke-[2.2]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {/* Total Row */}
                      <tr className="bg-white font-bold border-t-2 border-black text-center">
                        <td className="py-2 px-2 border border-black font-black text-slate-900">
                          {districtData.length + 1}
                        </td>
                        <td className="py-2 px-3 border border-black font-black text-slate-900 text-left">
                          Total
                        </td>
                        <td className="py-2 px-2 border border-black font-black text-slate-900 bg-slate-100">
                          {districtGrandTotalGps}
                        </td>
                        {dynamicActivities.map((act, idx) => {
                          const totPct = districtActivityTotals[act]?.districtPct ?? 0;
                          return (
                            <td
                              key={idx}
                              className={`py-2 px-2 border border-black font-black text-center ${getPercentageColorClass(totPct)}`}
                            >
                              {totPct.toFixed(2)}
                            </td>
                          );
                        })}
                        <td className={`py-2 px-2 border border-black font-black text-center ${getPercentageColorClass(districtOverallTotalPct)}`}>
                          {districtOverallTotalPct.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 border border-black bg-white print:hidden"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Branding footer */}
                <div className="text-center py-2 text-[11px] font-bold text-slate-500 print:text-black border-t border-slate-200">
                  Generated via <span className="text-blue-700 print:text-black font-black">E-VEDHIKA</span> | Website: <span className="text-blue-600 print:text-black">www.e-vedhika.in</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
        </div>
      )}
    </div>
  );
}

export default MonthlyActivityFormatter;
