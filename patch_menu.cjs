const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                <MenuButton
                  label="Security Logs" icon={ShieldAlert}
                  active={currentTab === "logs"}
                  onClick={() => {
                    startTransition(() => { setCurrentTab("logs"); });
                    setSidebarOpen(false);
                  }}
                />`;

const replacement = `                {(isAdmin || isDevEmail) && (
                  <MenuButton
                    label="Security Logs" icon={ShieldAlert}
                    active={currentTab === "logs"}
                    onClick={() => {
                      startTransition(() => { setCurrentTab("logs"); });
                      setSidebarOpen(false);
                    }}
                  />
                )}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
