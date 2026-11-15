import React, { useState } from 'react';
import {
  Book,
  Search,
  FileText,
  Bookmark,
  ChevronRight,
  Scale,
  Info,
  CheckCircle2,
  ShieldAlert,
  Building2,
  Users,
  Coins,
  Gavel,
  Sparkles,
  Wrench,
  Cpu,
  Terminal,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Layers,
  GraduationCap,
  MonitorCheck,
  KeyRound,
  ClipboardCheck
} from 'lucide-react';

export interface PracticalTutorial {
  id: string;
  category: 'ubd_crs' | 'dsc_tokens' | 'browser_windows' | 'gp_governance';
  badge: string;
  titleTe: string;
  titleEn: string;
  intro: string;
  problemStatement: string;
  prerequisites: string[];
  stepByStep: { stepTitle: string; detail: string }[];
  uiCheckpoints: string[];
  expectedResult: string;
  commonErrors: { error: string; cause: string }[];
  troubleshootingFixes: string[];
  precautions: string[];
  officialSources: { name: string; url: string }[];
  lastVerified: string;
}

export const PRACTICAL_TUTORIALS_DATA: PracticalTutorial[] = [
  {
    id: 'telangana-ap-ubd-birth-death-workflow',
    category: 'ubd_crs',
    badge: 'TUTORIAL 01 • UBD & CRS',
    titleTe: 'తెలంగాణ UBD & ఏపీ CRS పోర్టల్‌లో జనన, మరణ నమోదు & సర్టిఫికెట్ జారీ విధానం',
    titleEn: 'Telangana UBD & AP CRS Birth/Death Registration, Verification & Certificate Issuance Guide',
    intro:
      'జనన మరియు మరణ నమోదు చట్టం 1969 (RBD Act, 1969) ప్రకారం గ్రామ పంచాయతీ పరిధిలో జరిగే ప్రతి జనన, మరణ సంఘటనను నిర్ణీత గడువులోగా ఆన్‌లైన్ పోర్టల్‌లో (తెలంగాణలో ubd.telangana.gov.in / ఆంధ్రప్రదేశ్‌లో crsorgi.gov.in) నమోదు చేసి డిజిటల్ సంతకంతో సర్టిఫికెట్ జారీ చేయాలి.',
    problemStatement:
      'ఆపరేటర్లు మరియు పంచాయతీ కార్యదర్శులు ఆన్‌లైన్‌లో జనన/మరణ ఎంట్రీ చేసేటప్పుడు Normal (21 రోజులలోపు) vs Delayed Registration (21-30 రోజులు, 30 రోజుల నుండి 1 సంవత్సరం, 1 సంవత్సరం పైబడినవి) నిబంధనలు, జతచేయాల్సిన పత్రాలు మరియు తెలుగు/ఇంగ్లీష్ ద్విభాషా స్పెల్లింగ్ నమోదులో తరచుగా సందేహాలు ఎదుర్కొంటున్నారు.',
    prerequisites: [
      'గ్రామ పంచాయతీ అధికారిక UBD / CRS ఆపరేటర్ మరియు రిజిస్ట్రార్ (Panchayat Secretary) లాగిన్ ఐడి & పాస్‌వర్డ్.',
      'ఆసుపత్రి డిశ్చార్జ్ సమ్మరీ / ఫారమ్-1 (జనన నివేదిక) లేదా ఫారమ్-2 (మరణ నివేదిక), తల్లిదండ్రుల/మృతుని ఆధార్ కార్డు కాపీ.',
      'ఆలస్య నమోదు (Delayed Entry > 1 Year) అయితే RDO / సబ్-కలెక్టర్ ఉత్తర్వులు (Proceedings), నాన్-అవైలబిలిటీ సర్టిఫికెట్ (NAC) మరియు నోటరీ అఫిడవిట్ (200 KB లోపు PDF).',
      'పంచాయతీ కార్యదర్శి యొక్క చెల్లుబాటు అయ్యే Class-3 DSC USB Token (ProxKey లేదా HYP2003/ePass2003).'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: దరఖాస్తు గడువు (Time Slab) గుర్తింపు',
        detail: 'సంఘటన జరిగిన తేదీ నుండి 21 రోజులలోపు అయితే సాధారణ నమోదు (Normal Registration - ఉచితం). 21 నుండి 30 రోజులలోపు అయితే గ్రామ పంచాయతీ రిజిస్ట్రార్ అనుమతితో ఆలస్య రుసుముతో నమోదు. 30 రోజుల నుండి 1 సంవత్సరం లోపు అయితే MPDO / సంబంధిత అధికారి అనుమతి పత్రం అవసరం. 1 సంవత్సరం దాటితే RDO / మెజిస్ట్రేట్ ఉత్తర్వులు తప్పనిసరి.'
      },
      {
        stepTitle: 'Step 2: UBD పోర్టల్ లాగిన్ & ఫారమ్ ఎంపిక',
        detail: 'Microsoft Edge (IE Mode) బ్రౌజర్‌లో ubd.telangana.gov.in ఓపెన్ చేసి GP RLB లాగిన్‌తో సైన్ ఇన్ అవ్వండి. మెనూలో Birth Registration -> Add Birth Registration (లేదా Death Registration -> Add Death Registration) ఎంచుకోండి.'
      },
      {
        stepTitle: 'Step 3: శిశువు / మృతుని మరియు తల్లిదండ్రుల వివరాల నమోదు',
        detail: 'సంఘటన తేదీ (Date of Birth/Death), లింగం (Gender), పుట్టిన/మరణించిన స్థలం (Institution/House), తండ్రి పేరు, తల్లి పేరు మరియు శాశ్వత చిరునామాను ఆధార్ కార్డులో ఉన్న విధంగా ఇంగ్లీష్ మరియు తెలుగు (Unicode) లో ఖచ్చితంగా టైప్ చేయండి.'
      },
      {
        stepTitle: 'Step 4: డాక్యుమెంట్ అప్‌లోడ్ & Draft Preview తనిఖీ',
        detail: 'ఆసుపత్రి ధృవీకరణ పత్రం లేదా RDO ప్రొసీడింగ్స్ PDF (200 KB లోపు) అప్‌లోడ్ చేసి, Submit చేసే ముందు Draft Preview ప్రింట్ తీసి దరఖాస్తుదారునితో అక్షర దోషాలు లేవని నిర్ధారించుకోండి.'
      },
      {
        stepTitle: 'Step 5: DSC USB Token ద్వారా డిజిటల్ సంతకం (Digital Signing)',
        detail: 'Approve / Sign విభాగంలోకి వెళ్లి, కార్యదర్శి DSC టోకెన్‌ను కంప్యూటర్‌కు కనెక్ట్ చేసి, Digital Signer పాప్-అప్‌లో సర్టిఫికెట్ ఎంచుకుని Token PIN ఎంటర్ చేయండి. సంతకం పూర్తయిన వెంటనే బార్‌కోడ్/QR కోడ్‌తో కూడిన తుది సర్టిఫికెట్ జనరేట్ అవుతుంది.'
      }
    ],
    uiCheckpoints: [
      'UBD లాగిన్ పేజీ పైన Microsoft Edge అడ్రస్ బార్‌లో "Internet Explorer (e)" ఐకాన్ కనిపిస్తుందో లేదో తనిఖీ చేయండి.',
      'తెలుగు పేరు టైప్ చేసినప్పుడు బాక్స్‌లో అక్షరాలు విరిగిపోకుండా స్పష్టమైన Unicode తెలుగు ఫాంట్‌లో కనిపించాలి.',
      'Approve క్లిక్ చేసినప్పుడు సిస్టమ్ ట్రేలో DSK / Digital Signer రన్ అవుతూ సర్టిఫికెట్ ఎంపిక విండో ఓపెన్ కావాలి.'
    ],
    expectedResult:
      'దరఖాస్తు విజయవంతంగా ఆమోదించబడి, ప్రభుత్వ క్యూఆర్ కోడ్ (QR Code) మరియు డిజిటల్ సంతకం కలిగిన అధికారిక జనన/మరణ ధృవీకరణ పత్రం PDF డౌన్‌లోడ్ అవుతుంది.',
    commonErrors: [
      {
        error: 'File Size Exceeds Maximum Limit / Invalid PDF Format',
        cause: 'అప్‌లోడ్ చేసే RDO ప్రొసీడింగ్స్ లేదా ఆధార్ PDF పరిమాణం 200 KB కంటే ఎక్కువగా ఉండటం లేదా ఫైల్ పేరులో ప్రత్యేక గుర్తులు (@, #, &, .) ఉండటం.'
      },
      {
        error: 'Session Expired / Blank Page After Submit',
        cause: 'ఫారమ్ నింపడానికి 15 నిమిషాల కంటే ఎక్కువ సమయం తీసుకోవడం లేదా Edge లో IE5 Document Mode ఆఫ్‌లో ఉండటం.'
      }
    ],
    troubleshootingFixes: [
      'PDF సైజు తగ్గించడానికి ఈ-వేదిక పోర్టల్‌లోని "PDF Compress" టూల్ ఉపయోగించి ఫైల్‌ను 180 KB లోపుకు మార్చండి మరియు ఫైల్ పేరును కేవలం ఇంగ్లీష్ అక్షరాలతో (ఉదా: RDO_Order_123.pdf) సేవ్ చేయండి.',
      'సబ్మిట్ చేసే ముందు ఒకసారి మరో ట్యాబ్‌లో పోర్టల్ సెషన్ యాక్టివ్‌గా ఉందో లేదో చూసుకుని Submit నొక్కండి.'
    ],
    precautions: [
      'ఒక్కసారి డిజిటల్ సంతకం (DSC Sign) చేసిన తర్వాత పేరు లేదా తేదీ మార్చాలంటే Correction ప్రక్రియ చాలా సంక్లిష్టంగా ఉంటుంది; కాబట్టి సంతకానికి ముందే రెండుసార్లు సరిచూసుకోండి.',
      'ఆఫ్‌లైన్ జనన మరణ రిజిస్టర్‌లో నమోదు చేసిన ఎంట్రీ నంబర్‌ను ఆన్‌లైన్ అప్లికేషన్ రిఫరెన్స్‌తో సరిపోల్చి భద్రపరచండి.'
    ],
    officialSources: [
      { name: 'Telangana UBD Official Portal', url: 'https://ubd.telangana.gov.in/' },
      { name: 'Central CRS Portal (AP & National)', url: 'https://dc.crsorgi.gov.in/' },
      { name: 'Telangana UBD MIS Status Portal', url: 'https://ubdmis.telangana.gov.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  },
  {
    id: 'dsc-digital-signer-java-port-troubleshooting',
    category: 'dsc_tokens',
    badge: 'TUTORIAL 02 • DSC & JAVA SIGNER',
    titleTe: 'DSC డిజిటల్ సంతకం సమస్యలు, DSK Signer & Java 32-Bit పూర్తి కాన్ఫిగరేషన్ గైడ్',
    titleEn: 'Complete DSC Digital Signature, DSK Signer Service & Java JRE 8 (32-Bit) Configuration Guide',
    intro:
      'ప్రభుత్వ పోర్టల్స్ (UBD, eGramSwaraj, IFMIS) లో సర్టిఫికెట్లు మరియు బిల్లులపై డిజిటల్ సంతకం చేయడానికి బ్రౌజర్‌కు మరియు USB టోకెన్‌కు మధ్య వారధిగా "Digital Signer / DSK Service" మరియు "Java JRE 8 (32-bit)" పనిచేస్తాయి.',
    problemStatement:
      'చాలా గ్రామ పంచాయతీ కంప్యూటర్లలో DSC టోకెన్ పెట్టినప్పటికీ "Error in Signing", "DSC Signer Service Not Running", "Port 8080/8443 Connection Refused" లేదా "Java Application Blocked by Security" అనే ఎర్రర్లు వస్తుంటాయి.',
    prerequisites: [
      'Windows 7 (SP1) / Windows 10 / Windows 11 ఆపరేటింగ్ సిస్టమ్ (Administrator ఖాతా).',
      'Java JRE 8 Update 202 లేదా 301 (తప్పనిసరిగా x86 / 32-bit వెర్షన్ — 64-bit Windows అయినా సరే 32-bit Java అవసరం).',
      'UBD Digital Signer (DSK Signer) ఇన్‌స్టాలర్ మరియు సంబంధిత USB Token డ్రైవర్.'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: పాత/కాన్‌ఫ్లిక్ట్ Java వెర్షన్ల తొలగింపు & 32-bit Java ఇన్‌స్టాలేషన్',
        detail: 'Control Panel -> Programs and Features ఓపెన్ చేసి పాత కరప్ట్ అయిన Java వెర్షన్లను తీసివేసి, ఈ-వేదిక Software Hub నుండి Java JRE 8 (32-bit / i586) డౌన్‌లోడ్ చేసి "Run as Administrator" గా ఇన్‌స్టాల్ చేయండి.'
      },
      {
        stepTitle: 'Step 2: Configure Java -> Exception Site List జత చేయడం',
        detail: 'Windows స్టార్ట్ మెనూలో "Configure Java" ఓపెన్ చేసి, "Security" ట్యాబ్‌కు వెళ్లండి. అక్కడ "Edit Site List" క్లిక్ చేసి https://ubd.telangana.gov.in, http://ubd.telangana.gov.in, https://ubdmis.telangana.gov.in మరియు http://127.0.0.1:8080 లింకులను Add చేసి OK నొక్కండి.'
      },
      {
        stepTitle: 'Step 3: DSK / Digital Signer సర్వీస్ ఇన్‌స్టాలేషన్ & పోర్ట్ తనిఖీ',
        detail: 'DSK Signer సెటప్‌ను ఇన్‌స్టాల్ చేసిన తర్వాత డెస్క్‌టాప్‌పై ఉన్న DSK Signer షార్ట్‌కట్‌పై Right-click ఇచ్చి "Run as Administrator" క్లిక్ చేయండి. టాస్క్‌బార్ ట్రేలో Signer ఐకాన్ రన్ అవుతుందో లేదో చూడండి.'
      },
      {
        stepTitle: 'Step 4: Localhost Loopback & SSL State క్లియర్ చేయడం',
        detail: 'బ్రౌజర్‌లో http://127.0.0.1:8080 లేదా https://127.0.0.1:8443 ఓపెన్ చేసి "Advanced -> Proceed to 127.0.0.1" క్లిక్ చేయండి. ఆపై Internet Options -> Content ట్యాబ్‌లో "Clear SSL State" బటన్ నొక్కండి.'
      }
    ],
    uiCheckpoints: [
      'Windows Taskbar కుడివైపు కింద (System Tray) లో Digital Signer / Java కప్పు ఐకాన్ యాక్టివ్‌గా కనిపించాలి.',
      'Configure Java -> Security ట్యాబ్‌లో Security Level "High" లో ఉండి, Exception Site List లో UBD URL లు కనిపించాలి.',
      'services.msc లో "Smart Card (SCardSvr)" సర్వీస్ Status "Running" మరియు Startup Type "Automatic" గా ఉండాలి.'
    ],
    expectedResult:
      'UBD పోర్టల్‌లో "Sign / Approve" బటన్ నొక్కగానే 2 సెకన్లలోపు డిజిటల్ సర్టిఫికెట్ పాప్-అప్ విండో ఓపెన్ అయి, PIN ఎంటర్ చేయగానే సంతకం పూర్తవుతుంది.',
    commonErrors: [
      {
        error: 'Failed to validate certificate / Application Blocked by Java Security',
        cause: 'Configure Java -> Advanced ట్యాబ్‌లో revocation చెక్ ఆన్‌లో ఉండటం లేదా Exception Site List లో సైట్ యాడ్ చేయకపోవడం.'
      },
      {
        error: 'Signer Server Not Connected (127.0.0.1 Refused to Connect)',
        cause: 'Antivirus ఫైర్‌వాల్ పోర్ట్ 8080 ను బ్లాక్ చేయడం లేదా DSK Signer అడ్మినిస్ట్రేటర్‌గా రన్ కాకపోవడం.'
      }
    ],
    troubleshootingFixes: [
      'Configure Java -> Advanced ట్యాబ్‌లోకి వెళ్లి "Perform signed code certificate revocation checks on" కింద "Do not check (not recommended)" ఎంచుకుని Apply నొక్కండి.',
      'మీరు E-Vedhika UBD Setting Manager (v1.0.9) ఉపయోగించి "17-Step Auto Configure" నొక్కితే పైన పేర్కొన్న అన్ని Java, Registry మరియు Firewall సెట్టింగ్స్ 30 సెకన్లలో ఆటోమేటిక్‌గా సెట్ అవుతాయి.'
    ],
    precautions: [
      'ఒకే కంప్యూటర్‌లో ఒకేసారి రెండు DSC USB టోకెన్లను పెట్టి సంతకం చేయడానికి ప్రయత్నించవద్దు; ప్రస్తుతం సంతకం చేసే కార్యదర్శి టోకెన్ మాత్రమే USB పోర్ట్‌లో ఉంచండి.',
      'Java ఆటో-అప్‌డేట్ (Auto Update) ఆప్షన్‌ను ఆఫ్‌లో ఉంచండి, లేదంటే కొత్త అప్‌డేట్ వల్ల పాత ఆప్లెట్ సపోర్ట్ నిలిచిపోవచ్చు.'
    ],
    officialSources: [
      { name: 'Telangana UBD Portal DSC Instructions', url: 'https://ubd.telangana.gov.in/' },
      { name: 'Controller of Certifying Authorities (CCA India)', url: 'https://cca.gov.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  },
  {
    id: 'watchdata-proxkey-token-installation-guide',
    category: 'dsc_tokens',
    badge: 'TUTORIAL 03 • PROXKEY TOKEN',
    titleTe: 'WatchData ProxKey USB Token ఇన్‌స్టాలేషన్ & సర్టిఫికెట్ కాన్ఫిగరేషన్ గైడ్',
    titleEn: 'WatchData ProxKey DSC Token Driver Installation, PIN Verification & Certificate Registration',
    intro:
      'గ్రామ పంచాయతీ కార్యదర్శులు అత్యధికంగా ఉపయోగించే WatchData ProxKey USB టోకెన్ కంప్యూటర్‌లో గుర్తించబడటానికి (Token Detection) సరైన Middleware డ్రైవర్ మరియు Smart Card సర్వీస్ తప్పనిసరి.',
    problemStatement:
      'ProxKey USB టోకెన్‌ను CPU కి కనెక్ట్ చేసినప్పుడు టోకెన్‌లో లైట్ వెలుగుతున్నప్పటికీ, "No Token Detected" అని రావడం లేదా WDProxKey టూల్‌లో సర్టిఫికెట్ కనిపించకపోవడం.',
    prerequisites: [
      'WatchData ProxKey USB Token (చెల్లుబాటు అయ్యే Class-3 DSC సర్టిఫికెట్‌తో).',
      'ProxKey Middleware Setup (Windows 7/10/11 Compatible వెర్షన్).',
      'టోకెన్ యొక్క User PIN (సాధారణంగా 8 లేదా అంతకంటే ఎక్కువ అక్షరాలు/అంకెలు).'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: USB టోకెన్ కనెక్ట్ చేసి My Computer / This PC లో డ్రైవ్ తనిఖీ',
        detail: 'మదర్‌బోర్డు వెనుక ఉన్న ప్రధాన USB పోర్ట్‌కు ProxKey టోకెన్‌ను కనెక్ట్ చేయండి. లేదా ఈ-వేదిక Software Hub నుండి తాజా WatchData ProxKey డ్రైవర్‌ను డౌన్‌లోడ్ చేసుకోండి.'
      },
      {
        stepTitle: 'Step 2: అడ్మినిస్ట్రేటర్‌గా డ్రైవర్ ఇన్‌స్టాలేషన్',
        detail: 'Setup.exe ఫైల్‌పై Right-click ఇచ్చి "Run as Administrator" ఎంచుకోండి. ఇన్‌స్టాలేషన్ పూర్తయ్యే వరకు టోకెన్‌ను బయటకు తీయవద్దు.'
      },
      {
        stepTitle: 'Step 3: WDProxKey మేనేజ్‌మెంట్ టూల్‌లో సర్టిఫికెట్ రిజిస్ట్రేషన్',
        detail: 'డెస్క్‌టాప్‌పై వచ్చిన "WDProxKey" ఐకాన్ ఓపెన్ చేయండి. "Certificate" ట్యాబ్‌లో కార్యదర్శి పేరు మరియు Expiry Date కనిపిస్తున్నాయో లేదో చూడండి. కనిపిస్తే సర్టిఫికెట్ సెలెక్ట్ చేసి "Register Certificate" క్లిక్ చేయండి.'
      },
      {
        stepTitle: 'Step 4: Internet Options లో Personal Certificate నిర్ధారణ',
        detail: 'Windows Run (Win + R) లో "inetcpl.cpl" టైప్ చేసి Content -> Certificates -> Personal ట్యాబ్‌లోకి వెళ్లండి. అక్కడ మీ DSC సర్టిఫికెట్ జాబితాలో కనిపిస్తుందో లేదో నిర్ధారించుకోండి.'
      }
    ],
    uiCheckpoints: [
      'WDProxKey టూల్ ఎడమవైపు కింద "Token Status: Connected" అని ఆకుపచ్చ రంగులో కనిపించాలి.',
      'Certificate ట్యాబ్‌లో Valid From మరియు Valid To తేదీలు ప్రస్తుత తేదీకి చెల్లుబాటు అయ్యేలా ఉండాలి.',
      'Diagnostic ట్యాబ్‌లో CSP మరియు PKCS#11 మాడ్యూల్స్ "OK" అని చూపించాలి.'
    ],
    expectedResult:
      'ProxKey టోకెన్‌లోని డిజిటల్ సర్టిఫికెట్ Windows Certificate Store లో నమోదు చేయబడి, UBD మరియు eGramSwaraj పోర్టల్స్‌లో సంతకానికి సిద్ధంగా ఉంటుంది.',
    commonErrors: [
      {
        error: 'Token Locked / Incorrect PIN Remaining Attempts: 0',
        cause: 'తప్పు User PIN ను వరుసగా 6 సార్లు కంటే ఎక్కువగా ఎంటర్ చేయడం వల్ల భద్రతా కారణాల రీత్యా టోకెన్ లాక్ అవ్వడం.'
      },
      {
        error: 'Smart Card Resource Manager is Not Running',
        cause: 'Windows లో SCardSvr సర్వీస్ డిసేబుల్ అయి ఉండటం.'
      }
    ],
    troubleshootingFixes: [
      'Smart Card సర్వీస్ ఆగిపోతే కమాండ్ ప్రాంప్ట్ (Admin) ఓపెన్ చేసి "sc config SCardSvr start= auto" మరియు "net start SCardSvr" కమాండ్లను రన్ చేయండి.',
      'టోకెన్ లాక్ అయితే మళ్లీ తప్పు పిన్ కొట్టకుండా మీ DSC ప్రొవైడర్ (eMudhra / Capricorn / Pantasign / VSign) నుండి Admin Unblock PIN (SO PIN) ద్వారా మాత్రమే అన్‌లాక్ చేయించుకోండి.'
    ],
    precautions: [
      'డిజిటల్ సంతకం జరుగుతున్న సమయంలో (Signing in progress) ఎట్టి పరిస్థితుల్లోనూ USB టోకెన్‌ను కంప్యూటర్ నుండి లాగవద్దు; దీనివల్ల టోకెన్ చిప్ పాడయ్యే ప్రమాదం ఉంది.',
      'DSC గడువు (Validity) ముగియడానికి కనీసం 15 రోజుల ముందే రెన్యువల్ చేసుకోండి.'
    ],
    officialSources: [
      { name: 'Controller of Certifying Authorities (CCA)', url: 'https://cca.gov.in/' },
      { name: 'eGramSwaraj DSC Registration Guide', url: 'https://egramswaraj.gov.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  },
  {
    id: 'hyp2003-epass2003-auto-token-configuration',
    category: 'dsc_tokens',
    badge: 'TUTORIAL 04 • HYP2003 / ePass2003',
    titleTe: 'HYP2003 / ePass2003 Auto USB Token కాన్ఫిగరేషన్ & డ్రైవర్ సెటప్ విధానం',
    titleEn: 'Feitian ePass2003Auto / Hypersecu HYP2003 Token Manager Setup & CSP Configuration',
    intro:
      'Feitian ePass2003Auto మరియు Hypersecu HYP2003 టోకెన్లు ప్రభుత్వ పోర్టల్స్‌లో విస్తృతంగా ఉపయోగించే హై-సెక్యూరిటీ FIPS 140-2 USB టోకెన్లు. వీటికి సరైన CSP (Cryptographic Service Provider) కాన్ఫిగరేషన్ అవసరం.',
    problemStatement:
      'ePass2003 / HYP2003 టోకెన్ పెట్టినప్పుడు Token Manager లో సర్టిఫికెట్ కనిపిస్తున్నప్పటికీ, బ్రౌజర్‌లో డిజిటల్ సంతకం చేసేటప్పుడు "Private Key Not Found" లేదా "Cannot Acquire Context" అనే ఎర్రర్ రావడం.',
    prerequisites: [
      'ePass2003Auto లేదా HYP2003 USB Token.',
      'ePass2003-Setup / HYP2003 Token Manager ఇన్‌స్టాలర్ (Software Hub లో అందుబాటులో ఉంది).',
      'Windows Administrator అనుమతులు.'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: పాత ePass డ్రైవర్ క్లీనప్ & కొత్త Setup ఇన్‌స్టాలేషన్',
        detail: 'ఇప్పటికే పాత వెర్షన్ ePass2003 ఇన్‌స్టాల్ అయి ఉంటే Uninstall చేసి సిస్టమ్ రీస్టార్ట్ చేయండి. ఆపై కొత్త ePass2003 / HYP2003 సెటప్‌ను "Run as Administrator" గా రన్ చేయండి.'
      },
      {
        stepTitle: 'Step 2: CSP రకం ఎంపిక (Microsoft Base Smart Card vs EnterSafe)',
        detail: 'ఇన్‌స్టాలేషన్ సమయంలో అడిగే ఆప్షన్లలో "Private CSP (EnterSafe / HyperPKI)" ఎంచుకుని Finish నొక్కండి. దీనివల్ల Java Signer మరియు IE Mode రెండూ టోకెన్‌ను సులభంగా గుర్తిస్తాయి.'
      },
      {
        stepTitle: 'Step 3: Token Manager లో Login & Certificate Register',
        detail: 'డెస్క్‌టాప్‌పై ఉన్న "ePass2003 Token Manager" ఓపెన్ చేసి "Login" బటన్ నొక్కి మీ User PIN ఎంటర్ చేయండి. ఆపై మీ పేరుపై ఉన్న సర్టిఫికెట్‌ను సెలెక్ట్ చేసి "Register" బటన్ నొక్కండి.'
      }
    ],
    uiCheckpoints: [
      'ePass2003 Token Manager లో ఎడమవైపు టోకెన్ సీరియల్ నంబర్ మరియు కుడివైపు సర్టిఫికెట్ వివరాలు కనిపించాలి.',
      '"Login" బటన్ క్లిక్ చేసి PIN వేసినప్పుడు ఎటువంటి ఎర్రర్ లేకుండా Key Pair మరియు Certificate వివరాలు అన్‌లాక్ అవ్వాలి.'
    ],
    expectedResult:
      'HYP2003 / ePass2003 టోకెన్ Windows CryptoAPI మరియు PKCS#11 రెండింటితో అనుసంధానమై UBD, eGramSwaraj మరియు IFMIS పోర్టల్స్‌లో నిరంతరాయంగా పనిచేస్తుంది.',
    commonErrors: [
      {
        error: 'Keyset does not exist / Private Key cannot be accessed',
        cause: 'Token Manager లో సర్టిఫికెట్ Register అవ్వకపోవడం లేదా Windows Certificate Store లో పాత గడువు ముగిసిన సర్టిఫికెట్లు ఉండిపోవడం.'
      }
    ],
    troubleshootingFixes: [
      'Internet Options -> Content -> Certificates -> Personal లోకి వెళ్లి గడువు ముగిసిన (Expired) పాత సర్టిఫికెట్లను Remove చేయండి. ఆపై Token Manager లో మళ్లీ "Register" క్లిక్ చేయండి.'
    ],
    precautions: [
      'ePass2003 Token Manager లోని "Initialize Token" బటన్‌ను ఎప్పుడూ నొక్కవద్దు! Initialize నొక్కితే టోకెన్‌లోని డిజిటల్ సర్టిఫికెట్ శాశ్వతంగా డిలీట్ అయిపోతుంది.'
    ],
    officialSources: [
      { name: 'CCA India Token Guidelines', url: 'https://cca.gov.in/' },
      { name: 'Telangana UBD Portal', url: 'https://ubd.telangana.gov.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  },
  {
    id: 'microsoft-edge-ie-mode-ie5-configuration',
    category: 'browser_windows',
    badge: 'TUTORIAL 05 • EDGE IE MODE',
    titleTe: 'Microsoft Edge లో IE Mode & IE5 Document Mode శాశ్వత కాన్ఫిగరేషన్ గైడ్',
    titleEn: 'Microsoft Edge Internet Explorer Mode (IE Mode) & IE5 Compatibility Setup for Government Portals',
    intro:
      'Windows 10 మరియు Windows 11 లో Internet Explorer 11 తొలగించబడినందున, లెగసీ ప్రభుత్వ పోర్టల్స్ (ముఖ్యంగా తెలంగాణ UBD పోర్టల్) పనిచేయాలంటే Microsoft Edge బ్రౌజర్‌లో "IE Mode" మరియు "IE5 Document Mode" ఎనేబుల్ చేయడం తప్పనిసరి.',
    problemStatement:
      'సాధారణ Chrome లేదా Edge లో UBD సైట్ ఓపెన్ చేస్తే మెనూ బటన్లు క్లిక్ కాకపోవడం, లాగిన్ అయిన వెంటనే బయటకు వచ్చేయడం, లేదా ప్రతి 30 రోజులకు ఒకసారి IE Mode గడువు ముగిసిపోవడం.',
    prerequisites: [
      'Microsoft Edge తాజా వెర్షన్ (Windows 10 లేదా Windows 11).',
      'ఇంటర్నెట్ కనెక్షన్ మరియు Windows Admin అనుమతులు.'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: Edge Default Browser Settings ఓపెన్ చేయడం',
        detail: 'Microsoft Edge ఓపెన్ చేసి అడ్రస్ బార్‌లో "edge://settings/defaultbrowser" అని టైప్ చేసి Enter నొక్కండి.'
      },
      {
        stepTitle: 'Step 2: Allow sites to be reloaded in Internet Explorer mode ఎనేబుల్ చేయడం',
        detail: '"Allow sites to be reloaded in Internet Explorer mode (IE mode)" డ్రాప్‌డౌన్‌లో "Allow" ఎంచుకుని, పక్కనే వచ్చే "Restart" బటన్ నొక్కండి.'
      },
      {
        stepTitle: 'Step 3: IE Mode Pages లో UBD లింకులు జత చేయడం',
        detail: 'Restart అయిన తర్వాత అదే పేజీలో క్రింద ఉన్న "Internet Explorer mode pages -> Add" క్లిక్ చేసి https://ubd.telangana.gov.in/ మరియు https://ubdmis.telangana.gov.in/ లింకులను జత చేయండి.'
      },
      {
        stepTitle: 'Step 4: Compatibility View & IE5 Document Mode సెట్ చేయడం',
        detail: 'UBD పేజీ ఓపెన్ అయిన తర్వాత అడ్రస్ బార్‌లోని "IE (e)" ఐకాన్‌పై క్లిక్ చేసి "Open this page in Compatibility View" ఆన్ చేయండి. ఒకవేళ అలైన్‌మెంట్ సరిగా లేకపోతే F12 (IEChooser) ద్వారా Document Mode ని IE5 కి సెట్ చేయండి.'
      }
    ],
    uiCheckpoints: [
      'అడ్రస్ బార్ ఎడమవైపు చిన్న Internet Explorer "e" లోగో కనిపించాలి.',
      'UBD లాగిన్ తర్వాత ఎడమవైపు నావిగేషన్ మెనూ (Birth Registration, Death Registration, Search, Reports) సరిగ్గా విస్తరించాలి.'
    ],
    expectedResult:
      'Windows 10/11 కంప్యూటర్లలో కూడా పాత Internet Explorer 11 లో పనిచేసినట్లే UBD పోర్టల్ మెనూలు, పాప్-అప్‌లు మరియు DSC సంతకం 100% సజావుగా పనిచేస్తాయి.',
    commonErrors: [
      {
        error: 'IE Mode Pages Expired After 30 Days',
        cause: 'Microsoft Edge డిఫాల్ట్‌గా మాన్యువల్ IE Mode లిస్ట్‌ను 30 రోజుల వరకే ఉంచుతుంది.'
      },
      {
        error: 'Certificate Print Pop-up Window Not Opening',
        cause: 'Internet Options లో Pop-up Blocker ఆన్‌లో ఉండటం.'
      }
    ],
    troubleshootingFixes: [
      '30 రోజుల గడువు సమస్య రాకుండా ఉండాలంటే Enterprise Site List XML పాలసీని ఉపయోగించాలి (ఈ-వేదిక UBD Setting Manager v1.0.9 దీన్ని ఆటోమేటిక్‌గా Windows Registry లో కాన్ఫిగర్ చేస్తుంది).',
      'Run (Win + R) -> inetcpl.cpl -> Privacy ట్యాబ్‌లో "Turn on Pop-up Blocker" టిక్ తీసివేసి Apply నొక్కండి.'
    ],
    precautions: [
      'IE Mode ని కేవలం UBD వంటి పాత ప్రభుత్వ పోర్టల్స్‌కు మాత్రమే పరిమితం చేయండి; ఆధునిక వెబ్‌సైట్లను (ఉదా: e-vedhika.in, Gmail) సాధారణ Edge లేదా Chrome లోనే వాడండి.'
    ],
    officialSources: [
      { name: 'Microsoft Learn - Configure IE Mode in Edge', url: 'https://learn.microsoft.com/en-us/deployedge/edge-ie-mode' },
      { name: 'Telangana UBD Official Portal', url: 'https://ubd.telangana.gov.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  },
  {
    id: 'windows-troubleshooting-ssl-tls-firewall-guide',
    category: 'browser_windows',
    badge: 'TUTORIAL 06 • WINDOWS FIXES',
    titleTe: 'Windows 7/10/11 ట్రబుల్‌షూటింగ్: TLS 1.2, Trusted Sites & Firewall సెట్టింగ్స్',
    titleEn: 'Windows System Troubleshooting: TLS 1.0/1.1/1.2, Trusted Sites, ActiveX & Port Unblocking',
    intro:
      'గ్రామ పంచాయతీ కంప్యూటర్లలో ప్రభుత్వ వెబ్‌సైట్లు "This page can’t be displayed" లేదా "Secure connection failed" అని చూపించినప్పుడు Windows Internet Options మరియు Security సెట్టింగ్స్ సరిచేయడం అవసరం.',
    problemStatement:
      'ఇంటర్నెట్ వేగంగా పనిచేస్తున్నప్పటికీ ప్రభుత్వ పోర్టల్స్ ఓపెన్ కాకపోవడం, ActiveX కంట్రోల్స్ బ్లాక్ అవ్వడం లేదా సిస్టమ్ టైమ్ తేడా వల్ల SSL Certificate Error రావడం.',
    prerequisites: [
      'Windows 7 / 8.1 / 10 / 11 కంప్యూటర్.',
      'Control Panel -> Internet Options యాక్సెస్.'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: సిస్టమ్ తేదీ & సమయం (IST +05:30) సరిచూడటం',
        detail: 'కంప్యూటర్ CMOS బ్యాటరీ వీక్ అయినప్పుడు తేదీ మారిపోతే ఏ HTTPS ప్రభుత్వ సైట్ ఓపెన్ కాదు. ముందుగా Date & Time సెట్టింగ్స్‌లో Time Zone "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" ఉందో లేదో చూసి "Sync now" క్లిక్ చేయండి.'
      },
      {
        stepTitle: 'Step 2: TLS 1.0, TLS 1.1, TLS 1.2 ఎనేబుల్ చేయడం',
        detail: 'Run (Win + R) లో "inetcpl.cpl" టైప్ చేసి "Advanced" ట్యాబ్‌కు వెళ్లండి. క్రిందికి స్క్రోల్ చేసి Use TLS 1.0, Use TLS 1.1, మరియు Use TLS 1.2 మూడింటికీ టిక్ పెట్టి Apply నొక్కండి.'
      },
      {
        stepTitle: 'Step 3: Trusted Sites & ActiveX Controls కాన్ఫిగరేషన్',
        detail: 'Internet Options -> Security -> Trusted Sites -> Sites క్లిక్ చేసి *.telangana.gov.in మరియు *.gov.in యాడ్ చేయండి. ఆపై "Custom Level" లోకి వెళ్లి ActiveX controls and plug-ins విభాగంలోని ఆప్షన్లను "Enable" చేయండి.'
      }
    ],
    uiCheckpoints: [
      'Internet Options -> Advanced లో TLS 1.0, 1.1, 1.2 చెక్‌బాక్స్‌లు టిక్ అయి ఉండాలి.',
      'Trusted Sites జాబితాలో ప్రభుత్వ డొమైన్లు చేర్చబడి ఉండాలి.'
    ],
    expectedResult:
      'SSL/TLS కనెక్షన్ లోపాలు తొలగిపోయి అన్ని ప్రభుత్వ పోర్టల్స్ మరియు DSC ఆప్లెట్లు ఎటువంటి అడ్డంకి లేకుండా లోడ్ అవుతాయి.',
    commonErrors: [
      {
        error: 'Your clock is ahead / behind (NET::ERR_CERT_DATE_INVALID)',
        cause: 'కంప్యూటర్ తేదీ లేదా సంవత్సరం తప్పుగా ఉండటం.'
      }
    ],
    troubleshootingFixes: [
      'ప్రతిసారి కంప్యూటర్ ఆన్ చేసినప్పుడు తేదీ మారిపోతుంటే CPU మదర్‌బోర్డులోని CR2032 CMOS బ్యాటరీని (రూ. 20-30 ఉంటుంది) మార్చండి.'
    ],
    precautions: [
      'Trusted Sites లో కేవలం అధికారిక ప్రభుత్వ వెబ్‌సైట్లను (*.gov.in, *.nic.in) మాత్రమే యాడ్ చేయండి; అపరిచిత వెబ్‌సైట్లను Trusted Sites లో చేర్చవద్దు.'
    ],
    officialSources: [
      { name: 'National Informatics Centre (NIC)', url: 'https://www.nic.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  },
  {
    id: 'gpdp-planning-panchayat-documentation-guide',
    category: 'gp_governance',
    badge: 'TUTORIAL 07 • GPDP & GP GOVERNANCE',
    titleTe: 'గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP), 15వ ఆర్థిక సంఘం నిధులు & డిజిటల్ రికార్డుల నిర్వహణ',
    titleEn: 'Gram Panchayat Development Plan (GPDP), 15th FC Tied/Untied Grants & Digital Documentation Guide',
    intro:
      'ప్రతి గ్రామ పంచాయతీ రాబోయే ఆర్థిక సంవత్సరానికి తమ గ్రామ అవసరాలను గుర్తించి, గ్రామ సభ ఆమోదంతో వార్షిక అభివృద్ధి ప్రణాళిక (GPDP) రూపొందించి eGramSwaraj పోర్టల్‌లో అప్‌లోడ్ చేయాలి.',
    problemStatement:
      '15వ ఆర్థిక సంఘం (15th Finance Commission) నిధులలో Tied (60%) మరియు Untied (40%) నిబంధనల ప్రకారం పనుల విభజన, LSDG 9 థీమ్‌ల ఎంపిక మరియు eGramSwaraj-PFMS పేమెంట్ వర్క్‌ఫ్లోలో స్పష్టత లేకపోవడం వల్ల ప్లాన్ ఆమోదంలో జాప్యం జరుగుతోంది.',
    prerequisites: [
      'గ్రామ సభ తీర్మానం కాపీ మరియు Panchayat Nirnay యాప్‌లో సమావేశ వివరాల నమోదు.',
      'గ్రామ పంచాయతీ జనాభా వివరాలు మరియు వార్షిక నిధుల కేటాయింపు అంచనా (Resource Envelope).',
      'eGramSwaraj Maker, Checker (Panchayat Secretary) మరియు Approver (Sarpanch / Special Officer) లాగిన్ వివరాలు & DSC.'
    ],
    stepByStep: [
      {
        stepTitle: 'Step 1: LSDG 9 థీమ్‌లలో ప్రాధాన్యత థీమ్ ఎంపిక & గ్రామ సభ',
        detail: 'పేదరికం లేని గ్రామం, ఆరోగ్యకరమైన గ్రామం, పరిశుభ్రమైన-పచ్చని గ్రామం, తగినంత నీరు ఉన్న గ్రామం వంటి 9 సుస్థిర అభివృద్ధి థీమ్‌లలో గ్రామ సభ ద్వారా వార్షిక సంకల్పాన్ని ఎంచుకోవాలి.'
      },
      {
        stepTitle: 'Step 2: 15వ ఆర్థిక సంఘం Tied (60%) vs Untied (40%) బడ్జెట్ విభజన',
        detail: 'మొత్తం 15వ ఆర్థిక సంఘం నిధులలో కనీసం 30% పారిశుద్ధ్యం & ODF స్థితి నిర్వహణకు, 30% తాగునీటి సరఫరా & వర్షపు నీటి సంరక్షణకు (మొత్తం 60% Tied) కేటాయించాలి. మిగిలిన 40% Untied నిధులను వీధి దీపాలు, అంతర్గత రోడ్లు, డ్రైనేజీ వంటి స్థానిక అవసరాలకు కేటాయించవచ్చు.'
      },
      {
        stepTitle: 'Step 3: ఈ-వేదిక GPDP Planning Tool తో ముందస్తు బడ్జెట్ లెక్కింపు',
        detail: 'ఈ-వేదిక వర్క్‌స్పేస్‌లోని GPDP Planning Tool ఓపెన్ చేసి మీ GP నిధులను ఎంటర్ చేస్తే Tied/Untied శాతాలు ఆటోమేటిక్‌గా లెక్కించబడతాయి. దాని ఆధారంగా పనుల జాబితా సిద్ధం చేసుకోండి.'
      },
      {
        stepTitle: 'Step 4: eGramSwaraj పోర్టల్‌లో Action Plan అప్‌లోడ్ & ఆమోదం',
        detail: 'egramswaraj.gov.in లో Planning -> Reporting -> Action Plan లో పనులను నమోదు చేసి, గ్రామ సభ ఆమోద పత్రాన్ని అప్‌లోడ్ చేసి Plan Approve చేయండి.'
      }
    ],
    uiCheckpoints: [
      'Tied Sanitation కేటాయింపు >= 30% మరియు Tied Drinking Water కేటాయింపు >= 30% ఉందో లేదో సరిచూసుకోవాలి.',
      'ప్రతి పనికి అంచనా వ్యయం (Estimated Cost) మరియు ఫండ్ సోర్స్ (15th FC / SFC / General Fund) సరిగ్గా మ్యాప్ చేయబడి ఉండాలి.'
    ],
    expectedResult:
      'గ్రామ పంచాయతీ వార్షిక ప్రణాళిక నిబంధనలకు అనుగుణంగా 100% ఖచ్చితత్వంతో eGramSwaraj లో ఆమోదించబడి, పనుల అమలు (Technical/Admin Sanction & PFMS e-Payment) కు సిద్ధమవుతుంది.',
    commonErrors: [
      {
        error: 'Allocated amount in Tied Grant is less than mandatory 30% limit',
        cause: 'పారిశుద్ధ్యం లేదా తాగునీటి విభాగానికి 30% కంటే తక్కువ బడ్జెట్ కేటాయించడం.'
      },
      {
        error: 'Vendor / DSC Mismatch in eGramSwaraj PFMS Payment',
        cause: 'Checker లేదా Approver DSC సర్టిఫికెట్ eGramSwaraj లో ఆమోదించబడకపోవడం లేదా PFMS తో సింక్ కాకపోవడం.'
      }
    ],
    troubleshootingFixes: [
      'eGramSwaraj లో నమోదు చేసే ముందే ఈ-వేదిక GPDP బడ్జెట్ క్యాలిక్యులేటర్‌లో పనుల విలువలను సరిచూసుకుంటే శాతాల తేడా రాదు.'
    ],
    precautions: [
      'అధికారిక నిబంధనలు vs స్వతంత్ర సాంకేతిక మార్గదర్శకత్వం: ఈ-వేదిక అందించే GPDP క్యాలిక్యులేటర్ ముందస్తు ప్రణాళికా సౌలభ్యం కోసం మాత్రమే. అధికారిక ఆమోదం మరియు ఆడిట్ కోసం కేంద్ర పంచాయతీరాజ్ మంత్రిత్వ శాఖ (egramswaraj.gov.in / auditonline.gov.in) ఉత్తర్వులను పాటించాలి.'
    ],
    officialSources: [
      { name: 'eGramSwaraj Official Portal', url: 'https://egramswaraj.gov.in/' },
      { name: 'Panchayat Nirnay Portal', url: 'https://meetingonline.gov.in/' },
      { name: 'AuditOnline Portal', url: 'https://auditonline.gov.in/' }
    ],
    lastVerified: '14 నవంబర్ 2026 (November 14, 2026)'
  }
];

interface ActSection {
  id: string;
  sectionNumber: string;
  titleTe: string;
  titleEn: string;
  category: 'governance' | 'duties' | 'finance' | 'services' | 'elections';
  summaryTe: string;
  detailsTe: string;
  keyPointsTe: string[];
  importantNoteTe?: string;
}

const PR_ACT_SECTIONS: ActSection[] = [
  {
    id: 'sec-4',
    sectionNumber: 'సెక్షన్ 4 & 5 (Section 4 & 5)',
    titleTe: 'గ్రామ పంచాయతీ ఏర్పాటు మరియు స్వరూపం',
    titleEn: 'Constitution and Incorporation of Gram Panchayats',
    category: 'governance',
    summaryTe: 'నూతన గ్రామ పంచాయతీల ఏర్పాటు, జనాభా ప్రాతిపదిక మరియు చట్టబద్ధమైన హోదా గురించిన వివరాలు.',
    detailsTe: 'తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 ప్రకారం కమిషనర్/ప్రభుత్వం నోటిఫికేషన్ ద్వారా ఏదైనా రెవెన్యూ గ్రామం లేదా గూడెం/తండాను గ్రామ పంచాయతీగా ప్రకటించవచ్చు. ప్రతి గ్రామ పంచాయతీ శాశ్వత ఉత్తరాధికారం (Perpetual Succession) మరియు అధికారిక ముద్ర (Common Seal) కలిగి ఉండే స్వయం ప్రతిపత్తి సంస్థ.',
    keyPointsTe: [
      'షెడ్యూల్డ్ ప్రాంతాల్లోని (PESA) తండాలు మరియు గూడేలకు ప్రత్యేక ప్రాధాన్యత.',
      'గ్రామ పంచాయతీ తన పేరుతో ఆస్తులను కలిగి ఉండవచ్చు మరియు ఒప్పందాలు కుదుర్చుకోవచ్చు.',
      'జనాభా ఆధారంగా వార్డుల విభజన (కనీసం 5 నుండి గరిష్టంగా 20 వార్డుల వరకు).'
    ]
  },
  {
    id: 'sec-6',
    sectionNumber: 'సెక్షన్ 6 (Section 6)',
    titleTe: 'గ్రామ సభ నిర్మాణం మరియు సమావేశాలు',
    titleEn: 'Gram Sabha Meetings, Quorum & Mandatory Schedule',
    category: 'governance',
    summaryTe: 'గ్రామ సభ సభ్యులు, కోరమ్ (Quorum), వార్షిక సమావేశాలు మరియు గ్రామ సభ అధికారాలు.',
    detailsTe: 'గ్రామ పంచాయతీ ఓటర్ల జాబితాలో పేరు నమోదైన ప్రతి వ్యక్తీ గ్రామ సభ సభ్యుడే. ప్రతి రెండు నెలలకు ఒకసారి (సంవత్సరానికి కనీసం 6 సార్లు) గ్రామ సభను తప్పనిసరిగా నిర్వహించాలి. గ్రామ సభకు సర్పంచ్ అధ్యక్షత వహిస్తారు.',
    keyPointsTe: [
      'గ్రామ సభ నిర్వహణకు ఓటర్ల సంఖ్యను బట్టి కనీస కోరమ్ (Quorum - 50 నుండి 500 మంది వరకు) తప్పనిసరి.',
      'గ్రామ సభలో వార్షిక బడ్జెట్, ఆడిట్ రిపోర్ట్, పన్నుల వసూళ్లు, మరియు లబ్ధిదారుల ఎంపికపై చర్చించాలి.',
      'సరైన కారణం లేకుండా సంవత్సరంలో కనీస గ్రామ సభలు నిర్వహించకపోతే సర్పంచ్ మరియు పంచాయతీ కార్యదర్శి బాధ్యులవుతారు.'
    ],
    importantNoteTe: 'కోరమ్ లేక వాయిదా పడిన సమావేశానికి మరుసటి సారి కోరమ్ నిబంధన వర్తించదు, కానీ హాజరు రిజిస్టర్ మరియు ఫోటో డాక్యుమెంటేషన్ తప్పనిసరి.'
  },
  {
    id: 'sec-15',
    sectionNumber: 'సెక్షన్ 15, 17 & 19 (Section 15-19)',
    titleTe: 'సభ్యుల అర్హతలు మరియు అనర్హతలు (ఇద్దరు పిల్లల నిబంధనతో సహా)',
    titleEn: 'Qualifications and Disqualifications of Candidates & Members',
    category: 'elections',
    summaryTe: 'సర్పంచ్ మరియు వార్డు సభ్యులుగా పోటీ చేయడానికి కావలసిన అర్హతలు మరియు అనర్హత వేటు పడే సందర్భాలు.',
    detailsTe: 'గ్రామ పంచాయతీ ఓటరుగా ఉండి 21 సంవత్సరాలు నిండిన వారు పోటీ చేయడానికి అర్హులు. అయితే ప్రభుత్వ ఉద్యోగులు, నేరచరిత్ర ఉన్నవారు, గ్రామ పంచాయతీకి పన్ను బకాయిలు ఉన్నవారు అనర్హులు.',
    keyPointsTe: [
      'ఇంటి పన్ను లేదా ఇతర పంచాయతీ బకాయిలు ఉంటే నామినేషన్ వేసే నాటికి పూర్తిగా చెల్లించి No Dues సర్టిఫికెట్ పొందాలి.',
      'వరుసగా మూడు (3) గ్రామ పంచాయతీ సమావేశాలకు అనుమతి లేకుండా గైర్హాజరైతే సభ్యత్వం రద్దవుతుంది.',
      'ప్రభుత్వ కాంట్రాక్టులలో ప్రత్యక్ష వాటా ఉన్నవారు సభ్యులుగా కొనసాగడానికి అనర్హులు.'
    ]
  },
  {
    id: 'sec-32',
    sectionNumber: 'సెక్షన్ 32 & 37 (Section 32 & 37)',
    titleTe: 'సర్పంచ్ మరియు ఉప-సర్పంచ్ అధికారాలు, విధులు & జాయింట్ చెక్ పవర్',
    titleEn: 'Powers and Functions of Sarpanch & Upa-Sarpanch',
    category: 'duties',
    summaryTe: 'సర్పంచ్ బాధ్యతలు, పారిశుద్ధ్యం, మొక్కల పెంపకం (హరితహారం) మరియు సర్పంచ్ సస్పెన్షన్/తొలగింపు నిబంధనలు.',
    detailsTe: 'సర్పంచ్ గ్రామ పంచాయతీకి రాజకీయ అధిపతి. గ్రామ పంచాయతీ సమావేశాలు నిర్వహించడం, రికార్డులను తనిఖీ చేయడం, మరియు పంచాయతీ కార్యదర్శితో కలిసి అభివృద్ధి పనులను పర్యవేక్షించడం సర్పంచ్ ప్రధాన విధి.',
    keyPointsTe: [
      'గ్రామంలో 100% పారిశుద్ధ్యం, వీధి దీపాల నిర్వహణ మరియు తాగునీటి సరఫరా జరిగేలా చూడాలి.',
      'ప్రతి సంవత్సరం నాటిన మొక్కలలో కనీసం 85% మొక్కలను బ్రతికించడం సర్పంచ్ మరియు కార్యదర్శి ఉమ్మడి బాధ్యత.',
      'సెక్షన్ 37 ప్రకారం నిధుల దుర్వినియోగం లేదా విధి నిర్వహణలో నిర్లక్ష్యం వహిస్తే జిల్లా కలెక్టర్ సర్పంచ్‌ను సస్పెండ్ చేయవచ్చు లేదా పదవి నుండి తొలగించవచ్చు.'
    ],
    importantNoteTe: 'గ్రామ పంచాయతీ నిధుల చెల్లింపులు సర్పంచ్ మరియు ఉప-సర్పంచ్ (లేదా ప్రభుత్వ ఉత్తర్వుల ప్రకారం నిర్దేశిత అధీకృత అధికారి) డిజిటల్ సంతకం (DSC / PFMS) ద్వారా జరుగుతాయి.'
  },
  {
    id: 'sec-42',
    sectionNumber: 'సెక్షన్ 42 & 43 (Section 42 & 43)',
    titleTe: 'పంచాయతీ కార్యదర్శి (Panchayat Secretary) విధులు మరియు బాధ్యతలు',
    titleEn: 'Duties and Responsibilities of Panchayat Secretary',
    category: 'duties',
    summaryTe: 'పంచాయతీ కార్యదర్శి యొక్క పరిపాలనా, ఆర్థిక మరియు క్షేత్రస్థాయి విధుల పూర్తి జాబితా.',
    detailsTe: 'ప్రతి గ్రామ పంచాయతీకి (లేదా క్లస్టర్‌కు) ప్రభుత్వం ఒక పంచాయతీ కార్యదర్శిని నియమిస్తుంది. గ్రామ పంచాయతీ ఆస్తుల పరిరక్షణ, రికార్డుల నిర్వహణ, పన్నుల వసూలు, తీర్మానాల అమలు మరియు ప్రభుత్వ పథకాల పర్యవేక్షణ కార్యదర్శి ప్రధాన బాధ్యత.',
    keyPointsTe: [
      'ప్రతిరోజూ ఉదయం గ్రామంలో పారిశుద్ధ్య పనులను తనిఖీ చేసి DSR (Daily Sanitation Report) మరియు హాజరు నమోదు చేయాలి.',
      'జనన మరియు మరణాల రిజిస్ట్రార్‌గా (Registrar of Births & Deaths) వ్యవహరిస్తూ UBD పోర్టల్‌లో సర్టిఫికెట్లు జారీ చేయాలి.',
      'ఇంటి పన్ను, కుళాయి పన్ను, లైసెన్స్ ఫీజులను 100% వసూలు చేసి పంచాయతీ ఖాతాలో జమ చేయాలి.',
      'అనుమతి లేని అక్రమ నిర్మాణాలు (Illegal Layouts & Buildings) జరిగితే వెంటనే నోటీసులు జారీ చేసి చర్యలు తీసుకోవాలి.',
      'గ్రామ సభ మరియు గ్రామ పంచాయతీ సమావేశాల మినిట్స్ పుస్తకం (Minutes Book) మరియు క్యాష్ బుక్ నిర్వహించాలి.'
    ],
    importantNoteTe: 'విధి నిర్వహణలో నిర్లక్ష్యం లేదా ఆర్థిక అవకతవకలు జరిగితే సెక్షన్ 43 ప్రకారం క్రమశిక్షణా చర్యలు మరియు నష్టపరిహారం రికవరీ వర్తిస్తాయి.'
  },
  {
    id: 'sec-52',
    sectionNumber: 'సెక్షన్ 52 (Section 52)',
    titleTe: 'గ్రామ పంచాయతీ తప్పనిసరి విధులు (Mandatory Duties of GP)',
    titleEn: 'Mandatory Functions of Gram Panchayat (Sanitation, Water, Street Lights)',
    category: 'services',
    summaryTe: 'ప్రతి గ్రామ పంచాయతీ ప్రజలకు తప్పనిసరిగా అందించాల్సిన కనీస మౌలిక సదుపాయాలు.',
    detailsTe: 'గ్రామ పంచాయతీ నిధులను ప్రాధాన్యతా క్రమంలో ముందుగా ప్రజల ప్రాథమిక అవసరాలైన పారిశుద్ధ్యం, త్రాగునీరు మరియు వీధి దీపాల కోసం వినియోగించాలి.',
    keyPointsTe: [
      'రోజువారీ చెత్త సేకరణ, డ్రైనేజీ కాలువల శుభ్రత మరియు వైకుంఠధామాల (Crematoriums) నిర్వహణ.',
      'ప్రతి ఇంటికి సురక్షితమైన తాగునీటి సరఫరా (Mission Bhagiratha అంతర్గత పైప్‌లైన్ల పర్యవేక్షణ).',
      'వీధి దీపాల (LED Street Lights) నిర్వహణ మరియు పగలంతా వెలగకుండా నియంత్రణ.',
      'గ్రామ నర్సరీల నిర్వహణ మరియు హరితహారం మొక్కల సంరక్షణ.'
    ]
  },
  {
    id: 'sec-61',
    sectionNumber: 'సెక్షన్ 61 నుండి 70 (Section 61-70)',
    titleTe: 'పన్నుల విధింపు, ఇంటి పన్ను (House Tax) మరియు ఆర్థిక వనరులు',
    titleEn: 'Taxation, House Tax Assessment, Tap Fee & Gram Panchayat Funds',
    category: 'finance',
    summaryTe: 'ఇంటి పన్ను, కుళాయి ఫీజు, ప్రకటనల పన్ను, సంతల వేలం మరియు గ్రామ పంచాయతీ సొంత ఆదాయ వనరులు.',
    detailsTe: 'గ్రామ పంచాయతీ తన పరిధిలోని అన్ని భవనాలపై ఇంటి పన్ను (House Tax) విధించే చట్టబద్ధమైన అధికారం కలిగి ఉంది. మూలధన విలువ (Capital Value) లేదా వార్షిక అద్దె విలువ ఆధారంగా పన్ను నిర్ధారణ జరుగుతుంది.',
    keyPointsTe: [
      'ప్రతి 5 సంవత్సరాలకు ఒకసారి ఇంటి పన్ను సవరణ (General Revision of House Tax) చేపట్టాలి.',
      'ప్రభుత్వ భవనాలు, ప్రార్థనా మందిరాలు, ధర్మశాలలు మరియు విద్యా సంస్థలకు నిబంధనల మేరకు పన్ను మినహాయింపు ఉంటుంది.',
      'ఆస్తి బదిలీ (Mutation / పేరు మార్పిడి) దరఖాస్తులను నిర్దిష్ట గడువులోగా పరిష్కరించి అసెస్‌మెంట్ రిజిస్టర్‌లో నమోదు చేయాలి.',
      'వసూలు చేసిన పన్ను మొత్తాన్ని వెంటనే గ్రామ పంచాయతీ ట్రెజరీ/బ్యాంక్ ఖాతాలో జమ చేయాలి.'
    ]
  },
  {
    id: 'sec-113',
    sectionNumber: 'సెక్షన్ 113 & 114 (Section 113 & 114)',
    titleTe: 'లేఅవుట్ల ఆమోదం మరియు భవన నిర్మాణ అనుమతులు (Building Permissions)',
    titleEn: 'Approval of Layouts and Building Construction Permissions',
    category: 'services',
    summaryTe: 'గ్రామ పంచాయతీ పరిధిలో కొత్త ఇళ్ల నిర్మాణం మరియు లేఅవుట్లకు అనుమతులు ఇచ్చే నిబంధనలు.',
    detailsTe: 'గ్రామ పంచాయతీ పరిధిలో ఎవరైనా భవనం నిర్మించాలన్నా లేదా వ్యవసాయేతర భూమిని ప్లాట్లుగా (Layout) మార్చాలన్నా గ్రామ పంచాయతీ మరియు టౌన్ ప్లానింగ్ (DTCP/HMDA) అనుమతి తప్పనిసరి.',
    keyPointsTe: [
      'జీ+2 (Ground + 2 Floors) మరియు నిర్దిష్ట విస్తీర్ణం లోపు నివాస భవనాలకు గ్రామ పంచాయతీ స్థాయిలో ఆన్‌లైన్ అనుమతి.',
      'లేఅవుట్ వేసేటప్పుడు కనీసం 10% భూమిని గ్రామ పంచాయతీకి పార్కులు/ప్రజా అవసరాల కోసం రిజిస్ట్రేషన్ (Gift Deed) చేయాలి.',
      'అనుమతి లేని లేఅవుట్లలోని ప్లాట్లకు భవన నిర్మాణ అనుమతి ఇవ్వకూడదు మరియు అక్రమ నిర్మాణాలను కూల్చివేసే అధికారం పంచాయతీకి ఉంది.'
    ],
    importantNoteTe: 'తప్పుడు సమాచారంతో అనుమతి పొందినా లేదా సెట్‌బ్యాక్ నిబంధనలు ఉల్లంఘించినా సెక్షన్ 114 ప్రకారం నోటీసు ఇచ్చి అనుమతి రద్దు చేయవచ్చు.'
  }
];

export function PracticalTutorialsHub() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTutorialId, setActiveTutorialId] = useState<string>(PRACTICAL_TUTORIALS_DATA[0].id);

  const categories = [
    { id: 'all', label: 'అన్ని ట్యుటోరియల్స్ (All Guides)' },
    { id: 'ubd_crs', label: 'UBD & CRS జనన/మరణ నమోదు' },
    { id: 'dsc_tokens', label: 'DSC, ProxKey & HYP2003 టోకెన్లు' },
    { id: 'browser_windows', label: 'Edge IE Mode & Windows Fixes' },
    { id: 'gp_governance', label: 'GPDP ప్రణాళిక & పంచాయతీ రికార్డులు' },
  ];

  const filteredTutorials = PRACTICAL_TUTORIALS_DATA.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  const activeTutorial =
    PRACTICAL_TUTORIALS_DATA.find((t) => t.id === activeTutorialId) || filteredTutorials[0];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-[#0d3b66] via-[#005086] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-blue-800/40">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <GraduationCap size={14} /> 11-Point Verified Field Tutorials
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold">
            తెలంగాణ & ఆంధ్రప్రదేశ్ గ్రామ పంచాయతీ టెక్నికల్ హబ్
          </span>
        </div>
        <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-2">
          ప్రాక్టికల్ టెక్నికల్ ట్యుటోరియల్స్ & నాలెడ్జ్ హబ్ (Practical Tutorials)
        </h2>
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-4xl">
          గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు టెక్నికల్ సిబ్బంది క్షేత్రస్థాయిలో ఎదుర్కొనే UBD, DSC టోకెన్ (ProxKey / HYP2003), Microsoft Edge IE Mode, Windows సెక్యూరిటీ మరియు GPDP బడ్జెట్ ప్రణాళిక సమస్యలకు 11-అంశాల సమగ్ర దశలవారీ పరిష్కార మార్గదర్శిని.
        </p>
      </div>

      {/* Official Rules vs Independent Guidance Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div className="text-xs text-amber-950 leading-relaxed space-y-1">
          <p className="font-black text-amber-900 uppercase tracking-wide">
            అధికారిక నిబంధనలు vs స్వతంత్ర సాంకేతిక మార్గదర్శకత్వం (Official Rules vs Independent Guidance)
          </p>
          <p className="font-medium">
            ఇక్కడ అందించిన కంప్యూటర్ సెట్టింగ్స్, DSC డ్రైవర్ కాన్ఫిగరేషన్ మరియు వర్క్‌ఫ్లో ట్యుటోరియల్స్ క్షేత్రస్థాయి ఆపరేటర్ల సాంకేతిక సహాయం కోసం <strong>ఈ-వేదిక (E-Vedhika)</strong> రూపొందించిన స్వతంత్ర ప్రాక్టికల్ గైడ్‌లు. ప్రభుత్వ విధానపరమైన నిర్ణయాలు, చట్టపరమైన నిబంధనలు మరియు అధికారిక ఆదేశాల కోసం సంబంధిత ప్రభుత్వ పోర్టల్స్ (ubd.telangana.gov.in, crsorgi.gov.in, egramswaraj.gov.in) మరియు అధికారిక సర్క్యులర్లను మాత్రమే ప్రామాణికంగా తీసుకోవాలి.
          </p>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setSelectedCategory(cat.id);
              const firstMatch = PRACTICAL_TUTORIALS_DATA.find(
                (t) => cat.id === 'all' || t.category === cat.id
              );
              if (firstMatch) setActiveTutorialId(firstMatch.id);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-[#0d3b66] text-white border-[#0d3b66] shadow-md'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Split Layout: Tutorial Selector List + 11-Section Detailed View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2.5">
          {filteredTutorials.map((tut) => {
            const isSelected = activeTutorial?.id === tut.id;
            return (
              <button
                key={tut.id}
                type="button"
                onClick={() => setActiveTutorialId(tut.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/15'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                    {tut.badge}
                  </span>
                  <ChevronRight
                    size={15}
                    className={isSelected ? 'text-blue-600 translate-x-0.5 transition-transform' : 'text-slate-400'}
                  />
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug mb-1">
                  {tut.titleTe}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold line-clamp-2">
                  {tut.titleEn}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right 11-Point Structured Article */}
        {activeTutorial && (
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            {/* Article Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-50 to-blue-50/50 border-b border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-lg bg-[#0d3b66] text-white text-xs font-black uppercase tracking-wider">
                  {activeTutorial.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  <Calendar size={13} /> 11. చివరిగా ధృవీకరించిన తేదీ: {activeTutorial.lastVerified}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug mb-1.5">
                {activeTutorial.titleTe}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                {activeTutorial.titleEn}
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* 1. పరిచయం & 2. సమస్య వివరణ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
                  <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Info size={15} className="text-blue-600" /> 1. పరిచయం (Introduction)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeTutorial.intro}
                  </p>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
                  <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-rose-600" /> 2. సమస్య వివరణ (Problem Statement)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {activeTutorial.problemStatement}
                  </p>
                </div>
              </div>

              {/* 3. ముందస్తు అవసరాలు */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ClipboardCheck size={16} className="text-indigo-600" /> 3. ముందస్తు అవసరాలు (Prerequisites & System Requirements)
                </h4>
                <ul className="space-y-2">
                  {activeTutorial.prerequisites.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                      <CheckCircle2 size={15} className="text-indigo-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. దశలవారీ పరిష్కారం */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Wrench size={16} className="text-blue-600" /> 4. దశలవారీ పరిష్కారం (Step-by-Step Solution)
                </h4>
                <div className="space-y-3">
                  {activeTutorial.stepByStep.map((s, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-xl bg-[#0d3b66] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs sm:text-sm font-black text-slate-900">{s.stepTitle}</h5>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. స్క్రీన్షాట్ / UI తనిఖీ సూచనలు & 6. ఆశించిన ఫలితం */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                  <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <MonitorCheck size={15} className="text-indigo-600" /> 5. స్క్రీన్ / UI తనిఖీ సూచనలు (UI Verification Checkpoints)
                  </h4>
                  <ul className="space-y-2">
                    {activeTutorial.uiCheckpoints.map((cp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                        <span>{cp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" /> 6. ఆశించిన ఫలితం (Expected Result)
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                    {activeTutorial.expectedResult}
                  </p>
                </div>
              </div>

              {/* 7. సాధారణ సమస్యలు & 8. పరిష్కార మార్గాలు */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-rose-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <AlertTriangle size={15} className="text-rose-600" /> 7. సాధారణ సమస్యలు & కారణాలు (Common Errors)
                  </h4>
                  <div className="space-y-2">
                    {activeTutorial.commonErrors.map((ce, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-rose-100">
                        <p className="text-xs font-black text-rose-700 font-mono mb-1">❌ {ce.error}</p>
                        <p className="text-xs text-slate-700 font-medium"><strong>కారణం:</strong> {ce.cause}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                    <Terminal size={15} className="text-emerald-600" /> 8. పరిష్కార మార్గాలు (Troubleshooting Fixes)
                  </h4>
                  <ul className="space-y-2">
                    {activeTutorial.troubleshootingFixes.map((fix, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 font-medium">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 9. ముఖ్యమైన జాగ్రత్తలు & 10. అధికారిక సమాచార వనరులు */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200">
                  <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert size={15} className="text-amber-600" /> 9. ముఖ్యమైన జాగ్రత్తలు (Important Precautions)
                  </h4>
                  <ul className="space-y-2">
                    {activeTutorial.precautions.map((pre, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-950 font-medium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                        <span>{pre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ExternalLink size={15} className="text-blue-600" /> 10. అధికారిక సమాచార వనరులు (Official Reference Sources)
                  </h4>
                  <ul className="space-y-2">
                    {activeTutorial.officialSources.map((src, idx) => (
                      <li key={idx}>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
                        >
                          <ExternalLink size={12} /> {src.name} ({src.url})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function KnowledgeHubSection() {
  const [activeView, setActiveView] = useState<'pr_act' | 'tutorials' | 'gp_records'>('pr_act');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<ActSection | null>(PR_ACT_SECTIONS[4]); // Default to Section 42 (Panchayat Secretary Duties)

  const categories = [
    { id: 'all', label: 'అన్ని విభాగాలు (All)', icon: Book },
    { id: 'governance', label: 'గ్రామ పంచాయతీ పాలన', icon: Building2 },
    { id: 'duties', label: 'విధులు & అధికారాలు', icon: Users },
    { id: 'finance', label: 'పన్నులు & ఆర్థికం', icon: Coins },
    { id: 'services', label: 'పౌర సేవలు & అనుమతులు', icon: Scale },
    { id: 'elections', label: 'ఎన్నికలు & అనర్హతలు', icon: Gavel },
  ];

  const filteredSections = PR_ACT_SECTIONS.filter((sec) => {
    const matchesCategory = selectedCategory === 'all' || sec.category === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      sec.titleTe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.sectionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.summaryTe.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.detailsTe.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveView('pr_act')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeView === 'pr_act'
              ? 'bg-[#0d3b66] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Scale size={15} />
          <span>1. తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 (TS PR Act Guide)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('tutorials')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeView === 'tutorials'
              ? 'bg-[#0d3b66] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <GraduationCap size={15} />
          <span>2. 11-అంశాల ప్రాక్టికల్ టెక్నికల్ ట్యుటోరియల్స్ (UBD, DSC, IE Mode)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView('gp_records')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeView === 'gp_records'
              ? 'bg-[#0d3b66] text-white shadow-sm'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText size={15} />
          <span>3. గ్రామ పంచాయతీ రిజిస్టర్లు & డిజిటల్ డాక్యుమెంటేషన్</span>
        </button>
      </div>

      {activeView === 'tutorials' && <PracticalTutorialsHub />}

      {activeView === 'gp_records' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider">
              Gram Panchayat Digital Documentation & Registers
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              గ్రామ పంచాయతీ ముఖ్యమైన రిజిస్టర్లు, ఆడిట్ & డిజిటల్ నిర్వహణ మార్గదర్శిని
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
              పంచాయతీ కార్యదర్శులు మరియు ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు గ్రామ పంచాయతీ కార్యాలయంలో భౌతికంగా (Offline Registers) మరియు ఆన్‌లైన్ పోర్టల్స్‌లో (e-Panchayat, eGramSwaraj, UBD, AuditOnline) సమన్వయంతో నిర్వహించాల్సిన కీలక రికార్డుల వివరాలు.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '1. పరిపాలనా & సమావేశ రిజిస్టర్లు (Administrative Registers)',
                items: [
                  'గ్రామ సభ మినిట్స్ పుస్తకం (Gram Sabha Minutes Register) & హాజరు రిజిస్టర్ — ప్రతి 2 నెలలకు ఒకసారి జరిగే గ్రామ సభ తీర్మానాలు మరియు Panchayat Nirnay పోర్టల్ అప్‌లోడ్.',
                  'గ్రామ పంచాయతీ పాలకవర్గ సమావేశ మినిట్స్ పుస్తకం (GP Meeting Minutes Book) — నెలవారీ సమావేశ తీర్మానాల నమోదు.',
                  'ఉద్యోగుల హాజరు & మల్టీ-పర్పస్ వర్కర్స్ (MPW) వేతన రిజిస్టర్.'
                ]
              },
              {
                title: '2. పన్నులు & రెవెన్యూ రిజిస్టర్లు (Taxation & Revenue Records)',
                items: [
                  'ఇంటి పన్ను అసెస్‌మెంట్ & డిమాండ్ రిజిస్టర్ (House Tax Assessment & DCB Register) — ఆన్‌లైన్ e-Panchayat House Tax DCB Live తో 100% సరిపోలిక.',
                  'ఆస్తి బదిలీ (Mutation) దరఖాస్తుల రిజిస్టర్ మరియు వాల్యుయేషన్ సర్టిఫికెట్ల రికార్డు.',
                  'ట్రేడ్ లైసెన్స్, సంతలు మరియు వేలం పాటల ఆదాయ రిజిస్టర్.'
                ]
              },
              {
                title: '3. ఆర్థిక, బడ్జెట్ & ఆడిట్ రికార్డులు (Financial & Audit Records)',
                items: [
                  'క్యాష్ బుక్ (Cash Book) & నిధుల వారీ లెడ్జర్లు (15th FC Tied/Untied, SFC, General Fund).',
                  'eGramSwaraj Day Book Closing, Monthly Reconciliation మరియు PFMS e-Payment ఓచర్ల ఫైల్.',
                  'AuditOnline (auditonline.gov.in) వార్షిక ఆడిట్ నివేదికలు మరియు ఓచర్ల భద్రత.'
                ]
              },
              {
                title: '4. పౌర సేవలు & సాంకేతిక రిజిస్టర్లు (Civic & Technical Registers)',
                items: [
                  'జనన మరియు మరణ నమోదు రిజిస్టర్లు (Form-1, Form-2, Form-3) — UBD ఆన్‌లైన్ సర్టిఫికెట్లతో నెలవారీ సరిపోలిక.',
                  'భవన నిర్మాణ అనుమతులు & లేఅవుట్ రిజిస్టర్ (Building Permission & Layout Register).',
                  'వీధి దీపాలు (LED Street Lights), పారిశుద్ధ్య ట్రాక్టర్ లాగ్ బుక్ మరియు తాగునీటి సరఫరా రిజిస్టర్.'
                ]
              }
            ].map((box, idx) => (
              <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-sm font-black text-[#0d3b66]">{box.title}</h3>
                <ul className="space-y-2">
                  {box.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-relaxed">
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'pr_act' && (
        <>
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-amber-300">
                <Sparkles size={14} /> తెలంగాణ పంచాయతీ రాజ్ చట్టం - 2018 (Telangana PR Act, 2018)
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                నాలెడ్జ్ హబ్ & పంచాయతీ రాజ్ చట్టం గైడ్
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, సర్పంచులు, వార్డు సభ్యులు మరియు గ్రామ పౌరుల కోసం తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 లోని కీలక సెక్షన్లు, అధికారాలు, విధులు మరియు నిబంధనల సమగ్ర తెలుగు సమాచార కేంద్రం.
              </p>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="సెక్షన్ నంబర్ లేదా అంశాన్ని వెతకండి (ఉదా: పంచాయతీ కార్యదర్శి, గ్రామ సభ, ఇంటి పన్ను, భవన అనుమతి)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredSections.map((sec) => {
                const isSelected = activeSection?.id === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setActiveSection(sec)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/10'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-100/80 px-2.5 py-0.5 rounded-md">
                        {sec.sectionNumber}
                      </span>
                      <ChevronRight
                        size={16}
                        className={isSelected ? 'text-blue-600 translate-x-0.5 transition-transform' : 'text-slate-400'}
                      />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 mb-1 leading-snug">
                      {sec.titleTe}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {sec.summaryTe}
                    </p>
                  </button>
                );
              })}

              {filteredSections.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
                  <Info className="mx-auto text-slate-400" size={28} />
                  <p className="text-sm font-bold text-slate-700">మీరు వెతికిన అంశం కనుగొనబడలేదు</p>
                  <p className="text-xs text-slate-500">దయచేసి వేరే కీవర్డ్ లేదా అన్ని విభాగాలను ఎంచుకోండి.</p>
                </div>
              )}
            </div>

            {/* Right Detail Panel */}
            <div className="lg:col-span-7">
              {activeSection ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-4">
                  <div className="border-b border-slate-100 pb-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-black text-xs border border-indigo-100">
                        {activeSection.sectionNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        • {activeSection.titleEn}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                      {activeSection.titleTe}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-600" /> చట్టం వివరణ (Detailed Overview)
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {activeSection.detailsTe}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-600" /> ముఖ్యమైన ముఖ్యాంశాలు (Key Provisions)
                    </h4>
                    <ul className="space-y-2.5">
                      {activeSection.keyPointsTe.map((pt, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-slate-700 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/80"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activeSection.importantNoteTe && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={18} />
                      <div className="space-y-1">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-800 block">
                          ముఖ్య గమనిక (Important Legal Note)
                        </span>
                        <p className="text-xs text-amber-900 leading-relaxed font-medium">
                          {activeSection.importantNoteTe}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>ఆధారం: తెలంగాణ పంచాయతీ రాజ్ చట్టం, 2018 (Act No. 5 of 2018)</span>
                    <span className="font-bold text-slate-500">E-Vedhika Knowledge Hub</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PRActHub(_props?: any) {
  return <KnowledgeHubSection />;
}
export default KnowledgeHubSection;
