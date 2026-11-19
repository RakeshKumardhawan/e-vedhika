import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  FileCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  BookOpen,
  Image as ImageIcon,
  Video,
  Upload,
  Trash2,
  Plus,
  Calendar,
  ShieldCheck,
  Layers,
} from "lucide-react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

export interface CitizenServiceGuide {
  id: string;
  number: number;
  titleTe: string;
  titleEn: string;
  category: "permissions" | "tax_revenue" | "vital_records" | "citizen_tracking";
  introTe: string;
  eligibility: string[];
  requiredDocuments: string[];
  applicationProcedure: string[];
  trackingProcess: string;
  commonErrors: { error: string; fix: string }[];
  officialLinks: { label: string; url: string }[];
  lastUpdated: string;
}

export const CITIZEN_SERVICES_12_DATA: CitizenServiceGuide[] = [
  {
    id: "layout-permission",
    number: 1,
    titleTe: "1. లేఅవుట్ అనుమతి (Layout Permission - DTCP / GP)",
    titleEn: "Layout Permission & Plot Subdivision Approval",
    category: "permissions",
    introTe:
      "తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 సెక్షన్ 113 ప్రకారం గ్రామ పంచాయతీ పరిధిలో వ్యవసాయేతర భూమిని ఇళ్ల స్థలాలుగా (Plots) విభజించడానికి సాంకేతిక అనుమతి (DTCP) మరియు గ్రామ పంచాయతీ లేఅవుట్ ఆమోదం తప్పనిసరి.",
    eligibility: [
      "వ్యవసాయ భూమి NALA (Non-Agricultural Land Assessment) కన్వర్షన్ పూర్తయి ఉండాలి.",
      "దరఖాస్తుదారుని పేరు మీద రిజిస్టర్డ్ సేల్ డీడ్ మరియు లింక్ డాక్యుమెంట్లు ఉండాలి.",
    ],
    requiredDocuments: [
      "రిజిస్టర్డ్ సేల్ డీడ్ & EC (Encumbrance Certificate - 13 సంవత్సరాలు)",
      "NALA కన్వర్షన్ ప్రొసీడింగ్స్ కాపీ",
      "లైసెన్స్‌డ్ సర్వేయర్ / ఆర్కిటెక్ట్ రూపొందించిన AutoCAD Layout Plan (రహదారులు కనీసం 30/40 అడుగులు, 10% ఓపెన్ స్పేస్)",
      "గ్రామ రెవెన్యూ మ్యాప్ / టిప్పన్ & ఫీల్డ్ స్కెచ్",
    ],
    applicationProcedure: [
      "ePanchayat / TS-bPASS / DTCP ఆన్‌లైన్ పోర్టల్‌లో Citizen / Architect లాగిన్ ద్వారా దరఖాస్తు నమోదు.",
      "లేఅవుట్ డ్రాయింగ్ మరియు NALA పత్రాలను PDF/DWG ఫార్మాట్‌లో అప్‌లోడ్ చేయడం.",
      "ఆన్‌లైన్ ఫీజు చెల్లించిన తర్వాత గ్రామ పంచాయతీ కార్యదర్శి క్షేత్రస్థాయి తనిఖీ (Site Inspection) చేసి DTCPకి ఫార్వార్డ్ చేస్తారు.",
      "సాంకేతిక ఆమోదం వచ్చిన తర్వాత GP తీర్మానం & DSC సంతకంతో తుది లేఅవుట్ ప్రొసీడింగ్స్ జారీ.",
    ],
    trackingProcess:
      "ePanchayat పోర్టల్‌లో Application Reference Number మరియు మొబైల్ OTP ద్వారా దరఖాస్తు ఏ స్థాయిలో ఉందో (GP / MPDO / DTCP) ట్రాక్ చేయవచ్చు.",
    commonErrors: [
      {
        error: "Drawing File Format Invalid / Layer Mismatch",
        fix: "AutoCAD ఫైల్‌ను నిర్దేశిత DTCP కలర్ లేయర్ నిబంధనల ప్రకారం .dwg (2013 వెర్షన్) లో సేవ్ చేసి అప్‌లోడ్ చేయండి.",
      },
      {
        error: "10% Open Space Mortgage Deed Missing",
        fix: "గ్రామ పంచాయతీ పేరు మీద 10% ఓపెన్ స్పేస్ గిఫ్ట్ డీడ్ రిజిస్ట్రేషన్ కాపీని PDF (200KB లోపు) జత చేయండి.",
      },
    ],
    officialLinks: [
      { label: "Telangana ePanchayat Portal", url: "https://epanchayat.telangana.gov.in/" },
      { label: "TS-bPASS / Layout Portal", url: "https://tsbpass.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "building-permission",
    number: 2,
    titleTe: "2. భవన నిర్మాణ అనుమతి (Building Permission - GP / TS-bPASS)",
    titleEn: "Gram Panchayat Building Construction Permission",
    category: "permissions",
    introTe:
      "గ్రామ పంచాయతీ పరిధిలో కొత్త ఇల్లు లేదా భవనం నిర్మించడానికి PR Act 2018 సెక్షన్ 114 ప్రకారం ఆన్‌లైన్ భవన నిర్మాణ అనుమతి పొందాలి.",
    eligibility: [
      "అనుమతి పొందిన లేఅవుట్ ప్లాట్ లేదా గ్రామ కంఠం / పాత ఇంటి స్థలం కలిగి ఉండాలి.",
      "G+2 (10 మీటర్ల ఎత్తు లోపు) నివాస భవనాలకు గ్రామ పంచాయతీ స్థాయిలోనే ఆన్‌లైన్ ఆమోదం.",
    ],
    requiredDocuments: [
      "రిజిస్టర్డ్ సేల్ డీడ్ / పట్టా సర్టిఫికెట్",
      "తాజా ఇంటి పన్ను / ఖాళీ స్థలం పన్ను రసీదు & EC",
      "లైసెన్స్‌డ్ ఇంజనీర్ సంతకం చేసిన Building Plan PDF",
      "స్థలం యొక్క జియో-ట్యాగ్డ్ ఫోటో (Site Photograph)",
    ],
    applicationProcedure: [
      "ePanchayat పోర్టల్‌లో Citizen Services -> Building Permission ఎంచుకోవాలి.",
      "స్థలం కొలతలు (Sq. Yards / Sq. Meters), సెట్‌బ్యాక్స్ మరియు ప్లాన్ వివరాలను నమోదు చేయాలి.",
      "పంచాయతీ కార్యదర్శి సైట్ విజిట్ చేసి కొలతలు సరిపోల్చి DSC టోకెన్‌తో డిజిటల్ ఆమోదం తెలుపుతారు.",
    ],
    trackingProcess:
      "Application Status Tracking లో దరఖాస్తు సంఖ్య నమోదు చేసి 15–21 రోజుల SLA గడువులోపు ప్రొసీడింగ్స్ డౌన్‌లోడ్ చేసుకోవచ్చు.",
    commonErrors: [
      {
        error: "DSC Sign Failed While Approving Building Permission",
        fix: "Java 32-bit మరియు DSK Signer సర్వీస్ రన్ అవుతుందో లేదో తనిఖీ చేసి Edge IE Mode లో సంతకం చేయండి.",
      },
    ],
    officialLinks: [
      { label: "ePanchayat Citizen Services", url: "https://epanchayat.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "house-tax-assessment",
    number: 3,
    titleTe: "3. కొత్త ఇంటి పన్ను అసెస్‌మెంట్ (House Tax New Assessment)",
    titleEn: "New House Tax Assessment & PTIN Generation",
    category: "tax_revenue",
    introTe:
      "నిర్మాణం పూర్తయిన భవనానికి గ్రామ పంచాయతీ ఆస్తి పన్ను రిజిస్టర్‌లో కొత్త అసెస్‌మెంట్ నంబర్ (Assessment / Door No) కేటాయించే ప్రక్రియ.",
    eligibility: ["భవన నిర్మాణం పూర్తయి ఉండాలి మరియు యాజమాన్య హక్కు పత్రం ఉండాలి."],
    requiredDocuments: [
      "సేల్ డీడ్ / యాజమాన్య ధృవీకరణ పత్రం",
      "భవన నిర్మాణ అనుమతి కాపీ & ఇంటి ఫోటో",
      "ఆధార్ కార్డు & మొబైల్ నంబర్",
    ],
    applicationProcedure: [
      "ఆన్‌లైన్‌లో New House Tax Assessment దరఖాస్తు నమోదు.",
      "భవనం రకం (RCC / రేకులు / పెంకుటిల్లు), విస్తీర్ణం (Plinth Area) ఆధారంగా వార్షిక పన్ను లెక్కింపు.",
      "కార్యదర్శి తనిఖీ అనంతరం Demand Register లో అసెస్‌మెంట్ నంబర్ జనరేట్ అవుతుంది.",
    ],
    trackingProcess:
      "ePanchayat House Tax మాడ్యూల్‌లో మీ మొబైల్ నంబర్ లేదా అసెస్‌మెంట్ నంబర్‌తో వివరాలు చూడవచ్చు.",
    commonErrors: [
      {
        error: "Plinth Area Calculation Mismatch",
        fix: "కొలతలు చదరపు అడుగులలో (Sq.Ft) ఉన్నాయా లేదా చదరపు మీటర్లలో (Sq.M) ఉన్నాయా నిర్ధారించుకుని నమోదు చేయండి.",
      },
    ],
    officialLinks: [
      { label: "ePanchayat House Tax Portal", url: "https://epanchayat.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "building-mutation",
    number: 4,
    titleTe: "4. ఆస్తి యాజమాన్య బదిలీ (Building / Property Mutation)",
    titleEn: "Property Ownership Transfer (Mutation) in GP Records",
    category: "tax_revenue",
    introTe:
      "ఇల్లు లేదా స్థలం కొనుగోలు చేసినప్పుడు, గిఫ్ట్ డీడ్ లేదా వారసత్వం ద్వారా యజమాని మారినప్పుడు గ్రామ పంచాయతీ రికార్డులలో పేరు మార్పు (Mutation).",
    eligibility: [
      "పాత ఇంటి పన్ను బకాయిలు (Arrears) పూర్తిగా చెల్లించి ఉండాలి.",
      "సబ్-రిజిస్ట్రార్ కార్యాలయంలో రిజిస్ట్రేషన్ పూర్తయి ఉండాలి లేదా ఫ్యామిలీ మెంబర్ సర్టిఫికెట్ ఉండాలి.",
    ],
    requiredDocuments: [
      "రిజిస్టర్డ్ సేల్ డీడ్ / గిఫ్ట్ డీడ్ / విల్ డీడ్",
      "వారసత్వ బదిలీ అయితే మరణ ధృవీకరణ పత్రం & Family Member Certificate",
      "తాజా ఇంటి పన్ను రసీదు (No Dues)",
    ],
    applicationProcedure: [
      "ePanchayat / Meeseva ద్వారా Mutation దరఖాస్తు మరియు మ్యుటేషన్ ఫీజు చెల్లింపు.",
      "15 రోజుల నోటీసు పీరియడ్ & కార్యదర్శి క్షేత్రస్థాయి విచారణ.",
      "అభ్యంతరాలు లేకపోతే GP ఆస్తి రిజిస్టర్‌లో కొత్త యజమాని పేరు అప్‌డేట్ చేసి Mutation Certificate జారీ.",
    ],
    trackingProcess: "Application ID ద్వారా Mutation ప్రొసీడింగ్స్ డౌన్‌లోడ్ చేసుకోవచ్చు.",
    commonErrors: [
      {
        error: "Pending Arrears Blocking Mutation",
        fix: "ముందుగా పాత అసెస్‌మెంట్ నంబర్‌పై ఉన్న పెండింగ్ ఇంటి పన్ను బకాయిని ఆన్‌లైన్‌లో క్లియర్ చేయండి.",
      },
    ],
    officialLinks: [
      { label: "ePanchayat Portal", url: "https://epanchayat.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "property-tax-payment",
    number: 5,
    titleTe: "5. ఆస్తి పన్ను ఆన్‌లైన్ చెల్లింపు & రసీదు (Property Tax Payment)",
    titleEn: "Online House / Property Tax Payment & Receipt Download",
    category: "tax_revenue",
    introTe:
      "గ్రామ పంచాయతీ ఇంటి పన్నును ఆన్‌లైన్ ద్వారా లేదా బిల్ కలెక్టర్ / కార్యదర్శి వద్ద డిజిటల్ రసీదుతో చెల్లించే సదుపాయం.",
    eligibility: ["గ్రామ పంచాయతీ అసెస్‌మెంట్ నంబర్ కలిగిన ప్రతి ఇంటి యజమాని."],
    requiredDocuments: ["అసెస్‌మెంట్ నంబర్ / డోర్ నంబర్ లేదా యజమాని పేరు"],
    applicationProcedure: [
      "ePanchayat పోర్టల్‌లో జిల్లా, మండలం, గ్రామ పంచాయతీ మరియు అసెస్‌మెంట్ నంబర్ ఎంచుకోవాలి.",
      "పాత బకాయి (Arrear) మరియు ప్రస్తుత డిమాండ్ (Current Demand) సరిచూసుకుని UPI / NetBanking ద్వారా చెల్లించాలి.",
      "వెంటనే ఆన్‌లైన్ రసీదు డౌన్‌లోడ్ అవుతుంది మరియు GP DCB లో ఆటోమేటిక్‌గా జమ అవుతుంది.",
    ],
    trackingProcess: "House Tax DCB Live రిపోర్ట్‌లో తక్షణమే చెల్లింపు స్థితి అప్‌డేట్ అవుతుంది.",
    commonErrors: [
      {
        error: "Amount Debited But Receipt Not Generated",
        fix: "24 గంటల్లోపే Payment Reconciliation జరుగుతుంది; Transaction ID తో Verify Payment క్లిక్ చేయండి.",
      },
    ],
    officialLinks: [
      {
        label: "House Tax DCB Live",
        url: "https://epanchayat.telangana.gov.in/epmis/epmisPRHTAXDCBLive.jsp",
      },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "trade-license",
    number: 6,
    titleTe: "6. ట్రేడ్ లైసెన్స్ జారీ & రెన్యూవల్ (Trade License)",
    titleEn: "Gram Panchayat Trade License Application & Renewal",
    category: "permissions",
    introTe:
      "గ్రామ పంచాయతీ పరిధిలో దుకాణాలు, వ్యాపార సంస్థలు, రైస్ మిల్లులు, పౌల్ట్రీ లేదా చిన్న పరిశ్రమలు నిర్వహించడానికి వార్షిక ట్రేడ్ లైసెన్స్.",
    eligibility: ["18 ఏళ్లు నిండిన వ్యాపార యజమాని / సంస్థ."],
    requiredDocuments: [
      "వ్యాపార స్థలం అద్దె ఒప్పందం (Rental Agreement) లేదా యాజమాన్య పత్రం",
      "ఆధార్ కార్డు & పాన్ కార్డు",
      "ఇంటి పన్ను రసీదు & పారిశుద్ధ్య ప్రమాణాల హామీ పత్రం",
    ],
    applicationProcedure: [
      "ఆన్‌లైన్‌లో వ్యాపార రకం (Trade Category) మరియు విస్తీర్ణం ఎంపిక.",
      "గ్రామ పంచాయతీ నిర్ణయించిన వార్షిక లైసెన్స్ ఫీజు చెల్లింపు.",
      "కార్యదర్శి తనిఖీ అనంతరం QR కోడ్‌తో కూడిన Trade License సర్టిఫికెట్ జారీ.",
    ],
    trackingProcess: "Application Number తో లైసెన్స్ సర్టిఫికెట్ డౌన్‌లోడ్ & ప్రతి ఆర్థిక సంవత్సరం రెన్యూవల్.",
    commonErrors: [
      {
        error: "Trade Category Fee Not Populating",
        fix: "GP Master Configuration లో సంబంధిత వ్యాపార కేటగిరీకి వార్షిక రేటు మ్యాప్ అయిందో లేదో తనిఖీ చేయండి.",
      },
    ],
    officialLinks: [
      { label: "ePanchayat Portal", url: "https://epanchayat.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "birth-registration",
    number: 7,
    titleTe: "7. జనన నమోదు & సర్టిఫికెట్ (Birth Registration - UBD / CRS)",
    titleEn: "Birth Registration & Digital Certificate Issuance",
    category: "vital_records",
    introTe:
      "జనన మరణ నమోదు చట్టం 1969 ప్రకారం శిశువు జన్మించిన 21 రోజులలోపు ఉచితంగా నమోదు చేసి డిజిటల్ సంతకంతో బర్త్ సర్టిఫికెట్ జారీ చేయడం.",
    eligibility: [
      "21 రోజులలోపు సాధారణ నమోదు (ఉచితం).",
      "21–30 రోజులు: ఆలస్య రుసుముతో GP రిజిస్ట్రార్ ఆమోదం.",
      "30 రోజుల నుండి 1 సంవత్సరం: MPDO/సంబంధిత అధికారి అనుమతి.",
      "1 సంవత్సరం పైబడితే: RDO / సబ్-కలెక్టర్ ప్రొసీడింగ్స్ తప్పనిసరి.",
    ],
    requiredDocuments: [
      "ఫారమ్-1 (జనన నివేదిక) & ఆసుపత్రి డిశ్చార్జ్ సమ్మరీ",
      "తల్లిదండ్రుల ఆధార్ కార్డులు & వివాహ ధృవీకరణ వివరములు",
      "ఆలస్య నమోదు అయితే RDO ఉత్తర్వులు & నోటరీ అఫిడవిట్",
    ],
    applicationProcedure: [
      "UBD (తెలంగాణ) / CRS (ఏపీ) పోర్టల్‌లో వివరాలను ఇంగ్లీష్ మరియు తెలుగులో నమోదు చేయాలి.",
      "డాక్యుమెంట్స్ (200KB లోపు PDF) అప్‌లోడ్ చేసి Draft Preview సరిచూసుకోవాలి.",
      "పంచాయతీ కార్యదర్శి DSC USB టోకెన్‌తో డిజిటల్ సంతకం చేయగానే సర్టిఫికెట్ జనరేట్ అవుతుంది.",
    ],
    trackingProcess: "UBD పోర్టల్‌లో Registration Number లేదా తేదీ ద్వారా ఎప్పుడైనా సర్టిఫికెట్ డౌన్‌లోడ్ చేసుకోవచ్చు.",
    commonErrors: [
      {
        error: "PDF Upload Size Error / Telugu Font Garbled",
        fix: "ఈ-వేదిక PDF Compress టూల్‌తో ఫైల్‌ను 180KB లోపుకు తగ్గించండి మరియు Unicode తెలుగు మాత్రమే వాడండి.",
      },
    ],
    officialLinks: [
      { label: "Telangana UBD Portal", url: "https://ubd.telangana.gov.in/" },
      { label: "Central CRS Portal", url: "https://dc.crsorgi.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "death-registration",
    number: 8,
    titleTe: "8. మరణ నమోదు & సర్టిఫికెట్ (Death Registration - UBD / CRS)",
    titleEn: "Death Registration & Digital Certificate Issuance",
    category: "vital_records",
    introTe:
      "గ్రామ పంచాయతీ పరిధిలో మరణం సంభవించిన 21 రోజులలోపు నమోదు చేసి కుటుంబ సభ్యులకు అధికారిక మరణ ధృవీకరణ పత్రం జారీ చేయడం.",
    eligibility: ["21 రోజులలోపు ఉచిత నమోదు; 1 సంవత్సరం దాటితే RDO ప్రొసీడింగ్స్ అవసరం."],
    requiredDocuments: [
      "ఫారమ్-2 (మరణ నివేదిక) & ఆసుపత్రి డెత్ సమ్మరీ / శ్మశాన వాటిక రసీదు",
      "మృతుని ఆధార్ కార్డు & దరఖాస్తుదారుని ఆధార్ కార్డు",
      "పంచనామా / పోలీస్ FIR (అసహజ మరణం అయితే)",
    ],
    applicationProcedure: [
      "UBD / CRS పోర్టల్‌లో Death Registration -> Add Death Registration ఎంపిక.",
      "మృతుని పేరు, వయస్సు, మరణించిన తేదీ, స్థలం మరియు తండ్రి/భర్త పేరు తెలుగు & ఇంగ్లీష్‌లో నమోదు.",
      "కార్యదర్శి DSC సంతకంతో QR కోడ్ సర్టిఫికెట్ జారీ.",
    ],
    trackingProcess: "UBD MIS / Citizen Search లో అప్లికేషన్ నంబర్‌తో సర్టిఫికెట్ వెరిఫికేషన్.",
    commonErrors: [
      {
        error: "Signer Applet Not Opening in Edge",
        fix: "Edge IE Mode ఆన్ చేసి, 32-bit Java Exception Site List లో https://ubd.telangana.gov.in జత చేయండి.",
      },
    ],
    officialLinks: [
      { label: "Telangana UBD Portal", url: "https://ubd.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "application-status-tracking",
    number: 9,
    titleTe: "9. దరఖాస్తు స్థితి ట్రాకింగ్ (Application Status Tracking)",
    titleEn: "Real-Time ePanchayat & UBD Application Status Tracking",
    category: "citizen_tracking",
    introTe:
      "పౌరులు సమర్పించిన భవన అనుమతి, లేఅవుట్, మ్యుటేషన్, ట్రేడ్ లైసెన్స్ మరియు జనన/మరణ సర్టిఫికెట్ల దరఖాస్తు స్థితిని ఆన్‌లైన్‌లో తెలుసుకునే విధానం.",
    eligibility: ["చెల్లుబాటు అయ్యే Application / Acknowledgement Number కలిగిన ప్రతి దరఖాస్తుదారుడు."],
    requiredDocuments: ["Application ID మరియు రిజిస్టర్డ్ మొబైల్ నంబర్"],
    applicationProcedure: [
      "సంబంధిత పోర్టల్ హోమ్ పేజీలో 'Know Your Application Status' లేదా 'Track Application' క్లిక్ చేయాలి.",
      "అప్లికేషన్ నంబర్ ఎంటర్ చేసి Search నొక్కగానే ప్రస్తుత స్థితి (Pending at Operator / Secretary / Approved / Rejected with Remarks) కనిపిస్తుంది.",
    ],
    trackingProcess: "ఆమోదం పొందిన వెంటనే 'Download Signed Certificate' బటన్ యాక్టివ్ అవుతుంది.",
    commonErrors: [
      {
        error: "No Record Found for Application ID",
        fix: "సరైన ఆర్థిక సంవత్సరం (Financial Year) మరియు సర్వీస్ కేటగిరీ ఎంచుకున్నారో లేదో తనిఖీ చేయండి.",
      },
    ],
    officialLinks: [
      { label: "ePanchayat Status Portal", url: "https://epanchayat.telangana.gov.in/" },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "required-documents-checklist",
    number: 10,
    titleTe: "10. పౌర సేవల డాక్యుమెంట్ల చెక్‌లిస్ట్ (Required Documents Checklist)",
    titleEn: "Standard Document Checklist & PDF File Specifications",
    category: "citizen_tracking",
    introTe:
      "గ్రామ పంచాయతీ ఆన్‌లైన్ సేవలకు దరఖాస్తు చేసే ముందు స్కాన్ చేయాల్సిన పత్రాలు మరియు వాటి ఫైల్ సైజు ప్రమాణాలు.",
    eligibility: ["అన్ని గ్రామ పంచాయతీ పౌర సేవలకు వర్తిస్తుంది."],
    requiredDocuments: [
      "PDF ఫైల్ సైజు: 100 KB నుండి 200 KB లోపు (Black & White / 150 DPI స్కాన్ ఉత్తమం)",
      "ఫోటో సైజు: 20 KB నుండి 50 KB లోపు (.jpg / .jpeg)",
      "ఫైల్ పేరులో ప్రత్యేక గుర్తులు (@, #, %, &, స్పేస్‌లు) లేకుండా కేవలం ఇంగ్లీష్ అక్షరాలు, అండర్‌స్కోర్ వాడాలి.",
    ],
    applicationProcedure: [
      "ఈ-వేదిక పోర్టల్‌లోని 'PDF Compress (250KB)' టూల్ ఉపయోగించి పెద్ద PDF ఫైళ్లను ఒక్క క్లిక్‌తో కంప్రెస్ చేయండి.",
      "అన్ని పేజీలను ఒకే PDF గా మర్జ్ చేసి స్పష్టంగా చదవగలిగేలా ఉన్నాయో లేదో ప్రివ్యూ చూడండి.",
    ],
    trackingProcess: "సరైన ఫైల్ సైజుతో అప్‌లోడ్ చేస్తే సర్వర్ టైమ్-అవుట్ ఎర్రర్లు రావు.",
    commonErrors: [
      {
        error: "Upload Failed / 413 Request Entity Too Large",
        fix: "PDF సైజును 180 KB లోపుకు తగ్గించి మళ్ళీ అప్‌లోడ్ చేయండి.",
      },
    ],
    officialLinks: [{ label: "E-Vedhika PDF Compressor", url: "/pdf_compress" }],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "citizen-feedback-grievance",
    number: 11,
    titleTe: "11. పౌర అభిప్రాయం & ఫిర్యాదుల నమోదు (Citizen Feedback & Grievance)",
    titleEn: "Gram Panchayat Citizen Grievance Redressal & Sanitation Feedback",
    category: "citizen_tracking",
    introTe:
      "గ్రామ పంచాయతీలో పారిశుద్ధ్యం, వీధి దీపాలు (LED Street Lights), తాగునీటి సరఫరా (Mission Bhagiratha) మరియు సర్టిఫికెట్ జారీపై పౌరులు తమ సమస్యలను నమోదు చేసే విధానం.",
    eligibility: ["గ్రామ పంచాయతీ నివాసితులందరూ."],
    requiredDocuments: ["సమస్య ఉన్న ప్రదేశం ఫోటో, వార్డు నంబర్ మరియు మొబైల్ నంబర్"],
    applicationProcedure: [
      "పోర్టల్‌లో ఫిర్యాదు విభాగం (Sanitation / Water / Street Light / Administration) ఎంచుకోవాలి.",
      "సమస్య వివరాలు మరియు ఫోటో అప్‌లోడ్ చేసి సబ్మిట్ చేయగానే Ticket ID వస్తుంది.",
      "పంచాయతీ కార్యదర్శి సమస్యను పరిష్కరించి Action Taken Photo అప్‌లోడ్ చేస్తారు.",
    ],
    trackingProcess: "Ticket Number ద్వారా పరిష్కార స్థితిని లైవ్‌లో చూడవచ్చు.",
    commonErrors: [
      {
        error: "Location / Ward Not Selected",
        fix: "సరైన వార్డు నంబర్ మరియు వీధి పేరును నమోదు చేయండి.",
      },
    ],
    officialLinks: [{ label: "E-Vedhika Public Suggestions", url: "/suggestions" }],
    lastUpdated: "15 నవంబర్ 2026",
  },
  {
    id: "tax-information-rates",
    number: 12,
    titleTe: "12. గ్రామ పంచాయతీ పన్నులు & ఫీజుల సమాచారం (Tax & Fee Schedule)",
    titleEn: "Gram Panchayat Taxes, Non-Tax Revenue & Fee Schedule Guide",
    category: "tax_revenue",
    introTe:
      "తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 సెక్షన్ 64–70 ప్రకారం గ్రామ పంచాయతీ విధించే పన్నులు, ఫీజులు మరియు సొంత ఆదాయ వనరుల (Own Source Revenue) మార్గదర్శకాలు.",
    eligibility: ["గ్రామ పంచాయతీ పరిధిలోని గృహాలు, వాణిజ్య భవనాలు, ప్రకటనలు మరియు మార్కెట్లు."],
    requiredDocuments: ["GP తీర్మానం & ప్రభుత్వం నిర్ణయించిన Capital Value / Annual Rental Value రేట్లు"],
    applicationProcedure: [
      "1. ఇంటి పన్ను (House Tax) – భవనం మూలధన విలువ లేదా వార్షిక అద్దె విలువ ఆధారంగా.",
      "2. కుళాయి ఫీజు (Water Tap Fee), లైటింగ్ & డ్రైనేజీ పన్ను.",
      "3. ట్రేడ్ లైసెన్స్ ఫీజు, వారపు సంతలు, చేపల చెరువులు & ఆస్తుల వేలం పాటల ఆదాయం.",
    ],
    trackingProcess:
      "వసూలైన ప్రతి రూపాయిని GP General Fund / eGramSwaraj క్యాష్ బుక్‌లో నమోదు చేసి DCB రిపోర్ట్‌లో సరిపోల్చాలి.",
    commonErrors: [
      {
        error: "DCB Collection Not Matching Cash Book",
        fix: "ఈ-వేదిక DCB Report Module మరియు Excel Compare టూల్ ఉపయోగించి ఆన్‌లైన్ రసీదులను క్యాష్ బుక్‌తో సరిపోల్చండి.",
      },
    ],
    officialLinks: [
      {
        label: "House Tax DCB Portal",
        url: "https://epanchayat.telangana.gov.in/epmis/epmisPRHTAXDCBLive.jsp",
      },
    ],
    lastUpdated: "15 నవంబర్ 2026",
  },
];

interface GalleryMediaItem {
  id: string;
  title: string;
  category: "training" | "events" | "images" | "videos";
  mediaType: "image" | "youtube";
  url: string;
  description: string;
  createdAt: number;
}

const DEFAULT_GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: "gal_1",
    title: "UBD 17-Step Auto Configuration & DSC Token Setup Training",
    category: "training",
    mediaType: "image",
    url: "/banner.jpg",
    description:
      "తెలంగాణ & ఏపీ గ్రామ పంచాయతీ కంప్యూటర్ ఆపరేటర్లకు UBD పోర్టల్, Java 32-bit మరియు DSC టోకెన్ కాన్ఫిగరేషన్ శిక్షణ.",
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "gal_2",
    title: "Daily DSR & Multi-Day Attendance Consolidation Workshop",
    category: "events",
    mediaType: "image",
    url: "/banner.png",
    description:
      "మండల స్థాయి కంప్యూటర్ ఆపరేటర్లకు DSR అనలైజర్, MAS రిపోర్ట్ మరియు Excel Studio ఆటోమేషన్ వర్క్‌షాప్.",
    createdAt: Date.now() - 86400000 * 1,
  },
];

export function EPanchayatCitizenCenter({
  user,
  isAdmin,
  addToast,
  initialSection = "citizen_services",
}: {
  user?: any;
  isAdmin?: boolean;
  addToast?: (msg: string) => void;
  initialSection?: "citizen_services" | "gallery";
}) {
  const [activeSection, setActiveSection] = useState<
    "citizen_services" | "gallery"
  >(initialSection);

  // Citizen Services State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedService, setSelectedService] = useState<CitizenServiceGuide>(
    CITIZEN_SERVICES_12_DATA[0]
  );

  // Gallery State
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>(
    DEFAULT_GALLERY_ITEMS
  );
  const [galleryCategory, setGalleryCategory] = useState<string>("ALL");
  const [gallerySearch, setGallerySearch] = useState<string>("");
  const [showAddGalleryModal, setShowAddGalleryModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<
    "training" | "events" | "images" | "videos"
  >("training");
  const [newMediaType, setNewMediaType] = useState<"image" | "youtube">("image");
  const [newUrl, setNewUrl] = useState<string>("");
  const [newDesc, setNewDesc] = useState<string>("");
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  const notify = (msg: string) => {
    if (addToast) addToast(msg);
  };

  useEffect(() => {
    try {
      const q = query(collection(db, "gallery_media"), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const fromDb = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as GalleryMediaItem)
          );
          setGalleryItems([...fromDb, ...DEFAULT_GALLERY_ITEMS]);
        },
        () => {}
      );
      return () => unsub();
    } catch {}
  }, []);

  const filteredServices = useMemo(() => {
    return CITIZEN_SERVICES_12_DATA.filter((s) => {
      if (selectedCategory !== "ALL" && s.category !== selectedCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.titleTe.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.introTe.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const filteredGallery = useMemo(() => {
    return galleryItems.filter((g) => {
      if (galleryCategory !== "ALL" && g.category !== galleryCategory)
        return false;
      if (gallerySearch.trim()) {
        const q = gallerySearch.toLowerCase();
        return (
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [galleryItems, galleryCategory, gallerySearch]);

  const handleR2ImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      notify("ఫైల్ సైజు 10MB లోపు ఉండాలి.");
      return;
    }
    setIsUploadingFile(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setNewUrl(data.url);
          notify("Cloudflare R2 కి ఇమేజ్ అప్‌లోడ్ పూర్తయింది!");
        }
      } else {
        notify("అప్‌లోడ్ విఫలమైంది, దయచేసి URL ఇవ్వండి.");
      }
    } catch {
      notify("అప్‌లోడ్ సమయంలో నెట్‌వర్క్ లోపం.");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      notify("దయచేసి టైటిల్ మరియు మీడియా లింక్ ఇవ్వండి.");
      return;
    }
    try {
      await addDoc(collection(db, "gallery_media"), {
        title: newTitle.trim(),
        category: newCategory,
        mediaType: newMediaType,
        url: newUrl.trim(),
        description: newDesc.trim(),
        createdAt: Date.now(),
      });
      setNewTitle("");
      setNewUrl("");
      setNewDesc("");
      setShowAddGalleryModal(false);
      notify("గ్యాలరీ ఐటమ్ విజయవంతంగా ప్రచురించబడింది!");
    } catch {
      notify("సేవ్ చేయడంలో లోపం సంభవించింది.");
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (id.startsWith("gal_")) return;
    try {
      await deleteDoc(doc(db, "gallery_media", id));
      notify("గ్యాలరీ ఐటమ్ తొలగించబడింది.");
    } catch {}
  };

  const getYoutubeEmbedUrl = (rawUrl: string) => {
    const match = rawUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : rawUrl;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header & Top Switcher */}
      <div className="bg-gradient-to-r from-[#0d3b66] via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-black">
              <Building2 size={14} /> STATE & CENTRAL ePANCHAYAT TUTORIALS & MEDIA HUB
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              ఈ-పంచాయతీ పౌర సేవల ట్యుటోరియల్ సెంటర్ & మీడియా గ్యాలరీ
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              రాష్ట్ర & కేంద్ర ePanchayat అప్లికేషన్లు, 12 పౌర సేవల (Citizen Services) పూర్తి మార్గదర్శకాలు, కామన్ ఎర్రర్ల పరిష్కారాలు మరియు శిక్షణ గ్యాలరీ.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveSection("citizen_services")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                activeSection === "citizen_services"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <BookOpen size={15} /> 12 ePanchayat పౌర సేవల గైడ్స్
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("gallery")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                activeSection === "gallery"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <ImageIcon size={15} /> Gallery & Media Center
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: 12 ePANCHAYAT CITIZEN SERVICES */}
      {activeSection === "citizen_services" && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[260px]">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="పౌర సేవ పేరు వెతకండి (ఉదా: Layout, Building Permission, Mutation, House Tax, Birth)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "అన్ని సేవలు (All 12)" },
                { id: "permissions", label: "అనుమతులు (Permissions)" },
                { id: "tax_revenue", label: "పన్నులు & మ్యుటేషన్ (Tax)" },
                { id: "vital_records", label: "జనన / మరణ (UBD)" },
                { id: "citizen_tracking", label: "ట్రాకింగ్ & చెక్‌లిస్ట్" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#0d3b66] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Service List */}
            <div className="lg:col-span-5 space-y-2.5">
              {filteredServices.map((srv) => {
                const isSelected = selectedService.id === srv.id;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-600 shadow-sm ring-2 ring-blue-500/10"
                        : "bg-white border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        SERVICE #{srv.number}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Verified: {srv.lastUpdated}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900">
                      {srv.titleTe}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {srv.introTe}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Service Detail Panel */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-4">
                <div className="border-b border-slate-100 pb-4 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-black border border-blue-200">
                      ePanchayat Citizen Service #{selectedService.number}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <Calendar size={12} /> చివరి అప్‌డేట్: {selectedService.lastUpdated}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-1">
                    {selectedService.titleTe}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    {selectedService.titleEn}
                  </p>
                </div>

                {/* Intro */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedService.introTe}
                </div>

                {/* Eligibility & Documents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                    <h4 className="text-xs font-black uppercase text-blue-900 flex items-center gap-1.5">
                      <ShieldCheck size={15} className="text-blue-600" /> అర్హతలు (Eligibility)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {selectedService.eligibility.map((el, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2
                            size={13}
                            className="text-blue-600 shrink-0 mt-0.5"
                          />
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                    <h4 className="text-xs font-black uppercase text-emerald-900 flex items-center gap-1.5">
                      <FileCheck size={15} className="text-emerald-600" /> అవసరమైన పత్రాలు (Required Documents)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {selectedService.requiredDocuments.map((docItem, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2
                            size={13}
                            className="text-emerald-600 shrink-0 mt-0.5"
                          />
                          <span>{docItem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Step-by-Step Procedure */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black uppercase text-slate-600">
                    దరఖాస్తు & ఆమోద ప్రక్రియ (Step-by-Step Application Procedure)
                  </h4>
                  <div className="space-y-2">
                    {selectedService.applicationProcedure.map((step, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-800 font-medium"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#0d3b66] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking & Common Errors */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <Wrench size={14} className="text-amber-600" /> సాధారణ సాంకేతిక సమస్యలు & పరిష్కారాలు (Common Errors & Troubleshooting)
                  </h4>
                  {selectedService.commonErrors.map((ce, i) => (
                    <div key={i} className="text-xs space-y-0.5">
                      <p className="font-black text-rose-700">⚠️ Error: {ce.error}</p>
                      <p className="text-slate-700 font-medium">✅ పరిష్కారం: {ce.fix}</p>
                    </div>
                  ))}
                  <p className="text-[11px] text-amber-900 pt-1 border-t border-amber-200/80">
                    <strong>🔍 ట్రాకింగ్ విధానం:</strong> {selectedService.trackingProcess}
                  </p>
                </div>

                {/* Official Reference Links */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-2">
                    {selectedService.officialLinks.map((lnk, i) => (
                      <a
                        key={i}
                        href={lnk.url}
                        target={lnk.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black flex items-center gap-1.5 border border-blue-200"
                      >
                        <ExternalLink size={13} /> {lnk.label}
                      </a>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    * అధికారిక ప్రభుత్వ పోర్టల్ నిబంధనల ప్రకారం సమాచారం.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GALLERY & MEDIA CENTER */}
      {activeSection === "gallery" && (
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "ALL", label: "అన్ని మీడియా (All)" },
                { id: "training", label: "శిక్షణ గ్యాలరీ (Training)" },
                { id: "events", label: "కార్యక్రమాలు (Events)" },
                { id: "images", label: "ఫోటోలు (Images)" },
                { id: "videos", label: "ట్యుటోరియల్ వీడియోలు (Videos)" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setGalleryCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
                    galleryCategory === cat.id
                      ? "bg-[#0d3b66] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="గ్యాలరీలో వెతకండి..."
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
              />
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} /> Add Media (R2 / YouTube)
                </button>
              )}
            </div>
          </div>

          {showAddGalleryModal && isAdmin && (
            <form
              onSubmit={handleSaveGalleryItem}
              className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-md space-y-4"
            >
              <h3 className="text-base font-black text-slate-800">
                కొత్త గ్యాలరీ ఫోటో / YouTube ట్యుటోరియల్ వీడియో జోడించండి (Cloudflare R2)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="టైటిల్ (Title)"
                  required
                  className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="training">Training Gallery</option>
                  <option value="events">Event Gallery</option>
                  <option value="images">Image Gallery</option>
                  <option value="videos">Video Tutorial</option>
                </select>
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value as any)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="image">Image (Cloudflare R2 / URL)</option>
                  <option value="youtube">YouTube Video Embed</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="ఇమేజ్ URL లేదా YouTube వీడియో లింక్..."
                  required
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
                {newMediaType === "image" && (
                  <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1.5">
                    <Upload size={14} />{" "}
                    {isUploadingFile ? "Uploading to R2..." : "Upload Image to R2"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleR2ImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="వివరణ (Description in Telugu/English)..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium h-20"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-900 relative overflow-hidden">
                    {item.mediaType === "youtube" ? (
                      <iframe
                        src={getYoutubeEmbedUrl(item.url)}
                        title={item.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-black uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h4 className="text-sm font-black text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {isAdmin && !item.id.startsWith("gal_") && (
                  <div className="px-5 pb-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryItem(item.id)}
                      className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default EPanchayatCitizenCenter;
