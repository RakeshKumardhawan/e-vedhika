import React, { useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { MessageSquare, ShieldCheck, Send, User } from "lucide-react";

interface SupportChatSimpleProps {
  user: any;
  userProfile: any;
  isAdmin: boolean;
  addToast: (msg: string, type?: "success" | "error" | "info") => void;
}

interface DirectChatMessage {
  id: string;
  threadUid: string;
  threadName: string;
  threadDesignation?: string;
  senderUid: string;
  senderName: string;
  isAdminSender: boolean;
  text: string;
  time: number;
}

const QUICK_PROMPTS = [
  "Ask about a report",
  "Report an issue",
  "Request access",
];

export function SupportChatSimple({
  user,
  userProfile,
  isAdmin,
  addToast,
}: SupportChatSimpleProps) {
  const [messages, setMessages] = useState<DirectChatMessage[]>([]);
  const [selectedThreadUid, setSelectedThreadUid] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const myUid = user?.uid || "guest";
  const myName =
    userProfile?.name || userProfile?.username || user?.displayName || "Officer";
  const myDesignation = userProfile?.designation || (isAdmin ? "Admin" : "Officer");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "support_direct_chats"),
      (snap) => {
        const list: DirectChatMessage[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          list.push({
            id: d.id,
            threadUid: String(data.threadUid || ""),
            threadName: String(data.threadName || "User"),
            threadDesignation: String(data.threadDesignation || ""),
            senderUid: String(data.senderUid || ""),
            senderName: String(data.senderName || "User"),
            isAdminSender: Boolean(data.isAdminSender),
            text: String(data.text || ""),
            time: Number(data.time || 0),
          });
        });
        list.sort((a, b) => a.time - b.time);
        setMessages(list);
      },
      () => {}
    );
    return () => unsub();
  }, []);

  // Thread list for Admin
  const adminThreads = useMemo(() => {
    const map = new Map<
      string,
      { threadUid: string; threadName: string; threadDesignation: string; lastMsg: string; lastTime: number }
    >();
    messages.forEach((m) => {
      if (!m.threadUid) return;
      const prev = map.get(m.threadUid);
      if (!prev || m.time >= prev.lastTime) {
        map.set(m.threadUid, {
          threadUid: m.threadUid,
          threadName: m.threadName || prev?.threadName || "User",
          threadDesignation: m.threadDesignation || prev?.threadDesignation || "",
          lastMsg: m.text,
          lastTime: m.time,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.lastTime - a.lastTime);
  }, [messages]);

  useEffect(() => {
    if (isAdmin && !selectedThreadUid && adminThreads.length > 0) {
      setSelectedThreadUid(adminThreads[0].threadUid);
    }
  }, [isAdmin, selectedThreadUid, adminThreads]);

  const activeThreadUid = isAdmin ? selectedThreadUid : myUid;

  const activeMessages = useMemo(
    () => messages.filter((m) => m.threadUid === activeThreadUid),
    [messages, activeThreadUid]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  const handleSend = async (customText?: string) => {
    const txt = (customText !== undefined ? customText : inputText).trim();
    if (!txt) return;
    if (!user || user.isAnonymous) {
      addToast("చాట్ పంపడానికి దయచేసి ముందుగా Sign In అవ్వండి.", "info");
      window.dispatchEvent(new Event("open-login-modal"));
      return;
    }
    const targetThreadUid = isAdmin ? selectedThreadUid : myUid;
    if (!targetThreadUid) {
      addToast("దయచేసి యూజర్ సంభాషణను ఎంచుకోండి.", "info");
      return;
    }
    const targetThreadMeta = adminThreads.find((t) => t.threadUid === targetThreadUid);

    setIsSending(true);
    if (customText === undefined) setInputText("");
    try {
      await addDoc(collection(db, "support_direct_chats"), {
        threadUid: targetThreadUid,
        threadName: isAdmin ? (targetThreadMeta?.threadName || "User") : myName,
        threadDesignation: isAdmin ? (targetThreadMeta?.threadDesignation || "") : myDesignation,
        senderUid: myUid,
        senderName: isAdmin ? "Administrator" : myName,
        isAdminSender: isAdmin,
        text: txt,
        time: Date.now(),
      });
    } catch (err: any) {
      addToast(`మెసేజ్ పంపడం విఫలమైంది: ${err?.message || "Error"}`, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20 text-left">
      {/* Page Title matching reference */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <MessageSquare size={18} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
            Support Chat
          </h2>
          <p className="text-xs text-slate-500">
            Message the administrator directly · questions, issues and requests
          </p>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Admin Thread List Sidebar */}
        {isAdmin && (
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/60 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 text-xs font-black text-slate-700">
              User Conversations ({adminThreads.length})
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-48 md:max-h-[470px]">
              {adminThreads.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">
                  ఇంకా యూజర్ మెసేజ్‌లు లేవు.
                </div>
              ) : (
                adminThreads.map((t) => (
                  <button
                    key={t.threadUid}
                    type="button"
                    onClick={() => setSelectedThreadUid(t.threadUid)}
                    className={`w-full px-3.5 py-3 text-left transition-colors cursor-pointer ${
                      selectedThreadUid === t.threadUid
                        ? "bg-indigo-50 border-l-4 border-indigo-600"
                        : "hover:bg-slate-100/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-black text-slate-900 truncate">
                        {t.threadName}
                      </span>
                      {t.threadDesignation && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white uppercase shrink-0">
                          {t.threadDesignation}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {t.lastMsg}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Active Conversation Pane */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3 bg-white">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              {isAdmin ? (
                <User size={16} className="text-blue-600" />
              ) : (
                <ShieldCheck size={16} className="text-blue-600" />
              )}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {isAdmin
                  ? adminThreads.find((t) => t.threadUid === selectedThreadUid)?.threadName ||
                    "Select a User"
                  : "Administrator"}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                <span>Replies usually within a working day</span>
              </div>
            </div>
          </div>

          {/* Messages / Empty State */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50/30 flex flex-col justify-between max-h-[380px]">
            {activeMessages.length === 0 ? (
              <div className="my-auto text-center max-w-md mx-auto space-y-4 py-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
                  <MessageSquare size={22} className="text-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Start a conversation with the administrator
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ask a question, report a problem with a report or portal, or request help. Your conversation is private between you and the administrator.
                  </p>
                </div>
                {!isAdmin && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {activeMessages.map((m) => {
                  const isMine = isAdmin ? m.isAdminSender : !m.isAdminSender;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-2xs ${
                          isMine
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-75 mb-0.5">
                          {m.isAdminSender ? "🛡️ Administrator" : m.senderName}
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                        <div className="text-[9px] opacity-65 mt-1 text-right">
                          {m.time
                            ? new Date(m.time).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input Bar matching reference */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white space-y-1.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-600 resize-none"
              />
              <button
                type="submit"
                disabled={isSending || !inputText.trim()}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                title="Send Message"
              >
                <Send size={16} />
              </button>
            </form>
            <div className="text-[10px] text-slate-400 pl-1">
              Enter to send · Shift + Enter for a new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
