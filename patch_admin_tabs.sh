#!/bin/bash
sed -i '/<DynamicSection id="admin_dashboard_html" \/>/a\
            {["settings", "ads", "code_manager", "ai", "cloud_dns"].includes(activeSubTab) && (\
              <div className="mb-10 overflow-x-auto custom-scrollbar pb-2">\
                <div className="flex gap-3">\
                  {[\
                    { id: "settings", label: "System Config", icon: Settings },\
                    { id: "ai", label: "Gemini AI Node", icon: Bot },\
                    { id: "cloud_dns", label: "Cloud & DNS", icon: Cloud },\
                    { id: "code_manager", label: "Code Manager", icon: Code },\
                    { id: "ads", label: "Ad Management", icon: Megaphone },\
                  ].map(tab => (\
                    <button\
                      key={tab.id}\
                      onClick={() => setActiveSubTab(tab.id)}\
                      className={`flex items-center gap-2.5 px-6 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-all ${\
                        activeSubTab === tab.id\
                          ? "bg-primary text-white shadow-xl shadow-primary/20"\
                          : "bg-white text-slate-500 border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"\
                      }`}\
                    >\
                      <tab.icon size={18} />\
                      {tab.label}\
                    </button>\
                  ))}\
                </div>\
              </div>\
            )}' src/App.tsx
