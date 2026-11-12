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

function PolicyFooterNav() {
  const links = [
    { label: "Home (హోమ్)", to: "/" },
    { label: "About Us (మా గురించి)", to: "/about" },
    { label: "Contact Us (సంప్రదించండి)", to: "/contact" },
    { label: "Privacy Policy (గోప్యతా విధానం)", to: "/privacy" },
    { label: "Terms & Conditions (నిబంధనలు)", to: "/terms" },
    { label: "Disclaimer (డిస్క్లైమర్)", to: "/disclaimer" },
    { label: "Cookie Policy (కుకీ విధానం)", to: "/cookie-policy" },
    { label: "Editorial Policy (ఎడిటోరియల్ విధానం)", to: "/editorial-policy" },
    { label: "Sitemap (సైట్‌మ్యాప్)", to: "/sitemap" },
  ];
  return (
    <footer className="mt-10 pt-6 border-t border-slate-200 space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {links.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-colors border border-slate-200/80"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} E-VEDHIKA (www.e-vedhika.in) • Independent Educational &amp; Technical Utility Platform for e-Panchayat Services.
      </p>
    </footer>
  );
}

function PageTemplate({ pageId, defaultTitle, defaultContent, extraHeader }: { pageId: string, defaultTitle: string, defaultContent: string, extraHeader?: React.ReactNode }) {
  const { data } = useStaticPage(pageId);

  const title = data?.title || defaultTitle;
  const rawContent = data?.content;
  const content = (!rawContent || rawContent.includes("not set yet") || rawContent.trim() === "") ? defaultContent : rawContent;

  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen h-[100dvh] bg-slate-50 text-slate-800 p-3 sm:p-6 md:p-10 lg:p-12 font-sans overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-xl my-4 sm:my-6 border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <Link to="/" className="text-primary font-bold hover:underline inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft size={16} /> హోమ్ పేజీకి తిరిగి వెళ్లండి (Back to Home)
          </Link>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Official Policy &amp; Transparency Document
          </span>
        </div>
        
        {/* Disclaimer Banner */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-semibold text-amber-900 leading-relaxed">
          <strong>Disclaimer / గమనిక:</strong> E-VEDHIKA (e-vedhika.in) అనేది పంచాయతీ సిబ్బంది మరియు పౌరుల అవగాహన, ఆఫీస్ ఆటోమేషన్ మరియు సాంకేతిక సహాయం కోసం రూపొందించబడిన స్వతంత్ర ప్రైవేట్ విద్యా &amp; టెక్నికల్ యుటిలిటీ పోర్టల్. <strong>ఈ వెబ్‌సైట్‌కు ఏ రాష్ట్ర లేదా కేంద్ర ప్రభుత్వ శాఖతో ఎటువంటి అధికారిక సంబంధం లేదా భాగస్వామ్యం లేదు (Independent non-governmental platform).</strong>
        </div>

        {extraHeader}

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 border-b pb-4 leading-tight">{title}</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 markdown-body text-sm sm:text-base leading-relaxed">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>

        <PolicyFooterNav />
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return <PageTemplate pageId="privacy" defaultTitle="గోప్యతా విధానం (Privacy Policy)" defaultContent={`
### 🛡️ గోప్యతా విధానం (Comprehensive Privacy Policy)
**చివరిగా నవీకరించబడిన తేదీ (Last Updated):** నవంబర్ 2026  
**అధికారిక వెబ్‌సైట్ (Official URL):** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

**E-VEDHIKA (ఈ-వేదిక)** పోర్టల్‌లో వినియోగదారుల వ్యక్తిగత వివరాలు, గోప్యత మరియు డేటా భద్రతకు మేము అత్యున్నత ప్రాధాన్యత ఇస్తాము. భారత డిజిటల్ పర్సనల్ డేటా ప్రొటెక్షన్ చట్టం (DPDP Act 2023), సమాచార సాంకేతిక చట్టం (IT Act 2000) మరియు Google Publisher / AdSense విధానాలకు అనుగుణంగా మేము సమాచారాన్ని ఎలా సేకరిస్తాము, భద్రపరుస్తాము మరియు ఎలా ఉపయోగిస్తామో ఈ గోప్యతా విధానం పారదర్శకంగా వివరిస్తుంది.

---

### 1. మేము సేకరించే సమాచారం (Information We Collect)
మేము వినియోగదారులకు మెరుగైన సాంకేతిక సేవలను అందించడానికి మాత్రమే పరిమిత సమాచారాన్ని సేకరిస్తాము:
- **ఖాతా & ప్రొఫైల్ సమాచారం (Voluntary Account Data):** మీరు పోర్టల్‌లో రిజిస్టర్ చేసుకున్నప్పుడు లేదా లాగిన్ అయినప్పుడు అందించే పేరు, ఇమెయిల్ చిరునామా, మొబైల్ నంబర్, జిల్లా, మండలం, గ్రామ పంచాయతీ పేరు మరియు ఉద్యోగ హోదా (ఉదా: పంచాయతీ కార్యదర్శి, ఈ-పంచాయతీ ఆపరేటర్).
- **క్లయింట్-సైడ్ ఫైల్ ప్రాసెసింగ్ (Local Browser Processing):** DSR ఎనలైజర్ (DSR Analyzer), ఎక్సెల్ మెర్జర్ (Excel Merger), మల్టీ-డే అటెండెన్స్ (Multi-Day Attendance) మరియు పీడీఎఫ్ కంప్రెసర్ టూల్స్‌లో మీరు అప్‌లోడ్ చేసే ఎక్సెల్ లేదా పీడీఎఫ్ ఫైల్స్ మీ కంప్యూటర్/మొబైల్ బ్రౌజర్‌లోనే లోకల్‌గా (Client-side RAM లో) ప్రాసెస్ చేయబడతాయి. మేము మీ కార్యాలయ ఎక్సెల్ షీట్లను మా సర్వర్లలో శాశ్వతంగా నిల్వ చేయము.
- **సాంకేతిక లాగ్ ఫైల్స్ (Standard Log Files):** వెబ్‌సైట్ భద్రత మరియు ట్రాఫిక్ విశ్లేషణ కోసం ఇంటర్నెట్ ప్రోటోకాల్ (IP) అడ్రస్, బ్రౌజర్ రకం (Chrome, Edge, Firefox, Safari), ఆపరేటింగ్ సిస్టమ్, రిఫరల్/ఎగ్జిట్ పేజీలు మరియు తేదీ/సమయ వివరాలు ఆటోమేటిక్‌గా నమోదు చేయబడతాయి.
- **కుకీలు & లోకల్ స్టోరేజ్ (Cookies & Web Storage):** యూజర్ లాగిన్ సెషన్, ఆఫ్‌లైన్ PWA క్యాషింగ్, ఫాంట్ జూమ్ స్థాయి మరియు కుకీ సమ్మతి (Consent Preferences) గుర్తుంచుకోవడానికి బ్రౌజర్ కుకీలు మరియు LocalStorage ఉపయోగించబడతాయి.

---

### 2. గూగుల్ యాడ్‌సెన్స్ & థర్డ్-పార్టీ ప్రకటనల నిబంధనలు (Google AdSense & DoubleClick DART Cookies Disclosure)
- **Google AdSense Third-Party Vendor:** మా వెబ్‌సైట్ నిర్వహణ మరియు ఉచిత సాంకేతిక సేవలను కొనసాగించడానికి మేము **Google AdSense** ద్వారా ప్రకటనలను ప్రదర్శిస్తాము. Google మా వెబ్‌సైట్‌లో థర్డ్-పార్టీ వెండర్‌గా కుకీలను ఉపయోగిస్తుంది.
- **DoubleClick DART Cookies:** వినియోగదారులు మా వెబ్‌సైట్ (` + "`https://www.e-vedhika.in/`" + `) మరియు ఇంటర్నెట్‌లోని ఇతర వెబ్‌సైట్‌లను సందర్శించినప్పుడు వారి ఆసక్తులకు అనుగుణంగా ప్రకటనలను (Personalized & Non-Personalized Ads) అందించడానికి Google DART కుకీలను ఉపయోగిస్తుంది.
- **వ్యక్తిగతీకరించిన ప్రకటనల నుండి తప్పుకోవడం (How to Opt-Out):** వినియోగదారులు గూగుల్ యాడ్స్ సెట్టింగ్స్ పేజీ [https://adssettings.google.com/](https://adssettings.google.com/) లేదా [https://www.aboutads.info/choices/](https://www.aboutads.info/choices/) సందర్శించడం ద్వారా ఎప్పుడైనా DART కుకీల వినియోగాన్ని నిలిపివేయవచ్చు (Opt-out).
- మా వెబ్‌సైట్‌లో కనిపించే థర్డ్-పార్టీ ప్రకటన నెట్‌వర్క్‌లు తమ స్వంత కుకీలు లేదా వెబ్ బీకాన్‌లను ఉపయోగించవచ్చు. వాటిపై E-VEDHIKA కు ప్రత్యక్ష నియంత్రణ ఉండదు మరియు అవి ఆయా సంస్థల గోప్యతా విధానాలకు లోబడి ఉంటాయి.

---

### 3. సమాచార వినియోగ ప్రయోజనాలు (How We Use Your Information)
సేకరించిన సమాచారాన్ని క్రింది చట్టబద్ధమైన ప్రయోజనాల కోసం మాత్రమే ఉపయోగిస్తాము:
- గ్రామ పంచాయతీ DSR నివేదికల విశ్లేషణ, GPDP ప్రణాళిక మరియు కార్యాలయ ఆటోమేషన్ సేవలను అందించడం.
- UBD (Unified Birth & Death) పోర్టల్ DSK / DSC డిజిటల్ సంతకాల సాంకేతిక సమస్యలను పరిష్కరించడం.
- వెబ్‌సైట్ భద్రతను పర్యవేక్షించడం, స్పామ్ లేదా అనధికారిక ప్రవేశాలను అరికట్టడం.
- వినియోగదారులు కోరినప్పుడు మాత్రమే టెలిగ్రామ్ లేదా ఇమెయిల్ ద్వారా ముఖ్యమైన సాంకేతిక అప్‌డేట్లను పంపడం.

---

### 4. సమాచార భద్రత & క్లౌడ్ రక్షణ (Data Security & Cloud Infrastructure)
- మీ ఖాతా వివరాలన్నీ **Google Firebase Authentication & Enterprise Cloud Firestore** లో **256-bit SSL/TLS Encryption (HTTPS)** ద్వారా సంపూర్ణంగా రక్షించబడతాయి.
- మేము వినియోగదారుల వ్యక్తిగత సమాచారాన్ని, ఫోన్ నంబర్లను లేదా ఇమెయిల్ చిరునామాలను ఏ ఇతర ప్రైవేట్ లేదా వాణిజ్య సంస్థలకు విక్రయించము, అద్దెకు ఇవ్వము లేదా దుర్వినియోగం చేయము.

---

### 5. వినియోగదారుల హక్కులు & డేటా తొలగింపు (User Rights & Data Deletion)
ప్రతి వినియోగదారునికి తమ వ్యక్తిగత సమాచారంపై పూర్తి హక్కు ఉంటుంది:
- మీరు మీ ప్రొఫైల్ వివరాలను ఎప్పుడైనా సమీక్షించుకోవచ్చు మరియు సవరించుకోవచ్చు.
- మీ ఖాతాను మరియు అనుబంధ డేటాను పూర్తిగా తొలగించాలని (Account Deletion Request) కోరుకుంటే [support@e-vedhika.in](mailto:support@e-vedhika.in) కు ఇమెయిల్ పంపడం ద్వారా 48 గంటల్లోపు తొలగించుకోవచ్చు.

---

### 6. సంప్రదింపు వివరాలు (Privacy & Grievance Redressal Officer)
ఈ గోప్యతా విధానంపై మీకు ఏవైనా సందేహాలు, ప్రశ్నలు లేదా ఫిర్యాదులు ఉంటే క్రింది అధికారిక మార్గాల ద్వారా మమ్మల్ని సంప్రదించవచ్చు:
- **Grievance & Support Desk:** [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **System Administration Office:** [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **Official Telegram Support:** [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
  `} />;
}

export function TermsPage() {
  return <PageTemplate pageId="terms" defaultTitle="నిబంధనలు & షరతులు (Terms & Conditions)" defaultContent={`
### 📜 నిబంధనలు & షరతులు (Terms and Conditions of Use)
**చివరిగా నవీకరించబడిన తేదీ (Last Updated):** నవంబర్ 2026  
**అధికారిక వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

**E-VEDHIKA (ఈ-వేదిక)** వెబ్‌సైట్, ఆన్‌లైన్ వర్క్‌స్పేస్ టూల్స్ మరియు డౌన్‌లోడ్ వనరులను ఉపయోగించడం ద్వారా మీరు ఈ క్రింది నిబంధనలు మరియు షరతులకు సంపూర్ణంగా కట్టుబడి ఉంటారని అంగీకరిస్తున్నారు.

---

### 1. స్వతంత్ర ప్రైవేట్ వేదిక స్పష్టీకరణ (Independent Private Platform Status)
- **E-VEDHIKA (e-vedhika.in)** అనేది తెలంగాణ మరియు ఆంధ్రప్రదేశ్ గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, మరియు పౌరుల రోజువారీ సాంకేతిక అవసరాలను సులభతరం చేసేందుకు రూపొందించబడిన **స్వతంత్ర ప్రైవేట్ విద్యా & సాంకేతిక వేదిక (Independent Educational & Technical Portal)**.
- **ఈ వెబ్‌సైట్‌కు ఏ రాష్ట్ర ప్రభుత్వంతో గానీ, కేంద్ర ప్రభుత్వంతో గానీ, పంచాయతీ రాజ్ శాఖతో గానీ ఎటువంటి అధికారిక సంబంధం, ఒప్పందం లేదా భాగస్వామ్యం లేదు.**
- అధికారిక ప్రభుత్వ దరఖాస్తులు మరియు తుది నిర్ధారణల కోసం వినియోగదారులు ఎల్లప్పుడూ సంబంధిత ప్రభుత్వ వెబ్‌సైట్‌లను (` + "`epanchayat.telangana.gov.in`, `ubd.telangana.gov.in`, `egramswaraj.gov.in`" + `) మాత్రమే సంప్రదించాలి.

---

### 2. ఆమోదయోగ్యమైన వినియోగం (Acceptable Use Policy)
- పోర్టల్‌లోని DSR Analyzer, Multi-Day Attendance, Farmer Registry Verification, Excel Merger, PDF Compressor, మరియు UBD Troubleshooting గైడ్‌లు కేవలం కార్యాలయ పని భారాన్ని తగ్గించేందుకు మరియు విద్యాపరమైన అవగాహన కోసమే ఉద్దేశించబడ్డాయి.
- వెబ్‌సైట్ సర్వర్లపై అధిక భారం మోపడం (DDoS), ఆటోమేటెడ్ బాట్లతో డేటా స్క్రాపింగ్ చేయడం, మాల్వేర్ అప్‌లోడ్ చేయడం, లేదా ప్రకటనలపై కృత్రిమ క్లిక్‌లు (Invalid Clicks / Artificial Traffic) చేయడం కఠినంగా నిషేధించబడింది.
- చట్టవిరుద్ధమైన, అసభ్యకరమైన లేదా తప్పుదారి పట్టించే సమాచారాన్ని కమ్యూనిటీ చాట్ లేదా సూచనల విభాగంలో పోస్ట్ చేసే ఖాతాలు తక్షణమే తొలగించబడతాయి.

---

### 3. మేధో సంపత్తి హక్కులు (Intellectual Property Rights)
- E-VEDHIKA లోని కస్టమ్ సాఫ్ట్‌వేర్ కోడ్, ఆన్‌లైన్ కాలిక్యులేటర్లు, ద్విభాషా టెక్నికల్ వ్యాసాలు, డిజైన్ మరియు లోగో E-VEDHIKA యజమానుల మేధో సంపత్తి. ముందస్తు అనుమతి లేకుండా వీటిని వాణిజ్యపరంగా కాపీ చేయడం లేదా పునఃపంపిణీ చేయడం నిషేధం.
- ప్రభుత్వ జీవోలు (GOs) మరియు పబ్లిక్ ఫార్మాట్లు పౌరుల మరియు ఉద్యోగుల సౌకర్యార్థం పబ్లిక్ డొమైన్ సమాచారంగా అందించబడుతున్నాయి.

---

### 4. ఖాతా భద్రత & వినియోగదారుల బాధ్యత (Account Security)
- మీ ఖాతా లాగిన్ వివరాలు, పాస్‌వర్డ్ మరియు 4-అంకెల భద్రతా పిన్ (PIN) గోప్యంగా ఉంచుకోవడం పూర్తిగా మీ బాధ్యత.
- ఏదైనా అనధికారిక లాగిన్ జరిగినట్లు గమనిస్తే తక్షణమే [support@e-vedhika.in](mailto:support@e-vedhika.in) కు తెలియజేయాలి.

---

### 5. బాధ్యతా పరిమితి (Limitation of Liability)
- ఆన్‌లైన్ టూల్స్ ద్వారా జనరేట్ చేయబడిన నివేదికలను అధికారికంగా సమర్పించే ముందు వినియోగదారులు ఒకసారి సరిచూసుకోవాలి. నెట్‌వర్క్ అంతరాయాలు లేదా బాహ్య ప్రభుత్వ సర్వర్ల డౌన్‌టైమ్ వల్ల కలిగే జాప్యానికి E-VEDHIKA బాధ్యత వహించదు.

---

### 6. నిబంధనల సవరణ & సంప్రదింపులు (Modifications & Contact)
- కాలానుగుణంగా ఈ నిబంధనలను సవరించే హక్కు E-VEDHIKA యాజమాన్యానికి ఉంది. సందేహాల కోసం [support@e-vedhika.in](mailto:support@e-vedhika.in) లేదా [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com) లో సంప్రదించండి.
  `} />;
}

export function DisclaimerPage() {
  return <PageTemplate pageId="disclaimer" defaultTitle="బాధ్యతా రాహిత్య ప్రకటన (Official Disclaimer)" defaultContent={`
### ⚖️ బాధ్యతా రాహిత్య ప్రకటన (Official Website Disclaimer)
**చివరిగా నవీకరించబడిన తేదీ (Last Updated):** నవంబర్ 2026  
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

---

### 1. ప్రభుత్వేతర స్వతంత్ర పోర్టల్ ప్రకటన (Non-Governmental Entity Notice)
**E-VEDHIKA (ఈ-వేదిక - https://www.e-vedhika.in/) అనేది ఒక స్వతంత్ర ప్రైవేట్ సాంకేతిక, విద్యా మరియు సమాచార పోర్టల్.**  
ఈ వెబ్‌సైట్ తెలంగాణ ప్రభుత్వం, ఆంధ్రప్రదేశ్ ప్రభుత్వం, పంచాయతీ రాజ్ మరియు గ్రామీణాభివృద్ధి శాఖ (PR&RD), లేదా భారత ప్రభుత్వంలోని ఏ ఇతర మంత్రిత్వ శాఖకు ప్రాతినిధ్యం వహించదు మరియు ఎటువంటి అధికారిక అనుబంధం (No Official Government Affiliation) కలిగి లేదు. మేము ప్రభుత్వ సంస్థగా ఎప్పుడూ చెప్పుకోము.

---

### 2. సమాచార విశ్వసనీయత & విద్యా ప్రయోజనం (Educational & Informational Purpose Only)
- ఈ పోర్టల్‌లో అందించబడిన UBD Settings, DSC / DSK ట్రబుల్‌షూటింగ్ గైడ్‌లు, DSR నివేదికల విశ్లేషణ, GPDP మార్గదర్శకాలు మరియు ప్రభుత్వ ఉత్తర్వుల (GOs) వివరణలు కేవలం గ్రామ పంచాయతీ సిబ్బందికి మరియు పౌరులకు సాంకేతిక అవగాహన కల్పించే ఉద్దేశంతో మాత్రమే రూపొందించబడ్డాయి.
- మేము సమాచారాన్ని ఖచ్చితంగా మరియు తాజా స్థితిలో ఉంచడానికి నిరంతరం కృషి చేసినప్పటికీ, ఏదైనా అధికారిక నిర్ణయం తీసుకునే ముందు సంబంధిత అధికారిక ప్రభుత్వ గెజిట్‌లు మరియు పోర్టల్‌లను ([epanchayat.telangana.gov.in](https://epanchayat.telangana.gov.in), [ubd.telangana.gov.in](https://ubd.telangana.gov.in), [egramswaraj.gov.in](https://egramswaraj.gov.in)) మాత్రమే ప్రామాణికంగా తీసుకోవాలి.

---

### 3. ఆన్‌లైన్ టూల్స్ & కాలిక్యులేటర్ల స్పష్టీకరణ (Utility Tools Disclaimer)
- DSR Analyzer, Multi-Day Attendance, Excel Merger, PDF Compressor, మరియు Farmer Registry వెరిఫికేషన్ సాధనాలు వినియోగదారుల సమయాన్ని ఆదా చేయడానికి రూపొందించబడిన సహాయక పరికరాలు (Productivity Utilities).
- వీటి ద్వారా రూపొందించబడిన సారాంశ నివేదికలను (Summary Reports) నేరుగా ప్రభుత్వ ధృవీకరణ పత్రాలుగా పరిగణించరాదు.

---

### 4. బాహ్య వెబ్‌సైట్ లింకులు (External Hyperlinks Disclaimer)
- వినియోగదారుల సౌకర్యార్థం మా వెబ్‌సైట్‌లో అధికారిక ప్రభుత్వ పోర్టల్‌లకు మరియు సంబంధిత వెబ్‌సైట్‌లకు డైరెక్ట్ లింకులు (Direct Links) ఇవ్వబడ్డాయి. ఆ బాహ్య వెబ్‌సైట్‌ల కంటెంట్, సర్వర్ లభ్యత లేదా గోప్యతా విధానాలపై E-VEDHIKA కు ఎటువంటి నియంత్రణ ఉండదు.

---

### 5. సంప్రదించండి (Contact for Clarifications)
ఈ డిస్క్లైమర్‌కు సంబంధించి ఏవైనా సందేహాలు లేదా సవరణల సూచనలు ఉంటే మా అధికారిక ఇమెయిల్ ద్వారా సంప్రదించగలరు:
- **Support Email:** [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **Admin Email:** [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
  `} />;
}

export function CookiePolicyPage() {
  return <PageTemplate pageId="cookies" defaultTitle="కుకీ విధానం (Cookie Policy)" defaultContent={`
### 🍪 కుకీ విధానం (Comprehensive Cookie Policy)
**చివరిగా నవీకరించబడిన తేదీ (Last Updated):** నవంబర్ 2026  
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

ఈ కుకీ విధానం (Cookie Policy) **E-VEDHIKA** వెబ్‌సైట్ సందర్శకుల అనుభవాన్ని మెరుగుపరచడానికి, భద్రతను నిర్ధారించడానికి మరియు Google AdSense ప్రకటనలను ప్రదర్శించడానికి కుకీలను (Cookies) మరియు లోకల్ స్టోరేజ్ సాంకేతికతలను ఎలా ఉపయోగిస్తుందో వివరిస్తుంది.

---

### 1. కుకీలు అంటే ఏమిటి? (What Are Cookies?)
కుకీలు అనేవి మీరు ఒక వెబ్‌సైట్‌ను సందర్శించినప్పుడు మీ కంప్యూటర్, ల్యాప్‌టాప్, ట్యాబ్లెట్ లేదా మొబైల్ ఫోన్ బ్రౌజర్‌లో నిల్వ చేయబడే చిన్న టెక్స్ట్ ఫైల్‌లు. ఇవి మీ లాగిన్ సెషన్‌ను గుర్తుంచుకోవడానికి, పేజీలు వేగంగా లోడ్ అవ్వడానికి మరియు మీ ప్రాధాన్యతలను భద్రపరచడానికి సహాయపడతాయి.

---

### 2. మేము ఉపయోగించే కుకీల వర్గాలు (Categories of Cookies We Use)
1. **అత్యవసర & భద్రతా కుకీలు (Strictly Necessary & Security Cookies):**
   - Firebase Authentication లాగిన్ సెషన్లు, అడ్మిన్ భద్రతా ధృవీకరణ మరియు CSRF రక్షణ కోసం ఇవి తప్పనిసరి. ఇవి లేకుండా వెబ్‌సైట్‌లోని వ్యక్తిగత వర్క్‌స్పేస్ ఫీచర్లు పనిచేయవు.
2. **פּనితీరు & కార్యాచరణ కుకీలు (Functionality & PWA Storage):**
   - టెక్స్ట్ జూమ్ పరిమాణం, కుకీ సమ్మతి బ్యానర్ ఎంపిక (Cookie Consent state), మరియు ఆఫ్‌లైన్ సపోర్ట్ కోసం Service Worker క్యాషింగ్‌ను నిర్వహిస్తాయి.
3. **గూగుల్ యాడ్‌సెన్స్ & ప్రకటన కుకీలు (Google AdSense & DoubleClick DART Cookies):**
   - ఉచిత సాంకేతిక సేవలకు మద్దతుగా మేము **Google AdSense (Publisher ID: pub-4602643637986053)** ను ఉపయోగిస్తాము.
   - Google మరియు దాని భాగస్వాములు వినియోగదారులు మా సైట్‌ను లేదా ఇతర సైట్‌లను సందర్శించిన ఆధారంగా సంబంధిత ప్రకటనలను చూపించడానికి కుకీలను (DART Cookies) ఉపయోగిస్తారు.

---

### 3. కుకీలను ఎలా నియంత్రించాలి లేదా తొలగించాలి? (How to Manage or Disable Cookies)
మీరు ఎప్పుడైనా కుకీలను నియంత్రించవచ్చు లేదా నిలిపివేయవచ్చు:
- **Google Personalized Ads Opt-Out:** [Google Ads Settings (https://adssettings.google.com/)](https://adssettings.google.com/) పేజీని సందర్శించి వ్యక్తిగతీకరించిన ప్రకటనలను ఆఫ్ చేయవచ్చు.
- **Industry Opt-Out Tools:** [AboutAds.info Choices](https://www.aboutads.info/choices/) లేదా [Network Advertising Initiative](http://www.networkadvertising.org/choices/) ద్వారా థర్డ్-పార్టీ అడ్వర్టైజింగ్ కుకీలను నిలిపివేయవచ్చు.
- **Browser Settings:** మీ Chrome, Edge, Firefox లేదా Safari బ్రౌజర్‌లోని **Settings &rarr; Privacy and Security &rarr; Cookies and other site data** విభాగంలో కుకీలను బ్లాక్ చేయవచ్చు లేదా తొలగించవచ్చు.

---

### 4. సంప్రదింపు వివరాలు (Contact Us About Cookies)
మా కుకీ విధానంపై మీకు ఏవైనా ప్రశ్నలు ఉంటే [support@e-vedhika.in](mailto:support@e-vedhika.in) లేదా [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com) ద్వారా మమ్మల్ని సంప్రదించండి.
  `} />;
}

export function EditorialPolicyPage() {
  return <PageTemplate pageId="editorial" defaultTitle="ఎడిటోరియల్ & వాస్తవ నిర్ధారణ విధానం (Editorial Policy)" defaultContent={`
### ✍️ ఎడిటోరియల్ & వాస్తవ నిర్ధారణ విధానం (Editorial & Fact-Checking Policy)
**చివరిగా నవీకరించబడిన తేదీ (Last Updated):** నవంబర్ 2026  
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

**E-VEDHIKA (ఈ-వేదిక)** గ్రామ పంచాయతీ కార్యదర్శులు, కంప్యూటర్ ఆపరేటర్లు, మరియు గ్రామీణ పౌరులకు అత్యున్నత నాణ్యత గల, ఖచ్చితమైన, అసలైన (Original) మరియు ధృవీకరించబడిన సాంకేతిక సమాచారాన్ని అందించడానికి కట్టుబడి ఉంది.

---

### 1. మా కంటెంట్ రూపకల్పన ప్రమాణాలు (Originality & Content Standards)
- **క్షేత్రస్థాయి అనుభవం (Practical Field Expertise):** పోర్టల్‌లో ప్రచురించబడే ప్రతి సాంకేతిక వ్యాసం — UBD Settings, DSC/DSK సైనింగ్ లోపాల పరిష్కారం, Windows 10/11 Edge IE Mode కాన్ఫిగరేషన్, DSR విశ్లేషణ మరియు GPDP ప్రణాళిక — క్షేత్రస్థాయిలో పనిచేస్తున్న సీనియర్ ఈ-పంచాయతీ ఆపరేటర్లు మరియు సిస్టమ్ ఇంజనీర్ల ప్రత్యక్ష పరీక్షల (Hands-on Testing) ఆధారంగా రాయబడుతుంది.
- **అధికారిక మూలాల ధృవీకరణ (Primary Source Verification):** ప్రభుత్వ ఉత్తర్వులు (GOs), సర్క్యులర్లు, PR Act 2018 నిబంధనలు మరియు రైతు రిజిస్ట్రీ సమాచారం కేవలం అధికారిక ప్రభుత్వ గెజిట్‌లు మరియు శాఖాపరమైన మార్గదర్శకాల నుండి మాత్రమే సరిచూసి ప్రచురించబడతాయి.
- **ద్విభాషా స్పష్టత (Bilingual Telugu & English Clarity):** గ్రామీణ మరియు మండల స్థాయి సిబ్బందికి సాంకేతిక అంశాలు సులభంగా అర్థమయ్యేలా ప్రతి గైడ్‌ను సరళమైన తెలుగు మరియు ఆంగ్ల భాషలలో (Bilingual Format) అందిస్తాము.
- **కాపీరైట్ & నాణ్యత నిబద్ధత (Zero Plagiarism Policy):** మేము ఇతర వెబ్‌సైట్‌ల నుండి కంటెంట్‌ను కాపీ చేయము లేదా స్క్రాప్ చేయము. ప్రతి టూల్ వివరణ మరియు ట్రబుల్‌షూటింగ్ గైడ్ E-VEDHIKA ఎడిటోరియల్ బృందంచే సొంతంగా రూపొందించబడుతుంది.

---

### 2. సాఫ్ట్‌వేర్ & డ్రైవర్ల భద్రతా ప్రమాణాలు (Software & Driver Verification)
- మా **Software Hub** లో ఉంచబడే ePass2003, WatchData ProxKey, mToken CryptoID డ్రైవర్లు, Java JRE మరియు UBD ఆటో-సెటప్ యుటిలిటీలు అధికారిక వెండర్ డిజిటల్ సంతకాలు (SHA-256 Checksum & Authenticode Signature) పరిశీలించిన తర్వాతే అందుబాటులో ఉంచబడతాయి.
- మేము ఎటువంటి క్రాక్డ్, పైరేటెడ్ లేదా హానికరమైన సాఫ్ట్‌వేర్‌లను ప్రోత్సహించము.

---

### 3. దిద్దుబాట్లు & నవీకరణల ప్రక్రియ (Corrections & Review Workflow)
- ప్రభుత్వ పోర్టల్‌లలో (Mana Panchayati, UBD, eGramSwaraj) సాంకేతిక మార్పులు జరిగినప్పుడల్లా మా బృందం సంబంధిత వ్యాసాలను మరియు సాధనాలను సమీక్షించి తాజా వెర్షన్‌కు నవీకరిస్తుంది.
- పాఠకులు లేదా ఉద్యోగులు ఏదైనా సమాచారంలో సవరణ అవసరమని గుర్తిస్తే **Suggestions / Feedback** విభాగం ద్వారా లేదా [support@e-vedhika.in](mailto:support@e-vedhika.in) కు ఇమెయిల్ పంపడం ద్వారా తెలియజేయవచ్చు. మా ఎడిటోరియల్ బృందం 24 గంటల్లోపు పరిశీలించి తగిన సవరణలు చేస్తుంది.

---

### 4. సంపాదకీయ & సాంకేతిక బృందం (Editorial & Technical Team)
- **Founder & Lead Technical Architect:** రాకేష్ కుమార్ ధావన్ (Rakesh Kumar Dhawan)
- **Editorial & Field Testing Contributors:** E-Vedhika e-Panchayat Technical Support Group (Telangana & Andhra Pradesh)
- **Official Contact:** [support@e-vedhika.in](mailto:support@e-vedhika.in) | [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
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
      "E-Vedhika is a comprehensive digital platform designed to bridge the gap between citizens, field operators, and Panchayat administration. By providing specialized productivity utilities, bilingual guides, and technical troubleshooting, we support transparent and efficient e-Governance workflows.",
  };

  const overviewSection = (
    <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white rounded-3xl p-6 sm:p-10 shadow-sm border border-blue-100 text-center space-y-6 w-full mx-auto flex flex-col items-center relative overflow-hidden my-6">
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
### 🌟 ఈ-వేదిక: ఆల్ ప్రాబ్లమ్స్ వన్ సొల్యూషన్ (About E-Vedhika Portal)
**E-VEDHIKA (https://www.e-vedhika.in/)** అనేది తెలంగాణ మరియు ఆంధ్రప్రదేశ్ రాష్ట్రాలలోని గ్రామ పంచాయతీ కార్యదర్శులు (Panchayat Secretaries), ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు (e-Panchayat Operators), మండల పరిషత్ సిబ్బంది మరియు గ్రామీణ పౌరుల కోసం రూపొందించబడిన సమగ్ర డిజిటల్ సాంకేతిక & విద్యా వేదిక.

గ్రామ పంచాయతీలలో రోజువారీ ఆన్‌లైన్ రిపోర్టింగ్, డిజిటల్ సంతకాల (DSC/DSK) కాన్ఫిగరేషన్, ఎక్సెల్ డేటా విలీనం మరియు ప్రభుత్వ ఉత్తర్వుల (GOs) సమాచారాన్ని ఒకే చోట సులభంగా అందించాలనే ఉద్దేశంతో **రాకేష్ కుమార్ ధావన్ (Rakesh Kumar Dhawan)** మరియు సాంకేతిక బృందం ఈ పోర్టల్‌ను ప్రారంభించారు.

---

### 🚀 మా ప్రధాన విభాగాలు & సేవలు (Core Categories & Tools)
1. **మన పంచాయతీ & వర్క్‌స్పేస్ (Mana Panchayath & Digital Workspace):**
   - **DSR Analyzer:** రోజువారీ హాజరు మరియు Daily Status Report ఎక్సెల్ ఫైళ్లను క్షణాల్లో విశ్లేషించి మండల/జిల్లా స్థాయి సమ్మరీ రిపోర్టులను రూపొందించే సాధనం.
   - **Multi-Day Attendance & Monthly Activity (MAS):** బహుళ తేదీల హాజరు మరియు నెలవారీ పంచాయతీ కార్యకలాపాల నివేదికల తయారీ.
2. **UBD టూల్స్ & DSK పరిష్కారాలు (UBD Tools & DSC/DSK Troubleshooting):**
   - జనన మరణాల నమోదు (UBD Portal) మరియు eGramSwaraj లో ఎదురయ్యే Java, ActiveX, Edge IE Mode మరియు ePass2003 / mToken డ్రైవర్ సమస్యలకు సమగ్ర ద్విభాషా గైడ్‌లు మరియు డెస్క్‌టాప్ ఆటో-హీలింగ్ సపోర్ట్.
3. **ప్రాధాన్యత సేవలు & రైతు రిజిస్ట్రీ (Priority Services & Farmer Registry):**
   - రైతు రిజిస్ట్రీ (Farmer Registry) ల్యాండ్ డేటా సరిచూసుకోవడం, అత్యవసర హెల్ప్‌లైన్ నంబర్లు మరియు వ్యక్తిగత వర్క్ ట్రాకర్.
4. **జీవోలు, ఫార్మాట్లు & డౌన్‌లోడ్స్ (Government Updates, GOs & Formats):**
   - పంచాయతీ రాజ్ శాఖ తాజా జీవోలు, సర్క్యులర్లు, ప్రొసీడింగ్స్ మరియు గ్రామ పంచాయతీ అధికారిక దరఖాస్తు ఫార్మాట్లు (PDF/Word).
5. **పంచాయతీ వనరులు & PR Act గైడ్ (Panchayat Resources & Knowledge Hub):**
   - తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 (PR Act Sections), GPDP (గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక) మార్గదర్శకాలు మరియు అధికారిక పోర్టల్ డైరెక్ట్ లింకులు.
6. **సాఫ్ట్‌వేర్ హబ్ & టెక్నికల్ సపోర్ట్ (Software Hub & Technical Support):**
   - పంచాయతీ కంప్యూటర్లకు అవసరమైన క్రిప్టో టోకెన్ డ్రైవర్లు, పీడీఎఫ్ కంప్రెసర్, ఎక్సెల్ A4 ప్రింట్ టూల్ మరియు లైవ్ టెక్నికల్ గ్రీవెన్స్ సపోర్ట్.

---

### 🎯 మా లక్ష్యం & విలువలు (Our Mission & Editorial Integrity)
- **సమయ ఆదా (Time Efficiency):** గంటల తరబడి పట్టే ఎక్సెల్ మరియు రిపోర్టింగ్ పనులను నిమిషాల్లో పూర్తి చేసే ఆటోమేషన్ సాధనాలను ఉచితంగా అందించడం.
- **సాంకేతిక సాధికారత (Digital Empowerment):** ప్రతి గ్రామ పంచాయతీ ఆపరేటర్ మరియు కార్యదర్శి ఇతరులపై ఆధారపడకుండా తమ కంప్యూటర్ సమస్యలను తామే పరిష్కరించుకునేలా తెలుగులో సులభమైన శిక్షణ అందించడం.
- **గోప్యత & భద్రత (Privacy First):** క్లయింట్-సైడ్ డేటా ప్రాసెసింగ్ మరియు సురక్షిత క్లౌడ్ ఆర్కిటెక్చర్ ద్వారా వినియోగదారుల డేటా భద్రతకు పెద్దపీట వేయడం.

---

### 📞 సంప్రదింపుల వివరాలు (Official Contact Information)
- **Official Website:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)
- **Support Helpdesk Email:** [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **Administration Email:** [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **Telegram Alerts Bot:** [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
- **WhatsApp Support:** [+91 99854 02310](https://wa.me/919985402310)
  `}
    />
  );
}

export function ContactPage() {
  return <PageTemplate pageId="contact" defaultTitle="మమ్మల్ని సంప్రదించండి (Contact Us & Helpdesk)" defaultContent={`
### 📞 మమ్మల్ని సంప్రదించండి (Contact Us & Technical Support Desk)
**E-VEDHIKA (https://www.e-vedhika.in/)** పోర్టల్‌లోని ఆన్‌లైన్ టూల్స్, UBD DSK/DSC కాన్ఫిగరేషన్, DSR రిపోర్టులు, లేదా వెబ్‌సైట్ కంటెంట్‌కు సంబంధించి మీకు ఏవైనా సాంకేతిక సందేహాలు, సూచనలు లేదా ఫిర్యాదులు ఉంటే మా సపోర్ట్ బృందాన్ని సంప్రదించవచ్చు.

---

### ✉️ అధికారిక ఇమెయిల్ సంప్రదింపులు (Official Email Channels)
1. **Technical Support & User Helpdesk (సాంకేతిక సహాయం కోసం):**
   - **Email:** [support@e-vedhika.in](mailto:support@e-vedhika.in)
   - *వినియోగం:* ఆన్‌లైన్ టూల్స్ సందేహాలు, UBD డ్రైవర్ సమస్యలు, ఖాతా సహాయం మరియు కంటెంట్ సవరణల కోసం.
2. **System Administration & Policy Inquiries (అడ్మిన్ & పాలసీ విచారణల కోసం):**
   - **Email:** [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
   - *వినియోగం:* వెబ్‌సైట్ భద్రత, గోప్యతా విధానం (Privacy/Data Requests), కాపీరైట్ లేదా ప్రకటనల సంబంధిత విచారణల కోసం.

---

### 💬 తక్షణ కమ్యూనిటీ & మెసేజింగ్ సపోర్ట్ (Instant Support Channels)
- **ఆన్‌లైన్ సపోర్ట్ టికెట్ (Portal Grievance Desk):** వెబ్‌సైట్‌లోని **[సమస్యలు & సూచనలు (Suggestions)](/suggestions)** పేజీ ద్వారా మీ సమస్యను నేరుగా నమోదు చేయవచ్చు.
- **WhatsApp అధికారిక ఛానెల్:** [E-Vedhika WhatsApp Channel లో చేరండి](https://whatsapp.com/channel/0029VbDYABvKQuJFzU48c92u)
- **WhatsApp హెల్ప్‌డెస్క్ చాట్:** [+91 99854 02310](https://wa.me/919985402310)
- **Telegram అలెర్ట్స్ & సపోర్ట్ బోట్:** [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)

---

### 📍 కార్యాలయ పని వేళలు & ప్రతిస్పందన సమయం (Support Hours & SLA)
- **పని దినాలు (Working Days):** సోమవారం నుండి శనివారం వరకు (Monday – Saturday)
- **సమయం (Support Timings):** ఉదయం 09:30 AM నుండి సాయంత్రం 06:30 PM IST వరకు
- **సగటు ప్రతిస్పందన సమయం (Response Time):** ఇమెయిల్ మరియు సపోర్ట్ టికెట్లకు సాధారణంగా 12 నుండి 24 గంటల్లోపు సమాధానం ఇవ్వబడుతుంది.
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
        { name: "About Us (మా గురించి)", path: "/about", desc: "పోర్టల్ లక్ష్యాలు, సమాచారం & అవలోకనం" },
        { name: "Contact Support (సంప్రదించండి)", path: "/contact", desc: "అధికారిక హెల్ప్‌డెస్క్, ఇమెయిల్స్ & వాట్సాప్ చాట్" },
        { name: "Suggestions & Grievances", path: "/suggestions", desc: "సూచనలు, ఫిర్యాదులు & టికెట్ మద్దతు" },
        { name: "Emergency Helplines", path: "/emergency", desc: "కీలక అత్యవసర హెల్ప్‌లైన్ నంబర్లు" },
        { name: "Privacy Policy (గోప్యతా విధానం)", path: "/privacy", desc: "డేటా భద్రత & గోప్యతా విధానము (AdSense Disclosures)" },
        { name: "Terms & Conditions (నిబంధనలు)", path: "/terms", desc: "పోర్టల్ వినియోగ నిబంధనలు & షరతులు" },
        { name: "Disclaimer (బాధ్యతా రాహిత్య ప్రకటన)", path: "/disclaimer", desc: "స్వతంత్ర ప్రైవేట్ పోర్టల్ స్పష్టీకరణ & అధికారిక ప్రకటన" },
        { name: "Cookie Policy (కుకీ విధానం)", path: "/cookie-policy", desc: "కుకీల వినియోగం & ప్రకటనల నిర్వహణ విధానం" },
        { name: "Editorial Policy (ఎడిటోరియల్ విధానం)", path: "/editorial-policy", desc: "వాస్తవ నిర్ధారణ ప్రమాణాలు & సంపాదకీయ బృందం" },
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
        <PolicyFooterNav />
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

        <PolicyFooterNav />
      </div>
    </div>
  );
}
