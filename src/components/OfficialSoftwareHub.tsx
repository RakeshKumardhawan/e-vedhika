import React, { useState } from 'react';
import { HardDrive, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface OfficialSoftwareHubProps {
  addToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function OfficialSoftwareHub({ addToast }: OfficialSoftwareHubProps) {
  const [softCategory, setSoftCategory] = useState<'all' | 'dsc' | 'biometric' | 'typing' | 'office'>('all');

  const softwaresList = [
    {
      id: 'dsc_bundle_offline',
      title: 'DSC Signer Bundle (Full Offline Installer)',
      category: 'dsc',
      version: 'v2026 Enterprise',
      size: '128 MB',
      badge: 'All-in-One Offline',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'అన్ని DSC డ్రైవర్లు, Java రన్‌టైమ్స్ మరియు సైనింగ్ యుటిలిటీస్ ఒక్క ప్యాకేజీలో లభిస్తాయి.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/DSC.Signer.Bundle.Softwares.Offline.exe',
      filename: 'DSC.Signer.Bundle.Softwares.Offline.exe'
    },
    {
      id: 'dsc_bundle_lite',
      title: 'DSC Signer Bundle (Cloud Lite Installer)',
      category: 'dsc',
      version: 'v2026 Cloud',
      size: '29 MB',
      badge: 'Fast Download',
      badgeColor: 'bg-blue-100 text-blue-800',
      desc: 'అతి తక్కువ సైజు గల వెబ్ ఇన్‌స్టాలర్, అవసరమైన డ్రైవర్లను ఆన్‌లైన్ ద్వారా ఇన్‌స్టాల్ చేస్తుంది.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/DSC.Signer.Bundle.Softwares.exe',
      filename: 'DSC.Signer.Bundle.Softwares.exe'
    },
    {
      id: 'java_32',
      title: 'Java Runtime Environment (32-Bit JRE)',
      category: 'dsc',
      version: 'JDK 8u351 (x86)',
      size: '64 MB',
      badge: 'Official JRE',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'eGramSwaraj మరియు e-Panchayat టోకెన్ ఆప్లెట్స్ రన్ అవ్వడానికి అవసరమైన 32-బిట్ జావా.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Java.8u351.32bit.exe',
      filename: 'Java.8u351.32bit.exe'
    },
    {
      id: 'java_64',
      title: 'Java Runtime Environment (64-Bit JRE)',
      category: 'dsc',
      version: 'JDK 8u351 (x64)',
      size: '71 MB',
      badge: '64-Bit System',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Windows 64-బిట్ ఆపరేటింగ్ సిస్టమ్‌ల కోసం అధికారిక జావా రన్‌టైమ్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Java.8u351.64bit.exe',
      filename: 'Java.8u351.64bit.exe'
    },
    {
      id: 'hyp2003_driver',
      title: 'HYP2003 Token Driver (FIPS 140-2)',
      category: 'dsc',
      version: 'v2026 Auto-Detect',
      size: '8 MB',
      badge: 'High Security Token',
      badgeColor: 'bg-purple-100 text-purple-800',
      desc: 'హైపర్ పీకేఐ HYP2003 USB క్రిప్టో టోకెన్ డ్రైవర్ (HSM Level).',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/HYP2003.Token.Driver.exe',
      filename: 'HYP2003.Token.Driver.exe'
    },
    {
      id: 'proxkey_driver',
      title: 'ProxKey WatchData Token Driver',
      category: 'dsc',
      version: 'v7.1 Standalone',
      size: '12 MB',
      badge: 'Most Popular',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'వాచ్‌డేటా ప్రాక్స్ కీ USB క్రిప్టో టోకెన్ డ్రైవర్ (Windows 7/8/10/11 సపోర్ట్).',
      url: 'https://vsign.in/downloads/ProxKey_WD_Driver.exe',
      filename: 'ProxKey_WD_Driver.exe'
    },
    {
      id: 'nic_dsign',
      title: 'eGramSwaraj NIC DSign Utility',
      category: 'dsc',
      version: 'v3.2 Official NIC',
      size: '16 MB',
      badge: 'eGramSwaraj',
      badgeColor: 'bg-blue-100 text-blue-800',
      desc: 'eGramSwaraj పోర్టల్ DSC వెండర్ పేమెంట్లకు అధికారిక NIC సైనింగ్ సర్వీస్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/nicDSign.zip',
      filename: 'nicDSign.zip'
    },
    {
      id: 'ubd_digisigner',
      title: 'UBD NIC DigiSigner Service',
      category: 'dsc',
      version: 'v2.1 Telangana UBD',
      size: '22 MB',
      badge: 'UBD Special',
      badgeColor: 'bg-teal-100 text-teal-800',
      desc: 'జనన/మరణ ధ్రువీకరణ పత్రాలపై డిజిటల్ సంతకాల కొరకు UBD NIC సర్వీస్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/UBD.NIC.DigiSigner.Setup.exe',
      filename: 'UBD.NIC.DigiSigner.Setup.exe'
    },
    {
      id: 'google_telugu_ime',
      title: 'Google Input Tools Telugu (Offline Installer)',
      category: 'typing',
      version: 'v1.0.8 Standalone',
      size: '11 MB',
      badge: 'Offline Telugu',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      desc: 'ఇంటర్నెట్ అవసరం లేకుండా కంప్యూటర్‌లో ఇంగ్లీష్ లో టైప్ చేస్తే తెలుగులోకి మార్చే టూల్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Google.Input.Tools.Telugu.Offline.exe',
      filename: 'Google.Input.Tools.Telugu.Offline.exe'
    },
    {
      id: 'telugu_unicode_fonts',
      title: 'Telugu Govt Unicode Fonts Pack',
      category: 'typing',
      version: 'Official Govt Bundle',
      size: '7 MB',
      badge: 'Pothana / Mandali',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      desc: 'పోతన, గౌతమి, వేమన, మండలి ప్రభుత్వ అధికారిక తెలుగు యూనికోడ్ ఫాంట్లు.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Telugu.Govt.Fonts.Pack.zip',
      filename: 'Telugu.Govt.Fonts.Pack.zip'
    },
    {
      id: 'adobe_reader_v11',
      title: 'Adobe Reader DC v11 (DSC Green Tick Verify)',
      category: 'office',
      version: 'v11.0.23 Enterprise',
      size: '48 MB',
      badge: 'Green Tick DSC',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'డిజిటల్ సంతకాలపై పసుపు రంగు ప్రశ్నార్థకాన్ని తొలగించి గ్రీన్ టిక్ మార్చే అడోబ్ రీడర్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Adobe.Reader.DC.v11.DSC.Setup.exe',
      filename: 'Adobe.Reader.DC.v11.DSC.Setup.exe'
    },
    {
      id: 'open_ie_utility',
      title: 'Open Internet Explorer Utility (Windows 10 / 11)',
      category: 'office',
      version: 'Portable Win 10/11',
      size: '4 MB',
      badge: 'IE Mode Standalone',
      badgeColor: 'bg-slate-200 text-slate-800',
      desc: 'విండోస్ 10 మరియు 11 లో డైరెక్ట్‌గా పాత ఇంటర్నెట్ ఎక్స్‌ప్లోరర్ ఓపెన్ చేసే అధికారిక స్క్రిప్ట్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Open.Internet.Explorer.Win10.11.exe',
      filename: 'Open.Internet.Explorer.Win10.11.exe'
    },
    {
      id: 'ms_office_2010_iso',
      title: 'MS Office 2010 SP2 (Official Offline ISO)',
      category: 'office',
      version: 'SP2 Professional',
      size: '1.9 GB',
      badge: 'Official Standalone',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'గ్రామ పంచాయతీ కంప్యూటర్ల కోసం స్థిరమైన MS Office 2010 SP2 ఇన్‌స్టాలర్.',
      url: 'https://github.com/DPMKMM/panchayat-automation/releases/download/sofotware_bundle/Office2010_SP2_Professional_x86_x64.iso',
      filename: 'Office2010_SP2_Professional_x86_x64.iso'
    },
    {
      id: 'mantra_rd_driver',
      title: 'Mantra MFS100 RD Service & Driver',
      category: 'biometric',
      version: 'v9.2.0.0 (UIDAI Approved)',
      size: '24 MB',
      badge: 'UIDAI L0 Biometric',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'మంత్ర బయోమెట్రిక్ ఫింగర్‌ప్రింట్ స్కానర్ కోసం తాజా RD సర్వీస్ & డ్రైవర్లు.',
      url: 'https://download.mantratecapp.com/Document/MANTRA%20RD%20SERVICE%20SETUP.exe',
      filename: 'Mantra_MFS100_RDService.exe'
    }
  ];

  const filteredSoftwares = softCategory === 'all' 
    ? softwaresList 
    : softwaresList.filter(s => s.category === softCategory);

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600 font-black">
              <HardDrive size={20} />
            </span>
            <h3 className="font-black text-lg sm:text-xl text-slate-900">
              అధికారిక ప్రభుత్వ సాఫ్ట్‌వేర్ &amp; డ్రైవర్ల హబ్ (14 Pack)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            e-Panchayat, eGramSwaraj, మరియు UBD కోసం అవసరమైన DSC టోకెన్ డ్రైవర్లు, Java రన్‌టైమ్స్ మరియు బయోమెట్రిక్ RD సర్వీసులు.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold overflow-x-auto">
          {[
            { id: 'all', label: 'అన్నీ (All)' },
            { id: 'dsc', label: '🔐 DSC & టోకెన్' },
            { id: 'biometric', label: '👆 బయోమెట్రిక్ RD' },
            { id: 'typing', label: '✍️ తెలుగు టైపింగ్' },
            { id: 'office', label: '🖨️ ఆఫీస్ టూల్స్' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSoftCategory(f.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                softCategory === f.id ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Software Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSoftwares.map((s) => (
          <div 
            key={s.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  {s.size}
                </span>
              </div>

              <h4 className="font-black text-sm text-slate-900 leading-snug">
                {s.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                {s.desc}
              </p>
              <div className="text-[10px] font-bold text-slate-400 mt-2">
                వెర్షన్: <span className="text-slate-700">{s.version}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 truncate max-w-[160px]">
                {s.filename}
              </span>
              <a
                href={s.url}
                download={s.filename}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (addToast) addToast(`${s.title} డౌన్‌లోడ్ ప్రారంభమైంది!`, 'success');
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={13} />
                <span>డౌన్‌లోడ్ ⬇</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OfficialSoftwareHub;
