const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Main navigation has been moved to the horizontal top bar */}`;
const injection = `
                {[
                  { id: "home", label: "Home", icon: Home },
                  { id: "workspace", label: "Mana Panchayath", icon: Building },
                  { id: "priority_services", label: "Priority Services", icon: Target },
                  { id: "chat", label: "Live Chat", icon: MessageCircle },
                  { id: "union", label: "Union Corner & Polls", icon: Users },
                  { id: "changelog", label: "What's New!", icon: Megaphone },
                  { id: "suggestions", label: "Public Suggestions & Feedback", icon: MessageSquare },
                  { id: "gos_formats", label: "Applications, Formats & GOs", icon: FileText },
                  { id: "useful_links", label: "Useful Information", icon: Info },
                  { id: "excel_print", label: "Excel A4 Print", icon: FileSpreadsheet },
                  { id: "farmer_registry", label: "Farmer Registry Live Verification", icon: Wheat },
                ].map((item) => (
                  <MenuButton
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    active={currentTab === item.id || (item.id === "priority_services" && (currentTab === "emergency" || currentTab === "my_activity"))}
                    onClick={() => {
                      if (item.id === "priority_services") {
                        setIsPriorityOpen(true);
                        setSidebarOpen(false);
                      } else if (item.id === "farmer_registry") {
                        window.history.pushState({}, "", "/Farmer_Registry");
                        setCurrentTab("farmer_registry");
                        setSidebarOpen(false);
                      } else {
                        setCurrentTab(item.id);
                        if (item.id === "home") {
                          setCurrentFilter("All");
                          if (searchParams.has("postId")) {
                            searchParams.delete("postId");
                            setSearchParams(searchParams);
                          }
                        }
                        setSidebarOpen(false);
                      }
                    }}
                  />
                ))}
                {customMenus.map((menu) => (
                  <MenuButton
                    key={menu.id}
                    label={menu.label}
                    icon={LayoutList}
                    active={currentTab === \`custom_menu_\${menu.id}\`}
                    onClick={() => {
                      setCurrentTab(\`custom_menu_\${menu.id}\`);
                      setSidebarOpen(false);
                    }}
                  />
                ))}
`;

if (code.includes(target)) {
  code = code.replace(target, injection);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Restored sidebar menus!");
} else {
  console.log("Target not found!");
}
