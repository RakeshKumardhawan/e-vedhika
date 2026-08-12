import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Upload, Info, Search, Zap, ListFilter, Check, Building, MapPin, Star, Share2, Copy, History, Trash2, ExternalLink } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { DEFAULT_DISTRICTS_DATA } from '../data/districts';

// Default small subset
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
        // Silently catch the error
      } finally {
        setLoadingData(false);
      }
    };
    fetchMasterData();
  }, []);

  const [registerType, setRegisterType] = useState<'BIR' | 'DEA'>('BIR');
  const [entryMode, setEntryMode] = useState<'direct' | 'dropdown'>('dropdown');
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
    const updated = [item, ...filtered].slice(0, 6);
    setRecentVisits(updated);
    try {
      localStorage.setItem('ubd_recent', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const copyOrShareUrl = (officeCode: string, gpName?: string) => {
    const targetUrl = `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus${registerType}_Details.do?officeCode=${officeCode}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
    if (navigator.share) {
      navigator.share({
        title: `Telangana UBD MIS - ${gpName || officeCode}`,
        text: `${gpName || officeCode} గ్రామ పంచాయతీ UBD ${registerType === 'BIR' ? 'Birth' : 'Death'} రిజిస్టర్ లింక్:`,
        url: targetUrl
      }).catch(() => {
        navigator.clipboard.writeText(targetUrl);
        addToast("లింక్ కాపీ చేయబడింది! WhatsApp లో షేర్ చేయండి.");
      });
    } else {
      navigator.clipboard.writeText(targetUrl);
      addToast("లింక్ కాపీ చేయబడింది! WhatsApp లో షేర్ చేయండి.");
    }
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
    }).slice(0, 15);
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
          
          if (user?.email === "rakeshkumardhawan123@gmail.com" || user?.email === "Rakeshkumardhawan123@gmail.com") {
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

    const targetUrl = `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus${registerType}_Details.do?officeCode=${cleanCode}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
    setIframeSrc(targetUrl);
    addToast(`Reg.Unit Id [${cleanCode}] తో రిజిస్టర్ ఓపెన్ చేయబడింది!`);
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

    const targetUrl = `https://ubdmis.telangana.gov.in/ubdmisTGTotalStatus${registerType}_Details.do?officeCode=${effOfficeCode}&status=A&rlb_type=3&pstcode=35&style=bluetheme`;
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
    doc.text(`Telangana UBDMIS - ${regTypeName}`, 14, 20);
    
    doc.setFontSize(12);
    autoTable(doc, {
      startY: 30,
      head: [['Parameter', 'Details']],
      body: [
        ['Register Type', regTypeName],
        ['District', selectedDistrict || 'N/A'],
        ['Mandal', effMandal || 'N/A'],
        ['Gram Panchayat', effGpName],
        ['Reg.Unit Id', effOfficeCode]
      ]
    });

    doc.save(`${effGpName}_${regTypeName}.pdf`);
  };

  return (
    <div className="w-full">
      
      {/* File Upload Banner */}
      {isAdmin && (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-full text-amber-700">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-bold text-amber-900">అన్ని జిల్లాలు కావాలా?</h3>
            <p className="text-sm text-amber-800">పూర్తి డేటా కోసం మీ 'ubd.xlsx' ఫైల్‌ను ఇక్కడ అప్‌లోడ్ చేయండి.</p>
          </div>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Upload size={16} /> అప్‌లోడ్ ubd.xlsx
        </button>
        {ubdData.length > 50 && (
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear the global data on the server?')) {
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
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            Clear Data
          </button>
        )}
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv, .json" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden" 
        />
      </div>)}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6 p-6">
        <div className="text-center mb-6 flex flex-col items-center">
          <h2 className="text-2xl font-black text-emerald-800 mb-2 border border-emerald-100 bg-emerald-50 px-6 py-2 rounded-xl">
            {registerType === 'BIR' ? 'Birth Register (జనన నమోదు)' : 'Death Register (మరణ నమోదు)'}
          </h2>
        </div>

        {/* Quick Favorites & Recent Visits Bar */}
        {(favorites.length > 0 || recentVisits.length > 0) && (
          <div className="mb-6 space-y-3 bg-gradient-to-r from-amber-50/60 via-slate-50 to-emerald-50/60 p-4 rounded-2xl border border-slate-200">
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
                    className="text-[11px] text-slate-400 hover:text-red-500 font-medium"
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
                      className="flex items-center gap-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-xl shadow-xs transition-all"
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

        {/* Register Type & Mode Selector */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-slate-700 whitespace-nowrap">రిజిస్టర్ రకం:</label>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto">
              <button
                type="button"
                onClick={() => { setRegisterType('BIR'); setIframeSrc(null); }}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  registerType === 'BIR' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Birth Register
              </button>
              <button
                type="button"
                onClick={() => { setRegisterType('DEA'); setIframeSrc(null); }}
                className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  registerType === 'DEA' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Death Register
              </button>
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setEntryMode('direct')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                entryMode === 'direct' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Zap size={14} /> డైరెక్ట్ సెర్చ్ / ఆఫీస్ కోడ్
            </button>
            <button
              type="button"
              onClick={() => setEntryMode('dropdown')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                entryMode === 'dropdown' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ListFilter size={14} /> జిల్లా & మండలాల ఎంపిక
            </button>
          </div>
        </div>

        {/* MODE 1: DIRECT SMART SEARCH & QUICK OFFICE CODE */}
        {entryMode === 'direct' ? (
          <div className="space-y-6">
            
            {/* Quick Office Code Input Block */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl">
              <label className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Building size={16} className="text-blue-600" /> Reg.Unit Id తెలిసి ఉంటే నేరుగా ఎంటర్ చేయండి (Quick Reg.Unit Id Entry):
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="ఉదాహరణ: 20001, 280102..."
                  value={quickOfficeCode}
                  onChange={(e) => setQuickOfficeCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenByOfficeCode(quickOfficeCode);
                  }}
                  className="flex-1 p-3 border border-blue-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono font-bold text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => handleOpenByOfficeCode(quickOfficeCode)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all whitespace-nowrap"
                >
                  <FileText size={18} /> నేరుగా రిజిస్టర్ ఓపెన్ చేయి
                </button>
              </div>
            </div>

            {/* Smart Live Search Box */}
            <div className="relative">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Search size={16} className="text-emerald-600" /> గ్రామ పంచాయతీ / మండలం / జిల్లా పేరుతో వెతకండి (Smart Live Search):
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="మీ GP పేరు టైప్ చేయండి (ఉదా: Borlam, Adilabad, Basar)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3.5 pl-11 border border-slate-300 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium text-slate-800 shadow-inner"
                />
                <Search size={20} className="absolute left-3.5 top-3.5 text-slate-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-3.5 text-xs bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-full text-slate-600 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Live Search Results List */}
              {searchTerm.trim().length > 0 && (
                <div className="mt-3 border border-slate-200 bg-white rounded-2xl shadow-lg max-h-[320px] overflow-y-auto divide-y divide-slate-100 p-2">
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
                          className="p-3 hover:bg-emerald-50/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <MapPin size={18} />
                            </div>
                            <div>
                              <div className="font-black text-slate-800 group-hover:text-emerald-900 text-sm">
                                {gpName} <span className="text-xs text-slate-500 font-normal">GP</span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <span>మండలం: <strong>{mandal}</strong></span>
                                <span>•</span>
                                <span>జిల్లా: <strong>{district}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite({ officeId, gpName, mandal, district });
                              }}
                              className={`p-1.5 rounded-lg border transition-colors ${
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
                              className="p-1.5 rounded-lg border bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="లింక్ షేర్ చేయండి"
                            >
                              <Share2 size={16} />
                            </button>

                            <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700 border border-slate-200 hidden sm:inline-block">
                              Reg.Unit Id: {officeId}
                            </span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              ఓపెన్ చేయి &rarr;
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-500 font-medium">
                      ఈ పేరుతో GP లభించలేదు. మీ Reg.Unit Id తెలిస్తే పైన డైరెక్ట్ గా ఎంటర్ చేయండి.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        ) : (
          /* MODE 2: DROPDOWN SELECTOR */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">జిల్లా ఎంచుకోండి (District)</label>
              <select 
                className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
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
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">మండలం ఎంచుకోండి (Mandal)</label>
              {!isManualMandal ? (
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
                    <option value="">-- మండలం --</option>
                    {mandals.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <button onClick={() => setIsManualMandal(true)} className="text-xs text-blue-600 font-bold self-start hover:underline">లేదా మ్యాన్యువల్ గా టైప్ చేయండి</button>
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
                  <button onClick={() => setIsManualMandal(false)} className="text-xs text-blue-600 font-bold self-start hover:underline">జాబితా నుండి ఎంచుకోండి</button>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 flex justify-between items-center">
                <span>గ్రామ పంచాయతీ (GP Dropdown)</span>
                {gps.length > 0 && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {gps.length} GPలు
                  </span>
                )}
              </label>
              {!isManualGp ? (
                <div className="flex flex-col gap-2 w-full">
                  <select 
                    className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium w-full text-slate-800"
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

                  {/* Fallback code input if no GPs found in local data for selected mandal */}
                  {selectedMandal && gps.length === 0 && (
                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs flex flex-col gap-1">
                      <span className="font-bold text-amber-800">
                        ఈ మండలానికి GP డ్రాప్‌డౌన్ డేటా ప్రస్తుతం లేకపోతే Reg.Unit Id ఎంటర్ చేయండి:
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
                    onClick={() => setIsManualGp(true)} 
                    className="text-xs text-blue-600 font-bold self-start hover:underline mt-0.5"
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
                      className="p-2.5 w-1/2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                      value={manualGpName}
                      onChange={e => setManualGpName(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Reg.Unit Id" 
                      className="p-2.5 w-1/2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 font-medium"
                      value={manualOfficeId}
                      onChange={e => setManualOfficeId(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => setIsManualGp(false)} 
                    className="text-xs text-blue-600 font-bold self-start hover:underline"
                  >
                    డ్రాప్‌డౌన్ (Dropdown) ద్వారా ఎంచుకోండి
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
          {entryMode === 'dropdown' && (
            <button 
              onClick={handleFetch}
              className="flex-1 min-w-[200px] p-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-emerald-700 text-white hover:bg-emerald-800 shadow-md"
            >
              <FileText size={20} />
              View Register (రిజిస్టర్ చూడండి)
            </button>
          )}
          
          <button
            onClick={handlePdfDownload}
            className="flex-1 min-w-[200px] p-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Download size={20} />
            Download Info PDF (వివరాల PDF)
          </button>
        </div>
      </div>

      {iframeSrc && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Iframe Top Quick Utility Bar */}
          <div className="bg-slate-800 text-white p-3 px-5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>UBDMIS పోర్టల్ లైవ్ రిజిస్టర్</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const urlParams = new URLSearchParams(iframeSrc.split('?')[1]);
                  const code = urlParams.get('officeCode') || '';
                  if (code) {
                    toggleFavorite({ officeId: code, gpName: manualGpName || code, mandal: selectedMandal, district: selectedDistrict });
                  }
                }}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg flex items-center gap-1.5 transition-colors border border-amber-500/30"
              >
                <Star size={14} className="fill-amber-400" /> ⭐ ఫేవరెట్
              </button>

              <button
                type="button"
                onClick={() => {
                  const urlParams = new URLSearchParams(iframeSrc.split('?')[1]);
                  const code = urlParams.get('officeCode') || '';
                  if (code) copyOrShareUrl(code, manualGpName || code);
                }}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg flex items-center gap-1.5 transition-colors border border-emerald-500/30"
              >
                <Share2 size={14} /> 📲 లింక్ షేర్ చేయండి
              </button>

              <a
                href={iframeSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg flex items-center gap-1.5 transition-colors border border-blue-500/30"
              >
                <ExternalLink size={14} /> క్రొత్త టాబ్‌లో ఓపెన్ చేయి
              </a>
            </div>
          </div>

          <div className="w-full h-[750px]">
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

