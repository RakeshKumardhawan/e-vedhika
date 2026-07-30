import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface DatabaseSnapshot {
  timestamp: string;
  users: {
    total: number;
    rolesCount: Record<string, number>;
    recentList: any[];
  };
  problems: {
    total: number;
    pendingCount: number;
    inProgressCount: number;
    resolvedCount: number;
    recentList: any[];
  };
  requests: {
    total: number;
    pendingCount: number;
    resolvedCount: number;
    recentList: any[];
  };
  suggestions: {
    total: number;
    recentList: any[];
  };
  securityLogs: {
    total: number;
    recentList: any[];
  };
  forms: {
    total: number;
    recentList: any[];
  };
  posts: {
    total: number;
    recentList: any[];
  };
}

/**
 * Fetches real live database records from Firestore for analysis and reporting
 */
export async function fetchLiveDatabaseSnapshot(): Promise<DatabaseSnapshot> {
  const snapshot: DatabaseSnapshot = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    users: { total: 0, rolesCount: {}, recentList: [] },
    problems: { total: 0, pendingCount: 0, inProgressCount: 0, resolvedCount: 0, recentList: [] },
    requests: { total: 0, pendingCount: 0, resolvedCount: 0, recentList: [] },
    suggestions: { total: 0, recentList: [] },
    securityLogs: { total: 0, recentList: [] },
    forms: { total: 0, recentList: [] },
    posts: { total: 0, recentList: [] }
  };

  try {
    // 1. Users
    const usersSnap = await getDocs(collection(db, 'users'));
    snapshot.users.total = usersSnap.size;
    usersSnap.docs.forEach(d => {
      const u = d.data();
      const role = u.role || u.designation || 'General User';
      snapshot.users.rolesCount[role] = (snapshot.users.rolesCount[role] || 0) + 1;
    });
    snapshot.users.recentList = usersSnap.docs.slice(0, 25).map(d => ({
      id: d.id,
      name: d.data().name || d.data().displayName || 'N/A',
      email: d.data().email || 'N/A',
      phone: d.data().phone || d.data().phoneNumber || 'N/A',
      role: d.data().role || 'User',
      designation: d.data().designation || 'N/A',
      district: d.data().district || 'N/A',
      mandal: d.data().mandal || 'N/A',
      panchayat: d.data().panchayat || d.data().gpName || 'N/A'
    }));
  } catch (e) {
    console.warn('Error reading users collection:', e);
  }

  try {
    // 2. Problems / Reports
    const probsSnap = await getDocs(collection(db, 'problems'));
    snapshot.problems.total = probsSnap.size;
    probsSnap.docs.forEach(d => {
      const p = d.data();
      const status = (p.status || 'pending').toLowerCase();
      if (status.includes('in_progress') || status.includes('progress')) {
        snapshot.problems.inProgressCount++;
      } else if (status.includes('resolve') || status.includes('close') || status.includes('complete')) {
        snapshot.problems.resolvedCount++;
      } else {
        snapshot.problems.pendingCount++;
      }
    });
    snapshot.problems.recentList = probsSnap.docs.slice(0, 25).map(d => ({
      id: d.id,
      title: d.data().title || d.data().subject || 'Untitled Issue',
      status: d.data().status || 'Pending',
      category: d.data().category || 'General',
      priority: d.data().priority || 'Normal',
      location: d.data().location || d.data().district || 'N/A',
      time: d.data().createdAt ? new Date(d.data().createdAt).toLocaleDateString() : 'N/A',
      author: d.data().userName || d.data().author || 'Anonymous',
      description: d.data().description || d.data().details || ''
    }));
  } catch (e) {
    console.warn('Error reading problems collection:', e);
  }

  try {
    // 3. Service Requests
    const reqsSnap = await getDocs(collection(db, 'requests'));
    snapshot.requests.total = reqsSnap.size;
    reqsSnap.docs.forEach(d => {
      const r = d.data();
      const status = (r.status || 'pending').toLowerCase();
      if (status.includes('resolve') || status.includes('approve') || status.includes('done')) {
        snapshot.requests.resolvedCount++;
      } else {
        snapshot.requests.pendingCount++;
      }
    });
    snapshot.requests.recentList = reqsSnap.docs.slice(0, 20).map(d => ({
      id: d.id,
      title: d.data().title || d.data().type || 'Service Request',
      status: d.data().status || 'Pending',
      userName: d.data().userName || 'User',
      time: d.data().createdAt ? new Date(d.data().createdAt).toLocaleDateString() : 'N/A'
    }));
  } catch (e) {
    console.warn('Error reading requests collection:', e);
  }

  try {
    // 4. Suggestions
    const suggsSnap = await getDocs(collection(db, 'suggestions'));
    snapshot.suggestions.total = suggsSnap.size;
    snapshot.suggestions.recentList = suggsSnap.docs.slice(0, 25).map(d => ({
      id: d.id,
      text: d.data().text || d.data().suggestion || d.data().title || '',
      category: d.data().category || 'General',
      author: d.data().author || d.data().userName || 'Anonymous',
      upvotes: d.data().upvotes || d.data().likes || 0,
      status: d.data().status || 'Under Review',
      time: d.data().createdAt ? new Date(d.data().createdAt).toLocaleDateString() : 'N/A'
    }));
  } catch (e) {
    console.warn('Error reading suggestions collection:', e);
  }

  try {
    // 5. Security Logs
    const qLogs = query(collection(db, 'security_logs'), orderBy('time', 'desc'), limit(25));
    const logsSnap = await getDocs(qLogs);
    snapshot.securityLogs.total = logsSnap.size;
    snapshot.securityLogs.recentList = logsSnap.docs.map(d => ({
      id: d.id,
      action: d.data().action || d.data().type || 'System Event',
      user: d.data().user || d.data().email || 'System',
      severity: d.data().severity || 'Info',
      details: d.data().details || d.data().msg || '',
      ip: d.data().ip || 'N/A',
      time: d.data().time ? new Date(d.data().time).toLocaleString() : 'N/A'
    }));
  } catch (e) {
    console.warn('Error reading security_logs collection:', e);
  }

  try {
    // 6. Forms / DSR Entries
    const formsSnap = await getDocs(collection(db, 'forms'));
    snapshot.forms.total = formsSnap.size;
    snapshot.forms.recentList = formsSnap.docs.slice(0, 20).map(d => ({
      id: d.id,
      title: d.data().title || d.data().formType || 'DSR / Form Entry',
      submittedBy: d.data().submittedBy || d.data().userName || 'Officer',
      time: d.data().time ? new Date(d.data().time).toLocaleDateString() : 'N/A'
    }));
  } catch (e) {
    console.warn('Error reading forms collection:', e);
  }

  try {
    // 7. Posts
    const postsSnap = await getDocs(collection(db, 'posts'));
    snapshot.posts.total = postsSnap.size;
    snapshot.posts.recentList = postsSnap.docs.slice(0, 15).map(d => ({
      id: d.id,
      title: d.data().title || d.data().content?.substring(0, 50) || 'Post',
      author: d.data().author || 'User',
      likes: d.data().likes || 0
    }));
  } catch (e) {
    console.warn('Error reading posts collection:', e);
  }

  return snapshot;
}

/**
 * Builds formatted markdown string representing live database state for Gemini system instruction
 */
export function buildDatabaseContextPrompt(snapshot: DatabaseSnapshot): string {
  const rolesSummary = Object.entries(snapshot.users.rolesCount)
    .map(([r, c]) => `- ${r}: ${c}`)
    .join('\n');

  const recentReports = snapshot.problems.recentList.slice(0, 5)
    .map(p => `  * [${p.status.toUpperCase()}] ${p.title} (${p.category}, Location: ${p.location}, By: ${p.author})`)
    .join('\n');

  const recentSuggestions = snapshot.suggestions.recentList.slice(0, 5)
    .map(s => `  * "${s.text}" (${s.category}, Upvotes: ${s.upvotes}, By: ${s.author})`)
    .join('\n');

  const recentLogs = snapshot.securityLogs.recentList.slice(0, 5)
    .map(l => `  * [${l.severity}] ${l.action} by ${l.user} (${l.time})`)
    .join('\n');

  return `
=== LIVE WEBSITE DATABASE REAL-TIME SNAPSHOT (${snapshot.timestamp}) ===
1. USERS METRICS:
- Total Registered Users: ${snapshot.users.total}
- Breakdown by Designation/Role:
${rolesSummary || '- Standard Users'}

2. REPORTS & COMPLAINTS (PROBLEMS/REQUESTS):
- Total Citizen/Officer Reports: ${snapshot.problems.total}
- Pending Reports: ${snapshot.problems.pendingCount}
- In-Progress Reports: ${snapshot.problems.inProgressCount}
- Resolved Reports: ${snapshot.problems.resolvedCount}
- Total Service Requests: ${snapshot.requests.total} (Pending: ${snapshot.requests.pendingCount}, Resolved: ${snapshot.requests.resolvedCount})
- Recent Key Reports:
${recentReports || '  * No active reports currently'}

3. COMMUNITY SUGGESTIONS:
- Total Suggestions Submitted: ${snapshot.suggestions.total}
- Recent Top Suggestions:
${recentSuggestions || '  * No suggestions recorded yet'}

4. SECURITY AUDIT & SYSTEM LOGS:
- Total Logged Security Events: ${snapshot.securityLogs.total}
- Recent Audit Trail:
${recentLogs || '  * System nominal, no critical security flags'}

5. FORMS & DSR SUBMISSIONS:
- Total Forms/DSR Recorded: ${snapshot.forms.total}
- Community Discussion Posts: ${snapshot.posts.total}

INSTRUCTIONS FOR GEMINI AI:
- You have DIRECT live access to the E-VEDHIKA database snapshot above.
- When the user asks about system users, reports, logs, suggestions, or platform health, summarize the REAL numbers above. DO NOT guess or invent fake data.
- If the user asks to analyze or generate a report/PDF/Excel for users, reports, logs, or suggestions, provide a clear analytical breakdown and tell them:
  "మరింత వివరమైన ఎక్సెల్ రిపోర్ట్ లేదా PDF డౌన్‌లోడ్ కోసం క్రింది బటన్లపై క్లిక్ చేయగలరు."
  (For detailed Excel or PDF report, click the download button below.)
- Always maintain a polite, official Telugu or English response tone matching the user's language.
`;
}

/**
 * Generates structured Excel (.xlsx) report file containing multi-tab database analytics
 */
export function exportExcelReport(snapshot: DatabaseSnapshot, reportName: string = 'E-VEDHIKA_Database_Analytics_Report') {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary Metrics
  const summaryData = [
    ['E-VEDHIKA TELANGANA PORTAL - DATABASE ANALYTICS SUMMARY'],
    ['Report Generated Date & Time', snapshot.timestamp],
    [''],
    ['Metric Category', 'Count / Value'],
    ['Total Registered Users', snapshot.users.total],
    ['Total Reports & Complaints', snapshot.problems.total],
    [' - Pending Reports', snapshot.problems.pendingCount],
    [' - In Progress Reports', snapshot.problems.inProgressCount],
    [' - Resolved Reports', snapshot.problems.resolvedCount],
    ['Total Service Requests', snapshot.requests.total],
    ['Total Community Suggestions', snapshot.suggestions.total],
    ['Total Security Audit Logs', snapshot.securityLogs.total],
    ['Total DSR & Form Submissions', snapshot.forms.total],
    ['Total Community Discussion Posts', snapshot.posts.total]
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

  // Sheet 2: Users List
  if (snapshot.users.recentList.length > 0) {
    const userRows = snapshot.users.recentList.map((u, i) => ({
      'S.No': i + 1,
      'Name': u.name,
      'Email': u.email,
      'Phone': u.phone,
      'Role/Designation': u.role,
      'District': u.district,
      'Mandal': u.mandal,
      'Panchayat': u.panchayat
    }));
    const userSheet = XLSX.utils.json_to_sheet(userRows);
    XLSX.utils.book_append_sheet(wb, userSheet, 'Users Directory');
  }

  // Sheet 3: Reports & Complaints
  if (snapshot.problems.recentList.length > 0) {
    const reportRows = snapshot.problems.recentList.map((p, i) => ({
      'S.No': i + 1,
      'Report Title': p.title,
      'Status': p.status,
      'Category': p.category,
      'Priority': p.priority,
      'Location': p.location,
      'Author': p.author,
      'Date': p.time,
      'Details': p.description
    }));
    const reportSheet = XLSX.utils.json_to_sheet(reportRows);
    XLSX.utils.book_append_sheet(wb, reportSheet, 'Reports & Issues');
  }

  // Sheet 4: Suggestions
  if (snapshot.suggestions.recentList.length > 0) {
    const suggRows = snapshot.suggestions.recentList.map((s, i) => ({
      'S.No': i + 1,
      'Suggestion Text': s.text,
      'Category': s.category,
      'Author': s.author,
      'Upvotes': s.upvotes,
      'Status': s.status,
      'Date': s.time
    }));
    const suggSheet = XLSX.utils.json_to_sheet(suggRows);
    XLSX.utils.book_append_sheet(wb, suggSheet, 'Suggestions');
  }

  // Sheet 5: Security Audit Logs
  if (snapshot.securityLogs.recentList.length > 0) {
    const logRows = snapshot.securityLogs.recentList.map((l, i) => ({
      'S.No': i + 1,
      'Timestamp': l.time,
      'User/Email': l.user,
      'Action': l.action,
      'Severity': l.severity,
      'IP Address': l.ip,
      'Details': l.details
    }));
    const logSheet = XLSX.utils.json_to_sheet(logRows);
    XLSX.utils.book_append_sheet(wb, logSheet, 'Security Logs');
  }

  const filename = `${reportName}_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

/**
 * Generates formatted PDF report using jsPDF and autoTable
 */
export function exportPdfReport(snapshot: DatabaseSnapshot, reportTitle: string = 'E-VEDHIKA Database Analytics Report') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header Banner
  doc.setFillColor(11, 61, 145); // #0B3D91 Primary Blue
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('E-VEDHIKA TELANGANA PORTAL', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${reportTitle.toUpperCase()} - OFFICIAL SYSTEM REPORT`, 14, 18);
  doc.text(`Generated: ${snapshot.timestamp}`, 14, 23);

  // Executive Summary Cards / Table
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Overview & Metrics', 14, 36);

  const metricsBody = [
    ['Total Registered Users', snapshot.users.total.toString(), 'Total Reports & Complaints', snapshot.problems.total.toString()],
    ['Pending Reports', snapshot.problems.pendingCount.toString(), 'Resolved Reports', snapshot.problems.resolvedCount.toString()],
    ['Service Requests', snapshot.requests.total.toString(), 'Community Suggestions', snapshot.suggestions.total.toString()],
    ['Security Audit Logs', snapshot.securityLogs.total.toString(), 'DSR / Form Submissions', snapshot.forms.total.toString()]
  ];

  autoTable(doc, {
    startY: 40,
    head: [['Metric Name', 'Value', 'Metric Name', 'Value']],
    body: metricsBody,
    theme: 'striped',
    headStyles: { fillColor: [11, 61, 145], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9 }
  });

  let currentY = (doc as any).lastAutoTable.finalY + 10;

  // 2. Reports & Complaints Section
  if (snapshot.problems.recentList.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Recent Reports & Complaints', 14, currentY);

    const reportHeaders = ['#', 'Title', 'Status', 'Category', 'Location', 'Author'];
    const reportBody = snapshot.problems.recentList.slice(0, 15).map((p, idx) => [
      (idx + 1).toString(),
      p.title.length > 25 ? p.title.substring(0, 25) + '...' : p.title,
      p.status.toUpperCase(),
      p.category,
      p.location,
      p.author
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [reportHeaders],
      body: reportBody,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // 3. Registered Users Directory
  if (snapshot.users.recentList.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. User Directory Sample', 14, currentY);

    const userHeaders = ['#', 'Name', 'Email / Phone', 'Role / Designation', 'District'];
    const userBody = snapshot.users.recentList.slice(0, 15).map((u, idx) => [
      (idx + 1).toString(),
      u.name,
      `${u.email}\n${u.phone}`,
      u.role,
      u.district
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [userHeaders],
      body: userBody,
      theme: 'striped',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // 4. Security Audit Logs
  if (snapshot.securityLogs.recentList.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Security Audit Logs', 14, currentY);

    const logHeaders = ['#', 'Timestamp', 'User', 'Action', 'Severity'];
    const logBody = snapshot.securityLogs.recentList.slice(0, 15).map((l, idx) => [
      (idx + 1).toString(),
      l.time,
      l.user,
      l.action,
      l.severity
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [logHeaders],
      body: logBody,
      theme: 'grid',
      headStyles: { fillColor: [180, 83, 9], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });
  }

  // Footer page numbers
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`E-Vedhika Telangana Portal | Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
  }

  const filename = `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
}
