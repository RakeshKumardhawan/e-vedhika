const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navCode = `            {/* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR */}
            {(hasEnteredSite || user) && (
              <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full ml-2">
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
                      button: "hover:bg-slate-50",
                      iconBg: "bg-blue-100 text-blue-600",
                      text: "text-slate-600 font-medium"
                    };
                    if (isActive) {
                      themeClasses = {
                        button: "bg-blue-600 text-white shadow-md shadow-blue-500/20",
                        iconBg: "bg-white/20 text-white",
                        text: "text-white font-semibold"
                      };
                    } else {
                      switch(item.colorTheme) {
                        case "blue": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-blue-100 text-blue-600", text: "text-slate-600 font-medium" }; break;
                        case "red": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-red-100 text-red-600", text: "text-slate-600 font-medium" }; break;
                        case "emerald": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-emerald-100 text-emerald-600", text: "text-slate-600 font-medium" }; break;
                        case "slate": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-slate-100 text-slate-600", text: "text-slate-600 font-medium" }; break;
                        case "orange": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-orange-100 text-orange-600", text: "text-slate-600 font-medium" }; break;
                        case "purple": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-purple-100 text-purple-600", text: "text-slate-600 font-medium" }; break;
                        case "pink": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-pink-100 text-pink-600", text: "text-slate-600 font-medium" }; break;
                        case "teal": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-teal-100 text-teal-600", text: "text-slate-600 font-medium" }; break;
                        case "cyan": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-cyan-100 text-cyan-600", text: "text-slate-600 font-medium" }; break;
                        case "green": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-green-100 text-green-600", text: "text-slate-600 font-medium" }; break;
                        case "amber": themeClasses = { button: "hover:bg-slate-50", iconBg: "bg-amber-100 text-amber-600", text: "text-slate-600 font-medium" }; break;
                      }
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
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "hover:bg-slate-50"
                        }\`}
                      >
                        <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 \${
                          isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                        }\`}>
                          <LayoutList size={12} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className={\`text-[12px] sm:text-[13px] tracking-wide \${
                          isActive ? "text-white font-semibold" : "text-slate-600 font-medium"
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
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "hover:bg-slate-50"
                      }\`}
                    >
                      <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 \${
                        location.pathname.endsWith("/Evdka") ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }\`}>
                        <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                      </div>
                      <span className={\`text-[12px] sm:text-[13px] tracking-wide \${
                        location.pathname.endsWith("/Evdka") ? "text-white font-semibold" : "text-slate-600 font-medium"
                      }\`}>
                        Admin Panel
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
`;

// Remove the one in header
const headerNavRegex = /\{\/\* NEW HORIZONTAL NAVIGATION MENU IN HEADER \*\/\}.*?\n.*?\n.*?\n.*?Admin Panel\n.*?<\/span>\n.*?<\/button>\n.*?\)}\n.*?<\/div>\n.*?<\/div>\n.*?\)}\n/s;
code = code.replace(headerNavRegex, "");

// Restore text zoom flex-1 if we want, or just leave it. Let's revert it back to flex-1 so it looks normal in header
code = code.replace('<div className="hidden lg:flex justify-end sm:justify-start px-2">', '<div className="flex-1 flex justify-end sm:justify-start px-2 sm:px-6">');


// Now insert navCode into the middle div of the trigger bar
const insertPointRegex = /\{searchQuery && \(\s*<button\s*aria-label="Clear Search"[\s\S]*?<\/button>\s*\)\}\s*<\/div>\s*\)\}\n/;
code = code.replace(insertPointRegex, (match) => {
  return match + navCode;
});

// We need to also handle the case when search bar is visible, it shouldn't take full width.
// The search bar is: `w-full max-w-xl` Let's change it to `flex-1 max-w-sm` or similar if it's sitting next to nav menu.
code = code.replace('className="flex items-center gap-2 sm:gap-3 w-full max-w-xl h-[34px] sm:h-[40px] bg-slate-50 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/30 shadow-sm rounded-xl px-3 sm:px-5 transition-all group"', 'className="flex items-center gap-2 sm:gap-3 flex-1 lg:max-w-xs xl:max-w-md shrink-0 h-[34px] sm:h-[40px] bg-slate-50 border border-slate-200 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/30 shadow-sm rounded-xl px-3 sm:px-5 transition-all group"');


fs.writeFileSync('src/App.tsx', code);
