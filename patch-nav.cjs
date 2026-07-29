const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldNavRegex = /\{\/\* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR \*\/\}.*?(?=\/\* Clock \*\/)/s;
const newNav = `{/* HORIZONTAL NAVIGATION MENU IN TRIGGER BAR */}
            {(hasEnteredSite || user) && (
              <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none flex items-center h-full ml-2 relative">
                <div className="flex items-center gap-2 sm:gap-3 min-w-max pr-4">
                  {[
                    { id: "home", label: "Home", icon: Home, colorTheme: "blue" },
                    { id: "workspace", label: "Mana Panchayath", icon: Building, colorTheme: "blue" },
                    { id: "priority_services", label: "Priority Services", icon: Target, colorTheme: "blue", hasDropdown: true },
                    { id: "chat", label: "Live Chat", icon: MessageCircle, colorTheme: "slate" },
                    { id: "union", label: "Union Corner & Polls", icon: Users, colorTheme: "orange" },
                    { id: "changelog", label: "What's New!", icon: Megaphone, colorTheme: "purple" },
                    { id: "suggestions", label: "Public Suggestions & Feedback", icon: MessageSquare, colorTheme: "pink" },
                    { id: "gos_formats", label: "Applications, Formats & GOs", icon: FileText, colorTheme: "teal" },
                    { id: "useful_links", label: "Useful Information", icon: Info, colorTheme: "cyan" },
                    { id: "excel_print", label: "Excel A4 Print", icon: FileSpreadsheet, colorTheme: "green" },
                    { id: "farmer_registry", label: "Farmer Registry Live Verification", icon: Wheat, colorTheme: "amber" },
                  ].map((item, index) => {
                    const isActive = currentTab === item.id || (item.id === "priority_services" && (currentTab === "emergency" || currentTab === "my_activity"));
                    const Icon = item.icon;
                    
                    let themeClasses = {
                      button: "hover:bg-slate-100 border border-transparent",
                      iconBg: "bg-blue-50 text-blue-600",
                      text: "text-slate-600 font-medium"
                    };
                    if (isActive) {
                      themeClasses = {
                        button: "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20",
                        iconBg: "bg-white/20 text-white",
                        text: "text-white font-semibold"
                      };
                    } else {
                      switch(item.colorTheme) {
                        case "blue": themeClasses = { button: "hover:bg-blue-50/50 border border-blue-100", iconBg: "bg-blue-100 text-blue-600", text: "text-slate-700 font-semibold" }; break;
                        case "red": themeClasses = { button: "hover:bg-red-50/50 border border-red-100", iconBg: "bg-red-100 text-red-600", text: "text-slate-700 font-semibold" }; break;
                        case "emerald": themeClasses = { button: "hover:bg-emerald-50/50 border border-emerald-100", iconBg: "bg-emerald-100 text-emerald-600", text: "text-slate-700 font-semibold" }; break;
                        case "slate": themeClasses = { button: "hover:bg-slate-50/50 border border-slate-200", iconBg: "bg-slate-100 text-slate-600", text: "text-slate-700 font-semibold" }; break;
                        case "orange": themeClasses = { button: "hover:bg-orange-50/50 border border-orange-100", iconBg: "bg-orange-100 text-orange-600", text: "text-slate-700 font-semibold" }; break;
                        case "purple": themeClasses = { button: "hover:bg-purple-50/50 border border-purple-100", iconBg: "bg-purple-100 text-purple-600", text: "text-slate-700 font-semibold" }; break;
                        case "pink": themeClasses = { button: "hover:bg-pink-50/50 border border-pink-100", iconBg: "bg-pink-100 text-pink-600", text: "text-slate-700 font-semibold" }; break;
                        case "teal": themeClasses = { button: "hover:bg-teal-50/50 border border-teal-100", iconBg: "bg-teal-100 text-teal-600", text: "text-slate-700 font-semibold" }; break;
                        case "cyan": themeClasses = { button: "hover:bg-cyan-50/50 border border-cyan-100", iconBg: "bg-cyan-100 text-cyan-600", text: "text-slate-700 font-semibold" }; break;
                        case "green": themeClasses = { button: "hover:bg-green-50/50 border border-green-100", iconBg: "bg-green-100 text-green-600", text: "text-slate-700 font-semibold" }; break;
                        case "amber": themeClasses = { button: "hover:bg-amber-50/50 border border-amber-100", iconBg: "bg-amber-100 text-amber-600", text: "text-slate-700 font-semibold" }; break;
                      }
                    }
                    
                    return (
                      <div key={item.id} className="relative group/navitem">
                        <button
                          onClick={(e) => {
                            if (item.id === "priority_services") {
                              // We can just toggle the dropdown, it will be handled by CSS hover or a simple click
                            } else if (item.id === "farmer_registry") {
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
                          className={\`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[14px] whitespace-nowrap transition-all duration-200 shrink-0 \${themeClasses.button}\`}
                        >
                          <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 \${themeClasses.iconBg}\`}>
                            <Icon size={14} className="sm:w-4 sm:h-4" />
                          </div>
                          <span className={\`text-[12px] sm:text-[13px] tracking-wide \${themeClasses.text}\`}>
                            {item.label}
                          </span>
                          {item.hasDropdown && (
                            <ChevronDown size={14} className={\`ml-0.5 opacity-70 \${themeClasses.text}\`} />
                          )}
                        </button>
                        
                        {/* Dropdown for Priority Services */}
                        {item.hasDropdown && (
                          <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover/navitem:opacity-100 group-hover/navitem:visible transition-all duration-200 z-[1002]">
                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-[220px] flex flex-col gap-1">
                              <button
                                onClick={() => { startTransition(() => { setCurrentTab("emergency"); }); }}
                                className={\`flex items-center gap-3 w-full p-2 rounded-lg transition-colors \${currentTab === 'emergency' ? 'bg-red-50 text-red-600' : 'hover:bg-slate-50 text-slate-700'}\`}
                              >
                                <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${currentTab === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-red-50 text-red-500'}\`}>
                                  <AlertTriangle size={16} />
                                </div>
                                <span className="text-[13px] font-semibold">Emergency Contacts</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (!user) requireLoginAlert();
                                  else startTransition(() => { setCurrentTab("my_activity"); });
                                }}
                                className={\`flex items-center gap-3 w-full p-2 rounded-lg transition-colors \${currentTab === 'my_activity' ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-slate-50 text-slate-700'}\`}
                              >
                                <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${currentTab === 'my_activity' ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-50 text-emerald-500'}\`}>
                                  <Activity size={16} />
                                </div>
                                <span className="text-[13px] font-semibold">My Activity & Reports</span>
                              </button>
                              <button
                                onClick={() => {
                                  if (!user) requireLoginAlert();
                                  else setShowProfileModal(true);
                                }}
                                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-slate-500">
                                  <Settings size={16} />
                                </div>
                                <span className="text-[13px] font-semibold">Edit Profile</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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
                        className={\`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-[14px] whitespace-nowrap transition-all duration-200 shrink-0 border \${
                          isActive
                            ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20"
                            : "bg-blue-50/50 border-blue-100 hover:bg-blue-100/50"
                        }\`}
                      >
                        <div className={\`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 \${
                          isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                        }\`}>
                          <LayoutList size={14} className="sm:w-4 sm:h-4" />
                        </div>
                        <span className={\`text-[12px] sm:text-[13px] tracking-wide \${isActive ? 'text-white font-semibold' : 'text-slate-700 font-semibold'}\`}>
                          {menu.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            `;

code = code.replace(oldNavRegex, newNav);
fs.writeFileSync('src/App.tsx', code);
