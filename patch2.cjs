const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');

const customAdUI = `
                {/* Custom Script / HTML Ads */}
                <div className="bg-white border-2 border-green-200 rounded-3xl p-6 shadow-sm mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Code className="text-green-500" size={24} />
                    <h5 className="font-black text-slate-800 text-lg">Custom HTML/JS Ads</h5>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-green-500 focus:ring-green-500" 
                        checked={siteConfig?.ads?.customAdsEnabled || false}
                        onChange={async (e) => {
                          const updatedAds = { ...(siteConfig?.ads || {}), customAdsEnabled: e.target.checked };
                          setSiteConfig((prev: any) => ({ ...prev, ads: updatedAds }));
                          try { localStorage.setItem("e_vedhika_ad_config", JSON.stringify(updatedAds)); } catch (err) {}
                          await setDoc(doc(db, "site_settings", "home_page"), { ads: updatedAds }, { merge: true }).catch(() => {});
                          await setDoc(doc(db, "settings", "site_config"), { ads: updatedAds }, { merge: true }).catch(() => {});
                          addToast(e.target.checked ? "Custom Ads Enabled" : "Custom Ads Disabled");
                        }}
                      />
                      <span className="font-bold text-slate-700">Enable Custom Ads (HTML/JS)</span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                       <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Sidebar Custom Ad Code (HTML/Script)</label>
                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono focus:border-green-500 outline-none h-32" 
                          placeholder="<script src='...'></script>"
                          value={siteConfig?.ads?.customAdCodeSidebar || ""}
                          onChange={(e) => {
                            const updatedAds = { ...(siteConfig?.ads || {}), customAdCodeSidebar: e.target.value };
                            setSiteConfig((prev: any) => ({ ...prev, ads: updatedAds }));
                          }}
                          onBlur={async (e) => {
                            const updatedAds = { ...(siteConfig?.ads || {}), customAdCodeSidebar: e.target.value };
                            try { localStorage.setItem("e_vedhika_ad_config", JSON.stringify(updatedAds)); } catch (err) {}
                            await setDoc(doc(db, "site_settings", "home_page"), { ads: updatedAds }, { merge: true }).catch(() => {});
                            await setDoc(doc(db, "settings", "site_config"), { ads: updatedAds }, { merge: true }).catch(() => {});
                            addToast("Saved Sidebar Custom Ad");
                          }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">In-Article Custom Ad Code (HTML/Script)</label>
                        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono focus:border-green-500 outline-none h-32" 
                          placeholder="<script src='...'></script>"
                          value={siteConfig?.ads?.customAdCodeInArticle || ""}
                          onChange={(e) => {
                            const updatedAds = { ...(siteConfig?.ads || {}), customAdCodeInArticle: e.target.value };
                            setSiteConfig((prev: any) => ({ ...prev, ads: updatedAds }));
                          }}
                          onBlur={async (e) => {
                            const updatedAds = { ...(siteConfig?.ads || {}), customAdCodeInArticle: e.target.value };
                            try { localStorage.setItem("e_vedhika_ad_config", JSON.stringify(updatedAds)); } catch (err) {}
                            await setDoc(doc(db, "site_settings", "home_page"), { ads: updatedAds }, { merge: true }).catch(() => {});
                            await setDoc(doc(db, "settings", "site_config"), { ads: updatedAds }, { merge: true }).catch(() => {});
                            addToast("Saved In-Article Custom Ad");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
`;

const searchStr = `                </div>
              </div>
            )}

            {activeSubTab === "code_manager" && (`;

if (content.includes(searchStr)) {
  const newContent = content.replace(searchStr, customAdUI + '            {activeSubTab === "code_manager" && (');
  fs.writeFileSync('src/App.tsx', newContent);
  console.log('Success patch2');
} else {
  console.log('Could not find anchor for patch2');
}
