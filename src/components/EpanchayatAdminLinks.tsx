import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Trash2, Link2, X, ExternalLink, ShieldCheck, FileText, Edit3, Globe, Play, RefreshCw, Pencil, ArrowLeft, ArrowRight, Home, Lock, Maximize2, Minimize2 } from "lucide-react";

export type PortalRole = "gp" | "mandal" | "district";
export type PortalLinkCategory = "report" | "entry";

export interface PortalCustomLink {
  id: string;
  title: string;
  subtitle?: string;
  targetUrl: string;
  category: PortalLinkCategory;
  roles: PortalRole[];
  createdAt: number;
}

const COLLECTION_NAME = "epanchayat_portal_links";
const LOCAL_CACHE_KEY = "ev_epanchayat_custom_links_v1";

export function normalizeEpanchayatTarget(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "/deptLoginVerified";
  try {
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const u = new URL(trimmed);
      return u.pathname + u.search + u.hash;
    }
  } catch {
    // fallback to path
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export async function loadCustomPortalLinks(): Promise<PortalCustomLink[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    const items: PortalCustomLink[] = snap.docs.map((d) => {
      const data = d.data() as any;
      return {
        id: d.id,
        title: String(data.title || ""),
        subtitle: String(data.subtitle || ""),
        targetUrl: String(data.targetUrl || ""),
        category: data.category === "entry" ? "entry" : "report",
        roles: Array.isArray(data.roles) && data.roles.length > 0 ? data.roles : ["gp"],
        createdAt: Number(data.createdAt || 0),
      };
    });
    items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(items));
    return items;
  } catch {
    try {
      const cached = localStorage.getItem(LOCAL_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }
}

interface AdminLinkManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: PortalCustomLink[];
  onLinksChanged: (links: PortalCustomLink[]) => void;
  onTestOpenLink: (targetUrl: string) => void;
}

export function AdminLinkManagerModal({
  isOpen,
  onClose,
  links,
  onLinksChanged,
  onTestOpenLink,
}: AdminLinkManagerModalProps) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [category, setCategory] = useState<PortalLinkCategory>("report");
  const [roles, setRoles] = useState<PortalRole[]>(["gp"]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const toggleRole = (role: PortalRole) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetUrl.trim()) {
      setErrorMsg("దయచేసి Title మరియు e-Panchayat Link తప్పనిసరిగా ఎంటర్ చేయండి.");
      return;
    }
    if (roles.length === 0) {
      setErrorMsg("కనీసం ఒక్క Role (PS / MPO / DPO) అయినా ఎంచుకోండి.");
      return;
    }
    setErrorMsg("");
    setIsSaving(true);
    const newItem: Omit<PortalCustomLink, "id"> = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      targetUrl: targetUrl.trim(),
      category,
      roles,
      createdAt: Date.now(),
    };

    try {
      const ref = await addDoc(collection(db, COLLECTION_NAME), newItem);
      const updated = [{ id: ref.id, ...newItem }, ...links];
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
      onLinksChanged(updated);
      setTitle("");
      setSubtitle("");
      setTargetUrl("");
    } catch {
      const localId = `local_${Date.now()}`;
      const updated = [{ id: localId, ...newItem }, ...links];
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
      onLinksChanged(updated);
      setTitle("");
      setSubtitle("");
      setTargetUrl("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
    onLinksChanged(updated);
    if (!id.startsWith("local_")) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } catch {
        // ignore offline delete error
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={20} className="text-amber-400" />
            <div>
              <h3 className="font-black text-sm sm:text-base">
                Admin Link Manager — Role-Wise Reports & Entries
              </h3>
              <p className="text-[11px] text-slate-300">
                PS (GP), MPO (Mandal), DPO (District) లకు వేర్వేరుగా e-Panchayat లింకులు జోడించండి.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Add Form */}
          <form onSubmit={handleAddLink} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
            <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Plus size={15} className="text-emerald-600" />
              <span>కొత్త Report / Entry లింక్ జోడించండి</span>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Title (పేరు) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ఉదా: GM-R 14.1 బ్యాలెన్స్ నివేదిక"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Subtitle / Note (వివరణ)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="ఉదా: Weekly Thursday Entry"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                e-Panchayat Direct URL / Path *
              </label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://epanchayat.telangana.gov.in/... లేదా /epmis/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">Type:</span>
                <button
                  type="button"
                  onClick={() => setCategory("report")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                    category === "report"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  <FileText size={13} />
                  <span>Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("entry")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                    category === "entry"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  <Edit3 size={13} />
                  <span>Entry</span>
                </button>
              </div>

              {/* Roles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-600">ఎవరికి కనిపించాలి:</span>
                {[
                  { id: "gp" as PortalRole, label: "PS (GP)" },
                  { id: "mandal" as PortalRole, label: "MPO (Mandal)" },
                  { id: "district" as PortalRole, label: "DPO (District)" },
                ].map((r) => (
                  <label
                    key={r.id}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer flex items-center gap-1.5 ${
                      roles.includes(r.id)
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                        : "bg-white border-slate-300 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={roles.includes(r.id)}
                      onChange={() => toggleRole(r.id)}
                      className="accent-emerald-600"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "➕ Save Link to Portal"}
            </button>
          </form>

          {/* Existing Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-black text-slate-700">
              సేవ్ చేసిన లింకులు ({links.length})
            </div>
            {links.length === 0 ? (
              <div className="p-6 text-center rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
                ఇంకా ఎటువంటి Custom Links జోడించలేదు. పై ఫారమ్ ద్వారా జోడించండి.
              </div>
            ) : (
              <div className="space-y-2">
                {links.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            item.category === "entry"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="font-black text-xs text-slate-900 truncate">
                          {item.title}
                        </span>
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-slate-500">{item.subtitle}</div>
                      )}
                      <div className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1">
                        <Link2 size={10} />
                        <span>{item.targetUrl}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.roles.map((r) => (
                          <span
                            key={r}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold"
                          >
                            {r === "gp" ? "PS (GP)" : r === "mandal" ? "MPO" : "DPO"}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onTestOpenLink(item.targetUrl);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink size={12} />
                        <span>Open</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLink(item.id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                        title="Delete Link"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AdminOnlineReportingPanelProps {
  onOpenPortal: () => void;
}

const EP_WORKER_BASE = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ? ""
  : "https://e-vedhika.rakeshkumardhawan123.workers.dev";

interface BrowserTab {
  id: string;
  title: string;
  urlInput: string;
  activeUrl: string;
  history: string[];
  historyIndex: number;
  refreshKey: number;
}

function makeBlankTab(num: number): BrowserTab {
  return {
    id: `tab_${Date.now()}_${num}`,
    title: "New Tab",
    urlInput: "",
    activeUrl: "",
    history: [],
    historyIndex: -1,
    refreshKey: 0,
  };
}

export function AdminOnlineReportingPanel({ onOpenPortal }: AdminOnlineReportingPanelProps) {
  const [links, setLinks] = useState<PortalCustomLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [category, setCategory] = useState<PortalLinkCategory>("report");
  const [roles, setRoles] = useState<PortalRole[]>(["gp"]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | PortalRole>("all");

  // Chrome-Style Multi-Tab Live Browser State (Starts Clean & Empty)
  const [tabs, setTabs] = useState<BrowserTab[]>(() => [makeBlankTab(1)]);
  const [activeTabId, setActiveTabId] = useState<string>(() => "");
  const [browserEngine, setBrowserEngine] = useState<"chrome" | "firefox">("chrome");
  const [newTabSearch, setNewTabSearch] = useState("");
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);

  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    loadCustomPortalLinks().then((res) => {
      setLinks(res);
      setLoading(false);
    });
  }, []);

  const toggleRole = (role: PortalRole) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const resolveFullUrl = (raw: string) => {
    const t = raw.trim();
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    if (t.startsWith("/")) return `https://epanchayat.telangana.gov.in${t}`;
    // If it looks like a domain (has dot, no spaces), open as URL; otherwise run web search!
    if (/^[^\s]+\.[a-z]{2,}(\/.*)?$/i.test(t)) return `https://${t}`;
    return `https://www.bing.com/search?q=${encodeURIComponent(t)}`;
  };

  const getTabLabel = (url: string) => {
    try {
      const u = new URL(url);
      return u.hostname.replace(/^www\./, "");
    } catch {
      return "Page";
    }
  };

  const handleRunInBrowser = (rawUrl: string) => {
    const full = resolveFullUrl(rawUrl);
    if (!full) return;
    setTabs((prev) =>
      prev.map((t) => {
        if (t.id !== currentTab.id) return t;
        const nextHistory = [...t.history.slice(0, t.historyIndex + 1), full];
        return {
          ...t,
          title: getTabLabel(full),
          urlInput: full,
          activeUrl: full,
          history: nextHistory,
          historyIndex: nextHistory.length - 1,
          refreshKey: t.refreshKey + 1,
        };
      })
    );
  };

  const handleGoBack = () => {
    if (currentTab.historyIndex <= 0) return;
    const prevIdx = currentTab.historyIndex - 1;
    const prevUrl = currentTab.history[prevIdx];
    setTabs((prev) =>
      prev.map((t) =>
        t.id === currentTab.id
          ? { ...t, urlInput: prevUrl, activeUrl: prevUrl, title: getTabLabel(prevUrl), historyIndex: prevIdx, refreshKey: t.refreshKey + 1 }
          : t
      )
    );
  };

  const handleGoForward = () => {
    if (currentTab.historyIndex >= currentTab.history.length - 1) return;
    const nextIdx = currentTab.historyIndex + 1;
    const nextUrl = currentTab.history[nextIdx];
    setTabs((prev) =>
      prev.map((t) =>
        t.id === currentTab.id
          ? { ...t, urlInput: nextUrl, activeUrl: nextUrl, title: getTabLabel(nextUrl), historyIndex: nextIdx, refreshKey: t.refreshKey + 1 }
          : t
      )
    );
  };

  const handleGoHome = () => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === currentTab.id ? { ...t, title: "New Tab", urlInput: "", activeUrl: "" } : t
      )
    );
  };

  const handleAddTab = () => {
    const newTab = makeBlankTab(tabs.length + 1);
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      const fresh = makeBlankTab(1);
      setTabs([fresh]);
      setActiveTabId(fresh.id);
      return;
    }
    const idx = tabs.findIndex((t) => t.id === id);
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (currentTab.id === id) {
      const next = remaining[Math.max(0, idx - 1)];
      setActiveTabId(next.id);
    }
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetUrl.trim()) {
      setErrorMsg("దయచేసి Title మరియు e-Panchayat Link తప్పనిసరిగా ఎంటర్ చేయండి.");
      return;
    }
    if (roles.length === 0) {
      setErrorMsg("కనీసం ఒక్క Role (PS / MPO / DPO) అయినా ఎంచుకోండి.");
      return;
    }
    setErrorMsg("");
    setIsSaving(true);

    if (editingId) {
      const updatedItem: PortalCustomLink = {
        id: editingId,
        title: title.trim(),
        subtitle: subtitle.trim(),
        targetUrl: targetUrl.trim(),
        category,
        roles,
        createdAt: Date.now(),
      };
      const updatedList = links.map((l) => (l.id === editingId ? updatedItem : l));
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updatedList));
      setLinks(updatedList);
      if (!editingId.startsWith("local_")) {
        try {
          await updateDoc(doc(db, COLLECTION_NAME, editingId), {
            title: updatedItem.title,
            subtitle: updatedItem.subtitle,
            targetUrl: updatedItem.targetUrl,
            category: updatedItem.category,
            roles: updatedItem.roles,
          });
        } catch {
          // keep local update
        }
      }
      setEditingId(null);
      setTitle("");
      setSubtitle("");
      setTargetUrl("");
      setIsSaving(false);
      return;
    }

    const newItem: Omit<PortalCustomLink, "id"> = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      targetUrl: targetUrl.trim(),
      category,
      roles,
      createdAt: Date.now(),
    };
    try {
      const ref = await addDoc(collection(db, COLLECTION_NAME), newItem);
      const updated = [{ id: ref.id, ...newItem }, ...links];
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
      setLinks(updated);
      setTitle("");
      setSubtitle("");
      setTargetUrl("");
    } catch {
      const localId = `local_${Date.now()}`;
      const updated = [{ id: localId, ...newItem }, ...links];
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
      setLinks(updated);
      setTitle("");
      setSubtitle("");
      setTargetUrl("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartEdit = (item: PortalCustomLink) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSubtitle(item.subtitle || "");
    setTargetUrl(item.targetUrl);
    setCategory(item.category);
    setRoles(item.roles);
    handleRunInBrowser(item.targetUrl);
  };

  const handleDeleteLink = async (id: string) => {
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setSubtitle("");
      setTargetUrl("");
    }
    const updated = links.filter((l) => l.id !== id);
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(updated));
    setLinks(updated);
    if (!id.startsWith("local_")) {
      try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
      } catch {
        // ignore
      }
    }
  };

  const filteredLinks = roleFilter === "all" ? links : links.filter((l) => l.roles.includes(roleFilter));

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <Globe size={22} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black">
              Online Reporting Module — SuperAdmin Live Browser & Link Manager
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              డిపార్ట్‌మెంట్ లాగిన్ అవసరం లేకుండానే ఇక్కడే ఏ లింక్‌నైనా Live Browser లో నడపండి, Edit చేయండి మరియు PS / MPO / DPO లకు Assign చేయండి.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpenPortal}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <ExternalLink size={14} />
          <span>Open User Portal</span>
        </button>
      </div>

      {/* CHROME-STYLE MULTI-TAB LIVE BROWSER (No Departmental Login Required) */}
      <div
        className={
          isBrowserFullscreen
            ? "fixed inset-0 z-50 bg-white flex flex-col overflow-hidden"
            : "bg-white border border-slate-300 rounded-3xl shadow-md overflow-hidden w-full"
        }
      >
        {/* Top Tab Strip (Chrome style) */}
        <div className="bg-slate-950 px-3 pt-2.5 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === currentTab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-t-xl text-xs font-bold cursor-pointer max-w-[200px] shrink-0 transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900/70 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Globe size={12} className={isActive ? "text-emerald-400 shrink-0" : "text-slate-500 shrink-0"} />
                <span className="truncate">{tab.title}</span>
                <button
                  type="button"
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  title="Close Tab"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={handleAddTab}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1 shrink-0"
            title="New Tab"
          >
            <Plus size={15} />
          </button>

          {/* Browser Engine Mode + Saved Links Dropdown */}
          <div className="ml-auto flex items-center gap-2 pb-1.5 pl-3 shrink-0">
            <select
              value={browserEngine}
              onChange={(e) => setBrowserEngine(e.target.value as "chrome" | "firefox")}
              className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-amber-300 outline-none cursor-pointer"
              title="Browser Mode"
            >
              <option value="chrome">🌐 Chrome Mode</option>
              <option value="firefox">🦊 Mozilla Firefox Mode</option>
            </select>
            <select
              value={currentTab.activeUrl}
              onChange={(e) => {
                if (e.target.value) handleRunInBrowser(e.target.value);
              }}
              className="w-44 sm:w-64 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-white outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="">-- Saved Links ({links.length}) --</option>
              {links.map((l) => (
                <option key={l.id} value={resolveFullUrl(l.targetUrl)}>
                  [{l.category.toUpperCase()}] {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation + Address Bar (Chrome style) */}
        <div className="bg-slate-800 px-3 py-2 flex flex-wrap items-center gap-2 border-b border-slate-700">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={currentTab.historyIndex <= 0}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
              title="Back"
            >
              <ArrowLeft size={15} />
            </button>
            <button
              type="button"
              onClick={handleGoForward}
              disabled={currentTab.historyIndex >= currentTab.history.length - 1}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
              title="Forward"
            >
              <ArrowRight size={15} />
            </button>
            <button
              type="button"
              onClick={() =>
                setTabs((prev) =>
                  prev.map((t) => (t.id === currentTab.id ? { ...t, refreshKey: t.refreshKey + 1 } : t))
                )
              }
              disabled={!currentTab.activeUrl}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 disabled:opacity-30 cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
            <button
              type="button"
              onClick={handleGoHome}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-200 cursor-pointer"
              title="New Tab / Home"
            >
              <Home size={14} />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRunInBrowser(currentTab.urlInput);
            }}
            className="flex-1 flex items-center gap-2 min-w-[200px]"
          >
            <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 focus-within:border-emerald-400">
              <Lock size={12} className="text-emerald-400 shrink-0" />
              <input
                type="text"
                value={currentTab.urlInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setTabs((prev) =>
                    prev.map((t) => (t.id === currentTab.id ? { ...t, urlInput: val } : t))
                  );
                }}
                placeholder="Search or enter any URL (e.g. https://...)"
                className="w-full bg-transparent text-xs font-mono text-emerald-200 placeholder-slate-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Play size={12} />
              <span>Go</span>
            </button>
          </form>

          <button
            type="button"
            onClick={() => setIsBrowserFullscreen((f) => !f)}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 cursor-pointer shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5"
            title={isBrowserFullscreen ? "Exit Fullscreen" : "Full Screen"}
          >
            {isBrowserFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span className="hidden sm:inline">{isBrowserFullscreen ? "Exit" : "Full Screen"}</span>
          </button>

          {currentTab.activeUrl && (
            <a
              href={currentTab.activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 shrink-0"
              title="Open in External Browser Tab"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {/* Viewport */}
        {currentTab.activeUrl ? (
          <div className={isBrowserFullscreen ? "flex-1 w-full overflow-auto bg-white" : "w-full overflow-auto bg-white"}>
            <iframe
              key={`${currentTab.id}-${currentTab.activeUrl}-${currentTab.refreshKey}-${browserEngine}`}
              src={`${EP_WORKER_BASE}/api/epanchayat/browse?url=${encodeURIComponent(currentTab.activeUrl)}&ua=${browserEngine}`}
              title="SuperAdmin Live Browser"
              className={isBrowserFullscreen ? "w-full h-full min-w-full border-0 bg-white block" : "w-full h-[78vh] min-w-full border-0 bg-white block"}
            />
          </div>
        ) : (
          <div className="h-[52vh] flex flex-col items-center justify-center text-center p-6 bg-white text-slate-700 space-y-5">
            <div className="space-y-1">
              <div className="text-3xl font-black tracking-tight">
                <span className="text-blue-600">E</span>
                <span className="text-rose-500">-</span>
                <span className="text-amber-500">B</span>
                <span className="text-blue-600">r</span>
                <span className="text-emerald-600">o</span>
                <span className="text-rose-500">w</span>
                <span className="text-blue-600">s</span>
                <span className="text-emerald-600">e</span>
                <span className="text-amber-500">r</span>
              </div>
              <div className="text-[11px] font-bold text-slate-400">
                {browserEngine === "chrome" ? "Chrome Mode" : "Mozilla Firefox Mode"} • Direct Search & URL Runner
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newTabSearch.trim()) {
                  handleRunInBrowser(newTabSearch);
                  setNewTabSearch("");
                }
              }}
              className="w-full max-w-lg flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 shadow-sm hover:shadow-md focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 bg-white transition-all"
            >
              <Globe size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={newTabSearch}
                onChange={(e) => setNewTabSearch(e.target.value)}
                placeholder="Search web or type a URL..."
                className="flex-1 text-sm text-slate-800 outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black cursor-pointer shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <a
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
              >
                <span>Open Google.com</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Link Card */}
      <form onSubmit={handleSaveLink} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-black text-slate-900 flex items-center gap-2">
            {editingId ? <Pencil size={16} className="text-amber-600" /> : <Plus size={16} className="text-emerald-600" />}
            <span>{editingId ? "లింక్ Edit చేయండి" : "కొత్త e-Panchayat Report / Entry లింక్ జోడించండి"}</span>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle("");
                setSubtitle("");
                setTargetUrl("");
              }}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title (పేరు) *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ఉదా: GM-R 14.1 బ్యాలెన్స్ నివేదిక"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Note (వివరణ)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="ఉదా: Thursday Weekly Balance Entry"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">e-Panchayat Direct URL / Path *</label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://epanchayat.telangana.gov.in/... లేదా /epmis/..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Type:</span>
            <button
              type="button"
              onClick={() => setCategory("report")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                category === "report"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-50 text-slate-700 border-slate-300"
              }`}
            >
              <FileText size={14} />
              <span>Report</span>
            </button>
            <button
              type="button"
              onClick={() => setCategory("entry")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
                category === "entry"
                  ? "bg-amber-600 text-white border-amber-600"
                  : "bg-slate-50 text-slate-700 border-slate-300"
              }`}
            >
              <Edit3 size={14} />
              <span>Entry</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600">ఎవరికి ఇవ్వాలి:</span>
            {[
              { id: "gp" as PortalRole, label: "PS (GP)" },
              { id: "mandal" as PortalRole, label: "MPO (Mandal)" },
              { id: "district" as PortalRole, label: "DPO (District)" },
            ].map((r) => (
              <label
                key={r.id}
                className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer flex items-center gap-1.5 ${
                  roles.includes(r.id)
                    ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                    : "bg-slate-50 border-slate-300 text-slate-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={roles.includes(r.id)}
                  onChange={() => toggleRole(r.id)}
                  className="accent-emerald-600"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer disabled:opacity-60"
        >
          {isSaving ? "Saving..." : editingId ? "💾 Update Link" : "➕ Save Link to Portal"}
        </button>
      </form>

      {/* Saved Links List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-black text-slate-900">
            సేవ్ చేసిన లింకులు ({filteredLinks.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "gp", label: "PS (GP)" },
              { id: "mandal", label: "MPO" },
              { id: "district", label: "DPO" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setRoleFilter(f.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer border ${
                  roleFilter === f.id
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-xs text-slate-500">Loading saved links...</div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 text-xs text-slate-500">
            ఈ విభాగంలో ఇంకా లింకులు లేవు. పై ఫారమ్ ద్వారా PS / MPO / DPO లకు లింకులు జోడించండి.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredLinks.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        item.category === "entry"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="font-black text-xs text-slate-900 truncate">{item.title}</span>
                  </div>
                  {item.subtitle && <div className="text-[11px] text-slate-500">{item.subtitle}</div>}
                  <div className="text-[10px] font-mono text-slate-400 truncate flex items-center gap-1">
                    <Link2 size={10} />
                    <span>{item.targetUrl}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.roles.map((r) => (
                      <span
                        key={r}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold"
                      >
                        {r === "gp" ? "PS (GP)" : r === "mandal" ? "MPO" : "DPO"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleRunInBrowser(item.targetUrl)}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                    title="Run in Live Browser"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer"
                    title="Edit Link"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteLink(item.id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    title="Delete Link"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
