const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// We need to inject useState for localActiveTab
// Find: const activeTab = (propActiveTab === "super_admin" || propActiveTab === "dash") ? "overview" : (propActiveTab || "overview");
// Replace with a state implementation.
const searchStr = '  const activeTab = (propActiveTab === "super_admin" || propActiveTab === "dash") ? "overview" : (propActiveTab || "overview");';

const newStr = `  // Use local state so dashboard tabs don't accidentally unmount the dashboard
  const [localActiveTab, setLocalActiveTab] = useState(
    (propActiveTab === "super_admin" || propActiveTab === "dash") ? "overview" : (propActiveTab || "overview")
  );

  React.useEffect(() => {
    setLocalActiveTab((propActiveTab === "super_admin" || propActiveTab === "dash") ? "overview" : (propActiveTab || "overview"));
  }, [propActiveTab]);

  const activeTab = localActiveTab;`;

content = content.replace(searchStr, newStr);

// Also need to make sure React is available. We can use useState directly since it's imported at the top.
// Wait, is useState imported? Yes. Let's replace React.useEffect with useEffect.
content = content.replace('React.useEffect', 'useEffect');

// Now rewrite handleTabClick
// Find: 
/*
  const handleTabClick = (id: string) => {
    if (setActiveSubTab) {
      if (id === "overview") setActiveSubTab("dash");
      else if (id === "exe_ubd") setActiveSubTab("exe_ubd_live");
...
*/

// Let's use regex to replace handleTabClick entirely.
const handleTabMatch = /const handleTabClick = \(id: string\) => \{[\s\S]*?\};\n/;

const newHandleTabClick = `const handleTabClick = (id: string) => {
    if (id === "settings") {
      if (setActiveSubTab) setActiveSubTab("settings");
      return;
    }
    
    // For "overview", we can keep it local as "overview"
    // For others, we just update local state.
    setLocalActiveTab(id);
  };\n`;

content = content.replace(handleTabMatch, newHandleTabClick);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
