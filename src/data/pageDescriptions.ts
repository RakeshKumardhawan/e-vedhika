export interface PageDescriptionEntry {
  title: string;
  description: string;
  youtubeUrl?: string;
  guideSteps?: string[];
  purpose?: string;
  targetAudience?: string;
  realLifeUseCases?: string[];
  limitations?: string;
  dataPrivacy?: string;
  officialReference?: string;
  lastVerified?: string;

  // English counterparts
  titleEn?: string;
  descriptionEn?: string;
  guideStepsEn?: string[];
  purposeEn?: string;
  targetAudienceEn?: string;
  realLifeUseCasesEn?: string[];
  limitationsEn?: string;
  dataPrivacyEn?: string;
  officialReferenceEn?: string;
  lastVerifiedEn?: string;
}

export const DEFAULT_PAGE_DESCRIPTIONS: Record<string, PageDescriptionEntry> = {
  home: {
    title: "హోమ్ (E-Vedhika Digital Governance & Technical Knowledge Portal)",
    description:
      "ఈ-వేదిక (E-Vedhika - All Problems One Solution at One Place) అనేది తెలంగాణ మరియు ఆంధ్రప్రదేశ్ గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, టెక్నికల్ అసిస్టెంట్లు, సర్పంచులు, గ్రామ పంచాయతీ సిబ్బంది మరియు పౌరుల కోసం రూపొందించబడిన స్వతంత్ర డిజిటల్ నాలెడ్జ్ మరియు యూటిలిటీ పోర్టల్. రోజువారీ హాజరు విశ్లేషణ, జీవోలు, UBD/DSC టెక్నికల్ పరిష్కారాలు మరియు ఆఫీస్ ఆటోమేషన్ టూల్స్ ఇక్కడ అందుబాటులో ఉన్నాయి.",
    titleEn: "Home - E-Vedhika Digital Governance & Technical Knowledge Portal",
    descriptionEn: "E-Vedhika (All Problems One Solution at One Place) is an independent digital knowledge and utility portal designed for Telangana & AP Panchayat Secretaries, e-Panchayat Computer Operators, Technical Assistants, Sarpanches, Gram Panchayat staff, and citizens. Daily attendance analytics, GOs, UBD/DSC technical solutions, and office automation tools are available here.",
    lastVerified: "నవంబర్ 2026",
    lastVerifiedEn: "November 2026"
  },
  workspace: {
    title: "మన పంచాయతీ - డిజిటల్ వర్క్‌స్పేస్ (Mana Panchayath Digital Workspace)",
    description:
      "గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు మండల స్థాయి సాంకేతిక సిబ్బంది రోజువారీ పరిపాలనా పనులను వేగవంతం చేసే సమగ్ర ఆన్‌లైన్ టూల్స్ వేదిక. DSR ఆటోమేటిక్ విశ్లేషణ, మల్టీ-డే హాజరు, మాసాంతపు యాక్టివిటీ రిపోర్ట్ (MAS), ఎక్సెల్ విలీనం, GPDP బడ్జెట్ ప్రణాళిక మరియు పంచాయతీరాజ్ చట్టం 2018 నాలెడ్జ్ హబ్ ఒకే చోట అందుబాటులో ఉన్నాయి.",
    purpose:
      "గ్రామ పంచాయతీ మరియు మండల పరిషత్ కార్యాలయాలలో గంటల తరబడి మాన్యువల్‌గా చేసే ఎక్సెల్ క్యాలిక్యులేషన్లు, హాజరు సమీక్షలు, GPDP బడ్జెట్ కేటాయింపులు మరియు రిపోర్ట్ ఫార్మాటింగ్ పనులను కేవలం కొన్ని సెకన్లలో ఖచ్చితత్వంతో పూర్తి చేయడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు (Panchayat Secretaries), ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు (e-Panchayat Computer Operators), టెక్నికల్ అసిస్టెంట్లు, సర్పంచులు మరియు గ్రామ పంచాయతీ సిబ్బంది.",
    guideSteps: [
      "మీకు అవసరమైన ఆన్‌లైన్ టూల్ కార్డుపై (DSR Analyzer, Multi-Day Attendance, MAS, Excel Merger, GPDP Planning లేదా Knowledge Hub) క్లిక్ చేయండి.",
      "ప్రతి టూల్ పైభాగంలో ఇచ్చిన తెలుగు + ఇంగ్లీష్ దశలవారీ సూచనలను చదివి, మీ అధికారిక ఎక్సెల్ లేదా డేటా ఫైల్‌ను అప్‌లోడ్ చేయండి.",
      "ఆటోమేటిక్‌గా విశ్లేషించబడిన సమ్మరీ టేబుల్స్, మండల/గ్రామ పంచాయతీ వారీ నివేదికలను పరిశీలించి Excel లేదా A4 PDF ఫార్మాట్‌లో డౌన్‌లోడ్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "ఉదయం 9:00 AM మరియు 11:00 AM సమయానికి మండలాల వారీగా పంచాయతీ కార్యదర్శుల హాజరు & DSR నమోదు స్థితిని క్షణాల్లో సిద్ధం చేయడం.",
      "నెలవారీ సమీక్షా సమావేశాలకు 30 రోజుల మల్టీ-డే అటెండెన్స్ మరియు MAS యాక్టివిటీ మ్యాట్రిక్స్ నివేదికలను తయారు చేయడం.",
      "గ్రామ సభ ఆమోదం కోసం GPDP వార్షిక బడ్జెట్ ప్రణాళికలను ప్రభుత్వ 9 థీమ్‌ల వారీగా రూపొందించడం."
    ],
    limitations:
      "ఈ వర్క్‌స్పేస్‌లోని టూల్స్ ప్రభుత్వ పోర్టల్ నుండి డౌన్‌లోడ్ చేసిన Raw డేటా ఫైళ్లను విశ్లేషించడానికి మాత్రమే ఉపయోగపడతాయి; ఇవి నేరుగా ప్రభుత్వ సర్వర్‌లోని డేటాను మార్చవు.",
    dataPrivacy:
      "100% క్లయింట్-సైడ్ ప్రాసెసింగ్ (Client-Side Browser Processing): మీరు అప్‌లోడ్ చేసే ఎక్సెల్ ఫైళ్లు మీ కంప్యూటర్/మొబైల్ బ్రౌజర్ మెమరీలోనే ప్రాసెస్ చేయబడతాయి. ఏ సర్వర్‌కూ అప్‌లోడ్ కావు.",
    officialReference: "Telangana e-Panchayat Portal (epanchayat.telangana.gov.in) & eGramSwaraj (egramswaraj.gov.in)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Mana Panchayath - Digital Workspace",
    descriptionEn: "Comprehensive online tools platform for Gram Panchayat Secretaries, Computer Operators, and Mandal technical staff to streamline daily administrative tasks. Automated DSR analysis, multi-day attendance, Monthly Activity Report (MAS), Excel merger, GPDP budget planning, and Panchayat Raj Act Knowledge Hub.",
    purposeEn: "Speeding up manual Excel calculations, attendance reviews, GPDP budget allocations, and report formatting tasks in GP and MPDO offices with 100% accuracy within seconds.",
    targetAudienceEn: "Panchayat Secretaries, e-Panchayat Computer Operators, Technical Assistants, Sarpanches, and GP staff.",
    guideStepsEn: [
      "Click on the desired online tool card (DSR Analyzer, Multi-Day Attendance, MAS, Excel Merger, GPDP Planning, or Knowledge Hub).",
      "Read the step-by-step instructions at the top of each tool and upload your official Excel or data file.",
      "Review the automatically analyzed summary tables, Mandal/GP-wise reports, and download in Excel or A4 PDF format."
    ],
    realLifeUseCasesEn: [
      "Quickly preparing Mandal-wise Panchayat Secretary attendance & DSR entry status before 9:00 AM and 11:00 AM.",
      "Generating 30-day multi-day attendance and MAS activity matrix reports for monthly review meetings.",
      "Creating GPDP annual budget plans according to the 9 government themes for Gram Sabha approval."
    ],
    limitationsEn: "Tools in this workspace are designed to analyze raw data files downloaded from official government portals; they do not modify government server data directly.",
    dataPrivacyEn: "100% Client-Side Browser Processing: The Excel files you upload are processed entirely in your computer/mobile browser memory. Nothing is uploaded to any external server.",
    officialReferenceEn: "Telangana e-Panchayat Portal & eGramSwaraj",
    lastVerifiedEn: "November 2026"
  },
  dsr: {
    title: "డైలీ DSR & అటెండెన్స్ అనలైజర్ (Daily DSR & Attendance Analyzer)",
    description:
      "మన పంచాయతీ పోర్టల్ నుండి డౌన్‌లోడ్ చేసిన రోజువారీ DSR మరియు హాజరు (Attendance) ఎక్సెల్/HTML ఫైళ్లను సెకన్లలో విశ్లేషించి, మండలాల వారీగా మరియు గ్రామ పంచాయతీల వారీగా సమగ్ర నివేదికలను (Before 9 AM, 9-11 AM, After 11 AM, Leave, Meeting, Not Reported, DSR Entered) రూపొందించే ఆటోమేటెడ్ టూల్.",
    purpose:
      "ప్రతిరోజూ ఉదయం వందలాది గ్రామ పంచాయతీల హాజరు సమయాలను (6-7 AM, 7-8 AM, 8-9 AM, 9-11 AM, After 11 AM) మరియు DSR ఎంట్రీ స్థితిని మాన్యువల్‌గా ఫిల్టర్ చేసే శ్రమ లేకుండా, ఒక్క క్లిక్‌తో అధికారిక 20-కాలమ్ సమ్మరీ టేబుల్, ఎక్సెల్ మరియు PDF నివేదికలను రూపొందించడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు, మండల పరిషత్ సిబ్బంది మరియు టెక్నికల్ అసిస్టెంట్లు.",
    guideSteps: [
      "మన పంచాయతీ (Mana Panchayati) పోర్టల్ నుండి మీ జిల్లా లేదా మండల రోజువారీ Attendance / DSR Excel (.xlsx / .xls / .html) ఫైల్‌ను డౌన్‌లోడ్ చేసుకోండి.",
      "'Select DSR Excel File' బటన్‌పై క్లిక్ చేసి డౌన్‌లోడ్ చేసిన ఫైల్‌ను ఎంచుకోండి. ఫైల్ అప్‌లోడ్ అయిన వెంటనే బ్రౌజర్‌లోనే ఆటోమేటిక్ విశ్లేషణ జరుగుతుంది.",
      "మండలాల వారీగా 6-7 AM, 7-8 AM, 8-9 AM, Before 9 AM %, After 11 AM %, Leave, Meeting, Not Reported మరియు DSR Status గణాంకాలు టేబుల్‌లో కనిపిస్తాయి.",
      "ఏదైనా మండలంపై క్లిక్ చేస్తే ఆ మండలంలోని ప్రతి గ్రామ పంచాయతీ (GP-wise) హాజరు సమయం మరియు DSR నమోదు వివరాలు విడిగా కనిపిస్తాయి.",
      "'Copy Table' ద్వారా వాట్సాప్/ఎక్సెల్‌కు కాపీ చేయండి లేదా 'Mandal Excel', 'Full GP Excel', 'Summary PDF' బటన్లతో అధికారిక నివేదికలను డౌన్‌లోడ్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "ఉదయం 9:00 గంటలలోపు ఎంతమంది పంచాయతీ కార్యదర్శులు హాజరు నమోదు చేశారో శాతం (Percentage) తో సహా నివేదిక తయారు చేయడం.",
      "ఉదయం 11:00 గంటల లోపు మరియు 11:00 గంటల తర్వాత DSR నమోదు చేసిన గ్రామ పంచాయతీలను వేరు చేసి పెండింగ్ GPల జాబితాను గుర్తించడం.",
      "మండల వారీగా వ్యక్తిగత A4 PDF రిపోర్టులను ఒక్క క్లిక్‌తో జనరేట్ చేసి మండల గ్రూపులలో షేర్ చేయడం."
    ],
    limitations:
      "మన పంచాయతీ పోర్టల్ ప్రామాణిక ఎక్సెల్/HTML కాలమ్ ఫార్మాట్ (Mandal, Grama Panchayat, Attendance Time, Status, DSR Time) ఉన్న ఫైళ్లకు మాత్రమే ఖచ్చితమైన ఫలితాలు వస్తాయి. కాలమ్ పేర్లు పూర్తిగా తొలగించబడిన ఫైళ్లను అప్‌లోడ్ చేయవద్దు.",
    dataPrivacy:
      "100% సురక్షితం & ప్రైవేట్: మీరు ఎంచుకునే DSR ఎక్సెల్ ఫైల్ మీ బ్రౌజర్ (Local RAM) లో మాత్రమే చదవబడుతుంది. ఈ-వేదిక సర్వర్‌లో గానీ, క్లౌడ్ డేటాబేస్‌లో గానీ ఉద్యోగుల హాజరు ఫైళ్లు నిల్వ చేయబడవు.",
    officialReference: "Mana Panchayati Attendance & DSR Reporting Format (Telangana PR & RD)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Daily DSR & Attendance Analyzer",
    descriptionEn: "Automated tool that analyzes daily DSR and attendance Excel/HTML files downloaded from the Mana Panchayati portal in seconds, generating comprehensive Mandal-wise and Gram Panchayat-wise reports (Before 9 AM, 9-11 AM, After 11 AM, Leave, Meeting, Not Reported, DSR Entered).",
    purposeEn: "Eliminating the manual effort of filtering attendance times and DSR entry status for hundreds of Gram Panchayats daily, generating official summary tables, Excel, and PDF reports with a single click.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, Mandal Parishad staff, and Technical Assistants.",
    guideStepsEn: [
      "Download your district or Mandal daily Attendance / DSR Excel (.xlsx / .xls / .html) file from Mana Panchayati portal.",
      "Click 'Select DSR Excel File' button and choose the downloaded file. Automatic analysis occurs immediately in the browser.",
      "Mandal-wise attendance and DSR status statistics appear in the table.",
      "Click any Mandal to view individual Gram Panchayat (GP-wise) attendance times and DSR entry details.",
      "Copy to WhatsApp/Excel via 'Copy Table' or download official reports using 'Mandal Excel', 'Full GP Excel', and 'Summary PDF' buttons."
    ],
    realLifeUseCasesEn: [
      "Preparing attendance reports including percentage of Panchayat Secretaries who registered attendance before 9:00 AM.",
      "Identifying pending GPs by filtering Gram Panchayats that entered DSR before 11:00 AM versus after 11:00 AM.",
      "Generating individual Mandal-wise A4 PDF reports with one click to share in Mandal WhatsApp groups."
    ],
    limitationsEn: "Accurate results are generated only for files with Mana Panchayati portal standard Excel/HTML column formats.",
    dataPrivacyEn: "100% Secure & Private: The DSR Excel file you select is read solely in your browser (Local RAM). Employee attendance files are not stored on E-Vedhika servers.",
    officialReferenceEn: "Mana Panchayati Attendance & DSR Reporting Format (Telangana PR & RD)",
    lastVerifiedEn: "November 2026"
  },
  multiday: {
    title: "మల్టీ-డే హాజరు విశ్లేషణ (Multi-Day Attendance Analyzer)",
    description:
      "వారం, పక్షం లేదా నెల రోజుల (Multiple Days) హాజరు ఎక్సెల్ ఫైళ్లను ఒకేసారి అప్‌లోడ్ చేసి, ప్రతి గ్రామ పంచాయతీ మరియు కార్యదర్శి వారీగా మొత్తం పని దినాలు, హాజరైన రోజులు, సెలవులు, ఆలస్యంగా వచ్చిన రోజులు మరియు హాజరు శాతాన్ని (Attendance %) కన్సాలిడేట్ చేసే అడ్వాన్స్‌డ్ టూల్.",
    purpose:
      "ఒకటి కంటే ఎక్కువ రోజుల హాజరు ఫైళ్లను మాన్యువల్‌గా VLOOKUP వేసి కలపడం చాలా సమయం తీసుకునే పని. ఈ టూల్ 30 రోజుల వరకు ఉన్న డైలీ ఫైళ్లను ఒకేసారి చదివి, తేదీల వారీగా (Date-wise Matrix) మరియు ఉద్యోగుల వారీగా సమగ్ర నెలవారీ హాజరు నివేదికను సిద్ధం చేస్తుంది.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు మరియు మండల కార్యాలయ అడ్మినిస్ట్రేటివ్ సిబ్బంది.",
    guideSteps: [
      "మీరు విశ్లేషించాలనుకుంటున్న తేదీల (ఉదా: 1వ తేదీ నుండి 30వ తేదీ వరకు) డైలీ అటెండెన్స్ ఎక్సెల్ ఫైళ్లను ఒక ఫోల్డర్‌లో సిద్ధంగా ఉంచుకోండి.",
      "మల్టీ-డే అటెండెన్స్ టూల్‌లో ఫైల్ అప్‌లోడ్ బాక్స్‌పై క్లిక్ చేసి, అన్ని రోజుల ఎక్సెల్ ఫైళ్లను ఒకేసారి (Multiple Selection) సెలెక్ట్ చేయండి.",
      "సిస్టమ్ ప్రతి ఫైల్‌లోని తేదీని గుర్తించి, మండలం మరియు గ్రామ పంచాయతీ వారీగా ప్రతి రోజు హాజరు స్థితిని (Present, Leave, Meeting, Not Reported) జత చేస్తుంది.",
      "మండల ఫిల్టర్ లేదా సెర్చ్ బాక్స్ ద్వారా నిర్దిష్ట గ్రామ పంచాయతీల నెలవారీ హాజరు సరళిని మరియు శాతాన్ని పరిశీలించండి.",
      "పూర్తి కన్సాలిడేటెడ్ మల్టీ-డే మ్యాట్రిక్స్‌ను Excel (.xlsx) లేదా ప్రింట్-రెడీ PDF ఫార్మాట్‌లో డౌన్‌లోడ్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "నెలవారీ జీతాల బిల్లులు మరియు సర్వీస్ రివ్యూల సమయంలో ఏయే తేదీలలో హాజరు నమోదు కాలేదో (Not Reported Days) కచ్చితంగా గుర్తించడం.",
      "వరుసగా హాజరు నమోదు చేయని లేదా తరచుగా ఆలస్యంగా (After 11 AM) నమోదు చేస్తున్న గ్రామ పంచాయతీల గణాంకాలను విశ్లేషించడం.",
      "మండల స్థాయి నెలవారీ సమీక్షా సమావేశాలకు (Monthly Review Meetings) సమగ్ర హాజరు నివేదిక సమర్పించడం."
    ],
    limitations:
      "అన్ని రోజుల ఎక్సెల్ ఫైళ్లలో మండలం మరియు గ్రామ పంచాయతీ పేర్లు ఒకే విధంగా (Standard Spelling) ఉండాలి. ఒకే తేదీకి చెందిన ఫైల్‌ను రెండుసార్లు అప్‌లోడ్ చేస్తే డూప్లికేట్ కౌంట్ రాకుండా తేదీలను సరిచూసుకోవాలి.",
    dataPrivacy:
      "మీరు అప్‌లోడ్ చేసే బహుళ ఎక్సెల్ ఫైళ్లు పూర్తిగా మీ బ్రౌజర్‌లోనే (Client-Side JavaScript Engine) ప్రాసెస్ అవుతాయి. బయటి సర్వర్‌లకు ఎలాంటి డేటా పంపబడదు.",
    officialReference: "Telangana Panchayat Raj Multi-Day Attendance Consolidation Standards",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Multi-Day Attendance Analyzer",
    descriptionEn: "Advanced tool that uploads weekly, fortnightly, or monthly attendance Excel files simultaneously to consolidate total working days, days present, leaves, late arrivals, and attendance percentage for each Gram Panchayat and Secretary.",
    purposeEn: "Saving time compared to manual VLOOKUP merging of multi-day files. This tool reads daily files up to 30 days at once and prepares comprehensive monthly attendance reports in date-wise matrix and employee-wise formats.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, and Mandal administrative staff.",
    guideStepsEn: [
      "Keep daily attendance Excel files for the desired dates ready in a folder.",
      "Click file upload box in Multi-Day Attendance tool and select all daily Excel files at once (Multiple Selection).",
      "System identifies dates from each file and maps daily attendance status per Mandal and Gram Panchayat.",
      "Inspect monthly attendance patterns and percentages of specific Gram Panchayats via Mandal filter or search box.",
      "Download full consolidated multi-day matrix in Excel (.xlsx) or print-ready PDF format."
    ],
    realLifeUseCasesEn: [
      "Accurately identifying dates when attendance was not recorded (Not Reported Days) during monthly salary bill preparation and service reviews.",
      "Analyzing statistics of Gram Panchayats that consistently fail to register or register late (After 11 AM).",
      "Submitting comprehensive attendance reports for Mandal-level monthly review meetings."
    ],
    limitationsEn: "Mandal and Gram Panchayat names must have standard spelling across all daily files.",
    dataPrivacyEn: "Multiple Excel files you upload are processed entirely in your browser. No data is sent to external servers.",
    officialReferenceEn: "Telangana Panchayat Raj Multi-Day Attendance Consolidation Standards",
    lastVerifiedEn: "November 2026"
  },
  training: {
    title: "డిజిటల్ ట్రైనింగ్ & ప్రాక్టికల్ ట్యుటోరియల్స్ (Digital Training & Practical Tutorials Hub)",
    description:
      "గ్రామ పంచాయతీ కార్యదర్శులు మరియు ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్ల కోసం రూపొందించిన సంపూర్ణ సాంకేతిక శిక్షణా కేంద్రం. తెలంగాణ & ఏపీ UBD పోర్టల్, జనన మరణ నమోదు, DSC టోకెన్ (ProxKey, HYP2003/ePass2003), Edge IE Mode, GPDP ప్లానింగ్ మరియు ఆఫీస్ ఆటోమేషన్‌పై 11-అంశాల ప్రాక్టికల్ ట్యుటోరియల్స్.",
    purpose:
      "క్షేత్రస్థాయిలో గ్రామ పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు కార్యదర్శులు ఎదుర్కొనే సాంకేతిక సమస్యలను (Java/Signer errors, DSC Token issues, UBD printing blocks, Excel formatting) ఇతర టెక్నీషియన్లపై ఆధారపడకుండా స్వయంగా పరిష్కరించుకునేలా దశలవారీ శిక్షణ అందించడం.",
    targetAudience:
      "కొత్తగా చేరిన మరియు సీనియర్ ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు, టెక్నికల్ అసిస్టెంట్లు మరియు గ్రామ పంచాయతీ సిబ్బంది.",
    guideSteps: [
      "క్రింద ఇవ్వబడిన ప్రాక్టికల్ ట్యుటోరియల్ మాడ్యూల్స్ (UBD & CRS, DSC Tokens, Edge IE Mode, GPDP & eGramSwaraj, Excel & DSR Automation) నుండి మీకు కావలసిన అంశాన్ని ఎంచుకోండి.",
      "ప్రతి ట్యుటోరియల్‌లో ఇచ్చిన 11 విభాగాలను (పరిచయం, సమస్య వివరణ, ముందస్తు అవసరాలు, దశలవారీ పరిష్కారం, UI తనిఖీ, ఆశించిన ఫలితం, సాధారణ లోపాలు, ట్రబుల్‌షూటింగ్, జాగ్రత్తలు) వరుసగా అనుసరించండి.",
      "అవసరమైన చోట 'వాచ్ ట్యుటోరియల్' బటన్ ద్వారా వీడియో డెమో చూడండి లేదా సంబంధిత ఆన్‌లైన్ టూల్‌ను నేరుగా ఓపెన్ చేసి ప్రాక్టీస్ చేయండి."
    ],
    realLifeUseCases: [
      "కొత్త కంప్యూటర్‌లో Windows 10/11 ఇన్‌స్టాల్ చేసిన తర్వాత UBD పోర్టల్ కోసం DSC టోకెన్ డ్రైవర్లు మరియు Edge IE5 Mode స్వయంగా సెటప్ చేయడం.",
      "జనన/మరణ సర్టిఫికెట్ డిజిటల్ సంతకం సమయంలో వచ్చే 'Error in Signing / Port 8080 blocked' సమస్యను 5 నిమిషాల్లో పరిష్కరించడం.",
      "గ్రామ పంచాయతీ రికార్డుల నిర్వహణ మరియు ఆన్‌లైన్ రిపోర్టింగ్ విధానాలపై స్పష్టమైన అవగాహన పొందడం."
    ],
    limitations:
      "ఈ ట్యుటోరియల్స్ సాంకేతిక అవగాహన మరియు సమస్యల పరిష్కారం కోసం రూపొందించబడిన స్వతంత్ర మార్గదర్శకాలు. ప్రభుత్వ విధానపరమైన నిర్ణయాల కోసం సంబంధిత శాఖ వారి అధికారిక సర్క్యులర్లను మాత్రమే ప్రామాణికంగా తీసుకోవాలి.",
    dataPrivacy:
      "ఈ శిక్షణా మాడ్యూల్ పూర్తిగా పబ్లిక్ ఎడ్యుకేషనల్ రిసోర్స్. ఇందులో ఎలాంటి వ్యక్తిగత సమాచారం సేకరించబడదు.",
    officialReference: "ubd.telangana.gov.in, crsorgi.gov.in, epanchayat.telangana.gov.in, egramswaraj.gov.in",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Digital Training & Practical Tutorials Hub",
    descriptionEn: "Comprehensive technical training center designed for Gram Panchayat Secretaries and e-Panchayat Computer Operators. 11 practical tutorials on Telangana & AP UBD portals, birth/death registration, DSC tokens (ProxKey, HYP2003/ePass2003), Edge IE Mode, GPDP planning, and office automation.",
    purposeEn: "Providing step-by-step training so field-level operators and secretaries can independently resolve technical issues without relying on external technicians.",
    targetAudienceEn: "Newly joined and senior e-Panchayat Computer Operators, Panchayat Secretaries, Technical Assistants, and GP staff.",
    guideStepsEn: [
      "Select desired practical tutorial modules from the list.",
      "Follow the 11 sections given in each tutorial sequentially.",
      "Click 'Watch Tutorial' button for video demos or directly open the respective online tool to practice."
    ],
    realLifeUseCasesEn: [
      "Setting up DSC token drivers and Edge IE Mode for UBD portal after installing Windows 10/11 on a new computer.",
      "Resolving 'Error in Signing / Port 8080 blocked' issues during birth/death certificate digital signing within 5 minutes.",
      "Gaining clear understanding of GP record maintenance and online reporting procedures."
    ],
    limitationsEn: "These tutorials are independent guidelines for technical understanding and troubleshooting. Official circulars from the respective department should be treated as standard.",
    dataPrivacyEn: "This training module is a completely public educational resource. No personal data is collected.",
    officialReferenceEn: "ubd.telangana.gov.in, crsorgi.gov.in, epanchayat.telangana.gov.in, egramswaraj.gov.in",
    lastVerifiedEn: "November 2026"
  },
  pract: {
    title: "నాలెడ్జ్ హబ్ - తెలంగాణ పంచాయతీరాజ్ చట్టం 2018 & GP గైడ్ (Knowledge Hub)",
    description:
      "తెలంగాణ పంచాయతీ రాజ్ చట్టం 2018 (Telangana Panchayat Raj Act, 2018) లోని కీలక సెక్షన్లు, గ్రామ సభ నిబంధనలు, సర్పంచ్ మరియు పంచాయతీ కార్యదర్శి విధులు, భవన నిర్మాణ అనుమతులు, పన్నుల వసూళ్లు మరియు గ్రామ పంచాయతీ డిజిటల్ డాక్యుమెంటేషన్ వివరాలను సరళమైన తెలుగులో అందించే రిఫరెన్స్ హబ్.",
    purpose:
      "గ్రామ పంచాయతీ పరిపాలనలో చట్టబద్ధమైన విధానాలు, సెక్షన్లు మరియు బాధ్యతలపై కార్యదర్శులు, సర్పంచులు, ఆపరేటర్లు మరియు సామాన్య పౌరులకు తక్షణ అవగాహన కల్పించడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, సర్పంచులు, వార్డు సభ్యులు, ఈ-పంచాయతీ ఆపరేటర్లు, పోటీ పరీక్షల అభ్యర్థులు మరియు గ్రామ పౌరులు.",
    guideSteps: [
      "సెర్చ్ బాక్స్‌లో సెక్షన్ నంబర్ (ఉదా: Section 42, Section 114) లేదా తెలుగు/ఇంగ్లీష్ కీవర్డ్ (ఉదా: గ్రామ సభ, పంచాయతీ కార్యదర్శి, ఇంటి పన్ను, భవన అనుమతి) టైప్ చేయండి.",
      "లేదా కేటగిరీ బటన్ల (గ్రామ పంచాయతీ పాలన, విధులు & అధికారాలు, పన్నులు & ఆర్థికం, పౌర సేవలు & అనుమతులు, ఎన్నికలు & అనర్హతలు) పై క్లిక్ చేసి ఫిల్టర్ చేయండి.",
      "సెక్షన్ కార్డుపై క్లిక్ చేసి పూర్తి చట్టపరమైన వివరణ మరియు క్షేత్రస్థాయి ముఖ్యాంశాలను చదవండి."
    ],
    realLifeUseCases: [
      "గ్రామ సభ నిర్వహణ కోరమ్ (Quorum) మరియు వార్షిక సమావేశాల నిబంధనలను (Section 6) తనిఖీ చేయడం.",
      "గ్రామ పంచాయతీ కార్యదర్శి చట్టబద్ధమైన విధులు మరియు బాధ్యతలను (Section 42) తెలుసుకోవడం.",
      "అనుమతి లేని లేఅవుట్లు మరియు భవన నిర్మాణాలపై గ్రామ పంచాయతీకి ఉన్న అధికారాలను (Section 113 & 114) పరిశీలించడం."
    ],
    limitations:
      "ఇది సులభమైన అవగాహన కోసం రూపొందించబడిన విద్యాపరమైన సారాంశం (Educational Summary). కోర్టు కేసులు లేదా అధికారిక నోటీసుల కోసం తెలంగాణ ప్రభుత్వ గెజిట్‌లో ప్రచురించబడిన అసలు చట్టం (Act No. 5 of 2018) పాఠ్యాన్ని మాత్రమే ప్రామాణికంగా తీసుకోవాలి.",
    dataPrivacy:
      "ఈ నాలెడ్జ్ హబ్ పూర్తిగా ఉచిత పబ్లిక్ రిఫరెన్స్ విభాగం. ఇందులో యూజర్ డేటా ఏదీ సేకరించబడదు.",
    officialReference: "Telangana Panchayat Raj Act, 2018 (Act No. 5 of 2018) - Government of Telangana Gazette",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Knowledge Hub - Telangana Panchayat Raj Act 2018 & GP Guide",
    descriptionEn: "Reference hub providing key sections of Telangana Panchayat Raj Act 2018, Gram Sabha regulations, duties of Sarpanch and Panchayat Secretary, building permissions, tax collections, and Gram Panchayat digital documentation in clear language.",
    purposeEn: "Providing immediate awareness to secretaries, sarpanches, operators, and citizens on statutory procedures, sections, and responsibilities in Gram Panchayat administration.",
    targetAudienceEn: "Panchayat Secretaries, Sarpanches, Ward Members, e-Panchayat Operators, competitive exam aspirants, and citizens.",
    guideStepsEn: [
      "Type section number or keyword in search box.",
      "Or click category filter buttons to filter.",
      "Click on section card to read full legal explanation and field highlights."
    ],
    realLifeUseCasesEn: [
      "Checking Gram Sabha meeting quorum and annual meeting rules (Section 6).",
      "Understanding statutory duties and responsibilities of Panchayat Secretary (Section 42).",
      "Examining Gram Panchayat powers regarding unauthorized layouts and building constructions (Section 113 & 114)."
    ],
    limitationsEn: "This is an educational summary designed for easy understanding. For court cases or official notices, only the original Act (Act No. 5 of 2018) published in Telangana Government Gazette should be considered standard.",
    dataPrivacyEn: "This Knowledge Hub is a completely free public reference section. No user data is collected.",
    officialReferenceEn: "Telangana Panchayat Raj Act, 2018 (Act No. 5 of 2018) - Government of Telangana Gazette",
    lastVerifiedEn: "November 2026"
  },
  "monthly-activity": {
    title: "మాసాంతపు యాక్టివిటీ రిపోర్ట్ - MAS (E-Panchayat Monthly Activity Report)",
    description:
      "మండల మరియు జిల్లా స్థాయిలో గ్రామ పంచాయతీల వారీగా మాసాంతపు ఈ-పంచాయతీ కార్యకలాపాల (Monthly Activity Status - GP Matrix) నివేదికలను ఆటోమేటిక్‌గా ఫార్మాట్ చేసి, పెండింగ్ మరియు పూర్తయిన ఎంట్రీలను విశ్లేషించే సాధనం.",
    purpose:
      "ప్రతి నెలా గ్రామ పంచాయతీలలో నమోదయ్యే పన్ను వసూళ్లు, జనన మరణ నమోదు, పారిశుద్ధ్యం, వీధి దీపాలు మరియు ఆర్థిక లావాదేవీల మాసాంతపు పురోగతిని మండల/GP మ్యాట్రిక్స్ రూపంలో క్రమబద్ధీకరించడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు మరియు మండల పరిషత్ సిబ్బంది.",
    guideSteps: [
      "పోర్టల్ నుండి డౌన్‌లోడ్ చేసిన Monthly Activity Status (MAS) ఎక్సెల్ లేదా HTML ఫైల్‌ను ఎంచుకుని అప్‌లోడ్ చేయండి.",
      "మండల స్థాయి (Mandal Level) లేదా గ్రామ పంచాయతీ స్థాయి (GP Level) వ్యూ ఎంచుకుని ప్రతి విభాగంలో నమోదైన గణాంకాలను పరిశీలించండి.",
      "పెండింగ్ ఉన్న గ్రామ పంచాయతీలను హైలైట్ చేసి, పూర్తి నివేదికను ఫార్మాట్ చేసిన Excel లేదా A4 PDF లో డౌన్‌లోడ్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "నెలాఖరులో మండలంలోని అన్ని గ్రామ పంచాయతీల ఆన్‌లైన్ డేటా ఎంట్రీ ప్రోగ్రెస్‌ను ఒకే షీట్‌లో సమీక్షించడం.",
      "జీరో ఎంట్రీ (0 Entries) ఉన్న గ్రామ పంచాయతీలను తక్షణమే గుర్తించి ఆపరేటర్లకు సమాచారం అందించడం."
    ],
    limitations:
      "అధికారిక MAS రిపోర్ట్ కాలమ్ నిర్మాణం ఉన్న ఫైళ్లను మాత్రమే అప్‌లోడ్ చేయాలి.",
    dataPrivacy:
      "100% లోకల్ బ్రౌజర్ ప్రాసెసింగ్: అప్‌లోడ్ చేసిన ఫైల్ డేటా ఏ సర్వర్‌కూ పంపబడదు.",
    officialReference: "Telangana e-Panchayat Monthly Activity Monitoring Guidelines",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Monthly Activity Report - MAS (E-Panchayat Monthly Activity Report)",
    descriptionEn: "Tool to automatically format monthly e-Panchayat activity reports (Monthly Activity Status - GP Matrix) and analyze pending and completed entries across Mandals and Gram Panchayats.",
    purposeEn: "Streamlining monthly progress of tax collections, birth/death registration, sanitation, streetlights, and financial transactions in Gram Panchayats into Mandal/GP matrix format.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, and Mandal Parishad staff.",
    guideStepsEn: [
      "Select and upload Monthly Activity Status (MAS) Excel or HTML file downloaded from portal.",
      "Select Mandal level or GP level view and examine recorded statistics in each section.",
      "Highlight pending Gram Panchayats and download full report in formatted Excel or A4 PDF."
    ],
    realLifeUseCasesEn: [
      "Reviewing online data entry progress of all Gram Panchayats in Mandal on a single sheet at month-end.",
      "Promptly identifying Gram Panchayats with zero entries and notifying operators."
    ],
    limitationsEn: "Only files with official MAS report column structure should be uploaded.",
    dataPrivacyEn: "100% Local Browser Processing: Uploaded file data is never sent to any server.",
    officialReferenceEn: "Telangana e-Panchayat Monthly Activity Monitoring Guidelines",
    lastVerifiedEn: "November 2026"
  },
  MAS: {
    title: "మాసాంతపు యాక్టివిటీ రిపోర్ట్ - MAS (E-Panchayat Monthly Activity Report)",
    description:
      "మండల మరియు జిల్లా స్థాయిలో గ్రామ పంచాయతీల వారీగా మాసాంతపు ఈ-పంచాయతీ కార్యకలాపాల (Monthly Activity Status - GP Matrix) నివేదికలను ఆటోమేటిక్‌గా ఫార్మాట్ చేసి, పెండింగ్ మరియు పూర్తయిన ఎంట్రీలను విశ్లేషించే సాధనం.",
    purpose:
      "ప్రతి నెలా గ్రామ పంచాయతీలలో నమోదయ్యే ఆన్‌లైన్ మాడ్యూల్స్ పురోగతిని మండల/GP మ్యాట్రిక్స్ రూపంలో క్రమబద్ధీకరించడం మరియు పెండింగ్ జాబితాను రూపొందించడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు మరియు మండల పరిషత్ సిబ్బంది.",
    guideSteps: [
      "పోర్టల్ నుండి డౌన్‌లోడ్ చేసిన Monthly Activity Status (MAS) ఎక్సెల్ లేదా HTML ఫైల్‌ను ఎంచుకుని అప్‌లోడ్ చేయండి.",
      "మండల స్థాయి (Mandal Level) లేదా గ్రామ పంచాయతీ స్థాయి (GP Level) వ్యూ ఎంచుకుని ప్రతి విభాగంలో నమోదైన గణాంకాలను పరిశీలించండి.",
      "పెండింగ్ ఉన్న గ్రామ పంచాయతీలను హైలైట్ చేసి, పూర్తి నివేదికను ఫార్మాట్ చేసిన Excel లేదా A4 PDF లో డౌన్‌లోడ్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "నెలాఖరులో మండలంలోని అన్ని గ్రామ పంచాయతీల ఆన్‌లైన్ డేటా ఎంట్రీ ప్రోగ్రెస్‌ను ఒకే షీట్‌లో సమీక్షించడం.",
      "పెండింగ్ ఉన్న మాడ్యూల్స్‌ను గుర్తించి సమయానికి 100% ఎంట్రీ పూర్తి చేయడం."
    ],
    limitations:
      "అధికారిక MAS రిపోర్ట్ కాలమ్ నిర్మాణం ఉన్న ఫైళ్లను మాత్రమే అప్‌లోడ్ చేయాలి.",
    dataPrivacy:
      "100% లోకల్ బ్రౌజర్ ప్రాసెసింగ్: అప్‌లోడ్ చేసిన ఫైల్ డేటా ఏ సర్వర్‌కూ పంపబడదు.",
    officialReference: "Telangana e-Panchayat Monthly Activity Monitoring Guidelines",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Monthly Activity Report - MAS (E-Panchayat Monthly Activity Report)",
    descriptionEn: "Tool to automatically format monthly e-Panchayat activity reports (Monthly Activity Status - GP Matrix) and analyze pending and completed entries across Mandals and Gram Panchayats.",
    purposeEn: "Streamlining monthly progress of online modules in Gram Panchayats into Mandal/GP matrix format and generating pending lists.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, and Mandal Parishad staff.",
    guideStepsEn: [
      "Select and upload Monthly Activity Status (MAS) Excel or HTML file downloaded from portal.",
      "Select Mandal level or GP level view and examine recorded statistics in each section.",
      "Highlight pending Gram Panchayats and download full report in formatted Excel or A4 PDF."
    ],
    realLifeUseCasesEn: [
      "Reviewing online data entry progress of all Gram Panchayats in Mandal on a single sheet at month-end.",
      "Identifying pending modules and completing 100% entries on time."
    ],
    limitationsEn: "Only files with official MAS report column structure should be uploaded.",
    dataPrivacyEn: "100% Local Browser Processing: Uploaded file data is never sent to any server.",
    officialReferenceEn: "Telangana e-Panchayat Monthly Activity Monitoring Guidelines",
    lastVerifiedEn: "November 2026"
  },
  "excel-merge": {
    title: "ఎక్సెల్ ఫైల్ మెర్జర్ (Multi-File Excel Merger & Consolidator)",
    description:
      "వివిధ గ్రామ పంచాయతీలు లేదా మండలాల నుండి వచ్చిన పదుల సంఖ్యలోని ఎక్సెల్ ఫైళ్లను (.xlsx, .xls, .csv) కాపీ-పేస్ట్ శ్రమ లేకుండా ఒకే మాస్టర్ ఎక్సెల్ షీట్‌గా విలీనం (Merge) చేసే స్మార్ట్ ఆఫీస్ టూల్.",
    purpose:
      "మండల పరిషత్ కార్యాలయంలో 20 నుండి 40 గ్రామ పంచాయతీల నుండి విడివిడిగా వచ్చే ఒకే ఫార్మాట్ ఎక్సెల్ షీట్లను (ఉదా: పన్ను వసూళ్లు, జనాభా వివరాలు, సర్వే డేటా) ఒక్కొక్కటిగా ఓపెన్ చేసి కాపీ-పేస్ట్ చేసే సమయాన్ని ఆదా చేయడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు, టెక్నికల్ అసిస్టెంట్లు మరియు ఆఫీస్ డేటా ఎంట్రీ సిబ్బంది.",
    guideSteps: [
      "ఒకే రకమైన కాలమ్ హెడర్లు (Column Headers) కలిగిన అన్ని ఎక్సెల్ ఫైళ్లను ఒక ఫోల్డర్‌లో ఉంచుకోండి.",
      "'Select Excel Files to Merge' బటన్‌పై క్లిక్ చేసి అన్ని ఫైళ్లను ఒకేసారి ఎంచుకోండి.",
      "మొదటి ఫైల్ హెడర్‌ను మాత్రమే ఉంచి, మిగిలిన ఫైళ్లలోని డేటా వరుసలను (Rows) వరుసగా జత చేయడానికి 'Merge Files' ఆప్షన్ ఎంచుకోండి.",
      "కన్సాలిడేట్ అయిన మొత్తం వరుసల సంఖ్యను ప్రివ్యూలో చూసి, 'Download Merged Excel' బటన్‌తో ఒకే మాస్టర్ ఫైల్‌గా డౌన్‌లోడ్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "మండలంలోని అన్ని గ్రామ పంచాయతీల హౌస్ ట్యాక్స్ (House Tax) లేదా కుళాయి పన్ను వసూళ్ల షీట్లను ఒకే మాస్టర్ మండల ఫైల్‌గా కలపడం.",
      "వివిధ వార్డుల ఓటర్ల జాబితా లేదా బెనిఫిషియరీ ఎక్సెల్ షీట్లను ఒకే గ్రామ పంచాయతీ మాస్టర్ షీట్‌గా విలీనం చేయడం."
    ],
    limitations:
      "అన్ని ఎక్సెల్ ఫైళ్లలో కాలమ్‌ల వరుస క్రమం (Column Order) ఒకేలా ఉండాలి. పాస్‌వర్డ్ ప్రొటెక్ట్ చేయబడిన (Encrypted) ఎక్సెల్ ఫైళ్లను అన్‌లాక్ చేసిన తర్వాతే అప్‌లోడ్ చేయాలి.",
    dataPrivacy:
      "100% బ్రౌజర్-ఆధారిత విలీనం: మీ ఎక్సెల్ ఫైళ్లలోని డేటా మీ కంప్యూటర్ బ్రౌజర్ దాటి బయటకు వెళ్లదు.",
    officialReference: "Standard Office Spreadsheet Consolidation Utility",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Multi-File Excel Merger & Consolidator",
    descriptionEn: "Smart office tool to merge dozens of Excel files (.xlsx, .xls, .csv) from different Gram Panchayats or Mandals into a single master Excel sheet without copy-paste effort.",
    purposeEn: "Saving time of opening and copy-pasting individual Excel sheets received separately from 20 to 40 Gram Panchayats in Mandal office.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, Technical Assistants, and office data entry staff.",
    guideStepsEn: [
      "Keep all Excel files with identical column headers in one folder.",
      "Click 'Select Excel Files to Merge' button and choose all files at once.",
      "Select 'Merge Files' option to keep first file header and append data rows from other files.",
      "Check total consolidated row count in preview and download as single master file using 'Download Merged Excel' button."
    ],
    realLifeUseCasesEn: [
      "Combining House Tax or tap tax collection sheets of all Gram Panchayats in Mandal into one master Mandal file.",
      "Merging ward voter lists or beneficiary Excel sheets into a single Gram Panchayat master sheet."
    ],
    limitationsEn: "Column order must be identical across all Excel files. Encrypted Excel files must be unlocked before uploading.",
    dataPrivacyEn: "100% Browser-based merging: Data in your Excel files never leaves your computer browser.",
    officialReferenceEn: "Standard Office Spreadsheet Consolidation Utility",
    lastVerifiedEn: "November 2026"
  },
  "gpdp-planning": {
    title: "GPDP బడ్జెట్ & అభివృద్ధి ప్రణాళిక (GPDP Planning & Budget Allocation Tool)",
    description:
      "గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (Gram Panchayat Development Plan - GPDP) మరియు వార్షిక బడ్జెట్ కేటాయింపులను ప్రభుత్వ 9 LSDG థీమ్‌లు (Themes) మరియు నిధుల వనరుల (15th Finance Commission Tied/Untied, SFC, General Funds) ప్రకారం ఖచ్చితమైన శాతాలతో రూపొందించే సాధనం.",
    purpose:
      "eGramSwaraj పోర్టల్‌లో GPDP యాక్షన్ ప్లాన్ నమోదు చేయడానికి ముందు, గ్రామ పంచాయతీ జనాభా మరియు లభ్యమయ్యే నిధుల ఆధారంగా పారిశుద్ధ్యం, తాగునీరు, వీధి దీపాలు, మౌలిక వసతుల పనులకు నిబంధనల ప్రకారం బడ్జెట్ విభజన (Tied 60% vs Untied 40%) గణించడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, సర్పంచులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు GPDP ప్లానింగ్ కమిటీ సభ్యులు.",
    guideSteps: [
      "మీ గ్రామ పంచాయతీ పేరు, మండలం, జనాభా మరియు వార్షిక అంచనా నిధుల (15వ ఆర్థిక సంఘం, రాష్ట్ర ఆర్థిక సంఘం, సాధారణ నిధి) వివరాలను నమోదు చేయండి.",
      "ప్రభుత్వ మార్గదర్శకాల ప్రకారం Tied Grants (పారిశుద్ధ్యం & ODF రక్షణకు 30%, తాగునీరు & రెయిన్ వాటర్ హార్వెస్టింగ్‌కు 30%) మరియు Untied Grants (40%) ఆటోమేటిక్ విభజనను తనిఖీ చేయండి.",
      "గ్రామ సభలో గుర్తించిన పనులను (Works) ఎంచుకుని, ప్రతి పనికి అంచనా వ్యయాన్ని కేటాయించండి.",
      "పూర్తయిన GPDP బడ్జెట్ వర్క్‌షీట్‌ను ప్రింట్ తీసుకుని గ్రామ సభ ఆమోదం మరియు eGramSwaraj ఆన్‌లైన్ ఎంట్రీకి ఉపయోగించుకోండి."
    ],
    realLifeUseCases: [
      "15వ ఆర్థిక సంఘం నిధులలో Tied మరియు Untied కేటాయింపుల లెక్కల్లో తప్పులు రాకుండా ముందస్తు డ్రాఫ్ట్ యాక్షన్ ప్లాన్ తయారు చేయడం.",
      "గ్రామ సభలో సర్పంచ్ మరియు వార్డు సభ్యులకు నిధుల కేటాయింపు వివరాలను స్పష్టమైన టేబుల్ రూపంలో వివరించడం."
    ],
    limitations:
      "ఈ టూల్ GPDP ముందస్తు ప్రణాళిక మరియు బడ్జెట్ గణన కోసం మాత్రమే. తుది అధికారిక ప్రణాళికను తప్పనిసరిగా కేంద్ర ప్రభుత్వ 'eGramSwaraj' (egramswaraj.gov.in) పోర్టల్‌లోనే నమోదు చేయాలి.",
    dataPrivacy:
      "మీరు నమోదు చేసే గ్రామ పంచాయతీ బడ్జెట్ గణాంకాలు మీ బ్రౌజర్‌లోనే లెక్కించబడతాయి.",
    officialReference: "Ministry of Panchayati Raj (MoPR) GPDP & 15th Finance Commission Guidelines (egramswaraj.gov.in)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "GPDP Planning & Budget Allocation Tool",
    descriptionEn: "Tool to generate Gram Panchayat Development Plan (GPDP) and annual budget allocations according to government 9 LSDG themes and fund sources with precise percentages.",
    purposeEn: "Calculating budget distribution for sanitation, drinking water, streetlights, and infrastructure works according to rules based on GP population and available funds before entering action plan in eGramSwaraj portal.",
    targetAudienceEn: "Panchayat Secretaries, Sarpanches, e-Panchayat Computer Operators, and GPDP Planning Committee members.",
    guideStepsEn: [
      "Enter Gram Panchayat name, Mandal, population, and estimated annual funds.",
      "Check automatic distribution of Tied Grants and Untied Grants according to government guidelines.",
      "Select identified works in Gram Sabha and allocate estimated cost to each work.",
      "Print completed GPDP budget worksheet for Gram Sabha approval and eGramSwaraj online entry."
    ],
    realLifeUseCasesEn: [
      "Preparing advance draft action plan without calculation errors in 15th Finance Commission Tied and Untied allocations.",
      "Explaining fund allocation details in clear table format to Sarpanch and ward members in Gram Sabha."
    ],
    limitationsEn: "This tool is for GPDP advance planning and budget calculation only. Final official plan must be entered in central government 'eGramSwaraj' portal.",
    dataPrivacyEn: "Gram Panchayat budget statistics you enter are calculated within your browser.",
    officialReferenceEn: "Ministry of Panchayati Raj (MoPR) GPDP & 15th Finance Commission Guidelines",
    lastVerifiedEn: "November 2026"
  },
  gpdp_setup: {
    title: "GPDP ప్రణాళిక & మార్గదర్శకాలు (GPDP Setup & Digital Planning Guide)",
    description:
      "గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP) తయారీ విధానం, గ్రామ సభ తీర్మానాలు, Panchayat Nirnay యాప్ వినియోగం, 9 స్థానిక సుస్థిర అభివృద్ధి లక్ష్యాలు (LSDG Themes) మరియు eGramSwaraj ఎంట్రీ ప్రక్రియపై సమగ్ర మార్గదర్శిని.",
    purpose:
      "గ్రామ పంచాయతీ వార్షిక ప్రణాళిక తయారీలో ఫెసిలిటేటర్లు, కార్యదర్శులు మరియు ఆపరేటర్లు పాటించాల్సిన దశలవారీ నిబంధనలను ఒకే చోట అందించడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, సర్పంచులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు GPDP ఫెసిలిటేటర్లు.",
    guideSteps: [
      "GPDP 9 థీమ్‌లలో మీ గ్రామ పంచాయతీ ఎంచుకున్న ప్రాధాన్యత థీమ్‌ను గుర్తించండి.",
      "గ్రామ సభ షెడ్యూల్ మరియు తీర్మానాల నమోదు విధానాన్ని పరిశీలించండి.",
      "బడ్జెట్ అలోకేషన్ టూల్ సహాయంతో పనుల వారీగా నిధుల కేటాయింపు పూర్తి చేసి eGramSwaraj పోర్టల్‌లో అప్‌లోడ్ చేయండి."
    ],
    realLifeUseCases: [
      "వార్షిక గ్రామ సభకు ముందు GPDP డాక్యుమెంటేషన్ చెక్‌లిస్ట్ సిద్ధం చేసుకోవడం.",
      "eGramSwaraj మరియు AuditOnline పోర్టల్స్ కోసం అవసరమైన రికార్డులను క్రమబద్ధీకరించడం."
    ],
    limitations:
      "అధికారిక GPDP ఆమోదం మరియు నిధుల విడుదల eGramSwaraj-PFMS పోర్టల్ నిబంధనలకు లోబడి ఉంటుంది.",
    dataPrivacy:
      "100% సురక్షితమైన బ్రౌజర్ ప్రాసెసింగ్.",
    officialReference: "eGramSwaraj (egramswaraj.gov.in) & Panchayat Nirnay (meetingonline.gov.in)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "GPDP Setup & Digital Planning Guide",
    descriptionEn: "Comprehensive guide on Gram Panchayat Development Plan (GPDP) preparation process, Gram Sabha resolutions, Panchayat Nirnay app usage, 9 local sustainable development goals (LSDG Themes), and eGramSwaraj entry process.",
    purposeEn: "Providing step-by-step rules to be followed by facilitators, secretaries, and operators in Gram Panchayat annual plan preparation in one place.",
    targetAudienceEn: "Panchayat Secretaries, Sarpanches, e-Panchayat Computer Operators, and GPDP facilitators.",
    guideStepsEn: [
      "Identify your Gram Panchayat's selected priority theme among GPDP 9 themes.",
      "Review Gram Sabha schedule and resolution recording procedure.",
      "Complete fund allocation task-wise using budget allocation tool and upload in eGramSwaraj portal."
    ],
    realLifeUseCasesEn: [
      "Preparing GPDP documentation checklist before annual Gram Sabha.",
      "Streamlining records required for eGramSwaraj and AuditOnline portals."
    ],
    limitationsEn: "Official GPDP approval and fund release are subject to eGramSwaraj-PFMS portal rules.",
    dataPrivacyEn: "100% secure browser processing.",
    officialReferenceEn: "eGramSwaraj & Panchayat Nirnay",
    lastVerifiedEn: "November 2026"
  },
  gos_formats: {
    title: "ప్రభుత్వ జీవోలు & ఆఫీస్ ఫార్మాట్లు (GOs & Official Office Formats Hub)",
    description:
      "తెలంగాణ మరియు ఆంధ్రప్రదేశ్ పంచాయతీరాజ్ & గ్రామీణాభివృద్ధి శాఖలకు సంబంధించిన ప్రభుత్వ ఉత్తర్వులు (GOs), మెమోలు, సర్క్యులర్లు మరియు గ్రామ పంచాయతీ కార్యాలయాల్లో రోజువారీ ఉపయోగించే ఖాళీ దరఖాస్తు ఫార్మాట్లు (PDF/Word/Excel) డౌన్‌లోడ్ చేసుకునే రిఫరెన్స్ లైబ్రరీ.",
    purpose:
      "గ్రామ పంచాయతీ కార్యదర్శులు మరియు ఆపరేటర్లకు అవసరమైన అధికారిక ఫార్మాట్లు (జనన/మరణ ఆలస్య నమోదు అఫిడవిట్లు, ఇంటి పన్ను అసెస్‌మెంట్, భవన నిర్మాణ దరఖాస్తులు, లీవ్ లెటర్లు, గ్రామ సభ తీర్మాన నమూనాలు) మరియు జీవోలను తక్షణమే అందుబాటులో ఉంచడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, సర్పంచులు మరియు సామాన్య పౌరులు.",
    guideSteps: [
      "'ప్రభుత్వ జీవోలు (GOs)' లేదా 'ఆఫీస్ ఫార్మాట్లు (Formats)' సబ్-ట్యాబ్‌ను ఎంచుకోండి.",
      "సెర్చ్ బాక్స్‌లో జీవో నంబర్, తేదీ లేదా ఫార్మాట్ పేరు (ఉదా: Birth Certificate Form, House Tax, Leave Format) టైప్ చేసి వెతకండి.",
      "'Download / View PDF' బటన్‌పై క్లిక్ చేసి ఫైల్‌ను నేరుగా డౌన్‌లోడ్ చేసుకోండి లేదా ప్రింట్ తీసుకోండి."
    ],
    realLifeUseCases: [
      "పౌరులు గ్రామ పంచాయతీ కార్యాలయానికి వచ్చినప్పుడు వారికి అవసరమైన దరఖాస్తు ఫారమ్‌ను తక్షణమే ప్రింట్ తీసి ఇవ్వడం.",
      "పంచాయతీరాజ్ శాఖ జారీ చేసిన గత మరియు తాజా ప్రభుత్వ ఉత్తర్వులను (GOs) రిఫరెన్స్ కోసం పరిశీలించడం."
    ],
    limitations:
      "ఇక్కడ అందుబాటులో ఉన్న జీవోలు సమాచార మరియు రిఫరెన్స్ ప్రయోజనాల కోసం మాత్రమే. ఏదైనా అధికారిక చర్య తీసుకునే ముందు తెలంగాణ ప్రభుత్వ GOIR పోర్టల్ (goir.telangana.gov.in) లోని అసలు ఉత్తర్వుతో సరిచూసుకోవాలి.",
    dataPrivacy:
      "పబ్లిక్ డాక్యుమెంట్ డౌన్‌లోడ్లకు ఎలాంటి వ్యక్తిగత డేటా అవసరం లేదు.",
    officialReference: "Telangana Government Orders Issue Register (goir.telangana.gov.in)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "GOs & Official Office Formats Hub",
    descriptionEn: "Reference library to download government orders (GOs), memos, circulars, and blank application formats (PDF/Word/Excel) used daily in Gram Panchayat offices related to Telangana and AP Panchayat Raj & Rural Development departments.",
    purposeEn: "Making official formats required by secretaries and operators and GOs instantly accessible.",
    targetAudienceEn: "Panchayat Secretaries, e-Panchayat Computer Operators, Sarpanches, and citizens.",
    guideStepsEn: [
      "Select 'Government Orders (GOs)' or 'Office Formats (Formats)' sub-tab.",
      "Type GO number, date, or format name in search box to find.",
      "Click 'Download / View PDF' button to directly download or print file."
    ],
    realLifeUseCasesEn: [
      "Instantly printing and providing required application form to citizens visiting Gram Panchayat office.",
      "Reviewing past and recent government orders (GOs) issued by Panchayat Raj department for reference."
    ],
    limitationsEn: "GOs available here are for informational and reference purposes only. Before taking official action, verify with original order on Telangana government GOIR portal.",
    dataPrivacyEn: "No personal data is required for public document downloads.",
    officialReferenceEn: "Telangana Government Orders Issue Register",
    lastVerifiedEn: "November 2026"
  },
  ubd_tracker: {
    title: "UBD లైవ్ ట్రాకర్ & ఆఫీస్ కోడ్ డైరెక్టరీ (UBD Birth/Death Tracker & GP Directory)",
    description:
      "యూనిఫైడ్ బర్త్ & డెత్ (UBD) పోర్టల్‌లో గ్రామ పంచాయతీల వారీగా జనన, మరణ మరియు స్టిల్ బర్త్ నమోదు పురోగతిని ట్రాక్ చేయడానికి, అలాగే ఆఫ్‌లైన్ రిజిస్టర్లను ఆన్‌లైన్ ఎంట్రీలతో సరిపోల్చుకోవడానికి రూపొందించిన మానిటరింగ్ సాధనం.",
    purpose:
      "గ్రామ పంచాయతీలలో జరిగిన జనన మరణ సంఘటనలు 100% ఆన్‌లైన్ UBD పోర్టల్‌లో నమోదయ్యాయా లేదా, ఏవైనా దరఖాస్తులు డిజిటల్ సంతకం (DSC Signing) కోసం పెండింగ్‌లో ఉన్నాయా అని సులభంగా ట్రాక్ చేయడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు (Birth & Death Registrars), ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు మండల స్థాయి సిబ్బంది.",
    guideSteps: [
      "జిల్లా, మండలం మరియు గ్రామ పంచాయతీని ఎంచుకుని లేదా ఆఫీస్ కోడ్ (Office Code) ద్వారా సెర్చ్ చేయండి.",
      "UBD MIS నివేదిక లేదా ఎక్సెల్ డేటా ఆధారంగా ఆయా గ్రామ పంచాయతీల జనన మరణ నమోదు స్థితిని పరిశీలించండి.",
      "పెండింగ్ ఉన్న గ్రామ పంచాయతీల జాబితాను ఎక్సెల్ లేదా PDF రూపంలో ఎక్స్‌పోర్ట్ చేసుకోండి."
    ],
    realLifeUseCases: [
      "గ్రామ పంచాయతీ ఆఫ్‌లైన్ జనన మరణ రిజిస్టర్‌లోని ఎంట్రీల సంఖ్యను ఆన్‌లైన్ UBD MIS సంఖ్యతో సరిపోల్చడం (Reconciliation).",
      "UBD పోర్టల్‌లో గ్రామ పంచాయతీ యొక్క ఖచ్చితమైన RLB / Office Code ను తక్షణమే కనుగొనడం."
    ],
    limitations:
      "అధికారిక జనన/మరణ సర్టిఫికెట్ల జారీ మరియు దరఖాస్తు ఆమోదం ప్రభుత్వ UBD పోర్టల్ (ubd.telangana.gov.in / crsorgi.gov.in) లో మాత్రమే జరుగుతుంది.",
    dataPrivacy:
      "ఈ ట్రాకర్‌లో పౌరుల వ్యక్తిగత ఆధార్ లేదా సున్నితమైన సమాచారం నిల్వ చేయబడదు.",
    officialReference: "Telangana UBD Portal (ubd.telangana.gov.in) & UBD MIS (ubdmis.telangana.gov.in)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "UBD Birth/Death Tracker & GP Directory",
    descriptionEn: "Monitoring tool designed to track birth, death, and stillbirth registration progress across Gram Panchayats in Unified Birth & Death (UBD) portal and reconcile offline registers with online entries.",
    purposeEn: "Easily tracking whether birth and death events in Gram Panchayats are 100% registered in online UBD portal and whether any applications are pending digital signature.",
    targetAudienceEn: "Panchayat Secretaries, e-Panchayat Computer Operators, and Mandal staff.",
    guideStepsEn: [
      "Select District, Mandal, and Gram Panchayat or search by Office Code.",
      "Examine birth/death registration status of respective Gram Panchayats based on UBD MIS report or Excel data.",
      "Export list of pending Gram Panchayats in Excel or PDF format."
    ],
    realLifeUseCasesEn: [
      "Reconciling number of entries in GP offline birth/death register with online UBD MIS number.",
      "Instantly finding exact RLB / Office Code of Gram Panchayat in UBD portal."
    ],
    limitationsEn: "Issuance of official birth/death certificates and application approval happens exclusively in government UBD portal.",
    dataPrivacyEn: "No citizen personal Aadhaar or sensitive information is stored in this tracker.",
    officialReferenceEn: "Telangana UBD Portal & UBD MIS",
    lastVerifiedEn: "November 2026"
  },
  software_hub: {
    title: "సాఫ్ట్‌వేర్ హబ్ - DSK, DSC & ఆఫీస్ డ్రైవర్లు (Software & Drivers Hub)",
    description:
      "గ్రామ పంచాయతీ మరియు మండల కంప్యూటర్లలో UBD, eGramSwaraj మరియు ఆన్‌లైన్ పోర్టల్స్ పనిచేయడానికి అత్యవసరమైన అధికారిక DSC టోకెన్ డ్రైవర్లు (WatchData ProxKey, ePass2003/HYP2003), Java JRE 8, Digital Signer సర్వీసులు మరియు ఆఫీస్ యూటిలిటీల డౌన్‌లోడ్ కేంద్రం.",
    purpose:
      "ఆపరేటర్లు ఇంటర్నెట్‌లో నకిలీ లేదా వైరస్ ఉన్న డ్రైవర్ సైట్లలో వెతకకుండా, Windows 7 / 10 / 11 (32-bit & 64-bit) సిస్టమ్‌లలో పరీక్షించబడిన సురక్షితమైన DSC & Java ఇన్‌స్టాలర్లను ఒకే చోట అందించడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు మరియు టెక్నికల్ అసిస్టెంట్లు.",
    guideSteps: [
      "మీ కంప్యూటర్ ఆపరేటింగ్ సిస్టమ్ (Windows 7 / 10 / 11) మరియు మీ దగ్గర ఉన్న DSC USB టోకెన్ మోడల్ (ProxKey లేదా ePass2003) ను గుర్తించండి.",
      "సాఫ్ట్‌వేర్ హబ్‌లోని సంబంధిత డ్రైవర్ కార్డుపై ఉన్న 'Download' బటన్ క్లిక్ చేసి ఇన్‌స్టాలర్ ఫైల్‌ను డౌన్‌లోడ్ చేసుకోండి.",
      "ఇన్‌స్టాల్ చేసే ముందు పాత వెర్షన్ డ్రైవర్లను Uninstall చేసి, కొత్త ఫైల్‌పై Right-click ఇచ్చి 'Run as Administrator' ద్వారా ఇన్‌స్టాల్ చేయండి."
    ],
    realLifeUseCases: [
      "UBD పోర్టల్‌లో డిజిటల్ సంతకం కోసం Java 8 (32-bit) మరియు Digital Signer సర్వీస్‌ను ఇన్‌స్టాల్ చేయడం.",
      "కొత్తగా జారీ చేయబడిన DSC USB టోకెన్ PCలో కనిపించకపోతే సరైన Middleware డ్రైవర్‌ను ఇన్‌స్టాల్ చేయడం."
    ],
    limitations:
      "సాఫ్ట్‌వేర్ ఇన్‌స్టాలేషన్‌కు మీ Windows కంప్యూటర్‌లో Administrator అనుమతులు ఉండాలి. ప్రభుత్వ పోర్టల్స్ అప్‌డేట్ అయినప్పుడు సంబంధిత కొత్త వెర్షన్ డ్రైవర్లను ఉపయోగించాలి.",
    dataPrivacy:
      "ఇక్కడ ఉన్న అన్ని ఇన్‌స్టాలర్లు SHA-256 చెక్‌సమ్ మరియు మాల్వేర్ స్కానింగ్ ద్వారా ధృవీకరించబడినవి.",
    officialReference: "Official Token Vendor Middleware & NIC/State Portal System Requirements",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Software & Drivers Hub - DSK, DSC & Office Drivers",
    descriptionEn: "Download center for official DSC token drivers (WatchData ProxKey, ePass2003/HYP2003), Java JRE 8, Digital Signer services, and office utilities essential for UBD, eGramSwaraj, and online portals to work in Gram Panchayat and Mandal computers.",
    purposeEn: "Providing secure DSC & Java installers tested on Windows 7 / 10 / 11 systems in one place, preventing operators from searching unverified driver sites.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, and Technical Assistants.",
    guideStepsEn: [
      "Identify your computer operating system and DSC USB token model.",
      "Click 'Download' button on respective driver card in Software Hub to download installer file.",
      "Uninstall older version drivers before installing, right-click new file and install via 'Run as Administrator'."
    ],
    realLifeUseCasesEn: [
      "Installing Java 8 (32-bit) and Digital Signer service for digital signature in UBD portal.",
      "Installing correct middleware driver if newly issued DSC USB token is not recognized by PC."
    ],
    limitationsEn: "Administrator privileges are required on your Windows computer for software installation.",
    dataPrivacyEn: "All installers here are verified via SHA-256 checksum and malware scanning.",
    officialReferenceEn: "Official Token Vendor Middleware & NIC/State Portal System Requirements",
    lastVerifiedEn: "November 2026"
  },
  farmer_registry: {
    title: "రైతు రిజిస్ట్రీ వెరిఫికేషన్ టూల్ (Farmer Registry Land Matching & Verification)",
    description:
      "రైతు రిజిస్ట్రీ (Farmer Registry / AgriStack) సర్వే మరియు ఎన్‌రోల్‌మెంట్ ప్రక్రియలో FILE 1 (Bucket ID / Land Data) మరియు FILE 2 (PPB NO / పట్టాదార్ పాస్‌బుక్ డేటా) ఎక్సెల్ షీట్లను ఆటోమేటిక్‌గా సరిపోల్చి (Match), పెండింగ్ మరియు పూర్తయిన రైతుల జాబితాను సిద్ధం చేసే సాధనం.",
    purpose:
      "గ్రామ పంచాయతీలలో వేలాది మంది రైతుల సర్వే నంబర్లు, Bucket IDలు మరియు పట్టాదార్ పాస్‌బుక్ నంబర్లను రెండు వేర్వేరు ఎక్సెల్ షీట్ల నుండి మాన్యువల్‌గా సరిపోల్చడం వల్ల కలిగే జాప్యాన్ని నివారించి, సెకన్లలో ఖచ్చితమైన వెరిఫికేషన్ రిపోర్ట్ అందించడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, వ్యవసాయ విస్తరణాధికారులు (AEOs) మరియు క్షేత్రస్థాయి సర్వే సిబ్బంది.",
    guideSteps: [
      "గ్రామ పంచాయతీ వారీగా FILE 1 (BucketID కలిగిన మెయిన్ ల్యాండ్ ఫైల్) మరియు FILE 2 (PPB NO / పట్టాదార్ పాస్‌బుక్ ఫైల్) ఎక్సెల్ షీట్లను ఎంచుకోండి.",
      "సిస్టమ్ ఆటోమేటిక్‌గా రైతు పేరు, పట్టాదార్ పాస్‌బుక్ సంఖ్య మరియు Bucket ID ఆధారంగా రెండు ఫైళ్లను విలీనం చేసి సరిపోల్చుతుంది.",
      "సెక్యూరిటీ నిబంధనల ప్రకారం ఆధార్ నంబర్లు ఆటోమేటిక్‌గా మాస్క్ (****-****-1234) చేయబడతాయి.",
      "పూర్తయిన వెరిఫైడ్ ఎక్సెల్ షీట్‌ను డౌన్‌లోడ్ చేసుకుని క్షేత్రస్థాయి రైతు రిజిస్ట్రీ ఎన్‌రోల్‌మెంట్‌కు ఉపయోగించుకోండి."
    ],
    realLifeUseCases: [
      "ఒకే రైతుకు బహుళ సర్వే నంబర్లు ఉన్నప్పుడు Bucket ID ఆధారంగా ఒకే రైతు ఖాతా కింద భూమి వివరాలను కన్సాలిడేట్ చేయడం.",
      "గ్రామంలో ఇంకా రైతు రిజిస్ట్రీ పూర్తి కాని (Pending Enrollment) పట్టాదారుల జాబితాను వార్డుల వారీగా సిద్ధం చేయడం."
    ],
    limitations:
      "ఈ టూల్ ఎక్సెల్ డేటా సరిపోలిక (Reconciliation) కోసం మాత్రమే. రైతు రిజిస్ట్రీ తుది e-KYC మరియు అధికారిక నమోదు ప్రభుత్వ AgriStack పోర్టల్‌లోనే చేయాలి.",
    dataPrivacy:
      "ఆధార్ గోప్యతా నిబంధనల ప్రకారం మొదటి 8 అంకెలు ఆటోమేటిక్‌గా మాస్క్ చేయబడతాయి మరియు ఫైల్ ప్రాసెసింగ్ సురక్షితంగా జరుగుతుంది.",
    officialReference: "AgriStack / State Farmer Registry Field Verification Standards",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Farmer Registry Land Matching & Verification Tool",
    descriptionEn: "Tool that automatically matches and verifies FILE 1 (Bucket ID / Land Data) and FILE 2 (PPB NO / Pattadar Passbook Data) Excel sheets in Farmer Registry (AgriStack) survey and enrollment process, preparing lists of pending and completed farmers.",
    purposeEn: "Eliminating delays caused by manual cross-verification of survey numbers, Bucket IDs, and pattadar passbook numbers of thousands of farmers in Gram Panchayats from two separate Excel sheets.",
    targetAudienceEn: "Panchayat Secretaries, e-Panchayat Computer Operators, Agricultural Extension Officers (AEOs), and field survey staff.",
    guideStepsEn: [
      "Select FILE 1 and FILE 2 Excel sheets per Gram Panchayat.",
      "System automatically merges and matches both files based on farmer name, pattadar passbook number, and Bucket ID.",
      "Aadhaar numbers are automatically masked according to security regulations.",
      "Download completed verified Excel sheet and use for field farmer registry enrollment."
    ],
    realLifeUseCasesEn: [
      "Consolidating land details under a single farmer account based on Bucket ID when a farmer has multiple survey numbers.",
      "Preparing ward-wise list of pattadars whose Farmer Registry enrollment is still pending in the village."
    ],
    limitationsEn: "This tool is for Excel data reconciliation only. Final farmer registry e-KYC and official enrollment must be done on government AgriStack portal.",
    dataPrivacyEn: "According to Aadhaar privacy regulations, first 8 digits are automatically masked and file processing is secure.",
    officialReferenceEn: "AgriStack / State Farmer Registry Field Verification Standards",
    lastVerifiedEn: "November 2026"
  },
  excel_print: {
    title: "ఎక్సెల్ A4 ప్రింట్ ఫార్మాటర్ (Smart Excel to A4 Print & PDF Formatter)",
    description:
      "పెద్ద ఎక్సెల్ షీట్లలోని కాలమ్‌లు ప్రింట్ తీసేటప్పుడు సగం కట్ అవ్వకుండా, అన్ని కాలమ్‌లను ఒకే A4 పేజీకి (Portrait లేదా Landscape) ఆటో-ఫిట్ చేసి, ప్రతి పేజీపై ఆఫీస్ టైటిల్ హెడర్, పేజీ నంబర్లు మరియు సంతకం స్థలంతో ప్రొఫెషనల్ PDF/Print అవుట్‌పుట్ ఇచ్చే సాధనం.",
    purpose:
      "గ్రామ పంచాయతీ మరియు మండల కార్యాలయాల్లో ఎక్సెల్ రిపోర్టులు ప్రింట్ తీసేటప్పుడు చివరి 2-3 కాలమ్‌లు రెండో పేజీలోకి వెళ్లిపోయే సమస్యను పూర్తిగా పరిష్కరించి, నీట్‌గా బోర్డర్లు మరియు తెలుగు/ఇంగ్లీష్ హెడర్లతో A4 ప్రింట్ సిద్ధం చేయడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు, టెక్నికల్ అసిస్టెంట్లు మరియు ఆఫీస్ సిబ్బంది.",
    guideSteps: [
      "మీరు ప్రింట్ తీయాలనుకుంటున్న ఎక్సెల్ (.xlsx / .xls / .csv) ఫైల్‌ను అప్‌లోడ్ చేయండి.",
      "ప్రింట్‌లో మీకు అవసరం లేని అదనపు కాలమ్‌లను (Columns) అన్‌-టిక్ (Uncheck) చేసి, కావలసిన కాలమ్‌లను మాత్రమే ఎంచుకోండి.",
      "పేజీ ఓరియంటేషన్ (Portrait / Landscape), ఫాంట్ సైజు మరియు రిపోర్ట్ పైన కనిపించాల్సిన గ్రామ పంచాయతీ/మండల కార్యాలయ టైటిల్‌ను టైప్ చేయండి.",
      "'Print A4' లేదా 'Download PDF' బటన్‌పై క్లిక్ చేసి అన్ని కాలమ్‌లు ఒకే పేజీ వెడల్పులో వచ్చేలా ప్రింట్ తీసుకోండి."
    ],
    realLifeUseCases: [
      "20 కాలమ్‌లు ఉండే DSR లేదా హౌస్ ట్యాక్స్ DCB నివేదికను A4 Landscape పేజీలో ఒక్క కాలమ్ కూడా కట్ అవ్వకుండా ప్రింట్ తీయడం.",
      "గ్రామ సభ నోటీసు బోర్డులో అంటించడానికి బెనిఫిషియరీ జాబితాను స్పష్టమైన టేబుల్ బోర్డర్లు మరియు కార్యదర్శి సంతకం బాక్స్‌తో ప్రింట్ చేయడం."
    ],
    limitations:
      "ఒకే వరుసలో 25 కంటే ఎక్కువ కాలమ్‌లు ఉంటే Landscape మోడ్ మరియు Compact ఫాంట్ సైజు ఎంచుకోవడం ఉత్తమం.",
    dataPrivacy:
      "100% క్లయింట్-సైడ్ ప్రింట్ ఇంజిన్: మీ ఎక్సెల్ ఫైల్ మీ బ్రౌజర్‌లోనే రెండర్ అవుతుంది, ఏ సర్వర్‌కూ పంపబడదు.",
    officialReference: "Standard A4 Official Report Formatting Specification (ISO 216 A4)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Smart Excel to A4 Print & PDF Formatter",
    descriptionEn: "Tool that auto-fits all columns of wide Excel sheets onto a single A4 page without cutting off during printing, providing professional PDF/Print output with office title header, page numbers, and signature space on every page.",
    purposeEn: "Completely solving the issue where last 2-3 columns spill onto a second page when printing Excel reports in Gram Panchayat and Mandal offices.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, Technical Assistants, and office staff.",
    guideStepsEn: [
      "Upload Excel file you want to print.",
      "Uncheck extra columns not needed in print and select only desired columns.",
      "Select page orientation, font size, and type Gram Panchayat/Mandal office title.",
      "Click 'Print A4' or 'Download PDF' button to print with all columns fitting page width."
    ],
    realLifeUseCasesEn: [
      "Printing 20-column DSR or House Tax DCB report on A4 Landscape page without cutting off any column.",
      "Printing beneficiary list for Gram Sabha notice board with clear table borders and secretary signature box."
    ],
    limitationsEn: "If there are more than 25 columns in a single row, choosing Landscape mode and Compact font size is recommended.",
    dataPrivacyEn: "100% Client-side print engine: Your Excel file renders entirely in your browser, never sent to any server.",
    officialReferenceEn: "Standard A4 Official Report Formatting Specification (ISO 216 A4)",
    lastVerifiedEn: "November 2026"
  },
  pdf_compress: {
    title: "PDF కంప్రెసర్ & సైజ్ రిడ్యూసర్ (Client-Side PDF Compressor for Govt Portals)",
    description:
      "ప్రభుత్వ ఆన్‌లైన్ పోర్టల్స్ (UBD, eGramSwaraj, IFMIS, Meeseva) లో అప్‌లోడ్ చేయాల్సిన స్కాన్ చేసిన PDF డాక్యుమెంట్ల పరిమాణాన్ని (File Size) అక్షరాల నాణ్యత తగ్గకుండా 100 KB, 200 KB, 500 KB లేదా 1 MB లోపుకు తగ్గించే బ్రౌజర్ ఆధారిత టూల్.",
    purpose:
      "UBD పోర్టల్‌లో ఆలస్య జనన/మరణ నమోదు పత్రాలు (RDO Orders, Non-Availability, Affidavit) లేదా eGramSwaraj లో గ్రామ సభ తీర్మానాల PDF అప్‌లోడ్ చేసేటప్పుడు వచ్చే 'File size exceeds maximum limit' సమస్యను సెకన్లలో పరిష్కరించడం.",
    targetAudience:
      "ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, గ్రామ పంచాయతీ కార్యదర్శులు మరియు సామాన్య పౌరులు.",
    guideSteps: [
      "'Select PDF File' బటన్‌పై క్లిక్ చేసి మీ కంప్యూటర్ లేదా మొబైల్ నుండి పెద్ద సైజు PDF ఫైల్‌ను ఎంచుకోండి.",
      " మీకు కావలసిన టార్గెట్ సైజు (ఉదా: UBD కోసం < 200 KB లేదా eGramSwaraj కోసం < 1 MB) క్వాలిటీ స్లైడర్‌ను ఎంచుకోండి.",
      "'Compress PDF' క్లిక్ చేయగానే బ్రౌజర్‌లోనే ఫైల్ పరిమాణం తగ్గించబడి, పాత సైజు మరియు కొత్త సైజు తేడా కనిపిస్తుంది.",
      "'Download Compressed PDF' బటన్ నొక్కి ఫైల్‌ను సేవ్ చేసుకుని ప్రభుత్వ పోర్టల్‌లో అప్‌లోడ్ చేయండి."
    ],
    realLifeUseCases: [
      "మొబైల్ కెమెరా లేదా స్కానర్‌తో తీసిన 5 MB అఫిడవిట్ PDF ని 180 KB లోపుకు తగ్గించి UBD పోర్టల్‌లో అప్‌లోడ్ చేయడం.",
      "గ్రామ పంచాయతీ ఆడిట్ రిపోర్టులు మరియు ఓచర్ల PDF లను నిర్ణీత KB పరిమితిలోకి మార్చడం."
    ],
    limitations:
      "ఇప్పటికే అత్యంత తక్కువ DPI తో టెక్స్ట్ మాత్రమే ఉన్న చిన్న PDF ఫైళ్ల సైజు అంతకంటే ఎక్కువగా తగ్గకపోవచ్చు; స్కాన్ చేసిన ఇమేజ్-ఆధారిత PDF లకు ఇది అత్యుత్తమంగా పనిచేస్తుంది.",
    dataPrivacy:
      "100% ప్రైవేట్ & ఆఫ్‌లైన్-రెడీ: ఇతర ఆన్‌లైన్ PDF సైట్లలాగా మీ అధికారిక పత్రాలు ఏ సర్వర్‌కూ అప్‌లోడ్ కావు. మొత్తం కంప్రెషన్ మీ బ్రౌజర్ (HTML5 Canvas & PDF Engine) లోనే జరుగుతుంది.",
    officialReference: "Standard Government Portal Upload Limits (UBD / CRS / eGramSwaraj)",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Client-Side PDF Compressor for Govt Portals",
    descriptionEn: "Browser-based tool to reduce file size of scanned PDF documents required for government online portals down below 100 KB, 200 KB, 500 KB, or 1 MB without sacrificing text clarity.",
    purposeEn: "Instantly resolving 'File size exceeds maximum limit' errors when uploading documents in UBD or eGramSwaraj portals.",
    targetAudienceEn: "e-Panchayat Computer Operators, Panchayat Secretaries, and citizens.",
    guideStepsEn: [
      "Click 'Select PDF File' button and choose large size PDF file from computer or mobile.",
      "Select desired target size quality slider.",
      "Click 'Compress PDF' to reduce file size right in browser.",
      "Click 'Download Compressed PDF' button to save file and upload to government portal."
    ],
    realLifeUseCasesEn: [
      "Compressing 5 MB affidavit PDF taken with mobile camera or scanner down below 180 KB for UBD portal upload.",
      "Converting Gram Panchayat audit reports and voucher PDFs into specified KB limits."
    ],
    limitationsEn: "Small PDF files already containing only text with minimal DPI may not reduce much further; works best for scanned image-based PDFs.",
    dataPrivacyEn: "100% Private & Offline-ready: Unlike other online PDF sites, your official documents are not uploaded to any server. Entire compression happens in your browser.",
    officialReferenceEn: "Standard Government Portal Upload Limits (UBD / CRS / eGramSwaraj)",
    lastVerifiedEn: "November 2026"
  },
  useful_links: {
    title: "ముఖ్యమైన ప్రభుత్వ పోర్టల్ లింకులు (Official Government Portals Directory)",
    description:
      "తెలంగాణ ఈ-పంచాయతీ, హౌస్ ట్యాక్స్ DCB, UBD పోర్టల్, UBD MIS స్టేటస్, eGramSwaraj, AuditOnline, Panchayat Nirnay, IFMIS మరియు తెలంగాణ ప్రభుత్వ జీవోల (GOIR) అధికారిక వెబ్‌సైట్లను సురక్షితంగా యాక్సెస్ చేసే డైరెక్టరీ.",
    purpose:
      "గ్రామ పంచాయతీ సిబ్బంది ప్రతిరోజూ ఉపయోగించే కేంద్ర మరియు రాష్ట్ర ప్రభుత్వ అధికారిక వెబ్‌సైట్ల చిరునామాలను (Verified Official URLs) తప్పులు లేకుండా ఒకే చోట అందించడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, ఈ-పంచాయతీ కంప్యూటర్ ఆపరేటర్లు, సర్పంచులు మరియు పౌరులు.",
    guideSteps: [
      "మీకు అవసరమైన ప్రభుత్వ పోర్టల్ కార్డుపై క్లిక్ చేయండి.",
      "సెక్యూరిటీ కారణాల వల్ల ప్రభుత్వ సైట్ కొత్త ట్యాబ్‌లో (Open in New Tab) నేరుగా అధికారిక డొమైన్‌లో ఓపెన్ అవుతుంది."
    ],
    realLifeUseCases: [
      "రోజువారీ ఇంటి పన్ను వసూళ్ల నివేదిక (House Tax DCB Live R2.1) ను తక్షణమే చెక్ చేయడం.",
      "తెలంగాణ ప్రభుత్వ అధికారిక జీవోల పోర్టల్ (goir.telangana.gov.in) మరియు IFMIS ట్రెజరీ సైట్‌లను ఓపెన్ చేయడం."
    ],
    limitations:
      "ఇవి ప్రభుత్వ శాఖలచే నిర్వహించబడే బాహ్య వెబ్‌సైట్లు (External Government Portals). ఆయా సర్వర్ల పనితీరు ప్రభుత్వ NIC/IT విభాగాల నియంత్రణలో ఉంటుంది.",
    dataPrivacy:
      "ఈ-వేదిక కేవలం అధికారిక లింకులను మాత్రమే అందిస్తుంది; ప్రభుత్వ పోర్టల్స్‌లో మీరు చేసే లాగిన్ వివరాలను ఈ-వేదిక సేకరించదు.",
    officialReference: "epanchayat.telangana.gov.in, egramswaraj.gov.in, ubd.telangana.gov.in",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Official Government Portals Directory",
    descriptionEn: "Secure directory to access official websites of Telangana e-Panchayat, House Tax DCB, UBD portal, UBD MIS status, eGramSwaraj, AuditOnline, Panchayat Nirnay, IFMIS, and Telangana Government GOs (GOIR).",
    purposeEn: "Providing error-free verified official URLs of central and state government websites used daily by Gram Panchayat staff in one place.",
    targetAudienceEn: "Panchayat Secretaries, e-Panchayat Computer Operators, Sarpanches, and citizens.",
    guideStepsEn: [
      "Click on required government portal card.",
      "For security reasons, government site opens directly in official domain in a new tab."
    ],
    realLifeUseCasesEn: [
      "Instantly checking daily house tax collection report.",
      "Opening Telangana Government official GOs portal and IFMIS treasury site."
    ],
    limitationsEn: "These are external websites managed by government departments. Server performance is under control of government NIC/IT divisions.",
    dataPrivacyEn: "E-Vedhika only provides official links; E-Vedhika does not collect login details you enter on government portals.",
    officialReferenceEn: "epanchayat.telangana.gov.in, egramswaraj.gov.in, ubd.telangana.gov.in",
    lastVerifiedEn: "November 2026"
  },
  suggestions: {
    title: "సూచనలు & టెక్నికల్ హెల్ప్‌డెస్క్ (Public Suggestions & Technical Support)",
    description:
      "గ్రామ పంచాయతీ డిజిటల్ పాలనలో ఎదురయ్యే సాంకేతిక సమస్యలు, UBD/DSC సందేహాలు లేదా ఈ-వేదిక పోర్టల్‌లో కొత్తగా చేర్చాల్సిన ఫీచర్లపై మీ అమూల్యమైన సలహాలు, సూచనలు మరియు ఫిర్యాదులను నేరుగా అడ్మిన్‌కు పంపే హెల్ప్‌డెస్క్.",
    purpose:
      "క్షేత్రస్థాయిలో ఆపరేటర్లు మరియు కార్యదర్శులు ఎదుర్కొనే సమస్యలను అడ్మిన్ దృష్టికి తీసుకువచ్చి సత్వర పరిష్కారం పొందడం.",
    targetAudience:
      "గ్రామ పంచాయతీ కార్యదర్శులు, కంప్యూటర్ ఆపరేటర్లు మరియు పౌరులు.",
    guideSteps: [
      "మీ పేరు, జిల్లా, మండలం మరియు సందేశాన్ని ఫారమ్‌లో టైప్ చేయండి.",
      "సబ్మిట్ చేయగానే మీ సందేశం సిస్టమ్‌లో భద్రపరచப்பட்டு అడ్మిన్‌కు నోటిఫికేషన్ వెళుతుంది."
    ],
    realLifeUseCases: [
      "DSC లేదా UBD పోర్టల్ సమస్యలపై సహాయం కోరడం.",
      "పోర్టల్‌లో కొత్త ఆఫీస్ ఫార్మాట్ లేదా టూల్ జోడించాలని కోరడం."
    ],
    limitations:
      "సహాయక సలహాలు మరియు సాంకేతిక మద్దతు ఉత్తమ ప్రయత్న ప్రాతిపదికన అందించబడతాయి.",
    dataPrivacy:
      "సమర్పించబడిన సంప్రదింపు వివరాలు అత్యంత గోప్యంగా ఉంచబడతాయి.",
    officialReference: "E-Vedhika Support Desk & Feedback System",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Public Suggestions & Technical Support Desk",
    descriptionEn: "Dedicated helpdesk for reporting technical issues in Gram Panchayat digital governance, UBD/DSC queries, or requesting new features on E-Vedhika portal.",
    purposeEn: "Bridging communication between field operators, secretaries, and portal administrators for quick technical assistance and feedback.",
    targetAudienceEn: "Panchayat Secretaries, Computer Operators, and citizens.",
    guideStepsEn: [
      "Fill out suggestion or query form with your name, district, Mandal, and message.",
      "Submit query to save in system and notify admin support via Telegram."
    ],
    realLifeUseCasesEn: [
      "Reporting DSC signing error or requesting a new office format.",
      "Providing constructive feedback for portal improvement."
    ],
    limitationsEn: "Support responses are provided on best-effort educational basis.",
    dataPrivacyEn: "Contact details submitted are kept secure and used only for support communication.",
    officialReferenceEn: "E-Vedhika Support Desk & Community Feedback Channel",
    lastVerifiedEn: "November 2026"
  },
  union: {
    title: "యూనియన్ కార్నర్ & పోల్స్ (Union Corner & Employee Polls)",
    description:
      "తెలంగాణ మరియు ఆంధ్రప్రదేశ్ పంచాయతీ కార్యదర్శులు, కంప్యూటర్ ఆపరేటర్ల సంక్షేమం, సర్వీస్ సమస్యలు, డిమాండ్లు మరియు అభిప్రాయ సేకరణ కోసం ప్రత్యేకంగా ఏర్పాటు చేసిన ఇంటరాక్టివ్ యూనియన్ కార్నర్.",
    purpose:
      "ఉద్యోగ సంఘాల డిమాండ్లు, సర్వీస్ క్రమబద్ధీకరణ మరియు అధికారిక పోల్స్‌పై అభిప్రాయాలను పంచుకోవడం.",
    targetAudience:
      "పంచాయతీ కార్యదర్శులు, కంప్యూటర్ ఆపరేటర్లు మరియు అసోసియేషన్ సభ్యులు.",
    guideSteps: [
      "యూనియన్ అప్‌డేట్లు మరియు సర్వే పోల్స్‌ను వీక్షించండి.",
      "మీ అభిప్రాయాన్ని పోల్స్‌లో ఓటు వేసి ప్రత్యక్ష ఫలితాలను గమనించండి."
    ],
    realLifeUseCases: [
      "ఉద్యోగ సర్వీస్ విషయాలపై అభిప్రాయ సేకరణలో పాల్గొనడం.",
      "తాజా యూనియన్ సర్క్యులర్లు మరియు ప్రకటనలను తెలుసుకోవడం."
    ],
    limitations:
      "పోల్స్ మరియు చర్చలు ఉద్యోగుల ఏకాభిప్రాయం కోసం మాత్రమే; అధికారిక విజ్ఞప్తులు సరైన శాఖా పరమైన ఛానళ్ల ద్వారా సమర్పించాలి.",
    dataPrivacy:
      "ఉద్యోగ గోప్యత కోసం అనామక ఓటింగ్ (Anonymous Voting) సౌకర్యం కలదు.",
    officialReference: "Telangana & AP Panchayat Secretaries Association Guidelines",
    lastVerified: "నవంబర్ 2026",

    titleEn: "Union Corner, Polls & Employee Voice",
    descriptionEn: "Dedicated interactive corner for Panchayat Secretaries and Computer Operators to discuss welfare demands, service regularization, pay scales, and participate in official opinion polls.",
    purposeEn: "Providing a democratic platform for employees to voice service matters and vote on community polls.",
    targetAudienceEn: "Panchayat Secretaries, Computer Operators, and association members.",
    guideStepsEn: [
      "View active union updates, announcements, and polls.",
      "Cast your vote in interactive polls and view live results."
    ],
    realLifeUseCasesEn: [
      "Participating in association polls regarding service conditions.",
      "Reading latest union announcements and circular updates."
    ],
    limitationsEn: "Polls and discussions are for staff consensus and expression; official representations must be submitted through proper departmental channels.",
    dataPrivacyEn: "Anonymous voting option available for employee privacy.",
    officialReferenceEn: "Telangana & AP Panchayat Secretaries Association Guidelines",
    lastVerifiedEn: "November 2026"
  }
};
