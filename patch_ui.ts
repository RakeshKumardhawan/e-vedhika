import fs from 'fs';

const targetFile = 'src/App.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const tUITarget = `<div className="space-y-3 pt-3 border-t border-slate-100">
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Flash Updates (ఫ్లాష్ అప్‌డేట్స్)</span>
                          <input type="checkbox" checked={notifSoundConfig.updates} onChange={async (e) => {
                            const val = e.target.checked;
                            setNotifSoundConfig(prev => ({...prev, updates: val}));
                            await setDoc(doc(db, "settings", "notification_sounds"), { updates: val }, { merge: true });
                            addToast(val ? "Sound enabled for Flash Updates" : "Sound muted for Flash Updates");
                          }} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">New Posts (కొత్త పోస్ట్‌లు)</span>
                          <input type="checkbox" checked={notifSoundConfig.posts} onChange={async (e) => {
                            const val = e.target.checked;
                            setNotifSoundConfig(prev => ({...prev, posts: val}));
                            await setDoc(doc(db, "settings", "notification_sounds"), { posts: val }, { merge: true });
                            addToast(val ? "Sound enabled for New Posts" : "Sound muted for New Posts");
                          }} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                          <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Alerts / Comments (లైక్‌లు / కామెంట్లు)</span>
                          <input type="checkbox" checked={notifSoundConfig.general} onChange={async (e) => {
                            const val = e.target.checked;
                            setNotifSoundConfig(prev => ({...prev, general: val}));
                            await setDoc(doc(db, "settings", "notification_sounds"), { general: val }, { merge: true });
                            addToast(val ? "Sound enabled for General Alerts" : "Sound muted for General Alerts");
                          }} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                        </label>
                      </div>`;

const tUIRepl = `<div className="space-y-4 pt-3 border-t border-slate-100">
                        {[
                          { key: 'updates', label: 'Flash Updates (ఫ్లాష్ అప్‌డేట్స్)' },
                          { key: 'posts', label: 'New Posts (కొత్త పోస్ట్‌లు)' },
                          { key: 'general', label: 'Alerts / Comments (లైక్‌లు / కామెంట్లు)' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between gap-4">
                            <span className="text-[13px] font-bold text-slate-600">{item.label}</span>
                            <div className="flex items-center gap-2">
                              <select 
                                className="text-xs p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-bold focus:ring-2 focus:ring-blue-500 outline-none w-36"
                                value={notifSoundConfig[item.key] || 'default_ding'}
                                onChange={async (e) => {
                                  let val = e.target.value;
                                  setNotifSoundConfig((prev: any) => ({...prev, [item.key]: val}));
                                  await setDoc(doc(db, "settings", "notification_sounds"), { [item.key]: val }, { merge: true });
                                  if (val !== 'false') playNotificationSound(val);
                                  addToast(\`Sound saved for \${item.label}\`);
                                }}
                              >
                                <option value="false">Mute (మ్యూట్)</option>
                                {NOTIFICATION_SOUNDS.map(sc => (
                                  <option key={sc.id} value={sc.id}>{sc.name}</option>
                                ))}
                              </select>
                              <button 
                                onClick={() => {
                                  const snd = notifSoundConfig[item.key] || 'default_ding';
                                  if (snd !== 'false') playNotificationSound(snd);
                                }}
                                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                title="Play Sample"
                              >
                                <Play size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>`;

content = content.replace(tUITarget, tUIRepl);

fs.writeFileSync(targetFile, content, 'utf8');
