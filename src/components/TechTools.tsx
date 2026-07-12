import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Book, 
  Wifi, 
  Cpu, 
  Code, 
  Search, 
  Check, 
  Share2, 
  Smartphone, 
  RefreshCw, 
  Star 
} from "lucide-react";

interface TechToolsProps {
  addToast: (s: string) => void;
  user: any;
}

const DICTIONARY_DATA = [
  {
    term: "Artificial Intelligence (AI)",
    teluguTerm: "కృత్రిమ మేధస్సు",
    def: "Simulating human intelligence in machines programmed to think and learn like humans.",
    teluguDef: "మనుషుల లాగే ఆలోచించేలా మరియు నేర్చుకునేలా మిషన్లను తయారు చేసే సాంకేతికత.",
    category: "AI & ML"
  },
  {
    term: "Cloud Computing",
    teluguTerm: "క్లౌడ్ కంప్యూటింగ్",
    def: "Delivery of computing services over the Internet including servers, storage, databases, networking.",
    teluguDef: "మన కంప్యూటర్ లో కాకుండా ఇంటర్నెట్ లోని సర్వర్లలో డేటాను దాచుకునే మరియు రన్ చేసే పద్ధతి.",
    category: "Infrastructure"
  },
  {
    term: "API (Application Programming Interface)",
    teluguTerm: "ఏపీఐ",
    def: "A set of protocols that allows different software applications to communicate with each other.",
    teluguDef: "రెండు వేర్వేరు సాఫ్ట్‌వేర్ అప్లికేషన్లు ఒకదానితో ఒకటి మాట్లాడుకోవడానికి సహాయపడే కనెక్టర్.",
    category: "Coding"
  },
  {
    term: "Blockchain",
    teluguTerm: "బ్లాక్‌చైన్",
    def: "A decentralized, distributed ledger technology that securely records transactions across a network.",
    teluguDef: "డేటాను సురక్షితంగా మరియు మార్చడానికి వీలు లేకుండా రికార్డ్ చేసే వికేంద్రీకృత సాంకేతికత.",
    category: "Security"
  },
  {
    term: "Cybersecurity",
    teluguTerm: "సైబర్ సెక్యూరిటీ",
    def: "The practice of protecting systems, networks, and programs from digital attacks.",
    teluguDef: "కంప్యూటర్లు, నెట్‌వర్క్‌లు మరియు డేటాను ఆన్‌లైన్ హ్యాకర్ల నుండి రక్షించుకునే పద్ధతి.",
    category: "Security"
  },
  {
    term: "IoT (Internet of Things)",
    teluguTerm: "ఇంటర్నెట్ ఆఫ్ థింగ్స్",
    def: "Connecting everyday physical devices to the internet to gather data and automate tasks.",
    teluguDef: "మన ఇంట్లో వాడే వస్తువులకు (AC, ఫ్రిజ్) ఇంటర్నెట్ కనెక్ట్ చేసి వాటిని ఫోన్ ద్వారా కంట్రోల్ చేయడం.",
    category: "Hardware"
  }
];

const GADGETS_DATA = [
  {
    id: "oneplus-ce4",
    name: "OnePlus Nord CE4",
    price: "₹24,999",
    rating: 4.5,
    processor: "Snapdragon 7 Gen 3",
    charging: "100W SuperVOOC",
    battery: "5500 mAh",
    camera: "50MP OIS Dual",
    display: "120Hz Fluid AMOLED",
    teluguReview: "ఈ బడ్జెట్‌లో సూపర్ బ్యాటరీ మరియు ఫాస్ట్ చార్జింగ్ కావాలనుకునే వారికి బెస్ట్ ఛాయిస్.",
    verdict: "Best Battery & Charging"
  },
  {
    id: "redmi-13pro",
    name: "Redmi Note 13 Pro+",
    price: "₹31,999",
    rating: 4.6,
    processor: "Dimensity 7200 Ultra",
    charging: "120W HyperCharge",
    battery: "5000 mAh",
    camera: "200MP OIS Triple",
    display: "1.5K Curved AMOLED",
    teluguReview: "ప్రీమియం కర్వ్డ్ డిస్‌ప్లే మరియు అద్భుతమైన 200MP కెమెరా క్వాలిటీ కలవు.",
    verdict: "Best Camera & Display"
  },
  {
    id: "samsung-a35",
    name: "Samsung Galaxy A35",
    price: "₹27,999",
    rating: 4.3,
    processor: "Exynos 1380 (5nm)",
    charging: "25W Fast Charge",
    battery: "5000 mAh",
    camera: "50MP OIS Triple",
    display: "120Hz Super AMOLED",
    teluguReview: "వాటర్ రెసిస్టెన్స్ (IP67) మరియు దీర్ఘకాల సాఫ్ట్‌వేర్ సపోర్ట్ కోరుకునే వారికి నమ్మకమైన ఫోన్.",
    verdict: "Best Build & Longevity"
  },
  {
    id: "nothing-2a",
    name: "Nothing Phone (2a)",
    price: "₹23,999",
    rating: 4.6,
    processor: "Dimensity 7200 Pro",
    charging: "45W Charging",
    battery: "5000 mAh",
    camera: "50MP Dual OIS",
    display: "120Hz Flexible AMOLED",
    teluguReview: "గ్లిఫ్ లైట్స్ బ్యాక్ ప్యానెల్ మరియు క్లీన్ నథింగ్ OS క్లాస్ అనుభూతిని ఇస్తుంది.",
    verdict: "Best UI & Design"
  },
  {
    id: "moto-edge50",
    name: "Moto Edge 50 Fusion",
    price: "₹22,999",
    rating: 4.5,
    processor: "Snapdragon 7s Gen 2",
    charging: "68W TurboPower",
    battery: "5000 mAh",
    camera: "50MP Sony LYT-600 OIS",
    display: "144Hz 3D Curved AMOLED",
    teluguReview: "లేటెస్ట్ వీగన్ లెదర్ బ్యాక్, అల్ట్రా స్లిమ్ బాడీ, మరియు 144Hz రిఫ్రెష్ రేట్ దీని ప్రత్యేకత.",
    verdict: "Best Sleek & Style"
  },
  {
    id: "iphone-15",
    name: "Apple iPhone 15",
    price: "₹71,999",
    rating: 4.7,
    processor: "A16 Bionic (4nm)",
    charging: "20W Charging",
    battery: "3349 mAh",
    camera: "48MP Dual (Super-Res)",
    display: "60Hz Super Retina XDR",
    teluguReview: "అద్భుతమైన ప్రొఫెషనల్ వీడియో రికార్డింగ్, పవర్ ఫుల్ పర్ఫార్మెన్స్ మరియు డైనమిక్ ఐలాండ్ ఫీచర్ కలవు.",
    verdict: "Best Performance & Video"
  }
];

export function TechToolsSection({ addToast }: TechToolsProps) {
  const [activeTool, setActiveTool] = useState<string>("dictionary");

  // Dictionary State
  const [dictSearch, setDictSearch] = useState("");
  const [dictCategory, setDictCategory] = useState("All");

  // Speedtest State
  const [speedState, setSpeedState] = useState<"idle" | "running" | "done">("idle");
  const [ping, setPing] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [adBlockerDetected, setAdBlockerDetected] = useState<boolean | null>(null);

  // Code Card State
  const [codeSnippet, setCodeSnippet] = useState(`// Simple JavaScript code to share
function greetUser(name) {
  console.log("Welcome to E-Vedhika Tech, " + name + "!");
  return "Happy Coding! 🚀";
}
greetUser("Telugu Developer");`);
  const [codeTitle, setCodeTitle] = useState("My Cool Script");
  const [cardGradient, setCardGradient] = useState("from-slate-900 to-slate-800");

  // Gadgets Comparison State
  const [compareMode, setCompareMode] = useState(false);
  const [phoneA, setPhoneA] = useState("oneplus-ce4");
  const [phoneB, setPhoneB] = useState("redmi-13pro");

  // Run Speedtest Simulation
  const startSpeedtest = () => {
    setSpeedState("running");
    setProgress(0);
    setPing(Math.floor(Math.random() * 30) + 12);
    setDownloadSpeed(0);
    setUploadSpeed(0);

    // Detect Adblocker (Check if standard ads file is blocked)
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbox";
    document.body.appendChild(testAd);
    window.setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setAdBlockerDetected(true);
      } else {
        setAdBlockerDetected(false);
      }
      testAd.remove();
    }, 100);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setSpeedState("done");
          setDownloadSpeed(parseFloat((Math.random() * 150 + 45).toFixed(1)));
          setUploadSpeed(parseFloat((Math.random() * 60 + 15).toFixed(1)));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const copyCodeCard = () => {
    navigator.clipboard.writeText(`--- ${codeTitle} ---\n${codeSnippet}`);
    addToast("Code snippet and template text copied! 📋");
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 shadow-xl border border-slate-100/50">
      {/* Tools Selector */}
      <div className="flex flex-wrap gap-2 mb-6 bg-slate-50 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTool("dictionary")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === "dictionary"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-200/50"
          }`}
        >
          <Book size={14} /> టెక్ డిక్షనరీ
        </button>
        <button
          onClick={() => setActiveTool("speedtest")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === "speedtest"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-200/50"
          }`}
        >
          <Wifi size={14} /> స్పీడ్ టెస్ట్
        </button>
        <button
          onClick={() => setActiveTool("codecard")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === "codecard"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-200/50"
          }`}
        >
          <Code size={14} /> కోడ్ కార్డ్ జెనరేటర్
        </button>
        <button
          onClick={() => setActiveTool("gadgets")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTool === "gadgets"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-200/50"
          }`}
        >
          <Smartphone size={14} /> మొబైల్స్ పోలిక (Reviews)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Tool 1: Tech Dictionary */}
        {activeTool === "dictionary" && (
          <motion.div
            key="dictionary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="టెక్నాలజీ పదం సెర్చ్ చేయండి (e.g. AI, Cloud)..."
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-bold text-slate-800"
                />
              </div>
              <div className="flex gap-2">
                {["All", "AI & ML", "Infrastructure", "Coding", "Security"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDictCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                      dictCategory === cat
                        ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DICTIONARY_DATA.filter((item) => {
                const matchesSearch = item.term.toLowerCase().includes(dictSearch.toLowerCase()) || 
                                     item.teluguTerm.includes(dictSearch);
                const matchesCategory = dictCategory === "All" || item.category === dictCategory;
                return matchesSearch && matchesCategory;
              }).map((item, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl space-y-2 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{item.term}</h3>
                    <h4 className="text-xs font-bold text-blue-600">({item.teluguTerm})</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{item.def}</p>
                  <p className="text-[11px] text-slate-500 italic bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed font-semibold">
                    {item.teluguDef}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tool 2: Speedtest */}
        {activeTool === "speedtest" && (
          <motion.div
            key="speedtest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-6 text-center space-y-6"
          >
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  className="text-blue-600 transition-all duration-200"
                  strokeWidth="8"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * progress) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                {speedState === "idle" && (
                  <button
                    onClick={startSpeedtest}
                    className="bg-blue-600 text-white w-24 h-24 rounded-full font-black text-sm uppercase tracking-wider shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    Start
                  </button>
                )}
                {speedState === "running" && (
                  <>
                    <span className="text-3xl font-black text-slate-900">{progress}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Testing</span>
                  </>
                )}
                {speedState === "done" && (
                  <>
                    <span className="text-3xl font-black text-slate-900">{downloadSpeed}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mbps</span>
                  </>
                )}
              </div>
            </div>

            {speedState === "done" && (
              <div className="grid grid-cols-3 gap-6 w-full max-w-md bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ping</p>
                  <p className="text-lg font-black text-slate-800">{ping} ms</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Download</p>
                  <p className="text-lg font-black text-emerald-600">{downloadSpeed} Mbps</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload</p>
                  <p className="text-lg font-black text-blue-600">{uploadSpeed} Mbps</p>
                </div>
              </div>
            )}

            {adBlockerDetected !== null && (
              <div className="p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2 max-w-md w-full justify-center bg-slate-50">
                {adBlockerDetected ? (
                  <span className="text-amber-600">🛡️ మీ బ్రౌజర్‌లో యాడ్ బ్లాకర్ ఆన్‌లో ఉంది (Ad Blocker Active).</span>
                ) : (
                  <span className="text-slate-600">✅ యాడ్ బ్లాకర్ లేదు. సైట్ సజావుగా రన్ అవుతోంది.</span>
                )}
              </div>
            )}

            {speedState === "done" && (
              <button
                onClick={startSpeedtest}
                className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100"
              >
                <RefreshCw size={14} /> మళ్లీ పరీక్షించండి (Retest)
              </button>
            )}
          </motion.div>
        )}

        {/* Tool 3: Code Card Generator */}
        {activeTool === "codecard" && (
          <motion.div
            key="codecard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  కార్డ్ టైటిల్ (Card Title)
                </label>
                <input
                  type="text"
                  value={codeTitle}
                  onChange={(e) => setCodeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                  కోడ్ రాయండి (Enter Code)
                </label>
                <textarea
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                  బ్యాక్‌గ్రౌండ్ కలర్ (Theme Gradient)
                </label>
                <div className="flex gap-2">
                  {[
                    { class: "from-slate-900 to-slate-800", label: "Dark Gray" },
                    { class: "from-indigo-900 via-purple-900 to-slate-900", label: "Midnight" },
                    { class: "from-blue-600 to-indigo-700", label: "Ocean Blue" },
                    { class: "from-emerald-800 to-slate-900", label: "Forest" }
                  ].map((grad, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCardGradient(grad.class)}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad.class} border-2 ${
                        cardGradient === grad.class ? "border-blue-500 scale-110" : "border-transparent"
                      }`}
                      title={grad.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className={`w-full max-w-sm rounded-3xl p-5 bg-gradient-to-br ${cardGradient} shadow-2xl relative overflow-hidden text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-white/50 uppercase">
                    {codeTitle || "CODESTATION"}
                  </span>
                </div>
                <pre className="font-mono text-[10px] leading-relaxed text-slate-200 overflow-x-auto whitespace-pre-wrap bg-black/30 p-4 rounded-2xl border border-white/5">
                  <code>{codeSnippet}</code>
                </pre>
                <div className="mt-4 flex items-center justify-between text-white/60 text-[9px] font-black tracking-widest uppercase">
                  <span>E-VEDHIKA TECH PORTAL</span>
                  <span>TELUGU TECH HUB</span>
                </div>
              </div>

              <button
                onClick={copyCodeCard}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg"
              >
                <Share2 size={14} /> కాపీ & షేర్ కార్డ్ (Copy & Share)
              </button>
            </div>
          </motion.div>
        )}

        {/* Tool 4: Gadgets Compare */}
        {activeTool === "gadgets" && (
          <motion.div
            key="gadgets"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2 pb-3 border-b border-slate-100/80">
              <div>
                <h3 className="text-sm font-black text-slate-900">మొబైల్ గైడ్ & పోలికలు (Mobiles Hub)</h3>
                <p className="text-[10px] text-slate-500 font-bold">తాజా స్మార్ట్‌ఫోన్ల స్పెసిఫికేషన్స్ మరియు రివ్యూస్</p>
              </div>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-black uppercase px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-100"
              >
                {compareMode ? "📱 జాబితా చూడండి (Show List)" : "⚖️ పోటీగా నిలబెట్టు (Compare Side-by-Side)"}
              </button>
            </div>

            {!compareMode ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GADGETS_DATA.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                          {item.verdict}
                        </span>
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Star size={11} fill="currentColor" />
                          <span className="text-[10px] font-black">{item.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-slate-900">{item.name}</h3>
                      <p className="text-xs font-black text-slate-500">{item.price}</p>
                      
                      <div className="space-y-1.5 text-[10px] font-bold text-slate-600 border-t border-slate-100/50 pt-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Processor:</span>
                          <span className="text-slate-800">{item.processor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Display:</span>
                          <span className="text-slate-800">{item.display}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Battery:</span>
                          <span className="text-slate-800">{item.battery} ({item.charging})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Camera:</span>
                          <span className="text-slate-800">{item.camera}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-100/80 p-2.5 rounded-xl leading-relaxed">
                        <span className="font-bold text-slate-700 block mb-0.5">తెలుగు రివ్యూ:</span>
                        {item.teluguReview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-2xl p-4 md:p-6 space-y-6">
                {/* Selectors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                      మొదటి ఫోన్ (Phone A)
                    </label>
                    <select
                      value={phoneA}
                      onChange={(e) => setPhoneA(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {GADGETS_DATA.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">
                      రెండవ ఫోన్ (Phone B)
                    </label>
                    <select
                      value={phoneB}
                      onChange={(e) => setPhoneB(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {GADGETS_DATA.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.price})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specs Table */}
                {(() => {
                  const pA = GADGETS_DATA.find((p) => p.id === phoneA) || GADGETS_DATA[0];
                  const pB = GADGETS_DATA.find((p) => p.id === phoneB) || GADGETS_DATA[1];

                  const specRow = (label: string, valA: string | number, valB: string | number, highBetter = false, teluguLabel = "") => {
                    let isABetter = false;
                    let isBBetter = false;

                    if (highBetter) {
                      const numA = parseFloat(valA.toString());
                      const numB = parseFloat(valB.toString());
                      if (!isNaN(numA) && !isNaN(numB)) {
                        isABetter = numA > numB;
                        isBBetter = numB > numA;
                      }
                    }

                    return (
                      <div className="grid grid-cols-3 py-3 border-b border-slate-100 text-xs font-bold text-slate-700 items-center">
                        <div className="text-left text-slate-400 flex flex-col">
                          <span>{label}</span>
                          {teluguLabel && <span className="text-[9px] font-bold text-slate-300">{teluguLabel}</span>}
                        </div>
                        <div className={`px-2 text-center ${isABetter ? "text-emerald-600 bg-emerald-50 py-1.5 rounded-xl" : ""}`}>
                          {valA}
                        </div>
                        <div className={`px-2 text-center ${isBBetter ? "text-emerald-600 bg-emerald-50 py-1.5 rounded-xl" : ""}`}>
                          {valB}
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="bg-white rounded-2xl border border-slate-100 p-3 md:p-5 shadow-sm">
                      <div className="grid grid-cols-3 border-b-2 border-slate-100 pb-3 text-xs font-black uppercase text-indigo-600 tracking-wider">
                        <div>ఫీచర్ (Spec)</div>
                        <div className="text-center">{pA.name}</div>
                        <div className="text-center">{pB.name}</div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {specRow("Price", pA.price, pB.price, false, "ధర")}
                        {specRow("Rating", pA.rating, pB.rating, true, "రేటింగ్")}
                        {specRow("Processor", pA.processor, pB.processor, false, "ప్రాసెసర్")}
                        {specRow("Display", pA.display, pB.display, false, "డిస్‌ప్లే")}
                        {specRow("Battery", pA.battery, pB.battery, false, "బ్యాటరీ")}
                        {specRow("Charging", pA.charging, pB.charging, false, "చార్జింగ్")}
                        {specRow("Camera", pA.camera, pB.camera, false, "కెమెరా")}
                        {specRow("Verdict", pA.verdict, pB.verdict, false, "విశిష్టత")}
                      </div>

                      {/* Side by side Reviews */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                            {pA.name} Review
                          </span>
                          <p className="text-[11px] font-semibold text-slate-600 leading-relaxed italic">
                            "{pA.teluguReview}"
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl space-y-1.5">
                          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                            {pB.name} Review
                          </span>
                          <p className="text-[11px] font-semibold text-slate-600 leading-relaxed italic">
                            "{pB.teluguReview}"
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
