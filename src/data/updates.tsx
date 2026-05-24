import React from "react";

export interface Update {
  id: string;
  isSystemElement?: boolean;
  version?: string;
  title: string;
  badge?: string;
  text: string | React.ReactNode;
  time: number;
  type: string;
  status: string;
}

export const SYSTEM_UPDATES: Update[] = [
  {
    id: `update-v1.6.0`,
    isSystemElement: true,
    version: "v1.6.0",
    title: "23/05/2026: సూపర్ ఫాస్ట్ పర్ఫార్మెన్స్ & ఫార్మర్ రిజిస్ట్రీ అప్‌డేట్",
    badge: "MAJOR UPDATE",
    text: "1. ⚡ **సూపర్ ఫాస్ట్ లోడింగ్**: హోమ్ పేజీ లోడింగ్ సమయాన్ని తగ్గించాము, ఇప్పుడు యాప్ రెప్పపాటులో లోడ్ అవుతుంది.\n2. 🌾 **ఫార్మర్ రిజిస్ట్రీ**: రిపోర్ట్ డౌన్‌లోడ్ ఫైల్ పేరు ఇప్పుడు పంచాయతీ పేరుతో (ఉదా: KARJIBHEEMPUR...) వస్తుంది.\n3. 🔗 **డైరెక్ట్ లింక్**: ఇప్పుడు మీరు నేరుగా /Farmer_Registry ద్వారా టూల్‌ను యాక్సెస్ చేయవచ్చు.\n4. 📢 **షేరింగ్ ఆప్షన్స్**: రిపోర్ట్‌లను నేరుగా వాట్సాప్ లేదా ఇతర యాప్‌లకు షేర్ చేసే సదుపాయం కల్పించబడింది.",
    time: Date.now(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: `update-v1.5.3`,
    isSystemElement: true,
    version: "v1.5.3",
    title: "12/05/2026: పెర్ఫార్మెన్స్ బూస్ట్ & ఆటో రికవరీ స్పీడప్",
    badge: "PERFORMANCE",
    text: "1. ⚡ **స్పీడ్ బూస్ట్**: సిస్టమ్ లోడింగ్ సమయాన్ని మరియు ఏఐ బాట్ స్పందన సమయాన్ని తగ్గించాము.\n2. 🤖 **ఫాస్ట్ రికవరీ**: ఏవైనా ఎర్రర్స్ వస్తే సిస్టమ్ ఇప్పుడు మునుపటి కంటే రెండు రెట్లు వేగంగా రీస్టార్ట్ అవుతుంది.\n3. 🎨 **రిఫ్రెష్డ్ లుక్**: రికవరీ స్క్రీన్‌ను మరింత అందంగా మరియు స్పష్టంగా అప్‌డేట్ చేశాము.\n4. 🛡️ **స్టెబిలిటీ ప్యాచ్**: హోమ్ పేజీ లోడింగ్ లో వచ్చే చిన్న చిన్న ఇబ్బందులను తొలగించాము.",
    time: 1778586600000,
    type: "changelog",
    status: "Approved",
  },
  {
    id: `update-v1.5.2`,
    isSystemElement: true,
    version: "v1.5.2",
    title: "12/05/2026: అల్టిమేట్ పేజీ బిల్డర్ (Dynamic Layouts)",
    badge: "HUGE UPDATE",
    text: "1. 🏗️ **డైనమిక్ సెక్షన్స్**: ఇప్పుడు మీరు హోమ్ పేజీ సెక్షన్స్ ని అడ్మిన్ ప్యానెల్ నుండి క్రియేట్, ఎడిట్, డిలీట్ మరియు రీ-ఆర్డర్ చేయవచ్చు.\n2. 👁️ **లైవ్ ప్రివ్యూ**: మార్పులు చేసేటప్పుడే అవి ఎలా ఉంటాయో అడ్మిన్ ప్యానెల్ లోనే చూడవచ్చు.\n3. ☁️ **రియల్-టైమ్ సింక్**: మీరు 'Publish' చేసిన వెంటనే మార్పులు సేవ్ అయి అందరికీ కనిపిస్తాయి.\n4. 🙈 **హైడ్/షో**: ఏదైనా సెక్షన్‌ను డిలీట్ చేయకుండానే తాత్కాలికంగా దాచిపెట్టవచ్చు.",
    time: 1778586000000,
    type: "changelog",
    status: "Approved",
  },
  {
    id: `update-v1.5.0`,
    isSystemElement: true,
    version: "v1.5.0",
    title: "12/05/2026: బాట్ విజిబిలిటీ & పేజీ బిల్డర్ వెర్షన్ 2.0",
    badge: "MAJOR UPDATE",
    text: "1. 🤖 **AI బాట్ ఫిక్స్**: ఏఐ బాట్ (ManaBot) కనిపించని సమస్యను పరిష్కరించాము. ఇప్పుడు అది అన్ని డివైజ్‌లలో స్పష్టంగా కనిపిస్తుంది.\n2. 🏗️ **ఫంక్షనల్ పేజీ బిల్డర్**: పేజీ బిల్డర్‌లో ఇప్పుడు మీరు ఎలిమెంట్స్ ని యాడ్ చేయడం మరియు వాటిని తొలగించడం చేయవచ్చు. ఇది ఇప్పుడు సంపూర్ణంగా పనిచేస్తుంది.\n3. 🛡️ **ఎర్రర్ హ్యాండ్లింగ్**: సిస్టమ్ లో వచ్చే ఎర్రర్స్ ని ఇప్పుడు మీరు తెలుగులో సులభంగా అర్థం చేసుకునేలా అప్‌డేట్ చేశాము.",
    time: 1778585400000,
    type: "changelog",
    status: "Approved",
  },
  {
    id: `update-v1.4.9`,
    isSystemElement: true,
    version: "v1.4.9",
    title: "11/05/2026: సిస్టమ్ రికవరీ బాట్ & పేజీ బిల్డర్",
    badge: "NEW FEATURES",
    text: "1. 🤖 **సిస్టమ్ రికవరీ బాట్**: ఎర్రర్స్ వస్తే ఆటోమాటిక్ గా క్లియర్ చేసి వెబ్‌సైట్‌ను మళ్లీ రన్ చేయడానికి రికవరీ బాట్ అనుసంధానించబడింది.\n2. 🏗️ **పేజీ బిల్డర్**: అడ్మిన్ ప్యానెల్‌లో కొత్తగా పేజీలను క్రియేట్ చేయడానికి మరియు డిజైన్ చేయడానికి Page Builder ఆప్షన్ తీసుకురాబడింది.\n3. 🖼️ **PWA లోగో అప్‌డేట్**: బ్రౌజర్ క్యాచెను పక్కనపెట్టి కొత్త PWA లోగో వెంటనే యూజర్లకు కనబడేలా వెర్షన్ అప్‌డేట్ చేసాం.",
    time: 1778500200000,
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.4.8",
    isSystemElement: true,
    version: "v1.4.8",
    title: "10/05/2026: సిస్టమ్ అప్‌డేట్స్ & అనలిటిక్స్ ఫీచర్స్",
    badge: "DAILY UPDATE",
    text: 'నేటి సిస్టమ్ అప్‌డేట్స్‌లో భాగంగా పోర్టల్‌లో ఈ క్రింది మార్పులు చేసాము:\n\n1. 💎 **టెక్స్ట్ ఫార్మాటింగ్ టూల్‌బార్**: ఇప్పుడు మీరు పోస్ట్‌లను వ్రాసేటప్పుడు వర్డ్ ఫైల్ లాగా బోల్డ్, ఇటాలిక్ మరియు లైన్ బ్రేక్స్ ఉపయోగించవచ్చు.\n2. 🎨 **UI అప్‌డేట్స్**: కస్టమ్ లోగో, మొబైల్ హోమ్ స్క్రీన్ ఐకాన్ మరియు ఫెవికాన్ కలపబడ్డాయి.\n3. 📊 **అడ్మిన్ అనలిటిక్స్**: అడ్మిన్లకి మాత్రమే, పోస్ట్‌లో Views లేదా Likes కౌంట్ మీద క్లిక్ చేస్తే చూసిన/లైక్ చేసిన వారి లిస్ట్ వస్తుంది.\n4. 📖 **పోస్ట్ రీడింగ్ UX**: "Read Post" మీద క్లిక్ చేస్తే ఆ పోస్ట్ ఫుల్ వ్యూ వస్తుంది, మరియు "Back to Feed" బటన్ యాడ్ చేసాం.\n5. 🚀 **నావిగేషన్**: ఎగువన ఉన్న "EV" లోగో మీద క్లిక్ చేస్తే ఏ పేజీ నుంచి అయినా నేరుగా హోమ్ పేజీకి వస్తారు.\n6. 🔗 **సోషల్ షేరింగ్**: పోస్ట్‌లను షేర్ చేసినప్పుడు సరైన థంబ్‌నెయిల్ మరియు టైటిల్‌తో "ప్రివ్యూ" (OG Image & Tags) వచ్చేలా ఫిక్స్ చేసాము.',
    time: new Date("2026-05-10T23:59:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.7.2",
    isSystemElement: true,
    version: "v1.7.2",
    title: "09/05/2026: కేటగిరీల పునరుద్ధరణ (Restoration)",
    badge: "BUGFIX",
    text: "యూజర్ కోరిక మేరకు అన్ని పోస్ట్ కేటగిరీలను యథావిధిగా పునరుద్ధరించడం జరిగింది. అల్లాగే Admin Panel లో ఏర్పడిన Firestore Update ఎర్రర్‌ను ఫిక్స్ చేశాము.",
    time: new Date("2026-05-09T18:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.7.1",
    isSystemElement: true,
    version: "v1.7.1",
    title: "09/05/2026: కేటగిరీల జాబితా క్లీనప్",
    badge: "UPDATE",
    text: "పోస్ట్ కేటగిరీల జాబితా నుండి అనవసరమైన అంశాలను తొలగించడం జరిగింది మరియు Useful Information కేటగిరీని అప్డేట్ చేసాము.",
    time: new Date("2026-05-09T17:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.7.0",
    isSystemElement: true,
    version: "v1.7.0",
    title: "09/05/2026: హాష్‌ట్యాగ్స్ & వ్యూస్ అప్డేట్",
    badge: "NEW",
    text: "పోస్ట్ కంటెంట్‌లోని #hashtags ఆటోమేటిక్‌గా ట్యాగ్స్‌గా మారుతాయి. వ్యూస్ కౌంట్ ఒక యూజర్ కి ఒకసారి మాత్రమే లెక్కించబడుతుంది.",
    time: new Date("2026-05-09T16:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.6.2",
    isSystemElement: true,
    version: "v1.6.2",
    title: "09/05/2026: మల్టీ-కేటగిరీ సపోర్ట్",
    badge: "NEW",
    text: "ఇకపై ఒక పోస్ట్ కి 3 కేటగిరీల వరకు ఎంచుకోవచ్చు. కేటగిరీల జాబితాను క్లీనప్ చేయడం జరిగింది.",
    time: new Date("2026-05-09T15:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.6.1",
    isSystemElement: true,
    version: "v1.6.1",
    title: "09/05/2026: కేటగిరీలకు ఐకాన్స్ జోడింపు",
    badge: "NEW",
    text: "కేటగిరీలకు ఐకాన్స్ (Emojis) జోడించడం జరిగింది మరియు మరిన్ని ఇష్యూ రిపోర్టింగ్ కేటగిరీలను అందుబాటులోకి తెచ్చాం.",
    time: new Date("2026-05-09T14:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.4.6",
    isSystemElement: true,
    version: "v1.4.6",
    title: "08/05/2026: సింగిల్ చాట్ బాట్ (ManaBot) సింప్లిఫికేషన్",
    badge: "UPDATE",
    text: 'యూజర్స్ కి కన్ఫ్యూజన్ లేకుండా లైవ్ చాట్ లో ఉన్న ఏఐ బాట్ ని మరియు వర్క్ స్పేస్ లో ఉన్న ట్రైనింగ్ బాట్ ని తీసేసి.. అన్నిటికీ కలిపి కేవలం ఒకే ఒక పవర్ఫుల్ చాట్ బాట్ "E-VEDHIKA Assistant" ని మాత్రమే ఉంచాము. PR Act సెర్చ్ లోని బాట్ ఐకాన్‌ను కూడా మార్చాము.',
    time: new Date("2026-05-08T12:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.4.4",
    isSystemElement: true,
    version: "v1.4.4",
    title: "మే 08, 2026: PR Act Hub ఫీచర్స్",
    badge: "NEW",
    text: "మన పంచాయతీ సెక్షన్‌లోని PR Act Hub లో కొత్త సెర్చ్ ఫీచర్, క్విక్ జంప్ లింక్స్ మరియు ఒరిజినల్ PDF డౌన్‌లోడ్ చేసుకునే అవకాశం యాడ్ చేయడం జరిగింది.",
    time: new Date("2026-05-08T11:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.4.1",
    isSystemElement: true,
    version: "v1.4.1",
    title: "మే 08, 2026: వెబ్సైట్ విజిటర్ కౌంట్ అప్డేట్",
    badge: "HOTFIX",
    text: "గతంలో పోర్టల్ ని సందర్శించిన వారి సంఖ్య సరిగ్గా చూపించట్లేదు , ఇప్పుడు ఒరిజినల్ కౌంట్ కనిపించేలా విజిటర్ కౌంటర్ ని ఫిక్స్ చెయ్యడం జరిగింది.",
    time: new Date("2026-05-08T10:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.4.0",
    isSystemElement: true,
    version: "v1.4.0",
    title: "మే 06, 2026: స్మార్ట్ అప్డేట్స్",
    badge: "NEW UI",
    text: (
      <div className="text-left space-y-4">
        <div className="flex items-center gap-3">
          <kbd className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
            v1.4.0
          </kbd>
          <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
            మే 06, 2026: స్మార్ట్ అప్డేట్స్
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex gap-4 items-start">
            <kbd className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              NEW UI
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>Applications, Formats & GOs:</strong> యూజర్స్ అందరు తమకు
              కావాల్సిన గవర్నమెంట్ అప్లికేషన్లు, ఫార్మాట్‌లు మరియు GOస్‌ను
              అప్లోడ్ (పబ్లిక్ అప్లోడ్) చేసుకుని ఇతరులకు షేర్ చేసుకునే మరియు
              సులభంగా వెతుక్కునే సదుపాయం.
            </span>
          </div>
          <div className="flex gap-4 items-start">
            <kbd className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              NEW PWA
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>ఆటో-అప్డేట్ ఫీచర్ (Auto-Update Notifier):</strong> యాప్ లో
              ఎప్పటికప్పుడు కొత్త ఫీచర్స్ వచ్చిన వెంటనే స్క్రీన్ మీద పాపప్
              ద్వారా తెలిసేలా స్మార్ట్ అలర్ట్ సిస్టమ్ జోడించాం.
            </span>
          </div>
        </div>
      </div>
    ),
    time: new Date("2026-05-06T10:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.3.0",
    isSystemElement: true,
    version: "v1.3.0",
    title: "మే 01, 2026: డాక్యుమెంట్స్",
    badge: "OFFLINE",
    text: (
      <div className="text-left space-y-4">
        <div className="flex items-center gap-3">
          <kbd className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
            v1.3.0
          </kbd>
          <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
            మే 01, 2026: డాక్యుమెంట్స్
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex gap-4 items-start">
            <kbd className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              PROFILE
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>మై యాక్టివిటీ & రిపోర్ట్స్ (My Activity):</strong> యూజర్స్
              తమ సొంత ప్రొఫైల్, వాళ్ళు పెట్టిన పోస్ట్‌లు మరియు పనుల గురించి
              రిపోర్ట్స్ చూసుకునే సెక్షన్ రడీ చేసాం.
            </span>
          </div>
          <div className="flex gap-4 items-start">
            <kbd className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              OFFLINE
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>PWA యాప్ & ఆఫ్‌లైన్ సపోర్ట్:</strong> మొబైల్ లో ఒక యాప్ లా
              ఇన్స్టాల్ చేసుకునే అవకాశం మరియు ఇంటర్నెట్ లేనప్పుడు కూడా చూసిన
              డేటా చదువుకోగలిగే ఆఫ్‌లైన్ సపోర్ట్.
            </span>
          </div>
        </div>
      </div>
    ),
    time: new Date("2026-05-01T10:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.2.0",
    isSystemElement: true,
    version: "v1.2.0",
    title: "ఏప్రిల్ 20, 2026: పర్సనలైజేషన్",
    badge: "CHAT",
    text: (
      <div className="text-left space-y-4">
        <div className="flex items-center gap-3">
          <kbd className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
            v1.2.0
          </kbd>
          <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
            ఏప్రిల్ 20, 2026: పర్సనలైజేషన్
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex gap-4 items-start">
            <kbd className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              CHAT
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>లైవ్ చాట్ (Live Chat):</strong> యూజర్ల మధ్యన రియల్ టైం
              డిస్కషన్స్ మరియు ముఖ్యమైన విషయాల పంచుకోవడానికి పబ్లిక్ లైవ్ చాట్
              గ్రూప్స్ ప్రారంభం.
            </span>
          </div>
          <div className="flex gap-4 items-start">
            <kbd className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              UNION
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>యూనియన్ కార్నర్ (Union Corner):</strong> వివిధ ఎంప్లాయ్
              యూనియన్స్ మరియు సంఘాల సమాచారం త్వరగా అందరికీ చేరేలా ఒక స్పెషల్
              వాయిస్ బోర్డ్.
            </span>
          </div>
        </div>
      </div>
    ),
    time: new Date("2026-04-20T10:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "update-v1.0.1",
    isSystemElement: true,
    version: "v1.0.1",
    title: "ఏప్రిల్ 15, 2026: కమ్యూనికేషన్",
    badge: "FEEDBACK",
    text: (
      <div className="text-left space-y-4">
        <div className="flex items-center gap-3">
          <kbd className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
            v1.0.1
          </kbd>
          <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
            ఏప్రిల్ 15, 2026: కమ్యూనికేషన్
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex gap-4 items-start">
            <kbd className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-black uppercase mt-0.5 whitespace-nowrap">
              FEEDBACK
            </kbd>
            <span className="text-sm text-slate-600 leading-relaxed">
              <strong>సజెషన్స్ & ఫీడ్బ్యాక్ (Public Suggestions):</strong>{" "}
              ఎవరైనా సరే ఏమైనా కొత్త సజెషన్స్ ఇవ్వడానికి, లేదా కంప్లైంట్
              ఇవ్వడానికి లైవ్ పబ్లిక్ సెక్షన్ మరియు ఓటింగ్ సిస్టమ్ జోడింపు.
            </span>
          </div>
        </div>
      </div>
    ),
    time: new Date("2026-04-15T10:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
  {
    id: "foundation",
    isSystemElement: true,
    version: "v1.0.0",
    title: "ఏప్రిల్ 11, 2026: ఫౌండేషన్",
    badge: "FOUNDATION",
    text: (
      <div className="text-left space-y-4">
        <div className="flex items-center gap-3">
          <kbd className="bg-slate-900 text-white px-2 py-1 rounded text-xs font-black uppercase tracking-widest">
            v1.0.0
          </kbd>
          <p className="font-bold text-slate-700 text-lg">
            ఏప్రిల్ 11, 2026: ఎలక్ట్రానిక్ వేదికకు నాంది. పబ్లిక్ ఎంగేజ్మెంట్ !
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-600 text-sm leading-relaxed">
            పంచాయతీ ఆపరేటర్ల మరియు ఉద్యోగుల డిజిటల్ అవసరాలకోసం మా కు వచ్చిన
            అమూల్యమైన ఆలోచనలతో ఎలక్ట్రానిక్ వేదికకు నాంది. గూగుల్ **Gemini**
            మరియు **Chat GPT** కృత్రిమ మేధస్సుల సహాయంతో ఈ పోర్టల్‌ తొలి విడుదల
            మరియు పబ్లిక్ ఆర్టికల్స్ సిస్టం ప్రారంభించాము.
          </p>
        </div>
      </div>
    ),
    time: new Date("2026-04-11T14:00:00Z").getTime(),
    type: "changelog",
    status: "Approved",
  },
];
