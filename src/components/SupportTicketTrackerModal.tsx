import React, { useState, useEffect } from "react";
import { 
  X, Search, LifeBuoy, Clock, CheckCircle2, AlertCircle, 
  Send, Copy, Check, MessageSquare, ArrowRight, ShieldCheck,
  FileText, CornerDownRight, RefreshCw, ExternalLink
} from "lucide-react";
import { collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { trackTicketByCode } from "../services/supportTicketService";

interface SupportTicketTrackerModalProps {
  initialTrackingCode?: string;
  user?: any;
  onClose: () => void;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export function SupportTicketTrackerModal({
  initialTrackingCode = "",
  user,
  onClose,
  addToast
}: SupportTicketTrackerModalProps) {
  const [trackingInput, setTrackingInput] = useState(initialTrackingCode);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [linkedPost, setLinkedPost] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleTrack = async (codeToSearch?: string) => {
    const code = (codeToSearch || trackingInput).trim();
    if (!code) {
      setErrorMessage("దయచేసి సరైన యూనిక్ ట్రాకింగ్ నెంబర్ లేదా టికెట్ ID ఎంటర్ చేయండి.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const result = await trackTicketByCode(code);
      if (result.found && result.ticket) {
        setTicketData(result.ticket);
        setMessages(result.messages || []);
        setLinkedPost(result.linkedPost || null);
      } else {
        setTicketData(null);
        setMessages([]);
        setLinkedPost(null);
        setErrorMessage(result.message || "ట్రాకింగ్ నెంబర్‌తో సమాచారం లభించలేదు.");
      }
    } catch (err: any) {
      setErrorMessage("ట్రాక్ చేయడంలో సాంకేతిక లోపం ఏర్పడింది: " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if initialTrackingCode provided
  useEffect(() => {
    if (initialTrackingCode) {
      handleTrack(initialTrackingCode);
    }
  }, [initialTrackingCode]);

  // Real-time messages listener when ticketData is active
  useEffect(() => {
    if (!ticketData?.id) return;
    try {
      const q = query(
        collection(db, "support_tickets", ticketData.id, "messages"),
        orderBy("time", "asc")
      );
      const unsub = onSnapshot(q, (snap) => {
        setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }, () => {
        // Fallback without ordering
        const fallbackUnsub = onSnapshot(
          collection(db, "support_tickets", ticketData.id, "messages"),
          (snap) => {
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            list.sort((a: any, b: any) => (a.time || 0) - (b.time || 0));
            setMessages(list);
          }
        );
        return () => fallbackUnsub();
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, [ticketData?.id]);

  const copyTrackingNumber = () => {
    const num = ticketData?.trackingNumber || ticketData?.ticketNumber || trackingInput;
    if (!num) return;
    navigator.clipboard.writeText(num);
    setCopied(true);
    if (addToast) addToast("యూనిక్ ట్రాకింగ్ నెంబర్ కాపీ చేయబడింది!", "success");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !ticketData?.id || isSendingReply) return;

    setIsSendingReply(true);
    const text = replyText.trim();
    setReplyText("");

    try {
      const senderName = user?.displayName || user?.email?.split("@")[0] || "Citizen";
      await addDoc(collection(db, "support_tickets", ticketData.id, "messages"), {
        senderId: user?.uid || "citizen",
        senderName: senderName,
        text: text,
        time: Date.now()
      });

      await updateDoc(doc(db, "support_tickets", ticketData.id), {
        updatedAt: Date.now(),
        lastReplyBy: senderName,
        lastReplyTime: Date.now(),
        status: ticketData.status === "resolved" ? "open" : ticketData.status
      });

      if (addToast) addToast("మీ సందేశం సపోర్ట్ టీమ్‌కు పంపబడింది!", "success");
    } catch (err: any) {
      console.error("Error sending follow-up message:", err);
      setReplyText(text);
      if (addToast) addToast("సందేశం పంపడంలో లోపం ఏర్పడింది", "error");
    } finally {
      setIsSendingReply(false);
    }
  };

  // Helper for status details
  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "resolved" || s === "closed" || s === "పరిష్కరించబడింది") {
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "పరిష్కరించబడింది (Resolved)",
        step: 4
      };
    }
    if (s === "in_progress" || s === "పరిశీలనలో ఉంది") {
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-200",
        label: "పరిశీలన / పరిష్కార ప్రక్రియలో ఉంది (In Progress)",
        step: 3
      };
    }
    if (s === "private_support") {
      return {
        bg: "bg-purple-50 text-purple-700 border-purple-200",
        label: "సపోర్ట్ డెస్క్‌కు బదిలీ చేయబడింది (Pushed to Support)",
        step: 2
      };
    }
    return {
      bg: "bg-amber-50 text-amber-700 border-amber-200",
      label: "సమీక్షలో ఉంది (Under Review / Open)",
      step: 2
    };
  };

  const statusInfo = getStatusBadge(ticketData?.status || "open");

  return (
    <div className="fixed inset-0 z-[10005] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
                <LifeBuoy size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  సపోర్ట్ సిస్టమ్ & టికెట్ ట్రాకింగ్
                </h3>
                <p className="text-xs text-indigo-200/80 font-medium">
                  మీ యూనిక్ ట్రాకింగ్ నెంబర్‌తో లైవ్ స్టేటస్, అడ్మిన్ నోట్స్ మరియు పరిష్కారాన్ని తెలుసుకోండి.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Bar inside Header */}
          <div className="mt-5">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleTrack();
              }}
              className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl p-1.5 focus-within:border-indigo-400 focus-within:bg-white/15 transition-all shadow-inner"
            >
              <div className="pl-3 text-indigo-300">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="ఉదాహరణ: EV-Sup-01 లేదా టికెట్ ID..."
                className="w-full bg-transparent text-white placeholder-indigo-200/50 text-xs sm:text-sm font-semibold focus:outline-none px-2 py-1 uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" /> ట్రాక్ అవుతోంది...
                  </>
                ) : (
                  <>
                    ట్రాక్ చేయండి <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          {/* Error Notice */}
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 animate-in fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="text-xs font-semibold">
                <p>{errorMessage}</p>
                <p className="text-[11px] text-rose-500 font-normal mt-1">
                  గమనిక: పోస్ట్ సపోర్ట్ సిస్టమ్‌కు పంపబడినప్పుడు మీకు కేటాయించబడిన <span className="font-mono font-bold">EV-Sup-XX</span> ఫార్మాట్ నెంబర్‌ను ఎంటర్ చేయండి.
                </p>
              </div>
            </div>
          )}

          {/* Ticket Details Card */}
          {ticketData ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Top Banner Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      యూనిక్ ట్రాకింగ్ నెంబర్:
                    </span>
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-mono text-xs sm:text-sm font-black tracking-wide flex items-center gap-1.5">
                      #{ticketData.trackingNumber || ticketData.ticketNumber || ticketData.id}
                      <button
                        type="button"
                        onClick={copyTrackingNumber}
                        className="p-1 hover:bg-indigo-100 rounded-md text-indigo-600 transition-colors cursor-pointer"
                        title="కాపీ చేయండి"
                      >
                        {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      </button>
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-black border ${statusInfo.bg}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Subject & Details */}
                <div>
                  <h4 className="text-base font-black text-slate-900 leading-snug">
                    {ticketData.subject || "సపోర్ట్ విజ్ఞప్తి / సమస్య"}
                  </h4>
                  {ticketData.problem && ticketData.problem !== ticketData.subject && (
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-normal">
                      {ticketData.problem}
                    </p>
                  )}
                </div>

                {/* Metadata Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-medium text-slate-600">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">సమర్పించిన వారు</span>
                    <span className="font-bold text-slate-800">{ticketData.userName || "Citizen"}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">కేటగిరీ</span>
                    <span className="font-bold text-slate-800">{ticketData.category || "General Support"}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">సమర్పించిన తేదీ</span>
                    <span className="font-bold text-slate-800">
                      {new Date(ticketData.createdAt || Date.now()).toLocaleDateString("te-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                {/* Linked Post Notice if pushed from post */}
                {(ticketData.postId || ticketData.source === "pending_post_push" || linkedPost) && (
                  <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-xl flex items-center gap-2 text-xs font-bold text-purple-900">
                    <CornerDownRight size={14} className="text-purple-600 shrink-0" />
                    <span>ఈ టికెట్ మీ పెండింగ్ పోస్ట్ నుండి అధికారిక సపోర్ట్ సిస్టమ్‌కు విజయవంతంగా బదిలీ చేయబడింది.</span>
                  </div>
                )}
              </div>

              {/* Step Progress Bar */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={14} className="text-indigo-600" /> టికెట్ పరిష్కార దశలు (Resolution Timeline)
                </h5>

                <div className="grid grid-cols-4 gap-2 text-center relative">
                  {[
                    { step: 1, label: "సమర్పించబడింది", sub: "Pushed to Support", done: true },
                    { step: 2, label: "పరిశీలనలో ఉంది", sub: "In Review", done: statusInfo.step >= 2 },
                    { step: 3, label: "టీమ్ చర్యలు", sub: "Team Action", done: statusInfo.step >= 3 },
                    { step: 4, label: "పరిష్కారం", sub: "Resolved", done: statusInfo.step >= 4 },
                  ].map((s, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          s.done
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {s.done ? <CheckCircle2 size={16} /> : s.step}
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-800 mt-2 leading-tight">
                        {s.label}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium hidden sm:block">
                        {s.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Messages & Admin Responses */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare size={14} className="text-indigo-600" /> సంభాషణ & e-Vedika టీమ్ స్పందనలు (Updates)
                  </h5>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {messages.length} సందేశాలు
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">ఇంకా ఎటువంటి సందేశాలు లేవు.</p>
                  ) : (
                    messages.map((m, idx) => {
                      const isTeam = m.senderName?.includes("Team") || m.senderId === "admin";
                      return (
                        <div
                          key={m.id || idx}
                          className={`p-3.5 rounded-2xl text-xs space-y-1.5 ${
                            isTeam
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 text-slate-800 ml-4 sm:ml-8"
                              : "bg-slate-100/90 border border-slate-200 text-slate-800 mr-4 sm:mr-8"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={`font-black flex items-center gap-1 ${isTeam ? "text-indigo-700" : "text-slate-600"}`}>
                              {isTeam && <ShieldCheck size={12} className="text-indigo-600" />}
                              {m.senderName || "Citizen"}
                            </span>
                            <span className="text-slate-400">
                              {new Date(m.time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed font-normal whitespace-pre-wrap">
                            {m.text}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Follow-up Message Input */}
                <form onSubmit={handleSendFollowUp} className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="సపోర్ట్ టీమ్‌కు అదనపు సమాచారం లేదా సందేశం రాయండి..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isSendingReply || !replyText.trim()}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-sm cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Send size={13} /> పంపండి
                  </button>
                </form>
              </div>
            </div>
          ) : !loading && !errorMessage ? (
            /* Empty State Guide */
            <div className="py-10 px-4 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-inner">
                <LifeBuoy size={32} />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h4 className="text-base font-black text-slate-800">
                  మీ సపోర్ట్ టికెట్ లేదా విజ్ఞప్తిని ట్రాక్ చేయండి
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  అడ్మిన్ ద్వారా పెండింగ్ పోస్ట్ సపోర్ట్ సిస్టమ్‌కు పంపబడినప్పుడు జనరేట్ అయిన యూనిక్ నెంబర్ (ఉదా: <span className="font-mono font-bold text-indigo-600">EV-Sup-01</span>) ను పైన ఎంటర్ చేసి లైవ్ అప్‌డేట్‌లను చూడవచ్చు.
                </p>
              </div>

              {/* Sample Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left pt-2">
                <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-black uppercase text-indigo-600 block">యూనిక్ ట్రాకింగ్</span>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    ప్రతి రిక్వెస్ట్‌కు ఒక ప్రత్యేకమైన ట్రాకింగ్ కోడ్ కేటాయించబడుతుంది.
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
                  <span className="text-[10px] font-black uppercase text-emerald-600 block">లైవ్ అడ్మిన్ టీమ్</span>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    అధికారిక "e-Vedika Team" నుండి నేరుగా పరిష్కారాలు మరియు సమాధానాలు పొందండి.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-slate-600">Live Support Synchronization Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-black transition-colors cursor-pointer"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
