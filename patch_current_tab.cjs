const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `  const [currentTab, setCurrentTab] = useState(isFarmerRegistryPath ? "farmer_registry" : initialUrlData.mainTab
  );`;

const replace = `  const [currentTab, _setCurrentTab] = useState(isFarmerRegistryPath ? "farmer_registry" : initialUrlData.mainTab
  );

  const setCurrentTab = (newTab: any) => {
    _setCurrentTab(newTab);
    if (searchParams.has("postId")) {
       searchParams.delete("postId");
       setSearchParams(searchParams);
    }
  };`;

if (code.includes(target)) {
    code = code.replace(target, replace);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched setCurrentTab");
} else {
    console.log("Could not find target");
}
