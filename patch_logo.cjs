const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const searchStr = `<img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain animate-bounce" />`;
const replaceStr = `<img src="/ev-logo-v2.svg" alt="EV Logo" className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />`;

// Wait, looking at the user's screenshot, it looks like a dark circle in a white circle. Let's adjust the container background to transparent or dark so it fits better.
const searchContainerFirst = `<div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-xl shadow-blue-500/10 overflow-hidden relative">
                <img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain animate-bounce" />
                <div className="absolute inset-0 bg-blue-400/20 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
              </div>`;

const replaceContainerFirst = `<div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] relative">
                <img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain relative z-10" />
                <div className="absolute inset-0 bg-blue-500/10 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
              </div>`;

const searchContainerSecond = `<div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-xl shadow-blue-500/10 overflow-hidden relative">
            <img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain animate-bounce" />
            <div className="absolute inset-0 bg-blue-400/20 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
          </div>`;

const replaceContainerSecond = `<div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] relative">
            <img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain relative z-10" />
            <div className="absolute inset-0 bg-blue-500/10 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
          </div>`;

content = content.replace(searchContainerFirst, replaceContainerFirst);
content = content.replace(searchContainerSecond, replaceContainerSecond);

fs.writeFileSync('src/App.tsx', content);
