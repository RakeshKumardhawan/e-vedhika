#!/bin/bash
sed -i '5053,5070c\
                <MenuButton\
                  label="System Config"\
                  icon={Settings}\
                  active={["settings", "ads", "code_manager", "ai", "cloud_dns"].includes(activeAdminSubTab)}\
                  onClick={() => {\
                    setActiveAdminSubTab("settings");\
                    if (window.innerWidth < 1024) setSidebarOpen(false);\
                  }}\
                />' src/App.tsx
