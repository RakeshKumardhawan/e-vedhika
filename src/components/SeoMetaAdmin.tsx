import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Save,
  Globe,
  Share2,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Info,
  RefreshCw,
  Copy,
  Tag,
  Eye,
  ShieldCheck,
} from "lucide-react";

export const DEFAULT_SEO_CONFIG = {
  seoTitle: "E-Vedhika | The Digital Governance Platform",
  seoDescription:
    "E-Vedhika: All Problems One Solution - Comprehensive Digital Portal for Panchayat Secretaries and Citizens in Telangana and Andhra Pradesh.",
  seoKeywords:
    "E-Vedhika, Governance, Digital Solutions, Portal, Problem Solving, AP Governance, Telangana Panchayath, Panchayat Secretary Formats",
  ogTitle: "E-Vedhika - Digital Governance Portal",
  ogDescription:
    "All Problems One Solution. Access Panchayath forms, daily logs, GOs, and public e-services in one unified platform.",
  ogImage:
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
  ogType: "website",
  twitterCard: "summary_large_image",
  metaRobots: "index, follow",
  canonicalUrl: "https://www.e-vedhika.in/",
  author: "E-Vedhika Digital Team",
};

export function updateDOMMetaTags(seoData?: Partial<typeof DEFAULT_SEO_CONFIG> | null) {
  if (typeof document === "undefined") return;

  const data = { ...DEFAULT_SEO_CONFIG, ...(seoData || {}) };

  const title = data.seoTitle || DEFAULT_SEO_CONFIG.seoTitle;
  const description = data.seoDescription || DEFAULT_SEO_CONFIG.seoDescription;
  const keywords = data.seoKeywords || DEFAULT_SEO_CONFIG.seoKeywords;
  const author = data.author || DEFAULT_SEO_CONFIG.author;
  const robots = data.metaRobots || DEFAULT_SEO_CONFIG.metaRobots;

  const ogTitle = data.ogTitle || title;
  const ogDesc = data.ogDescription || description;
  const ogImg = data.ogImage || DEFAULT_SEO_CONFIG.ogImage;
  const canonical = data.canonicalUrl || DEFAULT_SEO_CONFIG.canonicalUrl;
  const twitterCard = data.twitterCard || DEFAULT_SEO_CONFIG.twitterCard;

  document.title = title;

  const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setMeta('meta[name="description"]', 'name', 'description', description);
  setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
  setMeta('meta[name="author"]', 'name', 'author', author);
  setMeta('meta[name="robots"]', 'name', 'robots', robots);

  // OpenGraph
  setMeta('meta[property="og:title"]', 'property', 'og:title', ogTitle);
  setMeta('meta[property="og:description"]', 'property', 'og:description', ogDesc);
  setMeta('meta[property="og:image"]', 'property', 'og:image', ogImg);
  setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', ogImg);
  setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
  setMeta('meta[property="og:type"]', 'property', 'og:type', data.ogType || 'website');

  // Twitter
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', ogTitle);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', ogDesc);
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImg);

  // Canonical
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', canonical);
}

const PRESET_BANNERS = [
  {
    name: "Digital Governance Blue",
    url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Panchayat Tech Network",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Official Governance Emblem",
    url: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Rural Administration Hub",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
  },
];

export function SeoMetaAdmin({ addToast }: { addToast: (msg: string) => void }) {
  const [seo, setSeo] = useState(DEFAULT_SEO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"seo" | "og" | "preview">("seo");

  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        const localSaved = localStorage.getItem("e_vedhika_seo_config");
        if (localSaved) {
          try {
            setSeo({ ...DEFAULT_SEO_CONFIG, ...JSON.parse(localSaved) });
          } catch (e) {}
        }
        const snap = await getDoc(doc(db, "site_settings", "home_page"));
        if (snap.exists() && snap.data().seo) {
          const merged = { ...DEFAULT_SEO_CONFIG, ...snap.data().seo };
          setSeo(merged);
          localStorage.setItem("e_vedhika_seo_config", JSON.stringify(merged));
        } else {
          // Fallback check in settings/seo_meta
          const fallbackSnap = await getDoc(doc(db, "settings", "seo_meta"));
          if (fallbackSnap.exists()) {
            const merged = { ...DEFAULT_SEO_CONFIG, ...fallbackSnap.data() };
            setSeo(merged);
            localStorage.setItem("e_vedhika_seo_config", JSON.stringify(merged));
          }
        }
      } catch (err) {
        console.error("Error loading SEO meta settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeoSettings();
  }, []);

  const handleChange = (field: keyof typeof DEFAULT_SEO_CONFIG, val: string) => {
    setSeo((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...seo,
      updatedAt: Date.now(),
    };

    // Save to local storage immediately
    try {
      localStorage.setItem("e_vedhika_seo_config", JSON.stringify(payload));
    } catch (e) {}

    // Dynamically apply to head tags right away
    updateDOMMetaTags(seo);

    try {
      // Save to home_page document so all clients load it automatically
      await setDoc(doc(db, "site_settings", "home_page"), { seo: payload }, { merge: true });
      // Also write to settings/seo_meta for backup consistency
      await setDoc(doc(db, "settings", "seo_meta"), payload, { merge: true });

      addToast("SEO & Meta Tags updated and applied successfully! (SEO సెట్టింగ్‌లు భద్రపరచబడ్డాయి)");
    } catch (err: any) {
      console.warn("Firestore sync error for SEO settings, saved locally:", err);
      addToast("SEO & Meta Tags applied locally! (SEO సెట్టింగ్‌లు లోకల్‌గా భద్రపరచబడ్డాయి)");
    } finally {
      setSaving(false);
    }
  };

  const copySeoToOg = () => {
    setSeo((prev) => ({
      ...prev,
      ogTitle: prev.seoTitle,
      ogDescription: prev.seoDescription,
    }));
    addToast("SEO Title & Description copied to OpenGraph! (OG వివరణ కాపీ చేయబడింది)");
  };

  const resetDefaults = () => {
    setSeo(DEFAULT_SEO_CONFIG);
    addToast("Reset to default SEO configuration. Click Save to apply.");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
        <div className="inline-block animate-spin text-blue-600 mb-3">
          <RefreshCw size={28} />
        </div>
        <p className="text-sm font-bold text-slate-600">
          SEO & మెటా ట్యాగ్స్ లోడ్ అవుతున్నాయి... (Loading SEO & Meta Tags...)
        </p>
      </div>
    );
  }

  const titleLength = seo.seoTitle?.length || 0;
  const descLength = seo.seoDescription?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0d3b66] via-[#103052] to-[#1e40af] text-white p-6 sm:p-8 rounded-[32px] shadow-lg border border-blue-900/40 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
              <Sparkles size={12} /> Live Meta Tag Manager (డైనామిక్ SEO మేనేజర్)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Globe className="text-amber-400" size={28} />
              SEO & Dynamic Meta Tags
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl font-medium">
              సెర్చ్ ఇంజిన్‌లు (Google, Bing) మరియు వాట్సాప్ / ఫేస్‌బుక్ షేరింగ్ కోసం మెటా వివరణలు, OG ఇమేజ్‌లు మరియు టైటిల్స్‌ను సులభంగా నిర్వహించండి.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetDefaults}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/10 flex items-center gap-2"
              title="డిఫాల్ట్ విలువలకు మార్చు"
            >
              <RefreshCw size={14} /> డిఫాల్ట్
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-[#fbe947] hover:bg-yellow-400 text-[#103052] font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {saving ? "భద్రపరుస్తోంది..." : "SEO సేవ్ చేయి"}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all ${
            activeTab === "seo"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Search size={15} />
          1. సెర్చ్ ఇంజిన్ SEO (Search Meta Tags)
        </button>
        <button
          onClick={() => setActiveTab("og")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all ${
            activeTab === "og"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Share2 size={15} />
          2. వాట్సాప్ & సోషల్ షేరింగ్ (OpenGraph & Images)
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all ${
            activeTab === "preview"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Eye size={15} />
          3. లైవ్ ప్రివ్యూ (Live Snippet Preview)
        </button>
      </div>

      {/* Tab 1: Primary Search Engine SEO */}
      {activeTab === "seo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#103052] flex items-center gap-2">
                  <Search className="text-blue-600" size={18} />
                  సెర్చ్ ఇంజిన్ మెటా టాగ్స్ (Search Engine Optimization)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Google మరియు ఇతర సెర్చ్ ఫలితాల్లో కనిపించే శీర్షిక, వివరణ వివరాలు.
                </p>
              </div>
            </div>

            {/* SEO Title */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  SEO Title (పేజీ ప్రధాన శీర్షిక)
                </label>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    titleLength >= 50 && titleLength <= 65
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {titleLength} / 60 క్యారెక్టర్లు (సూచించిన సైజు: 50-60)
                </span>
              </div>
              <input
                type="text"
                value={seo.seoTitle}
                onChange={(e) => handleChange("seoTitle", e.target.value)}
                placeholder="e.g. E-Vedhika | The Digital Governance Platform"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  SEO Meta Description (శోధన వివరణ)
                </label>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    descLength >= 140 && descLength <= 165
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {descLength} / 160 క్యారెక్టర్లు (సూచించిన సైజు: 140-160)
                </span>
              </div>
              <textarea
                value={seo.seoDescription}
                onChange={(e) => handleChange("seoDescription", e.target.value)}
                rows={3}
                placeholder="Google ఫలితాల్లో కనిపించే సారాంశం..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-medium text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner resize-y"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                Meta Keywords (కీవర్డ్‌లు - కామాలతో వేరుచేయండి)
              </label>
              <input
                type="text"
                value={seo.seoKeywords}
                onChange={(e) => handleChange("seoKeywords", e.target.value)}
                placeholder="E-Vedhika, Panchayath, Governance, Telangana, Formats, GOs"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-medium text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* Advanced Meta Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Meta Robots (సెర్చ్ ఇండెక్సింగ్ అనుమతి)
                </label>
                <select
                  value={seo.metaRobots}
                  onChange={(e) => handleChange("metaRobots", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold text-xs text-slate-800 outline-none focus:border-blue-600"
                >
                  <option value="index, follow">🟢 index, follow (అన్ని సెర్చ్ ఇంజిన్‌లకు అనుమతించు - డిఫాల్ట్)</option>
                  <option value="noindex, follow">🟡 noindex, follow (పేజీ ఇండెక్స్ చేయవద్దు, లింకులు ఫాలో అవ్వు)</option>
                  <option value="index, nofollow">🟡 index, nofollow (ఇండెక్స్ చేయి, లింకులు ఫాలో అవ్వొద్దు)</option>
                  <option value="noindex, nofollow">🔴 noindex, nofollow (పూర్తిగా నిరోధించు)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Author / Publisher (రచయిత వివరాలు)
                </label>
                <input
                  type="text"
                  value={seo.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  placeholder="E-Vedhika Digital Team"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold text-xs text-slate-800 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block flex items-center gap-1">
                <LinkIcon size={12} /> Canonical URL (ప్రధాన అధికారిక లింక్)
              </label>
              <input
                type="text"
                value={seo.canonicalUrl}
                onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                placeholder="https://www.e-vedhika.in/"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-medium text-xs text-slate-800 outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Sidebar Google Live Preview Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Search className="text-blue-500" size={14} /> Google Search Live Preview
              </h4>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-600 font-mono truncate flex items-center gap-1">
                  <span>{seo.canonicalUrl || "https://www.e-vedhika.in"}</span>
                  <span className="text-slate-400">› main</span>
                </div>
                <h3 className="text-base font-bold text-blue-700 hover:underline cursor-pointer leading-tight line-clamp-1">
                  {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1">
                  {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-3 italic">
                గమనిక: గూగుల్ సెర్చ్‌లో మీ వెబ్‌సైట్ శీర్షిక మరియు వివరణ ఇలా కనిపిస్తుంది.
              </p>
            </div>

            <div className="bg-amber-50 p-5 rounded-3xl border border-amber-200/60">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info size={14} className="text-amber-600" /> SEO చిట్కాలు (Tips)
              </h4>
              <ul className="text-xs text-amber-800 space-y-2 font-medium">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>శీర్షికలో ప్రధాన కీవర్డ్‌లు ("E-Vedhika", "Panchayath Portal") ఉండాలి.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-amber-600 shrink-0 mt-0.5" />
                  <span>వివరణ 140 నుండి 160 అక్షరాల లోపు ఉంటే గూగుల్‌లో కట్ కాకుండా స్పష్టంగా కనిపిస్తుంది.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: OpenGraph & Social Media Sharing */}
      {activeTab === "og" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-[#103052] flex items-center gap-2">
                  <Share2 className="text-indigo-600" size={18} />
                  OpenGraph & వాట్సాప్ / ఫేస్‌బుక్ మెటా ట్యాగ్స్
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  వాట్సాప్, ఫేస్‌బుక్ మరియు ఎక్స్‌లో లింక్ షేర్ చేసినప్పుడు కనిపించే బ్యానర్ ఇమేజ్ మరియు కార్డు సారాంశం.
                </p>
              </div>
              <button
                onClick={copySeoToOg}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 border border-indigo-200"
              >
                <Copy size={13} /> SEO నుండి కాపీ చేయి
              </button>
            </div>

            {/* OG Title */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                OpenGraph Title (వాట్సాప్ / సోషల్ మీడియా కార్డ్ శీర్షిక)
              </label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => handleChange("ogTitle", e.target.value)}
                placeholder="e.g. E-Vedhika - Digital Governance Portal"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-bold text-xs text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner"
              />
            </div>

            {/* OG Description */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                OpenGraph Description (సోషల్ మీడియా కార్డ్ వివరణ)
              </label>
              <textarea
                value={seo.ogDescription}
                onChange={(e) => handleChange("ogDescription", e.target.value)}
                rows={3}
                placeholder="వాట్సాప్‌లో కనిపించే వివరణ సారాంశం..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-medium text-xs text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner resize-y"
              />
            </div>

            {/* OG Image URL */}
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block flex items-center gap-1.5">
                <ImageIcon size={14} className="text-indigo-600" /> OpenGraph Image Banner URL (సోషల్ షేరింగ్ ఇమేజ్)
              </label>
              <input
                type="text"
                value={seo.ogImage}
                onChange={(e) => handleChange("ogImage", e.target.value)}
                placeholder="https://example.com/social-banner.jpg"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 font-mono text-xs text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-inner mb-3"
              />

              {/* Preset Banners Selection */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  సిద్ధంగా ఉన్న అధికారిక బ్యానర్‌ల నుండి ఎంచుకోండి (Preset Banners):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_BANNERS.map((b, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleChange("ogImage", b.url);
                        addToast(`Selected preset banner: ${b.name}`);
                      }}
                      className={`group relative rounded-2xl overflow-hidden border-2 transition-all p-1 text-left ${
                        seo.ogImage === b.url
                          ? "border-indigo-600 shadow-md ring-2 ring-indigo-300"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="h-16 w-full rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={b.url}
                          alt={b.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 block truncate mt-1 px-1">
                        {b.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Twitter Card Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Twitter Card Type (ఎక్స్ / ట్విట్టర్ శైలి)
                </label>
                <select
                  value={seo.twitterCard}
                  onChange={(e) => handleChange("twitterCard", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold text-xs text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="summary_large_image">🖼️ Large Image Banner (పెద్ద బ్యానర్ ఇమేజ్)</option>
                  <option value="summary">📄 Standard Summary (చిన్న థంబ్‌నెయిల్)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 block">
                  OpenGraph Content Type
                </label>
                <input
                  type="text"
                  value={seo.ogType || "website"}
                  onChange={(e) => handleChange("ogType", e.target.value)}
                  placeholder="website"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 font-bold text-xs text-slate-800 outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Social Media Card Live Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Share2 className="text-indigo-500" size={14} /> WhatsApp Live Card Preview
              </h4>

              {/* WhatsApp Card Box */}
              <div className="bg-[#e5ddd5] p-3 rounded-2xl border border-slate-300">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="h-44 w-full bg-slate-100 overflow-hidden relative">
                    {seo.ogImage ? (
                      <img
                        src={seo.ogImage}
                        alt="OG Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-[#f0f2f5] space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider truncate">
                      {seo.canonicalUrl ? new URL(seo.canonicalUrl).hostname : "e-vedhika.in"}
                    </p>
                    <h5 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2">
                      {seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}
                    </h5>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                      {seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-3 italic">
                వాట్సాప్‌లో పోర్టల్ లింక్ షేర్ చేసినప్పుడు రిసీవర్‌కి కార్డు ఇలా ప్రదర్శించబడుతుంది.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Combined Live Preview */}
      {activeTab === "preview" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-black text-[#103052] flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              లైవ్ SEO & సోషల్ మీడియా కార్డ్స్ ప్రివ్యూ (Live Preview Hub)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              వివిధ వేదికలలో మీ వెబ్‌సైట్ శీర్షికలు, వివరణలు మరియు ఓపెన్ గ్రాఫ్ ఇమేజ్‌లు ఎలా కనిపిస్తాయో క్రింద సరిచూడండి.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Google Search Card */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
                <Search size={14} className="text-blue-600" /> Google Search Result
              </span>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="text-xs text-slate-600 font-mono flex items-center gap-1">
                  <span>https://www.e-vedhika.in</span>
                </div>
                <h4 className="text-lg font-bold text-[#1a0dab] hover:underline cursor-pointer leading-tight">
                  {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                </h4>
                <p className="text-xs text-[#4d5156] leading-relaxed">
                  {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                </p>
              </div>
            </div>

            {/* WhatsApp / Facebook Share Card */}
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
                <Share2 size={14} className="text-indigo-600" /> WhatsApp & Social Media Card
              </span>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-sm">
                <div className="h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={seo.ogImage || DEFAULT_SEO_CONFIG.ogImage}
                    alt="Social Card Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-slate-50 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    E-VEDHIKA.IN
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
