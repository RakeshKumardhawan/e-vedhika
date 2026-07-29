const fs = require('fs');
let code = fs.readFileSync('src/components/UBDTracker.tsx', 'utf8');

// Add custom state
code = code.replace(
  "const [selectedGp, setSelectedGp] = useState('');",
  "const [selectedGp, setSelectedGp] = useState('');\n  const [isManualGp, setIsManualGp] = useState(false);\n  const [manualGpName, setManualGpName] = useState('');\n  const [manualOfficeId, setManualOfficeId] = useState('');"
);

// Modify handleFetch
code = code.replace(
  "if (!selectedDistrict || !selectedMandal || !selectedGp) {",
  "if (!selectedDistrict || !selectedMandal || (!isManualGp && !selectedGp) || (isManualGp && (!manualGpName || !manualOfficeId))) {"
);

code = code.replace(
  "const targetUrl = `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus${registerType}_Details.do?officeCode=${selectedGp}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;",
  "const targetOffice = isManualGp ? manualOfficeId : selectedGp;\n    const targetUrl = `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus${registerType}_Details.do?officeCode=${targetOffice}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;"
);

// Modify handlePdfDownload
code = code.replace(
  "const handlePdfDownload = () => {\n    if (!selectedGp) {\n      alert('Please select a Gram Panchayat first');\n      return;\n    }",
  "const handlePdfDownload = () => {\n    if ((!isManualGp && !selectedGp) || (isManualGp && (!manualGpName || !manualOfficeId))) {\n      alert('Please select or enter a Gram Panchayat first');\n      return;\n    }"
);

code = code.replace(
  "const gpData = gps.find(g => g.id === selectedGp);\n    const gpName = gpData ? gpData.name : 'Unknown GP';",
  "let gpName = 'Unknown GP';\n    let officeCode = selectedGp;\n    if (isManualGp) {\n      gpName = manualGpName;\n      officeCode = manualOfficeId;\n    } else {\n      const gpData = gps.find(g => g.id === selectedGp);\n      if (gpData) gpName = gpData.name;\n    }"
);

code = code.replace(
  "['Gram Panchayat', gpName],\n        ['Office Code / ID', selectedGp]",
  "['Gram Panchayat', gpName],\n        ['Office Code / ID', officeCode]"
);

// Add manual input UI
const selectGpUI = `<select 
              className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
              value={selectedGp}
              onChange={(e) => {
                setSelectedGp(e.target.value);
                setIframeSrc(null);
              }}
              disabled={!selectedMandal}
            >
              <option value="">-- Select GP --</option>
              {gps.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>`;

const newGpUI = `{!isManualGp ? (
              <div className="flex flex-col gap-2 w-full">
                <select 
                  className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium w-full"
                  value={selectedGp}
                  onChange={(e) => {
                    setSelectedGp(e.target.value);
                    setIframeSrc(null);
                  }}
                  disabled={!selectedMandal}
                >
                  <option value="">-- Select GP --</option>
                  {gps.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                <button onClick={() => setIsManualGp(true)} className="text-xs text-blue-600 font-bold self-start mt-1 hover:underline">లేదా మ్యాన్యువల్ గా ఎంటర్ చేయండి</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="GP Name" 
                    className="p-2.5 w-1/2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                    value={manualGpName}
                    onChange={e => setManualGpName(e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Office Code" 
                    className="p-2.5 w-1/2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                    value={manualOfficeId}
                    onChange={e => setManualOfficeId(e.target.value)}
                  />
                </div>
                <button onClick={() => setIsManualGp(false)} className="text-xs text-blue-600 font-bold self-start mt-1 hover:underline">జాబితా నుండి ఎంచుకోండి</button>
              </div>
            )}`;

code = code.replace(selectGpUI, newGpUI);

fs.writeFileSync('src/components/UBDTracker.tsx', code);
