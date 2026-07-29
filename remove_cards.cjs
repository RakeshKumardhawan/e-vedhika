const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `        {/* SEO Content Section for Google AdSense */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">{landingPageData.card1Title}</h3>
            <div className="text-slate-600 leading-relaxed ql-editor px-0" dangerouslySetInnerHTML={{__html: landingPageData.card1Desc}} />
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">{landingPageData.card2Title}</h3>
            <div className="text-slate-600 leading-relaxed ql-editor px-0" dangerouslySetInnerHTML={{__html: landingPageData.card2Desc}} />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">{landingPageData.card3Title}</h3>
            <div className="text-slate-600 leading-relaxed ql-editor px-0" dangerouslySetInnerHTML={{__html: landingPageData.card3Desc}} />
          </div>
        </section>`;

if (code.includes(target1)) {
  code = code.replace(target1, '');
  console.log("Removed target 1");
}

const target2 = `                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-black text-slate-800 mb-3">{landingPageData.card1Title}</h3>
                              <div className="text-slate-600 text-sm leading-relaxed ql-editor px-0" dangerouslySetInnerHTML={{__html: landingPageData.card1Desc}} />
                            </div>
                            
                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-black text-slate-800 mb-3">{landingPageData.card2Title}</h3>
                              <div className="text-slate-600 text-sm leading-relaxed ql-editor px-0" dangerouslySetInnerHTML={{__html: landingPageData.card2Desc}} />
                            </div>

                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-black text-slate-800 mb-3">{landingPageData.card3Title}</h3>
                              <div className="text-slate-600 text-sm leading-relaxed ql-editor px-0" dangerouslySetInnerHTML={{__html: landingPageData.card3Desc}} />
                            </div>
                          </div>`;

if (code.includes(target2)) {
  code = code.replace(target2, '');
  console.log("Removed target 2");
}

fs.writeFileSync('src/App.tsx', code);
