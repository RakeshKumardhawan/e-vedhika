const fs = require('fs');
let code = fs.readFileSync('src/components/UBDTracker.tsx', 'utf8');

// Add custom mandal state
code = code.replace(
  "const [manualOfficeId, setManualOfficeId] = useState('');",
  "const [manualOfficeId, setManualOfficeId] = useState('');\n  const [isManualMandal, setIsManualMandal] = useState(false);\n  const [manualMandalName, setManualMandalName] = useState('');"
);

// Modify handleFetch
code = code.replace(
  "if (!selectedDistrict || !selectedMandal || (!isManualGp && !selectedGp) || (isManualGp && (!manualGpName || !manualOfficeId))) {",
  "if (!selectedDistrict || (!isManualMandal && !selectedMandal) || (isManualMandal && !manualMandalName) || (!isManualGp && !selectedGp) || (isManualGp && (!manualGpName || !manualOfficeId))) {"
);

// Add manual mandal UI
const selectMandalUI = `<select 
              className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              value={selectedMandal}
              onChange={(e) => {
                setSelectedMandal(e.target.value);
                setSelectedGp('');
                setIframeSrc(null);
              }}
              disabled={!selectedDistrict}
            >
              <option value="">-- Select Mandal --</option>
              {mandals.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>`;

const newMandalUI = `{!isManualMandal ? (
              <div className="flex flex-col gap-2 w-full">
                <select 
                  className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium w-full"
                  value={selectedMandal}
                  onChange={(e) => {
                    setSelectedMandal(e.target.value);
                    setSelectedGp('');
                    setIframeSrc(null);
                  }}
                  disabled={!selectedDistrict}
                >
                  <option value="">-- Select Mandal --</option>
                  {mandals.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <button onClick={() => setIsManualMandal(true)} className="text-xs text-blue-600 font-bold self-start mt-1 hover:underline">లేదా మ్యాన్యువల్ గా ఎంటర్ చేయండి</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <input 
                  type="text" 
                  placeholder="Mandal Name" 
                  className="p-2.5 w-full border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                  value={manualMandalName}
                  onChange={e => setManualMandalName(e.target.value)}
                />
                <button onClick={() => setIsManualMandal(false)} className="text-xs text-blue-600 font-bold self-start mt-1 hover:underline">జాబితా నుండి ఎంచుకోండి</button>
              </div>
            )}`;

code = code.replace(selectMandalUI, newMandalUI);

fs.writeFileSync('src/components/UBDTracker.tsx', code);
