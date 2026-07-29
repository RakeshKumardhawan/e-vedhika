const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navCode = `        {/* NEW HORIZONTAL NAVIGATION MENU IN HEADER */}
        {(hasEnteredSite || user) && (
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full mx-2 border-x border-white/10 px-2">
            <div className="flex items-center gap-1 sm:gap-2 min-w-max">
              {[
                { id: "home", label: "Home", icon: Home, colorTheme: "blue" },
                { id: "workspace", label: "Priority Services", icon: Layers, colorTheme: "blue", hasDropdown: true },
                { id: "emergency", label: "Emergency", icon: AlertTriangle, colorTheme: "red" },
                { id: "my_activity", label: "My Activity", icon: Activity, requiresAuth: true, colorTheme: "emerald" },
                { id: "chat", label: "Live Chat", icon: MessageCircle, colorTheme: "slate" },
                { id: "union", label: "Union Corner & Polls", icon: Users, colorTheme: "orange" },
                { id: "changelog", label: "What's New!", icon: Megaphone, colorTheme: "purple" },
                { id: "suggestions", label: "Suggestions", icon: MessageSquare, colorTheme: "pink" },
                { id: "gos_formats", label: "Formats & GOs", icon: FileText, colorTheme: "teal" },
                { id: "useful_links", label: "Useful Info", icon: Info, colorTheme: "cyan" },
                { id: "excel_print", label: "Excel Print", icon: FileSpreadsheet, colorTheme: "green" },
                { id: "farmer_registry", label: "Farmer Registry", icon: Wheat, colorTheme: "amber" },
              ].map((item) => {
                if (item.requiresAuth && !user) return null;
                const isActive = currentTab === item.id;
                const Icon = item.icon;
                
                let themeClasses = {
                  button: "hover:bg-white/10",
                  iconBg: "bg-white/10 text-white/70",
                  text: "text-white/70 font-medium"
                };
                if (isActive) {
                  themeClasses = {
                    button: "bg-blue-600 text-white shadow-md shadow-black/20",
                    iconBg: "bg-white text-[#103052]",
                    text: "text-white font-bold"
                  };
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "farmer_registry") {
                        window.history.pushState({}, "", "/Farmer_Registry");
                        startTransition(() => { setCurrentTab("farmer_registry"); });
                      } else {
                        startTransition(() => {
                          setCurrentTab(item.id);
                          if (item.id === "home") {
                            setCurrentFilter("All");
                            if (searchParams.has("postId")) {
                              searchParams.delete("postId");
                              setSearchParams(searchParams);
                            }
                          }
                        });
                      }
                    }}
                    className={\`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all duration-200 shrink-0 \${themeClasses.button}\`}
                  >
                    <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 \${themeClasses.iconBg}\`}>
                      <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className={\`text-[12px] sm:text-[13px] tracking-wide \${themeClasses.text}\`}>
                      {item.label}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDown size={12} className={\`ml-0.5 opacity-70 \${themeClasses.text}\`} />
                    )}
                  </button>
                );
              })}
              {customMenus.map((menu) => {
                const isActive = currentTab === \`custom_menu_\${menu.id}\`;
                return (
                  <button
                    key={menu.id}
                    onClick={() => {
                      startTransition(() => {
                        setCurrentTab(\`custom_menu_\${menu.id}\`);
                      });
                    }}
                    className={\`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all duration-200 shrink-0 \${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-black/20"
                        : "hover:bg-white/10"
                    }\`}
                  >
                    <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 \${
                      isActive ? "bg-white text-[#103052]" : "bg-white/10 text-white/70"
                    }\`}>
                      <LayoutList size={12} className="sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className={\`text-[12px] sm:text-[13px] tracking-wide \${
                      isActive ? "text-white font-bold" : "text-white/70 font-medium"
                    }\`}>
                      {menu.label}
                    </span>
                  </button>
                );
              })}
              {(isAdmin || isEditor || isDevEmail) && (
                <button
                  onClick={() => navigate("/Evdka")}
                  className={\`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap transition-all duration-200 shrink-0 \${
                    location.pathname.endsWith("/Evdka")
                      ? "bg-blue-600 text-white shadow-md shadow-black/20"
                      : "hover:bg-white/10"
                  }\`}
                >
                  <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 \${
                    location.pathname.endsWith("/Evdka") ? "bg-white text-[#103052]" : "bg-white/10 text-white/70"
                  }\`}>
                    <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className={\`text-[12px] sm:text-[13px] tracking-wide \${
                    location.pathname.endsWith("/Evdka") ? "text-white font-bold" : "text-white/70 font-medium"
                  }\`}>
                    Admin Panel
                  </span>
                </button>
              )}
            </div>
          </div>
        )}`;

// Replace old nav menu with empty string, we'll put it in header.
const oldNavRegex = /\{\/\* Row 2: Horizontal Navigation Menu.*?\}\s*\{\(hasEnteredSite \|\| user\) && \(\s*<div\s+className="w-full bg-white border-b border-slate-200 overflow-x-auto scrollbar-none sticky z-\[990\] shadow-sm shrink-0"[\s\S]*?\{\/\* Sidebar Overlay for Mobile \*\/\}/m;
code = code.replace(oldNavRegex, '{/* Sidebar Overlay for Mobile */}');

// We need to find the place in header to insert the new nav menu.
// Right after brand-wrapper and text zoom.
// Or we can just put it right after brand-wrapper, and let text zoom be next to it.
const headerInsertRegex = /(<div className="flex-1 flex justify-end sm:justify-start px-2 sm:px-6">[\s\S]*?<\/div>\s*<\/div>)/m;

code = code.replace(headerInsertRegex, `$1\n${navCode}`);

// Let's also remove flex-1 from the text zoom block, and hide text zoom on smaller screens.
code = code.replace('<div className="flex-1 flex justify-end sm:justify-start px-2 sm:px-6">', '<div className="hidden lg:flex justify-end sm:justify-start px-2">');

fs.writeFileSync('src/App.tsx', code);
