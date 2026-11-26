import React, { useState, useMemo } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { MessageSquare, ShieldCheck, X, Send } from "lucide-react";

interface FeedbackSuggestionsSimpleProps {
  suggestions: any[];
  user: any;
  userProfile: any;
  isAdmin: boolean;
  onClose?: () => void;
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const DESIGNATION_OPTIONS = [
  "PS (Panchayat Secretary)",
  "MPO",
  "DPO",
  "DPM",
  "DEO",
  "EOPRRD",
  "GP Operator",
  "Admin",
  "Citizen",
];

const CATEGORY_OPTIONS = [
  "General Appreciation",
  "Feature Request",
  "Bug Report",
  "Portal Issue",
  "Software Hub",
  "Other",
];

function formatDateTime(ts: any): string {
  if (!ts) return "";
  const ms = typeof ts === "number" ? (ts > 1e12 ? ts : ts * 1000) : Date.parse(String(ts)) || 0;
  if (!ms) return "";
  return new Date(ms).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function extractAdminReply(item: any): string {
  if (!item) return "";
  const direct =
    item.adminReply ||
    item.reply ||
    item.adminResponse ||
    item.response ||
    item.solution ||
    item.adminSolution ||
    item.adminNotes ||
    item.remarks ||
    item.answer;
  if (direct && String(direct).trim()) return String(direct).trim();
  if (Array.isArray(item.replies) && item.replies.length > 0) {
    return item.replies
      .map((r: any) => (typeof r === "string" ? r : r?.text || r?.reply || r?.msg || ""))
      .filter(Boolean)
      .join("\n")
      .trim();
  }
  return "";
}

export function FeedbackSuggestionsSimple({
  suggestions,
  user,
  userProfile,
  isAdmin,
  onClose,
  addToast,
}: FeedbackSuggestionsSimpleProps) {
  const [activeSubTab, setActiveSubTab] = useState<"all" | "submit">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Submit form state
  const defaultName =
    userProfile?.name || userProfile?.username || user?.displayName || "";
  const defaultDesignation =
    userProfile?.designation || (isAdmin ? "Admin" : "PS (Panchayat Secretary)");
  const [name, setName] = useState(defaultName);
  const [designation, setDesignation] = useState(defaultDesignation);
  const [category, setCategory] = useState("General Appreciation");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin inline reply state
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSavingReply, setIsSavingReply] = useState(false);

  const visibleSuggestions = useMemo(() => {
    const filtered = (suggestions || []).filter((s) => {
      const st = String(s.status || "").toLowerCase();
      if (st === "deleted" || st === "rejected") return false;
      const hasAnyReply = Boolean(extractAdminReply(s));
      if (!isAdmin && st === "pending" && !hasAnyReply && s.uid !== user?.uid) return false;
      if (categoryFilter !== "ALL") {
        const cat = String(s.category || "General Appreciation");
        if (cat.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }
      return true;
    });
    return [...filtered].sort((a, b) => Number(b.time || 0) - Number(a.time || 0));
  }, [suggestions, categoryFilter, isAdmin, user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      addToast("దయచేసి పేరు మరియు మీ సూచనను నమోదు చేయండి.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "suggestions"), {
        name: name.trim(),
        designation: designation.trim() || "Officer",
        category,
        suggestion: message.trim(),
        time: Date.now(),
        status: "approved",
        uid: user?.uid || "anonymous",
      });
      setMessage("");
      setActiveSubTab("all");
      addToast("మీ Feedback & Suggestion విజయవంతంగా సమర్పించబడింది!", "success");
    } catch (err: any) {
      addToast(`సమర్పణ విఫలమైంది: ${err?.message || "Error"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAdminReply = async (id: string) => {
    if (!replyText.trim()) return;
    setIsSavingReply(true);
    try {
      await updateDoc(doc(db, "suggestions", id), {
        adminReply: replyText.trim(),
        adminReplyTime: Date.now(),
        status: "approved",
      });
      setReplyingId(null);
      setReplyText("");
      addToast("Admin Reply సేవ్ అయింది!", "success");
    } catch {
      addToast("Reply సేవ్ చేయడం విఫలమైంది.", "error");
    } finally {
      setIsSavingReply(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("feature")) return "🚀";
    if (c.includes("bug") || c.includes("issue")) return "🛠️";
    if (c.includes("software")) return "💻";
    return "⭐";
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden text-left">
      {/* Dark Header matching reference */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
            <MessageSquare size={18} className="text-slate-200" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black leading-tight">
              Feedback &amp; Suggestions
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              Community ideas, officer suggestions &amp; official administrator responses
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Sub-Tabs & Filter */}
      <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/40">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveSubTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              activeSubTab === "all"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            📋 All Feedback &amp; Suggestions ({visibleSuggestions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("submit")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
              activeSubTab === "submit"
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            🎉 Submit Suggestion / Feedback
          </button>
        </div>

        {activeSubTab === "all" && (
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-slate-500">Filter:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 space-y-4">
        {activeSubTab === "all" ? (
          visibleSuggestions.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              ఇంకా ఎటువంటి Feedback / Suggestions లేవు. మొదటి సూచనను సమర్పించండి!
            </div>
          ) : (
            <div className="space-y-4">
              {visibleSuggestions.map((item) => {
                const cat = String(item.category || "General Appreciation");
                const desig = String(item.designation || "").trim();
                const textBody = String(item.suggestion || item.text || item.msg || "");
                const adminReplyText = extractAdminReply(item);
                const hasReply = Boolean(adminReplyText);
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3"
                  >
                    {/* Top Meta Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm font-black text-slate-900">
                          {item.name || item.author || "Officer"}
                        </span>
                        {desig && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-black uppercase">
                            {desig}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                          {getCategoryIcon(cat)} {cat}
                        </span>
                        {hasReply && (
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck size={11} />
                            <span>Replied</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {formatDateTime(item.time)}
                      </span>
                    </div>

                    {/* Message Body */}
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {textBody}
                    </p>

                    {/* Admin Reply Box */}
                    {hasReply && (
                      <div className="bg-emerald-50/90 border-l-4 border-blue-600 rounded-r-xl p-3.5 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <ShieldCheck size={13} className="text-blue-600" />
                            <span>Admin</span>
                          </span>
                          {item.adminReplyTime && (
                            <span className="text-[10px] text-slate-500">
                              {formatDateTime(item.adminReplyTime)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-900 leading-relaxed whitespace-pre-wrap">
                          {adminReplyText}
                        </p>
                      </div>
                    )}

                    {/* Admin Inline Reply Action */}
                    {isAdmin && (
                      <div className="pt-1">
                        {replyingId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Admin official reply రాయండి..."
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
                            />
                            <button
                              type="button"
                              disabled={isSavingReply}
                              onClick={() => handleSaveAdminReply(item.id)}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer"
                            >
                              {isSavingReply ? "..." : "Send"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingId(null);
                                setReplyText("");
                              }}
                              className="px-2.5 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingId(item.id);
                              setReplyText(adminReplyText);
                            }}
                            className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            {hasReply ? "✏️ Edit Admin Reply" : "💬 Reply as Admin"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name / Office *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ఉదా: MPO Mulug / PS Chinnathumpally"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Designation *
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white outline-none focus:border-slate-900"
                >
                  {DESIGNATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white outline-none focus:border-slate-900"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Suggestion / Feedback *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="మీ సూచన, సమస్య లేదా అభిప్రాయాన్ని ఇక్కడ రాయండి..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Send size={13} />
              <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
