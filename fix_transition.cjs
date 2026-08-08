const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target2 = `                            } else {
                              startTransition(() => {
                                setCurrentTab(item.id);
                                if (item.id === "home") {
                                  setCurrentFilter("All");
                                }
                                if (searchParams.has("postId")) {
                                  setSearchParams(prev => {
    const next = new URLSearchParams(prev);
    next.delete("postId");
    return next;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
                                }
                              });
                            }`;

const replace2 = `                            } else {
                              setCurrentTab(item.id);
                              if (item.id === "home") {
                                setCurrentFilter("All");
                              }
                              if (searchParams.has("postId")) {
                                setSearchParams(prev => {
                                  const next = new URLSearchParams(prev);
                                  next.delete("postId");
                                  return next;
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }`;

code = code.replace(target2, replace2);

const target3 = `                            if (item.id === "admin") {
                              navigate("/Evdka");
                              setCurrentTab("admin");
                            } else if (item.id === "priority_services") {
                              return;
                            } else if (item.id === "farmer_registry") {
                              window.history.pushState({}, "", "/Farmer_Registry");
                              setCurrentTab("farmer_registry");
                            } else {`;
                            
// Wait, I see startTransition around other set tabs too:
code = code.replace(/startTransition\(\(\) => \{\n\s*setCurrentTab/g, '{\nsetCurrentTab');
code = code.replace(/startTransition\(\(\) => setCurrentTab/g, 'setCurrentTab');

fs.writeFileSync('src/App.tsx', code);
console.log("Removed startTransition");
