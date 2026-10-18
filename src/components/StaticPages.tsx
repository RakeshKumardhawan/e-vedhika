import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Sparkles, FolderTree, Globe, ChevronRight, Key, ShieldCheck, AlertTriangle, CheckCircle2, Download, ExternalLink, HelpCircle, ArrowLeft } from 'lucide-react';

function useStaticPage(pageId: string) {
  const [data, setData] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const snap = await getDoc(doc(db, "settings", "static_pages"));
        if (snap.exists() && snap.data()[pageId]) {
          setData(snap.data()[pageId]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageId]);

  return { data, loading };
}

function PageTemplate({ pageId, defaultTitle, defaultContent, extraHeader }: { pageId: string, defaultTitle: string, defaultContent: string, extraHeader?: React.ReactNode }) {
  const { data, loading } = useStaticPage(pageId);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-50 text-slate-800 p-8 sm:p-12 font-sans flex justify-center items-center overflow-y-auto">
        <div className="text-slate-500 font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  const title = data?.title || defaultTitle;
  const rawContent = data?.content;
  const content = (!rawContent || rawContent.includes("not set yet") || rawContent.trim() === "") ? defaultContent : rawContent;

  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen h-[100dvh] bg-slate-50 text-slate-800 p-4 sm:p-12 font-sans overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-8 rounded-3xl shadow-xl my-6">
        <Link to="/" className="text-primary font-bold hover:underline mb-4 inline-block">&larr; Back to Home</Link>
        
        {/* Disclaimer Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 leading-relaxed">
          <strong>Disclaimer:</strong> E-VEDHIKA (e-vedhika.in) is an independent private technical utility platform created for automation, deployment assistance, code management, and system monitoring. <strong>This website has no connection, affiliation, partnership, or authorization with any government department or external public entity.</strong>
        </div>

        {extraHeader}

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 border-b pb-4">{title}</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 markdown-body">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return <PageTemplate pageId="privacy" defaultTitle="గోప్యతా విధానం (Privacy Policy)" defaultContent={`
### 🛡️ గోప్యతా విధానం (Privacy Policy)
**E-VEDHIKA** (e-vedhika.in) పోర్టల్‌లో వినియోగదారుల వ్యక్తిగత వివరాలు మరియు డేటా భద్రతకు మేము అత్యున్నత ప్రాధాన్యత ఇస్తాము. ఈ పాలసీ ద్వారా మేము డేటాను ఎలా సేకరిస్తాము, ఉపయోగిస్తాము మరియు రక్షిస్తామో పారదర్శకంగా తెలియజేస్తున్నాము.

---

### 1. మేము సేకరించే సమాచారం (Information We Collect)
- **ఖాతా ప్రొఫైల్ సమాచారం**: పేరు, ఇమెయిల్ అడ్రస్, జిల్లా, మండలం, గ్రామ పంచాయతీ పేరు మరియు ఫోన్ నంబర్.
- **సిస్టమ్ & లాగిన్ డేటా**: లాగిన్ సమయం, IP చిరునామా, బ్రౌజర్ టైప్ మరియు అప్లికేషన్ వినియోగ లాగ్‌లు.
- **అప్‌లోడ్ చేసిన ఫైళ్లు & మీడియా**: మీరు సపోర్ట్ అభ్యర్థనలు లేదా కామెంట్‌లలో అప్‌లోడ్ చేసిన ఇమేజ్‌లు మరియు డాక్యుమెంట్‌లు.

---

### 2. డేటా వినియోగ విధానం (How We Use Your Data)
- **ఐటీ సపోర్ట్ & సేవల నిర్వహణ**: UBD డీఎస్కే, డీఎస్సీ సెటప్‌లు, రోజువారీ రిపోర్ట్‌లు మరియు పోర్టల్ ఫీచర్లు అందించడానికి.
- **కమ్యూనికేషన్ & అలర్ట్‌లు**: సేవలకు సంబంధించిన ముఖ్యమైన అప్‌డేట్లు, టెలిగ్రామ్ అలర్ట్‌లు మరియు నోటిఫికేషన్‌లు పంపడానికి.
- **భద్రత & ఆడిటింగ్**: సిస్టమ్‌ను అనధికారిక యాక్సెస్ నుండి రక్షించడానికి మరియు లాగ్‌లను తనిఖీ చేయడానికి.

---

### 3. డేటా భద్రత & నిల్వ (Data Security & Cloud Storage)
- మీ వివరాలన్నీ **Google Firebase & SSL Encryption** తో అత్యున్నత భద్రతతో సేవ్ చేయబడతాయి.
- మేము మీ వ్యక్తిగత సమాచారాన్ని ఏ ఇతర మూడో పక్షానికి (Third-party) విక్రయించము లేదా వాణిజ్యపరంగా పంచుకోము.

---

### 4. కుకీలు & బ్రౌజర్ క్యాషే (Cookies & Local Cache)
- పోర్టల్ వేగంగా లోడ్ అవ్వడానికి మరియు PWA ఆఫ్‌లైన్ సేవలకు బ్రౌజర్ లోకల్ స్టోరేజ్ (Local Storage/Cache) ఉపయోగించబడుతుంది.

---

### 5. సంప్రదించండి (Contact Information)
గోప్యతా విధానంపై ఏవైనా సందేహాలు ఉంటే మా సపోర్ట్ బృందాన్ని సంప్రదించండి:
- **Support Email**: [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **Admin Email**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
  `} />;
}

export function TermsPage() {
  return <PageTemplate pageId="terms" defaultTitle="నిబంధనలు & షరతులు (Terms & Conditions)" defaultContent={`
### 📜 నిబంధనలు & షరతులు (Terms & Conditions)
**E-VEDHIKA** (e-vedhika.in) ప్లాట్‌ఫారమ్‌ను ఉపయోగించడం ద్వారా, మీరు క్రింది నిబంధనలు మరియు షరతులకు అంగీకరిస్తున్నట్లు భావించబడుతుంది.

---

### 1. ప్రైవేట్ వేదిక స్పష్టీకరణ (Disclaimer & Independence)
- **ఈ-వేదిక (E-VEDHIKA)** అనేది పంచాయతీ కార్యదర్శులు, ఆపరేటర్లు మరియు సిబ్బందికి సాంకేతిక సహాయం అందించడానికి రూపొందించబడిన **స్వతంత్ర ప్రైవేట్ సాంకేతిక పోర్టల్**.
- **దీనికి ఏ ప్రభుత్వ శాఖ, పంచాయతీ రాజ్ విభాగం లేదా ప్రభుత్వ అధికారిక సంస్థతో ఎటువంటి నేరుగా అనుబంధం లేదా భాగస్వామ్యం లేదు.**

---

### 2. అనుమతించబడిన వినియోగం (Acceptable Use)
- ప్లాట్‌ఫారమ్‌లోని సాధనాలు, గైడ్‌లు మరియు ఫార్మాట్‌లను కేవలం అధికారిక కార్యాలయ సహాయం మరియు సాంకేతిక అవసరాలకు మాత్రమే ఉపయోగించాలి.
- సిస్టమ్ సెక్యూరిటీని ఉల్లంఘించడం, వ్యాపార రీత్యా డేటాను స్క్రాప్ చేయడం లేదా అనధికారిక యాక్సెస్ పొందడం నిషేధించబడింది.

---

### 3. ఖాతా భద్రత & లాగిన్ బాధ్యత (Account Responsibility)
- మీ ఖాతా లాగిన్ వివరాలు, PIN మరియు లాగిన్ సెషన్‌లను సురక్షితంగా ఉంచుకోవడం మీ బాధ్యత.
- మీ ఖాతా ద్వారా జరిగే అన్ని కార్యకలాపాలకు మీరే బాధ్యత వహించాలి.

---

### 4. బాధ్యతా రాహిత్య ప్రకటన (Limitation of Liability)
- నెట్‌వర్క్ సమస్యలు, బాహ్య సర్వర్ల డౌన్‌టైమ్ లేదా థర్డ్-పార్టీ సాఫ్ట్‌వేర్ లోపాల కారణంగా జరిగే ఆలస్యాలకు ఈ-వేదిక బాధ్యత వహించదు.

---

### 5. సవరణలు & సంప్రదింపులు (Updates & Contact)
- మేము ఈ నిబంధనలను ఎప్పటికప్పుడు సమీక్షించి అప్‌డేట్ చేసే హక్కును కలిగి ఉన్నాము.
- ఏవైనా సందేహాలు ఉంటే [support@e-vedhika.in](mailto:support@e-vedhika.in) కి ఇమెయిల్ చేయవచ్చు.
  `} />;
}

export function AboutPage({ landingPageData }: { landingPageData?: any }) {
  const [localLandingData, setLocalLandingData] = useState<any>(landingPageData || null);

  useEffect(() => {
    if (landingPageData) {
      setLocalLandingData(landingPageData);
    } else {
      getDoc(doc(db, "settings", "landing_page"))
        .then((snap) => {
          if (snap.exists()) {
            setLocalLandingData(snap.data());
          }
        })
        .catch(() => {});
    }
  }, [landingPageData]);

  const overview = localLandingData || {
    heroTitle: "Streamlining Governance & Citizen Services in",
    heroHighlight: "Andhra Pradesh & Telangana",
    heroSubtitle:
      "E-Vedhika is a comprehensive digital platform designed to bridge the gap between citizens and government administration. By digitizing records and streamlining grievance redressal, we ensure transparent, accountable, and efficient governance at the grassroots level.",
  };

  const overviewSection = (
    <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-10 shadow-sm border border-blue-100 text-center space-y-6 w-full mx-auto flex flex-col items-center relative overflow-hidden my-6">
      {/* Decorative background blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100/50 blur-3xl rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 inline-flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60 rounded-full text-blue-700 text-xs sm:text-sm font-black uppercase tracking-[0.15em] shadow-xs">
        <Sparkles size={14} className="text-blue-500" />
        E-VEDHIKA OVERVIEW
      </div>

      <h2 className="relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl w-full">
        {overview.heroTitle}{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          {overview.heroHighlight}
        </span>
      </h2>

      {overview.heroSubtitle && (
        <div
          className="relative z-10 text-base sm:text-lg text-slate-600 leading-relaxed font-medium ql-editor px-0 max-w-3xl mx-auto w-full"
          style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
          dangerouslySetInnerHTML={{ __html: overview.heroSubtitle }}
        />
      )}

      {overview?.metaDescription?.trim() ? (
        <div className="relative z-10 max-w-2xl mx-auto p-4 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 rounded-2xl text-slate-700 text-sm md:text-base leading-relaxed text-center font-medium shadow-xs">
          <span className="inline-flex items-center gap-1.5 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1.5 block">
            <Sparkles size={13} className="text-blue-600 inline" />
            ల్యాండింగ్ పేజీ ముఖ్యాంశం / Overview
          </span>
          {overview.metaDescription.trim()}
        </div>
      ) : null}
    </div>
  );

  return (
    <PageTemplate
      pageId="about"
      defaultTitle="మా గురించి (About E-Vedhika)"
      extraHeader={overviewSection}
      defaultContent={`
### 🌟 ఈ-వేదిక: ఆల్ ప్రాబ్లమ్స్ వన్ సొల్యూషన్ (About Us)
**E-Vedhika** అనేది తెలంగాణ మరియు ఏపీ పంచాయతీ ఆపరేటర్లు, పంచాయతీ కార్యదర్శులు, మరియు జిల్లా స్థాయి నివేదికలకు డిస్ట్రిక్ట్ ప్రాజెక్ట్ మేనేజర్ల (DPM) రోజువారీ ఆఫీసు పనులు, సాఫ్ట్‌వేర్ కాన్ఫిగరేషన్‌లు, డీఎస్కే సమస్యల పరిష్కారం మరియు టెక్నికల్ సపోర్ట్ (Technical Support) కోసం రూపొందించబడిన సమగ్ర డిజిటల్ ప్లాట్‌ఫారమ్.

---

### 🚀 ప్రధాన ఫీచర్లు & సేవలు (Core Capabilities)
- **UBD Settings & DSK Troubleshooting**: తెలంగాణ & ఏపీ పంచాయతీ UBD పోర్టల్ డీఎస్కే, డీఎస్సీ డిజిటల్ సిగ్నేచర్ డ్రైవర్లు మరియు బ్రౌజర్ పరిష్కారాలు.
- **DSR Analyzer & Calculators**: సివిల్ మరియు పంచాయతీ పనుల అంచనాలు, డిజిటల్ మ్యాపింగ్ మరియు DSR వర్క్ టేబుల్స్.
- **Farmer Registry & Verification**: రైతు రిజిస్ట్రీ మరియు లబ్ధిదారుల వివరాల సరిచూసే నిష్పాక్షిక సాధనం.
- **GOs & Utility Formats**: జీవోలు, అధికారిక అప్లికేషన్ ఫార్మాట్‌లు మరియు డౌన్‌లోడ్స్.
- **Software Hub**: ePass2003, mToken, జావాలు, కంపెసర్లు మరియు అవసరమైన సాఫ్ట్‌వేర్లు.

---

### 📞 సంప్రదింపుల వివరాలు (Contact & Support Channels)
- **1. Support Email (సపోర్ట్ & సహాయం)**: [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **2. Admin Email (అడ్మిన్ & భద్రత)**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **Telegram Bot**: [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
- **WhatsApp Support**: [WhatsApp సపోర్ట్ చాట్](https://wa.me/919985402310)
  `}
    />
  );
}

export function ContactPage() {
  return <PageTemplate pageId="contact" defaultTitle="సంప్రదించండి (Contact & Support)" defaultContent={`
### 📞 మమ్మల్ని సంప్రదించండి (Get in Touch)
**E-VEDHIKA** పోర్టల్‌కు సంబంధించి మీకు ఏవైనా సాంకేతిక సందేహాలు, ఫిర్యాదులు లేదా సూచనలు ఉంటే సహాయం చేయడానికి మేము సిద్ధంగా ఉన్నాము.

---

### ✉️ ఇమెయిల్ సపోర్ట్ (Email Channels)
- **1. Support Email (సపోర్ట్ & సహాయం)**: [support@e-vedhika.in](mailto:support@e-vedhika.in)
  - సపోర్ట్ అభ్యర్థనలు, సాంకేతిక సందేహాలు మరియు సహాయం కోసం.
- **2. Admin Email (అడ్మిన్ & భద్రత)**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
  - వెబ్‌సైట్ నిర్వహణ, అత్యవసర అడ్మిన్ సమాచారం కోసం.

---

### 💬 సోషల్ & మెసేజింగ్ ఛానెల్స్ (Instant Messaging)
- **WhatsApp సపోర్ట్ చాట్**: [మమ్మల్ని వాట్సాప్‌లో సంప్రదించండి](https://wa.me/919985402310)
- **Telegram అలెర్ట్స్ బోట్**: [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
- **సపోర్ట్ & గ్రీవెన్స్ ప్యానెల్**: పోర్టల్‌లోని **Suggestions / Support Panel** ద్వారా నేరుగా టికెట్ నమోదు చేయవచ్చు.

---

### ⏰ పని వేళలు (Office Hours)
- **సోమవారం నుండి శనివారం వరకు**: ఉదయం 10:00 AM నుండి సాయంత్రం 05:00 PM వరకు.
  `} />;
}

export function SitemapContent({ onNavigate }: { onNavigate?: () => void }) {
  const categories = [
    {
      title: "ప్రధాన విభాగములు & ఉత్పత్తులు (Products & Tools)",
      items: [
        { name: "Home Dashboard", path: "/", desc: "పోర్టల్ ప్రధాన హోమ్‌పేజీ & సేవలు" },
        { name: "Workspace", path: "/workspace", desc: "రోజువారీ ఆఫీసు పనులు & పరికరాలు" },
        { name: "UBD Settings & DSK Guide", path: "/ubd-settings-dsk-issues", desc: "తెలంగాణ & ఏపీ UBD పోర్టల్ DSK, DSC & బ్రౌజర్ పరిష్కారాలు" },
        { name: "GOs & Formats", path: "/gos_formats", desc: "ప్రభుత్వ జీవోలు & అధికారిక అప్లికేషన్ ఫార్మాట్‌లు" },
        { name: "Farmer Registry", path: "/farmer_registry", desc: "రైతు రిజిస్ట్రీ & లబ్ధిదారుల తనిఖీ సాధనం" },
        { name: "Software Hub", path: "/software_hub", desc: "ePass, mToken, జావాలు, డ్రైవర్లు & సాఫ్ట్‌వేర్లు" },
        { name: "GPDP Planning", path: "/gpdp_setup", desc: "గ్రామ పంచాయతీ డెవలప్‌మెంట్ ప్లాన్ సాధనం" },
        { name: "DSR Tables & Calculators", path: "/workspace/dsr", desc: "సివిల్ పనుల అంచనాలు & DSR క్యాలిక్యులేటర్" },
        { name: "Monthly Activity Formatter", path: "/workspace/monthly-activity", desc: "నెలవారీ పని నివేదికలు & రిపోర్ట్‌లు" },
        { name: "Attendance & Multi-Day Log", path: "/workspace/attendance", desc: "హాజరు వివరాలు & రిజిస్టర్ నమోదు" },
      ]
    },
    {
      title: "వనరులు, సాధనాలు & మీడియా (Resources & Media)",
      items: [
        { name: "Announcements & Posts", path: "/home/post", desc: "తాజా పంచాయతీ వార్తలు & ప్రకటనలు" },
        { name: "Knowledge Hub & PR Act", path: "/workspace/pract", desc: "పంచాయతీ రాజ్ చట్టాలు & లీగల్ మార్గదర్శకాలు" },
        { name: "PDF Compress Tool", path: "/pdf_compress", desc: "ఆన్‌లైన్ ఫైల్ సైజ్ కుదింపు సాధనం" },
        { name: "Excel Printer Tool", path: "/excel_print", desc: "A4 క్లీన్ షీట్ ప్రింటింగ్ & ఫార్మాట్లు" },
        { name: "Excel Merger Tool", path: "/workspace/excel-merge", desc: "మల్టిపుల్ ఎక్సెల్ స్ప్రెడ్‌షీట్ల విలీనం" },
        { name: "UBD Live Tracker", path: "/ubd_tracker", desc: "ప్రత్యక్ష మానిటరింగ్ & సర్వర్ స్టేటస్ డ్యాష్‌బోర్డ్" },
        { name: "Media Vault", path: "/vault", desc: "మీడియా వాల్ట్ & ఇమేజ్ గ్యాలరీ" },
        { name: "Direct Messages / Inbox", path: "/workspace/messages", desc: "డైరెక్ట్ మెసేజింగ్ & సపోర్ట్ చాట్" },
      ]
    },
    {
      title: "పోర్టల్ సమాచారం & మద్దతు (Portal & Support)",
      items: [
        { name: "About Us (మా గురించి)", path: "/about", desc: "పోర్టల్ లష్యాలు, సమాచారం & అవలోకనం" },
        { name: "Contact Support (సంప్రదించండి)", path: "/contact", desc: "అధికారిక హెల్ప్‌డెస్క్, ఇమెయిల్స్ & వాట్సాప్ చాట్" },
        { name: "Suggestions & Grievances", path: "/suggestions", desc: "సూచనలు, ఫిర్యాదులు & టికెట్ మద్దతు" },
        { name: "Emergency Helplines", path: "/emergency", desc: "కీలక అత్యవసర హెల్ప్‌లైన్ నంబర్లు" },
        { name: "Privacy Policy (గోప్యతా విధానం)", path: "/privacy", desc: "డేటా భద్రత & గోప్యతా విధానము" },
        { name: "Terms & Conditions (నిబంధనలు)", path: "/terms", desc: "పోర్టల్ వినియోగ నిబంధనలు & షరతులు" },
        { name: "Sitemap Directory", path: "/sitemap", desc: "సంపూర్ణ పోర్టల్ డైరెక్టరీ & నేవిగేషన్" },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Visual Hierarchy Tree representation matching example */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-slate-200">
          <div className="px-5 py-2 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-md flex items-center gap-2">
            <Globe size={16} /> E-VEDHIKA (Home)
          </div>
          <div className="w-0.5 h-6 bg-slate-300 my-1" />
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">
            Hierarchical Site Structure
          </div>
        </div>

        {/* Tree branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
          {categories.map((cat, idx) => (
            <div key={idx} className="flex flex-col space-y-2.5">
              <div className="p-2.5 bg-white border border-slate-200 rounded-2xl shadow-xs text-center font-black text-xs sm:text-sm text-slate-800 border-t-4 border-t-blue-500">
                {cat.title}
              </div>
              <div className="space-y-2">
                {cat.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    onClick={() => onNavigate && onNavigate()}
                    className="p-2.5 bg-white border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 rounded-xl transition-all shadow-xs flex items-center justify-between group block"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                        {item.desc}
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SitemapPage() {
  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen h-[100dvh] bg-slate-50 text-slate-800 p-4 sm:p-12 font-sans overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6 bg-white p-6 sm:p-10 rounded-3xl shadow-xl my-6 border border-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <Link to="/" className="text-primary font-bold hover:underline flex items-center gap-1 text-sm">
            &larr; Back to Home
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold">
            <FolderTree size={13} /> E-Vedhika Sitemap
          </div>
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Sitemap & Directory
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Complete hierarchical directory of all sections, public services, utility tools, and policy pages on E-Vedhika.
          </p>
        </div>

        <SitemapContent />
      </div>
    </div>
  );
}

export function UbdDskTroubleshootingPage() {
  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen h-[100dvh] bg-slate-50 text-slate-800 p-4 sm:p-8 md:p-12 font-sans overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8 bg-white p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl my-6 border border-slate-200/80">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 text-sm transition-colors">
            <ArrowLeft size={16} /> హోమ్ పేజీకి తిరిగి వెళ్లండి (Back to Home)
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-bold">
            <ShieldCheck size={14} className="text-emerald-600" /> అఫీషియల్ గైడ్ (Official Troubleshooting)
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-block px-3 py-1 bg-blue-100/70 text-blue-800 rounded-lg text-xs font-extrabold uppercase tracking-wider">
            Bilingual Technical Guide • ద్విభాషా సాంకేతిక గైడ్
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            UBD Settings, DSC & DSK Issues Solution Guide
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-semibold leading-relaxed">
            తెలంగాణ &amp; ఏపీ పంచాయతీ UBD పోర్టల్, డిజిటల్ సిగ్నేచర్ కీ (DSK) మరియు DSC టోకెన్ సమస్యల పూర్తి పరిష్కారాలు.
          </p>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-blue-800 font-black text-sm">
              <Key size={16} className="text-blue-600" /> UBD Settings
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              క్రోమ్ &amp; ఎడ్జ్ బ్రౌజర్ పాప్-అప్స్, జావా రన్‌టైమ్ మరియు లోకల్‌హోస్ట్ పోర్ట్ సెట్టింగ్స్.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
              <ShieldCheck size={16} className="text-emerald-600" /> DSC &amp; DSK Setup
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              ePass2003, mToken, ProxKey క్రిప్టో టోకెన్ డ్రైవర్లు &amp; సర్టిఫికేట్ చెల్లుబాటు ధృవీకరణ.
            </p>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
              <AlertTriangle size={16} className="text-amber-600" /> TG &amp; AP UBD Fixes
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              తెలంగాణ &amp; ఆంధ్రప్రదేశ్ పంచాయతీ UBD సైట్‌లలో సైనింగ్ ఎర్రర్స్ పరిష్కారాలు.
            </p>
          </div>
        </div>

        {/* Section 1: UBD Settings */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              1
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              UBD Settings (యూబీడీ బ్రౌజర్ &amp; సిస్టమ్ సెట్టింగ్స్)
            </h2>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 text-sm text-slate-700 leading-relaxed font-medium">
            <p>
              UBD పోర్టల్ (భవన అనుమతులు, లేఅవుట్ &amp; ట్రేడ్ లైసెన్స్) లో డిజిటల్ సంతకం (DSK) సరిగ్గా పనిచేయడానికి ఈ క్రింది బ్రౌజర్ సెట్టింగ్స్ తప్పనిసరి:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-800 font-medium">
              <li>
                <strong>Pop-ups &amp; Redirects Allow:</strong> Chrome లేదా Edge సెట్టింగ్స్‌లో <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-xs text-blue-700">chrome://settings/content/popups</code> కు వెళ్లి UBD వెబ్‌సైట్ URL ను Allowed లిస్ట్‌లో చేర్చండి.
              </li>
              <li>
                <strong>Insecure Content / Localhost Communication:</strong> DSK సైనింగ్ సర్వీస్ లోకల్ కంప్యూటర్‌లో పోర్ట్ (8080 లేదా 8443) పై రన్ అవుతుంది కాబట్టి బ్రౌజర్ సెక్యూరిటీ బ్లాక్ చేయకుండా అనుమతించాలి.
              </li>
              <li>
                <strong>Clear SSL State &amp; Cache:</strong> ఇంటర్నెట్ ఆప్షన్స్ (Internet Properties) &rarr; Content &rarr; <em>Clear SSL State</em> పై క్లిక్ చేయండి.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: DSC (Digital Signature Certificate) */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              2
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              DSC Setup &amp; Token Registration (డిజిటల్ సిగ్నేచర్ సర్టిఫికెట్)
            </h2>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-sm text-slate-700 leading-relaxed font-medium">
            <p>
              పంచాయతీ కార్యదర్శి లేదా అధికారి యొక్క ఆధార్ మరియు పేరు UBD పోర్టల్ లోని ప్రొఫైల్‌తో ఖచ్చితంగా సరిపోలాలి:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Class 3 DSC Token
                </span>
                <p className="text-xs text-slate-600">
                  ఈ-ముద్ర (eMudhra), కాప్రిగాట్ (Capricorn), లేదా వీ-సైన్ (Vsign) Class 3 సైనింగ్ సర్టిఫికెట్ మాత్రమే అంగీకరించబడుతుంది.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Token Drivers Installation
                </span>
                <p className="text-xs text-slate-600">
                  ePass2003 Auto, mToken CryptoID, లేదా Watchdata ProxKey డ్రైవర్లను సిస్టమ్‌లో ఇన్‌స్టాల్ చేసి రీస్టార్ట్ చేయండి.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: DSK Issues & Troubleshooting */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              3
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              DSK Issues &amp; Solutions (డీఎస్కే లోపాల నివారణ)
            </h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" />
                సమస్య 1: &quot;Token Not Found&quot; లేదా టోకెన్ గుర్తించకపోవడం
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>పరిష్కారం:</strong> USB టోకెన్‌ను తీసి మరొక USB పోర్ట్‌లోకి పెట్టండి. ePass2003 / mToken క్లయింట్ మేనేజర్‌ని ఓపెన్ చేసి మీ సర్టిఫికేట్ కనిపిస్తుందో లేదో చూడండి.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" />
                సమస్య 2: &quot;DSK Signer Service Not Running&quot;
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>పరిష్కారం:</strong> మీ కంప్యూటర్‌లోని DSK సైనింగ్ అప్లికేషన్‌ను <em>Run as Administrator</em> ద్వారా ప్రారంభించండి. విండోస్ డిఫెండర్ లేదా యాంటీవైరస్ లోకల్‌హోస్ట్ పోర్ట్‌ను బ్లాక్ చేయకుండా తనిఖీ చేయండి.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" />
                సమస్య 3: &quot;Token PIN Locked / Blocked&quot;
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>పరిష్కారం:</strong> 3 సార్లు తప్పు పిన్ ఎంటర్ చేస్తే టోకెన్ లాక్ అవుతుంది. అడ్మిన్ అన్‌బ్లాక్ టూల్ లేదా మీ వెండర్ అందించిన PUK కోడ్‌తో అన్‌లాక్ చేసుకోవాలి.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Telangana & AP UBD Website Specifics */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              4
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              UBD Telangana &amp; AP Website DSK Issues
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2.5">
              <h3 className="font-black text-purple-900 text-sm">
                తెలంగాణ UBD పోర్టల్ (ubd.telangana.gov.in)
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>పంచాయతీ కార్యదర్శి లాగిన్‌లో DSK కీ మ్యాపింగ్ సరిచూసుకోండి.</li>
                <li>Telangana Signer Utility V2.4 లేటెస్ట్ వెర్షన్ వాడండి.</li>
                <li>MIS రిపోర్ట్‌లలో పెండింగ్ అప్లికేషన్ల స్టేటస్ ట్రాక్ చేయండి.</li>
              </ul>
              <a 
                href="https://ubd.telangana.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 mt-1"
              >
                తెలంగాణ UBD సైట్ ఓపెన్ చేయండి <ExternalLink size={12} />
              </a>
            </div>

            <div className="p-5 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-2.5">
              <h3 className="font-black text-sky-900 text-sm">
                ఆంధ్రప్రదేశ్ పంచాయతీ UBD పోర్టల్
              </h3>
              <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                <li>AP గ్రామ వార్డు సచివాలయం / UBD పోర్టల్ DSC సైనింగ్ సర్వీస్.</li>
                <li>జావా రన్‌టైమ్ (JRE 8 Update 200+) కాన్ఫిగరేషన్ చెక్ చేయండి.</li>
                <li>DSC సర్టిఫికెట్ పాత్‌ను సైట్ ఆటో-డిటెక్ట్ చేసేలా అనుమతించండి.</li>
              </ul>
              <Link 
                to="/ubd_tracker" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 mt-1"
              >
                ఈ-వేదిక UBD ట్రాకర్‌కి వెళ్లండి <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Software Hub Action */}
        <section className="p-6 bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <Download size={18} className="text-emerald-400" />
              డ్రైవర్లు &amp; టూల్స్ డౌన్‌లోడ్ చేసుకోండి
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              ఈ-వేదిక Software Hub లో ePass2003, mToken, DSK సెటప్ బ్యాచ్ ఫైల్స్ ఉచితంగా లభిస్తాయి.
            </p>
          </div>
          <Link
            to="/software_hub"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
          >
            Software Hub కు వెళ్లండి
          </Link>
        </section>

        {/* Frequently Asked Questions (FAQ) for Google Search Engine Optimization */}
        <section className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-600" />
            తరచుగా అడిగే ప్రశ్నలు (Frequently Asked Questions)
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-900">
                ప్రశ్న: UBD పోర్టల్‌లో DSC డిజిటల్ సంతకం ఎందుకు ఫెయిల్ అవుతుంది?
              </p>
              <p className="text-slate-600 leading-relaxed font-medium">
                సమాధానం: బ్రౌజర్‌లో పాప్-అప్స్ బ్లాక్ కావడం, USB టోకెన్ డ్రైవర్లు లేకపోవడం, లేదా DSK సైనింగ్ యాప్ రన్ కాకపోవడం వల్ల ఈ సమస్య వస్తుంది. పై గైడ్‌లోని క్రోమ్ సెట్టింగ్స్ మరియు డ్రైవర్లను సరిచేసుకోవడం ద్వారా పరిష్కరించవచ్చు.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-slate-900">
                ప్రశ్న: Telangana &amp; AP UBD వెబ్‌సైట్ సమస్యలకు ఈ-వేదిక ఎలా సహాయపడుతుంది?
              </p>
              <p className="text-slate-600 leading-relaxed font-medium">
                సమాధానం: ఈ-వేదిక పోర్టల్‌లో పంచాయతీ ఆపరేటర్లు, పంచాయతీ కార్యదర్శులు మరియు జిల్లా అధికారుల కోసం ప్రత్యక్ష UBD ట్రాకర్, DSK డ్రైవర్ల డౌన్‌లోడ్స్, మరియు టెక్నికల్ సపోర్ట్ అందుబాటులో ఉన్నాయి.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
