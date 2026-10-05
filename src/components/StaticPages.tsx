import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Sparkles } from 'lucide-react';

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
- **Telegram**: త్వరిత సహాయం కోసం టెలిగ్రామ్ ద్వారా సంప్రదించండి.
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
- **మెయిల్**: evedhikasupport@gmail.com
  `} />;
}
