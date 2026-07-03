export interface UpdateEntry {
  id: string;
  version: string;
  time: number;
  date: string;
  badge: string;
  title: string;
  description: string;
  color?: string;
  isHot?: boolean;
}

export const SYSTEM_UPDATES: UpdateEntry[] = [
  {
    id: "sys_v165",
    version: "V1.6.5",
    time: Date.now(),
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    badge: "NEW",
    title: "డైరెక్ట్ డౌన్లోడ్స్ & పర్మనెంట్ ఫైల్ సిస్టం 🚀",
    description: "అప్‌డేట్స్ వచ్చిన ప్రతిసారీ ఫైల్స్ పోకుండా శాశ్వతంగా ఉండేలా (Permanent File Handling) మార్పులు చేసాము మరియు పోస్ట్‌లలో డైరెక్ట్ డౌన్లోడ్ లింక్ (Direct Download Link) ఇచ్చే కొత్త ఫీచర్ తీసుకువచ్చాము.",
    color: "bg-fuchsia-500",
  },
  {
    id: "sys_v164",
    version: "V1.6.4",
    time: Date.now(),
    date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    badge: "UPDATE",
    title: "ట్రాఫిక్ ఎనలిటిక్స్ & ఫైల్ అప్‌డేట్స్ 🚀",
    description: "యూజర్స్ ఏ ప్లాట్‌ఫామ్ ద్వారా (WhatsApp, Facebook, etc.) వెబ్‌సైట్‌ను విజిట్ చేస్తున్నారో ట్రాక్ చేయడానికి కొత్త ఎనలిటిక్స్ ఫీచర్ మరియు అడ్మిన్ ప్యానెల్‌లో విజువలైజేషన్, అలాగే పోస్ట్‌ల ఫైల్స్ అప్‌లోడ్‌లో కొత్త బ్యాడ్జ్ కేటగిరీల ఫీచర్ తీసుకురాబడింది.",
    color: "bg-blue-500",
  },
  {
    id: "sys_v163",
    version: "V1.6.3",
    time: 1780594724000,
    date: "04, జూన్ 2026",
    badge: "UPDATE",
    title: "నాలెడ్జ్ హబ్ & అడ్వాన్స్డ్ కామెంట్ సిస్టం 🚀",
    description: "PR Act Hub ని 'నాలెడ్జ్ హబ్' గా మార్చాము. అలాగే కామెంట్స్ ని లైక్ చేయడం మరియు అడ్మిన్ కామెంట్స్ ని కన్ఫర్మేషన్ తో డిలీట్ చేసే అడ్వాన్స్డ్ ఫీచర్స్ తీసుకువచ్చాము.",
    color: "bg-rose-500",
  },
  {
    id: "sys_v162",
    version: "V1.6.2",
    time: 1779537600000,
    date: "23, మే 2026",
    badge: "MAJOR",
    title: "Farmer Registry WOW Progress 🚀",
    description: "Farmer Registry లో WOW అనిపించే డైనమిక్ ప్రోగ్రెస్ బార్ మరియు విజువల్స్ జోడించబడ్డాయి. మొబైల్ లో కూడా పక్కాగా అడ్జస్ట్ అయ్యేలా రీసెట్ బటన్ కిందకు మార్చబడింది.",
    color: "bg-emerald-500",
  },
  {
    id: "sys_v160",
    version: "V1.6.0",
    time: 1779451200000,
    date: "22, మే 2026",
    badge: "MAJOR",
    title: "అడ్వాన్స్డ్ మల్టీ-ఫైల్ పైప్‌లైన్",
    description: "ఒకేసారి మల్టిపుల్ గ్రామ పంచాయతీల ఫైళ్లను అప్‌లోడ్ చేసి బ్యాక్-టు-బ్యాక్ లైవ్ వెరిఫికేషన్ చేసే ఆటోమేషన్ ఫీచర్ రిలీజ్ అయ్యింది.",
    color: "bg-indigo-600",
  },
  {
    id: "sys_v158",
    version: "V1.5.8",
    time: 1779278400000,
    date: "20, మే 2026",
    badge: "UPDATE",
    title: "PR Act 2018 పాకెట్ గైడ్",
    description: "తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 లోని అన్ని సెక్షన్లు మరియు షెడ్యూల్స్ ఇప్పుడు సులభంగా వెతుక్కునేలా అందుబాటులోకి వచ్చాయి.",
  },
  {
    id: "sys_v148",
    version: "V1.4.8",
    time: 1778846400000,
    date: "15, మే 2026",
    badge: "NEW",
    title: "కొత్త యూజర్ ఇంటర్‌ఫేస్",
    description: "మొత్తం వెబ్ పోర్టల్ ఇప్పుడు మరింత వేగంగా మరియు అందంగా మార్చబడింది. మొబైల్ యూజర్లకు ప్రత్యేకమైన ఫీచర్లు యాడ్ అయ్యాయి.",
  },
];
