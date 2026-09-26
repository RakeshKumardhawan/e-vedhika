import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, CheckCircle, Clock, AlertCircle, 
  Search, RefreshCw, Filter, User, Check, X, ShieldAlert,
  ArrowRight, ChevronRight, MessageCircle, AlertTriangle, Sparkles, Inbox,
  ExternalLink, Mail, Calendar, Hash, Flag, ShieldCheck, Phone, Paperclip, Image as ImageIcon,
  FileText
} from 'lucide-react';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, 
  doc, addDoc, getDocs, limit, where, getDoc
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

const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low', color: 'bg-slate-100 text-slate-600', icon: <Flag size={10} className="text-slate-400" /> },
  { id: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-600', icon: <Flag size={10} className="text-blue-500" /> },
  { id: 'high', label: 'High', color: 'bg-rose-100 text-rose-600', icon: <Flag size={10} className="text-rose-500" /> },
];

export function SupportCenter({ currentUser, addToast }: SupportCenterProps) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  const [userTicketHistory, setUserTicketHistory] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Listen to Real Firestore support_tickets Collection & private_support posts
  useEffect(() => {
    // Listener for support_tickets
    const q = query(collection(db, "support_tickets"), orderBy("updatedAt", "desc"));
    const unsubTickets = onSnapshot(q, (snapshot) => {
      const tList = snapshot.docs.map(d => ({ id: d.id, ...d.data(), _source: 'support_tickets' }));
      updateCombinedTickets(tList, 'support_tickets');
      setLoading(false);
    }, (err) => {
      console.warn("Tickets ordered query failed:", err);
      onSnapshot(collection(db, "support_tickets"), (snap) => {
        const tList = snap.docs.map(d => ({ id: d.id, ...d.data(), _source: 'support_tickets' }));
        updateCombinedTickets(tList, 'support_tickets');
        setLoading(false);
      });
    });

    // Listener for private_support posts
    const postsQuery = query(collection(db, "posts"), orderBy("time", "desc"));
    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      const privatePosts = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((p: any) => (p.status || "").toLowerCase() === "private_support")
        .map((p: any) => ({
          ...p,
          id: p.id,
          subject: p.title || "Private Post Support Inquiry",
          message: p.content,
          userName: p.userName || "User",
          userId: p.uid,
          createdAt: p.time,
          updatedAt: p.updatedAt || p.time,
          _source: 'posts',
          isPostSource: true
        }));
      updateCombinedTickets(privatePosts, 'posts');
    }, (err) => {
      console.warn("Posts query failed in support:", err);
    });

    return () => {
      unsubTickets();
      unsubPosts();
    };
  }, []);

  const combinedRef = useRef<{support_tickets: any[], posts: any[]}>({ support_tickets: [], posts: [] });
  const updateCombinedTickets = (list: any[], source: 'support_tickets' | 'posts') => {
    combinedRef.current[source] = list;
    const combined = [...combinedRef.current.support_tickets, ...combinedRef.current.posts];
    combined.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
    setTickets(combined);
    
    // Auto-select first if none selected
    if (combined.length > 0 && !selectedTicket) {
      setSelectedTicket(combined[0]);
    } else if (selectedTicket) {
      // Refresh selected ticket data if it's in the new lists
      const updated = combined.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  };

  // Fetch User Info when selectedTicket changes
  useEffect(() => {
    if (selectedTicket?.userId || selectedTicket?.uid) {
      const targetId = selectedTicket.userId || selectedTicket.uid;
      
      // Fetch profile
      getDoc(doc(db, "users", targetId)).then((snap) => {
        if (snap.exists()) {
          setSelectedUserProfile(snap.data());
        } else {
          setSelectedUserProfile(null);
        }
      });

      // Fetch history (limit 5)
      const q = query(
        collection(db, "support_tickets"), 
        where("uid", "==", targetId),
        limit(5)
      );
      getDocs(q).then((snap) => {
        setUserTicketHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    } else {
      setSelectedUserProfile(null);
      setUserTicketHistory([]);
    }
  }, [selectedTicket?.id]);

  // 2. Listen to Messages for the Selected Ticket (handles both sources)
  useEffect(() => {
    if (!selectedTicket?.id) {
      setMessages([]);
      return;
    }

    if (selectedTicket.isPostSource) {
      // Use comments subcollection for posts
      const commentsQuery = query(
        collection(db, "posts", selectedTicket.id, "comments"),
        orderBy("time", "asc")
      );
      const unsubComments = onSnapshot(commentsQuery, (snapshot) => {
        const msgList = snapshot.docs.map(d => ({ 
          id: d.id, 
          ...d.data(),
          senderName: d.data().userName || (d.data().isAdminComment ? "e-Vedika Team" : "Citizen"),
          text: d.data().text || d.data().comment
        }));
        setMessages(msgList);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }, () => {
        onSnapshot(collection(db, "posts", selectedTicket.id, "comments"), (snap) => {
          const msgList = snap.docs.map(d => ({ 
            id: d.id, 
            ...d.data(),
            senderName: d.data().userName || (d.data().isAdminComment ? "e-Vedika Team" : "Citizen"),
            text: d.data().text || d.data().comment
          }));
          msgList.sort((a: any, b: any) => (a.time || 0) - (b.time || 0));
          setMessages(msgList);
        });
      });
      return () => unsubComments();
    } else {
      // Use messages subcollection for support_tickets
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
      }, () => {
        onSnapshot(collection(db, "support_tickets", selectedTicket.id, "messages"), (snap) => {
          const msgList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          msgList.sort((a: any, b: any) => (a.time || 0) - (b.time || 0));
          setMessages(msgList);
        });
      });

      // Auto mark as read/open if new (only for support_tickets)
      if (selectedTicket.status === "new") {
        updateDoc(doc(db, "support_tickets", selectedTicket.id), { status: "open" }).catch(console.error);
      }

      return () => unsubMessages();
    }
  }, [selectedTicket?.id]);

  // Handle Sending a Reply as "e-Vedika Team"
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket?.id || isSending) return;

    setIsSending(true);
    const text = replyText.trim();
    setReplyText("");

    try {
      if (selectedTicket.isPostSource) {
        // Add as admin comment to post
        await addDoc(collection(db, "posts", selectedTicket.id, "comments"), {
          uid: currentUser?.uid || "admin",
          userName: "e-Vedika Team",
          text: text,
          time: Date.now(),
          isAdminComment: true
        });
        
        // Update post updatedAt
        await updateDoc(doc(db, "posts", selectedTicket.id), {
          updatedAt: Date.now()
        });
      } else {
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
      }

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
      const col = selectedTicket.isPostSource ? "posts" : "support_tickets";
      await updateDoc(doc(db, col, selectedTicket.id), {
        status: newStatus,
        updatedAt: Date.now()
      });
      setSelectedTicket({ ...selectedTicket, status: newStatus });
      if (addToast) addToast(`Status updated to ${newStatus.toUpperCase()}`, "success");
    } catch (e: any) {
      console.error(e);
      if (addToast) addToast(`Error updating status: ${e.message}`, "error");
    }
  };

  // Handle Priority Change
  const handleUpdatePriority = async (newPriority: string) => {
    if (!selectedTicket?.id) return;
    try {
      const col = selectedTicket.isPostSource ? "posts" : "support_tickets";
      await updateDoc(doc(db, col, selectedTicket.id), {
        priority: newPriority,
        updatedAt: Date.now()
      });
      setSelectedTicket({ ...selectedTicket, priority: newPriority });
      if (addToast) addToast(`Priority set to ${newPriority.toUpperCase()}`, "success");
    } catch (e: any) {
      console.error(e);
    }
  };

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    const userName = (t.userName || t.name || t.userEmail || "").toLowerCase();
    const subject = (t.subject || t.title || t.problem || "").toLowerCase();
    const message = (t.message || t.description || "").toLowerCase();
    const trackingNo = (t.trackingNumber || t.ticketNumber || "").toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = userName.includes(query) || subject.includes(query) || message.includes(query) || trackingNo.includes(query) || t.id.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    if (statusFilter === "open") return t.status === "open" || t.status === "new" || t.status === "private_support" || !t.status;
    if (statusFilter === "in_progress") return t.status === "in_progress" || t.status === "pending";
    if (statusFilter === "resolved") return t.status === "resolved";
    if (statusFilter === "closed") return t.status === "closed";
    return true;
  });

  const openCount = tickets.filter(t => t.status === "open" || t.status === "new" || t.status === "private_support" || !t.status).length;
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[720px]">
        {/* LEFT COLUMN: TICKET LIST (3 COLS) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
          {/* Filter and Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Pills */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All", count: tickets.length },
                { id: "open", label: "Open", count: openCount },
                { id: "in_progress", label: "Pending", count: inProgressCount },
                { id: "resolved", label: "Resolved", count: resolvedCount },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                    statusFilter === st.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {st.label} ({st.count})
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 max-h-[600px]">
            {loading && tickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-[10px] font-bold">
                <RefreshCw className="animate-spin inline mb-2 text-blue-600 block mx-auto" size={20} /> 
                Loading requests...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-[10px] font-bold space-y-2">
                <MessageSquare className="mx-auto text-slate-200" size={32} />
                <p>No tickets found.</p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const status = (t.status || "open").toLowerCase();
                const priority = t.priority || "medium";
                const userName = t.userName || t.name || t.userEmail?.split('@')[0] || "Citizen User";
                const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "Recent";
                const priorityConfig = PRIORITY_LEVELS.find(p => p.id === priority) || PRIORITY_LEVELS[1];

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-200 shadow-xs"
                        : "hover:bg-slate-50 border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 truncate flex-1">
                        <span className="font-mono text-[8px] px-1 py-0.5 bg-indigo-50 text-indigo-700 rounded font-black border border-indigo-100 shrink-0">
                          #{t.trackingNumber || t.ticketNumber || t.id.substring(0, 8).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 shrink-0">{dateStr}</span>
                    </div>

                    <h5 className="font-black text-[11px] text-slate-900 truncate leading-tight mb-1">
                      {t.subject || t.title || t.problem || "Support Inquiry"}
                    </h5>

                    <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mb-2">
                      {t.message || t.description || t.problem || "No description provided."}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black text-slate-600 flex items-center gap-1 truncate">
                        <User size={10} className="text-slate-400" />
                        {userName}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                        status === "resolved" ? "bg-emerald-100 text-emerald-800" :
                        status === "in_progress" || status === "pending" || status === "private_support" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {status === "resolved" ? "Resolved" : "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CONVERSATION & REPLY PANEL (6-9 COLS) */}
        <div className={`lg:col-span-${showUserInfo ? '6' : '9'} bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden transition-all duration-300`}>
          {selectedTicket ? (
            <>
              {/* Ticket Top Header & Status Controls */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col gap-5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                        selectedTicket.status === "resolved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {selectedTicket.status === "resolved" ? "Resolved" : "Active Request"}
                      </span>
                      
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[9px] font-black">
                        <Hash size={10} /> {selectedTicket.trackingNumber || selectedTicket.ticketNumber || selectedTicket.id.substring(0, 8).toUpperCase()}
                      </div>
                      
                      <div className="relative group">
                        <div className={`px-2.5 py-0.5 rounded-lg border flex items-center gap-1.5 cursor-pointer text-[9px] font-black uppercase transition-all hover:brightness-95 ${
                          PRIORITY_LEVELS.find(p => p.id === (selectedTicket.priority || 'medium'))?.color || PRIORITY_LEVELS[1].color
                        }`}>
                          {PRIORITY_LEVELS.find(p => p.id === (selectedTicket.priority || 'medium'))?.icon}
                          Priority: {selectedTicket.priority || 'medium'}
                        </div>
                        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 hidden group-hover:block overflow-hidden min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
                          {PRIORITY_LEVELS.map(p => (
                            <button
                              key={p.id}
                              onClick={() => handleUpdatePriority(p.id)}
                              className="w-full px-4 py-2.5 text-left text-[10px] font-black uppercase hover:bg-slate-50 flex items-center gap-2 border-b border-slate-50 last:border-0"
                            >
                              {p.icon} {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedTicket.isPostSource ? (
                        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                          <MessageCircle size={10} /> Community Post
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                          <Inbox size={10} /> Support Portal
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      {selectedTicket.subject || selectedTicket.title || selectedTicket.problem || "Citizen Support Inquiry"}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setShowUserInfo(!showUserInfo)}
                      className={`p-2.5 rounded-xl border transition-all shadow-sm ${showUserInfo ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                      title="User Sidebar"
                    >
                      <User size={18} />
                    </button>
                    <select
                      value={selectedTicket.status || "open"}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="px-4 py-2 bg-white border-2 border-slate-100 rounded-xl text-[11px] font-black text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Chat Thread Messages Display */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/20 max-h-[420px] min-h-[300px]">
                {/* Original Support Inquiry */}
                <div className="flex justify-start">
                  <div className="max-w-[95%] w-full bg-indigo-50/30 rounded-[32px] rounded-tl-none p-6 border border-indigo-100/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between gap-4 mb-4 border-b border-indigo-100/30 pb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600">
                           <User size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 leading-none">
                            {selectedTicket.userName || "Citizen"}
                          </p>
                          <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mt-1">Original Submission</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString() : ''}
                        </span>
                        <span className="text-[10px] font-black text-slate-500">
                          {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap font-medium relative z-10 italic bg-white/50 p-4 rounded-2xl border border-white/80">
                      "{selectedTicket.message || selectedTicket.description || selectedTicket.problem || selectedTicket.subject || "No content provided."}"
                    </p>
                  </div>
                </div>

                {/* Subcollection Thread Messages */}
                {messages.map((m) => {
                  const isAdminMsg = m.senderName === "e-Vedika Team" || m.senderId === "admin" || m.senderId === currentUser?.uid || m.isAdminComment;

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

        {/* USER QUICK INFO SIDEBAR (3 COLS) */}
        {showUserInfo && selectedTicket && (
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-slate-100 bg-slate-50/30">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User size={14} className="text-blue-600" /> User Quick Info
              </h4>

              <div className="flex flex-col items-center text-center gap-3 py-2">
                <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  {selectedUserProfile?.photoURL ? (
                    <img src={selectedUserProfile.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <User size={40} className="text-indigo-300" />
                  )}
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm">
                    {selectedUserProfile?.username || selectedTicket.userName || "Citizen"}
                  </h5>
                  <div className="flex items-center gap-1 justify-center mt-1">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified Citizen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Email Address</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">{selectedUserProfile?.email || selectedTicket.userEmail || 'Not Provided'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Phone Number</p>
                    <p className="text-[11px] font-bold text-slate-700 truncate">
                      {selectedTicket.userPhone || selectedUserProfile?.phoneNumber || 'Not Provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Joined Portal</p>
                    <p className="text-[11px] font-bold text-slate-700">
                      {selectedUserProfile?.createdAt ? new Date(selectedUserProfile.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments Section if any */}
              {(selectedTicket.mediaUrl || (selectedTicket.attachments && selectedTicket.attachments.length > 0)) && (
                <div className="space-y-3 pt-2">
                  <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Attachments & Media</h6>
                  <div className="space-y-2">
                    {selectedTicket.mediaUrl && (
                      <div className="relative group rounded-xl overflow-hidden border border-slate-200">
                        {selectedTicket.mediaType?.startsWith('image/') ? (
                          <img src={selectedTicket.mediaUrl} alt="Media" className="w-full h-32 object-cover cursor-pointer" onClick={() => window.open(selectedTicket.mediaUrl, '_blank')} />
                        ) : (
                          <div className="w-full h-20 bg-slate-100 flex items-center justify-center text-slate-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                        <a href={selectedTicket.mediaUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg shadow-sm text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                    {selectedTicket.attachments?.map((at: any, i: number) => (
                      <a 
                        key={i}
                        href={at.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Paperclip size={14} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-black text-slate-700 truncate">{at.name || 'Attachment'}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Click to View</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              <div className="space-y-3 pt-2">
                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Recent Ticket History</h6>
                {userTicketHistory.length > 0 ? (
                  <div className="space-y-2">
                    {userTicketHistory.map(h => (
                      <div key={h.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="text-[9px] font-mono font-black text-indigo-600 bg-indigo-50 px-1 rounded">
                            #{h.trackingNumber || h.ticketNumber || h.id.substring(0, 5).toUpperCase()}
                          </span>
                          <span className={`text-[8px] font-black uppercase ${h.status === 'resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {h.status}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-700 line-clamp-1">{h.subject || 'Support Inquiry'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic">No previous ticket history found.</p>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button 
                onClick={() => window.open(`/profile/${selectedTicket.userId || selectedTicket.uid}`, '_blank')}
                className="w-full py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={12} /> View Full Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
