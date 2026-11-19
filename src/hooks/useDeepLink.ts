import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export interface ParsedUrlTabData {
  mainTab: string;
  workspaceTool: string | null;
  adminSubTab: string;
  gosSubTab: "Application" | "GO";
  suggestionsSubTab: "problems" | "suggestions";
}

export function parseTabFromUrl(params: URLSearchParams, pathname: string): ParsedUrlTabData {
  let rawParam = params.get("tab") || "";
  let subParam = params.get("sub") || params.get("subtab") || params.get("tool") || "";

  // If query param 'tab' is missing, check pathname (e.g. /workspace/multiday)
  if (!rawParam) {
    const cleanPath = decodeURIComponent(pathname || "").replace(/^\/+|\/+$/g, "");
    if (cleanPath) {
      rawParam = cleanPath;
    }
  }

  let mainTab = rawParam;
  let subToolFromUrl = subParam;

  if (rawParam.includes("/")) {
    const parts = rawParam.split("/");
    mainTab = parts[0];
    if (parts[1]) {
      subToolFromUrl = parts[1];
    }
  }

  if (mainTab === "reports") mainTab = "my_activity";
  if (mainTab === "problems") mainTab = "ubd_tracker";
  if (mainTab === "directlinks") mainTab = "ubd_tracker";

  const normMain = (mainTab || "").toLowerCase().replace(/[-_ ]/g, "");
  if (
    normMain === "evedhika" ||
    normMain === "evdka" ||
    normMain === "adminpanel" ||
    normMain === "sysadmin" ||
    normMain === "admin"
  ) {
    mainTab = "admin";
  } else if (normMain === "farmerregistry" || normMain === "farmer_registry" || normMain === "farmer-registry") {
    mainTab = "farmer_registry";
  } else if (normMain === "excelprint" || normMain === "excel_print") {
    mainTab = "excel_print";
  } else if (normMain === "pdfcompress" || normMain === "pdf_compress") {
    mainTab = "pdf_compress";
  } else if (normMain === "gpdpsetup" || normMain === "gpdp_setup") {
    mainTab = "gpdp_setup";
  } else if (normMain === "ubdtracker" || normMain === "ubd_tracker" || normMain === "ubd") {
    mainTab = "ubd_tracker";
  } else if (normMain === "softwarehub" || normMain === "software_hub" || normMain === "software") {
    mainTab = "software_hub";
  } else if (normMain === "usefullinks" || normMain === "useful_links") {
    mainTab = "useful_links";
  }

  let workspaceTool: string | null = null;
  if (mainTab === "workspace") {
    if (subToolFromUrl) {
      const norm = subToolFromUrl.toLowerCase().replace(/[-_ ]/g, "");
      if (norm === "dsr" || norm === "dsranalyzer") workspaceTool = "dsr";
      else if (
        norm === "multiday" ||
        norm === "multidayattendance" ||
        norm === "multipleattendance" ||
        norm === "multipleattandance" ||
        norm === "attendance"
      )
        workspaceTool = "multiday";
      else if (norm === "training" || norm === "digitaltraining") workspaceTool = "training";
      else if (norm === "pract" || norm === "knowledgehub" || norm === "practguide") workspaceTool = "pract";
      else if (norm === "monthlyactivity" || norm === "monthlyactivitydata" || norm === "mas" || norm === "mandalmonthlyactivity" || norm === "districtmonthlyactivity") workspaceTool = "MAS";
      else if (
        norm === "excelmerge" ||
        norm === "excelmerger" ||
        norm === "excelfilemerger" ||
        norm === "excel"
      )
        workspaceTool = "excel-merge";
      else if (norm === "gpdpplanning" || norm === "gpdp") workspaceTool = "gpdp-planning";
      else if (norm === "unsupportedexcel" || norm === "unsupportedexcelviewer" || norm === "htmlxls") workspaceTool = "unsupported-excel";
      else if (norm === "dcbreports" || norm === "dcb" || norm === "dcbanalyzer") workspaceTool = "dcb-reports";
      else if (norm === "excelstudio" || norm === "excelfilemanager" || norm === "excelcompare") workspaceTool = "excel-studio";
      else if (norm === "epanchayattutorials" || norm === "epanchayat" || norm === "citizenservices") workspaceTool = "epanchayat-tutorials";
      else if (norm === "gallery" || norm === "mediacenter") workspaceTool = "gallery";
      else workspaceTool = subToolFromUrl === "monthly-activity" ? "MAS" : subToolFromUrl;
    } else {
      workspaceTool = null;
    }
  }

  let adminSubTab = "dash";
  if (mainTab === "admin") {
    if (subToolFromUrl) {
      adminSubTab = subToolFromUrl;
    }
  }

  let gosSubTab: "Application" | "GO" = "Application";
  if (mainTab === "gos_formats") {
    if (subToolFromUrl) {
      const norm = subToolFromUrl.toLowerCase();
      if (norm === "go" || norm === "gos") gosSubTab = "GO";
      else if (norm.includes("app") || norm.includes("format")) gosSubTab = "Application";
    }
  }

  let suggestionsSubTab: "problems" | "suggestions" = "problems";
  if (mainTab === "suggestions") {
    if (subToolFromUrl) {
      const norm = subToolFromUrl.toLowerCase();
      if (norm === "problems" || norm === "problem" || norm === "issue") suggestionsSubTab = "problems";
      else if (norm === "suggestions" || norm === "suggestion" || norm === "feedback")
        suggestionsSubTab = "suggestions";
    }
  }

  if (mainTab === "priority_services") {
    if (subToolFromUrl === "emergency") mainTab = "emergency";
    else if (subToolFromUrl === "my_activity") mainTab = "my_activity";
    else mainTab = "emergency";
  }

  return {
    mainTab: mainTab || "home",
    workspaceTool,
    adminSubTab,
    gosSubTab,
    suggestionsSubTab,
  };
}

interface UseDeepLinkOptions {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  workspaceActiveTool: string | null;
  setWorkspaceActiveTool: (tool: string | null) => void;
  gosActiveSubTab: "Application" | "GO";
  setGosActiveSubTab: (sub: "Application" | "GO") => void;
  suggestionsActiveSubTab: "problems" | "suggestions";
  setSuggestionsActiveSubTab: (sub: "problems" | "suggestions") => void;
  activeAdminSubTab: string;
  setActiveAdminSubTab: (sub: string) => void;
}

export function useDeepLink({
  currentTab,
  setCurrentTab,
  workspaceActiveTool,
  setWorkspaceActiveTool,
  gosActiveSubTab,
  setGosActiveSubTab,
  suggestionsActiveSubTab,
  setSuggestionsActiveSubTab,
  activeAdminSubTab,
  setActiveAdminSubTab,
}: UseDeepLinkOptions) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isInternalUrlUpdateRef = useRef(false);

  // 1. Sync React State from incoming URL changes (direct navigation, browser back/forward)
  useEffect(() => {
    if (isInternalUrlUpdateRef.current) {
      isInternalUrlUpdateRef.current = false;
      return;
    }

    const path = location.pathname.toLowerCase();
    const isFarmerRegistry =
      path.endsWith("/farmer_registry") || path.endsWith("/farmer-registry");

    if (isFarmerRegistry) {
      if (currentTab !== "farmer_registry") {
        setCurrentTab("farmer_registry");
      }
      return;
    }

    const parsed = parseTabFromUrl(searchParams, location.pathname);

    if (parsed.mainTab && parsed.mainTab !== currentTab) {
      setCurrentTab(parsed.mainTab);
    }

    if (parsed.mainTab === "workspace") {
      if (parsed.workspaceTool && parsed.workspaceTool !== workspaceActiveTool) {
        setWorkspaceActiveTool(parsed.workspaceTool);
      }
    }

    if (parsed.mainTab === "admin") {
      if (parsed.adminSubTab && parsed.adminSubTab !== activeAdminSubTab) {
        setActiveAdminSubTab(parsed.adminSubTab);
      }
    }

    if (parsed.mainTab === "gos_formats") {
      if (parsed.gosSubTab && parsed.gosSubTab !== gosActiveSubTab) {
        setGosActiveSubTab(parsed.gosSubTab);
      }
    }

    if (parsed.mainTab === "suggestions") {
      if (parsed.suggestionsSubTab && parsed.suggestionsSubTab !== suggestionsActiveSubTab) {
        setSuggestionsActiveSubTab(parsed.suggestionsSubTab);
      }
    }
  }, [searchParams, location.pathname]);

  // 2. Sync URL path (e.g. /workspace/multiday) from state for Public users cleanly without ?tab=
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const isFarmerRegistry =
      path.endsWith("/farmer_registry") || path.endsWith("/farmer-registry");
    if (isFarmerRegistry) return;

    let targetPath = "/" + currentTab;
    const isPostDetailPath = location.pathname.startsWith("/home/post/") || location.pathname.startsWith("/post/");

    if (isPostDetailPath) {
      // If we are on a post detail path, don't force a redirect to the main tab path
      // but still clear any legacy ?tab= query if it exists
      targetPath = location.pathname;
    } else if (currentTab === "home") {
      targetPath = "/";
    } else if (currentTab === "admin") {
      targetPath = activeAdminSubTab && activeAdminSubTab !== "dash" ? `/admin/${activeAdminSubTab}` : "/admin";
    } else if (currentTab === "workspace" && workspaceActiveTool) {
      targetPath = `/workspace/${workspaceActiveTool}`;
    } else if (currentTab === "gos_formats" && gosActiveSubTab) {
      targetPath = `/gos_formats/${gosActiveSubTab}`;
    } else if (currentTab === "suggestions" && suggestionsActiveSubTab) {
      targetPath = `/suggestions/${suggestionsActiveSubTab}`;
    } else if (currentTab === "emergency") {
      targetPath = "/priority_services/emergency";
    } else if (currentTab === "my_activity") {
      targetPath = "/priority_services/my_activity";
    }

    const currentCleanPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
    const targetCleanPath = targetPath === "/" ? "/" : targetPath.replace(/\/+$/, "");
    const hasTabQuery = searchParams.has("tab");

    if (currentCleanPath !== targetCleanPath || hasTabQuery) {
      isInternalUrlUpdateRef.current = true;
      // Navigate to clean path while preserving active search params (e.g. postId) without ?tab= query param
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("tab");
      const searchStr = newParams.toString();
      const finalUrl = targetPath + (searchStr ? `?${searchStr}` : "");
      navigate(finalUrl, { replace: true });
    }
  }, [
    currentTab,
    activeAdminSubTab,
    workspaceActiveTool,
    gosActiveSubTab,
    suggestionsActiveSubTab,
    location.pathname,
    searchParams,
    navigate,
  ]);

  // 3. Dynamic Per-Route SEO & Public vs. Private Robots Meta Synchronization
  useEffect(() => {
    if (typeof document === "undefined") return;
    const rawPath = (location.pathname || "/").replace(/\/+$/, "") || "/";
    const lowerPath = rawPath.toLowerCase();

    // Do not overwrite post-specific SEO when viewing an individual post
    if (lowerPath.startsWith("/home/post/") || lowerPath.startsWith("/post/")) {
      return;
    }

    const privateRoutes = [
      "/admin",
      "/evdka",
      "/my_activity",
      "/priority_services/my_activity",
      "/chat",
      "/logs",
      "/union",
      "/workspace/ticket-tracker",
      "/workspace/messages",
      "/vault",
    ];
    const isPrivate =
      privateRoutes.some((p) => lowerPath === p || lowerPath.startsWith(`${p}/`)) ||
      ["admin", "editor", "my_activity", "logs", "chat", "union"].includes(currentTab) ||
      workspaceActiveTool === "ticket-tracker";

    // Update <meta name="robots">
    let robotsEl = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsEl) {
      robotsEl = document.createElement("meta");
      robotsEl.setAttribute("name", "robots");
      document.head.appendChild(robotsEl);
    }
    robotsEl.setAttribute(
      "content",
      isPrivate
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    const staticSeoMap: Record<string, { title: string; desc: string }> = {
      "/": {
        title: "E-Vedhika (ఈ-వేదిక) – All Problems One Solution at One Place | e-Panchayat & UBD Portal",
        desc: "ఈ-వేదిక (E-Vedhika) - గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు పౌరుల కోసం సమగ్ర డిజిటల్ పోర్టల్. DSR Analyzer, Multi-Day Attendance, UBD/DSC Guides, GOs & Formats.",
      },
      "/about": {
        title: "మా గురించి (About E-Vedhika Portal) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika - All Problems One Solution at One Place) లక్ష్యాలు, సేవలు, ఆన్‌లైన్ టూల్స్ మరియు స్వతంత్ర సాంకేతిక వేదిక వివరాలు.",
      },
      "/contact": {
        title: "మమ్మల్ని సంప్రదించండి (Contact Us & Technical Helpdesk) | E-Vedhika",
        desc: "ఈ-వేదిక సపోర్ట్ టీమ్ అధికారిక ఇమెయిల్ (support@e-vedhika.in), సంప్రదింపు ఫారమ్ (Contact Form), టెలిగ్రామ్ మరియు వాట్సాప్ హెల్ప్‌డెస్క్ వివరాలు.",
      },
      "/privacy": {
        title: "గోప్యతా విధానం (Privacy Policy) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika) యూజర్ డేటా భద్రత, క్లయింట్-సైడ్ ఫైల్ ప్రాసెసింగ్ మరియు Google AdSense DART కుకీ నిబంధనలు.",
      },
      "/terms": {
        title: "నిబంధనలు & షరతులు (Terms & Conditions) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika) పోర్టల్ మరియు ఆన్‌లైన్ టూల్స్ వినియోగ నిబంధనలు మరియు షరతులు.",
      },
      "/disclaimer": {
        title: "బాధ్యతా రాహిత్య ప్రకటన (Non-Governmental Disclaimer) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika) స్వతంత్ర సాంకేతిక వేదిక హోదా మరియు అధికారిక ప్రభుత్వ సమాచార నిర్ధారణ ప్రకటన.",
      },
      "/cookie-policy": {
        title: "కుకీ విధానం (Cookie Policy) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika) కుకీల వినియోగం, Firebase Auth మరియు Google AdSense కుకీల సమాచారం.",
      },
      "/editorial-policy": {
        title: "ఎడిటోరియల్ పాలసీ (Editorial & Verification Policy) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika) కంటెంట్ నాణ్యతా ప్రమాణాలు, ప్రామాణిక వనరుల పరిశీలన మరియు మానవ సంపాదకీయ ధృవీకరణ విధానం.",
      },
      "/sitemap": {
        title: "సైట్‌మ్యాప్ & డైరెక్టరీ (Complete Sitemap Directory) | E-Vedhika",
        desc: "ఈ-వేదిక (E-Vedhika) లోని అన్ని పబ్లిక్ పేజీలు, ఆన్‌లైన్ వర్క్‌స్పేస్ టూల్స్, UBD గైడ్‌లు మరియు పాలసీ పేజీల పూర్తి డైరెక్టరీ.",
      },
      "/ubd-settings-dsk-issues": {
        title: "UBD Settings, DSC, ProxKey, HYP2003 & Edge IE Mode 11-Point Guides | E-Vedhika",
        desc: "తెలంగాణ & ఏపీ UBD పోర్టల్ జనన మరణ నమోదు, డిజిటల్ సిగ్నేచర్ (DSC), ProxKey, HYP2003 టోకెన్లు మరియు Edge IE Mode సమస్యల 11-అంశాల పరిష్కార మార్గదర్శిని.",
      },
      "/workspace": {
        title: "మన పంచాయతీ డిజిటల్ వర్క్‌స్పేస్ (Mana Panchayath Tools) | E-Vedhika",
        desc: "గ్రామ పంచాయతీ కార్యదర్శులు మరియు కంప్యూటర్ ఆపరేటర్ల కోసం DSR Analyzer, Multi-Day Attendance, MAS, Excel Merger, GPDP Planning మరియు PR Act గైడ్.",
      },
      "/workspace/dsr": {
        title: "డైలీ DSR & అటెండెన్స్ అనలైజర్ (Daily DSR Analyzer) | E-Vedhika",
        desc: "మన పంచాయతీ పోర్టల్ రోజువారీ DSR మరియు హాజరు ఎక్సెల్ ఫైళ్లను సెకన్లలో విశ్లేషించి మండల మరియు GP వారీగా నివేదికలు రూపొందించే టూల్.",
      },
      "/workspace/multiday": {
        title: "మల్టీ-డే హాజరు విశ్లేషణ (Multi-Day Attendance Analyzer) | E-Vedhika",
        desc: "బహుళ రోజుల హాజరు ఎక్సెల్ ఫైళ్లను ఒకేసారి అప్‌లోడ్ చేసి గ్రామ పంచాయతీ వారీగా నెలవారీ హాజరు శాతాన్ని కన్సాలిడేట్ చేసే టూల్.",
      },
      "/workspace/training": {
        title: "డిజిటల్ ట్రైనింగ్ & 11-అంశాల ప్రాక్టికల్ ట్యుటోరియల్స్ | E-Vedhika",
        desc: "UBD పోర్టల్, DSC టోకెన్లు (ProxKey, HYP2003), Edge IE Mode, Windows సెక్యూరిటీ మరియు GPDP ప్రణాళికపై 11-అంశాల ప్రాక్టికల్ ట్యుటోరియల్స్.",
      },
      "/workspace/pract": {
        title: "నాలెడ్జ్ హబ్ - తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 గైడ్ | E-Vedhika",
        desc: "తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 సెక్షన్లు, గ్రామ సభ నిబంధనలు, సర్పంచ్ మరియు పంచాయతీ కార్యదర్శి విధులు, రిజిస్టర్ల సమగ్ర తెలుగు గైడ్.",
      },
      "/workspace/monthly-activity": {
        title: "మాసాంతపు యాక్టివిటీ రిపోర్ట్ (MAS GP Matrix Formatter) | E-Vedhika",
        desc: "మండల మరియు జిల్లా స్థాయి మాసాంతపు ఈ-పంచాయతీ కార్యకలాపాల (Monthly Activity Status) నివేదికలను ఆటోమేటిక్‌గా ఫార్మాట్ చేసే సాధనం.",
      },
      "/workspace/mas": {
        title: "మాసాంతపు యాక్టివిటీ రిపోర్ట్ (MAS GP Matrix Formatter) | E-Vedhika",
        desc: "మండల మరియు జిల్లా స్థాయి మాసాంతపు ఈ-పంచాయతీ కార్యకలాపాల (Monthly Activity Status) నివేదికలను ఆటోమేటిక్‌గా ఫార్మాట్ చేసే సాధనం.",
      },
      "/workspace/excel-merge": {
        title: "మల్టీ-ఫైల్ ఎక్సెల్ మెర్జర్ (Excel File Merger Tool) | E-Vedhika",
        desc: "వివిధ గ్రామ పంచాయతీల నుండి వచ్చిన పదుల సంఖ్యలోని ఎక్సెల్ ఫైళ్లను ఒక్క క్లిక్‌తో ఒకే మాస్టర్ షీట్‌గా విలీనం చేసే ఆఫీస్ టూల్.",
      },
      "/workspace/gpdp-planning": {
        title: "GPDP బడ్జెట్ & అభివృద్ధి ప్రణాళిక టూల్ (GPDP Planning) | E-Vedhika",
        desc: "గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP) మరియు 15వ ఆర్థిక సంఘం Tied (60%) / Untied (40%) నిధుల కేటాయింపు క్యాలిక్యులేటర్.",
      },
      "/workspace/unsupported-excel": {
        title: "సపోర్ట్ చేయని HTML .xls ఎక్సెల్ వ్యూయర్ (Unsupported Excel Viewer) | E-Vedhika",
        desc: "ప్రభుత్వ పోర్టల్స్ నుండి డౌన్‌లోడ్ అయ్యే HTML-based .xls ఫైళ్లను బ్రౌజర్‌లో ఓపెన్ చేసి స్వచ్ఛమైన .xlsx మరియు .csv గా మార్చే సాధనం.",
      },
      "/workspace/dcb-reports": {
        title: "పంచాయతీ DCB రిపోర్ట్ అనలైజర్ (Tax Demand, Collection & Balance) | E-Vedhika",
        desc: "గ్రామ పంచాయతీ మరియు మండల స్థాయి ఇంటి పన్ను DCB (Previous Balance, Current Demand, Collection, Pending Balance) విశ్లేషణ సాధనం.",
      },
      "/workspace/excel-studio": {
        title: "28-in-1 అడ్వాన్స్‌డ్ ఎక్సెల్ స్టూడియో & ఫైల్ మేనేజర్ (Excel Studio) | E-Vedhika",
        desc: "రెండు ఎక్సెల్ ఫైళ్ల పోలిక (6 Separate Output Sheets), మెర్జ్, అన్‌పివట్, ట్రాన్స్‌పోజ్, డూప్లికేట్ల తొలగింపు మరియు ఫార్ములా అసిస్టెంట్.",
      },
      "/workspace/epanchayat-tutorials": {
        title: "ఈ-పంచాయతీ 12 పౌర సేవల ట్యుటోరియల్ సెంటర్ (ePanchayat Tutorials) | E-Vedhika",
        desc: "లేఅవుట్, భవన నిర్మాణ అనుమతి, ఇంటి పన్ను అసెస్‌మెంట్, మ్యుటేషన్, ట్రేడ్ లైసెన్స్ మరియు జనన/మరణ నమోదు పూర్తి మార్గదర్శకాలు.",
      },
      "/workspace/gallery": {
        title: "శిక్షణ & మీడియా గ్యాలరీ (Training & Video Gallery) | E-Vedhika",
        desc: "గ్రామ పంచాయతీ కంప్యూటర్ ఆపరేటర్ల శిక్షణ ఫోటోలు, కార్యక్రమాలు మరియు ప్రాక్టికల్ వీడియో ట్యుటోరియల్స్ గ్యాలరీ.",
      },
      "/gos_formats": {
        title: "ప్రభుత్వ జీవోలు & ఆఫీస్ ఫార్మాట్లు (GOs & Official Formats) | E-Vedhika",
        desc: "తెలంగాణ & ఏపీ పంచాయతీరాజ్ శాఖ ప్రభుత్వ ఉత్తర్వులు (GOs) మరియు గ్రామ పంచాయతీ కార్యాలయ దరఖాస్తు ఫార్మాట్లు (PDF/Excel).",
      },
      "/software_hub": {
        title: "సాఫ్ట్‌వేర్ హబ్ - DSC, ProxKey, HYP2003 & Java 32-Bit డ్రైవర్స్ | E-Vedhika",
        desc: "గ్రామ పంచాయతీ కంప్యూటర్లలో UBD మరియు ఆన్‌లైన్ పోర్టల్స్ పనిచేయడానికి అవసరమైన అధికారిక DSC టోకెన్ డ్రైవర్లు, Java 8 మరియు DSK Signer డౌన్‌లోడ్ కేంద్రం.",
      },
      "/ubd_tracker": {
        title: "UBD లైవ్ ట్రాకర్ & ఆఫీస్ కోడ్ డైరెక్టరీ (UBD Birth/Death Tracker) | E-Vedhika",
        desc: "గ్రామ పంచాయతీల వారీగా జనన మరణ నమోదు పురోగతి ట్రాకింగ్ మరియు UBD RLB ఆఫీస్ కోడ్ డైరెక్టరీ.",
      },
      "/farmer_registry": {
        title: "రైతు రిజిస్ట్రీ ల్యాండ్ వెరిఫికేషన్ టూల్ (Farmer Registry Tool) | E-Vedhika",
        desc: "రైతు రిజిస్ట్రీ ఎన్‌రోల్‌మెంట్ కోసం Bucket ID మరియు పట్టాదార్ పాస్‌బుక్ ఎక్సెల్ ఫైళ్లను ఆటోమేటిక్‌గా సరిపోల్చే సాధనం.",
      },
      "/excel_print": {
        title: "ఎక్సెల్ A4 ప్రింట్ ఫార్మాటర్ (Smart Excel to A4 Print & PDF) | E-Vedhika",
        desc: "పెద్ద ఎక్సెల్ షీట్లలోని కాలమ్‌లు కట్ అవ్వకుండా ఒకే A4 పేజీకి ఆటో-ఫిట్ చేసి ఆఫీస్ హెడర్లతో ప్రింట్ తీసే సాధనం.",
      },
      "/pdf_compress": {
        title: "ఆన్‌లైన్ PDF కంప్రెసర్ (Client-Side PDF Size Reducer) | E-Vedhika",
        desc: "ప్రభుత్వ పోర్టల్స్‌లో అప్‌లోడ్ చేయాల్సిన PDF ఫైళ్ల సైజును క్వాలిటీ తగ్గకుండా 200 KB లోపుకు తగ్గించే సురక్షిత బ్రౌజర్ టూల్.",
      },
    };

    const matchedSeo = staticSeoMap[lowerPath] || staticSeoMap["/"];
    document.title = matchedSeo.title;

    const setMetaContent = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMetaContent('meta[name="description"]', "name", "description", matchedSeo.desc);
    setMetaContent('meta[property="og:title"]', "property", "og:title", matchedSeo.title);
    setMetaContent('meta[property="og:description"]', "property", "og:description", matchedSeo.desc);

    const canonicalHref = `https://www.e-vedhika.in${rawPath === "/" ? "/" : rawPath}`;
    setMetaContent('meta[property="og:url"]', "property", "og:url", canonicalHref);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalHref);
  }, [location.pathname, currentTab, workspaceActiveTool]);

  // Helper function to build a deep link URL string for public tools
  const getDeepLink = (mainTab: string, subTool?: string) => {
    const baseUrl = window.location.origin;
    if (mainTab === "admin") {
      return subTool && subTool !== "dash" ? `${baseUrl}/admin/${subTool}` : `${baseUrl}/admin`;
    }
    if (mainTab === "home") {
      return `${baseUrl}/`;
    }
    if (subTool) {
      return `${baseUrl}/${mainTab}/${subTool}`;
    }
    return `${baseUrl}/${mainTab}`;
  };

  return {
    getDeepLink,
    searchParams,
    setSearchParams,
  };
}
