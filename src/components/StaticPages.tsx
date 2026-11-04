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
**చివరిగా నవీకరించబడిన తేదీ (Last Updated):** అక్టోబర్ 2026  
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

**E-VEDHIKA (ఈ-వేదిక)** పోర్టల్‌లో వినియోగదారుల వ్యక్తిగత వివరాలు మరియు డేటా భద్రతకు మేము అత్యున్నత ప్రాధాన్యత ఇస్తాము. ఈ సమగ్ర గోప్యతా విధానం (Privacy Policy) ద్వారా మేము సమాచారాన్ని ఎలా సేకరిస్తాము, భద్రపరుస్తాము మరియు ఎలా ఉపయోగిస్తామో పారదర్శకంగా తెలియజేస్తున్నాము.

---

### 1. మేము సేకరించే సమాచారం (Information We Collect)
- **వ్యక్తిగత & ఖాతా సమాచారం:** పేరు, అధికారిక ఇమెయిల్, మొబైల్ నంబర్, జిల్లా, మండలం, గ్రామ పంచాయతీ పేరు మరియు హోదా.
- **సాంకేతిక లాగ్‌లు (Log Files):** ఇంటర్నెట్ ప్రోటోకాల్ (IP) అడ్రస్, బ్రౌజర్ రకం (Chrome, Edge, Firefox), ఇంటర్నెట్ సర్వీస్ ప్రొవైడర్ (ISP), రిఫరల్/ఎగ్జిట్ పేజీలు, మరియు సందర్శించిన తేదీ/సమయ వివరాలు.
- **కుకీలు & లోకల్ స్టోరేజ్:** PWA ఆఫ్‌లైన్ వర్క్‌స్పేస్, యూజర్ థీమ్ ప్రిఫరెన్స్‌లు, మరియు సురక్షిత సెషన్ టోకెన్లు.

---

### 2. గూగుల్ యాడ్‌సెన్స్ & థర్డ్-పార్టీ ప్రకటనలు (Google AdSense & DoubleClick DART Cookies)
- **Google AdSense:** మా వెబ్‌సైట్‌లో ప్రకటనలను ప్రదర్శించడానికి గూగుల్ (Google) థర్డ్-పార్టీ వెండర్‌గా పనిచేస్తుంది.
- **DART Cookies:** వినియోగదారులు మా వెబ్‌సైట్ మరియు ఇంటర్నెట్‌లోని ఇతర సైట్‌లను సందర్శించినప్పుడు వారి ఆసక్తులకు అనుగుణంగా ప్రకటనలను అందించడానికి గూగుల్ DART కుకీలను ఉపయోగిస్తుంది.
- **Opt-Out (వ్యక్తిగతీకరించిన ప్రకటనలను నిలిపివేయడం):** వినియోగదారులు గూగుల్ యాడ్స్ సెట్టింగ్స్ [Google Ads Settings](https://adssettings.google.com/) లేదా [AboutAds.info](https://www.aboutads.info/choices/) సందర్శించడం ద్వారా వ్యక్తిగతీకరించిన ప్రకటనల (Personalized Advertising) కోసం DART కుకీ వినియోగాన్ని ఎప్పుడైనా నిలిపివేయవచ్చు.
- మా వెబ్‌సైట్‌లో కనిపించే థర్డ్-పార్టీ ప్రకటన సర్వర్లు లేదా ప్రకటన నెట్‌వర్క్‌లు తమ స్వంత కుకీలు, జావాస్క్రిప్ట్ లేదా వెబ్ బీకాన్‌లను ఉపయోగించవచ్చు. ఈ థర్డ్-పార్టీ ప్రకటనదారుల కుకీలపై E-VEDHIKA కు ఎటువంటి నియంత్రణ ఉండదు.

---

### 3. డేటా వినియోగ ప్రయోజనాలు (How We Use Information)
సేకరించిన సమాచారాన్ని క్రింది ప్రయోజనాల కోసం మాత్రమే ఉపయోగిస్తాము:
- గ్రామ పంచాయతీ DSR నివేదికల విశ్లేషణ మరియు సాంకేతిక పరిష్కారాలను అందించడం.
- UBD DSK / DSC డిజిటల్ సంతకాల టెక్నికల్ సపోర్ట్ సమర్థవంతంగా నిర్వహించడం.
- సిస్టమ్ భద్రతను పర్యవేక్షించడం, అనధికారిక ప్రవేశాలను అరికట్టడం మరియు వెబ్‌సైట్ స్పీడ్ మెరుగుపరచడం.
- అత్యవసర సాంకేతిక అప్‌డేట్లు మరియు సేవా నోటిఫికేషన్‌లను టెలిగ్రామ్/ఈమెయిల్ ద్వారా అందించడం.

---

### 4. సమాచార భద్రత & క్లౌడ్ రక్షణ (Data Security & Protection)
- మీ వివరాలన్నీ **Google Firebase Enterprise Cloud Infrastructure & 256-bit SSL Encryption** ద్వారా సంపూర్ణంగా రక్షించబడతాయి.
- మేము మీ వ్యక్తిగత సమాచారాన్ని ఏ ఇతర వాణిజ్య సంస్థలకు విక్రయించము లేదా అద్దెకు ఇవ్వము.

---

### 5. వినియోగదారుల హక్కులు (User Privacy Rights)
మీరు మీ వ్యక్తిగత వివరాలను ఎప్పుడైనా సమీక్షించుకోవచ్చు, సవరించుకోవచ్చు లేదా ఖాతాను తొలగించాలని కోరవచ్చు. ఈ అభ్యర్థనల కోసం మా డేటా ప్రొటెక్షన్ టీమ్‌ను సంప్రదించవచ్చు.

---

### 6. సంప్రదించండి (Grievance & Privacy Contact)
గోప్యతా విధానంపై ఏవైనా సందేహాలు లేదా ఫిర్యాదులు ఉంటే:
- **Support Desk:** [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **Admin Office:** [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
- **Telegram Bot:** [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
  `} />;
}

export function TermsPage() {
  return <PageTemplate pageId="terms" defaultTitle="నిబంధనలు & షరతులు (Terms & Conditions)" defaultContent={`
### 📜 నిబంధనలు & షరతులు (Terms & Conditions)
**చివరిగా నవీకరించబడిన తేదీ:** అక్టోబర్ 2026

**E-VEDHIKA** (e-vedhika.in) వెబ్‌సైట్ మరియు సాధనాలను ఉపయోగించడం ద్వారా మీరు క్రింది నిబంధనలు మరియు షరతులకు సంపూర్ణంగా అంగీకరిస్తున్నట్లు ధృవీకరిస్తున్నారు.

---

### 1. ప్రైవేట్ వేదిక స్పష్టీకరణ & అధికారిక అనుబంధ రాహిత్యం (Independent Private Platform)
- **E-VEDHIKA (ఈ-వేదిక)** అనేది తెలంగాణ మరియు ఆంధ్రప్రదేశ్ పంచాయతీ కార్యదర్శులు, కంప్యూటర్ ఆపరేటర్లు మరియు క్షేత్రస్థాయి ఉద్యోగుల రోజువారీ ఆఫీస్ పనులను సులభతరం చేసేందుకు రూపొందించబడిన **స్వతంత్ర ప్రైవేట్ సాంకేతిక పోర్టల్**.
- **ఈ వెబ్‌సైట్‌కు ఏ రాష్ట్ర లేదా కేంద్ర ప్రభుత్వ శాఖతో, పంచాయతీ రాజ్ విభాగంతో ఎటువంటి అధికారిక సంబంధం, ఒప్పందం లేదా భాగస్వామ్యం లేదు.**
- అన్ని అధికారిక ప్రభుత్వ సమాచారం, జీవోలు మరియు నివేదికల కోసం సంబంధిత అధికారిక ప్రభుత్వ పోర్టల్‌లను సంప్రదించాలి.

---

### 2. మేధో సంపత్తి & సరైన వినియోగం (Intellectual Property & Acceptable Use)
- ప్లాట్‌ఫారమ్‌లోని DSR Analyzer, Excel Merger, ఫార్మాట్లు మరియు ట్యుటోరియల్ గైడ్‌లు కేవలం విద్యాపరమైన మరియు కార్యాలయ సహాయ ప్రయోజనాల కోసం మాత్రమే అందించబడుతున్నాయి.
- వెబ్‌సైట్‌ను క్రాష్ చేయడానికి ప్రయత్నించడం, స్క్రాపింగ్ చేయడం, మాల్వేర్ ప్రవేశపెట్టడం లేదా అనధికారిక డేటా రివర్స్ ఇంజనీరింగ్ చేయడం చట్టరీత్యా నేరం.

---

### 3. ఖాతా బాధ్యత & భద్రత (User Responsibilities)
- మీ ఖాతా లాగిన్ వివరాలు, పిన్ (PIN) మరియు డిజిటల్ టోకెన్ వివరాలను గోప్యంగా ఉంచుకోవడం మీ బాధ్యత.
- మీ ఆధారాలతో జరిగే అన్ని కార్యకలాపాలకు మీరే బాధ్యత వహించాలి.

---

### 4. బాధ్యతా రాహిత్య ప్రకటన (Limitation of Liability)
- నెట్‌వర్క్ అంతరాయాలు, ప్రభుత్వ బాహ్య సర్వర్ల డౌన్‌టైమ్ (ఉదా. Mana Panchayati, UBD Portal) లేదా సిస్టమ్ లోపాల వల్ల జరిగే ఆలస్యాలకు E-VEDHIKA బాధ్యత వహించదు.

---

### 5. సంప్రదింపులు & నవీకరణలు
నిబంధనలలో మార్పులు ఎప్పటికప్పుడు ఈ పేజీలోనే ప్రచురించబడతాయి. సందేహాల కోసం [support@e-vedhika.in](mailto:support@e-vedhika.in) లో సంప్రదించండి.
  `} />;
}

export function DisclaimerPage() {
  return <PageTemplate pageId="disclaimer" defaultTitle="బాధ్యతా రాహిత్య ప్రకటన (Disclaimer)" defaultContent={`
### ⚖️ బాధ్యతా రాహిత్య ప్రకటన (Official Disclaimer)
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

---

### 1. ప్రభుత్వేతర స్వతంత్ర పోర్టల్ ప్రకటన (Non-Governmental Entity Notice)
**E-VEDHIKA (ఈ-వేదిక - e-vedhika.in) అనేది ఒక స్వతంత్ర ప్రైవేట్ సాంకేతిక మరియు విద్యా పోర్టల్.**  
ఈ వెబ్‌సైట్ తెలంగాణ ప్రభుత్వం, ఆంధ్రప్రదేశ్ ప్రభుత్వం, పంచాయతీ రాజ్ మరియు గ్రామీణాభివృద్ధి శాఖ, లేదా భారత ప్రభుత్వంలోని ఏ ఇతర మంత్రిత్వ శాఖకు ప్రాతినిధ్యం వహించదు మరియు ఎటువంటి అధికారిక అనుబంధం కలిగి లేదు.

---

### 2. సమాచార విశ్వసనీయత & ఉద్దేశం (Purpose of Information)
- ఈ పోర్టల్‌లో అందించబడిన UBD Settings, DSC / DSK గైడ్‌లు, DSR నివేదికల గణనలు, మరియు ప్రభుత్వ ఆర్డర్లు (GOs) కేవలం పంచాయతీ సిబ్బందికి సాంకేతిక అవగాహన మరియు కార్యాలయ సహాయం అందించే ఉద్దేశంతో మాత్రమే సమకూర్చబడినవి.
- మేము సమాచారాన్ని ఖచ్చితంగా మరియు తాజా స్థితిలో ఉంచడానికి ప్రతి ప్రయత్నం చేసినప్పటికీ, అధికారిక ప్రయోజనాల కోసం వినియోగదారులు సంబంధిత అధికారిక ప్రభుత్వ వెబ్‌సైట్‌లు (ఉదాహరణకు: [epanchayat.telangana.gov.in](https://epanchayat.telangana.gov.in), [ubd.telangana.gov.in](https://ubd.telangana.gov.in)) లో మాత్రమే సరిచూసుకోవాలి.

---

### 3. టూల్స్ మరియు కాలిక్యులేటర్ల బాధ్యత (Calculators & Utility Tools)
- DSR Analyzer, Excel Merger, GPDP మరియు Farmer Registry టూల్స్ వినియోగదారుడి బ్రౌజర్‌లో లోకల్‌గా పనిచేస్తాయి. వీటి ద్వారా లెక్కించబడిన నివేదికలను అధికారిక రికార్డులుగా పరిగణించరాదు. తుది ఆమోదం కోసం అధికారిక పోర్టల్ సమర్పణలే ప్రామాణికం.

---

### 4. బాహ్య లింకులు (External Links Disclaimer)
- మా వెబ్‌సైట్ బాహ్య ప్రభుత్వ మరియు ప్రైవేట్ వెబ్‌సైట్‌లకు హైపర్‌లింక్‌లను కలిగి ఉండవచ్చు. ఆ బాహ్య సైట్‌ల కంటెంట్, లభ్యత లేదా గోప్యతా విధానాలపై మాకు ఎటువంటి నియంత్రణ ఉండదు.

---

### 5. సంప్రదించండి (Contact Details)
డిస్క్లైమర్‌కు సంబంధించి ఏవైనా ప్రశ్నలు ఉంటే మా అధికారిక ఇమెయిల్ ద్వారా సంప్రదించగలరు:  
- **Email:** [support@e-vedhika.in](mailto:support@e-vedhika.in) / [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
  `} />;
}

export function CookiePolicyPage() {
  return <PageTemplate pageId="cookies" defaultTitle="కుకీ విధానం (Cookie Policy)" defaultContent={`
### 🍪 కుకీ విధానం (Cookie Policy)
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

ఈ కుకీ పాలసీ (Cookie Policy) మా వెబ్‌సైట్ కుకీలను మరియు సంబంధిత సాంకేతికతలను ఎలా ఉపయోగిస్తుందో వివరిస్తుంది.

---

### 1. కుకీలు అంటే ఏమిటి? (What Are Cookies?)
కుకీలు అనేవి మీరు వెబ్‌సైట్‌ను సందర్శించినప్పుడు మీ కంప్యూటర్ లేదా మొబైల్ పరికరంలో నిల్వ చేయబడే చిన్న టెక్స్ట్ ఫైల్‌లు. ఇవి వెబ్‌సైట్ సమర్థవంతంగా పనిచేయడానికి, యూజర్ ప్రాధాన్యతలను గుర్తుంచుకోవడానికి మరియు వేగవంతమైన పనితీరును అందించడానికి ఉపయోగపడతాయి.

---

### 2. మేము ఉపయోగించే కుకీల రకాలు (Types of Cookies We Use)
- **అత్యవసర కుకీలు (Strictly Necessary Cookies):** ఈ కుకీలు వెబ్‌సైట్ సరిగ్గా పనిచేయడానికి మరియు సురక్షిత లాగిన్, సెషన్ మేనేజ్‌మెంట్ కోసం అవసరం.
- **పనితీరు & విశ్లేషణ కుకీలు (Performance & Analytics Cookies):** సందర్శకులు సైట్‌ను ఎలా ఉపయోగిస్తున్నారో తెలుసుకోవడానికి మరియు పేజీల లోడింగ్ స్పీడ్‌ను మెరుగుపరచడానికి ఇవి ఉపయోగపడతాయి.
- **గూగుల్ యాడ్‌సెన్స్ ప్రకటన కుకీలు (Google AdSense & Advertising Cookies):** గూగుల్ మరియు దాని అనుబంధ ప్రకటన నెట్‌వర్క్‌లు వినియోగదారుల ఆసక్తుల ఆధారంగా సంబంధిత ప్రకటనలను చూపించడానికి కుకీలను ఉపయోగిస్తాయి.

---

### 3. ప్రకటనల కుకీలను ఎలా నిర్వహించాలి? (Managing Advertising Cookies)
మీరు ప్రకటనల కుకీలను క్రింది మార్గాల ద్వారా సులభంగా నిర్వహించవచ్చు లేదా నిలిపివేయవచ్చు:
- [Google Ad Settings](https://adssettings.google.com/) పేజీని సందర్శించి వ్యక్తిగతీకరించిన ప్రకటనలను ఆఫ్ చేయండి.
- [Network Advertising Initiative (NAI)](http://www.networkadvertising.org/choices/) ద్వారా ఆప్ట్-అవుట్ అవ్వండి.
- మీ బ్రౌజర్ (Google Chrome, Mozilla Firefox, Microsoft Edge) సెట్టింగ్స్‌లోని **Privacy & Security &rarr; Cookies** విభాగంలో కుకీలను బ్లాక్ చేయవచ్చు లేదా క్లియర్ చేయవచ్చు.

---

### 4. మరిన్ని వివరాలు (Contact Us)
మా కుకీ వినియోగంపై మీకు ఏవైనా సందేహాలు ఉంటే, దయచేసి [support@e-vedhika.in](mailto:support@e-vedhika.in) లో మమ్మల్ని సంప్రదించండి.
  `} />;
}

export function EditorialPolicyPage() {
  return <PageTemplate pageId="editorial" defaultTitle="ఎడిటోరియల్ & వాస్తవ నిర్ధారణ విధానం (Editorial Policy)" defaultContent={`
### ✍️ ఎడిటోరియల్ & వాస్తవ నిర్ధారణ విధానం (Editorial & Fact-Checking Policy)
**వెబ్‌సైట్:** [https://www.e-vedhika.in/](https://www.e-vedhika.in/)

**E-VEDHIKA (ఈ-వేదిక)** గ్రామ పంచాయతీ సిబ్బందికి అత్యున్నత నాణ్యత, ఖచ్చితమైన మరియు విశ్వసనీయమైన సాంకేతిక సమాచారాన్ని అందించడానికి కట్టుబడి ఉంది.

---

### 1. కంటెంట్ రూపకల్పన ప్రమాణాలు (Content Creation Standards)
- **వాస్తవ నిర్ధారణ (Fact-Checking):** పోర్టల్‌లో ప్రచురించబడే ప్రతి టెక్నికల్ గైడ్, UBD విధానం, మరియు DSR మార్గదర్శకం క్షేత్రస్థాయి సీనియర్ కంప్యూటర్ ఆపరేటర్లు మరియు సాంకేతిక నిపుణులచే క్షుణ్ణంగా పరిశీలించబడుతుంది.
- **అధికారిక మూలాలు (Verified Sources):** ప్రభుత్వ ఆర్డర్లు (GOs) మరియు సర్క్యులర్లు కేవలం అధికారిక గెజిట్‌లు లేదా ధృవీకరించబడిన ప్రభుత్వ వెబ్‌సైట్‌ల నుండి మాత్రమే సేకరించి పొందుపరచబడతాయి.
- **ద్విభాషా స్పష్టత (Bilingual Accessibility):** సంక్లిష్టమైన సాంకేతిక పదాలను క్షేత్రస్థాయి ఉద్యోగులు సులభంగా అర్థం చేసుకునేలా స్వచ్ఛమైన తెలుగు మరియు ఆంగ్లంలో వివరించడం జరుగుతుంది.

---

### 2. సాఫ్ట్‌వేర్ & డ్రైవర్ల సమగ్రత (Software & Driver Integrity)
- సాఫ్ట్‌వేర్ హబ్‌లో అందించబడే ePass2003, mToken, ProxKey క్రిప్టో డ్రైవర్లు మరియు యుటిలిటీ టూల్స్ డిజిటల్ సంతకాలతో (Digitally Signed) కూడిన అసలైన ఫైల్స్ మాత్రమే.
- ఏ విధమైన అనధికారిక, పైరేటెడ్ లేదా ప్రమాదకరమైన సాఫ్ట్‌వేర్‌లను మేము అనుమతించము.

---

### 3. దిద్దుబాట్లు & నవీకరణల విధానం (Corrections & Updates Policy)
- ఏదైనా సమాచారంలో లోపం ఉన్నట్లు లేదా ప్రభుత్వ నిబంధనలలో మార్పు వచ్చినట్లు గుర్తిస్తే, మా సాంకేతిక బృందం 24 గంటల్లోపు ఆ కంటెంట్‌ను సమీక్షించి నవీకరిస్తుంది.
- ఏదైనా సమాచార సవరణను సూచించాలనుకుంటే యూజర్లు నేరుగా [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com) కు లేదా పోర్టల్‌లోని **Suggestions** విభాగంలో తెలియజేయవచ్చు.

---

### 4. సంపాదకీయ బృందం (Editorial Team & Authors)
- **ప్రధాన సంపాదకుడు & సిస్టమ్ అడ్మిన్:** రాకేష్ ధావన్ (Rakesh Dhawan) & E-Vedhika Technical Contributors.
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

ఈ ప్లాట్‌ఫారమ్ కేవలం ఒక వెబ్‌సైట్ మాత్రమే కాదు, ఇది పంచాయతీ రాజ్ విభాగంలోని క్షేత్రస్థాయి సిబ్బంది ఎదుర్కొనే సాంకేతిక సవాళ్లను అధిగమించడానికి ఒక డిజిటల్ సహచరుడు. మా లక్ష్యం పారదర్శకత, జవాబుదారీతనం మరియు సామర్థ్యాన్ని పెంచడం.

---

### 🚀 ప్రధాన ఫీచర్లు & సేవలు (Core Capabilities)
- **UBD Settings & DSK Troubleshooting**: తెలంగాణ & ఏపీ పంచాయతీ UBD పోర్టల్ డీఎస్కే, డీఎస్సీ డిజిటల్ సిగ్నేచర్ డ్రైవర్లు మరియు బ్రౌజర్ పరిష్కారాలు.
- **DSR Analyzer & Calculators**: సివిల్ మరియు పంచాయతీ పనుల అంచనాలు, డిజిటల్ మ్యాపింగ్ మరియు DSR వర్క్ టేబుల్స్.
- **Farmer Registry & Verification**: రైతు రిజిస్ట్రీ మరియు లబ్ధిదారుల వివరాల సరిచూసే నిష్పాక్షిక సాధనం.
- **GOs & Utility Formats**: జీవోలు, అధికారిక అప్లికేషన్ ఫార్మాట్‌లు మరియు డౌన్‌లోడ్స్.
- **Software Hub**: ePass2003, mToken, జావాలు, కంపెసర్లు మరియు అవసరమైన సాఫ్ట్‌వేర్లు.

---

### 💡 మా విజన్ (Our Vision)
గ్రామ పంచాయతీలను డిజిటల్ ఇండియా దిశగా నడిపించడం మరియు క్షేత్రస్థాయిలో పని చేసే సిబ్బందికి అత్యాధునిక సాంకేతిక పరిజ్ఞానాన్ని అందుబాటులోకి తీసుకురావడం.

---

### 📞 సంప్రదింపుల వివరాలు (Contact & Support Channels)
- **1. Support Email**: [support@e-vedhika.in](mailto:support@e-vedhika.in)
- **2. Admin Email**: [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
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
- **WhatsApp అధికారిక ఛానెల్**: [E-Vedhika వాట్సాప్ ఛానెల్‌లో చేరండి](https://whatsapp.com/channel/0029VbDYABvKQuJFzU48c92u)
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
