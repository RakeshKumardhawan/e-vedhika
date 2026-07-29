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


fs.writeFileSync('src/components/UBDTracker.tsx', code);
