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
  if (mainTab === "problems") mainTab = "directlinks";

  const normMain = (mainTab || "").toLowerCase().replace(/[-_ ]/g, "");
  if (
    normMain === "evedhika" ||
    normMain === "evdka" ||
    normMain === "adminpanel" ||
    normMain === "sysadmin" ||
    normMain === "admin"
  ) {
    mainTab = "admin";
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
      else if (norm === "monthlyactivity" || norm === "monthlyactivitydata") workspaceTool = "monthly-activity";
      else if (
        norm === "excelmerge" ||
        norm === "excelmerger" ||
        norm === "excelfilemerger" ||
        norm === "excel"
      )
        workspaceTool = "excel-merge";
      else workspaceTool = subToolFromUrl;
    } else {
      workspaceTool = "dsr";
    }
  }

  let adminSubTab = "dash";
  if (mainTab === "admin" || mainTab === "exe_ubd_live") {
    if (mainTab === "exe_ubd_live") {
      mainTab = "admin";
      adminSubTab = "exe_ubd_live";
    } else if (subToolFromUrl) {
      adminSubTab = subToolFromUrl === "UBDLiveMonitoring" ? "exe_ubd_live" : subToolFromUrl;
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

    if (currentTab === "home") {
      targetPath = "/";
    } else if (currentTab === "admin" || currentTab === "exe_ubd_live") {
      targetPath = "/admin"; // Clean URL for Admin Panel
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
    workspaceActiveTool,
    gosActiveSubTab,
    suggestionsActiveSubTab,
    location.pathname,
    searchParams,
    navigate,
  ]);

  // Helper function to build a deep link URL string for public tools
  const getDeepLink = (mainTab: string, subTool?: string) => {
    const baseUrl = window.location.origin;
    if (mainTab === "admin") {
      return `${baseUrl}/admin`;
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
