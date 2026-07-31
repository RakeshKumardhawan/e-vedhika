const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');

const targetStr1 = `  const tabFromUrl = searchParams.get("tab");
  const resolvedTab = tabFromUrl === "reports" ? "my_activity" : tabFromUrl === "problems" ? "directlinks" : tabFromUrl;
  const [currentTab, setCurrentTab] = useState(
    isFarmerRegistryPath ? "farmer_registry" : resolvedTab || "home",
  );`;

const newStr1 = `  const tabFromUrl = searchParams.get("tab");
  const resolvedTab = tabFromUrl === "reports" ? "my_activity" : tabFromUrl === "problems" ? "directlinks" : (tabFromUrl === "admin/UBDLiveMonitoring" ? "admin" : tabFromUrl);
  const [currentTab, setCurrentTab] = useState(
    isFarmerRegistryPath ? "farmer_registry" : resolvedTab || "home",
  );`;

if (content.includes(targetStr1)) {
  content = content.replace(targetStr1, newStr1);
  console.log('Replaced resolvedTab logic.');
} else {
  console.log('targetStr1 not found.');
}

const targetStr2 = `  const [activeAdminSubTab, setActiveAdminSubTab] = useState(
    searchParams.get("subtab") || "dash",
  );`;

const newStr2 = `  const [activeAdminSubTab, setActiveAdminSubTab] = useState(
    searchParams.get("tab") === "admin/UBDLiveMonitoring" ? "exe_ubd_live" : (searchParams.get("subtab") || "dash"),
  );`;

if (content.includes(targetStr2)) {
  content = content.replace(targetStr2, newStr2);
  console.log('Replaced activeAdminSubTab logic.');
} else {
  console.log('targetStr2 not found.');
}

const targetStr3 = `  useEffect(() => {
    const currentParam = searchParams.get("tab");
    if (currentTab && currentTab !== currentParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("tab", currentTab);
      setSearchParams(newParams, { replace: true });
    }
  }, [currentTab, setSearchParams, searchParams]);`;

const newStr3 = `  useEffect(() => {
    const currentParam = searchParams.get("tab");
    let targetTabParam = currentTab;
    if (currentTab === "admin" && activeAdminSubTab === "exe_ubd_live") {
      targetTabParam = "admin/UBDLiveMonitoring";
    }

    if (currentTab && targetTabParam !== currentParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("tab", targetTabParam);
      setSearchParams(newParams, { replace: true });
    }
  }, [currentTab, activeAdminSubTab, setSearchParams, searchParams]);`;

if (content.includes(targetStr3)) {
  content = content.replace(targetStr3, newStr3);
  console.log('Replaced URL search params effect logic.');
} else {
  console.log('targetStr3 not found.');
}

fs.writeFileSync(path.join(__dirname, 'src/App.tsx'), content);
