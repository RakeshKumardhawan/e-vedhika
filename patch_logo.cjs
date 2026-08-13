const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const svgReplacement1 = `<motion.svg 
                  viewBox="0 0 64 64" 
                  className="w-14 h-14 shrink-0 relative z-10"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <defs>
                    <linearGradient id="gAdmin" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                    <linearGradient id="ringGAdmin" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="50%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                  <circle className="logo-ring" cx="32" cy="32" r="29" fill="none" stroke="url(#ringGAdmin)" strokeWidth="2.5" strokeDasharray="10 5" />
                  <circle cx="32" cy="32" r="25" fill="url(#gAdmin)" />
                  <circle cx="32" cy="32" r="21" fill="#0d3b66" />
                  <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="Segoe UI">EV</text>
                </motion.svg>`;

const svgReplacement2 = `<svg 
              viewBox="0 0 64 64" 
              className="w-16 h-16 shrink-0 relative z-10"
            >
              <defs>
                <linearGradient id="gAdmin2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
                <linearGradient id="ringGAdmin2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
              <circle className="logo-ring" cx="32" cy="32" r="29" fill="none" stroke="url(#ringGAdmin2)" strokeWidth="2.5" strokeDasharray="10 5" />
              <circle cx="32" cy="32" r="25" fill="url(#gAdmin2)" />
              <circle cx="32" cy="32" r="21" fill="#0d3b66" />
              <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="900" fontFamily="Segoe UI">EV</text>
            </svg>`;

code = code.replace(/<motion\.img\s+src="\/ev-logo-v2\.png"\s+alt="EV Logo"\s+className="w-14 h-14 object-contain relative z-10"\s+animate=\{\{ scale: \[1, 1\.05, 1\], rotate: \[0, 2, -2, 0\] \}\}\s+transition=\{\{ duration: 4, repeat: Infinity, ease: "easeInOut" \}\}\s+\/>/g, svgReplacement1);

code = code.replace(/<img src="\/ev-logo-v2\.png" alt="EV Logo" className="w-16 h-16 object-contain relative z-10" \/>/g, svgReplacement2);

fs.writeFileSync('src/App.tsx', code);
