const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [currentTab, _setCurrentTab] = useState(isFarmerRegistryPath ? "farmer_registry" : initialUrlData.mainTab
  );

  const setCurrentTab = (newTab: any) => {
    _setCurrentTab(newTab);
    if (searchParams.has("postId")) {
       searchParams.delete("postId");
       setSearchParams(searchParams);
    }
  };`;
const replace1 = `  const [currentTab, setCurrentTab] = useState(isFarmerRegistryPath ? "farmer_registry" : initialUrlData.mainTab
  );`;

code = code.replace(target1, replace1);

code = code.replace(/searchParams\.delete\("postId"\);\s*setSearchParams\(searchParams\);/g, 
  `setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    next.delete("postId");
    return next;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });`);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed tab shifting");
