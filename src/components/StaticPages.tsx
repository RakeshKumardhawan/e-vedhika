import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText, Info, Mail, Map, Send, CheckCircle2, AlertCircle, Phone, Clock, MessageSquare } from "lucide-react";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { PracticalTutorialsHub } from "./KnowledgeHub";

// Default Static Data
export const DEFAULT_STATIC_CONTENT = {
  privacy: `### 1. పరిచయం & సమాచార సేకరణ (Introduction & Information Collection)
**ఈ-వేదిక (E-Vedhika - https://www.e-vedhika.in/)** పోర్టల్‌ను సందర్శించే గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, టెక్నికల్ అసిస్టెంట్లు మరియు సామాన్య పౌరుల వ్యక్తిగత గోప్యతను రక్షించడానికి మేము పూర్తిగా కట్టుబడి ఉన్నాము.
* **ఖాతా వివరాలు (Google Sign-In & Firebase Authentication):** మీరు స్వచ్ఛందంగా పోర్టల్‌లో లాగిన్ అయినప్పుడు లేదా రిజిస్టర్ అయినప్పుడు మాత్రమే మీ పేరు, ఇమెయిల్ చిరునామా, ఫోన్ నంబర్ (ఐచ్ఛికం), హోదా మరియు జిల్లా/మండలం వివరాలను సేకరిస్తాము.
* **ఆన్‌లైన్ టూల్స్ ఫైల్ భద్రత (100% Client-Side File Processing):** మీరు DSR Analyzer, Multi-Day Attendance, MAS, Excel Merger, Excel A4 Print లేదా PDF Compress టూల్స్‌లో అప్‌లోడ్ చేసే ఎక్సెల్/PDF ఫైళ్లు మీ బ్రౌజర్ (Local Memory) లోనే ప్రాసెస్ చేయబడతాయి. ఆ ఫైళ్లను మా సర్వర్లలో శాశ్వతంగా నిల్వ చేయము.
* **సాంకేతిక లాగ్స్:** సైబర్ భద్రత మరియు పోర్టల్ పనితీరు విశ్లేషణ కోసం సాధారణ బ్రౌజర్ రకం, పరికరం (Device Type) మరియు పేజీ వీక్షణ గణాంకాలు మాత్రమే సేకరించబడతాయి.

### 2. సమాచార వినియోగం (How We Use Information)
సేకరించిన సమాచారాన్ని కేవలం క్రింది ప్రయోజనాల కోసం మాత్రమే ఉపయోగిస్తాము:
* పోర్టల్‌లోని ఆన్‌లైన్ టూల్స్, కమ్యూనిటీ ఫోరమ్ మరియు సపోర్ట్ టికెట్ సేవలను వ్యక్తిగతీకరించడానికి.
* మీరు సమర్పించిన సాంకేతిక సమస్యలు లేదా సూచనలపై తిరిగి సమాధానం ఇవ్వడానికి.
* ముఖ్యమైన పంచాయతీరాజ్ సాంకేతిక అప్‌డేట్లు మరియు పోర్టల్ భద్రతా హెచ్చరికలను అందించడానికి.

### 3. కుకీలు మరియు గూగుల్ యాడ్‌సెన్స్ (Cookies & Google AdSense DART Cookie Policy)
ఈ వెబ్‌సైట్ ఉచిత నిర్వహణ మరియు సర్వర్ ఖర్చుల కోసం **Google AdSense** ప్రకటనలను ఉపయోగిస్తుంది:
* Google వంటి థర్డ్-పార్టీ వెండర్లు, యూజర్లు మా వెబ్‌సైట్‌ను మరియు ఇంటర్నెట్‌లోని ఇతర సైట్‌లను గతంలో సందర్శించిన ఆధారంగా ప్రకటనలను చూపించడానికి కుకీలను (ముఖ్యంగా **DART Cookie**) ఉపయోగిస్తారు.
* యూజర్లు [Google Ads Settings](https://adssettings.google.com) పేజీని సందర్శించడం ద్వారా వ్యక్తిగతీకరించిన ప్రకటనల (Personalized Advertising) నుండి ఎప్పుడైనా వైదొలగవచ్చు (Opt-out).

### 4. సమాచార భద్రత & గోప్యతా హక్కులు (Data Security & User Rights)
మేము Google Firebase Authentication మరియు Cloud Firestore యొక్క ఎన్‌క్రిప్టెడ్ భద్రతా ప్రమాణాలను (SSL/TLS Encryption & Firestore Security Rules) ఉపయోగిస్తాము. మీ వ్యక్తిగత సమాచారాన్ని ఏ థర్డ్-పార్టీ మార్కెటింగ్ సంస్థలకు విక్రయించము లేదా దుర్వినియోగం చేయము. యూజర్లు తమ ఖాతా వివరాలను సవరించుకోవడానికి లేదా తొలగించమని కోరడానికి **support@e-vedhika.in** కు ఇమెయిల్ చేయవచ్చు.`,

  terms: `### 1. నిబంధనల ఆమోదం (Acceptance of Terms)
**ఈ-వేదిక (E-Vedhika - https://www.e-vedhika.in/)** వెబ్‌సైట్‌ను మరియు ఇందులోని ఆన్‌లైన్ టూల్స్‌ను ఉపయోగించడం ద్వారా, మీరు ఈ క్రింది నిబంధనలు మరియు షరతులకు కట్టుబడి ఉంటారని అంగీకరిస్తున్నారు.

### 2. స్వతంత్ర వేదిక హోదా (Independent Non-Governmental Status)
* ఈ-వేదిక అనేది క్షేత్రస్థాయి పంచాయతీ సిబ్బంది మరియు పౌరుల సౌకర్యార్థం రూపొందించబడిన **స్వతంత్ర ప్రైవేట్ సాంకేతిక వేదిక (Independent Educational & Utility Portal)**.
* ఇది తెలంగాణ లేదా ఆంధ్రప్రదేశ్ ప్రభుత్వానికి గానీ, పంచాయతీరాజ్ శాఖకు గానీ, NIC కి గానీ చెందిన అధికారిక ప్రభుత్వ వెబ్‌సైట్ కాదు.

### 3. వినియోగదారుల బాధ్యతలు & పోస్ట్ నిబంధనలు (User Conduct & Content Moderation)
* ఈ పోర్టల్‌లోని ఆన్‌లైన్ టూల్స్ (DSR Analyzer, Multi-Day Attendance, GPDP Planning, Farmer Registry, Excel Print, PDF Compress) కేవలం ఆఫీస్ పనిని సులభతరం చేయడానికి మాత్రమే.
* యూజర్లు సమర్పించే పోస్ట్‌లు లేదా సమస్యలు ముందుగా **Pending (అడ్మిన్ సమీక్ష)** లోకి వెళ్తాయి. అడ్మిన్ ధృవీకరించిన తర్వాతే పబ్లిక్‌గా ప్రచురించబడతాయి.
* చట్టవిరుద్ధమైన, అసభ్యకరమైన, నకిలీ ప్రభుత్వ ఉత్తర్వులు లేదా ఇతరుల వ్యక్తిగత గోప్యతకు భంగం కలిగించే సమాచారాన్ని పోస్ట్ చేయడం పూర్తిగా నిషేధించబడింది.

### 4. మేధో సంపత్తి హక్కులు (Intellectual Property)
ఈ వెబ్‌సైట్‌లో రూపొందించబడిన కస్టమ్ సాఫ్ట్‌వేర్ కోడ్, ఆన్‌లైన్ అనలైజర్ అల్గారిథమ్స్, ట్యుటోరియల్ వ్యాసాలు మరియు డిజైన్ **E-Vedhika** కు చెందినవి. ప్రభుత్వ జీవోలు (GOs) మరియు చట్టాలు పబ్లిక్ డొమైన్‌లోని సంబంధిత ప్రభుత్వ శాఖలకు చెందుతాయి.`,

  disclaimer: `### 1. ప్రభుత్వేతర స్వతంత్ర వేదిక (Non-Governmental Disclaimer)
**ఈ-వేదిక (E-Vedhika - https://www.e-vedhika.in/)** అనేది ఒక స్వతంత్ర సాంకేతిక సమాచార మరియు ఆన్‌లైన్ యూటిలిటీ పోర్టల్. దీనికి కేంద్ర ప్రభుత్వంతో గానీ, తెలంగాణ లేదా ఆంధ్రప్రదేశ్ రాష్ట్ర ప్రభుత్వాలతో గానీ, పంచాయతీ రాజ్ మరియు గ్రామీణాభివృద్ధి శాఖతో గానీ ఎటువంటి అధికారిక అనుబంధం లేదు.

### 2. సమాచార ఖచ్చితత్వం & అధికారిక నిర్ధారణ (Accuracy & Official Verification)
* ఈ పోర్టల్‌లో అందించే ప్రభుత్వ ఉత్తర్వులు (GOs), పంచాయతీరాజ్ చట్టం సారాంశం, UBD/DSC టెక్నికల్ గైడ్‌లు మరియు వార్తలు కేవలం విద్యాపరమైన అవగాహన మరియు తక్షణ రిఫరెన్స్ కోసం మాత్రమే.
* మేము సమాచారాన్ని అత్యంత ఖచ్చితత్వంతో అందించడానికి కృషి చేసినప్పటికీ, ఏదైనా అధికారిక, ఆర్థిక లేదా చట్టపరమైన నిర్ణయం తీసుకునే ముందు సంబంధిత అధికారిక ప్రభుత్వ వెబ్‌సైట్లను (**epanchayat.telangana.gov.in**, **ubd.telangana.gov.in**, **egramswaraj.gov.in**, **goir.telangana.gov.in**) మరియు ఒరిజినల్ గెజిట్ కాపీలను సరిచూసుకోగలరు.

### 3. ఆన్‌లైన్ టూల్స్ & డ్రైవర్ల వినియోగం (Use of Tools & Software)
* పోర్టల్‌లోని ఆటోమేటెడ్ రిపోర్ట్ టూల్స్ ద్వారా జనరేట్ చేసిన నివేదికలను ఉన్నతాధికారులకు సమర్పించే ముందు ఆపరేటర్లు/కార్యదర్శులు ఒకసారి Raw డేటాతో సరిచూసుకోవాలి.
* బాహ్య ప్రభుత్వ వెబ్‌సైట్ల (External Links) కంటెంట్ లేదా సర్వర్ డౌన్‌టైమ్‌పై ఈ-వేదికకు ఎటువంటి నియంత్రణ ఉండదు.`,

  cookies: `### 1. కుకీలు అంటే ఏమిటి? (What Are Cookies?)
కుకీలు అనేవి మీరు వెబ్‌సైట్‌ను సందర్శించినప్పుడు మీ కంప్యూటర్ లేదా మొబైల్ బ్రౌజర్‌లో నిల్వ చేయబడే చిన్న టెక్స్ట్ ఫైళ్లు. ఇవి మీ లాగిన్ సెషన్‌ను గుర్తుంచుకోవడానికి మరియు సైట్ వేగంగా పనిచేయడానికి సహాయపడతాయి.

### 2. మేము కుకీలను ఎలా ఉపయోగిస్తాము? (How E-Vedhika Uses Cookies)
* **అవసరమైన కుకీలు (Essential & Authentication Cookies):** Firebase Google Sign-In ద్వారా మీరు లాగిన్ అయినప్పుడు మీ సెషన్‌ను సురక్షితంగా ఉంచడానికి మరియు టెక్స్ట్ జూమ్/భాషా ప్రాధాన్యతలను గుర్తుంచుకోవడానికి ఉపయోగిస్తాము.
* **ప్రకటనల కుకీలు (Google AdSense & DoubleClick DART Cookies):** మా వెబ్‌సైట్‌లో ప్రకటనలను ప్రదర్శించడానికి Google AdSense కుకీలను ఉపయోగిస్తుంది.

### 3. కుకీల నియంత్రణ (Managing & Disabling Cookies)
మీరు మీ బ్రౌజర్ సెట్టింగ్స్ (Chrome / Edge / Firefox -> Privacy & Security -> Cookies) ద్వారా ఎప్పుడైనా కుకీలను క్లియర్ చేయవచ్చు లేదా బ్లాక్ చేయవచ్చు.`,

  editorial: `### 1. ఎడిటోరియల్ లక్ష్యం & విలువలు (Editorial Mission & Core Values)
**ఈ-వేదిక (E-Vedhika)** పోర్టల్‌లో ప్రచురించబడే ప్రతి సాంకేతిక ట్యుటోరియల్, ప్రభుత్వ ఉత్తర్వుల విశ్లేషణ మరియు గ్రామ పంచాయతీ మార్గదర్శిని క్షేత్రస్థాయి ఉద్యోగులకు మరియు పౌరులకు నిజమైన, ఆచరణాత్మక పరిష్కారాన్ని అందించాలనే లక్ష్యంతో రూపొందించబడుతుంది.

### 2. సమాచార సేకరణ & ప్రామాణిక వనరులు (Source Verification)
* మేము ఎప్పుడూ ఊహాజనిత జీవో నంబర్లను లేదా ధృవీకరించని సర్క్యులర్లను ప్రచురించము.
* ప్రభుత్వ ఉత్తర్వులు మరియు చట్టపరమైన సమాచారాన్ని అధికారిక ప్రభుత్వ పోర్టల్స్ (GOIR Telangana, e-Panchayat, eGramSwaraj, CRS/UBD) నుండి మాత్రమే సేకరించి, సులభమైన తెలుగులో వివరిస్తాము.
* అధికారిక ప్రభుత్వ నిబంధనలకు మరియు మా స్వతంత్ర సాంకేతిక చిట్కాలకు (Independent Technical Troubleshooting) మధ్య స్పష్టమైన తేడాను పాఠకులకు తెలియజేస్తాము.

### 3. AI సహాయం & మానవ సంపాదకీయ ధృవీకరణ (AI Assistance & Human Verification Policy)
* కంటెంట్ ఫార్మాటింగ్, భాషా అనువాదం లేదా కోడింగ్ సహాయం కోసం AI సాధనాలను ఉపయోగించినప్పటికీ, ప్రతి వ్యాసం మరియు ట్యుటోరియల్ ప్రచురించబడే ముందు **అడ్మిన్ మరియు క్షేత్రస్థాయి సాంకేతిక నిపుణులచే (Human Editorial Verification)** నేరుగా కంప్యూటర్లలో పరీక్షించబడి ధృవీకరించబడుతుంది.
* సాధారణ వినియోగదారులు సమర్పించే పోస్ట్‌లు నేరుగా పబ్లిష్ కావు; అడ్మిన్ సమీక్షించి ఆమోదించిన (Approved) తర్వాతే వెబ్‌సైట్‌లో కనిపిస్తాయి.

### 4. సవరణల విధానం (Corrections & Update Policy)
ప్రభుత్వ పోర్టల్స్ లేదా సాఫ్ట్‌వేర్ వెర్షన్లు మారినప్పుడు మా ట్యుటోరియల్స్‌ను ఎప్పటికప్పుడు అప్‌డేట్ చేస్తాము మరియు ప్రతి గైడ్‌పై **"చివరిగా ధృవీకరించిన తేదీ (Last Verified Date)"** ను స్పష్టంగా సూచిస్తాము. ఏదైనా సమాచారంలో సవరణ అవసరమైతే పాఠకులు **support@e-vedhika.in** కు తెలియజేయవచ్చు; 24 గంటల్లోపు పరిశీలించి సరిచేస్తాము.`,

  about: `### 🌟 ఈ-వేదిక (E-Vedhika) ఎందుకు ప్రారంభించబడింది?
గ్రామ పంచాయతీ కార్యదర్శులు మరియు ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు ప్రతిరోజూ అనేక ఆన్‌లైన్ పోర్టల్స్ (Mana Panchayati, UBD, eGramSwaraj, House Tax, Farmer Registry) లో పనిచేయాల్సి ఉంటుంది. రోజువారీ DSR నివేదికల తయారీ, మల్టీ-డే హాజరు విశ్లేషణ, పెద్ద ఎక్సెల్ షీట్ల ప్రింటింగ్, మరియు UBD పోర్టల్‌లో DSC డిజిటల్ సంతకం (Java / Edge IE Mode) సమస్యల వల్ల క్షేత్రస్థాయి సిబ్బంది ఎదుర్కొంటున్న సాంకేతిక ఇబ్బందులను పరిష్కరించడానికి **"All Problems One Solution at One Place"** అనే లక్ష్యంతో **ఈ-వేదిక (E-Vedhika)** ప్రారంభించబడింది.

### 👥 ఈ పోర్టల్ ఎవరికి ఉపయోగపడుతుంది? (Target Audience)
* **గ్రామ పంచాయతీ కార్యదర్శులు (Panchayat Secretaries):** రోజువారీ DSR, జనన/మరణ నమోదు (UBD), GPDP బడ్జెట్ ప్రణాళిక, తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 రిఫరెన్స్ మరియు అధికారిక ఫార్మాట్ల కోసం.
* **ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు (e-Panchayat Computer Operators):** DSR Analyzer, Multi-Day Attendance, MAS Report, Excel Merger, Excel A4 Print, PDF Compressor మరియు DSC/Java ట్రబుల్‌షూటింగ్ కోసం.
* **టెక్నికల్ అసిస్టెంట్లు, సర్పంచులు & గ్రామ పంచాయతీ సిబ్బంది:** GPDP ప్రణాళికలు, ప్రభుత్వ జీవోలు మరియు గ్రామ పంచాయతీ రికార్డుల సమాచారం కోసం.
* **సామాన్య పౌరులు (Citizens):** జనన/మరణ సర్టిఫికెట్ దరఖాస్తు విధానాలు, ఇంటి పన్ను నిబంధనలు, దరఖాస్తు ఫార్మాట్లు మరియు అత్యవసర హెల్ప్‌లైన్ నంబర్ల కోసం.

### 🛠️ మేము అందించే ప్రధాన సేవలు & టూల్స్
1. **డిజిటల్ వర్క్‌స్పేస్ టూల్స్:** Daily DSR Analyzer, Multi-Day Attendance Consolidator, Monthly Activity (MAS) Formatter, Multi-File Excel Merger, GPDP Budget Allocation Tool, Farmer Registry Verification, Smart Excel A4 Printer, మరియు Client-Side PDF Compressor.
2. **UBD & DSC టెక్నికల్ నాలెడ్జ్ హబ్:** తెలంగాణ & ఏపీ UBD పోర్టల్ వినియోగం, WatchData ProxKey, HYP2003/ePass2003 టోకెన్ ఇన్‌స్టాలేషన్, Java 32-bit మరియు Microsoft Edge IE Mode పై 11-అంశాల ప్రాక్టికల్ ట్యుటోరియల్స్.
3. **జీవోలు, ఫార్మాట్లు & చట్టం గైడ్:** తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 తెలుగు గైడ్ మరియు ఆఫీస్ ఫార్మాట్ల లైబ్రరీ.

### 👨‍💻 వ్యవస్థాపకుని పరిచయం (Founder & Developer)
నమస్కారం! నా పేరు **ధావన్ రాకేష్ కుమార్ (Rakesh Kumar Dhawan)**. ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్‌గా క్షేత్రస్థాయిలో పనిచేస్తూ, రోజువారీ అడ్మినిస్ట్రేటివ్ పనులు మరియు సాంకేతిక సమస్యలను స్వయంగా ఎదుర్కొన్న అనుభవంతో, తోటి ఆపరేటర్లు మరియు కార్యదర్శుల సమయాన్ని ఆదా చేయడానికి ఈ వేదికను రూపొందించాను.

### ⚖️ స్వతంత్ర వేదిక ప్రకటన (Non-Governmental Transparency Notice)
**ఈ-వేదిక (https://www.e-vedhika.in/)** అనేది పూర్తిగా స్వతంత్ర సాంకేతిక మరియు విద్యాపరమైన వెబ్‌సైట్. ఇది ఏ ప్రభుత్వ శాఖకు చెందిన అధికారిక పోర్టల్ కాదు.`,

  contact: `**ఈ-వేదిక (E-Vedhika)** పోర్టల్‌లోని ఆన్‌లైన్ టూల్స్, UBD/DSC టెక్నికల్ గైడ్‌లు, లేదా కంటెంట్‌కు సంబంధించి మీకు ఏవైనా సందేహాలు, సూచనలు లేదా ఫిర్యాదులు ఉంటే క్రింది అధికారిక మార్గాల ద్వారా లేదా దిగువ ఉన్న **Contact Form** ద్వారా మమ్మల్ని సంప్రదించవచ్చు:

* **অధికారిక సపోర్ట్ ఇమెయిల్ (Support Helpdesk):** [support@e-vedhika.in](mailto:support@e-vedhika.in)
* **అడ్మినిస్ట్రేషన్ ఇమెయిల్ (Admin Email):** [evedhikasupport@gmail.com](mailto:evedhikasupport@gmail.com)
* **వాట్సాప్ / ఫోన్ హెల్ప్‌డెస్క్:** +91 99854 02310
* **టెలిగ్రామ్ సపోర్ట్ బోట్:** [@e_vedhika_alerts_bot](https://t.me/e_vedhika_alerts_bot)
* **పని వేళలు (Working Hours):** సోమవారం నుండి శనివారం వరకు (ఉదయం 09:30 AM – సాయంత్రం 06:30 PM IST)`
};

export function useStaticPageContent(pageKey: keyof typeof DEFAULT_STATIC_CONTENT) {
  const [content, setContent] = useState<string>(DEFAULT_STATIC_CONTENT[pageKey]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchContent = async () => {
      try {
        const docRef = doc(db, "site_config", "static_pages");
        const snap = await getDoc(docRef);
        if (snap.exists() && isMounted) {
          const data = snap.data();
          if (data && data[pageKey] && String(data[pageKey]).trim().length > 80) {
            setContent(data[pageKey]);
          }
        }
      } catch (err) {
        console.error("Error fetching static page content:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchContent();
    return () => {
      isMounted = false;
    };
  }, [pageKey]);

  return { content, loading };
}

const PageWrapper = ({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: any;
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Header Banner */}
      <header className="bg-[#00609C] text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} /> హోమ్ పేజీకి వెళ్ళండి (Back to Home)
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Icon size={32} className="text-amber-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {title}
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6 leading-relaxed text-slate-700 text-sm sm:text-base">
          {children}
        </div>
      </main>
    </div>
  );
};

const MarkdownRenderer = ({ content, loading }: { content: string; loading: boolean }) => {
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider">లోడ్ అవుతోంది (Loading...)</span>
      </div>
    );
  }
  return (
    <div className="prose prose-slate max-w-none space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-2xl font-black text-slate-900 mt-6 mb-3" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-slate-900 mt-5 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-slate-700" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-600 font-bold underline hover:text-blue-800" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export function PrivacyPolicyPage() {
  const { content, loading } = useStaticPageContent("privacy");
  return (
    <PageWrapper
      title="గోప్యతా విధానం (Privacy Policy)"
      subtitle="E-Vedhika యూజర్ డేటా భద్రత, బ్రౌజర్-సైడ్ ఫైల్ ప్రాసెసింగ్ మరియు Google AdSense కుకీ నిబంధనలు"
      icon={Shield}
    >
      <MarkdownRenderer content={content} loading={loading} />
    </PageWrapper>
  );
}

export function TermsPage() {
  const { content, loading } = useStaticPageContent("terms");
  return (
    <PageWrapper
      title="నిబంధనలు & షరతులు (Terms & Conditions)"
      subtitle="E-Vedhika పోర్టల్ మరియు ఆన్‌లైన్ టూల్స్ వినియోగ నియమాలు"
      icon={FileText}
    >
      <MarkdownRenderer content={content} loading={loading} />
    </PageWrapper>
  );
}

export function DisclaimerPage() {
  const { content, loading } = useStaticPageContent("disclaimer");
  return (
    <PageWrapper
      title="బాధ్యతా రాహిత్య ప్రకటన (Non-Governmental Disclaimer)"
      subtitle="E-Vedhika స్వతంత్ర వేదిక హోదా మరియు అధికారిక ప్రభుత్వ సమాచార నిర్ధారణ ప్రకటన"
      icon={Shield}
    >
      <MarkdownRenderer content={content} loading={loading} />
    </PageWrapper>
  );
}

export function CookiePolicyPage() {
  const { content, loading } = useStaticPageContent("cookies");
  return (
    <PageWrapper
      title="కుకీ విధానం (Cookie Policy)"
      subtitle="E-Vedhika కుకీల వినియోగం, Firebase Auth మరియు Google AdSense DART కుకీల సమాచారం"
      icon={FileText}
    >
      <MarkdownRenderer content={content} loading={loading} />
    </PageWrapper>
  );
}

export function EditorialPolicyPage() {
  const { content, loading } = useStaticPageContent("editorial");
  return (
    <PageWrapper
      title="ఎడిటోరియల్ పాలసీ (Editorial & Verification Policy)"
      subtitle="E-Vedhika కంటెంట్ నాణ్యతా ప్రమాణాలు, ప్రామాణిక వనరుల పరిశీలన మరియు మానవ సంపాదకీయ ధృవీకరణ"
      icon={FileText}
    >
      <MarkdownRenderer content={content} loading={loading} />
    </PageWrapper>
  );
}

export function AboutPage({ landingPageData }: { landingPageData?: any }) {
  const { content, loading } = useStaticPageContent("about");
  return (
    <PageWrapper
      title="మా గురించి (About E-Vedhika)"
      subtitle="E-Vedhika - All Problems One Solution at One Place (Digital Governance & e-Panchayat Utility Portal)"
      icon={Info}
    >
      <MarkdownRenderer content={content} loading={loading} />
      {landingPageData && (landingPageData.heroTitle || landingPageData.aboutText) && (
        <section className="mt-6 pt-6 border-t border-slate-200 space-y-2">
          <h2 className="text-lg font-bold text-slate-900">
            {landingPageData.heroTitle || "పోర్టల్ విశేషాలు"}
          </h2>
          {landingPageData.aboutText && <p className="text-slate-600">{landingPageData.aboutText}</p>}
        </section>
      )}
    </PageWrapper>
  );
}

export function ContactPage() {
  const { content, loading } = useStaticPageContent("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setErrorMsg("దయచేసి అన్ని వివరాలను (పేరు, ఇమెయిల్, విషయం, సందేశం) నింపండి.");
      setSubmitStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg("దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను (Valid Email Address) నమోదు చేయండి.");
      setSubmitStatus("error");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Save message in Firestore suggestions/support collection
      await addDoc(collection(db, "suggestions"), {
        name: name.trim(),
        email: email.trim(),
        village: subject.trim(),
        category: "Contact Us Form",
        suggestion: `[Subject: ${subject.trim()}] (Email: ${email.trim()})\n${message.trim()}`,
        msg: `[Subject: ${subject.trim()}] (Email: ${email.trim()})\n${message.trim()}`,
        time: Date.now(),
        status: "pending",
        uid: "public_contact_form",
      });

      // 2. Also notify admin via Telegram backend route if available
      fetch("/api/telegram/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "system",
          message: `📩 <b>New Contact Us Message (E-Vedhika)</b>\n\n<b>Name:</b> ${name.trim()}\n<b>Email:</b> ${email.trim()}\n<b>Subject:</b> ${subject.trim()}\n<b>Message:</b> ${message.trim().slice(0, 400)}`
        }),
      }).catch(() => {});

      setSubmitStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact form submission error:", err);
      setErrorMsg("సందేశం పంపడంలో సాంకేతిక లోపం ఏర్పడింది. దయచేసి support@e-vedhika.in కు నేరుగా ఇమెయిల్ చేయండి.");
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper
      title="మమ్మల్ని సంప్రదించండి (Contact Us & Technical Helpdesk)"
      subtitle="సహాయం, సాంకేతిక సందేహాలు, సవరణలు మరియు సూచనల కోసం E-Vedhika సపోర్ట్ విభాగం"
      icon={Mail}
    >
      <MarkdownRenderer content={content} loading={loading} />

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
          <Mail className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-950">ఇమెయిల్ హెల్ప్‌డెస్క్</h3>
            <a href="mailto:support@e-vedhika.in" className="text-xs font-bold text-blue-700 underline block mt-1">
              support@e-vedhika.in
            </a>
            <a href="mailto:evedhikasupport@gmail.com" className="text-[11px] font-semibold text-slate-600 block">
              evedhikasupport@gmail.com
            </a>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
          <Phone className="text-emerald-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">వాట్సాప్ & టెలిగ్రామ్</h3>
            <p className="text-xs font-bold text-emerald-800 mt-1">+91 99854 02310</p>
            <a
              href="https://t.me/e_vedhika_alerts_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-emerald-700 underline block"
            >
              @e_vedhika_alerts_bot
            </a>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
          <Clock className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">సపోర్ట్ పని వేళలు</h3>
            <p className="text-xs font-bold text-amber-900 mt-1">సోమవారం – శనివారం</p>
            <p className="text-[11px] font-semibold text-slate-600">09:30 AM – 06:30 PM (IST)</p>
          </div>
        </div>
      </div>

      {/* Interactive Contact Form */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-[#00609C] text-white">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                సంప్రదింపు ఫారమ్ (Send Us a Message)
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                మీ సాంకేతిక సందేహాలు, అభిప్రాయాలు లేదా సవరణ సూచనలను ఇక్కడ నేరుగా పంపండి (24 గంటల్లోపు సమాధానం ఇవ్వబడుతుంది).
              </p>
            </div>
          </div>

          {submitStatus === "success" && (
            <div className="my-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div className="text-xs sm:text-sm">
                <p className="font-black">ధన్యవాదాలు! మీ సందేశం విజయవంతంగా నమోదు చేయబడింది.</p>
                <p className="font-medium mt-0.5">
                  మా సపోర్ట్ బృందం మీ సందేశాన్ని పరిశీలించి, మీరు అందించిన ఇమెయిల్ చిరునామాకు త్వరలో సమాధానం పంపుతుంది.
                </p>
              </div>
            </div>
          )}

          {submitStatus === "error" && errorMsg && (
            <div className="my-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
              <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={20} />
              <p className="text-xs sm:text-sm font-bold">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4 mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  1. పేరు (Your Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="మీ పూర్తి పేరు టైప్ చేయండి"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  2. ఇమెయిల్ (Email Address) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                3. విషయం (Subject) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ఉదా: UBD DSC Signer సమస్య / DSR Analyzer సందేహం / వెబ్‌సైట్ సూచన"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1.5">
                4. సందేశం (Message) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="మీ సమస్య లేదా సూచన వివరాలను ఇక్కడ స్పష్టంగా రాయండి..."
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00609C] hover:bg-[#0d3b66] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              <Send size={16} />
              <span>{submitting ? "పంపబడుతోంది (Sending...)" : "సందేశం పంపండి (Submit Message)"}</span>
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}

export function SitemapContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    if (onNavigate) onNavigate();
  };

  const sections = [
    {
      title: "1. ప్రధాన పబ్లిక్ పేజీలు (Main Portal Pages)",
      links: [
        { name: "హోమ్ పేజీ & తాజా అప్‌డేట్స్ (Home)", path: "/" },
        { name: "మన పంచాయతీ డిజిటల్ వర్క్‌స్పేస్ (Workspace)", path: "/workspace" },
        { name: "ప్రభుత్వ జీవోలు & ఆఫీస్ ఫార్మాట్లు (GOs & Formats)", path: "/gos_formats" },
        { name: "సాఫ్ట్‌వేర్ & డ్రైవర్స్ హబ్ (Software Hub)", path: "/software_hub" },
        { name: "UBD లైవ్ ట్రాకర్ & ఆఫీస్ కోడ్ డైరెక్టరీ (UBD Tracker)", path: "/ubd_tracker" },
        { name: "రైతు రిజిస్ట్రీ ల్యాండ్ వెరిఫికేషన్ (Farmer Registry)", path: "/farmer_registry" },
        { name: "ముఖ్యమైన ప్రభుత్వ పోర్టల్ లింకులు (Useful Links)", path: "/useful_links" },
        { name: "అత్యవసర హెల్ప్‌లైన్ నంబర్లు (Emergency Contacts)", path: "/priority_services/emergency" },
        { name: "సూచనలు & టెక్నికల్ హెల్ప్‌డెస్క్ (Suggestions)", path: "/suggestions" },
        { name: "సిస్టమ్ అప్‌డేట్స్ చరిత్ర (Changelog)", path: "/changelog" },
      ]
    },
    {
      title: "2. ఆన్‌లైన్ టూల్స్ & టెక్నికల్ నాలెడ్జ్ హబ్ (Workspace Tools & Guides)",
      links: [
        { name: "డైలీ DSR & హాజరు అనలైజర్ (Daily DSR Analyzer)", path: "/workspace/dsr" },
        { name: "మల్టీ-డే హాజరు విశ్లేషణ (Multi-Day Attendance)", path: "/workspace/multiday" },
        { name: "డిజిటల్ ట్రైనింగ్ & 11-అంశాల ట్యుటోరియల్స్ (Digital Training)", path: "/workspace/training" },
        { name: "తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 గైడ్ (Knowledge Hub)", path: "/workspace/pract" },
        { name: "మాసాంతపు యాక్టివిటీ రిపోర్ట్ (Monthly Activity MAS)", path: "/workspace/monthly-activity" },
        { name: "మల్టీ-ఫైల్ ఎక్సెల్ మెర్జర్ (Excel File Merger)", path: "/workspace/excel-merge" },
        { name: "GPDP బడ్జెట్ కేటాయింపు టూల్ (GPDP Planning)", path: "/workspace/gpdp-planning" },
        { name: "ఎక్సెల్ A4 ప్రింట్ ఫార్మాటర్ (Excel A4 Print)", path: "/excel_print" },
        { name: "ఆన్‌లైన్ PDF కంప్రెసర్ (PDF Compress)", path: "/pdf_compress" },
        { name: "UBD, DSC, ProxKey & Edge IE Mode ట్రబుల్‌షూటింగ్ గైడ్", path: "/ubd-settings-dsk-issues" },
      ]
    },
    {
      title: "3. విధానాలు, పారదర్శకత & సహాయం (Policies & Transparency)",
      links: [
        { name: "మా గురించి (About Us)", path: "/about" },
        { name: "మమ్మల్ని సంప్రదించండి & Contact Form (Contact Us)", path: "/contact" },
        { name: "గోప్యతా విధానం (Privacy Policy)", path: "/privacy" },
        { name: "నిబంధనలు & షరతులు (Terms & Conditions)", path: "/terms" },
        { name: "బాధ్యతా రాహిత్య ప్రకటన (Disclaimer)", path: "/disclaimer" },
        { name: "కుకీ విధానం (Cookie Policy)", path: "/cookie-policy" },
        { name: "ఎడిటోరియల్ పాలసీ (Editorial Policy)", path: "/editorial-policy" },
        { name: "సైట్‌మ్యాప్ డైరెక్టరీ (Sitemap)", path: "/sitemap" },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <p className="text-slate-600 text-sm sm:text-base">
        <strong>ఈ-వేదిక (E-Vedhika)</strong> పోర్టల్‌లోని అన్ని పబ్లిక్ పేజీలు, ఆన్‌లైన్ వర్క్‌స్పేస్ టూల్స్, ప్రాక్టికల్ ట్యుటోరియల్స్ మరియు చట్టబద్ధమైన పాలసీ పేజీల పూర్తి జాబితా క్రింద ఇవ్వబడింది:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70">
            <h3 className="text-base font-black text-[#00609C] mb-4 pb-2 border-b border-slate-200">
              {section.title}
            </h3>
            <ul className="space-y-2.5">
              {section.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <button
                    onClick={() => handleNav(link.path)}
                    className="text-left text-xs sm:text-sm font-bold text-slate-700 hover:text-[#00609C] hover:underline flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SitemapPage() {
  return (
    <PageWrapper
      title="సైట్‌మ్యాప్ (Sitemap)"
      subtitle="E-Vedhika పోర్టల్‌లోని అన్ని పబ్లిక్ పేజీలు, టూల్స్ మరియు ట్యుటోరియల్ విభాగాల జాబితా"
      icon={Map}
    >
      <SitemapContent />
    </PageWrapper>
  );
}

export function UbdDskTroubleshootingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="h-[100dvh] overflow-y-auto bg-slate-50 text-slate-800 font-sans pb-16">
      <header className="bg-gradient-to-r from-[#00609C] via-[#0d3b66] to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} /> హోమ్ పేజీకి వెళ్ళండి (Back to Home)
          </button>
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Comprehensive Technical Guide & 11-Point Tutorials
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              UBD Portal Settings, DSC Digital Signature, ProxKey, HYP2003 & Edge IE Mode Complete Troubleshooting Guide
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-4xl font-medium">
              తెలంగాణ & ఆంధ్రప్రదేశ్ గ్రామ పంచాయతీ కార్యదర్శులు మరియు ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్ల కోసం UBD జనన మరణ నమోదు, డిజిటల్ సిగ్నేచర్ (DSC), Java 32-bit, మరియు Microsoft Edge IE Mode సమస్యల సంపూర్ణ పరిష్కార మార్గదర్శిని.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Embed the 11-Point Interactive Practical Tutorials Hub */}
        <PracticalTutorialsHub />

        {/* Quick Reference Card & Action Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">
                ఆల్-ఇన్-వన్ డ్రైవర్లు & ఆన్‌లైన్ UBD ట్రాకర్ (Software Hub & UBD Live Tracker)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                గ్రామ పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు పంచాయతీ కార్యదర్శుల కోసం ధృవీకరించబడిన DSC టోకెన్ డ్రైవర్లు, Java JRE 8 మరియు UBD ట్రాకర్ ఇక్కడ అందుబాటులో ఉన్నాయి.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <button
                onClick={() => navigate("/software_hub")}
                className="bg-[#00609C] hover:bg-[#0d3b66] text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
              >
                డ్రైవర్స్ డౌన్‌లోడ్ (Software Hub)
              </button>
              <button
                onClick={() => navigate("/ubd_tracker")}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                UBD Live Tracker ఓపెన్ చేయండి
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
