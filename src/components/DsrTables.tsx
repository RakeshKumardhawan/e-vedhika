import React, { useState, useMemo } from "react";
import { Download, Copy, FileSpreadsheet, BarChart3, Calendar, AlertTriangle, LayoutGrid, CheckCircle2, ChevronDown, ChevronUp, Printer, FileText } from "lucide-react";

interface DsrTablesProps {
  mandalSummaries: any[];
  data: any[];
  grandTotal: any;
  reportDate: string;
  reportTime: string;
  fullTimestamp: string;
  addToast: (msg: string) => void;
  loadHeavyModules: () => Promise<void>;
  XLSX: any;
  onSelectMandal?: (mandalName: string) => void;
}

export const DsrTables: React.FC<DsrTablesProps> = ({
  mandalSummaries,
  data,
  grandTotal,
  reportDate,
  reportTime,
  fullTimestamp,
  addToast,
  loadHeavyModules,
  XLSX,
  onSelectMandal,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<
    "status_summary" | "leave_meetings" | "pending_gps" | "all_combined"
  >("status_summary");

  const [expandedMandals, setExpandedMandals] = useState<Record<string, boolean>>({});
  const toggleMandalExpand = (mandalName: string) => {
    setExpandedMandals((prev) => ({
      ...prev,
      [mandalName]: !prev[mandalName],
    }));
  };

  // Filter for Meeting/Training/Leave records (Image 1)
  const leaveMeetingRecords = useMemo(() => {
    return data.filter(
      (r) =>
        r.leaveToday > 0 ||
        r.meetingTraining > 0 ||
        r.isLeave ||
        r.isMeeting ||
        r.isTraining ||
        (r.attStatus &&
          (r.attStatus.toLowerCase().includes("leave") ||
            r.attStatus.toLowerCase().includes("meeting") ||
            r.attStatus.toLowerCase().includes("training")))
    );
  }, [data]);

  // Filter for Not Reported Mandals & GPs (Image 3 Table 1)
  const notReportedMandals = useMemo(() => {
    return mandalSummaries
      .filter((m) => m.notReported > 0)
      .map((m) => {
        const notReportedGps = m.gps.filter((g: any) => g.notReported > 0);
        return {
          mandal: m.mandal,
          balanceGps: m.notReported,
          gpsList: notReportedGps.map((g: any, i: number) => `${i + 1}. ${g.gp}`).join(", "),
        };
      });
  }, [mandalSummaries]);

  // Filter for DSR Not Completed Mandals & GPs (Image 3 Table 2)
  const dsrNotCompletedMandals = useMemo(() => {
    return mandalSummaries
      .filter((m) => m.totalGPs - m.dsrEntered > 0)
      .map((m) => {
        const pendingGps = m.gps.filter((g: any) => g.dsrEntered === 0);
        return {
          mandal: m.mandal,
          balanceGps: m.totalGPs - m.dsrEntered,
          gpsList: pendingGps.map((g: any, i: number) => `${i + 1}. ${g.gp}`).join(", "),
        };
      });
  }, [mandalSummaries]);

  // Copy helper for Status Summary (Image 2)
  const copyStatusSummaryTable = () => {
    if (mandalSummaries.length === 0) return;
    const headers = [
      "S.NO",
      "Mandal Name",
      "Total No. of GPs",
      "No. of PS Attended the GP",
      "No. of PS reported Meeting/Training and Leave",
      "% of PS reported",
      "Not Reported PS",
      "No. of PS Entered DSR",
      "% of PS DSR Entered",
      "No. of PS submitted before 9 AM",
      "% PS Submitted before 9 AM",
      "after_9_am",
      "% ps reported after 9 am",
    ];
    const lines: string[] = [];
    lines.push(`Status of PS Attendance and Reporting DSR as of ${fullTimestamp}`);
    lines.push(headers.join("\t"));

    mandalSummaries.forEach((m, idx) => {
      const after9Count = m.c9_11 + m.after11AM;
      const pctRep = m.totalGPs > 0 ? (m.totalReported / m.totalGPs) * 100 : 0;
      const pctDsr = m.totalGPs > 0 ? (m.dsrEntered / m.totalGPs) * 100 : 0;
      const pctBef9 = m.totalGPs > 0 ? (m.before9AM / m.totalGPs) * 100 : 0;
      const pctAft9 = m.totalGPs > 0 ? (after9Count / m.totalGPs) * 100 : 0;

      lines.push(
        [
          idx + 1,
          m.mandal,
          m.totalGPs,
          m.attendedGP,
          m.meetingTraining + m.leaveToday,
          `${pctRep.toFixed(1)}%`,
          m.notReported,
          m.dsrEntered,
          `${pctDsr.toFixed(1)}%`,
          m.before9AM,
          `${pctBef9.toFixed(2)}%`,
          after9Count,
          `${pctAft9.toFixed(2)}%`,
        ].join("\t")
      );
    });

    const totAfter9 = grandTotal.c9_11 + grandTotal.after11AM;
    const totPctRep = grandTotal.totalGPs > 0 ? (grandTotal.totalReported / grandTotal.totalGPs) * 100 : 0;
    const totPctDsr = grandTotal.totalGPs > 0 ? (grandTotal.dsrEntered / grandTotal.totalGPs) * 100 : 0;
    const totPctBef9 = grandTotal.totalGPs > 0 ? (grandTotal.before9AM / grandTotal.totalGPs) * 100 : 0;
    const totPctAft9 = grandTotal.totalGPs > 0 ? (totAfter9 / grandTotal.totalGPs) * 100 : 0;

    lines.push(
      [
        mandalSummaries.length + 1,
        "Total",
        grandTotal.totalGPs,
        grandTotal.attendedGP,
        grandTotal.meetingTraining + grandTotal.leaveToday,
        `${totPctRep.toFixed(2)}%`,
        grandTotal.notReported,
        grandTotal.dsrEntered,
        `${totPctDsr.toFixed(2)}%`,
        grandTotal.before9AM,
        `${totPctBef9.toFixed(2)}%`,
        totAfter9,
        `${totPctAft9.toFixed(2)}%`,
      ].join("\t")
    );

    navigator.clipboard.writeText(lines.join("\n"));
    addToast("Status of PS Attendance & DSR టేబుల్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!");
  };

  // Download Excel helper for Status Summary (Image 2)
  const downloadStatusSummaryExcel = async () => {
    await loadHeavyModules();
    if (mandalSummaries.length === 0) return;
    const aoa: any[][] = [];
    aoa.push([`Status of PS Attendance and Reporting DSR as of ${fullTimestamp}`]);
    aoa.push([]);
    aoa.push([
      "S.NO",
      "Mandal Name",
      "Total No. of GPs",
      "No. of PS Attended the GP",
      "No. of PS reported Meeting/Training and Leave",
      "% of PS reported",
      "Not Reported PS",
      "No. of PS Entered DSR",
      "% of PS DSR Entered",
      "No. of PS submitted before 9 AM",
      "% PS Submitted before 9 AM",
      "after_9_am",
      "% ps reported after 9 am",
    ]);

    mandalSummaries.forEach((m, idx) => {
      const after9Count = m.c9_11 + m.after11AM;
      const pctRep = m.totalGPs > 0 ? (m.totalReported / m.totalGPs) * 100 : 0;
      const pctDsr = m.totalGPs > 0 ? (m.dsrEntered / m.totalGPs) * 100 : 0;
      const pctBef9 = m.totalGPs > 0 ? (m.before9AM / m.totalGPs) * 100 : 0;
      const pctAft9 = m.totalGPs > 0 ? (after9Count / m.totalGPs) * 100 : 0;
      aoa.push([
        idx + 1,
        m.mandal,
        m.totalGPs,
        m.attendedGP,
        m.meetingTraining + m.leaveToday,
        `${pctRep.toFixed(1)}%`,
        m.notReported,
        m.dsrEntered,
        `${pctDsr.toFixed(1)}%`,
        m.before9AM,
        `${pctBef9.toFixed(2)}%`,
        after9Count,
        `${pctAft9.toFixed(2)}%`,
      ]);
    });

    const totAfter9 = grandTotal.c9_11 + grandTotal.after11AM;
    const totPctRep = grandTotal.totalGPs > 0 ? (grandTotal.totalReported / grandTotal.totalGPs) * 100 : 0;
    const totPctDsr = grandTotal.totalGPs > 0 ? (grandTotal.dsrEntered / grandTotal.totalGPs) * 100 : 0;
    const totPctBef9 = grandTotal.totalGPs > 0 ? (grandTotal.before9AM / grandTotal.totalGPs) * 100 : 0;
    const totPctAft9 = grandTotal.totalGPs > 0 ? (totAfter9 / grandTotal.totalGPs) * 100 : 0;

    aoa.push([
      mandalSummaries.length + 1,
      "Total",
      grandTotal.totalGPs,
      grandTotal.attendedGP,
      grandTotal.meetingTraining + grandTotal.leaveToday,
      `${totPctRep.toFixed(2)}%`,
      grandTotal.notReported,
      grandTotal.dsrEntered,
      `${totPctDsr.toFixed(2)}%`,
      grandTotal.before9AM,
      `${totPctBef9.toFixed(2)}%`,
      totAfter9,
      `${totPctAft9.toFixed(2)}%`,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PS Attendance & DSR");
    XLSX.writeFile(wb, `Status_PS_Attendance_Reporting_DSR_${reportDate.replace(/\./g, "-")}.xlsx`);
    addToast("PS Attendance & DSR Status ఎక్సెల్ ఫైల్ డౌన్లోడ్ అవుతోంది...");
  };

  // Copy helper for Leave/Meetings (Image 1)
  const copyLeaveMeetingsTable = () => {
    if (leaveMeetingRecords.length === 0) return;
    const headers = [
      "S.NO",
      "Mandal Name",
      "Panchayat Name",
      "Reporting Date",
      "Attendance Status",
      "Attendance Time",
    ];
    const lines: string[] = [];
    lines.push(`ATTENDANCE REPORTED AS MEETING/TRAINING/ONLEAVE: ${fullTimestamp}`);
    lines.push(headers.join("\t"));
    leaveMeetingRecords.forEach((r, idx) => {
      lines.push(
        [
          idx + 1,
          r.mandal,
          r.gp,
          r.reportingDate || reportDate,
          r.rawAttStatus ||
            (r.isLeave
              ? "On Leave"
              : r.isMeeting
                ? "Meeting at Mandal Level"
                : r.isTraining
                  ? "Training at State Level"
                  : "Meeting/Leave"),
          r.attTime && r.attTime !== "-" ? r.attTime : "-",
        ].join("\t")
      );
    });
    navigator.clipboard.writeText(lines.join("\n"));
    addToast("Meeting / Training / On Leave టేబుల్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!");
  };

  // Download Excel for Leave/Meetings (Image 1)
  const downloadLeaveMeetingsExcel = async () => {
    await loadHeavyModules();
    if (leaveMeetingRecords.length === 0) return;
    const aoa: any[][] = [];
    aoa.push([`ATTENDANCE REPORTED AS MEETING/TRAINING/ONLEAVE: ${fullTimestamp}`]);
    aoa.push([]);
    aoa.push([
      "S.NO",
      "Mandal Name",
      "Panchayat Name",
      "Reporting Date",
      "Attendance Status",
      "Attendance Time",
    ]);
    leaveMeetingRecords.forEach((r, idx) => {
      aoa.push([
        idx + 1,
        r.mandal,
        r.gp,
        r.reportingDate || reportDate,
        r.rawAttStatus ||
          (r.isLeave
            ? "On Leave"
            : r.isMeeting
              ? "Meeting at Mandal Level"
              : r.isTraining
                ? "Training at State Level"
                : "Meeting/Leave"),
        r.attTime && r.attTime !== "-" ? r.attTime : "-",
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leave and Meetings");
    XLSX.writeFile(wb, `Attendance_Meeting_Training_Leave_${reportDate.replace(/\./g, "-")}.xlsx`);
    addToast("Meeting / Training / On Leave ఎక్సెల్ ఫైల్ డౌన్లోడ్ అవుతోంది...");
  };

  // Copy helper for Not Reported (Image 3)
  const copyNotReportedTable = () => {
    if (notReportedMandals.length === 0) return;
    const headers = ["S.NO", "Mandal Name", "Balance_GPs", "Attendance_not_reported_gps"];
    const lines: string[] = [];
    lines.push(`Attendance Not Reported as of ${fullTimestamp}`);
    lines.push(headers.join("\t"));
    notReportedMandals.forEach((m, idx) => {
      lines.push([idx + 1, m.mandal, m.balanceGps, m.gpsList].join("\t"));
    });
    navigator.clipboard.writeText(lines.join("\n"));
    addToast("Attendance Not Reported టేబుల్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!");
  };

  // Copy helper for DSR Not Completed (Image 3)
  const copyDsrPendingTable = () => {
    if (dsrNotCompletedMandals.length === 0) return;
    const headers = ["S.NO", "Mandal Name", "Balance_GPs", "DSR__Not_Completed_GPs"];
    const lines: string[] = [];
    lines.push(`DSR NOT COMPLETED GRAM PANCHAYATS AS OF: ${fullTimestamp}`);
    lines.push(headers.join("\t"));
    dsrNotCompletedMandals.forEach((m, idx) => {
      lines.push([idx + 1, m.mandal, m.balanceGps, m.gpsList].join("\t"));
    });
    navigator.clipboard.writeText(lines.join("\n"));
    addToast("DSR Not Completed టేబుల్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!");
  };

  // Download Excel for Image 3
  const downloadPendingGpsExcel = async () => {
    await loadHeavyModules();
    const wb = XLSX.utils.book_new();

    const aoa1: any[][] = [];
    aoa1.push([`Attendance Not Reported as of ${fullTimestamp}`]);
    aoa1.push([]);
    aoa1.push(["S.NO", "Mandal Name", "Balance_GPs", "Attendance_not_reported_gps"]);
    notReportedMandals.forEach((m, idx) => {
      aoa1.push([idx + 1, m.mandal, m.balanceGps, m.gpsList]);
    });
    const ws1 = XLSX.utils.aoa_to_sheet(aoa1);
    XLSX.utils.book_append_sheet(wb, ws1, "Attendance Not Reported");

    const aoa2: any[][] = [];
    aoa2.push([`DSR NOT COMPLETED GRAM PANCHAYATS AS OF: ${fullTimestamp}`]);
    aoa2.push([]);
    aoa2.push(["S.NO", "Mandal Name", "Balance_GPs", "DSR__Not_Completed_GPs"]);
    dsrNotCompletedMandals.forEach((m, idx) => {
      aoa2.push([idx + 1, m.mandal, m.balanceGps, m.gpsList]);
    });
    const ws2 = XLSX.utils.aoa_to_sheet(aoa2);
    XLSX.utils.book_append_sheet(wb, ws2, "DSR Not Completed");

    XLSX.writeFile(wb, `Not_Reported_and_DSR_Pending_GPs_${reportDate.replace(/\./g, "-")}.xlsx`);
    addToast("Not Reported & DSR Pending GPs ఎక్సెల్ ఫైల్ డౌన్లోడ్ అవుతోంది...");
  };

  // Master Excel with ALL 4 official reports in separate sheets in 1 Workbook
  const downloadAllReportsMasterExcel = async () => {
    await loadHeavyModules();
    const wb = XLSX.utils.book_new();

    // Sheet 1: PS Attendance & DSR Status
    const aoa1: any[][] = [];
    aoa1.push([`Status of PS Attendance and Reporting DSR as of ${fullTimestamp}`]);
    aoa1.push([]);
    aoa1.push([
      "S.NO",
      "Mandal Name",
      "Total No. of GPs",
      "No. of PS Attended the GP",
      "No. of PS reported Meeting/Training and Leave",
      "% of PS reported",
      "Not Reported PS",
      "No. of PS Entered DSR",
      "% of PS DSR Entered",
      "No. of PS submitted before 9 AM",
      "% PS Submitted before 9 AM",
      "after_9_am",
      "% ps reported after 9 am",
    ]);

    mandalSummaries.forEach((m, idx) => {
      const after9Count = m.c9_11 + m.after11AM;
      const pctRep = m.totalGPs > 0 ? (m.totalReported / m.totalGPs) * 100 : 0;
      const pctDsr = m.totalGPs > 0 ? (m.dsrEntered / m.totalGPs) * 100 : 0;
      const pctBef9 = m.totalGPs > 0 ? (m.before9AM / m.totalGPs) * 100 : 0;
      const pctAft9 = m.totalGPs > 0 ? (after9Count / m.totalGPs) * 100 : 0;
      aoa1.push([
        idx + 1,
        m.mandal,
        m.totalGPs,
        m.attendedGP,
        m.meetingTraining + m.leaveToday,
        `${pctRep.toFixed(1)}%`,
        m.notReported,
        m.dsrEntered,
        `${pctDsr.toFixed(1)}%`,
        m.before9AM,
        `${pctBef9.toFixed(2)}%`,
        after9Count,
        `${pctAft9.toFixed(2)}%`,
      ]);
    });

    const totAfter9 = grandTotal.c9_11 + grandTotal.after11AM;
    const totPctRep = grandTotal.totalGPs > 0 ? (grandTotal.totalReported / grandTotal.totalGPs) * 100 : 0;
    const totPctDsr = grandTotal.totalGPs > 0 ? (grandTotal.dsrEntered / grandTotal.totalGPs) * 100 : 0;
    const totPctBef9 = grandTotal.totalGPs > 0 ? (grandTotal.before9AM / grandTotal.totalGPs) * 100 : 0;
    const totPctAft9 = grandTotal.totalGPs > 0 ? (totAfter9 / grandTotal.totalGPs) * 100 : 0;

    aoa1.push([
      mandalSummaries.length + 1,
      "Total",
      grandTotal.totalGPs,
      grandTotal.attendedGP,
      grandTotal.meetingTraining + grandTotal.leaveToday,
      `${totPctRep.toFixed(2)}%`,
      grandTotal.notReported,
      grandTotal.dsrEntered,
      `${totPctDsr.toFixed(2)}%`,
      grandTotal.before9AM,
      `${totPctBef9.toFixed(2)}%`,
      totAfter9,
      `${totPctAft9.toFixed(2)}%`,
    ]);
    const ws1 = XLSX.utils.aoa_to_sheet(aoa1);
    XLSX.utils.book_append_sheet(wb, ws1, "PS Attendance & DSR");

    // Sheet 2: Meeting / Training / On Leave
    const aoa2: any[][] = [];
    aoa2.push([`ATTENDANCE REPORTED AS MEETING/TRAINING/ONLEAVE: ${fullTimestamp}`]);
    aoa2.push([]);
    aoa2.push([
      "S.NO",
      "Mandal Name",
      "Panchayat Name",
      "Reporting Date",
      "Attendance Status",
      "Attendance Time",
    ]);
    leaveMeetingRecords.forEach((r, idx) => {
      aoa2.push([
        idx + 1,
        r.mandal,
        r.gp,
        r.reportingDate || reportDate,
        r.rawAttStatus ||
          (r.isLeave
            ? "On Leave"
            : r.isMeeting
              ? "Meeting at Mandal Level"
              : r.isTraining
                ? "Training at State Level"
                : "Meeting/Leave"),
        r.attTime && r.attTime !== "-" ? r.attTime : "-",
      ]);
    });
    const ws2 = XLSX.utils.aoa_to_sheet(aoa2);
    XLSX.utils.book_append_sheet(wb, ws2, "Leave and Meetings");

    // Sheet 3: Attendance Not Reported
    const aoa3: any[][] = [];
    aoa3.push([`Attendance Not Reported as of ${fullTimestamp}`]);
    aoa3.push([]);
    aoa3.push(["S.NO", "Mandal Name", "Balance_GPs", "Attendance_not_reported_gps"]);
    notReportedMandals.forEach((m, idx) => {
      aoa3.push([idx + 1, m.mandal, m.balanceGps, m.gpsList]);
    });
    const ws3 = XLSX.utils.aoa_to_sheet(aoa3);
    XLSX.utils.book_append_sheet(wb, ws3, "Attendance Not Reported");

    // Sheet 4: DSR Not Completed
    const aoa4: any[][] = [];
    aoa4.push([`DSR NOT COMPLETED GRAM PANCHAYATS AS OF: ${fullTimestamp}`]);
    aoa4.push([]);
    aoa4.push(["S.NO", "Mandal Name", "Balance_GPs", "DSR__Not_Completed_GPs"]);
    dsrNotCompletedMandals.forEach((m, idx) => {
      aoa4.push([idx + 1, m.mandal, m.balanceGps, m.gpsList]);
    });
    const ws4 = XLSX.utils.aoa_to_sheet(aoa4);
    XLSX.utils.book_append_sheet(wb, ws4, "DSR Not Completed");

    // Sheet 5: Complete 20-Col Raw Data
    const aoa5: any[][] = [];
    aoa5.push([`All Grama Panchayats Master Attendance & DSR Data (${data.length} GPs) as of ${fullTimestamp}`]);
    aoa5.push([]);
    aoa5.push([
      "S.NO", "Mandal", "Grama Panchayat", "PS Name", "Designation", "Contact No",
      "Total GPs", "Attended GP", "Meeting/Training", "Leave Today", "Not Reported",
      "Reporting Date", "Attendance Time", "Before 9 AM", "9-11 AM", "After 11 AM",
      "DSR Total", "DSR Attended", "DSR Not Entered", "DSR Time", "Remarks / Status"
    ]);
    data.forEach((r, idx) => {
      aoa5.push([
        idx + 1,
        r.mandal,
        r.gp,
        r.psName || "-",
        r.designation || "-",
        r.contactNo || "-",
        r.totalGPs || 1,
        r.attendedGP || 0,
        r.meetingTraining || 0,
        r.leaveToday || 0,
        r.notReported || 0,
        r.reportingDate || reportDate,
        r.attTime || "-",
        r.before9AM || 0,
        r.c9_11 || 0,
        r.after11AM || 0,
        r.dsrTotal || 0,
        r.dsrEntered || 0,
        r.dsrNotEntered || 0,
        r.dsrTime || "-",
        r.rawAttStatus || (r.isLeave ? "On Leave" : r.isMeeting ? "Meeting" : r.isTraining ? "Training" : r.isAttended ? "Attended" : "Not Reported")
      ]);
    });
    const ws5 = XLSX.utils.aoa_to_sheet(aoa5);
    XLSX.utils.book_append_sheet(wb, ws5, "All 20-Col GPs Master Data");

    // Save Master Workbook with 5 sheets
    XLSX.writeFile(wb, `Mana_Panchayati_Master_Reports_${reportDate.replace(/\./g, "-")}.xlsx`);
    addToast("అన్ని 4 రిపోర్ట్‌లు + మాస్టర్ డేటాతో కూడిన Complete Multi-Sheet Excel ఫైల్ విజయవంతంగా డౌన్లోడ్ చేయబడింది!");
  };

  const handlePrint = (mode: "current" | "all") => {
    if (mode === "all" && activeReportTab !== "all_combined") {
      setActiveReportTab("all_combined");
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  // Render Image 2 Table: Status of PS Attendance and Reporting DSR
  const renderStatusSummaryTable = () => {
    const totAfter9 = grandTotal.c9_11 + grandTotal.after11AM;
    const totPctRep = grandTotal.totalGPs > 0 ? (grandTotal.totalReported / grandTotal.totalGPs) * 100 : 0;
    const totPctDsr = grandTotal.totalGPs > 0 ? (grandTotal.dsrEntered / grandTotal.totalGPs) * 100 : 0;
    const totPctBef9 = grandTotal.totalGPs > 0 ? (grandTotal.before9AM / grandTotal.totalGPs) * 100 : 0;
    const totPctAft9 = grandTotal.totalGPs > 0 ? (totAfter9 / grandTotal.totalGPs) * 100 : 0;

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden space-y-3 p-4 sm:p-6">
        {/* Table Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#00609C] rounded-sm"></div>
            <h3 className="text-base sm:text-lg font-bold text-[#00609C] tracking-tight">
              Status of PS Attendance and Reporting DSR as of
            </h3>
            <span className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded text-xs font-semibold border border-[#FDE68A]">
              {fullTimestamp}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyStatusSummaryTable}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-all active:scale-95"
              title="Copy table to clipboard"
            >
              <Copy size={13} /> Copy Table
            </button>
            <button
              onClick={downloadStatusSummaryExcel}
              className="bg-[#00609C] hover:bg-[#004e80] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              title="Download Excel"
            >
              <Download size={13} /> Excel
            </button>
          </div>
        </div>

        {/* Crisp Data Table */}
        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-[#00609C] text-white font-bold text-[11px] divide-x divide-[#004e80] border-b border-[#004e80]">
                <th className="py-2.5 px-2 whitespace-nowrap">S.NO</th>
                <th className="py-2.5 px-3 text-left whitespace-nowrap min-w-[130px]">Mandal Name</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Total No. of GPs</th>
                <th className="py-2.5 px-2 whitespace-nowrap">No. of PS Attended the GP</th>
                <th className="py-2.5 px-2 whitespace-nowrap min-w-[130px]">No. of PS reported Meeting/Training and Leave</th>
                <th className="py-2.5 px-2 whitespace-nowrap">% of PS reported</th>
                <th className="py-2.5 px-2 whitespace-nowrap">Not Reported PS</th>
                <th className="py-2.5 px-2 whitespace-nowrap">No. of PS Entered DSR</th>
                <th className="py-2.5 px-2 whitespace-nowrap">% of PS DSR Entered</th>
                <th className="py-2.5 px-2 whitespace-nowrap">No. of PS submitted before 9 AM</th>
                <th className="py-2.5 px-2 whitespace-nowrap">% PS Submitted before 9 AM</th>
                <th className="py-2.5 px-2 whitespace-nowrap">after_9_am</th>
                <th className="py-2.5 px-2 whitespace-nowrap">% ps reported after 9 am</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {mandalSummaries.map((m, idx) => {
                const after9Count = m.c9_11 + m.after11AM;
                const pctRep = m.totalGPs > 0 ? (m.totalReported / m.totalGPs) * 100 : 0;
                const pctDsr = m.totalGPs > 0 ? (m.dsrEntered / m.totalGPs) * 100 : 0;
                const pctBef9 = m.totalGPs > 0 ? (m.before9AM / m.totalGPs) * 100 : 0;
                const pctAft9 = m.totalGPs > 0 ? (after9Count / m.totalGPs) * 100 : 0;

                const repColor = pctRep >= 100 ? "bg-[#d1fae5] text-emerald-950 font-semibold" : pctRep >= 95 ? "bg-[#e0f2fe] text-blue-950 font-semibold" : "bg-[#fee2e2] text-rose-950 font-semibold";
                const dsrColor = pctDsr >= 100 ? "bg-[#d1fae5] text-emerald-950 font-semibold" : pctDsr >= 95 ? "bg-[#e0f2fe] text-blue-950 font-semibold" : "bg-[#fee2e2] text-rose-950 font-semibold";
                const bef9Color = pctBef9 >= 70 ? "bg-[#fef3c7] text-amber-950 font-semibold" : "bg-[#fee2e2] text-rose-950 font-semibold";
                const aft9Color = "bg-[#fee2e2] text-rose-950 font-semibold";

                const isEx = !!expandedMandals[m.mandal];

                return (
                  <React.Fragment key={`status_summary_${m.mandal}_${idx}`}>
                    <tr className="hover:bg-slate-50 transition-colors divide-x divide-slate-200">
                      <td className="py-2 px-2 font-mono text-slate-500">{idx + 1}</td>
                      <td 
                        className="py-2 px-3 text-left font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer flex items-center justify-between gap-1"
                        onClick={() => toggleMandalExpand(m.mandal)}
                        title="Click to expand/collapse GPs below"
                      >
                        <span className="underline decoration-indigo-300 decoration-dotted underline-offset-4">{m.mandal}</span>
                        <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded font-mono font-bold shrink-0">
                          {isEx ? "▲" : `▼ ${m.totalGPs} GPs`}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-bold">{m.totalGPs}</td>
                      <td className="py-2 px-2 font-mono">{m.attendedGP}</td>
                      <td className="py-2 px-2 font-mono">{m.meetingTraining + m.leaveToday}</td>
                      <td className={`py-2 px-2 font-mono ${repColor}`}>
                        {pctRep.toFixed(m.totalReported === m.totalGPs ? 1 : 2)}%
                      </td>
                      <td className="py-2 px-2 font-mono font-bold text-slate-700">{m.notReported}</td>
                      <td className="py-2 px-2 font-mono">{m.dsrEntered}</td>
                      <td className={`py-2 px-2 font-mono ${dsrColor}`}>
                        {pctDsr.toFixed(m.dsrEntered === m.totalGPs ? 1 : 2)}%
                      </td>
                      <td className="py-2 px-2 font-mono">{m.before9AM}</td>
                      <td className={`py-2 px-2 font-mono ${bef9Color}`}>{pctBef9.toFixed(2)}%</td>
                      <td className="py-2 px-2 font-mono">{after9Count}</td>
                      <td className={`py-2 px-2 font-mono ${aft9Color}`}>{pctAft9.toFixed(2)}%</td>
                    </tr>
                    {isEx && (
                      <tr className="bg-sky-50/70 border-b-2 border-indigo-200">
                        <td colSpan={13} className="p-3">
                          <div className="bg-white rounded-xl p-3 shadow-inner border border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                                <span>📍 {m.mandal} Mandal Gram Panchayats Details</span>
                                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono">
                                  Total GPs: {m.gps.length}
                                </span>
                              </h4>
                              <button
                                onClick={() => toggleMandalExpand(m.mandal)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded"
                              >
                                ▲ Hide GPs
                              </button>
                            </div>
                            <div className="overflow-x-auto max-h-[280px] custom-scrollbar border border-slate-200 rounded-lg">
                              <table className="w-full text-center text-xs border-collapse">
                                <thead>
                                  <tr className="bg-slate-800 text-white font-bold text-[10px] divide-x divide-slate-700">
                                    <th className="py-2 px-2">S.NO</th>
                                    <th className="py-2 px-3 text-left">Grama Panchayat Name</th>
                                    <th className="py-2 px-2">PS Name</th>
                                    <th className="py-2 px-2">Attendance Status</th>
                                    <th className="py-2 px-2">Attendance Time</th>
                                    <th className="py-2 px-2">DSR Status</th>
                                    <th className="py-2 px-2">DSR Time</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 font-medium text-slate-800 bg-white">
                                  {m.gps.map((gp: any, gIdx: number) => (
                                    <tr key={`inline_gp_${m.mandal}_${gIdx}`} className="hover:bg-slate-50 transition-colors divide-x divide-slate-100">
                                      <td className="py-1.5 px-2 font-mono text-slate-500">{gIdx + 1}</td>
                                      <td className="py-1.5 px-3 text-left font-bold text-slate-900">{gp.gp}</td>
                                      <td className="py-1.5 px-2 font-mono text-slate-700">{gp.psName || "-"}</td>
                                      <td className="py-1.5 px-2 font-semibold text-indigo-900">{gp.attStatus || "-"}</td>
                                      <td className="py-1.5 px-2 font-mono text-slate-700">{gp.attTime || "-"}</td>
                                      <td className="py-1.5 px-2 font-semibold text-purple-700">{gp.dsrStatus || (gp.dsrEntered ? "Yes" : "No")}</td>
                                      <td className="py-1.5 px-2 font-mono text-slate-700">{gp.dsrTime || "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            {/* Total Row */}
            <tfoot>
              <tr className="bg-[#f8fafc] text-slate-900 font-bold text-xs divide-x divide-slate-200 border-t-2 border-slate-300">
                <td className="py-2.5 px-2 font-mono">{mandalSummaries.length + 1}</td>
                <td className="py-2.5 px-3 text-left font-black text-slate-900">Total</td>
                <td className="py-2.5 px-2 font-black">{grandTotal.totalGPs}</td>
                <td className="py-2.5 px-2 font-mono">{grandTotal.attendedGP}</td>
                <td className="py-2.5 px-2 font-mono">{grandTotal.meetingTraining + grandTotal.leaveToday}</td>
                <td className="py-2.5 px-2 font-mono font-bold bg-[#d1fae5] text-emerald-950">
                  {totPctRep.toFixed(2)}%
                </td>
                <td className="py-2.5 px-2 font-mono font-black">{grandTotal.notReported}</td>
                <td className="py-2.5 px-2 font-mono">{grandTotal.dsrEntered}</td>
                <td className="py-2.5 px-2 font-mono font-bold bg-[#d1fae5] text-emerald-950">
                  {totPctDsr.toFixed(2)}%
                </td>
                <td className="py-2.5 px-2 font-mono">{grandTotal.before9AM}</td>
                <td className="py-2.5 px-2 font-mono font-bold bg-[#fef3c7] text-amber-950">
                  {totPctBef9.toFixed(2)}%
                </td>
                <td className="py-2.5 px-2 font-mono">{totAfter9}</td>
                <td className="py-2.5 px-2 font-mono font-bold bg-[#fee2e2] text-rose-950">
                  {totPctAft9.toFixed(2)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // Render Image 1 Table: ATTENDANCE REPORTED AS MEETING/TRAINING/ONLEAVE
  const renderLeaveMeetingTable = () => {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden space-y-3 p-4 sm:p-6">
        {/* Table Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-[#00609C] rounded-sm"></div>
            <h3 className="text-base sm:text-lg font-bold text-[#00609C] tracking-tight">
              ATTENDANCE REPORTED AS MEETING/TRAINING/ONLEAVE:
            </h3>
            <span className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded text-xs font-semibold border border-[#FDE68A]">
              {fullTimestamp}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyLeaveMeetingsTable}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-all active:scale-95"
              title="Copy table to clipboard"
            >
              <Copy size={13} /> Copy Table
            </button>
            <button
              onClick={downloadLeaveMeetingsExcel}
              className="bg-[#00609C] hover:bg-[#004e80] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              title="Download Excel"
            >
              <Download size={13} /> Excel
            </button>
          </div>
        </div>

        {/* Crisp Data Table */}
        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-[#00609C] text-white font-bold text-[11px] divide-x divide-[#004e80] border-b border-[#004e80]">
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[50px]">S.NO</th>
                <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[150px]">Mandal Name</th>
                <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[160px]">Panchayat Name</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[110px]">Reporting Date</th>
                <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[180px]">Attendance Status</th>
                <th className="py-2.5 px-3 whitespace-nowrap min-w-[110px]">Attendance Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {leaveMeetingRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold italic">
                    ఈ తేదీన Leave, Meeting లేదా Training నమోదు చేసిన పంచాయతీ సెక్రటరీలు ఎవరూ లేరు.
                  </td>
                </tr>
              ) : (
                leaveMeetingRecords.map((r, idx) => (
                  <tr key={`leave_meeting_${r.gp}_${idx}`} className="hover:bg-slate-50 transition-colors divide-x divide-slate-200">
                    <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-2 px-4 text-left font-bold text-slate-900">{r.mandal}</td>
                    <td className="py-2 px-4 text-left font-semibold text-slate-800">{r.gp}</td>
                    <td className="py-2 px-3 font-mono text-slate-600">{r.reportingDate || reportDate}</td>
                    <td className="py-2 px-4 text-left font-semibold text-indigo-900">
                      {r.rawAttStatus ||
                        (r.isLeave
                          ? "On Leave"
                          : r.isMeeting
                            ? "Meeting at Mandal Level"
                            : r.isTraining
                              ? "Training at State Level"
                              : "Meeting/Leave")}
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-700">{r.attTime && r.attTime !== "-" ? r.attTime : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render Image 3 Tables: Attendance Not Reported & DSR Not Completed
  const renderPendingTables = () => {
    return (
      <div className="space-y-6">
        {/* Table 3A: Attendance Not Reported */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden space-y-3 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-[#00609C] rounded-sm"></div>
              <h3 className="text-base sm:text-lg font-bold text-[#00609C] tracking-tight">
                Attendance Not Reported as of
              </h3>
              <span className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded text-xs font-semibold border border-[#FDE68A]">
                {fullTimestamp}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyNotReportedTable}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-all active:scale-95"
                title="Copy table to clipboard"
              >
                <Copy size={13} /> Copy Table
              </button>
              <button
                onClick={downloadPendingGpsExcel}
                className="bg-[#00609C] hover:bg-[#004e80] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                title="Download Excel"
              >
                <Download size={13} /> Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-[#00609C] text-white font-bold text-[11px] divide-x divide-[#004e80] border-b border-[#004e80]">
                  <th className="py-2.5 px-3 whitespace-nowrap min-w-[50px]">S.NO</th>
                  <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[150px]">Mandal Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap min-w-[90px]">Balance_GPs</th>
                  <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[300px]">Attendance_not_reported_gps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {notReportedMandals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-emerald-600 font-semibold">
                      🎉 అభినందనలు! అన్ని మండలాల గ్రామ పంచాయతీల్లో హాజరు 100% పూర్తయింది.
                    </td>
                  </tr>
                ) : (
                  notReportedMandals.map((m, idx) => (
                    <tr key={`not_rep_${m.mandal}_${idx}`} className="hover:bg-slate-50 transition-colors divide-x divide-slate-200">
                      <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td 
                        className="py-2 px-4 text-left font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer underline decoration-indigo-300 decoration-dotted underline-offset-4"
                        onClick={() => onSelectMandal && onSelectMandal(m.mandal)}
                        title="Click to view all Gram Panchayats in this Mandal"
                      >
                        {m.mandal}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-rose-600">{m.balanceGps}</td>
                      <td className="py-2 px-4 text-left font-mono text-slate-700 leading-relaxed">{m.gpsList}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3B: DSR NOT COMPLETED GRAM PANCHAYATS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden space-y-3 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-[#00609C] rounded-sm"></div>
              <h3 className="text-base sm:text-lg font-bold text-[#00609C] tracking-tight">
                DSR NOT COMPLETED GRAM PANCHAYATS AS OF:
              </h3>
              <span className="bg-[#FEF3C7] text-[#92400E] px-2.5 py-0.5 rounded text-xs font-semibold border border-[#FDE68A]">
                {fullTimestamp}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyDsrPendingTable}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-300 transition-all active:scale-95"
                title="Copy table to clipboard"
              >
                <Copy size={13} /> Copy Table
              </button>
              <button
                onClick={downloadPendingGpsExcel}
                className="bg-[#00609C] hover:bg-[#004e80] text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                title="Download Excel"
              >
                <Download size={13} /> Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-xl">
            <table className="w-full text-center text-xs border-collapse">
              <thead>
                <tr className="bg-[#00609C] text-white font-bold text-[11px] divide-x divide-[#004e80] border-b border-[#004e80]">
                  <th className="py-2.5 px-3 whitespace-nowrap min-w-[50px]">S.NO</th>
                  <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[150px]">Mandal Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap min-w-[90px]">Balance_GPs</th>
                  <th className="py-2.5 px-4 text-left whitespace-nowrap min-w-[300px]">DSR__Not_Completed_GPs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {dsrNotCompletedMandals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-emerald-600 font-semibold">
                      🎉 అభినందనలు! అన్ని మండలాల గ్రామ పంచాయతీల్లో DSR ఎంట్రీ 100% పూర్తయింది.
                    </td>
                  </tr>
                ) : (
                  dsrNotCompletedMandals.map((m, idx) => (
                    <tr key={`dsr_pend_${m.mandal}_${idx}`} className="hover:bg-slate-50 transition-colors divide-x divide-slate-200">
                      <td className="py-2 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td 
                        className="py-2 px-4 text-left font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer underline decoration-indigo-300 decoration-dotted underline-offset-4"
                        onClick={() => onSelectMandal && onSelectMandal(m.mandal)}
                        title="Click to view all Gram Panchayats in this Mandal"
                      >
                        {m.mandal}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-purple-700">{m.balanceGps}</td>
                      <td className="py-2 px-4 text-left font-mono text-slate-700 leading-relaxed">{m.gpsList}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Master Action Banner */}
      <div className="no-print bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-200">
              అన్ని అధికారిక రిపోర్ట్‌ల ఎక్స్‌పోర్ట్ సెంటర్ (Master Multi-Sheet & PDF Export)
            </h4>
            <p className="text-xs text-slate-300">
              ఒకే Excel ఫైల్‌లో 5 షీట్‌లుగా (Sheet 1, Sheet 2, Sheet 3, Sheet 4, Sheet 5) డౌన్‌లోడ్ చేయండి లేదా PDF రూపంలో ప్రింట్ తీయండి.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadAllReportsMasterExcel}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 border border-emerald-400/40"
            title="Download all reports into 1 Excel file with multiple sheets"
          >
            <Download size={15} />
            Master Multi-Sheet Excel (అన్ని షీట్లు ఒకే ఫైల్)
          </button>

          <button
            onClick={() => handlePrint("all")}
            className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 border border-sky-400/40"
            title="Print / Save as PDF all official reports"
          >
            <Printer size={15} />
            ప్రింట్ / Save as PDF (All Reports)
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="no-print bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveReportTab("status_summary")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReportTab === "status_summary"
                ? "bg-[#00609C] text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <BarChart3 size={14} />
            PS Attendance & DSR Status
          </button>

          <button
            onClick={() => setActiveReportTab("leave_meetings")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReportTab === "leave_meetings"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <Calendar size={14} />
            Meeting / Training / On Leave
          </button>

          <button
            onClick={() => setActiveReportTab("pending_gps")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReportTab === "pending_gps"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <AlertTriangle size={14} />
            Attendance & DSR Not Reported
          </button>

          <button
            onClick={() => setActiveReportTab("all_combined")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeReportTab === "all_combined"
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            <LayoutGrid size={14} />
            అన్ని అధికారిక రిపోర్టులు (Combined View)
          </button>
        </div>

        <button
          onClick={() => handlePrint("current")}
          className="text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          title="Print or Save current report view to PDF"
        >
          <Printer size={13} /> ఈ రిపోర్ట్ ప్రింట్ / PDF
        </button>
      </div>

      {/* Render Selected View */}
      {activeReportTab === "status_summary" && renderStatusSummaryTable()}
      {activeReportTab === "leave_meetings" && renderLeaveMeetingTable()}
      {activeReportTab === "pending_gps" && renderPendingTables()}
      {activeReportTab === "all_combined" && (
        <div className="space-y-6">
          {renderStatusSummaryTable()}
          <div className="print-page-break"></div>
          {renderLeaveMeetingTable()}
          <div className="print-page-break"></div>
          {renderPendingTables()}
        </div>
      )}
    </div>
  );
};
