const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const searchFirst = `<div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Lock size={40} className="text-blue-400" />
              </div>`;
const replaceFirst = `<div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-xl shadow-blue-500/10 overflow-hidden relative">
                <img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain animate-bounce" />
                <div className="absolute inset-0 bg-blue-400/20 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
              </div>`;

if (content.includes(searchFirst)) {
  content = content.replace(searchFirst, replaceFirst);
}

const searchSecond = `<div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Lock size={40} className="text-blue-400" />
          </div>`;
const replaceSecond = `<div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 shadow-xl shadow-blue-500/10 overflow-hidden relative">
            <img src="/ev-logo-v2.svg" alt="EV Logo" className="w-16 h-16 object-contain animate-bounce" />
            <div className="absolute inset-0 bg-blue-400/20 animate-ping rounded-full" style={{ animationDuration: '3s' }}></div>
          </div>`;

if (content.includes(searchSecond)) {
  content = content.replace(searchSecond, replaceSecond);
}

fs.writeFileSync('src/App.tsx', content);
