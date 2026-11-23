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
  AlertCircle,
  Activity,
  RefreshCw,
  Settings,
  Building,
  MessageSquare,
  FileText,
  Download,
  Target,
  Megaphone,
  Wheat,
  HardDrive,
  LayoutList,
  Sliders,
  Zap
} from "lucide-react";
import Swal from "sweetalert2";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

// ==========================================
// 1. Live Websites Types & Defaults
// ==========================================
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
  // Health & Server Status (Online / Down)
  healthStatus?: "online" | "offline" | "slow" | "checking";
  latencyMs?: number;
  lastChecked?: string;
  manualOverrideDown?: boolean; // Admin can force mark a portal as down for maintenance
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
    notes: "తెలంగాణ సమగ్ర భూ రికార్డుల నిర్వహణ పోర్టల్",
    healthStatus: "online"
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
    notes: "తెలంగాణ పంచాయతీరాజ్ మరియు గ్రామీణాభివృద్ధి అధికారిక పోర్టల్",
    healthStatus: "online"
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
    notes: "తెలంగాణ అర్బన్ & రూరల్ బర్త్ & డెత్ రిజిస్ట్రేషన్ పోర్టల్",
    healthStatus: "online"
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
    notes: "తెలంగాణ పౌర సేవల పోర్టల్",
    healthStatus: "online"
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
    notes: "ట్రెజరీ మరియు ఉద్యోగుల పే స్లిప్స్ / బిల్స్ పోర్టల్",
    healthStatus: "online"
  }
];

export const PRESET_GOVT_PORTALS: Omit<LiveWebsiteItem, "id" | "order" | "active">[] = [
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

// ==========================================
// 2. Hero Quick Feature Buttons Types & Defaults
// ==========================================
export interface HeroFeatureButton {
  id: string;
  title: string;
  subtitle: string;
  target: string;
  tabId?: string;
  iconName: string;
  colorTheme: string;
  active: boolean;
  order: number;
}

export const DEFAULT_HERO_FEATURES: HeroFeatureButton[] = [
  {
    id: "ubd_settings",
    title: "UBD Settings & DSK",
    subtitle: "లైవ్ రికార్డ్స్ & ట్రాకర్",
    target: "/ubd_tracker",
    tabId: "ubd_tracker",
    iconName: "Settings",
    colorTheme: "cyan",
    active: true,
    order: 1
  },
  {
    id: "mana_panchayath",
    title: "Mana Panchayath",
    subtitle: "డిజిటల్ వర్క్‌స్పేస్",
    target: "/workspace",
    tabId: "workspace",
    iconName: "Building",
    colorTheme: "indigo",
    active: true,
    order: 2
  },
  {
    id: "public_feedback",
    title: "Public Feedback",
    subtitle: "సలహాలు & సూచనలు",
    target: "/suggestions",
    tabId: "suggestions",
    iconName: "MessageSquare",
    colorTheme: "pink",
    active: true,
    order: 3
  },
  {
    id: "gos_formats",
    title: "GOs & Formats",
    subtitle: "అధికారిక జీవోలు",
    target: "/gos_formats",
    tabId: "gos_formats",
    iconName: "FileText",
    colorTheme: "amber",
    active: true,
    order: 4
  },
  {
    id: "software_hub",
    title: "Software Hub",
    subtitle: "టోకెన్ డ్రైవర్లు & టూల్స్",
    target: "/software_hub",
    tabId: "software_hub",
    iconName: "Download",
    colorTheme: "purple",
    active: true,
    order: 5
  },
  {
    id: "online_portal",
    title: "Online portal at your line",
    subtitle: "త్వరలో ప్రారంభం (Soon)",
    target: "/online_portal",
    tabId: "online_portal",
    iconName: "Globe",
    colorTheme: "amber",
    active: true,
    order: 6
  }
];

export const AVAILABLE_ICONS = [
  { name: "Globe", label: "Globe (గ్లోబ్)" },
  { name: "Settings", label: "Settings (సెట్టింగ్స్)" },
  { name: "Building", label: "Building (పంచాయతీ)" },
  { name: "MessageSquare", label: "Message (ఫీడ్‌బ్యాక్)" },
  { name: "FileText", label: "FileText (ఫార్మాట్స్)" },
  { name: "Download", label: "Download (డౌన్‌లోడ్స్)" },
  { name: "Target", label: "Target (ప్రాధాన్యత)" },
  { name: "Wheat", label: "Wheat (రైతు రిజిస్ట్రీ)" },
  { name: "HardDrive", label: "HardDrive (సాఫ్ట్‌వేర్)" },
  { name: "Sparkles", label: "Sparkles (స్పెషల్)" }
];

export const AVAILABLE_THEMES = [
  { id: "emerald", label: "Emerald Green (ఆకుపచ్చ)", border: "border-emerald-500/30", text: "text-emerald-300" },
  { id: "cyan", label: "Cyan Blue (నీలం)", border: "border-cyan-500/30", text: "text-cyan-300" },
  { id: "indigo", label: "Royal Indigo (ఇండిగో)", border: "border-indigo-500/30", text: "text-indigo-300" },
  { id: "amber", label: "Gold Amber (బంగారు/ఎల్లో)", border: "border-amber-500/30", text: "text-amber-300" },
  { id: "purple", label: "Royal Purple (పర్పుల్)", border: "border-purple-500/30", text: "text-purple-300" },
  { id: "pink", label: "Rose Pink (గులాబీ)", border: "border-pink-500/30", text: "text-pink-300" }
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
  // Navigation Tabs: 0 = Live Websites & Down Monitor, 1 = Hero 6 Feature Buttons
  const [activeAdminTab, setActiveAdminTab] = useState<"websites" | "features">("websites");

  // 1. Live Websites State
  const [websites, setWebsites] = useState<LiveWebsiteItem[]>(DEFAULT_LIVE_WEBSITES);
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null);
  const [isWebsiteFormOpen, setIsWebsiteFormOpen] = useState(false);
  const [websiteFormData, setWebsiteFormData] = useState<Partial<LiveWebsiteItem>>({
    name: "",
    url: "https://",
    category: "Panchayat",
    badge: "Live",
    colorTheme: "emerald",
    active: true,
    notes: ""
  });

  // 2. Hero Feature Buttons State
  const [heroFeatures, setHeroFeatures] = useState<HeroFeatureButton[]>(DEFAULT_HERO_FEATURES);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [isFeatureFormOpen, setIsFeatureFormOpen] = useState(false);
  const [featureFormData, setFeatureFormData] = useState<Partial<HeroFeatureButton>>({
    title: "",
    subtitle: "",
    target: "/",
    tabId: "home",
    iconName: "Globe",
    colorTheme: "amber",
    active: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Sync Live Websites and Hero Features from Firestore
  useEffect(() => {
    let unsubWebsites = () => {};
    let unsubFeatures = () => {};

    try {
      if (db) {
        // Websites listener
        unsubWebsites = onSnapshot(
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
          () => {
            setWebsites(DEFAULT_LIVE_WEBSITES);
            setLoading(false);
          }
        );

        // Hero Features listener
        unsubFeatures = onSnapshot(
          doc(db, "site_settings", "hero_features"),
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (Array.isArray(data.features) && data.features.length > 0) {
                const sorted = [...data.features].sort(
                  (a, b) => (a.order || 0) - (b.order || 0)
                );
                setHeroFeatures(sorted);
              } else {
                setHeroFeatures(DEFAULT_HERO_FEATURES);
              }
            } else {
              setHeroFeatures(DEFAULT_HERO_FEATURES);
            }
          },
          () => {
            setHeroFeatures(DEFAULT_HERO_FEATURES);
          }
        );
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }

    return () => {
      unsubWebsites();
      unsubFeatures();
    };
  }, []);

  // Save Websites to Firestore
  const saveWebsitesToFirestore = async (newWebsites: LiveWebsiteItem[]) => {
    setSaving(true);
    try {
      if (db) {
        await setDoc(
          doc(db, "site_settings", "live_websites"),
          {
            websites: newWebsites,
            updatedAt: Date.now(),
            updatedBy: user?.email || "admin"
          },
          { merge: true }
        );
      }
      setWebsites(newWebsites);
      if (addToast) addToast("లైవ్ వెబ్‌సైట్లు విజయవంతంగా సేవ్ అయ్యాయి!", "success");
    } catch (err: any) {
      if (addToast) addToast("సేవ్ చేయడంలో లోపం: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Save Hero Features to Firestore
  const saveFeaturesToFirestore = async (newFeatures: HeroFeatureButton[]) => {
    setSaving(true);
    try {
      if (db) {
        await setDoc(
          doc(db, "site_settings", "hero_features"),
          {
            features: newFeatures,
            updatedAt: Date.now(),
            updatedBy: user?.email || "admin"
          },
          { merge: true }
        );
      }
      setHeroFeatures(newFeatures);
      if (addToast) addToast("హోమ్‌పేజ్ ఫీచర్లు విజయవంతంగా సేవ్ అయ్యాయి!", "success");
    } catch (err: any) {
      if (addToast) addToast("సేవ్ చేయడంలో లోపం: " + err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Run Automated Server Health Check
  const runLiveHealthCheck = async () => {
    setCheckingHealth(true);
    try {
      const payload = {
        portals: websites.map((w) => ({
          id: w.id,
          name: w.name,
          url: w.url
        }))
      };

      const res = await fetch("/api/portals/check-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results)) {
          const updated = websites.map((site) => {
            const match = data.results.find((r: any) => r.id === site.id);
            if (match) {
              return {
                ...site,
                healthStatus: site.manualOverrideDown ? "offline" : match.status,
                latencyMs: match.latencyMs,
                lastChecked: match.lastChecked || new Date().toLocaleTimeString("en-IN")
              };
            }
            return site;
          });
          await saveWebsitesToFirestore(updated);
          if (addToast) addToast("లైవ్ హెల్త్ చెక్ విజయవంతంగా పూర్తయింది!", "success");
        }
      } else {
        if (addToast) addToast("సర్వర్ రెస్పాన్స్ కోడ్: " + res.status, "info");
      }
    } catch (err) {
      console.warn("Batch health check failed:", err);
      if (addToast) addToast("ఆటో హెల్త్ చెక్ పూర్తి చేయలేకపోయాము.", "error");
    } finally {
      setCheckingHealth(false);
    }
  };

  // Toggle Website Active Status
  const handleToggleWebsiteActive = async (id: string) => {
    const updated = websites.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    await saveWebsitesToFirestore(updated);
  };

  // Toggle Manual Down Override (e.g. for maintenance)
  const handleToggleManualDown = async (id: string) => {
    const updated = websites.map((item) => {
      if (item.id === id) {
        const isOverride = !item.manualOverrideDown;
        return {
          ...item,
          manualOverrideDown: isOverride,
          healthStatus: isOverride ? ("offline" as const) : ("online" as const)
        };
      }
      return item;
    });
    await saveWebsitesToFirestore(updated);
  };

  // Re-order Websites
  const handleMoveWebsite = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === websites.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const list = [...websites];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    await saveWebsitesToFirestore(reordered);
  };

  // Save Website Form
  const handleSubmitWebsiteForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteFormData.name?.trim() || !websiteFormData.url?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "వివరాలు తప్పనిసరి",
        text: "దయచేసి పేరు మరియు URL నమోదు చేయండి."
      });
      return;
    }

    let formattedUrl = websiteFormData.url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("/")) {
      formattedUrl = "https://" + formattedUrl;
    }

    let updatedList: LiveWebsiteItem[];
    if (editingWebsiteId) {
      updatedList = websites.map((item) =>
        item.id === editingWebsiteId
          ? {
              ...item,
              name: websiteFormData.name!.trim(),
              url: formattedUrl,
              category: websiteFormData.category || "Panchayat",
              badge: websiteFormData.badge || "Live",
              colorTheme: websiteFormData.colorTheme || "emerald",
              active: websiteFormData.active ?? true,
              notes: websiteFormData.notes?.trim() || ""
            }
          : item
      );
    } else {
      const newItem: LiveWebsiteItem = {
        id: "site_" + Date.now(),
        name: websiteFormData.name!.trim(),
        url: formattedUrl,
        category: websiteFormData.category || "Panchayat",
        badge: websiteFormData.badge || "Live",
        colorTheme: websiteFormData.colorTheme || "emerald",
        active: websiteFormData.active ?? true,
        order: websites.length + 1,
        notes: websiteFormData.notes?.trim() || "",
        healthStatus: "online"
      };
      updatedList = [...websites, newItem];
    }

    await saveWebsitesToFirestore(updatedList);
    setIsWebsiteFormOpen(false);
    setEditingWebsiteId(null);
  };

  // 1-Click Preset Add
  const handleAddPreset = async (preset: typeof PRESET_GOVT_PORTALS[0]) => {
    const exists = websites.some((w) => w.url.toLowerCase() === preset.url.toLowerCase());
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
      notes: preset.notes,
      healthStatus: "online"
    };

    await saveWebsitesToFirestore([...websites, newItem]);
  };

  // Re-order Features
  const handleMoveFeature = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === heroFeatures.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const list = [...heroFeatures];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    const reordered = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    await saveFeaturesToFirestore(reordered);
  };

  // Toggle Feature Active
  const handleToggleFeatureActive = async (id: string) => {
    const updated = heroFeatures.map((f) =>
      f.id === id ? { ...f, active: !f.active } : f
    );
    await saveFeaturesToFirestore(updated);
  };

  // Save Feature Form
  const handleSubmitFeatureForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureFormData.title?.trim() || !featureFormData.target?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "వివరాలు తప్పనిసరి",
        text: "దయచేసి ఫీచర్ టైటిల్ మరియు టార్గెట్ లింక్ నమోదు చేయండి."
      });
      return;
    }

    let updatedList: HeroFeatureButton[];
    if (editingFeatureId) {
      updatedList = heroFeatures.map((f) =>
        f.id === editingFeatureId
          ? {
              ...f,
              title: featureFormData.title!.trim(),
              subtitle: featureFormData.subtitle?.trim() || "",
              target: featureFormData.target!.trim(),
              tabId: featureFormData.tabId?.trim() || featureFormData.target!.replace(/^\//, ""),
              iconName: featureFormData.iconName || "Globe",
              colorTheme: featureFormData.colorTheme || "amber",
              active: featureFormData.active ?? true
            }
          : f
      );
    } else {
      const newFeature: HeroFeatureButton = {
        id: "feat_" + Date.now(),
        title: featureFormData.title!.trim(),
        subtitle: featureFormData.subtitle?.trim() || "",
        target: featureFormData.target!.trim(),
        tabId: featureFormData.tabId?.trim() || featureFormData.target!.replace(/^\//, ""),
        iconName: featureFormData.iconName || "Globe",
        colorTheme: featureFormData.colorTheme || "amber",
        active: featureFormData.active ?? true,
        order: heroFeatures.length + 1
      };
      updatedList = [...heroFeatures, newFeature];
    }

    await saveFeaturesToFirestore(updatedList);
    setIsFeatureFormOpen(false);
    setEditingFeatureId(null);
  };

  const filteredWebsites = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.url.toLowerCase().includes(searchQuery.toLowerCase())
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
              REAL-TIME CLOUD MANAGEMENT &amp; HEALTH PING
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
              <Sliders className="text-amber-400" size={24} />
              పబ్లిక్ ఫీచర్లు &amp; లైవ్ వెబ్‌సైట్ల నిర్వహణ (Public Features &amp; Live Portals Manager)
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/90 font-medium mt-1">
              హోమ్‌పేజీలోని లైవ్ వెబ్‌సైట్లు, ఆటోమేటిక్ డౌన్ స్టేటస్ మరియు 6 క్విక్ ఫీచర్ బటన్లను ఇక్కడి నుంచే నియంత్రించవచ్చు.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeAdminTab === "websites" && (
              <button
                type="button"
                disabled={checkingHealth}
                onClick={runLiveHealthCheck}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                <RefreshCw size={13} className={checkingHealth ? "animate-spin" : ""} />
                {checkingHealth ? "హెల్త్ చెక్ అవుతోంది..." : "⚡ రన్ లైవ్ హెల్త్ చెక్"}
              </button>
            )}

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

        {/* Top 2 Tab Selector */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveAdminTab("websites")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === "websites"
                ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            <Globe size={15} />
            <span>1. లైవ్ వెబ్‌సైట్లు &amp; ఆటో డౌన్ మానిటర్ (Live Websites &amp; Health)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/20 text-[10px]">
              {websites.filter((w) => w.active).length} Active
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab("features")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeAdminTab === "features"
                ? "bg-amber-400 text-slate-950 shadow-md scale-102"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            <Zap size={15} />
            <span>2. హోమ్‌పేజీ క్విక్ ఫీచర్లు (Hero 6 Feature Buttons)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950/20 text-[10px]">
              {heroFeatures.filter((f) => f.active).length} Buttons
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LIVE WEBSITES & AUTO DOWN MONITOR                                 */}
      {/* ========================================================================= */}
      {activeAdminTab === "websites" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Live Hero Preview Bar with Down Indicator */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#030d22] via-[#08183a] to-[#040f26] border border-amber-400/20 text-white shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-400" />
                యూజర్‌కు హోమ్‌పేజీలో కనిపించే లైవ్ ప్రివ్యూ (Real-Time Status Indicator):
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                🟢 Live = ఆన్‌లైన్ | 🔴 డౌన్ = సర్వర్ పనిచేయడం లేదు
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

              {/* Active Live Websites Preview with Down State */}
              {websites.filter((w) => w.active).map((site) => {
                const isDown = site.healthStatus === "offline" || site.manualOverrideDown;
                const isSlow = site.healthStatus === "slow";

                return (
                  <span
                    key={site.id}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border font-bold shadow-xs select-none ${
                      isDown
                        ? "bg-rose-950/80 border-rose-500/50 text-rose-200"
                        : isSlow
                        ? "bg-amber-950/80 border-amber-500/50 text-amber-200"
                        : "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                    }`}
                  >
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isDown ? "bg-rose-500" : isSlow ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          isDown ? "bg-rose-500" : isSlow ? "bg-amber-400" : "bg-emerald-400"
                        }`}
                      />
                    </span>
                    <span className={isDown ? "line-through opacity-80" : ""}>{site.name}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-black ${
                        isDown
                          ? "bg-rose-500/40 text-rose-200 border border-rose-400/40"
                          : isSlow
                          ? "bg-amber-500/30 text-amber-200"
                          : "bg-emerald-500/30 text-emerald-200"
                      }`}
                    >
                      {isDown ? "🔴 డౌన్ (Down)" : isSlow ? "🟡 Slow" : "🟢 Live"}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Preset Portals Quick Add */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                🏛️ తెలంగాణ &amp; ఏపీ ప్రభుత్వ పోర్టల్స్ (1-క్లిక్ క్విక్ యాడ్):
              </span>
              <span className="text-[10px] text-slate-500">ఒక్క క్లిక్‌తో హోమ్‌పేజీలో యాడ్ చేయండి</span>
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
                    {alreadyAdded && <span className="text-[9px] text-slate-400">(యాడ్ అయింది)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add / Edit Website Form */}
          {isWebsiteFormOpen && (
            <div className="p-5 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 rounded-2xl border-2 border-indigo-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                  {editingWebsiteId ? <Edit3 size={16} className="text-indigo-600" /> : <Plus size={16} className="text-emerald-600" />}
                  {editingWebsiteId ? "వెబ్‌సైట్ వివరాలను సవరించండి" : "కొత్త లైవ్ వెబ్‌సైట్‌ను జోడించండి"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsWebsiteFormOpen(false);
                    setEditingWebsiteId(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitWebsiteForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      వెబ్‌సైట్ పేరు (Display Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ఉదా: ధరణి (Dharani)"
                      value={websiteFormData.name || ""}
                      onChange={(e) => setWebsiteFormData({ ...websiteFormData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-semibold text-xs"
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
                      value={websiteFormData.url || ""}
                      onChange={(e) => setWebsiteFormData({ ...websiteFormData, url: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">విభాగం / కేటగిరీ</label>
                    <input
                      type="text"
                      placeholder="Revenue, Panchayat, Citizen..."
                      value={websiteFormData.category || ""}
                      onChange={(e) => setWebsiteFormData({ ...websiteFormData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">బ్యాడ్జ్ లేబుల్</label>
                    <input
                      type="text"
                      placeholder="Live, Official, Portal..."
                      value={websiteFormData.badge || ""}
                      onChange={(e) => setWebsiteFormData({ ...websiteFormData, badge: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={websiteFormData.active ?? true}
                      onChange={(e) => setWebsiteFormData({ ...websiteFormData, active: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>హోమ్‌పేజీలో ప్రదర్శించు (Active on Hero)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsWebsiteFormOpen(false);
                        setEditingWebsiteId(null);
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

          {/* Websites Search & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="వెబ్‌సైట్ పేరు లేదా URL వెతకండి..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingWebsiteId(null);
                  setWebsiteFormData({
                    name: "",
                    url: "https://",
                    category: "Panchayat",
                    badge: "Live",
                    colorTheme: "emerald",
                    active: true,
                    notes: ""
                  });
                  setIsWebsiteFormOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Plus size={14} /> కొత్త వెబ్‌సైట్ జోడించు
              </button>
            </div>
          </div>

          {/* Websites Table with Health Status & Down Overrides */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 grid grid-cols-12 gap-2 text-[11px] font-black uppercase tracking-wider text-slate-600">
              <div className="col-span-1 text-center">ఆర్డర్</div>
              <div className="col-span-3">వెబ్‌సైట్ పేరు</div>
              <div className="col-span-3">URL లింక్</div>
              <div className="col-span-2 text-center">ఆటో సర్వర్ స్టేటస్</div>
              <div className="col-span-1 text-center">ప్రదర్శించు</div>
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
                {filteredWebsites.map((item, index) => {
                  const isDown = item.healthStatus === "offline" || item.manualOverrideDown;
                  const isSlow = item.healthStatus === "slow";

                  return (
                    <div
                      key={item.id}
                      className={`px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50/80 transition-colors ${
                        !item.active ? "opacity-60 bg-slate-50/40" : ""
                      }`}
                    >
                      {/* Order Buttons */}
                      <div className="col-span-1 flex items-center justify-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveWebsite(index, "up")}
                          className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 cursor-pointer rounded"
                          title="పైకి జరుపు"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={index === filteredWebsites.length - 1}
                          onClick={() => handleMoveWebsite(index, "down")}
                          className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 cursor-pointer rounded"
                          title="క్రిందికి జరుపు"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      {/* Name & Category */}
                      <div className="col-span-3 min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1.5">
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.category && (
                          <span className="text-[10px] text-slate-400 font-medium truncate block">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* URL */}
                      <div className="col-span-3 min-w-0 flex items-center gap-1.5">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-indigo-600 hover:text-indigo-800 hover:underline truncate"
                        >
                          {item.url}
                        </a>
                        <ExternalLink size={11} className="text-slate-400 shrink-0" />
                      </div>

                      {/* Auto Server Status & Manual Down Override */}
                      <div className="col-span-2 text-center">
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleToggleManualDown(item.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${
                              isDown
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : isSlow
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            }`}
                            title="క్లిక్ చేసి మ్యాన్యువల్ గా డౌన్ / ఆన్‌లైన్ మార్చవచ్చు"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDown ? "bg-rose-600" : isSlow ? "bg-amber-600" : "bg-emerald-600"
                              }`}
                            />
                            <span>{isDown ? "🔴 DOWN" : isSlow ? "🟡 SLOW" : "🟢 LIVE"}</span>
                          </button>
                          {item.latencyMs && (
                            <span className="text-[9px] text-slate-400 font-mono">
                              {item.latencyMs}ms {item.lastChecked ? `• ${item.lastChecked}` : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Active Status */}
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleWebsiteActive(item.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                            item.active
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.active ? "ఆన్" : "ఆఫ్"}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center justify-end gap-1.5 pr-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingWebsiteId(item.id);
                            setWebsiteFormData({
                              name: item.name,
                              url: item.url,
                              category: item.category,
                              badge: item.badge,
                              colorTheme: item.colorTheme,
                              active: item.active,
                              notes: item.notes
                            });
                            setIsWebsiteFormOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="సవరించు"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await Swal.fire({
                              title: "డిలీట్ చేయాలా?",
                              text: `'${item.name}' ను తొలగించాలనుకుంటున్నారా?`,
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#ef4444",
                              confirmButtonText: "అవును, తొలగించు",
                              cancelButtonText: "రద్దు"
                            });
                            if (res.isConfirmed) {
                              const updated = websites.filter((w) => w.id !== item.id);
                              await saveWebsitesToFirestore(updated);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="తొలగించు"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: HERO 6 QUICK ACTION FEATURE BUTTONS                               */}
      {/* ========================================================================= */}
      {activeAdminTab === "features" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Information & Feature Summary */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
                <Zap size={18} />
              </span>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-amber-950">
                  హోమ్‌పేజీ రాయల్ వెల్‌కమ్ కార్డ్ కింద ఉండే 6 ఫీచర్ బటన్లు (Hero Action Buttons)
                </h4>
                <p className="text-[11px] text-amber-900/80 font-medium">
                  'Online portal at your line', 'UBD Settings', 'Mana Panchayath' మొదలైన బటన్ల పేర్లు, లింకులు మరియు ఐకాన్లను ఇక్కడి నుంచే మార్చవచ్చు.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                const res = await Swal.fire({
                  title: "డీఫాల్ట్ ఫీచర్లకు రీసెట్ చేయాలా?",
                  text: "హోమ్‌పేజీలోని 6 ఫీచర్ బటన్లను ప్రామాణిక డీఫాల్ట్స్‌కు రీసెట్ చేస్తుంది.",
                  icon: "question",
                  showCancelButton: true,
                  confirmButtonText: "అవును, రీసెట్ చేయి",
                  cancelButtonText: "రద్దు"
                });
                if (res.isConfirmed) {
                  await saveFeaturesToFirestore(DEFAULT_HERO_FEATURES);
                }
              }}
              className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              <RotateCcw size={13} className="inline mr-1" /> డీఫాల్ట్స్ రీసెట్
            </button>
          </div>

          {/* Add / Edit Feature Form */}
          {isFeatureFormOpen && (
            <div className="p-5 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/50 rounded-2xl border-2 border-indigo-200 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h3 className="text-sm font-black text-indigo-950 flex items-center gap-2">
                  {editingFeatureId ? <Edit3 size={16} className="text-indigo-600" /> : <Plus size={16} className="text-emerald-600" />}
                  {editingFeatureId ? "ఫీచర్ బటన్ వివరాలను సవరించండి" : "కొత్త ఫీచర్ బటన్‌ను జోడించండి"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsFeatureFormOpen(false);
                    setEditingFeatureId(null);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmitFeatureForm} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      బటన్ మెయిన్ టైటిల్ (Title) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ఉదా: Online portal at your line"
                      value={featureFormData.title || ""}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-semibold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      సబ్ టైటిల్ / వివరణ (Subtitle)
                    </label>
                    <input
                      type="text"
                      placeholder="ఉదా: త్వరలో ప్రారంభం (Soon) లేదా డిజిటల్ వర్క్‌స్పేస్"
                      value={featureFormData.subtitle || ""}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      టార్గెట్ పేజీ URL / రూట్ (Target URL) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ఉదా: /online_portal లేదా /workspace"
                      value={featureFormData.target || ""}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, target: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      ఐకాన్ ఎంపిక (Icon)
                    </label>
                    <select
                      value={featureFormData.iconName || "Globe"}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, iconName: e.target.value })}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 text-xs font-semibold"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic.name} value={ic.name}>
                          {ic.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={featureFormData.active ?? true}
                      onChange={(e) => setFeatureFormData({ ...featureFormData, active: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>హోమ్‌పేజీలో ప్రదర్శించు (Active on Hero)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFeatureFormOpen(false);
                        setEditingFeatureId(null);
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

          {/* Features Action & Table */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">
              మొత్తం ఫీచర్లు: <span className="font-black text-slate-900">{heroFeatures.length}</span> | యాక్టివ్:{" "}
              <span className="font-black text-emerald-600">{heroFeatures.filter((f) => f.active).length}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setEditingFeatureId(null);
                setFeatureFormData({
                  title: "",
                  subtitle: "",
                  target: "/",
                  tabId: "home",
                  iconName: "Globe",
                  colorTheme: "amber",
                  active: true
                });
                setIsFeatureFormOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Plus size={14} /> కొత్త ఫీచర్ బటన్ జోడించు
            </button>
          </div>

          {/* Hero Feature Buttons Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 grid grid-cols-12 gap-2 text-[11px] font-black uppercase tracking-wider text-slate-600">
              <div className="col-span-1 text-center">ఆర్డర్</div>
              <div className="col-span-4">ఫీచర్ బటన్ టైటిల్ &amp; సబ్ టైటిల్</div>
              <div className="col-span-3">టార్గెట్ లింక్ (URL)</div>
              <div className="col-span-1 text-center">ఐకాన్</div>
              <div className="col-span-1 text-center">స్టేటస్</div>
              <div className="col-span-2 text-right pr-2">చర్యలు</div>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              {heroFeatures.map((item, index) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-slate-50/80 transition-colors ${
                    !item.active ? "opacity-60 bg-slate-50/40" : ""
                  }`}
                >
                  {/* Order */}
                  <div className="col-span-1 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveFeature(index, "up")}
                      className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 cursor-pointer rounded"
                      title="పైకి జరుపు"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === heroFeatures.length - 1}
                      onClick={() => handleMoveFeature(index, "down")}
                      className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-30 cursor-pointer rounded"
                      title="క్రిందికి జరుపు"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="col-span-4 min-w-0">
                    <div className="font-black text-xs text-slate-900 truncate">
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="text-[10px] text-slate-500 font-medium truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>

                  {/* Target URL */}
                  <div className="col-span-3 min-w-0">
                    <span className="text-xs font-mono text-indigo-600 truncate block">
                      {item.target}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="col-span-1 text-center font-bold text-xs text-slate-700">
                    {item.iconName}
                  </div>

                  {/* Active Toggle */}
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatureActive(item.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                        item.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {item.active ? "ఆన్" : "ఆఫ్"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5 pr-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFeatureId(item.id);
                        setFeatureFormData({
                          title: item.title,
                          subtitle: item.subtitle,
                          target: item.target,
                          tabId: item.tabId,
                          iconName: item.iconName,
                          colorTheme: item.colorTheme,
                          active: item.active
                        });
                        setIsFeatureFormOpen(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="సవరించు"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await Swal.fire({
                          title: "డిలీట్ చేయాలా?",
                          text: `'${item.title}' ఫీచర్‌ను తొలగించాలనుకుంటున్నారా?`,
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#ef4444",
                          confirmButtonText: "అవును, తొలగించు",
                          cancelButtonText: "రద్దు"
                        });
                        if (res.isConfirmed) {
                          const updated = heroFeatures.filter((f) => f.id !== item.id);
                          await saveFeaturesToFirestore(updated);
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="తొలగించు"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
