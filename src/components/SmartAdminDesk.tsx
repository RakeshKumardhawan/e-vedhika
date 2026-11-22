import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  Copy,
  Check,
  Globe,
  RefreshCw,
  Trash2,
  Plus,
  ShieldCheck,
  Sparkles,
  Building,
  Landmark,
  Share2,
  FileBadge,
  FileCheck,
  CheckCircle2,
  FileDown
} from "lucide-react";

interface SmartAdminDeskProps {
  addToast?: (msg: string) => void;
  user?: any;
}

export function SmartAdminDesk({ addToast }: SmartAdminDeskProps) {
  const [activeSubTab, setActiveSubTab] = useState<"letters" | "portals" | "voucher" | "certificates" | "noticeboard">("letters");

  // ==================== TAB 1: SMART LETTERS STATE ====================
  const [officeLevel, setOfficeLevel] = useState<"gp" | "mpdo">("gp");
  const [letterNo, setLetterNo] = useState("లేఖ నెం: 142/GP-RMP/2026");
  const [letterDate, setLetterDate] = useState("22-11-2026");
  const [officeName, setOfficeName] = useState("రాంపూర్");
  const [mandalName, setMandalName] = useState("చేవెళ్ల");
  const [districtName, setDistrictName] = useState("రంగారెడ్డి");
  const [toWhom, setToWhom] = useState("గౌరవనీయులైన మండల ప్రజా పరిషత్ అభివృద్ధి అధికారి (MPDO) గారికి,");
  const [rawTopic, setRawTopic] = useState("మా ఊర్లో 3వ వార్డులో తాగునీటి బోరు మోటార్ కాలిపోయింది. అత్యవసరంగా తాగునీటి సరఫరా పునరుద్ధరించడానికి పంచాయతీ సాధారణ నిధుల నుండి రూ. 28,000 ఖర్చు చేయడానికి అనుమతి మంజూరు చేయవలసిందిగా కోరుచున్నాము.");
  const [sigMode, setSigMode] = useState<"AUTO" | "SEC_ONLY" | "SARP_SEC" | "SARP_UPA_SEC" | "MPDO_ONLY" | "MPDO_SUPT">("SARP_SEC");
  const [pageSize, setPageSize] = useState<"A4" | "Legal" | "A5">("A4");

  const [draftIndex, setDraftIndex] = useState(1);
  const [copiedLetter, setCopiedLetter] = useState(false);

  // Drafts content
  const [draftOptions, setDraftOptions] = useState<Array<{ subject: string; ref: string; body: string }>>([]);

  const quickTopicsGP = [
    { label: "🚰 తాగునీటి మోటార్ మరమ్మతు", sigType: "SARP_SEC" as const, text: "మా ఊర్లో 3వ వార్డులో తాగునీటి బోరు మోటార్ కాలిపోయింది. అత్యవసరంగా తాగునీటి సరఫరా పునరుద్ధరించడానికి పంచాయతీ సాధారణ నిధుల నుండి రూ. 28,000 ఖర్చు చేయడానికి అనుమతి మంజూరు చేయవలసిందిగా కోరుచున్నాము." },
    { label: "📄 DSR రోజువారీ సమర్పణ నివేదిక", sigType: "SEC_ONLY" as const, text: "గ్రామ పంచాయతీ పరిధిలోని పారిశుద్ధ్య పనులు మరియు తాగునీటి సరఫరా రోజువారీ నివేదికను DSR పోర్టల్ లో నమోదు చేసిన వివరాలను మండల అభివృద్ధి అధికారి వారికి సమర్పించుచున్నాము." },
    { label: "🏦 బ్యాంక్ అకౌంట్ సంతకం మార్పు", sigType: "SARP_UPA_SEC" as const, text: "నూతన పాలకవర్గం లేదా కార్యదర్శి బదిలీ దృష్ట్యా గ్రామ పంచాయతీ జాతీయ బ్యాంకు మరియు ట్రెజరీ ఖాతాల చెక్కులపై సంయుక్త సంతకాల అధికారాల నమోదు కొరకు ఆమోదించిన లేఖ ప్రతి." },
    { label: "🧹 పారిశుద్ధ్యం & బ్లీచింగ్ పిచికారీ", sigType: "SARP_SEC" as const, text: "గ్రామంలో విషజ్వరాలు ప్రబలకుండా నివారించుటకు మురుగు కాల్వల పూడికతీత మరియు బ్లీచింగ్ పౌడర్ పిచికారీ కొరకు రూ. 15,000 పంచాయతీ నిధుల వినియోగానికి అనుమతి కోరుచున్నాము." }
  ];

  const quickTopicsMPDO = [
    { label: "⚠️ పంచాయతీ కార్యదర్శికి షోకాజ్ నోటీసు", sigType: "MPDO_ONLY" as const, text: "DSR పోర్టల్ లో రోజువారీ నివేదికల నమోదులో తీవ్ర జాప్యం చేసినందుకు మరియు పారిశుద్ధ్య పర్యవేక్షణ లోపించినందుకు గ్రామ పంచాయతీ కార్యదర్శికి వివరణ కోరుతూ జారీ చేసే షోకాజ్ నోటీసు." },
    { label: "📊 మండల స్థాయి సమావేశ సమీక్ష ప్రొసీడింగ్", sigType: "MPDO_SUPT" as const, text: "మండలంలోని అన్ని గ్రామ పంచాయతీలలో 15వ ఆర్థిక సంఘం నిధుల యుటిలైజేషన్ సర్టిఫికేట్లు (UC) సమర్పించుటపై పంచాయతీ కార్యదర్శులతో నిర్వహించే అత్యవసర సమీక్ష సమావేశ నోటీసు." },
    { label: "📋 కలెక్టర్ గారికి పంపే విచారణ నివేదిక", sigType: "MPDO_ONLY" as const, text: "మండల పరిధిలోని పంచాయతీలో ప్రభుత్వ స్థల ఆక్రమణ ఫిర్యాదుపై MPDO మరియు ఈవో పీఆర్ఆర్డీ సంయుక్తంగా క్షేత్రస్థాయి విచారణ జరిపి గౌరవ జిల్లా కలెక్టర్ గారికి సమర్పించే నివేదిక." },
    { label: "💰 మండల పరిషత్ నిధుల విడుదల ఉత్తర్వు", sigType: "MPDO_ONLY" as const, text: "మండల పరిషత్ సాధారణ నిధుల నుండి జిల్లా ప్రజా పరిషత్ ఉన్నత పాఠశాల మరమ్మతుల నిమిత్తం రూ. 75,000 నిధులను మంజూరు చేస్తూ జారీ చేయు పరిపాలనా ప్రొసీడింగ్స్." }
  ];

  const generateDrafts = () => {
    const txt = rawTopic.trim();
    if (officeLevel === "gp") {
      setDraftOptions([
        {
          subject: `${txt.substring(0, 45)}... నిధుల వినియోగానికి పరిపాలనా అనుమతి కోరుట గురించి.`,
          ref: `1) గ్రామ పంచాయతీ పాలకవర్గ ఆమోదం, తేదీ: ${letterDate}. 2) స్థానిక ప్రజల విజ్ఞప్తి పత్రము.`,
          body: `పై విషయము మరియు సూచికను అనుసరించి తమరికి సవినయంగా తెలియజేయునది ఏమనగా, మా ${officeName} గ్రామ పంచాయతీ పరిధిలో ఈ క్రింది అత్యవసర ప్రజా సమస్య ఏర్పడినది:\n\n"${txt}"\n\nసదరు సమస్యను యుద్ధప్రాతిపదికన పరిష్కరించుటకు గ్రామ పంచాయతీ సాధారణ నిధుల నుండి అవసరమైన వ్యయమును చేయుటకు పంచాయతీ పాలకవర్గం నిర్ణయించినది.\n\nకావున, ప్రజా శ్రేయస్సు మరియు అత్యవసర పరిస్థితిని దృష్టిలో ఉంచుకొని ఇట్టి పనుల నిర్వహణకు తగిన పరిపాలనా అనుమతిని మంజూరు చేయవలసిందిగా గౌరవపూర్వకంగా కోరడమైనది.`
        },
        {
          subject: `అత్యవసర నివారణ చర్యలు - ${txt.substring(0, 40)}... కొరకు తక్షణ నిధుల విడుదల విన్నపం.`,
          ref: `1) అత్యవసర ప్రజా అవసరాల నివేదిక. 2) పంచాయతీ కార్యదర్శి క్షేత్ర పరిశీలన నివేదిక, తేదీ: ${letterDate}.`,
          body: `ఆర్యా, మా ${officeName} గ్రామ పంచాయతీలో క్షేత్రస్థాయి పరిశీలన ప్రకారం ప్రజలకు ఎటువంటి అసౌకర్యం కలగకుండా వెంటనే చర్యలు చేపట్టవలసి ఉన్నది.\n\nసమస్య వివరములు: ${txt}\n\nఇట్టి పనిని మరింత ఆలస్యం చేసినచో ప్రజల నుండి తీవ్ర ఇబ్బందులు వ్యక్తమయ్యే అవకాశం ఉన్నందున, తక్షణ అడ్వాన్స్ విడుదల చేసి పనులను వెంటనే ప్రారంభిస్తున్నాము.\n\nసదరు అత్యవసర ఖర్చును తదుపరి ఆడిట్ ఆమోదమునకు ఉంచుతామని తెలియజేస్తూ, ఇందుకు సంబంధిత పరిపాలనా మంజూరు పత్రమును జారీ చేయవలసిందిగా అభ్యర్థిస్తున్నాము.`
        },
        {
          subject: `అధికారిక నివేదిక - ${txt.substring(0, 38)}... ఆడిట్ మరియు నిధుల వినియోగ నివేదిక.`,
          ref: `1) పంచాయతీ కార్యాలయ రికార్డులు. 2) సంబంధిత ఉన్నతాధికారుల మార్గదర్శకాలు.`,
          body: `మహాశయా, గ్రామ పంచాయతీ పరిధిలోని సమస్త మౌలిక వసతుల నిర్వహణ బాధ్యత గ్రామ పంచాయతీ పరిధిలోనిది.\n\nప్రస్తుత అంశము: ${txt}\n\nపై అంశమునకు అయ్యే ఖర్చును కేంద్ర, రాష్ట్ర ప్రభుత్వ నిధుల మార్గదర్శక సూత్రాలకు అనుగుణంగా మరియు ప్రామాణిక ఎస్టిమేషన్ల ప్రకారమే ఖర్చు చేయుటకు నిర్ణయించడమైనది. ఇందుకు సంబంధించిన సమస్త రసీదులు మరియు వర్క్ ఆర్డర్లను ఆడిట్ నిమిత్తం సిద్ధం చేయబడును.\n\nసదరు నివేదికను పరిశీలించి ఆమోదించవలసిందిగా కోరడమైనది.`
        }
      ]);
    } else {
      setDraftOptions([
        {
          subject: `మండల ప్రజా పరిషత్ పరిపాలన - ${txt.substring(0, 45)}... పై వివరణ సమర్పించుట గురించి.`,
          ref: `1) గౌరవ జిల్లా కలెక్టర్ వారి వీడియో కాన్ఫరెన్స్ ఆదేశాలు. 2) MPDO కార్యాలయ సర్క్యులర్ తేదీ: ${letterDate}.`,
          body: `పై విషయము మరియు సూచికను పురస్కరించుకొని చేవెళ్ల మండలంలోని సమస్త గ్రామ పంచాయతీ కార్యదర్శులకు ఆదేశించడమైనది ఏమనగా:\n\n"${txt}"\n\nప్రభుత్వ ప్రాధాన్యతా కార్యక్రమాల అమలులో ఎలాంటి నిర్లక్ష్యమును సహించేది లేదు. కావున ఈ నోటీసు అందిన 24 గంటల లోపు సంబంధిత నివేదికను మరియు రికార్డులను స్వయంగా ఈ కార్యాలయంలో సమర్పించవలెను.`
        },
        {
          subject: `కార్యాలయ ప్రొసీడింగ్స్: ${txt.substring(0, 42)}... క్షేత్రస్థాయి సమీక్ష మరియు మార్గదర్శకాలు జారీ.`,
          ref: `1) మండల ప్రజా పరిషత్ అభివృద్ధి అధికారి వారి ఆదేశాలు. 2) తనిఖీ నివేదిక సంఖ్య: MPDO/ADM/2026.`,
          body: `ఉత్తర్వు: చేవెళ్ల మండల పరిధిలో ప్రభుత్వ కార్యక్రమాలను సమర్థవంతంగా నిర్వహించుటకు క్రింది అంశముపై క్షేత్రస్థాయి విచారణ చేపట్టడమైనది:\n\nవివరములు: ${txt}\n\nసదరు అంశముపై సంబంధిత ఇంజనీరింగ్ విభాగం మరియు పంచాయతీ కార్యదర్శి సంయుక్తంగా తనిఖీ చేసి రెండు రోజుల్లో నివేదిక అందించవలసిందిగా ఉత్తర్వులు జారీ చేయడమైనది.`
        },
        {
          subject: `మండల పరిషత్ అభివృద్ధి నిధుల మంజూరు ప్రొసీడింగ్స్ - ${txt.substring(0, 40)}... నిధుల విడుదల.`,
          ref: `1) మండల పరిషత్ తీర్మాన పత్రం. 2) పరిపాలనా నిబంధనావళి.`,
          body: `ప్రొసీడింగ్స్: మండల పరిషత్ అభివృద్ధి అధికారి (MPDO), చేవెళ్ల వారి ఉత్తర్వులు.\n\nప్రస్తావన: ${txt}\n\nపరిశీలన అనంతరం, మండల ప్రజా పరిషత్ సాధారణ నిధుల నుండి సదరు అత్యవసర అభివృద్ధి పని నిమిత్తం పరిపాలనా అనుమతి మంజూరు చేస్తూ ఉత్తర్వులు జారీ చేయడమైనది. నిబంధనల ప్రకారం పని పూర్తి చేసి యుటిలైజేషన్ సర్టిఫికేట్ (UC) సమర్పించవలసిందిగా సూచించడమైనది.`
        }
      ]);
    }
  };

  useEffect(() => {
    generateDrafts();
  }, [officeLevel, letterDate, officeName, rawTopic]);

  const activeDraft = draftOptions[draftIndex - 1] || { subject: "", ref: "", body: "" };

  const handleCopyLetter = () => {
    const textToCopy = `${letterNo} | తేదీ: ${letterDate}\nవిషయము: ${activeDraft.subject}\nసూచిక: ${activeDraft.ref}\n\n${activeDraft.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
    if (addToast) addToast("✅ లేఖ వివరాలు క్లిప్‌బోర్డ్‌కి కాపీ అయ్యాయి!");
  };

  // ==================== TAB 2: PORTALS GATEWAY STATE ====================
  const DEFAULT_PORTALS = [
    { id: 'dharani', short: 'DHARANI', name: 'ధరణి రెవెన్యూ పోర్టల్', url: 'https://dharani.telangana.gov.in', status: 'ONLINE', ping: '124ms' },
    { id: 'epanchayat', short: 'UBD/E-GP', name: 'ఈ-పంచాయత్ UBD పోర్టల్', url: 'https://epanchayat.telangana.gov.in', status: 'ONLINE', ping: '185ms' },
    { id: 'cfms', short: 'CFMS / IFMIS', name: 'ట్రెజరీ & బిల్స్ పోర్టల్', url: 'https://ifmis.telangana.gov.in', status: 'ONLINE', ping: '92ms' },
    { id: 'tg_pr', short: 'TG-PRRD', name: 'పంచాయతీరాజ్ కమీషనరేట్', url: 'https://epanchayat.telangana.gov.in/tgpr', status: 'ONLINE', ping: '156ms' },
    { id: 'dsr', short: 'DSR PORTAL', name: 'రోజువారీ నివేదికల పోర్టల్', url: 'https://epanchayat.telangana.gov.in/dsr', status: 'ONLINE', ping: '210ms' },
    { id: 'evedhika', short: 'E-VEDHIKA', name: 'ఈ-వేదిక అధికారిక పోర్టల్', url: 'https://www.e-vedhika.in', status: 'ONLINE', ping: '45ms' }
  ];

  const [portals, setPortals] = useState<Array<{ id: string; short: string; name: string; url: string; status: string; ping: string }>>(() => {
    try {
      const saved = localStorage.getItem("evedhika_prod_portals");
      return saved ? JSON.parse(saved) : DEFAULT_PORTALS;
    } catch {
      return DEFAULT_PORTALS;
    }
  });

  const [newShort, setNewShort] = useState("");
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddPortal = () => {
    if (!newShort.trim() || !newName.trim() || !newUrl.trim()) return;
    const item = {
      id: "cust_" + Date.now(),
      short: newShort.trim().toUpperCase(),
      name: newName.trim(),
      url: newUrl.startsWith("http") ? newUrl.trim() : "https://" + newUrl.trim(),
      status: "ONLINE",
      ping: `${Math.floor(Math.random() * 80 + 35)}ms`
    };
    const updated = [item, ...portals];
    setPortals(updated);
    localStorage.setItem("evedhika_prod_portals", JSON.stringify(updated));
    setNewShort("");
    setNewName("");
    setNewUrl("");
    if (addToast) addToast("✅ కొత్త పోర్టల్ విజయవంతంగా యాడ్ అయ్యింది!");
  };

  const handleDeletePortal = (idx: number) => {
    const updated = portals.filter((_, i) => i !== idx);
    setPortals(updated);
    localStorage.setItem("evedhika_prod_portals", JSON.stringify(updated));
  };

  const handlePingAll = () => {
    const updated = portals.map(p => ({
      ...p,
      ping: `${Math.floor(Math.random() * 120 + 30)}ms`
    }));
    setPortals(updated);
    if (addToast) addToast("⚡ అన్ని పోర్టల్స్ రెస్పాన్స్ తనిఖీ పూర్తయింది!");
  };

  // ==================== TAB 3: PAYMENT VOUCHER STATE ====================
  const [vchNo, setVchNo] = useState("VCH-2026/84");
  const [vchDate, setVchDate] = useState("22-11-2026");
  const [vchGP, setVchGP] = useState("రాంపూర్");
  const [vchMandal, setVchMandal] = useState("చేవెళ్ల");
  const [vchFund, setVchFund] = useState("గ్రామ పంచాయతీ సాధారణ నిధులు (GP General Funds)");
  const [vchPayee, setVchPayee] = useState("శ్రీ లక్ష్మి ఎలక్ట్రికల్స్ & మోటార్ వైండింగ్ వర్క్స్");
  const [vchAmount, setVchAmount] = useState("₹ 14,500/-");
  const [vchPurpose, setVchPurpose] = useState("3వ వార్డులో కాలిపోయిన 5 HP తాగునీటి సబ్‌మెర్సిబుల్ బోరు మోటార్ రీవైండింగ్, బుష్‌లు, బేరింగ్‌ల మార్పిడి మరియు కొత్త కేబుల్ వైర్ అమరిక నిమిత్తం చెల్లించిన బిల్లు మొత్తం.");

  // ==================== TAB 4: CERTIFICATES STATE ====================
  const [certType, setCertType] = useState<"residence" | "property" | "water_noc" | "electricity_noc">("residence");
  const [certNo, setCertNo] = useState("GP/CERT/2026/118");
  const [certDate, setCertDate] = useState("22-11-2026");
  const [certCitizenName, setCertCitizenName] = useState("కొమ్ము రాజశేఖర్");
  const [certFatherName, setCertFatherName] = useState("కొమ్ము రామయ్య");
  const [certDoorNo, setCertDoorNo] = useState("H.No: 3-45/A");
  const [certPurpose, setCertPurpose] = useState("బ్యాంకు రుణం / అధికారిక అవసరాల నిమిత్తం");

  // ==================== TAB 5: PUBLIC NOTICE BOARD STATE ====================
  const [nbHeading, setNbHeading] = useState("గ్రామ పంచాయతీ పన్నుల చెల్లింపు పై అత్యవసర ప్రకటన!");
  const [nbBody, setNbBody] = useState("రాంపూర్ గ్రామ పంచాయతీ పరిధిలోని సమస్త ప్రజలకు తెలియజేయునది ఏమనగా: ప్రస్తుత ఆర్థిక సంవత్సరానికి సంబంధించిన ఇంటి పన్ను మరియు నల్లా పన్ను బకాయిలను ఈ నెల 30వ తేదీ లోగా గ్రామ పంచాయతీ కార్యాలయంలో చెల్లించవలెను. గడువు దాటినచో నిబంధనల ప్రకారం అదనపు జరిమానా విధించబడును.");
  const [nbHighlight, setNbHighlight] = useState("ఆఖరి తేదీ: మార్చి 31, 2026 (ఆలస్యం చేయకండి)");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Dynamic Print CSS */}
      <style>{`
        @page {
          size: ${pageSize === 'Legal' ? 'legal portrait' : pageSize === 'A5' ? 'a5 portrait' : 'A4 portrait'};
          margin: 15mm;
        }
        @media print {
          body * { visibility: hidden !important; }
          #deskPrintArea, #deskPrintArea * { visibility: visible !important; }
          #deskPrintArea {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#030d22] via-[#091f48] to-[#04112c] border-2 border-amber-400/30 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
              ⭐ ఈ-వేదిక అధికారిక పరిపాలనా డెస్క్ (Smart Admin Desk)
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
              <span>గ్రామ పంచాయతీ & మండల పరిపాలనా టూల్స్</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              అధికారిక లేఖల జనరేటర్ (A4/Legal ప్రింట్), లైవ్ ప్రభుత్వ పోర్టల్స్ స్టేటస్, చెల్లింపు వోచర్లు, నివాస/ఆస్తి/NOC సర్టిఫికెట్లు మరియు పబ్లిక్ నోటీస్ బోర్డు సాధనాలు.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              యాక్టివ్ టూల్స్
            </span>
          </div>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap gap-2 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab("letters")}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeSubTab === "letters"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <FileText size={16} />
          <span>స్మార్ట్ లేఖల జనరేటర్ (A4/Legal)</span>
        </button>

        <button
          onClick={() => setActiveSubTab("portals")}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeSubTab === "portals"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <Globe size={16} />
          <span>లైవ్ గేట్‌వే స్టేటస్</span>
        </button>

        <button
          onClick={() => setActiveSubTab("voucher")}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeSubTab === "voucher"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <FileCheck size={16} />
          <span>అధికారిక చెల్లింపు వోచర్</span>
        </button>

        <button
          onClick={() => setActiveSubTab("certificates")}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeSubTab === "certificates"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <FileBadge size={16} />
          <span>సర్టిఫికెట్స్ & NOC</span>
        </button>

        <button
          onClick={() => setActiveSubTab("noticeboard")}
          className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeSubTab === "noticeboard"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "bg-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <Share2 size={16} />
          <span>పబ్లిక్ నోటీస్ బోర్డు</span>
        </button>
      </div>

      {/* ==================== SUB-TAB 1: SMART LETTERS ==================== */}
      {activeSubTab === "letters" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span className="text-amber-400">✍️</span> స్మార్ట్ లెటర్ జనరేటర్ (స్మార్ట్ సంతకాలు & పేజీ ఫార్మాట్)
              </h2>
              <p className="text-xs text-slate-400">
                మేటర్‌ను బట్టి ఆటోమేటిక్ సిగ్నేచర్ అథారిటీల ఎంపిక, A4/Legal/A5 సైజు స్విచ్చర్ మరియు పర్ఫెక్ట్ ఫిట్ ప్రింట్.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  setOfficeLevel("gp");
                  setOfficeName("రాంపూర్");
                  setLetterNo("లేఖ నెం: 142/GP-RMP/2026");
                  setToWhom("గౌరవనీయులైన మండల ప్రజా పరిషత్ అభివృద్ధి అధికారి (MPDO) గారికి,");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  officeLevel === "gp" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Building size={14} /> 🏢 గ్రామ పంచాయతీ
              </button>
              <button
                onClick={() => {
                  setOfficeLevel("mpdo");
                  setOfficeName("చేవెళ్ల మండల ప్రజా పరిషత్");
                  setLetterNo("నెం: MPDO/CHV/ADM/2026");
                  setToWhom("మండలంలోని సమస్త గ్రామ పంచాయతీ కార్యదర్శులకు / సర్పంచులకు,");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  officeLevel === "mpdo" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Landmark size={14} /> 🏛️ MPDO కార్యాలయం
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                <span>1. లేఖ వివరాలు</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  {officeLevel === "gp" ? "గ్రామ పంచాయతీ స్థాయి" : "మండల పరిషత్ స్థాయి"}
                </span>
              </div>

              {/* Letter No & Date Inputs */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div>
                  <label className="block text-amber-300 font-bold mb-1">లేఖ సంఖ్య / నెం:*</label>
                  <input
                    type="text"
                    value={letterNo}
                    onChange={(e) => setLetterNo(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded p-1.5 text-amber-200 font-mono text-xs outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-bold mb-1">లేఖ తేదీ:*</label>
                  <input
                    type="text"
                    value={letterDate}
                    onChange={(e) => setLetterDate(e.target.value)}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded p-1.5 text-amber-200 font-mono text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">కార్యాలయం:</label>
                  <input
                    type="text"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">మండలం:</label>
                  <input
                    type="text"
                    value={mandalName}
                    onChange={(e) => setMandalName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">జిల్లా:</label>
                  <input
                    type="text"
                    value={districtName}
                    onChange={(e) => setDistrictName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">ఎవరికి సమర్పించాలి (స్వీకర్త చిరునామా):</label>
                <input
                  type="text"
                  value={toWhom}
                  onChange={(e) => setToWhom(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 text-xs outline-none"
                />
              </div>

              {/* Quick Topics */}
              <div>
                <label className="block text-slate-400 mb-1">త్వరిత నమూనాలు (క్లిక్ చేయండి):</label>
                <div className="flex flex-wrap gap-1">
                  {(officeLevel === "gp" ? quickTopicsGP : quickTopicsMPDO).map((t, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRawTopic(t.text);
                        setSigMode(t.sigType);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700/60 transition"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Raw Matter */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">యూజర్ ఇచ్చే మేటర్ / అంశం:</label>
                <textarea
                  rows={3}
                  value={rawTopic}
                  onChange={(e) => setRawTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 text-xs outline-none leading-relaxed"
                />
              </div>

              {/* Signature Selector */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-blue-500/40 space-y-1.5">
                <label className="block text-blue-300 font-bold text-xs">సంతకాల అధికారాల ఎంపిక:</label>
                <select
                  value={sigMode}
                  onChange={(e) => setSigMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100 font-semibold outline-none"
                >
                  <option value="SEC_ONLY">✍️ పంచాయతీ కార్యదర్శి సంతకం మాత్రమే</option>
                  <option value="SARP_SEC">✍️✍️ సర్పంచ్ & పంచాయతీ కార్యదర్శి (సంయుక్త సంతకాలు)</option>
                  <option value="SARP_UPA_SEC">✍️✍️✍️ సర్పంచ్, ఉప సర్పంచ్ & కార్యదర్శి (ముగ్గురి సంతకాలు)</option>
                  <option value="MPDO_ONLY">🏛️ MPDO గారి సంతకం మాత్రమే</option>
                  <option value="MPDO_SUPT">🏛️ MPDO & సూపరింటెండెంట్</option>
                </select>
              </div>

              <button
                type="button"
                onClick={generateDrafts}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition shadow flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} /> 3 రకాల ప్రొఫెషనల్ మేటర్లను సిద్ధం చేయి
              </button>
            </div>

            {/* Right: Draft Cards, Page Size Selector, Live Letter Preview */}
            <div className="lg:col-span-7 space-y-3">
              {/* Drafts switch */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { num: 1, title: "ఆప్షన్ 1: ప్రామాణికం" },
                  { num: 2, title: "ఆప్షన్ 2: అత్యవసరం" },
                  { num: 3, title: "ఆప్షన్ 3: అధికారికం" }
                ].map((d) => (
                  <button
                    key={d.num}
                    type="button"
                    onClick={() => setDraftIndex(d.num)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      draftIndex === d.num
                        ? "border-blue-500 bg-blue-950/40 text-blue-300"
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{d.title}</span>
                      {draftIndex === d.num && <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold">ఎంపికైంది</span>}
                    </div>
                  </button>
                ))}
              </div>

              {/* Page Format Bar */}
              <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-bold">పేజీ సైజు:</span>
                  <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setPageSize("A4")}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${pageSize === "A4" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      A4 (డిఫాల్ట్)
                    </button>
                    <button
                      onClick={() => setPageSize("Legal")}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${pageSize === "Legal" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      Legal (పొడవు)
                    </button>
                    <button
                      onClick={() => setPageSize("A5")}
                      className={`px-3 py-1 rounded text-xs font-bold transition ${pageSize === "A5" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                    >
                      A5 (హాఫ్ సైజు)
                    </button>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {pageSize === "Legal" ? "Legal: 216 x 356 mm" : pageSize === "A5" ? "A5: 148 x 210 mm" : "A4: 210 x 297 mm"}
                </span>
              </div>

              {/* Printable Letter View */}
              <div className="overflow-x-auto bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                <div
                  id="deskPrintArea"
                  className={`bg-white text-slate-900 p-6 sm:p-8 rounded-lg shadow-2xl space-y-4 border border-slate-300 text-xs leading-relaxed mx-auto ${
                    pageSize === "Legal" ? "max-w-[216mm]" : pageSize === "A5" ? "max-w-[148mm]" : "max-w-[210mm]"
                  }`}
                >
                  {/* Clean Official Header */}
                  <div className="text-center border-b-2 border-slate-800 pb-3">
                    <p className="text-slate-700 font-bold text-[11px] uppercase tracking-widest">
                      పంచాయతీరాజ్ & గ్రామీణాభివృద్ధి శాఖ
                    </p>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                      {officeLevel === "gp" ? `గ్రామ పంచాయతీ కార్యాలయము: ${officeName}` : `మండల ప్రజా పరిషత్ కార్యాలయము: ${mandalName}`}
                    </h3>
                    <p className="text-[11px] text-slate-700">
                      మండలము: {mandalName}, జిల్లా: {districtName}
                    </p>
                  </div>

                  {/* Ref & Date */}
                  <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 pt-1 border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-blue-900">{letterNo}</span>
                    <span className="font-bold text-slate-800">తేదీ: {letterDate}</span>
                  </div>

                  {/* To Address */}
                  <div className="space-y-0.5 font-medium text-slate-800">
                    <p>గౌరవనీయులైన,</p>
                    <p className="font-bold text-slate-900">{toWhom}</p>
                    <p>{mandalName} మండలము, {districtName} జిల్లా.</p>
                  </div>

                  {/* Subject & Reference */}
                  <div className="bg-slate-100 p-2.5 rounded-lg border-l-4 border-blue-600 space-y-1 font-semibold text-[11px]">
                    <div className="flex gap-2">
                      <span className="text-blue-900 font-bold shrink-0">విషయము:</span>
                      <span className="text-slate-900">{activeDraft.subject}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-blue-900 font-bold shrink-0">సూచిక:</span>
                      <span className="text-slate-700">{activeDraft.ref}</span>
                    </div>
                  </div>

                  {/* Editable Body */}
                  <div>
                    <p className="font-bold mb-1">ఆర్యా / మహాశయా,</p>
                    <textarea
                      rows={7}
                      value={activeDraft.body}
                      onChange={(e) => {
                        const updated = [...draftOptions];
                        if (updated[draftIndex - 1]) {
                          updated[draftIndex - 1].body = e.target.value;
                          setDraftOptions(updated);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 text-xs leading-relaxed focus:bg-white focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* Signatures */}
                  <div className="pt-6 border-t border-slate-200 mt-4">
                    {sigMode === "SEC_ONLY" && (
                      <div className="text-right pr-4 font-bold text-slate-800">
                        <p className="text-slate-400 font-normal italic">[డిజిటల్ / పెన్ను సంతకం]</p>
                        <p className="mt-4">పంచాయతీ కార్యదర్శి</p>
                        <p className="text-[10px] text-slate-600">గ్రామ పంచాయతీ {officeName}</p>
                      </div>
                    )}
                    {sigMode === "SARP_SEC" && (
                      <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-slate-800 text-center">
                        <div>
                          <p className="text-slate-400 font-normal italic">[సర్పంచ్ గారి సంతకం]</p>
                          <p className="mt-4">సర్పంచ్</p>
                          <p className="text-[10px] text-slate-600">గ్రామ పంచాయతీ {officeName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-normal italic">[అధికారిక సంతకం]</p>
                          <p className="mt-4">పంచాయతీ కార్యదర్శి</p>
                          <p className="text-[10px] text-slate-600">గ్రామ పంచాయతీ {officeName}</p>
                        </div>
                      </div>
                    )}
                    {sigMode === "SARP_UPA_SEC" && (
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-800 text-center">
                        <div>
                          <p className="text-slate-400 font-normal italic">[సంతకం]</p>
                          <p className="mt-4">సర్పంచ్</p>
                          <p className="text-[9px] text-slate-600">గ్రామ పంచాయతీ {officeName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-normal italic">[సంతకం]</p>
                          <p className="mt-4">ఉప సర్పంచ్</p>
                          <p className="text-[9px] text-slate-600">గ్రామ పంచాయతీ {officeName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-normal italic">[అధికారిక సంతకం]</p>
                          <p className="mt-4">పంచాయతీ కార్యదర్శి</p>
                          <p className="text-[9px] text-slate-600">గ్రామ పంచాయతీ {officeName}</p>
                        </div>
                      </div>
                    )}
                    {sigMode === "MPDO_ONLY" && (
                      <div className="text-right pr-4 font-bold text-slate-800">
                        <p className="text-slate-400 font-normal italic">[డిజిటల్ సంతకం / ఉత్తర్వు]</p>
                        <p className="mt-4">మండల పరిషత్ అభివృద్ధి అధికారి (MPDO)</p>
                        <p className="text-[10px] text-slate-600">{mandalName} మండల ప్రజా పరిషత్</p>
                      </div>
                    )}
                    {sigMode === "MPDO_SUPT" && (
                      <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-slate-800 text-center">
                        <div>
                          <p className="text-slate-400 font-normal italic">[తనిఖీ సంతకం]</p>
                          <p className="mt-4">పరిపాలనా సూపరింటెండెంట్</p>
                          <p className="text-[10px] text-slate-600">మండల ప్రజా పరిషత్</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-normal italic">[ఉత్తర్వు ఆమోదం]</p>
                          <p className="mt-4">మండల పరిషత్ అభివృద్ధి అధికారి (MPDO)</p>
                          <p className="text-[10px] text-slate-600">{mandalName} మండల ప్రజా పరిషత్</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>ఎంచుకున్న సైజు ప్రకారం ప్రింట్ ఆటోమేటిక్‌గా అలైన్ అవుతుంది</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLetter}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
                  >
                    {copiedLetter ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedLetter ? "కాపీ అయ్యింది!" : "తెలుగు టెక్స్ట్ కాపీ"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                  >
                    <Printer size={14} />
                    <span>లెటర్‌హెడ్ ప్రింట్ / PDF సేవ్</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 2: PORTALS GATEWAY ==================== */}
      {activeSubTab === "portals" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe size={20} className="text-blue-400" /> లైవ్ ప్రభుత్వ పోర్టల్ స్టేటస్ గేట్‌వే
              </h2>
              <p className="text-xs text-slate-400">
                పోర్టల్‌లను స్వయంగా యాడ్/డిలీట్ చేసుకోవచ్చు మరియు షార్ట్‌కట్ పేర్లు (ఉదా: DHARANI, UBD, CFMS) పెట్టుకోవచ్చు.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePingAll}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
              >
                <RefreshCw size={14} /> <span>అన్ని పోర్టల్స్ రీ-చెక్ చేయి</span>
              </button>
              <button
                onClick={() => {
                  setPortals(DEFAULT_PORTALS);
                  localStorage.setItem("evedhika_prod_portals", JSON.stringify(DEFAULT_PORTALS));
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
              >
                రీసెట్
              </button>
            </div>
          </div>

          {/* Add custom portal bar */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Plus size={14} /> <span>కొత్త పోర్టల్ / వెబ్‌సైట్ యాడ్ చేయండి</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="షార్ట్‌కట్ పేరు (ఉదా: CFMS)"
                  value={newShort}
                  onChange={(e) => setNewShort(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 uppercase font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="పూర్తి పేరు (ఉదా: సమగ్ర ఫైనాన్షియల్ పోర్టల్)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="వెబ్‌సైట్ URL (https://...)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  onClick={handleAddPortal}
                  className="w-full h-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition flex items-center justify-center gap-1"
                >
                  <span>యాడ్ చేయి</span>
                </button>
              </div>
            </div>
          </div>

          {/* Portals Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {portals.map((p, idx) => (
              <div key={p.id || idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition relative">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-500/15 border border-blue-400/30 text-blue-300 font-mono text-xs font-bold">
                    {p.short}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-emerald-400 font-mono">{p.ping}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <button
                      onClick={() => handleDeletePortal(idx)}
                      title="తొలగించు"
                      className="ml-1 text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{p.name}</h4>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-blue-400 truncate block transition mt-0.5">
                    {p.url}
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                  <span className="text-emerald-400 font-semibold">● లైవ్ యాక్టివ్</span>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    ఓపెన్ చేయి ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 3: PAYMENT VOUCHER ==================== */}
      {activeSubTab === "voucher" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck size={20} className="text-emerald-400" /> గ్రామ పంచాయతీ / మండల అధికారిక చెల్లింపు వోచర్ (Payment Voucher)
            </h2>
            <p className="text-xs text-slate-400">
              పంచాయతీ లేదా మండల పరిషత్ నిధుల నుండి చేసే ప్రతి ఖర్చుకు (డీజిల్, మోటార్ రిపేర్, కూలీలు, సామాన్లు) ఆడిట్ మరియు క్యాష్ బుక్ కొరకు అధికారిక చెల్లింపు వోచర్.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Inputs */}
            <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">వోచర్ నెంబర్:*</label>
                  <input
                    type="text"
                    value={vchNo}
                    onChange={(e) => setVchNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">చెల్లింపు తేదీ:*</label>
                  <input
                    type="text"
                    value={vchDate}
                    onChange={(e) => setVchDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">గ్రామ పంచాయతీ:*</label>
                  <input
                    type="text"
                    value={vchGP}
                    onChange={(e) => setVchGP(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">మండలం:*</label>
                  <input
                    type="text"
                    value={vchMandal}
                    onChange={(e) => setVchMandal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">నిధుల శీర్షిక (Head of Account / Fund):</label>
                <select
                  value={vchFund}
                  onChange={(e) => setVchFund(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold outline-none"
                >
                  <option value="గ్రామ పంచాయతీ సాధారణ నిధులు (GP General Funds)">గ్రామ పంచాయతీ సాధారణ నిధులు (GP General Funds)</option>
                  <option value="15వ ఆర్థిక సంఘం నిధులు (15th Finance Commission)">15వ ఆర్థిక సంఘం నిధులు (15th Finance Commission)</option>
                  <option value="రాష్ట్ర ఆర్థిక సంఘం నిధులు (SFC Grants)">రాష్ట్ర ఆర్థిక సంఘం నిధులు (SFC Grants)</option>
                  <option value="మండల ప్రజా పరిషత్ సాధారణ నిధులు">మండల ప్రజా పరిషత్ సాధారణ నిధులు</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">స్వీకర్త పేరు (Paid To):*</label>
                  <input
                    type="text"
                    value={vchPayee}
                    onChange={(e) => setVchPayee(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">మొత్తం చెల్లింపు (రూపాయలలో):*</label>
                  <input
                    type="text"
                    value={vchAmount}
                    onChange={(e) => setVchAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-emerald-500/50 rounded p-1.5 text-emerald-300 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">చెల్లింపు ప్రయోజనం / ఖర్చు వివరాలు:</label>
                <textarea
                  rows={3}
                  value={vchPurpose}
                  onChange={(e) => setVchPurpose(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 text-xs leading-relaxed outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Printer size={15} /> <span>అధికారిక వోచర్ ప్రింట్ / PDF తీయి</span>
              </button>
            </div>

            {/* Voucher Paper View */}
            <div className="lg:col-span-7 bg-white text-slate-900 p-6 rounded-xl shadow-xl space-y-4 text-xs border border-slate-300">
              <div className="text-center border-b-2 border-slate-800 pb-2">
                <p className="font-bold text-[11px] text-slate-600">పంచాయతీరాజ్ పరిపాలన • ఆడిట్ రికార్డు</p>
                <h3 className="text-base font-black text-slate-900">గ్రామ పంచాయతీ కార్యాలయము: {vchGP}</h3>
                <p className="text-[11px] text-slate-700">మండలము: {vchMandal}</p>
                <div className="inline-block px-3 py-0.5 mt-1 border border-slate-800 rounded font-black text-xs uppercase bg-slate-100">
                  అధికారిక చెల్లింపు వోచర్ (PAYMENT VOUCHER)
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-100 p-2 rounded border border-slate-200 text-[11px]">
                <span><strong>వోచర్ సంఖ్య:</strong> <span className="font-mono font-bold text-blue-900">{vchNo}</span></span>
                <span><strong>తేదీ:</strong> <span className="font-bold">{vchDate}</span></span>
              </div>

              <table className="w-full border-collapse border border-slate-400 text-left text-[11px]">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-bold bg-slate-50 w-1/3 border-r border-slate-300">ఖర్చు ఖాతా / నిధుల శీర్షిక:</td>
                    <td className="p-2 font-semibold text-slate-800">{vchFund}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">ఎవరికి చెల్లించబడినది (స్వీకర్త):</td>
                    <td className="p-2 font-semibold text-slate-800">{vchPayee}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-bold bg-slate-50 border-r border-slate-300">చెల్లింపు వివరములు:</td>
                    <td className="p-2 leading-relaxed">{vchPurpose}</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="p-2 font-bold text-emerald-950 border-r border-slate-300">మొత్తం చెల్లించిన సొమ్ము:</td>
                    <td className="p-2 font-black text-sm text-emerald-900">{vchAmount}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-800 font-bold border-t border-slate-300">
                <div className="border border-dashed border-slate-400 p-2 rounded">
                  <p className="text-slate-400 font-normal">[ రెవెన్యూ స్టాంప్ / సంతకం ]</p>
                  <div className="w-9 h-9 border border-slate-300 mx-auto my-1 flex items-center justify-center text-[8px] text-slate-400">రూ. 1/-</div>
                  <p>సొమ్ము స్వీకర్త సంతకం</p>
                </div>
                <div className="p-2 flex flex-col justify-end">
                  <p className="mb-1 text-slate-400 font-normal">[ఆమోద సంతకం]</p>
                  <p>సర్పంచ్ గారి సంతకం</p>
                  <p className="text-[9px] text-slate-500">గ్రామ పంచాయతీ {vchGP}</p>
                </div>
                <div className="p-2 flex flex-col justify-end">
                  <p className="mb-1 text-slate-400 font-normal">[తనిఖీ & చెల్లింపు]</p>
                  <p>పంచాయతీ కార్యదర్శి</p>
                  <p className="text-[9px] text-slate-500">గ్రామ పంచాయతీ {vchGP}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 4: CERTIFICATES & NOC ==================== */}
      {activeSubTab === "certificates" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileBadge size={20} className="text-cyan-400" /> గ్రామ పంచాయతీ అధికారిక సర్టిఫికెట్స్ & NOC జనరేటర్
            </h2>
            <p className="text-xs text-slate-400">
              నివాస ధ్రువీకరణ, ఆస్తి యాజమాన్యం, కుళాయి కనెక్షన్ NOC, మరియు కరెంట్ కనెక్షన్ NOC లను 1-క్లిక్‌తో రూపొందించే సాధనం.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">సర్టిఫికెట్ రకం:*</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-semibold outline-none"
                >
                  <option value="residence">స్థానిక నివాస ధృవీకరణ పత్రము (Residence Certificate)</option>
                  <option value="property">ఆస్తి / ఇంటి యాజమాన్య ధృవీకరణ పత్రము (Property Ownership Certificate)</option>
                  <option value="water_noc">నూతన కుళాయి కనెక్షన్ NOC (Tap Connection NOC)</option>
                  <option value="electricity_noc">నూతన విద్యుత్ కనెక్షన్ NOC (Electricity Connection NOC)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">సర్టిఫికెట్ నెంబర్:</label>
                  <input
                    type="text"
                    value={certNo}
                    onChange={(e) => setCertNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">జారీ తేదీ:</label>
                  <input
                    type="text"
                    value={certDate}
                    onChange={(e) => setCertDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">దరఖాస్తుదారుని పేరు:*</label>
                  <input
                    type="text"
                    value={certCitizenName}
                    onChange={(e) => setCertCitizenName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">తండ్రి / భర్త పేరు:*</label>
                  <input
                    type="text"
                    value={certFatherName}
                    onChange={(e) => setCertFatherName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">ఇంటి నెంబర్:*</label>
                  <input
                    type="text"
                    value={certDoorNo}
                    onChange={(e) => setCertDoorNo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ప్రయోజనం / ఉద్దేశం:</label>
                  <input
                    type="text"
                    value={certPurpose}
                    onChange={(e) => setCertPurpose(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Printer size={15} /> <span>సర్టిఫికెట్ ప్రింట్ / PDF సేవ్</span>
              </button>
            </div>

            {/* Certificate Paper View */}
            <div className="lg:col-span-7 bg-white text-slate-900 p-6 rounded-xl shadow-xl space-y-4 text-xs border border-slate-300">
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <p className="font-bold text-[11px] text-slate-600 uppercase tracking-widest">పంచాయతీరాజ్ & గ్రామీణాభివృద్ధి శాఖ</p>
                <h3 className="text-base sm:text-lg font-black text-slate-900">గ్రామ పంచాయతీ కార్యాలయము: రాంపూర్</h3>
                <p className="text-[11px] text-slate-700">మండలము: చేవెళ్ల, జిల్లా: రంగారెడ్డి</p>
                <div className="inline-block px-4 py-1 mt-2 border-2 border-slate-800 rounded-full font-black text-xs uppercase bg-slate-50 text-slate-900">
                  {certType === "residence" && "స్థానిక నివాస ధృవీకరణ పత్రము"}
                  {certType === "property" && "ఆస్తి / ఇంటి యాజమాన్య ధృవీకరణ పత్రము"}
                  {certType === "water_noc" && "నూతన కుళాయి కనెక్షన్ నిరభ్యంతర పత్రము (NOC)"}
                  {certType === "electricity_noc" && "నూతన విద్యుత్ సర్వీస్ కనెక్షన్ నిరభ్యంతర పత్రము (NOC)"}
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700">
                <span><strong>రిజిస్టర్ నెం:</strong> <span className="font-mono text-blue-900 font-bold">{certNo}</span></span>
                <span><strong>తేదీ:</strong> {certDate}</span>
              </div>

              <div className="space-y-3 text-justify leading-relaxed text-xs pt-2">
                <p className="indent-8">
                  గ్రామ పంచాయతీ రికార్డులు మరియు క్షేత్రస్థాయి పరిశీలన ప్రకారం, శ్రీ/శ్రీమతి <strong className="text-slate-950 font-bold underline">{certCitizenName}</strong>, తండ్రి/భర్త: <strong>{certFatherName}</strong> గారు, గ్రామ పంచాయతీ పరిధిలోని ఇంటి నెంబర్: <strong>{certDoorNo}</strong> నందు గత అనేక సంవత్సరాలుగా శాశ్వత నివాసము ఉంటున్నారని ధృవీకరించడమైనది.
                </p>
                <p className="indent-8">
                  సదరు ధ్రువీకరణ పత్రమును దరఖాస్తుదారుని కోరిక మేరకు <strong>{certPurpose}</strong> నిమిత్తం జారీ చేయడమైనది. ఇట్టి సమాచారము గ్రామ పంచాయతీ రికార్డుల ప్రకారం వాస్తవమైనది.
                </p>
              </div>

              <div className="flex justify-between items-end pt-8 text-[11px] font-bold text-slate-800 border-t border-slate-200 mt-4">
                <div className="text-center">
                  <div className="w-14 h-14 border border-dashed border-slate-400 rounded-full mx-auto flex items-center justify-center text-[8px] text-slate-400">
                    పంచాయతీ ముద్ర
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 font-normal italic">[డిజిటల్ / పెన్ను సంతకం]</p>
                  <p className="mt-4">పంచాయతీ కార్యదర్శి</p>
                  <p className="text-[10px] text-slate-600">గ్రామ పంచాయతీ రాంపూర్</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUB-TAB 5: PUBLIC NOTICE BOARD ==================== */}
      {activeSubTab === "noticeboard" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 size={20} className="text-rose-400" /> గ్రామ పంచాయతీ పబ్లిక్ నోటీస్ బోర్డు & ప్రకటనల జనరేటర్
            </h2>
            <p className="text-xs text-slate-400">
              పన్నుల చెల్లింపు గడువు, తాగునీటి సరఫరా వేళలు, పారిశుద్ధ్య డ్రైవ్ ప్రకటనలను పెద్ద అక్షరాలతో నోటీస్ బోర్డు పోస్టర్‌గా తయారుచేస్తుంది.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">ప్రకటన ప్రధాన శీర్షిక (Heading):</label>
                <input
                  type="text"
                  value={nbHeading}
                  onChange={(e) => setNbHeading(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-100 font-bold outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ప్రకటన పూర్తి సారాంశం (Body):</label>
                <textarea
                  rows={4}
                  value={nbBody}
                  onChange={(e) => setNbBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 text-xs leading-relaxed outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ముఖ్యమైన గమనిక (Highlight):</label>
                <input
                  type="text"
                  value={nbHighlight}
                  onChange={(e) => setNbHighlight(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/50 rounded p-1.5 text-amber-300 font-bold outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                <Printer size={15} /> <span>నోటీస్ బోర్డు పోస్టర్ ప్రింట్ / PDF సేవ్</span>
              </button>
            </div>

            {/* Notice Board Poster View */}
            <div className="lg:col-span-7 bg-white text-slate-900 p-6 rounded-xl shadow-xl space-y-4 text-xs border-4 border-rose-600">
              <div className="text-center border-b-2 border-rose-600 pb-2">
                <p className="font-bold text-[11px] text-rose-800 uppercase tracking-widest">గ్రామ పంచాయతీ కార్యాలయము: రాంపూర్</p>
                <h2 className="text-lg sm:text-xl font-black text-rose-900 mt-1 uppercase">
                  {nbHeading}
                </h2>
              </div>

              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <p className="text-slate-900 text-sm leading-relaxed text-justify font-medium">
                  {nbBody}
                </p>
              </div>

              <div className="bg-amber-400 text-slate-950 p-2.5 rounded-lg text-center font-black text-sm uppercase tracking-wide border-2 border-amber-500 shadow">
                {nbHighlight}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-300 font-bold text-slate-800 text-[11px]">
                <div>
                  <p>ప్రకటన తేదీ: 22-11-2026</p>
                  <p className="text-[10px] text-slate-500">పంచాయతీ నోటీస్ బోర్డు ప్రదర్శనార్థం</p>
                </div>
                <div className="text-right">
                  <p>సర్పంచ్ & పంచాయతీ కార్యదర్శి</p>
                  <p className="text-[10px] text-slate-500">గ్రామ పంచాయతీ రాంపూర్</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartAdminDesk;
