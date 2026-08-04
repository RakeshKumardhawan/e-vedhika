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
  seoTitle: "E-Vedhika | All Problems One Solution - Comprehensive Digital Portal",
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
  twitterSite: "@EVedhikaOfficial",
  metaRobots: "index, follow",
  canonicalUrl: "https://www.e-vedhika.in/",
  author: "E-Vedhika Digital Team",
  googleSiteVerification: "",
  bingSiteVerification: "",
  yandexVerification: "",
  facebookAppId: "",
};

export function updateDOMMetaTags(seoData?: Partial<typeof DEFAULT_SEO_CONFIG> | null) {
  if (typeof document === "undefined") return;

  // Fallback check from localStorage if no parameter provided
  let localSaved: any = null;
  try {
    const raw = localStorage.getItem("e_vedhika_seo_meta_config");
    if (raw) localSaved = JSON.parse(raw);
  } catch {}

  const data = { ...DEFAULT_SEO_CONFIG, ...(localSaved || {}), ...(seoData || {}) };

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
    if (!content) return;
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

  // Search Engine Verification Tags
  if (data.googleSiteVerification) {
    setMeta('meta[name="google-site-verification"]', 'name', 'google-site-verification', data.googleSiteVerification);
  }
  if (data.bingSiteVerification) {
    setMeta('meta[name="msvalidate.01"]', 'name', 'msvalidate.01', data.bingSiteVerification);
  }
  if (data.yandexVerification) {
    setMeta('meta[name="yandex-verification"]', 'name', 'yandex-verification', data.yandexVerification);
  }
  if (data.facebookAppId) {
    setMeta('meta[property="fb:app_id"]', 'property', 'fb:app_id', data.facebookAppId);
  }

  // OpenGraph (Facebook, WhatsApp, LinkedIn, Telegram)
  setMeta('meta[property="og:title"]', 'property', 'og:title', ogTitle);
  setMeta('meta[property="og:description"]', 'property', 'og:description', ogDesc);
  setMeta('meta[property="og:image"]', 'property', 'og:image', ogImg);
  setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', ogImg);
  setMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
  setMeta('meta[property="og:type"]', 'property', 'og:type', data.ogType || 'website');
  setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'E-Vedhika');

  // Twitter / X
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard);
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', ogTitle);
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', ogDesc);
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImg);
  if (data.twitterSite) {
    setMeta('meta[name="twitter:site"]', 'name', 'twitter:site', data.twitterSite);
  }

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
  const [activeTab, setActiveTab] = useState<"seo" | "og" | "webmaster" | "preview">("seo");
  const [enginePreview, setEnginePreview] = useState<"google" | "bing" | "yahoo" | "duckduckgo" | "yandex">("google");
  const [socialPreview, setSocialPreview] = useState<"whatsapp" | "facebook" | "twitter" | "telegram" | "linkedin">("whatsapp");

  useEffect(() => {
    const fetchSeoSettings = async () => {
      let loadedSeo = { ...DEFAULT_SEO_CONFIG };

      // Try LocalStorage first for instant availability
      try {
        const local = localStorage.getItem("e_vedhika_seo_meta_config");
        if (local) {
          loadedSeo = { ...loadedSeo, ...JSON.parse(local) };
        }
      } catch (e) {
        console.warn("Local storage read error for SEO:", e);
      }

      // Try Firestore
      try {
        const snap = await getDoc(doc(db, "site_settings", "home_page"));
        if (snap.exists() && snap.data().seo) {
          loadedSeo = { ...loadedSeo, ...snap.data().seo };
        } else {
          const fallbackSnap = await getDoc(doc(db, "settings", "seo_meta"));
          if (fallbackSnap.exists()) {
            loadedSeo = { ...loadedSeo, ...fallbackSnap.data() };
          }
        }
      } catch (err: any) {
        console.warn("Firestore fetch error for SEO (using local cache):", err.message);
      } finally {
        setSeo(loadedSeo);
        updateDOMMetaTags(loadedSeo);
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

    // 1. Always save to LocalStorage immediately and update DOM
    try {
      localStorage.setItem("e_vedhika_seo_meta_config", JSON.stringify(payload));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
    updateDOMMetaTags(payload);

    // 2. Save to Firestore with silent fallback
    try {
      await setDoc(doc(db, "site_settings", "home_page"), { seo: payload }, { merge: true });
      await setDoc(doc(db, "settings", "seo_meta"), payload, { merge: true });
      addToast("SEO & Meta Tags క్లౌడ్ మౌలిక వనరుల్లో మరియు లైవ్‌లో విజయవంతంగా భద్రపరచబడ్డాయి! (Saved to Cloud & Applied Live)");
    } catch (err: any) {
      console.warn("Firestore save bypassed, saved locally:", err.message);
      addToast("SEO సెట్టింగ్‌లు లోకల్‌గా భద్రపరచబడ్డాయి మరియు లైవ్‌లో వర్తింపజేయబడ్డాయి! (Saved Locally & Applied Live)");
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all whitespace-nowrap ${
            activeTab === "seo"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Search size={15} />
          1. సెర్చ్ ఇంజిన్లు (Google, Bing, Yahoo, DDG, Yandex)
        </button>
        <button
          onClick={() => setActiveTab("og")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all whitespace-nowrap ${
            activeTab === "og"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Share2 size={15} />
          2. సోషల్ & వాట్సాప్ కార్డ్స్ (OpenGraph, X, Telegram)
        </button>
        <button
          onClick={() => setActiveTab("webmaster")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all whitespace-nowrap ${
            activeTab === "webmaster"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <ShieldCheck size={15} />
          3. వెబ్‌మాస్టర్ తనిఖీ కోడ్‌లు (Search Console Tags)
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wide transition-all whitespace-nowrap ${
            activeTab === "preview"
              ? "bg-[#103052] text-white shadow-md font-black"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Eye size={15} />
          4. ఆల్-ఇన్-వన్ లైవ్ ప్రివ్యూ (Live Snippets)
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

      {/* Tab 3: Webmaster Verification Codes */}
      {activeTab === "webmaster" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-[#103052] flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" size={20} />
              సెర్చ్ ఇంజిన్ వెబ్‌మాస్టర్ తనిఖీ ఐడీలు (Search Console & Verification Meta Tags)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Google Search Console, Bing Webmaster Tools మరియు Yandex లలో సైట్ యాజమాన్యాన్ని రూఢీ చేసుకోవడానికి మెటా ట్యాగ్ ఐడీలు ఇక్కడ నమోదు చేయండి.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Search Console */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                Google Search Console Verification Tag
              </label>
              <p className="text-[11px] text-slate-500">
                గూగుల్ ఇచ్చే <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">content="..."</code> విలువను ఇక్కడ పేస్ట్ చేయండి:
              </p>
              <input
                type="text"
                value={seo.googleSiteVerification || ""}
                onChange={(e) => handleChange("googleSiteVerification", e.target.value)}
                placeholder="e.g. google-site-verification=abc123XYZ..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 outline-none focus:border-blue-600"
              />
            </div>

            {/* Bing & Yahoo Webmaster */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
                Bing & Yahoo Webmaster Verification (msvalidate.01)
              </label>
              <p className="text-[11px] text-slate-500">
                Bing మరియు Yahoo శోధన సాధనాల Verification Code:
              </p>
              <input
                type="text"
                value={seo.bingSiteVerification || ""}
                onChange={(e) => handleChange("bingSiteVerification", e.target.value)}
                placeholder="e.g. 1234567890ABCDEF1234567890ABCDEF"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 outline-none focus:border-sky-600"
              />
            </div>

            {/* Yandex Webmaster */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                Yandex Webmaster Verification
              </label>
              <p className="text-[11px] text-slate-500">
                Yandex Search Engine verification key:
              </p>
              <input
                type="text"
                value={seo.yandexVerification || ""}
                onChange={(e) => handleChange("yandexVerification", e.target.value)}
                placeholder="e.g. yandex-verification=1234567890"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 outline-none focus:border-red-600"
              />
            </div>

            {/* Facebook App ID / Domain Verify */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
                Facebook App ID / Meta Domain Verification
              </label>
              <p className="text-[11px] text-slate-500">
                Meta Business Manager domain verification ID:
              </p>
              <input
                type="text"
                value={seo.facebookAppId || ""}
                onChange={(e) => handleChange("facebookAppId", e.target.value)}
                placeholder="e.g. 123456789012345"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: All-In-One Multi-Engine & Multi-Platform Live Preview */}
      {activeTab === "preview" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-black text-[#103052] flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              మల్టీ-సెర్చ్ ఇంజిన్ & సోషల్ మీడియా లైవ్ ప్రివ్యూ హబ్ (Multi-Engine Preview)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Google, Bing, Yahoo, DuckDuckGo, Yandex మరియు సోషల్ వేదికలలో (WhatsApp, Facebook, Twitter, Telegram, LinkedIn) మీ వెబ్‌సైట్ రిజల్ట్ ఎలా కనిపిస్తుందో ఎంచుకుని పరిశీలించండి.
            </p>
          </div>

          {/* Engine & Social Switchers */}
          <div className="space-y-6">
            {/* 1. Search Engine Switcher */}
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Search size={14} className="text-blue-600" /> సెర్చ్ ఇంజిన్ ఎంచుకోండి (Select Search Engine):
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "google", label: "🔍 Google Search", color: "border-blue-500 text-blue-700 bg-blue-50" },
                  { id: "bing", label: "🟦 Bing Search", color: "border-sky-500 text-sky-700 bg-sky-50" },
                  { id: "yahoo", label: "🟣 Yahoo Search", color: "border-purple-500 text-purple-700 bg-purple-50" },
                  { id: "duckduckgo", label: "🦆 DuckDuckGo", color: "border-amber-500 text-amber-700 bg-amber-50" },
                  { id: "yandex", label: "🔴 Yandex Search", color: "border-red-500 text-red-700 bg-red-50" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEnginePreview(item.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      enginePreview === item.id
                        ? `${item.color} shadow-sm ring-2 ring-blue-300 font-black`
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Render Selected Search Engine Preview Box */}
              <div className="mt-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner">
                {enginePreview === "google" && (
                  <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="text-xs text-slate-600 font-mono flex items-center gap-1">
                      <span>{seo.canonicalUrl || "https://www.e-vedhika.in"}</span>
                      <span className="text-slate-400">› main</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#1a0dab] hover:underline cursor-pointer leading-tight">
                      {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                    </h4>
                    <p className="text-xs text-[#4d5156] leading-relaxed">
                      {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                    </p>
                  </div>
                )}

                {enginePreview === "bing" && (
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-sky-100 shadow-xs">
                    <div className="text-[11px] text-emerald-800 font-sans flex items-center gap-1 font-bold">
                      <span>https://www.e-vedhika.in</span>
                      <span className="text-slate-300">• Bing Official</span>
                    </div>
                    <h4 className="text-lg font-bold text-[#001ba0] hover:underline cursor-pointer leading-tight">
                      {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                    </h4>
                    <p className="text-xs text-[#333] leading-relaxed">
                      {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                    </p>
                  </div>
                )}

                {enginePreview === "yahoo" && (
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-purple-100 shadow-xs">
                    <div className="text-[11px] text-purple-900 font-mono font-bold">
                      e-vedhika.in
                    </div>
                    <h4 className="text-lg font-bold text-[#2200cc] hover:underline cursor-pointer leading-tight">
                      {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                    </h4>
                    <p className="text-xs text-[#555] leading-relaxed">
                      {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                    </p>
                  </div>
                )}

                {enginePreview === "duckduckgo" && (
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-amber-100 shadow-xs">
                    <div className="text-[11px] text-slate-500 font-sans font-medium flex items-center gap-1">
                      <span>e-vedhika.in</span>
                      <span className="text-amber-600 font-bold">🔒 Privacy First</span>
                    </div>
                    <h4 className="text-base font-bold text-[#22518f] hover:underline cursor-pointer leading-tight">
                      {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                    </h4>
                    <p className="text-xs text-[#666] leading-relaxed">
                      {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                    </p>
                  </div>
                )}

                {enginePreview === "yandex" && (
                  <div className="space-y-1.5 bg-white p-4 rounded-xl border border-red-100 shadow-xs">
                    <div className="text-[11px] text-slate-700 font-mono font-semibold">
                      www.e-vedhika.in
                    </div>
                    <h4 className="text-lg font-bold text-[#1000dd] hover:underline cursor-pointer leading-tight">
                      {seo.seoTitle || DEFAULT_SEO_CONFIG.seoTitle}
                    </h4>
                    <p className="text-xs text-[#333] leading-relaxed">
                      {seo.seoDescription || DEFAULT_SEO_CONFIG.seoDescription}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Social Media & Messaging Switcher */}
            <div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Share2 size={14} className="text-indigo-600" /> సోషల్ వేదిక ఎంచుకోండి (Select Social Platform):
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "whatsapp", label: "💬 WhatsApp", color: "border-emerald-500 text-emerald-700 bg-emerald-50" },
                  { id: "facebook", label: "📘 Facebook", color: "border-blue-600 text-blue-700 bg-blue-50" },
                  { id: "twitter", label: "🐦 X (Twitter)", color: "border-slate-800 text-slate-900 bg-slate-100" },
                  { id: "telegram", label: "✈️ Telegram", color: "border-sky-500 text-sky-700 bg-sky-50" },
                  { id: "linkedin", label: "💼 LinkedIn", color: "border-indigo-600 text-indigo-700 bg-indigo-50" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSocialPreview(item.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      socialPreview === item.id
                        ? `${item.color} shadow-sm ring-2 ring-indigo-300 font-black`
                        : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Render Selected Social Card Preview Box */}
              <div className="mt-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner flex justify-center">
                {socialPreview === "whatsapp" && (
                  <div className="bg-[#e5ddd5] p-3 rounded-2xl border border-slate-300 w-full max-w-md">
                    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                      <div className="h-48 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={seo.ogImage || DEFAULT_SEO_CONFIG.ogImage}
                          alt="OG Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3.5 bg-[#f0f2f5] space-y-1">
                        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider truncate">
                          E-VEDHIKA.IN
                        </p>
                        <h5 className="text-sm font-bold text-slate-900 leading-tight">
                          {seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}
                        </h5>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                          {seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {socialPreview === "facebook" && (
                  <div className="bg-white p-3 rounded-2xl border border-slate-300 w-full max-w-md shadow-md space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center gap-0.5 justify-center text-xs">
                        EV
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">E-Vedhika Official</p>
                        <p className="text-[10px] text-slate-400">Just now • 🌐 Public</p>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="h-48 w-full bg-slate-100">
                        <img
                          src={seo.ogImage || DEFAULT_SEO_CONFIG.ogImage}
                          alt="Facebook Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-slate-100/80">
                        <span className="text-[9px] uppercase font-bold text-slate-500 block">E-VEDHIKA.IN</span>
                        <h5 className="text-sm font-bold text-slate-900 leading-snug">{seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}</h5>
                        <p className="text-xs text-slate-600 line-clamp-2">{seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}</p>
                      </div>
                    </div>
                  </div>
                )}

                {socialPreview === "twitter" && (
                  <div className="bg-black text-white p-4 rounded-2xl border border-slate-800 w-full max-w-md shadow-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-400">
                        𝕏
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">E-Vedhika Portal <span className="text-slate-400 font-normal">@EVedhikaOfficial</span></p>
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-slate-800">
                      <div className="h-48 w-full bg-slate-900">
                        <img
                          src={seo.ogImage || DEFAULT_SEO_CONFIG.ogImage}
                          alt="Twitter Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-slate-900/90">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">e-vedhika.in</span>
                        <h5 className="text-xs font-bold text-white">{seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}</h5>
                        <p className="text-[11px] text-slate-400 line-clamp-2">{seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}</p>
                      </div>
                    </div>
                  </div>
                )}

                {socialPreview === "telegram" && (
                  <div className="bg-[#17212b] text-white p-4 rounded-2xl border border-slate-700 w-full max-w-md shadow-lg space-y-2">
                    <div className="border-l-2 border-sky-400 pl-3 py-1 space-y-1">
                      <span className="text-[10px] font-bold text-sky-400 uppercase">E-Vedhika Portal</span>
                      <h5 className="text-xs font-bold text-white">{seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}</h5>
                      <p className="text-[11px] text-slate-300 line-clamp-2">{seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}</p>
                      <div className="h-40 w-full rounded-lg overflow-hidden mt-2">
                        <img
                          src={seo.ogImage || DEFAULT_SEO_CONFIG.ogImage}
                          alt="Telegram Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {socialPreview === "linkedin" && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-300 w-full max-w-md shadow-md space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LinkedIn Article Card</span>
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                      <div className="h-48 w-full bg-slate-100">
                        <img
                          src={seo.ogImage || DEFAULT_SEO_CONFIG.ogImage}
                          alt="LinkedIn Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 bg-slate-50">
                        <h5 className="text-xs font-bold text-slate-900">{seo.ogTitle || DEFAULT_SEO_CONFIG.ogTitle}</h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{seo.ogDescription || DEFAULT_SEO_CONFIG.ogDescription}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-1 block">e-vedhika.in</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
