#!/bin/bash
sed -i '/{activeSubTab === "landing_page_config" && (/i\
            {["landing_page_config", "seo_meta", "page_descriptions"].includes(activeSubTab) && (\
              <div className="mb-10 overflow-x-auto custom-scrollbar pb-2">\
                <div className="flex gap-3">\
                  {[\
                    { id: "landing_page_config", label: "Landing Page Config", icon: Globe },\
                    { id: "seo_meta", label: "SEO & Meta Tags", icon: Globe },\
                    { id: "page_descriptions", label: "Page Descriptions", icon: FileBadge },\
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
