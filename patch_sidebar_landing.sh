#!/bin/bash
sed -i '5025,5034c\
                    {[\
                      { id: "builder", label: "Page Builder", icon: Wrench },\
                      { id: "custom_menus", label: "Dynamic Menus", icon: LayoutList },\
                    ].map((item) => (\
                      <MenuButton\
                        key={item.id}\
                        label={item.label}\
                        icon={item.icon}\
                        active={activeAdminSubTab === item.id}\
                        onClick={() => {\
                          setActiveAdminSubTab(item.id);\
                          if (window.innerWidth < 1024) setSidebarOpen(false);\
                        }}\
                      />\
                    ))}\
                    <MenuButton\
                      label="Landing Page Config"\
                      icon={Globe}\
                      active={["landing_page_config", "seo_meta", "page_descriptions"].includes(activeAdminSubTab)}\
                      onClick={() => {\
                        setActiveAdminSubTab("landing_page_config");\
                        if (window.innerWidth < 1024) setSidebarOpen(false);\
                      }}\
                    />\
                    {[\
                      { id: "locations", label: "Locations", icon: MapPin },\
                      { id: "suggestions", label: "Public Suggestions & Feedback", icon: MessageSquare },\
                      { id: "changelog", label: "Version History", icon: Sparkles },\
                      { id: "trash", label: "Trash / Bin", icon: Trash2 },' src/App.tsx
