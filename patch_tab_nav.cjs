const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `                              startTransition(() => {
                                setCurrentTab(item.id);
                                if (item.id === "home") {
                                  setCurrentFilter("All");
                                  if (searchParams.has("postId")) {
                                    searchParams.delete("postId");
                                    setSearchParams(searchParams);
                                  }
                                }
                              });`;
const r1 = `                              startTransition(() => {
                                setCurrentTab(item.id);
                                if (item.id === "home") {
                                  setCurrentFilter("All");
                                }
                                if (searchParams.has("postId")) {
                                  searchParams.delete("postId");
                                  setSearchParams(searchParams);
                                }
                              });`;

const t2 = `                      } else {
                        setCurrentTab(item.id);
                        if (item.id === "home") {
                          setCurrentFilter("All");
                          if (searchParams.has("postId")) {
                            searchParams.delete("postId");
                            setSearchParams(searchParams);
                          }
                        }
                        setSidebarOpen(false);
                      }`;
const r2 = `                      } else {
                        setCurrentTab(item.id);
                        if (item.id === "home") {
                          setCurrentFilter("All");
                        }
                        if (searchParams.has("postId")) {
                          searchParams.delete("postId");
                          setSearchParams(searchParams);
                        }
                        setSidebarOpen(false);
                      }`;

code = code.replace(t1, r1);
code = code.replace(t2, r2);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched tab nav logic");
