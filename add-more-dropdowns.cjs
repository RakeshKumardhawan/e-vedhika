const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add hasDropdown to the other menus
const menuRegex = /\{\s*id:\s*"workspace",\s*label:\s*"Mana Panchayath",\s*icon:\s*Building,\s*colorTheme:\s*"blue"\s*\}/g;
code = code.replace(menuRegex, '{ id: "workspace", label: "Mana Panchayath", icon: Building, colorTheme: "blue", hasDropdown: true }');

const gosRegex = /\{\s*id:\s*"gos_formats",\s*label:\s*"Applications, Formats & GOs",\s*icon:\s*FileText,\s*colorTheme:\s*"teal"\s*\}/g;
code = code.replace(gosRegex, '{ id: "gos_formats", label: "Applications, Formats & GOs", icon: FileText, colorTheme: "teal", hasDropdown: true }');

const usefulRegex = /\{\s*id:\s*"useful_links",\s*label:\s*"Useful Information",\s*icon:\s*Info,\s*colorTheme:\s*"cyan"\s*\}/g;
code = code.replace(usefulRegex, '{ id: "useful_links", label: "Useful Information", icon: Info, colorTheme: "cyan", hasDropdown: true }');


// 2. Add the dropdown content
const targetDropdown = `                              {item.id === "priority_services" && (
                                <>
                                  <button
                                    onClick={() => { startTransition(() => { setCurrentTab("emergency"); }); setIsPriorityOpen(false); }}
                                    className={\`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left \${currentTab === 'emergency' ? 'bg-red-50 text-red-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                                  >
                                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${currentTab === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}\`}>
                                      <AlertTriangle size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-bold">Emergency Contacts</span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (!user) requireLoginAlert();
                                      else { startTransition(() => { setCurrentTab("my_activity"); }); setIsPriorityOpen(false); }
                                    }}
                                    className={\`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left \${currentTab === 'my_activity' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}\`}
                                  >
                                    <div className={\`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 \${currentTab === 'my_activity' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}\`}>
                                      <Activity size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-bold">My Activity</span>
                                    </div>
                                  </button>
                                </>
                              )}`;

const extraDropdowns = `
                              {item.id === "workspace" && (
                                <>
                                  {[
                                    { id: 'dsr', label: 'DSR Analyzer', icon: <BarChart3 size={16} /> },
                                    { id: 'multiday', label: 'Multi-Day attendance', icon: <Layers size={16} /> },
                                    { id: 'training', label: 'Digital Training', icon: <GraduationCap size={16} /> },
                                    { id: 'pract', label: 'Knowledge Hub', icon: <Book size={16} /> },
                                    { id: 'monthly-activity', label: 'Monthly Activity Data', icon: <FileSpreadsheet size={16} /> },
                                    { id: 'excel-merge', label: 'Excel File Merger', icon: <FileSpreadsheet size={16} /> },
                                  ].map(tool => (
                                    <button
                                      key={tool.id}
                                      onClick={() => { startTransition(() => { setCurrentTab("workspace"); }); }}
                                      className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left hover:bg-blue-50 text-slate-700"
                                    >
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-blue-600">
                                        {tool.icon}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">{tool.label}</span>
                                      </div>
                                    </button>
                                  ))}
                                </>
                              )}
                              
                              {item.id === "gos_formats" && (
                                <>
                                  {[
                                    { id: 'Application', label: 'Applications & Formats', icon: <FileBadge size={16} /> },
                                    { id: 'GO', label: 'GOs', icon: <FileText size={16} /> },
                                  ].map(tool => (
                                    <button
                                      key={tool.id}
                                      onClick={() => { startTransition(() => { setCurrentTab("gos_formats"); }); }}
                                      className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left hover:bg-teal-50 text-slate-700"
                                    >
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-teal-600">
                                        {tool.icon}
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-[13px] font-bold">{tool.label}</span>
                                      </div>
                                    </button>
                                  ))}
                                </>
                              )}
                              
                              {item.id === "useful_links" && (
                                <div className="max-h-[50vh] overflow-y-auto scrollbar-thin">
                                  {[
                                    { name: 'ePanchayat Home', url: 'https://epanchayat.telangana.gov.in/' },
                                    { name: 'House Tax DCB', url: 'https://epanchayat.telangana.gov.in/epmis/epmisPRHTAXDCBLive.jsp' },
                                    { name: 'UBD Portal', url: 'https://ubd.telangana.gov.in/' },
                                    { name: 'UBD MIS Status', url: 'https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus.do?rlb_type=3&pstcode=35&style=bluetheme' },
                                    { name: 'eGramSwaraj', url: 'https://egramswaraj.gov.in/' },
                                    { name: 'AuditOnline', url: 'https://auditonline.gov.in/' },
                                    { name: 'Panchayat Nirnay', url: 'https://meetingonline.gov.in/homepage/official-login' },
                                    { name: 'IFMIS Telangana', url: 'https://ifmis.telangana.gov.in/' },
                                    { name: 'TG TGov', url: 'https://goir.telangana.gov.in/' },
                                  ].map((link, idx) => (
                                    <a
                                      key={idx}
                                      href={link.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left hover:bg-cyan-50 text-slate-700"
                                    >
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 text-cyan-600">
                                        <ExternalLink size={16} />
                                      </div>
                                      <div className="flex flex-col min-w-0">
                                        <span className="text-[13px] font-bold truncate">{link.name}</span>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              )}
`;

if (code.includes(targetDropdown)) {
  code = code.replace(targetDropdown, targetDropdown + extraDropdowns);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Dropdowns added successfully");
} else {
  console.log("Target not found");
}

