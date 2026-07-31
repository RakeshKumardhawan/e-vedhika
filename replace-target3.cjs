const fs = require('fs');
const path = require('path');
let content = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');

const targetStr3 = `  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/farmer_registry") || path.endsWith("/farmer-registry")) {
      return;
    }
    const currentParam = searchParams.get("tab");

    if (currentTab && currentTab !== currentParam) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("tab", currentTab);
      setSearchParams(newParams, { replace: true });
    }
  }, [currentTab, setSearchParams, searchParams]);`;

const newStr3 = `  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/farmer_registry") || path.endsWith("/farmer-registry")) {
      return;
    }
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
