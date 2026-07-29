const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                                {el.type === "Feature Cards" && (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                      {
                                        title: el.title || "Secure Portal",
                                        desc: "Enterprise-grade encryption for all your data and interactions.",
                                        icon: <Shield size={24} />,
                                        color: "indigo",
                                      },
                                      {
                                        title: "Real-time Sync",
                                        desc: "Get instant notifications and updates on government orders and changes.",
                                        icon: <Zap size={24} />,
                                        color: "blue",
                                      },
                                      {
                                        title: "Citizen First",
                                        desc: "Designed with accessibility and simplicity at its core for everyone.",
                                        icon: <Users size={24} />,
                                        color: "violet",
                                      },
                                    ].map((feat, i) => (
                                      <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)] transition-all group relative overflow-hidden"
                                      >
                                        <div
                                          className={\`w-14 h-14 bg-\${feat.color}-50 rounded-2xl flex items-center justify-center text-\${feat.color}-600 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm\`}
                                        >
                                          {feat.icon}
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
                                          {feat.title}
                                        </h3>
                                        <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                          {feat.desc}
                                        </p>
                                        <div className="mt-6 flex items-center gap-2 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                          <span className="text-[10px] font-black uppercase tracking-widest">
                                            Learn More
                                          </span>
                                          <ChevronRight
                                            size={12}
                                            className="group-hover:translate-x-1 transition-transform"
                                          />
                                        </div>
                                        {/* Hover background detail */}
                                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </motion.div>
                                    ))}
                                  </div>
                                )}`;

if (code.includes(target)) {
  code = code.replace(target, '');
  fs.writeFileSync('src/App.tsx', code);
  console.log("Feature Cards removed");
} else {
  console.log("Could not find Feature Cards block");
}
