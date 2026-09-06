import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, CheckCircle, Clock, AlertCircle, 
  Search, RefreshCw, Filter, User, Check, X, ShieldAlert,
  ArrowRight, ChevronRight, MessageCircle, AlertTriangle, Sparkles, Inbox
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, 
  doc, addDoc, getDocs, limit 
} from 'firebase/firestore';
import { db } from '../../../firebase';
import Swal from 'sweetalert2';

interface SupportCenterProps {
  currentUser?: any;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

const QUICK_RESPONSES = [
  "నమస్కారం! మీ సమస్య పరిశీలనలో ఉంది. త్వరలోనే తగిన పరిష్కారం అందజేస్తాము. (We are reviewing your issue and will resolve it soon.)",
  "మీరు తెలియజేసిన సమస్య విజయవంతంగా పరిష్కరించబడింది. ధన్యవాదాలు! (Your reported issue has been successfully resolved.)",
  "దయచేసి మీ జిల్లా, మండలం లేదా సంబంధిత డాక్యుమెంట్ వివరాలు ఇక్కడ పంపగలరు. (Please provide your district, mandal, or additional details.)",
  "మీ దరఖాస్తు సంబంధిత అధికార యంత్రాంగానికి పంపబడింది. (Your inquiry has been escalated to the relevant departmental authority.)"
];

export function SupportCenter({ currentUser, addToast }: SupportCenterProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Listen to Real Firestore support_tickets Collection
  useEffect(() => {
    const q = query(collection(db, "support_tickets"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTickets(tList);
      setLoading(false);

      // Keep selected ticket updated if it changes
      if (selectedTicket) {
        const updatedSelected = tList.find(t => t.id === selectedTicket.id);
        if (updatedSelected) setSelectedTicket(updatedSelected);
      } else if (tList.length > 0 && !selectedTicket) {
        setSelectedTicket(tList[0]);
      }
    }, (err) => {
      console.error("Error fetching support tickets:", err);
      // Fallback without ordering if index is building
      const fallbackQuery = collection(db, "support_tickets");
      onSnapshot(fallbackQuery, (snap) => {
        const tList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        tList.sort((a: any, b: any) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
        setTickets(tList);
        setLoading(false);
        if (tList.length > 0 && !selectedTicket) setSelectedTicket(tList[0]);
      });
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen to Messages Subcollection for the Selected Ticket
  useEffect(() => {
    if (!selectedTicket?.id) {
      setMessages([]);
      return;
    }

    // Auto mark as read/open if new
    if (selectedTicket.status === "new") {
      updateDoc(doc(db, "support_tickets", selectedTicket.id), { status: "open" }).catch(console.error);
    }

    const messagesQuery = query(
      collection(db, "support_tickets", selectedTicket.id, "messages"),
      orderBy("time", "asc")
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgList);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, (err) => {
      console.warn("Retrying messages query without ordering:", err);
      const fallbackMessages = collection(db, "support_tickets", selectedTicket.id, "messages");
      onSnapshot(fallbackMessages, (snap) => {
        const msgList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        msgList.sort((a: any, b: any) => (a.time || a.createdAt || 0) - (b.time || b.createdAt || 0));
        setMessages(msgList);
      });
    });

    return () => unsubMessages();
  }, [selectedTicket?.id]);

  // Handle Sending a Reply as "e-Vedika Team"
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket?.id || isSending) return;

    setIsSending(true);
    const text = replyText.trim();
    setReplyText("");

    try {
      // 1. Add message to subcollection
      await addDoc(collection(db, "support_tickets", selectedTicket.id, "messages"), {
        senderId: currentUser?.uid || "admin",
        senderName: "e-Vedika Team",
        text: text,
        time: Date.now()
      });

      // 2. Update ticket status & updatedAt timestamp
      const nextStatus = selectedTicket.status === "resolved" || selectedTicket.status === "closed" ? "open" : "in_progress";
      await updateDoc(doc(db, "support_tickets", selectedTicket.id), {
        status: nextStatus,
        updatedAt: Date.now(),
        lastReplyBy: "e-Vedika Team",
        lastReplyTime: Date.now()
      });

      if (addToast) addToast("Reply sent to citizen as e-Vedika Team!", "success");
    } catch (e: any) {
      console.error("Error sending reply:", e);
      if (addToast) addToast(`Failed to send reply: ${e.message}`, "error");
      setReplyText(text); // restore on failure
    } finally {
      setIsSending(false);
    }
  };

  // Handle Status Change
  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket?.id) return;
    try {
      await updateDoc(doc(db, "support_tickets", selectedTicket.id), {
        status: newStatus,
        updatedAt: Date.now()
      });
      setSelectedTicket({ ...selectedTicket, status: newStatus });
      if (addToast) addToast(`Ticket status updated to ${newStatus.toUpperCase()}`, "success");
    } catch (e: any) {
      console.error(e);
      if (addToast) addToast(`Error updating status: ${e.message}`, "error");
    }
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    const userName = (t.userName || t.name || t.userEmail || "").toLowerCase();
    const subject = (t.subject || t.title || t.problem || "").toLowerCase();
    const message = (t.message || t.description || "").toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = userName.includes(query) || subject.includes(query) || message.includes(query);
    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    if (statusFilter === "open") return t.status === "open" || t.status === "new" || !t.status;
    if (statusFilter === "in_progress") return t.status === "in_progress" || t.status === "pending";
    if (statusFilter === "resolved") return t.status === "resolved";
    if (statusFilter === "closed") return t.status === "closed";
    return true;
  });

  const openCount = tickets.filter(t => t.status === "open" || t.status === "new" || !t.status).length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress" || t.status === "pending").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved").length;
  const closedCount = tickets.filter(t => t.status === "closed").length;

  return (
    <div className="space-y-6 pb-16 text-left max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0B3D91] to-slate-900 p-8 rounded-[36px] text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-200 flex items-center gap-1.5">
                <MessageCircle size={12} className="text-emerald-400" />
                Communication Hub
              </span>
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-200 border border-blue-400/30 rounded-full text-[10px] font-bold">
                {openCount + inProgressCount} Active Support Inquiries
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Support Center & Citizen Inquiries
            </h2>
            <p className="text-blue-100/80 text-xs sm:text-sm max-w-2xl font-medium mt-1">
              Live Firestore support conversations, user problem reports, and official "e-Vedika Team" resolution desk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">Open Tickets</span>
              <span className="text-lg font-black text-white">{openCount}</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">In Progress</span>
              <span className="text-lg font-black text-amber-300">{inProgressCount}</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-300 block">Resolved</span>
              <span className="text-lg font-black text-emerald-300">{resolvedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Support Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* LEFT COLUMN: TICKET LIST (4 COLS) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          {/* Filter and Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search citizen name, subject, problem..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All", count: tickets.length },
                { id: "open", label: "Open", count: openCount },
                { id: "in_progress", label: "Pending", count: inProgressCount },
                { id: "resolved", label: "Resolved", count: resolvedCount },
                { id: "closed", label: "Closed", count: closedCount },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    statusFilter === st.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st.label} ({st.count})
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 max-h-[580px]">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-xs font-medium">
                <RefreshCw className="animate-spin inline mr-2 text-blue-600" size={16} /> Loading support requests...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-medium space-y-2">
                <MessageSquare className="mx-auto text-slate-300" size={32} />
                <p>No support tickets found matching this filter.</p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const status = (t.status || "open").toLowerCase();
                const userName = t.userName || t.name || t.userEmail?.split('@')[0] || "Citizen User";
                const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "Recent";

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border border-blue-200 shadow-xs"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-black text-xs text-slate-900 truncate leading-tight flex-1">
                        {t.subject || t.title || t.problem || "Support Inquiry"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 shrink-0">{dateStr}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1 mb-2">
                      {t.message || t.description || t.problem || "Citizen requested administrative assistance."}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 truncate">
                        <User size={11} className="text-slate-400" />
                        {userName}
                      </span>

                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                        status === "resolved" ? "bg-emerald-100 text-emerald-800" :
                        status === "in_progress" || status === "pending" ? "bg-amber-100 text-amber-800" :
                        status === "closed" ? "bg-slate-100 text-slate-700" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {status === "in_progress" ? "In Progress" : status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CONVERSATION & REPLY PANEL (8 COLS) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Top Header & Status Controls */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      selectedTicket.status === "resolved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                      selectedTicket.status === "in_progress" || selectedTicket.status === "pending" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                      selectedTicket.status === "closed" ? "bg-slate-200 text-slate-800" :
                      "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {selectedTicket.status || "open"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                      ID: {selectedTicket.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : ''}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {selectedTicket.subject || selectedTicket.title || selectedTicket.problem || "Citizen Support Inquiry"}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                    <span><strong>User:</strong> {selectedTicket.userName || selectedTicket.name || "Citizen"}</span>
                    {selectedTicket.userEmail && <span>• {selectedTicket.userEmail}</span>}
                    {selectedTicket.userId && <span className="font-mono text-[10px] text-blue-600">UID: {selectedTicket.userId}</span>}
                  </div>
                </div>

                {/* Status Switcher Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={selectedTicket.status || "open"}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Status: Open</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="resolved">Status: Resolved</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  {selectedTicket.status !== "resolved" ? (
                    <button
                      onClick={() => handleUpdateStatus("resolved")}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Check size={13} /> Mark Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus("open")}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black transition-all"
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Thread Messages Display */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30 max-h-[380px] min-h-[260px]">
                {/* Original Support Inquiry / Root Message */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 rounded-tl-none">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-[11px] font-black text-slate-900 flex items-center gap-1">
                        <User size={12} className="text-blue-600" />
                        {selectedTicket.userName || "Citizen"} (Original Submission)
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">
                        {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedTicket.message || selectedTicket.description || selectedTicket.problem || selectedTicket.subject || "Support inquiry submitted via portal."}
                    </p>
                  </div>
                </div>

                {/* Subcollection Thread Messages */}
                {messages.map((m) => {
                  const isAdminMsg = m.senderName === "e-Vedika Team" || m.senderId === "admin" || m.senderId === currentUser?.uid;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isAdminMsg ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-3xl p-4 shadow-xs ${
                          isAdminMsg
                            ? 'bg-[#0B3D91] text-white rounded-tr-none border border-blue-900'
                            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className={`text-[11px] font-black flex items-center gap-1.5 ${isAdminMsg ? 'text-blue-100' : 'text-slate-900'}`}>
                            {isAdminMsg && <Sparkles size={12} className="text-amber-300" />}
                            {m.senderName || (isAdminMsg ? "e-Vedika Team" : "Citizen")}
                            {isAdminMsg && (
                              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded text-white font-bold">
                                Official Admin
                              </span>
                            )}
                          </span>
                          <span className={`text-[9px] ${isAdminMsg ? 'text-blue-200' : 'text-slate-400'}`}>
                            {m.time ? new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed whitespace-pre-wrap ${isAdminMsg ? 'text-blue-50' : 'text-slate-700'}`}>
                          {m.text}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Template Replies */}
              <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles size={11} className="text-blue-600" /> Quick Replies:
                </span>
                {QUICK_RESPONSES.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReplyText(qr)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 text-slate-600 hover:text-blue-700 rounded-lg text-[10px] font-semibold transition-all shrink-0 truncate max-w-[220px]"
                    title={qr}
                  >
                    {qr.slice(0, 30)}...
                  </button>
                ))}
              </div>

              {/* Reply Input Area */}
              <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official response as 'e-Vedika Team' to this citizen..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Press <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Ctrl+Enter</kbd> to send
                  </span>

                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSending}
                    className="px-6 py-2.5 bg-[#0B3D91] hover:bg-blue-900 disabled:opacity-50 text-white rounded-2xl text-xs font-black transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
                  >
                    <Send size={14} /> {isSending ? "Sending..." : "Reply as e-Vedika Team"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-3 p-12">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare size={32} />
              </div>
              <h4 className="text-sm font-black text-slate-700">Select a Support Conversation</h4>
              <p className="text-xs text-slate-400 max-w-sm text-center">
                Click on any citizen inquiry from the left column to view the full dialogue and respond as the e-Vedika Team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
