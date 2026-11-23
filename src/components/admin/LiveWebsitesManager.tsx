import React, { useState, useEffect } from "react";
import {
  Globe,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

export interface LiveWebsiteItem {
  id: string;
  name: string;
  url: string;
  category?: string;
  badge?: string;
  colorTheme?: "emerald" | "blue" | "purple" | "amber" | "cyan" | "rose";
  active: boolean;
  order?: number;
  notes?: string;
}

export const DEFAULT_LIVE_WEBSITES: LiveWebsiteItem[] = [
  {
    id: "dharani",
    name: "ధరణి (Dharani)",
    url: "https://dharani.telangana.gov.in",
    category: "Revenue & Land",
    badge: "Live",
    colorTheme: "emerald",
    active: true,
    order: 1,
    notes: "తెలంగాణ సమగ్ర భూ రికార్డుల నిర్వహణ పోర్టల్"
  },
  {
    id: "tg_prrd",
    name: "TG-PRRD (ఈ-పంచాయతీ)",
    url: "https://epanchayat.telangana.gov.in",
    category: "Panchayat Raj",
    badge: "Live",
    colorTheme: "blue",
    active: true,
    order: 2,
    notes: "తెలంగాణ పంచాయతీరాజ్ మరియు గ్రామీణాభివృద్ధి అధికారిక పోర్టల్"
  },
  {
    id: "ubd_mis",
    name: "UBD MIS (జనన/మరణ)",
    url: "https://ubd.telangana.gov.in",
    category: "Civil Registration",
    badge: "Live",
    colorTheme: "cyan",
    active: true,
    order: 3,
    notes: "తెలంగాణ అర్బన్ & రూరల్ బర్త్ & డెత్ రిజిస్ట్రేషన్ పోర్టల్"
  },
  {
    id: "meeseva",
    name: "MeeSeva 2.0",
    url: "https://ts.meeseva.telangana.gov.in",
    category: "Citizen Services",
    badge: "Live",
    colorTheme: "purple",
    active: true,
    order: 4,
    notes: "తెలంగాణ పౌర సేవల పోర్టల్"
  },
  {
    id: "treasury_cfms",
    name: "IFMIS / Treasury",
    url: "https://ifmis.telangana.gov.in",
    category: "Finance & Accounts",
    badge: "Live",
    colorTheme: "amber",
    active: true,
    order: 5,
    notes: "ట్రెజరీ మరియు ఉద్యోగుల పే స్లిప్స్ / బిల్స్ పోర్టల్"
  }
];

const PRESET_GOVT_PORTALS: Omit<LiveWebsiteItem, "id" | "order" | "active">[] = [
  {
    name: "ధరణి (Dharani)",
    url: "https://dharani.telangana.gov.in",
    category: "Revenue",
    badge: "Govt",
    colorTheme: "emerald",
    notes: "Land & Mutation Services"
  },
  {
    name: "TG-PRRD (ఈ-పంచాయతీ)",
    url: "https://epanchayat.telangana.gov.in",
    category: "Panchayat",
    badge: "PRRD",
    colorTheme: "blue",
    notes: "Panchayat Raj Portal"
  },
  {
    name: "UBD MIS (జనన/మరణ)",
    url: "https://ubd.telangana.gov.in",
    category: "Birth & Death",
    badge: "Live",
    colorTheme: "cyan",
    notes: "UBD MIS Registration"
  },
  {
    name: "మీసేవ (MeeSeva 2.0)",
    url: "https://ts.meeseva.telangana.gov.in",
    category: "Citizen",
    badge: "Portal",
    colorTheme: "purple",
    notes: "All Citizen Services"
  },
  {
    name: "IFMIS తెలంగాణ",
    url: "https://ifmis.telangana.gov.in",
    category: "Finance",
    badge: "Govt",
    colorTheme: "amber",
    notes: "Salary & Treasury Slips"
  },
  {
    name: "ఈ-గ్రామస్వరాజ్ (eGramSwaraj)",
    url: "https://egramswaraj.gov.in",
    category: "Panchayat",
    badge: "National",
    colorTheme: "emerald",
    notes: "GPDP & Work Accounts"
  },
  {
    name: "CFMS ఆంధ్రప్రదేశ్",
    url: "https://cfms.ap.gov.in",
    category: "Finance",
    badge: "AP Govt",
    colorTheme: "blue",
    notes: "AP Comprehensive Financial Management"
  },
  {
    name: "PFMS పోర్టల్",
    url: "https://pfms.nic.in",
    category: "Finance",
    badge: "NIC",
    colorTheme: "purple",
    notes: "Public Financial Management System"
  }
];

interface LiveWebsitesManagerProps {
  user?: any;
  addToast?: (msg: string, type?: "success" | "error" | "info") => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function LiveWebsitesManager({
  user,
  addToast,
  onClose,
  isModal = false
}: LiveWebsitesManagerProps) {
  const [websites, setWebsites] = useState<LiveWebsiteItem[]>(DEFAULT_LIVE_WEBSITES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<Partial<LiveWebsiteItem>>({
    name: "",
    url: "https://",
    category: "Panchayat",
    badge: "Live",
    colorTheme: "emerald",
    active: true,
    notes: ""
  });
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Real-time synchronization with Firestore
  useEffect(() => {
    let unsub = () => {};
    try {
      if (db) {
        unsub = onSnapshot(
          doc(db, "site_settings", "live_websites"),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (Array.isArray(data.websites) && data.websites.length > 0) {
                const sorted = [...data.websites].sort(
                  (a, b) => (a.order || 0) - (b.order || 0)
                );
                setWebsites(sorted);
              } else {
                setWebsites(DEFAULT_LIVE_WEBSITES);
              }
            } else {
              setWebsites(DEFAULT_LIVE_WEBSITES);
            }
            setLoading(false);
          },
          (err) => {
            console.warn("Firestore live_websites snapshot error, using defaults:", err);
            setWebsites(DEFAULT_LIVE_WEBSITES);
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.warn("Failed to attach live_websites listener:", e);
      setLoading(false);
    }
    return () => unsub();
  }, []);

  // Save changes to Firestore
  const saveToFirestore = async (newWebsites: LiveWebsiteItem[]) => {
    setSaving(true);
    try {
      if (db) {
        await setDoc(
          doc(db, "site_settings", "live_websites"),
          {
            websites: newWebsites,
            updatedAt: Date.now(),
            updatedBy: user?.email || user?.uid || "admin"
          },
          { merge: true }
        );
      }
      setWebsites(newWebsites);
      if (addToast) addToast("లైవ్ వెబ్సైట్లు విజయవంతంగా సేవ్ అయ్యాయి!", "success");
    } catch (err: any) {
      console.error("Failed to save live websites:", err);
      if (addToast) addToast("సేవ్ చేయడంలో లోపం: " + err.message, "error");
      Swal.fire({
        icon: "error",
        title: "Error Saving",
        text: err.message || "Failed to update Firestore"
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (id: string) => {
    const updated = websites.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    await saveToFirestore(updated);
  };

  // Move order Up
  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const list = [...websites];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    await saveToFirestore(reordered);
  };

  // Move order Down
  const handleMoveDown = async (index: number) => {
    if (index === websites.length - 1) return;
    const list = [...websites];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    await saveToFirestore(reordered);
  };

  // Start Editing
  const handleStartEdit = (item: LiveWebsiteItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      url: item.url,
      category: item.category || "Panchayat",
      badge: item.badge || "Live",
      colorTheme: item.colorTheme || "emerald",
      active: item.active,
      notes: item.notes || ""
    });
    setIsFormOpen(true);
  };

  // Delete Website
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "డిలీట్ చేయాలా?",
      text: `'${name}' వెబ్‌సైట్ లింకును తొలగించాలనుకుంటున్నారా?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "అవును, తొలగించు",
      cancelButtonText: "రద్దు"
    });

    if (result.isConfirmed) {
      const updated = websites.filter((item) => item.id !== id);
      await saveToFirestore(updated);
      Swal.fire({
        icon: "success",
        title: "తొలగించబడింది!",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    const result = await Swal.fire({
      title: "డీఫాల్ట్ పోర్టల్స్‌కు రీసెట్ చేయాలా?",
      text: "ఇది మీ ప్రస్తుత లింకులను అధికారిక ప్రభుత్వ పోర్టల్స్ డీఫాల్ట్ లిస్టుతో రీప్లేస్ చేస్తుంది.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",
      confirmButtonText: "అవును, రీసెట్ చేయి",
      cancelButtonText: "వద్దు"
    });

    if (result.isConfirmed) {
      await saveToFirestore(DEFAULT_LIVE_WEBSITES);
      Swal.fire({
        icon: "success",
        title: "రీసెట్ చేయబడింది!",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Add Preset Portal
  const handleAddPreset = async (preset: typeof PRESET_GOVT_PORTALS[0]) => {
    const exists = websites.some(
      (w) => w.url.toLowerCase() === preset.url.toLowerCase()
    );
    if (exists) {
      if (addToast) addToast("ఈ వెబ్‌సైట్ ఇప్పటికే లిస్టులో ఉంది!", "info");
      return;
    }

    const newItem: LiveWebsiteItem = {
      id: "portal_" + Date.now(),
      name: preset.name,
      url: preset.url,
      category: preset.category,
      badge: preset.badge,
      colorTheme: preset.colorTheme,
      active: true,
      order: websites.length + 1,
      notes: preset.notes
    };

    const updated = [...websites, newItem];
    await saveToFirestore(updated);
  };

  // Save or Update from Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.url?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "వివరాలు తప్పనిసరి",
        text: "దయచేసి వెబ్‌సైట్ పేరు మరియు URL నమోదు చేయండి."
      });
      return;
    }

    let formattedUrl = formData.url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("/")) {
      formattedUrl = "https://" + formattedUrl;
    }

    let updatedList: LiveWebsiteItem[];
    if (editingId) {
      updatedList = websites.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: formData.name!.trim(),
              url: formattedUrl,
              category: formData.category || "Panchayat",
              badge: formData.badge || "Live",
              colorTheme: formData.colorTheme || "emerald",
              active: formData.active ?? true,
              notes: formData.notes?.trim() || ""
            }
          : item
      );
    } else {
      const newItem: LiveWebsiteItem = {
        id: "site_" + Date.now(),
        name: formData.name!.trim(),
        url: formattedUrl,
        category: formData.category || "Panchayat",
        badge: formData.badge || "Live",
        colorTheme: formData.colorTheme || "emerald",
        active: formData.active ?? true,
        order: websites.length + 1,
        notes: formData.notes?.trim() || ""
      };
      updatedList = [...websites, newItem];
    }

    await saveToFirestore(updatedList);
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      url: "https://",
      category: "Panchayat",
      badge: "Live",
      colorTheme: "emerald",
      active: true,
      notes: ""
    });
  };

  const filteredWebsites = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.category && w.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`space-y-6 ${isModal ? "p-4 sm:p-6" : "p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs"}`}>
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#041029] via-[#092244] to-[#04122e] text-white border border-amber-400/25 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              REAL-TIME FIRESTORE SYNC
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
              <Globe className="text-amber-400" size={24} />
              లైవ్ వెబ్సైటుల నిర్వహణ (Hero Live Websites Manager)
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium mt-1">
              హోమ్‌పేజీ రాయల్ కార్డ్‌లోని <span className="text-amber-300 font-bold">"🏛️ All Problems One Solution"</span> పక్కన కనిపించే అధికారిక లైవ్ వెబ్‌సైట్ లింకులు.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} /> డీఫాల్ట్స్ రీసెట్
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  url: "https://",
                  category: "Panchayat",
                  badge: "Live",
                  colorTheme: "emerald",
                  active: true,
                  notes: ""
                });
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus size={15} /> కొత్త వెబ్‌సైట్ జోడించు
            </button>
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Hero Preview Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#030d22] via-[#08183a] to-[#040f26] border border-amber-400/20 text-white shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-400" />
            లైవ్ ప్రివ్యూ (Home Page Hero Card Preview):
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            యాక్టివ్‌గా ఉన్నవి మాత్రమే హోమ్‌పేజీలో కనిపిస్తాయి
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/25 text-blue-200">
            <ShieldCheck size={12} className="text-cyan-400" />
            Official Verified Portal
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/25 text-purple-200">
            ⚡ 17-Step Auto Configuration
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/25 text-emerald-200">
            🏛️ All Problems One Solution
          </span>

          {/* Active Live Websites Preview */}
          {websites.filter((w) => w.active).length === 0 ? (
            <span className="text-[10px] text-slate-400 italic">
              (ప్రస్తుతం ఏ లైవ్ వెబ్‌సైట్‌లు ఆన్‌లో లేవు. క్రింద ఆన్ చేయండి)
            </span>
          ) : (
            websites
              .filter((w) => w.active)
              .map((site) => (
                <span
                  key={site.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/35 text-emerald-200 font-bold shadow-xs animate-in fade-in duration-300"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>{site.name}</span>
                  <ExternalLink size={10} className="text-emerald-400/80 shrink-0" />
                </span>
              ))
          )}
        </div>
      </div>

      {/* Quick Add Preset Government Portals */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            🏛️ ముఖ్యమైన ప్రభుత్వ పోర్టల్స్ (1-క్లిక్ క్విక్ యాడ్):
          </span>
          <span className="text-[10px] text-slate-500">క్లిక్ చేసి డైరెక్ట్‌గా జోడించండి</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_GOVT_PORTALS.map((preset, idx) => {
            const alreadyAdded = websites.some(
              (w) => w.url.toLowerCase() === preset.url.toLowerCase()
            );
            return (
              <button
                key={idx}
                type="button"
                disabled={alreadyAdded}
                onClick={() => handleAddPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  alreadyAdded
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                    : "bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 shadow-xs active:scale-95"
                }`}
              >
                {alreadyAdded ? (
                  <CheckCircle2 size={13} className="text-emerald-600" />
                ) : (
                  <Plus size={13} className="text-emerald-600" />
                )}
                <span>{preset.name}</span>
                {alreadyAdded && <span className="text-[9px] text-slate-400">(జోడించబడింది)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Form Modal or Inline */}
      {isFormOpen && (
        <div className="p-5 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 rounded-2xl border-2 border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
              {editingId ? <Edit3 size={16} className="text-indigo-600" /> : <Plus size={16} className="text-emerald-600" />}
              {editingId ? "వెబ్‌సైట్ వివరాలను సవరించండి" : "కొత్త లైవ్ వెబ్‌సైట్‌ను జోడించండి"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setEditingId(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  వెబ్‌సైట్ / పోర్టల్ పేరు (Display Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ఉదా: ధరణి (Dharani)"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  వెబ్‌సైట్ URL లింక్ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://dharani.telangana.gov.in"
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  విభాగం / కేటగిరీ (Category)
                </label>
                <input
                  type="text"
                  placeholder="ఉదా: Revenue, Panchayat, Citizen"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  బ్యాడ్జ్ లేబుల్ (Badge Text)
                </label>
                <input
                  type="text"
                  placeholder="ఉదా: Live, Official, Govt"
                  value={formData.badge || ""}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                వివరణ / నోట్స్ (Description / Tooltip)
              </label>
              <input
                type="text"
                placeholder="పోర్టల్ సంబంధిత ముఖ్యమైన సమాచారం..."
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={formData.active ?? true}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>హోమ్‌పేజీలో వెంటనే ప్రదర్శించు (Active on Hero)</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer transition-all"
                >
                  రద్దు
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-60"
                >
                  <Save size={14} />
                  {saving ? "సేవ్ అవుతోంది..." : "సేవ్ చేయి"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="వెబ్‌సైట్ పేరు లేదా లింక్ వెతకండి..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          మొత్తం: <span className="text-slate-900 font-black">{websites.length}</span> వెబ్‌సైట్లు | యాక్టివ్:{" "}
          <span className="text-emerald-600 font-black">{websites.filter((w) => w.active).length}</span>
        </div>
      </div>

      {/* Websites List Table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 grid grid-cols-12 gap-2 text-[11px] font-black uppercase tracking-wider text-slate-600">
          <div className="col-span-1 text-center">ఆర్డర్</div>
          <div className="col-span-4">వెబ్‌సైట్ పేరు & విభాగం</div>
          <div className="col-span-4">URL లింక్</div>
          <div className="col-span-1 text-center">స్టేటస్</div>
          <div className="col-span-2 text-right pr-2">చర్యలు</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 font-bold text-xs">
            వెబ్‌సైట్లు లోడ్ అవుతున్నాయి...
          </div>
        ) : filteredWebsites.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <AlertCircle size={28} className="mx-auto text-slate-300" />
            <p className="text-xs font-bold">ఎటువంటి వెబ్‌సైట్లు కనుగొనబడలేదు.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white">
            {filteredWebsites.map((item, index) => (
              <div
                key={item.id}
                className={`px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50/80 transition-colors ${
                  !item.active ? "opacity-60 bg-slate-50/40" : ""
                }`}
              >
                {/* Order Up / Down */}
                <div className="col-span-1 flex items-center justify-center gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 cursor-pointer rounded"
                    title="పైకి జరుపు"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    disabled={index === filteredWebsites.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 cursor-pointer rounded"
                    title="క్రిందికి జరుపు"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                {/* Name & Category */}
                <div className="col-span-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                      }`}
                    />
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.category && (
                    <span className="text-[10px] text-slate-500 font-medium pl-4 block truncate">
                      {item.category} {item.notes ? `• ${item.notes}` : ""}
                    </span>
                  )}
                </div>

                {/* URL */}
                <div className="col-span-4 min-w-0 flex items-center gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-indigo-600 hover:text-indigo-800 hover:underline truncate"
                    title={item.url}
                  >
                    {item.url}
                  </a>
                  <ExternalLink size={11} className="text-slate-400 shrink-0" />
                </div>

                {/* Status Switch */}
                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                      item.active
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    {item.active ? "ఆన్" : "ఆఫ్"}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1.5 pr-1">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="సవరించు"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="తొలగించు"
                  >
                    <Trash2 size={15} />
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
