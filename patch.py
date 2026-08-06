with open('src/App.tsx', 'r') as f:
    content = f.read()

target = 'const [currentTab, setCurrentTab] = useState(isFarmerRegistryPath ? "farmer_registry" : initialUrlData.mainTab\n  );'
replacement = target + '''

  useEffect(() => {
    if (tabClickCount === 0) {
      tabClickCount++;
      return;
    }
    triggerTabAd();
  }, [currentTab]);
'''

content = content.replace(target, replacement)
with open('src/App.tsx', 'w') as f:
    f.write(content)
