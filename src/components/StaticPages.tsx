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
  return <PageTemplate pageId="privacy" defaultTitle="Privacy Policy" defaultContent={`
### 1. మేము సేకరించే సమాచారం (Information We Collect)
**E-VEDHIKA** (e-vedhika.in) వద్ద, మేము మీ గోప్యతను గౌరవిస్తాము. మీ ఖాతా వివరాలు, సిస్టమ్ లాగ్‌లు మరియు మెరుగైన సేవలను అందించడానికి అవసరమైన ప్రాధాన్యతలను మాత్రమే మేము సేకరిస్తాము.

### 2. మేము డేటాను ఎలా ఉపయోగిస్తాము (How We Use Data)
- మా డిప్లాయ్‌మెంట్ టూల్స్ మరియు అడ్మినిస్ట్రేటివ్ ఫీచర్లను నిర్వహించడానికి మరియు మెరుగుపరచడానికి.
- ముఖ్యమైన సిస్టమ్ నోటిఫికేషన్లు, అప్‌డేట్లు మరియు ప్రకటనలను పంపడానికి.
- ప్లాట్‌ఫారమ్ భద్రతను నిర్ధారించడానికి మరియు సాంకేతిక సమస్యలను పరిష్కరించడానికి.

### 3. డేటా భద్రత (Data Security)
మీ డేటాను అనధికారిక యాక్సెస్ నుండి రక్షించడానికి మేము బలమైన భద్రతా చర్యలు, ఎన్క్రిప్షన్ మరియు సురక్షిత క్లౌడ్ స్టోరేజ్‌ని ఉపయోగిస్తాము.

### 4. థర్డ్-పార్టీ సేవలు (Third-Party Services)
మేము మీ వ్యక్తిగత సమాచారాన్ని ఇతరులకు విక్రయించము. డేటా కేవలం విశ్వసనీయ క్లౌడ్ ప్రొవైడర్ల (Firebase, Cloud Run) ద్వారా మాత్రమే ప్రాసెస్ చేయబడుతుంది.
  `} />;
}

export function TermsPage() {
  return <PageTemplate pageId="terms" defaultTitle="Terms & Conditions" defaultContent={`
### 1. పరిచయం (Introduction)
**E-VEDHIKA** (e-vedhika.in) కు స్వాగతం. ఈ వేదికను ఉపయోగించడం ద్వారా, మీరు మా నిబంధనలు మరియు షరతులకు కట్టుబడి ఉండటానికి అంగీకరిస్తున్నారు. **ఈ-వేదిక ఒక ప్రైవేట్ సాంకేతిక వేదిక మరియు దీనికి ఎటువంటి ప్రభుత్వ సంస్థతో సంబంధం లేదు.**

### 2. వినియోగ విధానం (Usage Policy)
- వినియోగదారులు ప్లాట్‌ఫారమ్‌ను బాధ్యతాయుతంగా మరియు చట్టబద్ధమైన సాంకేతిక ప్రయోజనాల కోసం మాత్రమే ఉపయోగించాలి.
- సిస్టమ్ భద్రతను ఉల్లంఘించడానికి లేదా అనధికారికంగా యాక్సెస్ చేయడానికి ప్రయత్నించడం ఖచ్చితంగా నిషేధించబడింది.

### 3. మేధో సంపత్తి (Intellectual Property)
ఈ-వేదికలోని అన్ని కంటెంట్, సాధనాలు, కోడ్ మరియు డిజైన్లు మా మేధో సంపత్తి హక్కుల ద్వారా రక్షించబడతాయి. ముందస్తు అనుమతి లేకుండా వీటిని వాణిజ్యపరంగా ఉపయోగించడం నిషేధం.

### 4. బాధ్యత పరిమితి (Limitation of Liability)
మేము గరిష్ట విశ్వసనీయత కోసం ప్రయత్నిస్తాము, కానీ బాహ్య నెట్‌వర్క్ సమస్యలు లేదా థర్డ్-పార్టీ సేవల డౌన్‌టైమ్‌కు మేము బాధ్యత వహించము.

### 5. సంప్రదించండి (Contact Information)
ఈ నిబంధనలకు సంబంధించి ఏవైనా ప్రశ్నలు ఉంటే, దయచేసి మా అధికారిక సపోర్ట్ ఛానెల్స్ ద్వారా సంప్రదించండి.
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
      defaultTitle="About E-Vedhika"
      extraHeader={overviewSection}
      defaultContent={`
### 🌟 ఈ-వేదిక: ఆల్ ప్రాబ్లమ్స్ వన్ సొల్యూషన్ (About Us)
**E-Vedhika** అనేది సాఫ్ట్‌వేర్ కాన్ఫిగరేషన్‌లు, డిజిటల్ సిగ్నేచర్ సెటప్‌లు మరియు ఐటీ సపోర్ట్ సేవలను సులభతరం చేయడానికి రూపొందించబడిన ఒక స్వతంత్ర అడ్మినిస్ట్రేటివ్ మరియు టెక్నికల్ ప్లాట్‌ఫారమ్.

**ముఖ్య గమనిక:** ఈ-వేదిక ఒక స్వతంత్ర ప్రైవేట్ ప్లాట్‌ఫారమ్. దీనికి ఎటువంటి ప్రభుత్వ సంస్థతో సంబంధం లేదు.

### 🚀 ప్రధాన ఫీచర్లు (Key Features)
- **డిప్లాయ్‌మెంట్ టూల్స్**: ఆటోమేటెడ్ కాన్ఫిగరేషన్ మరియు సిస్టమ్ మానిటరింగ్.
- **రియల్-టైమ్ మానిటరింగ్**: సర్వర్ ఆరోగ్యం మరియు ప్లాట్‌ఫారమ్ లభ్యత యొక్క ప్రత్యక్ష స్థితి ట్రాకింగ్.
- **సురక్షిత అడ్మిన్ కంట్రోల్స్**: ఆడిట్ లాగ్‌లు మరియు నేరుగా అడ్మినిస్ట్రేటివ్ కమ్యూనికేషన్.
- **సమగ్ర గైడ్లు**: యూటిలిటీ ఫార్మాట్లు మరియు ట్రబుల్షూటింగ్ డాక్యుమెంటేషన్.

### 📞 సంప్రదించండి (Contact & Support)
- **Email**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **Telegram**: [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
- **WhatsApp**: [WhatsApp సపోర్ట్](https://wa.me/919985402310) (నెంబర్ గోప్యంగా ఉంచబడింది)
  `}
    />
  );
}

export function ContactPage() {
  return <PageTemplate pageId="contact" defaultTitle="Contact Us" defaultContent={`
### 📞 మమ్మల్ని సంప్రదించండి (Get in Touch)
**E-VEDHIKA** కు సంబంధించి మీకు ఏవైనా ప్రశ్నలు, సూచనలు లేదా సాంకేతిక మద్దతు అభ్యర్థనలు ఉంటే, మేము సహాయం చేయడానికి ఇక్కడ ఉన్నాము!

- **అధికారిక వెబ్‌సైట్**: [https://e-vedhika.in](https://e-vedhika.in)
- **సపోర్ట్ ఛానెల్స్**: అడ్మిన్‌లను సంప్రదించడానికి యాప్‌లోని **Suggestions / Support** ప్యానెల్ లేదా డైరెక్ట్ మెసేజ్ సిస్టమ్‌ను ఉపయోగించండి.
- **మెయిల్**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **టెలిగ్రామ్**: [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
- **వాట్సాప్**: [WhatsApp సపోర్ట్](https://wa.me/919985402310) (నెంబర్ గోప్యంగా ఉంచబడింది)
  `} />;
}

export function SitemapContent({ onNavigate }: { onNavigate?: () => void }) {
  const categories = [
    {
      title: "Products & Tools",
      items: [
        { name: "Home", path: "/", desc: "Portal Main Page & Citizen Services" },
        { name: "Workspace", path: "/workspace", desc: "Daily Operations & Work Tools" },
        { name: "UBD Settings & DSK Guide", path: "/ubd-settings-dsk-issues", desc: "Telangana & AP UBD Portal DSK, DSC & Browser Fixes" },
        { name: "GOs & Formats", path: "/gos_formats", desc: "Government Orders & Application Formats" },
        { name: "Farmer Registry", path: "/farmer_registry", desc: "Farmer Verification & Registry Tool" },
        { name: "Software Hub", path: "/software_hub", desc: "Utility Softwares, Tools & Drivers" },
        { name: "GPDP Planning", path: "/gpdp_setup", desc: "Gram Panchayat Development Plan Tool" },
        { name: "DSR Tables", path: "/workspace/dsr", desc: "Estimation & Work Calculators" },
        { name: "Monthly Activity", path: "/workspace/monthly-activity", desc: "Monthly Work Activity Formatter" },
      ]
    },
    {
      title: "Resources & Documents",
      items: [
        { name: "Citizen Updates & Posts", path: "/home/post", desc: "Latest Announcements & News" },
        { name: "Knowledge Hub & PR Act", path: "/workspace/pract", desc: "Panchayat Raj Acts & Legal Guides" },
        { name: "PDF Compress", path: "/pdf_compress", desc: "Online File Size Compression Tool" },
        { name: "Excel Printer Tool", path: "/excel_print", desc: "Clean Sheet Printing & A4 Formats" },
        { name: "Excel Merger", path: "/workspace/excel-merge", desc: "Combine Multiple Excel Spreadsheets" },
        { name: "UBD Live Tracker", path: "/ubd_tracker", desc: "Live Monitoring & Status Dashboard" },
      ]
    },
    {
      title: "Portal & Governance",
      items: [
        { name: "About Us", path: "/about", desc: "Mission, Governance & Platform Overview" },
        { name: "Contact Us", path: "/contact", desc: "Official Helpdesk & Support Desk" },
        { name: "Suggestions & Support", path: "/suggestions", desc: "Feedback, Tickets & Grievances" },
        { name: "Emergency Services", path: "/emergency", desc: "Key Emergency Helpline Numbers" },
        { name: "Privacy Policy", path: "/privacy", desc: "Data Protection & Privacy Policy" },
        { name: "Terms & Conditions", path: "/terms", desc: "Platform Rules, Regulations & Terms" },
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
                సమాధానం: ఈ-వేదిక పోర్టల్‌లో పంచాయతీ కార్యదర్శులు మరియు ఆపరేటర్ల కోసం ప్రత్యక్ష UBD ట్రాకర్, DSK డ్రైవర్ల డౌన్‌లోడ్స్, మరియు ఆటోమేటెడ్ సెటప్ ఫైల్స్ అందుబాటులో ఉన్నాయి.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
