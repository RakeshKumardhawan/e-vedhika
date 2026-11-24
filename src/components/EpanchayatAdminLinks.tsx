import React, { useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Trash2, Link2, X, ExternalLink, ShieldCheck, FileText, Edit3 } from "lucide-react";

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
