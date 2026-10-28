import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Download, Upload, Info, Search, Zap, ListFilter, Check, 
  Building, MapPin, Star, Share2, Copy, History, Trash2, ExternalLink, 
  RefreshCw, Layers, Sparkles, Sliders, ArrowRight, HelpCircle, FileSpreadsheet, Settings
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { DEFAULT_DISTRICTS_DATA } from '../data/districts';

// Default master dataset subset
const defaultUbdData = [
  {"Sl.No":"1","District Name":"ADILABAD","Mandal Name":"Adilabad","Gp Name":"Allikori","Office id":"20001"},
  {"Sl.No":"472","District Name":"BHADRADRI KOTHAGUDEM","Mandal Name":"Allapalli","Gp Name":"Adaviramaram","Office id":"280102"},
  {"Sl.No":"949","District Name":"HANUMAKONDA","Mandal Name":"Atmakur","Gp Name":"Agrampahad","Office id":"213256"},
  {"Sl.No":"1159","District Name":"JAGTIAL","Mandal Name":"Bheemaram","Gp Name":"Bheemaram","Office id":"2535"},
  {"Sl.No":"1543","District Name":"JANGOAN","Mandal Name":"Bachannapeta","Gp Name":"Alimpur","Office id":"213283"},
  {"Sl.No":"1822","District Name":"JAYASHANKAR BHUPALPALLI","Mandal Name":"Bhupalpalle","Gp Name":"Amudalapally","Office id":"277989"},
  {"Sl.No":"2065","District Name":"JOGULAMBA GADWAL","Mandal Name":"Aiza","Gp Name":"Bhoompur","Office id":"204787"},
  {"Sl.No":"2320","District Name":"KAMAREDDY","Mandal Name":"Banswada","Gp Name":"Borlam","Office id":"209231"},
  {"Sl.No":"2847","District Name":"KARIMNAGAR","Mandal Name":"Chigurumamidi","Gp Name":"Bommanapalli","Office id":"201022"},
  {"Sl.No":"3162","District Name":"KHAMMAM","Mandal Name":"Bonakal","Gp Name":"Allapadu","Office id":"21370"},
  {"Sl.No":"3736","District Name":"KOMARAMBHEEM ASIFABAD","Mandal Name":"Asifabad","Gp Name":"Ada","Office id":"194932"},
  {"Sl.No":"4071","District Name":"MAHABUBABAD","Mandal Name":"Bayyaram","Gp Name":"Alligudem","Office id":"280160"},
  {"Sl.No":"4534","District Name":"MAHABUBNAGAR","Mandal Name":"Addakal","Gp Name":"Addakal","Office id":"10262"},
  {"Sl.No":"4956","District Name":"MANCHERIAL","Mandal Name":"Bellampalle","Gp Name":"Akenipalle","Office id":"195003"},
  {"Sl.No":"5262","District Name":"MEDAK","Mandal Name":"Alladurg","Gp Name":"Alladurg","Office id":"10001"},
  {"Sl.No":"5731","District Name":"MULUGU","Mandal Name":"Eturnagaram","Gp Name":"Allamwari Ghanapuram","Office id":"20909"},
  {"Sl.No":"5902","District Name":"NAGARKURNOOL","Mandal Name":"Achampeta","Gp Name":"Akkaram","Office id":"204747"},
  {"Sl.No":"6360","District Name":"NALGONDA","Mandal Name":"Adavidevulapally","Gp Name":"Adavi Devulapally","Office id":"10425"},
  {"Sl.No":"7209","District Name":"NARAYANPET","Mandal Name":"Damaragidda","Gp Name":"Annasagar","Office id":"205007"},
  {"Sl.No":"7483","District Name":"NIRMAL","Mandal Name":"Basar","Gp Name":"Basar","Office id":"1741"},
  {"Sl.No":"7880","District Name":"NIZAMABAD","Mandal Name":"Aloor","Gp Name":"Aloor","Office id":"1539"},
  {"Sl.No":"8414","District Name":"PEDDAPALLI","Mandal Name":"Anthargaon","Gp Name":"Akenapalli","Office id":"2936"},
  {"Sl.No":"8679","District Name":"RAJANNA SIRCILLA","Mandal Name":"Boinpalle","Gp Name":"Anathapally","Office id":"200980"},
  {"Sl.No":"8935","District Name":"RANGAREDDY","Mandal Name":"Abdullapurmet","Gp Name":"Abdullapur","Office id":"3152"},
  {"Sl.No":"9464","District Name":"SANGAREDDY","Mandal Name":"Ameenpur","Gp Name":"Janakampet","Office id":"277878"},
  {"Sl.No":"10081","District Name":"SIDDIPET","Mandal Name":"AkbarpetNA Bhoompally","Gp Name":"Akberpet","Office id":"206541"},
  {"Sl.No":"10581","District Name":"SURYAPET","Mandal Name":"Ananthagiri","Gp Name":"Ameenabad","Office id":"207584"},
  {"Sl.No":"11063","District Name":"VIKARABAD","Mandal Name":"Bantaram","Gp Name":"Bantaram","Office id":"2998"},
  {"Sl.No":"11644","District Name":"WANAPARTHY","Mandal Name":"Amarachintha","Gp Name":"Chandragad","Office id":"205745"},
  {"Sl.No":"11910","District Name":"WARANGAL","Mandal Name":"Chennaraopet","Gp Name":"16-Chintala Thanda","Office id":"278082"},
  {"Sl.No":"12233","District Name":"YADADRI BHUVANAGIRI","Mandal Name":"Addagudur","Gp Name":"Addagudur","Office id":"207724"}
];

export function UBDTracker({ user, addToast }: { user: any; addToast: (msg: string) => void }) {
  const [ubdData, setUbdData] = useState<any[]>(defaultUbdData);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await fetch('/api/ubd/data');
        if (res.ok) {
          const rawData = await res.json();
          if (rawData && rawData.length > 0) {
            const sanitizedData = rawData.map((item: any) => {
              const newItem: any = {};
              Object.keys(item).forEach(key => {
                newItem[key.trim().toLowerCase()] = item[key];
              });
              return newItem;
            });
            setUbdData(sanitizedData);
          }
        }
      } catch (err: any) {
        // Silently catch error
      } finally {
        setLoadingData(false);
      }
    };
    fetchMasterData();
  }, []);

  const [selectedState, setSelectedState] = useState<'TS' | 'AP'>('TS');
  const [registerType, setRegisterType] = useState<'BIR' | 'DEA'>('BIR');
  const [entryMode, setEntryMode] = useState<'direct' | 'dropdown' | 'batch'>('direct');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickOfficeCode, setQuickOfficeCode] = useState('');

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('');
  const [selectedGp, setSelectedGp] = useState('');
  const [isManualGp, setIsManualGp] = useState(false);
  const [manualGpName, setManualGpName] = useState('');
  const [manualOfficeId, setManualOfficeId] = useState('');
  const [isManualMandal, setIsManualMandal] = useState(false);
  const [manualMandalName, setManualMandalName] = useState('');

  // Batch Lookup state
  const [batchInputText, setBatchInputText] = useState('');
  const [batchResults, setBatchResults] = useState<any[]>([]);

  const [favorites, setFavorites] = useState<{ officeId: string; gpName: string; mandal?: string; district?: string }[]>(() => {
    try {
      const saved = localStorage.getItem('ubd_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentVisits, setRecentVisits] = useState<{ officeId: string; gpName: string; mandal?: string; district?: string }[]>(() => {
    try {
      const saved = localStorage.getItem('ubd_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (item: { officeId: string; gpName: string; mandal?: string; district?: string }) => {
    const exists = favorites.some(f => f.officeId === item.officeId);
    let updated: { officeId: string; gpName: string; mandal?: string; district?: string }[];
    if (exists) {
      updated = favorites.filter(f => f.officeId !== item.officeId);
      addToast(`${item.gpName || item.officeId} ఫేవరెట్స్ నుండి తొలగించబడింది`);
    } else {
      updated = [item, ...favorites.filter(f => f.officeId !== item.officeId)];
      addToast(`⭐ ${item.gpName || item.officeId} ఫేవరెట్స్‌లో జోడించబడింది!`);
    }
    setFavorites(updated);
    try {
      localStorage.setItem('ubd_favorites', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const addRecentVisit = (item: { officeId: string; gpName: string; mandal?: string; district?: string }) => {
    const filtered = recentVisits.filter(r => r.officeId !== item.officeId);
    const updated = [item, ...filtered].slice(0, 8);
    setRecentVisits(updated);
    try {
      localStorage.setItem('ubd_recent', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const getTargetUrl = (officeCode: string, regType: 'BIR' | 'DEA' = registerType, state: 'TS' | 'AP' = selectedState) => {
    const baseUrl = state === 'TS' 
      ? 'https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus' 
      : 'https://epanchayat.ap.gov.in/UBDMIS/ubdmisAPTotalStatus';
    return `${baseUrl}${regType}_Details.do?officeCode=${officeCode}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
  };

  const copyOrShareUrl = (officeCode: string, gpName?: string) => {
    const targetUrl = getTargetUrl(officeCode);
    const shareText = `🏛️ *E-Vedhika UBD MIS Tracker*\n` +
      `📌 *గ్రామ పంచాయతీ:* ${gpName || 'Gram Panchayat'}\n` +
      `🆔 *Reg.Unit Id:* \`${officeCode}\`\n` +
      `📂 *విభాగం:* ${selectedState} UBD ${registerType === 'BIR' ? 'Birth Register' : 'Death Register'}\n\n` +
      `👇 వివరాల కోసం క్రింది లింక్ క్లిక్ చేయండి:\n${targetUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${selectedState === 'TS' ? 'Telangana' : 'Andhra Pradesh'} UBD MIS - ${gpName || officeCode}`,
        text: shareText,
        url: targetUrl
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        addToast("వాట్సాప్ సందేశం & లింక్ కాపీ చేయబడింది!");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      addToast("వాట్సాప్ సందేశం & లింక్ కాపీ చేయబడింది!");
    }
  };

  const copyOfficeCodeToClipboard = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    addToast(`Reg.Unit Id [${code}] కాపీ చేయబడింది!`);
  };

  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.email === "rakeshkumardhawan123@gmail.com" || user?.email === "Rakeshkumardhawan123@gmail.com";

  const ALL_DISTRICTS = [
    "ADILABAD", "BHADRADRI KOTHAGUDEM", "HANUMAKONDA", "HYDERABAD", "JAGTIAL", "JANGOAN",
    "JAYASHANKAR BHUPALPALLI", "JOGULAMBA GADWAL", "KAMAREDDY", "KARIMNAGAR", "KHAMMAM",
    "KOMARAMBHEEM ASIFABAD", "MAHABUBABAD", "MAHABUBNAGAR", "MANCHERIAL", "MEDAK",
    "MEDCHAL MALKAJGIRI", "MULUGU", "NAGARKURNOOL", "NALGONDA", "NARAYANPET", "NIRMAL",
    "NIZAMABAD", "PEDDAPALLI", "RAJANNA SIRCILLA", "RANGAREDDY", "SANGAREDDY", "SIDDIPET",
    "SURYAPET", "VIKARABAD", "WANAPARTHY", "WARANGAL", "YADADRI BHUVANAGIRI"
  ];

  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set([
      ...ALL_DISTRICTS,
      ...ubdData.map(item => String(item['district name'] || '').trim().toUpperCase())
    ])].filter(Boolean);
    return uniqueDistricts.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  }, [ubdData]);

  const mandals = useMemo(() => {
    if (!selectedDistrict) return [];
    
    const filtered = ubdData.filter(item => 
      String(item['district name'] || '').trim().toUpperCase() === selectedDistrict.toUpperCase()
    );
    const ubdMandals = filtered.map(item => String(item['mandal name'] || '').trim());
    
    const districtKey = Object.keys(DEFAULT_DISTRICTS_DATA).find(
      key => key.toUpperCase().replace(/[\s\-]/g, '') === selectedDistrict.toUpperCase().replace(/[\s\-]/g, '')
    );
    const hardcodedMandals = districtKey ? DEFAULT_DISTRICTS_DATA[districtKey] : [];

    return [...new Set([...ubdMandals, ...hardcodedMandals])]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
  }, [selectedDistrict, ubdData]);

  const gps = useMemo(() => {
    if (!selectedDistrict || !selectedMandal) return [];
    const filtered = ubdData.filter(item => 
      String(item['district name'] || '').trim().toUpperCase() === selectedDistrict.toUpperCase() && 
      String(item['mandal name'] || '').trim().toUpperCase() === selectedMandal.toUpperCase()
    );
    return filtered
      .map(item => ({ id: String(item['office id'] || ''), name: String(item['gp name'] || '').trim() }))
      .filter(item => item.id && item.name)
      .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
  }, [selectedDistrict, selectedMandal, ubdData]);

  // Search Results for Smart Search
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();
    
    return ubdData.filter(item => {
      const gp = String(item['gp name'] || '').toLowerCase();
      const mandal = String(item['mandal name'] || '').toLowerCase();
      const district = String(item['district name'] || '').toLowerCase();
      const officeId = String(item['office id'] || '').toLowerCase();
      return gp.includes(term) || mandal.includes(term) || district.includes(term) || officeId.includes(term);
    }).slice(0, 20);
  }, [searchTerm, ubdData]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        let data: any[] = [];
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(bstr as string);
        } else {
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          data = XLSX.utils.sheet_to_json(ws);
        }
        
        const sanitizedData = data.map(item => {
          const newItem: any = {};
          Object.keys(item).forEach(key => {
            newItem[key.trim().toLowerCase()] = item[key];
          });
          return newItem;
        });

        if (sanitizedData.length > 0) {
          setUbdData(sanitizedData);
          
          if (isAdmin) {
            const saveToServer = async () => {
              try {
                const token = await auth.currentUser?.getIdToken();
                const res = await fetch('/api/ubd/data', {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(sanitizedData)
                });
                if (!res.ok) throw new Error("Failed to save to server");
                addToast("సర్వర్‌లో డేటా విజయవంతంగా అప్‌డేట్ చేయబడింది! అందరు వినియోగదారులు ఇప్పుడు దీన్ని చూడగలరు.");
              } catch (error) {
                console.error("Failed to update server data:", error);
                addToast("డేటా అప్‌డేట్ విఫలమైంది.");
              }
            };
            saveToServer();
          }
          setSelectedDistrict('');
          setSelectedMandal('');
          setSelectedGp('');
          addToast("పూర్తి వివరాలు అప్‌డేట్ చేయబడ్డాయి!");
        } else {
          addToast("ఫైల్‌లో డేటా లేదు!");
        }
      } catch (err) {
        addToast("ఫైల్ చదవడంలో లోపం జరిగింది!");
        console.error(err);
      }
    };
    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const notifyUbdActivity = (action: string, officeCode?: string, gpName?: string, mandal?: string, district?: string) => {
    fetch('/api/ubd/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        officeCode,
        gpName,
        mandal,
        district,
        registerType,
        userName: user?.displayName || user?.email || 'User'
      })
    }).catch(() => {});
  };

  const handleOpenByOfficeCode = (code: string, gpName?: string, mandal?: string, district?: string) => {
    if (!code || !code.trim()) {
      addToast("దయచేసి సరైన Reg.Unit Id ఎంటర్ చేయండి!");
      return;
    }
    const cleanCode = code.trim();
    if (district) setSelectedDistrict(district);
    if (mandal) setSelectedMandal(mandal);
    if (gpName) {
      setManualGpName(gpName);
      setIsManualGp(true);
      setManualOfficeId(cleanCode);
    } else {
      setManualOfficeId(cleanCode);
      setIsManualGp(true);
    }

    addRecentVisit({
      officeId: cleanCode,
      gpName: gpName || cleanCode,
      mandal: mandal || selectedMandal,
      district: district || selectedDistrict
    });

    const targetUrl = getTargetUrl(cleanCode);
    setIframeSrc(targetUrl);
    addToast(`Reg.Unit Id [${cleanCode}] (${selectedState}) తో రిజిస్టర్ ఓపెన్ చేయబడింది!`);
    notifyUbdActivity("ఆఫీస్ కోడ్ శోధన (Office Code Opened)", cleanCode, gpName, mandal, district);
  };

  const handleFetch = () => {
    const effMandal = isManualMandal ? manualMandalName : selectedMandal;
    const effOfficeCode = isManualGp ? manualOfficeId : selectedGp;

    if (!selectedDistrict || !effMandal || !effOfficeCode) {
      addToast("దయచేసి జిల్లా, మండలం మరియు గ్రామ పంచాయతీ (లేదా Reg.Unit Id) ఎంచుకోండి!");
      return;
    }

    let effGpName = 'Gram Panchayat';
    if (isManualGp) {
      effGpName = manualGpName || effOfficeCode;
    } else {
      const g = gps.find(item => item.id === selectedGp);
      if (g) effGpName = g.name;
    }

    addRecentVisit({
      officeId: effOfficeCode,
      gpName: effGpName,
      mandal: effMandal,
      district: selectedDistrict
    });

    const targetUrl = getTargetUrl(effOfficeCode);
    setIframeSrc(targetUrl);
  };
  
  const handlePdfDownload = () => {
    const effMandal = isManualMandal ? manualMandalName : selectedMandal;
    let effGpName = 'Gram Panchayat';
    let effOfficeCode = selectedGp;

    if (isManualGp) {
      effGpName = manualGpName || 'Gram Panchayat';
      effOfficeCode = manualOfficeId;
    } else {
      const gpInfo = gps.find(g => g.id === selectedGp);
      if (gpInfo) {
        effGpName = gpInfo.name;
      }
    }

    if (!effOfficeCode) {
      addToast("దయచేసి Reg.Unit Id ఎంచుకోండి!");
      return;
    }

    const regTypeName = registerType === 'BIR' ? 'Birth Register' : 'Death Register';

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${selectedState} UBDMIS - ${regTypeName}`, 14, 20);
    
    doc.setFontSize(12);
    autoTable(doc, {
      startY: 30,
      head: [['Parameter', 'Details']],
      body: [
        ['State Portal', selectedState === 'TS' ? 'Telangana UBDMIS' : 'Andhra Pradesh UBDMIS'],
        ['Register Type', regTypeName],
        ['District', selectedDistrict || 'N/A'],
        ['Mandal', effMandal || 'N/A'],
        ['Gram Panchayat', effGpName],
        ['Reg.Unit Id', effOfficeCode],
        ['Direct Status URL', getTargetUrl(effOfficeCode)]
      ]
    });

    doc.save(`${effGpName}_${regTypeName}.pdf`);
    notifyUbdActivity("UBD సర్టిఫికేట్ డౌన్‌లోడ్ (PDF Generated)", effOfficeCode, effGpName, effMandal, selectedDistrict);
  };

  // Process Batch Lookup Input
  const handleBatchLookup = () => {
    if (!batchInputText.trim()) {
      addToast("దయచేసి ఒకటి లేదా అంతకంటే ఎక్కువ Reg.Unit IDలు లేదా GP పేర్లను నమోదు చేయండి");
      return;
    }

    const tokens = batchInputText
      .split(/[\n,;\t]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (tokens.length === 0) {
      addToast("చెల్లుబాటు అయ్యే ఐడీలు లభించలేదు");
      return;
    }

    const results: any[] = [];
    tokens.forEach((token, idx) => {
      const isNumeric = /^\d+$/.test(token);
      let match = null;

      if (isNumeric) {
        match = ubdData.find(item => String(item['office id'] || '').trim() === token);
      } else {
        match = ubdData.find(item => String(item['gp name'] || '').trim().toLowerCase().includes(token.toLowerCase()));
      }

      if (match) {
        results.push({
          sno: idx + 1,
          token,
          officeId: String(match['office id'] || token),
          gpName: String(match['gp name'] || 'GP'),
          mandal: String(match['mandal name'] || '-'),
          district: String(match['district name'] || '-'),
          status: 'FOUND'
        });
      } else {
        results.push({
          sno: idx + 1,
          token,
          officeId: isNumeric ? token : 'Custom',
          gpName: isNumeric ? `GP #${token}` : token,
          mandal: '-',
          district: '-',
          status: 'DIRECT_CODE'
        });
      }
    });

    setBatchResults(results);
    addToast(`${results.length} యూనిట్ల వివరాలు విశ్లేషించబడ్డాయి!`);
  };

  const exportBatchToExcel = () => {
    if (batchResults.length === 0) return;
    const excelData = batchResults.map(r => ({
      "S.No": r.sno,
      "District": r.district,
      "Mandal": r.mandal,
      "Gram Panchayat": r.gpName,
      "Reg.Unit ID": r.officeId,
      "Birth Register Link": getTargetUrl(r.officeId, 'BIR'),
      "Death Register Link": getTargetUrl(r.officeId, 'DEA')
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "UBD_Batch_Report");
    XLSX.writeFile(wb, `UBD_Batch_Units_Report_${Date.now()}.xlsx`);
    addToast("Excel ఫైల్ డౌన్‌లోడ్ చేయబడింది!");
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Portal Quick Action & Shortcut Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                <Sparkles size={11} className="text-indigo-400" /> UBD MIS Portal Suite v2.0
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">
                12,230+ GP Master Records
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              🏛️ UBD మిస్ ట్రాకర్ &amp; డెస్క్‌టాప్ సెట్టింగ్స్ హబ్
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-1">
              తెలంగాణ &amp; ఏపీ గ్రామ పంచాయతీల జనన, మరణాల రిజిస్టర్లు, Reg.Unit Id సెర్చ్ మరియు ఆఫీషియల్ పోర్టల్ సర్వీసులు.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <a
              href="https://ubdmis.telangana.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
            >
              <ExternalLink size={14} /> TS UBD Portal
            </a>
            <a
              href="https://epanchayat.ap.gov.in/UBDMIS/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
            >
              <ExternalLink size={14} /> AP UBD Portal
            </a>
            <a
              href="/ubd-settings-dsk-issues"
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Settings size={14} /> UBD &amp; DSK గైడ్
            </a>
          </div>
        </div>
      </div>

      {/* Admin File Upload Banner */}
      {isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-2xl text-amber-700 shrink-0">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">అన్ని జిల్లాల మాస్టర్ డేటా రీఫ్రెష్ చేయాలా?</h3>
              <p className="text-xs text-amber-800 font-medium">నవీకరించబడిన 'ubd.xlsx' ఫైల్‌ను ఇక్కడ అప్‌లోడ్ చేసి క్లౌడ్ డేటాబేస్ ఆటో-సింక్ చేయండి.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            >
              <Upload size={14} /> అప్‌లోడ్ ubd.xlsx
            </button>
            {ubdData.length > 50 && (
              <button 
                onClick={() => {
                  if (window.confirm('సర్వర్ లోని UBD మాస్టర్ డేటాను క్లియర్ చేయాలనుకుంటున్నారా?')) {
                    const clearServerData = async () => {
                      try {
                        const token = await auth.currentUser?.getIdToken();
                        const res = await fetch('/api/ubd/data', {
                          method: 'POST',
                          headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify([])
                        });
                        if (!res.ok) throw new Error("Failed to clear on server");
                        
                        setUbdData(defaultUbdData);
                        setSelectedDistrict('');
                        setSelectedMandal('');
                        setSelectedGp('');
                        addToast("సర్వర్ నుండి డేటా క్లియర్ చేయబడింది!");
                      } catch (error) {
                        console.error("Failed to clear server data:", error);
                        addToast("క్లియర్ చేయడం విఫలమైంది.");
                      }
                    };
                    clearServerData();
                  }
                }}
                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv, .json, .txt, .dat, .raw, .xml" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
            />
          </div>
        </div>
      )}

      {/* Main Interactive Control Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-5 sm:p-6 space-y-6">
        
        {/* State Selector & Main Header */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner mb-4">
            <button
              type="button"
              onClick={() => setSelectedState('TS')}
              className={`px-8 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedState === 'TS' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <MapPin size={16} /> Telangana UBD
            </button>
            <button
              type="button"
              onClick={() => setSelectedState('AP')}
              className={`px-8 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                selectedState === 'AP' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <MapPin size={16} /> Andhra Pradesh UBD
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 border border-slate-200 bg-slate-50/80 px-6 py-2 rounded-2xl shadow-xs inline-block">
              {selectedState} UBD {registerType === 'BIR' ? 'Birth Register (జనన నమోదు)' : 'Death Register (మరణ నమోదు)'}
            </h2>
          </div>
        </div>

        {/* Quick Favorites & Recent Visits Bar */}
        {(favorites.length > 0 || recentVisits.length > 0) && (
          <div className="space-y-3 bg-gradient-to-r from-amber-50/60 via-slate-50 to-emerald-50/60 p-4 rounded-2xl border border-slate-200">
            {favorites.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Star size={14} className="text-amber-500 fill-amber-400" /> ⭐ నా ఫేవరెట్ గ్రామ పంచాయతీలు ({favorites.length}):
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {favorites.map((fav) => (
                    <div
                      key={fav.officeId}
                      className="group flex items-center gap-1.5 bg-white hover:bg-amber-100/80 border border-amber-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                      onClick={() => handleOpenByOfficeCode(fav.officeId, fav.gpName, fav.mandal, fav.district)}
                    >
                      <span className="text-amber-500">⭐</span>
                      <span>{fav.gpName || fav.officeId}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-mono px-1.5 py-0.5 rounded">
                        {fav.officeId}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(fav);
                        }}
                        className="text-slate-400 hover:text-red-500 ml-1 p-0.5 rounded-full"
                        title="ఫేవరెట్స్ నుండి తీసివేయి"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentVisits.length > 0 && (
              <div className={favorites.length > 0 ? "pt-2 border-t border-slate-200/60" : ""}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <History size={14} className="text-blue-500" /> 🕒 ఇటీవల వీక్షించినవి (Recent Visits):
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentVisits([]);
                      localStorage.removeItem('ubd_recent');
                      addToast("రీసెంట్ హిస్టరీ క్లియర్ చేయబడింది");
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-500 font-medium cursor-pointer"
                  >
                    Clear History
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentVisits.map((rec) => (
                    <button
                      type="button"
                      key={rec.officeId}
                      onClick={() => handleOpenByOfficeCode(rec.officeId, rec.gpName, rec.mandal, rec.district)}
                      className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <MapPin size={12} className="text-emerald-600" />
                      <span>{rec.gpName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({rec.officeId})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Register Type & Entry Mode Navigation Tabs */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
          {/* Register Type Switcher */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider whitespace-nowrap">రిజిస్టర్ రకం:</label>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto shadow-xs">
              <button
                type="button"
                onClick={() => { setRegisterType('BIR'); setIframeSrc(null); }}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  registerType === 'BIR' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Birth Register (జనన నమోదు)
              </button>
              <button
                type="button"
                onClick={() => { setRegisterType('DEA'); setIframeSrc(null); }}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  registerType === 'DEA' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Death Register (మరణ నమోదు)
              </button>
            </div>
          </div>

          {/* Entry Mode Switcher */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full lg:w-auto shadow-xs">
            <button
              type="button"
              onClick={() => setEntryMode('direct')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                entryMode === 'direct' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap size={14} /> డైరెక్ట్ సెర్చ్ / ఆఫీస్ కోడ్
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('dropdown')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                entryMode === 'dropdown' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ListFilter size={14} /> జిల్లా &amp; మండలాల ఎంపిక
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('batch')}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                entryMode === 'batch' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers size={14} /> మల్టీ-యూనిట్ బ్యాచ్ శోధన
            </button>
          </div>
        </div>

        {/* TAB 1: DIRECT SMART SEARCH & QUICK OFFICE CODE */}
        {entryMode === 'direct' && (
          <div className="space-y-6">
            
            {/* Quick Office Code Input Block */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200 p-5 rounded-2xl shadow-xs">
              <label className="text-xs font-extrabold text-blue-900 uppercase tracking-wide flex items-center gap-1.5 mb-2.5">
                <Building size={16} className="text-blue-600" /> Reg.Unit Id (ఆఫీస్ కోడ్) తెలిసి ఉంటే నేరుగా ఎంటర్ చేయండి:
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ఉదాహరణ: 20001, 280102, 213256..."
                    value={quickOfficeCode}
                    onChange={(e) => setQuickOfficeCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleOpenByOfficeCode(quickOfficeCode);
                    }}
                    className="w-full p-3.5 border border-blue-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono font-black text-slate-800 text-sm shadow-inner"
                  />
                  {quickOfficeCode && (
                    <button
                      type="button"
                      onClick={() => setQuickOfficeCode('')}
                      className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenByOfficeCode(quickOfficeCode)}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap text-xs sm:text-sm"
                >
                  <FileText size={18} /> నేరుగా రిజిస్టర్ ఓపెన్ చేయి &rarr;
                </button>
              </div>
            </div>

            {/* Smart Live Search Box */}
            <div className="relative">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wide flex items-center justify-between gap-1.5 mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Search size={16} className="text-emerald-600" /> గ్రామ పంచాయతీ / మండలం / జిల్లా పేరుతో వెతకండి (Smart Live Search):
                </span>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {ubdData.length.toLocaleString()} గ్రామ పంచాయతీల రికార్డులు
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="మీ GP పేరు లేదా మండలం టైప్ చేయండి (ఉదా: Borlam, Adilabad, Basar, Alladurg)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 pl-12 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/80 font-bold text-slate-800 text-sm shadow-inner"
                />
                <Search size={20} className="absolute left-4 top-4 text-slate-400" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-4 text-xs bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded-full text-slate-700 font-bold cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Live Search Results List */}
              {searchTerm.trim().length > 0 && (
                <div className="mt-3 border border-slate-200 bg-white rounded-2xl shadow-xl max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2 custom-scrollbar">
                  {searchResults.length > 0 ? (
                    searchResults.map((item, index) => {
                      const gpName = String(item['gp name'] || '').trim();
                      const mandal = String(item['mandal name'] || '').trim();
                      const district = String(item['district name'] || '').trim();
                      const officeId = String(item['office id'] || '').trim();

                      return (
                        <div
                          key={index}
                          onClick={() => handleOpenByOfficeCode(officeId, gpName, mandal, district)}
                          className="p-3.5 hover:bg-emerald-50/90 rounded-2xl cursor-pointer transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group border border-transparent hover:border-emerald-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                              <MapPin size={20} />
                            </div>
                            <div>
                              <div className="font-black text-slate-800 group-hover:text-emerald-950 text-base">
                                {gpName} <span className="text-xs text-slate-500 font-bold">GP</span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                                <span>మండలం: <strong className="text-slate-700 font-bold">{mandal}</strong></span>
                                <span>•</span>
                                <span>జిల్లా: <strong className="text-slate-700 font-bold">{district}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={(e) => copyOfficeCodeToClipboard(officeId, e)}
                              className="p-2 rounded-xl border bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-2xs"
                              title="Reg.Unit Id కాపీ చేయి"
                            >
                              <Copy size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite({ officeId, gpName, mandal, district });
                              }}
                              className={`p-2 rounded-xl border transition-colors shadow-2xs ${
                                favorites.some(f => f.officeId === officeId)
                                  ? 'bg-amber-100 border-amber-300 text-amber-600'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                              }`}
                              title={favorites.some(f => f.officeId === officeId) ? "ఫేవరెట్స్ నుండి తీసివేయి" : "ఫేవరెట్స్‌లో జోడించు"}
                            >
                              <Star size={16} className={favorites.some(f => f.officeId === officeId) ? "fill-amber-400 text-amber-500" : ""} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyOrShareUrl(officeId, gpName);
                              }}
                              className="p-2 rounded-xl border bg-white border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shadow-2xs"
                              title="వాట్సాప్ సందేశం & లింక్ షేర్ చేయండి"
                            >
                              <Share2 size={16} />
                            </button>

                            <span className="text-xs font-mono font-black bg-slate-100 px-2.5 py-1.5 rounded-xl text-slate-800 border border-slate-200">
                              Id: {officeId}
                            </span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              ఓపెన్ &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-sm text-slate-500 font-medium">
                      ఈ పేరుతో గ్రామ పంచాయతీ లభించలేదు. మీ Reg.Unit Id తెలిస్తే పైన డైరెక్ట్ ఆఫీస్ కోడ్ స్థలంలో నమోదు చేయండి.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: DROPDOWN SELECTOR */}
        {entryMode === 'dropdown' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* District */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">జిల్లా ఎంచుకోండి (District)</label>
                <select 
                  className="p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-slate-800 text-sm"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedMandal('');
                    setSelectedGp('');
                    setIframeSrc(null);
                  }}
                >
                  <option value="">-- జిల్లా --</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              {/* Mandal */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">మండలం ఎంచుకోండి (Mandal)</label>
                {!isManualMandal ? (
                  <div className="flex flex-col gap-2 w-full">
                    <select 
                      className="p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-slate-800 text-sm w-full"
                      value={selectedMandal}
                      onChange={(e) => {
                        setSelectedMandal(e.target.value);
                        setSelectedGp('');
                        setIframeSrc(null);
                      }}
                      disabled={!selectedDistrict}
                    >
                      <option value="">-- మండలం --</option>
                      {mandals.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setIsManualMandal(true)} className="text-xs text-blue-600 font-bold self-start hover:underline cursor-pointer">
                      లేదా మ్యాన్యువల్ గా మండలం టైప్ చేయండి
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <input 
                      type="text" 
                      placeholder="Mandal Name" 
                      className="p-3 w-full border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-slate-800 text-sm"
                      value={manualMandalName}
                      onChange={e => setManualMandalName(e.target.value)}
                    />
                    <button type="button" onClick={() => setIsManualMandal(false)} className="text-xs text-blue-600 font-bold self-start hover:underline cursor-pointer">
                      జాబితా నుండి ఎంచుకోండి
                    </button>
                  </div>
                )}
              </div>
              
              {/* Gram Panchayat */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex justify-between items-center">
                  <span>గ్రామ పంచాయతీ (GP Dropdown)</span>
                  {gps.length > 0 && (
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {gps.length} GPలు
                    </span>
                  )}
                </label>
                {!isManualGp ? (
                  <div className="flex flex-col gap-2 w-full">
                    <select 
                      className="p-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-slate-800 text-sm w-full"
                      value={selectedGp}
                      onChange={(e) => {
                        setSelectedGp(e.target.value);
                        setIframeSrc(null);
                      }}
                      disabled={!selectedMandal}
                    >
                      <option value="">
                        {!selectedMandal 
                          ? '-- ముందుగా మండలం ఎంచుకోండి --' 
                          : gps.length > 0 
                            ? '-- GP ఎంచుకోండి --' 
                            : '-- ఈ మండలంలో GPలు లభించలేదు --'}
                      </option>
                      {gps.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.name} (Reg.Unit Id: {g.id})
                        </option>
                      ))}
                    </select>

                    {selectedMandal && gps.length === 0 && (
                      <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs flex flex-col gap-1">
                        <span className="font-bold text-amber-900">
                          ఈ మండలంలో GP రికార్డ్స్ లభించకపోతే Reg.Unit Id ఎంటర్ చేయండి:
                        </span>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            placeholder="Reg.Unit Id (ఉదా: 20001)"
                            className="p-2 border border-amber-300 rounded-lg bg-white flex-1 font-mono font-bold"
                            value={selectedGp}
                            onChange={(e) => setSelectedGp(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    <button 
                      type="button"
                      onClick={() => setIsManualGp(true)} 
                      className="text-xs text-blue-600 font-bold self-start hover:underline cursor-pointer"
                    >
                      లేదా GP పేరు &amp; Reg.Unit Id మ్యాన్యువల్ గా టైప్ చేయండి
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="GP Name" 
                        className="p-3 w-1/2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold text-sm"
                        value={manualGpName}
                        onChange={e => setManualGpName(e.target.value)}
                      />
                      <input 
                        type="text" 
                        placeholder="Reg.Unit Id" 
                        className="p-3 w-1/2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-bold font-mono text-sm"
                        value={manualOfficeId}
                        onChange={e => setManualOfficeId(e.target.value)}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={() => setIsManualGp(false)} 
                      className="text-xs text-blue-600 font-bold self-start hover:underline cursor-pointer"
                    >
                      డ్రాప్‌డౌన్ (Dropdown) ద్వారా ఎంచుకోండి
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                type="button"
                onClick={handleFetch}
                className="flex-1 min-w-[200px] p-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all bg-emerald-600 text-white hover:bg-emerald-700 shadow-md active:scale-95 cursor-pointer"
              >
                <FileText size={18} />
                View Register (రిజిస్టర్ చూడండి) &rarr;
              </button>
              
              <button
                type="button"
                onClick={handlePdfDownload}
                className="flex-1 min-w-[200px] p-3.5 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Download size={18} />
                Download Info PDF (వివరాల PDF)
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: BATCH MULTI-GP LOOKUP & COMPARISON */}
        {entryMode === 'batch' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 border border-indigo-200 p-5 rounded-2xl shadow-xs">
              <label className="text-xs font-extrabold text-indigo-950 uppercase tracking-wide flex items-center gap-2 mb-2">
                <Layers size={18} className="text-indigo-600" /> ఒకేసారి అనేక గ్రామ పంచాయతీల Reg.Unit IDల విశ్లేషణ (Multi-GP Batch Search):
              </label>
              <p className="text-xs text-slate-600 font-medium mb-3">
                మీకు ఉన్న అన్ని Reg.Unit IDలు లేదా GP పేర్లను కామాలు (,), సెమికోలన్‌లు (;) లేదా కొత్త లైన్లలో క్రింద పేస్ట్ చేసి విశ్లేషించండి:
              </p>
              
              <textarea
                rows={4}
                placeholder="ఉదాహరణ:&#11;20001, 280102, 213256, 2535&#11;లేదా GP పేర్లు: Borlam, Adilabad, Basar..."
                value={batchInputText}
                onChange={(e) => setBatchInputText(e.target.value)}
                className="w-full p-3.5 border border-indigo-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-mono font-bold text-slate-800 text-sm shadow-inner"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleBatchLookup}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Search size={16} /> విశ్లేషించు (Analyze Batch) &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBatchInputText('');
                      setBatchResults([]);
                    }}
                    className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                {batchResults.length > 0 && (
                  <button
                    type="button"
                    onClick={exportBatchToExcel}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <FileSpreadsheet size={16} /> ఎక్సెల్ రిపోర్ట్ డౌన్‌లోడ్ (.xlsx)
                  </button>
                )}
              </div>
            </div>

            {/* Batch Results Table */}
            {batchResults.length > 0 && (
              <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-md">
                <div className="bg-slate-800 text-white p-3 px-4 font-black text-xs flex justify-between items-center">
                  <span>విశ్లేషించబడిన గ్రామ పంచాయతీలు ({batchResults.length})</span>
                  <span className="text-[11px] text-slate-300 font-normal">క్లిక్ చేసి నేరుగా చూడండి</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                        <th className="p-3 text-center w-12">S.No</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Mandal</th>
                        <th className="p-3">Gram Panchayat</th>
                        <th className="p-3">Reg.Unit ID</th>
                        <th className="p-3 text-right">ఆక్షన్లు (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {batchResults.map((r) => (
                        <tr key={r.sno} className="hover:bg-indigo-50/60 transition-colors">
                          <td className="p-3 text-center font-bold text-slate-500">{r.sno}</td>
                          <td className="p-3 font-bold text-slate-800">{r.district}</td>
                          <td className="p-3 text-slate-700">{r.mandal}</td>
                          <td className="p-3 font-black text-slate-900">{r.gpName}</td>
                          <td className="p-3 font-mono font-bold text-indigo-700">{r.officeId}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenByOfficeCode(r.officeId, r.gpName, r.mandal, r.district)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg shadow-2xs cursor-pointer"
                              >
                                చూడండి
                              </button>
                              <button
                                type="button"
                                onClick={() => copyOrShareUrl(r.officeId, r.gpName)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                                title="లింక్ షేర్ చేయి"
                              >
                                <Share2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Live Embedded UBD MIS Register Frame */}
      {iframeSrc && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden"
        >
          {/* Iframe Control Top Bar */}
          <div className="bg-slate-900 text-white p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-black text-sm">UBDMIS లైవ్ రిజిస్టర్ వీక్షణ</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const currentSrc = iframeSrc;
                  setIframeSrc(null);
                  setTimeout(() => setIframeSrc(currentSrc), 100);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                title="రిఫ్రెష్ చేయి"
              >
                <RefreshCw size={14} /> రీలోడ్
              </button>

              <button
                type="button"
                onClick={() => {
                  const urlParams = new URLSearchParams(iframeSrc.split('?')[1]);
                  const code = urlParams.get('officeCode') || '';
                  if (code) {
                    toggleFavorite({ officeId: code, gpName: manualGpName || code, mandal: selectedMandal, district: selectedDistrict });
                  }
                }}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl flex items-center gap-1.5 transition-colors border border-amber-500/30 cursor-pointer"
              >
                <Star size={14} className="fill-amber-400" /> ⭐ ఫేవరెట్స్
              </button>

              <button
                type="button"
                onClick={() => {
                  const urlParams = new URLSearchParams(iframeSrc.split('?')[1]);
                  const code = urlParams.get('officeCode') || '';
                  if (code) copyOrShareUrl(code, manualGpName || code);
                }}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-500/30 cursor-pointer"
              >
                <Share2 size={14} /> 📲 వాట్సాప్ షేర్
              </button>

              <a
                href={iframeSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <ExternalLink size={14} /> క్రొత్త టాబ్‌లో ఓపెన్ &rarr;
              </a>
            </div>
          </div>

          <div className="w-full h-[780px] bg-slate-100">
            <iframe 
              src={iframeSrc} 
              className="w-full h-full border-none" 
              title="UBDMIS Register Frame"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
