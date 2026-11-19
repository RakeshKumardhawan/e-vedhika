import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  FileSpreadsheet,
  Code2,
  Database,
  BarChart3,
  Wrench,
  CheckCircle2,
  Copy,
  Download,
  Search,
  Sparkles,
  Award,
  Scale,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import XLSX from "xlsx-js-style";

export interface LearningTopic {
  id: string;
  track:
    | "excel"
    | "gsheets"
    | "python"
    | "numpy"
    | "pandas"
    | "powerbi"
    | "practical";
  level: "Beginner" | "Intermediate" | "Advanced";
  titleTe: string;
  titleEn: string;
  summaryTe: string;
  stepsTe: string[];
  codeOrFormula: string;
  practicalExampleTe: string;
}

export const COMPLETE_LEARNING_TOPICS: LearningTopic[] = [
  // A. EXCEL TUTORIALS
  {
    id: "xl_basics_formulas",
    track: "excel",
    level: "Beginner",
    titleTe: "1. Excel Basics, SUM, AVERAGE, COUNT, COUNTA & IF / IFS",
    titleEn: "Excel Basics, Core Functions & Conditional Logic (IF / IFS)",
    summaryTe:
      "గ్రామ పంచాయతీ రోజువారీ రిపోర్టులలో కూడికలు, సగటు, హాజరు లెక్కింపు మరియు షరతుల ఆధారంగా గ్రేడింగ్ ఇచ్చే ప్రాథమిక ఫార్ములాలు.",
    stepsTe: [
      "సెల్‌లో ప్రతి ఫార్ములా తప్పనిసరిగా '=' గుర్తుతో ప్రారంభం కావాలి.",
      "కేవలం సంఖ్యలు ఉన్న సెల్స్ లెక్కించడానికి =COUNT(B2:B100), అక్షరాలు/పేర్లు ఉన్న సెల్స్ లెక్కించడానికి =COUNTA(A2:A100) వాడాలి.",
      "బహుళ షరతులు ఉన్నప్పుడు నెస్టెడ్ IF బదులుగా =IFS() ఉపయోగించండి.",
    ],
    codeOrFormula:
      '=IFS(F2>=90, "A+ Grade", F2>=75, "A Grade", F2>=50, "B Grade", TRUE, "Pending")',
    practicalExampleTe:
      "మండలంలోని 25 గ్రామ పంచాయతీల DSR సమర్పణ శాతం ఆధారంగా ఆటోమేటిక్‌గా గ్రేడ్ కేటాయించడం.",
  },
  {
    id: "xl_countif_sumif",
    track: "excel",
    level: "Beginner",
    titleTe: "2. COUNTIF, COUNTIFS, SUMIF & SUMIFS (మండల స్థాయి సమ్మరీ)",
    titleEn: "Conditional Counting & Summing (COUNTIF, COUNTIFS, SUMIF)",
    summaryTe:
      "వందల గ్రామ పంచాయతీల రోస్ ఉన్న షీట్ నుండి మండల వారీగా Present/Leave సంఖ్యను మరియు పన్ను వసూళ్ల మొత్తాన్ని క్షణాల్లో రాబట్టడం.",
    stepsTe: [
      "ఒకే షరతు ఉంటే COUNTIF(Range, Criteria) లేదా SUMIF(Range, Criteria, Sum_Range) వాడాలి.",
      "రెండు లేదా అంతకంటే ఎక్కువ షరతులు (ఉదా: మండలం = 'Gajwel' మరియు Status = 'Present') ఉంటే COUNTIFS వాడాలి.",
    ],
    codeOrFormula:
      '=COUNTIFS(B:B, "Ibrahimpatnam", E:E, "Present")\n=SUMIF(B2:B500, "Ibrahimpatnam", G2:G500)',
    practicalExampleTe:
      "మన పంచాయతీ హాజరు షీట్ నుండి ప్రతి మండలంలో ఉదయం 9 గంటల లోపు ఎంతమంది కార్యదర్శులు హాజరయ్యారో లెక్కించడం.",
  },
  {
    id: "xl_vlookup_xlookup_index_match",
    track: "excel",
    level: "Intermediate",
    titleTe: "3. VLOOKUP, XLOOKUP, INDEX & MATCH (రెండు షీట్ల డేటా అనుసంధానం)",
    titleEn: "Mastering VLOOKUP, XLOOKUP, and INDEX + MATCH",
    summaryTe:
      "రైతు రిజిస్ట్రీ, హౌస్ టాక్స్ లేదా హాజరు షీట్లలో ఒక షీట్‌లోని GP Code / PPBNO ఆధారంగా మరొక షీట్ నుండి వివరాలను తీసుకురావడం.",
    stepsTe: [
      "VLOOKUP ఎప్పుడూ ఎడమవైపు మొదటి కాలమ్‌లో వెతికి కుడివైపు కాలమ్ విలువను ఇస్తుంది (చివరన 0 లేదా FALSE తప్పనిసరి).",
      "XLOOKUP లేదా INDEX+MATCH ద్వారా ఎడమవైపు ఉన్న కాలమ్ విలువను కూడా సులభంగా తీసుకురావచ్చు.",
    ],
    codeOrFormula:
      '=VLOOKUP(A2, MasterSheet!$A$2:$F$1000, 4, FALSE)\n=XLOOKUP(A2, Master!A:A, Master!D:D, "Not Found")\n=INDEX(Master!$D$2:$D$1000, MATCH(A2, Master!$A$2:$A$1000, 0))',
    practicalExampleTe:
      "RLB ఆఫీస్ కోడ్ ఆధారంగా గ్రామ పంచాయతీ పేరు మరియు కార్యదర్శి మొబైల్ నంబర్‌ను మాస్టర్ షీట్ నుండి ఆటోమేటిక్‌గా నింపడం.",
  },
  {
    id: "xl_text_date_cleaning",
    track: "excel",
    level: "Intermediate",
    titleTe: "4. TEXT, DATE Functions, Duplicate Detection, Data Validation & Pivot Tables",
    titleEn: "TEXT, Date Functions, Duplicate Removal, Validation & Pivot Tables",
    summaryTe:
      "తేదీల ఫార్మాటింగ్, ఆధార్/మొబైల్ నంబర్ వాలిడేషన్, డూప్లికేట్ రికార్డుల హైలైటింగ్ మరియు పివట్ టేబుల్ రిపోర్టింగ్.",
    stepsTe: [
      "=TRIM(CLEAN(A2)) ద్వారా పోర్టల్ నుండి కాపీ చేసిన పేర్లలోని అదనపు ఖాళీలను తొలగించండి.",
      "=TEXT(Today(), \"dd-mm-yyyy\") ద్వారా డైనమిక్ తేదీ హెడర్లను తయారు చేయండి.",
      "Insert -> PivotTable ద్వారా ఒక్క ఫార్ములా లేకుండా మండల & జిల్లా సమ్మరీ తయారు చేయవచ్చు.",
    ],
    codeOrFormula:
      '=TEXT(A2, "dd-mm-yyyy")\n=IF(COUNTIF($A$2:$A$500, A2)>1, "Duplicate", "Unique")',
    practicalExampleTe:
      "అసెస్‌మెంట్ రిజిస్టర్‌లో ఒకే ఇంటి నంబర్ రెండుసార్లు నమోదైతే Conditional Formatting ద్వారా ఎరుపు రంగులో హైలైట్ చేయడం.",
  },
  {
    id: "xl_powerquery_unpivot_merge",
    track: "excel",
    level: "Advanced",
    titleTe: "5. Power Query: Merge Files, Append Sheets, Unpivot & Transpose",
    titleEn: "Power Query Automation: Merge, Append, Unpivot Columns & Transpose",
    summaryTe:
      "ప్రతిరోజూ చేసే ఎక్సెల్ కన్సాలిడేషన్ పనులను Power Query లేదా ఈ-వేదిక Excel Studio ద్వారా ఆటోమేట్ చేయడం.",
    stepsTe: [
      "Data -> Get Data -> From Folder ద్వారా ఒక ఫోల్డర్‌లోని 30 రోజుల DSR ఫైళ్లను ఒకేసారి కలపవచ్చు.",
      "Power Query Editor లో ID కాలమ్ సెలెక్ట్ చేసి Right Click -> 'Unpivot Other Columns' కొడితే తేదీల కాలమ్స్ అన్నీ రోస్‌గా మారుతాయి.",
    ],
    codeOrFormula:
      "// Power Query M Formula:\nTable.UnpivotOtherColumns(Source, {\"Mandal\", \"GP_Name\"}, \"Date\", \"Attendance_Status\")",
    practicalExampleTe:
      "30 తేదీలు 30 కాలమ్స్‌గా ఉన్న నెలవారీ హాజరు షీట్‌ను డేటాబేస్ అనాలసిస్ కోసం 3 కాలమ్స్ (GP, Date, Status) గా మార్చడం.",
  },

  // B. GOOGLE SHEETS TUTORIALS
  {
    id: "gs_query_filter_unique",
    track: "gsheets",
    level: "Intermediate",
    titleTe: "1. Google Sheets: QUERY, FILTER, UNIQUE, SORT & COUNTUNIQUEIFS",
    titleEn: "Google Sheets Master Functions: QUERY, FILTER, UNIQUE & SORT",
    summaryTe:
      "మండల ఆపరేటర్లు Google Sheets లో లైవ్ డేటా సేకరించేటప్పుడు ఆటోమేటిక్‌గా పెండింగ్ GPల జాబితాను వేరు చేసే ఫార్ములాలు.",
    stepsTe: [
      "=FILTER() ద్వారా ఒక షీట్‌లో 'Pending' అని ఉన్న గ్రామ పంచాయతీలను మాత్రమే రెండవ షీట్‌లోకి లైవ్‌లో తీసుకురావచ్చు.",
      "=QUERY() ద్వారా SQL తరహాలో గ్రూపింగ్ మరియు సార్టింగ్ ఒకే ఫార్ములాలో చేయవచ్చు.",
    ],
    codeOrFormula:
      '=FILTER(A2:F200, E2:E200="Not Reported")\n=QUERY(A1:G500, "SELECT B, COUNT(C), SUM(F) WHERE B IS NOT NULL GROUP BY B", 1)\n=COUNTUNIQUEIFS(C2:C500, B2:B500, "Gajwel")',
    practicalExampleTe:
      "గూగుల్ షీట్‌లో కార్యదర్శులు ఎంట్రీ చేయగానే, ఇంకా ఎంట్రీ చేయని GPల పేర్లు ఆటోమేటిక్‌గా MPDO డ్యాష్‌బోర్డ్ షీట్‌లో కనిపించడం.",
  },
  {
    id: "gs_textjoin_array_protection",
    track: "gsheets",
    level: "Advanced",
    titleTe: "2. TEXTJOIN, SPLIT, SUBSTITUTE, ARRAYFORMULA, IMPORTRANGE & Sheet Protection",
    titleEn: "TEXTJOIN, ARRAYFORMULA, IMPORTRANGE & Range Permissions",
    summaryTe:
      "ఒక గూగుల్ షీట్ నుండి మరొక షీట్‌కు డేటా లింక్ చేయడం మరియు ఇతరులు ఫార్ములాలు డిలీట్ చేయకుండా లాక్ చేయడం.",
    stepsTe: [
      "Data -> Protect sheets and ranges ద్వారా మీ మండలం కాలమ్స్ లేదా ఫార్ములా సెల్స్‌ను మాత్రమే లాక్ చేయండి.",
      "ARRAYFORMULA వాడితే ప్రతి రోకు ఫార్ములా డ్రాగ్ చేయాల్సిన అవసరం ఉండదు.",
    ],
    codeOrFormula:
      '=ARRAYFORMULA(IF(A2:A="", "", C2:C + D2:D))\n=TEXTJOIN(", ", TRUE, FILTER(B2:B100, E2:E100="Pending"))\n=IMPORTRANGE("https://docs.google.com/spreadsheets/d/...", "Sheet1!A1:G100")',
    practicalExampleTe:
      "పెండింగ్ ఉన్న అన్ని గ్రామ పంచాయతీల పేర్లను కామాతో కలిపి ఒక్క క్లిక్‌తో వాట్సాప్ గ్రూప్‌లో పోస్ట్ చేయడానికి సిద్ధం చేయడం.",
  },

  // C. PYTHON TUTORIALS
  {
    id: "py_basics_colab",
    track: "python",
    level: "Beginner",
    titleTe: "1. Python Installation, Google Colab, Variables, Data Types & Strings",
    titleEn: "Python Setup, Google Colab & Core Data Types for Operators",
    summaryTe:
      "కంప్యూటర్‌లో ఏ సాఫ్ట్‌వేర్ ఇన్‌స్టాల్ చేయకుండానే Google Colab లో Python ద్వారా పంచాయతీ డేటాను ప్రాసెస్ చేయడం.",
    stepsTe: [
      "బ్రౌజర్‌లో colab.research.google.com ఓపెన్ చేసి 'New Notebook' క్లిక్ చేయండి.",
      "Python లో Variables, Strings, Integers, Floats మరియు Lists ఉపయోగించి GP డేటాను నిల్వ చేయవచ్చు.",
    ],
    codeOrFormula:
      'gp_name = "Dandumailaram"\nhouse_tax_demand = 1485000\ncollected = 1392000\npct = round((collected / house_tax_demand) * 100, 2)\nprint(f"{gp_name} GP Tax Collection: {pct}%")',
    practicalExampleTe:
      "పైథాన్ f-strings తో గ్రామ పంచాయతీ వసూళ్ల శాతాన్ని లెక్కించి ఆటోమేటిక్ టెక్స్ట్ సమ్మరీ ప్రింట్ చేయడం.",
  },
  {
    id: "py_lists_dicts_loops_functions",
    track: "python",
    level: "Intermediate",
    titleTe: "2. Python Lists, Dictionaries, If/Else, Loops & Functions",
    titleEn: "Lists, Dictionaries, Control Flow & Reusable Functions in Python",
    summaryTe:
      "వందల గ్రామ పంచాయతీల రికార్డులను Loops మరియు Functions తో ఆటోమేటిక్‌గా ఫిల్టర్ చేయడం.",
    stepsTe: [
      "Dictionary ({key: value}) ద్వారా ప్రతి GP పేరు మరియు దాని హాజరు స్థితిని జతగా నిల్వ చేయవచ్చు.",
      "for loop మరియు if-else ద్వారా పెండింగ్ ఉన్న GPలను తక్షణమే వేరు చేయవచ్చు.",
    ],
    codeOrFormula:
      'gp_status = {"Dandumailaram": "Present", "Yeliminedu": "Leave", "Tukkuguda": "Not Reported"}\npending_gps = [gp for gp, status in gp_status.items() if status == "Not Reported"]\nprint("Pending GPs:", pending_gps)',
    practicalExampleTe:
      "List Comprehension ఉపయోగించి ఒక్క లైన్ కోడ్‌తో పెండింగ్ GPల జాబితా తయారు చేయడం.",
  },

  // D. NUMPY TUTORIALS
  {
    id: "np_arrays_stats_where",
    track: "numpy",
    level: "Intermediate",
    titleTe: "1. NumPy Arrays, Indexing, Slicing, Statistics, Where & Select",
    titleEn: "NumPy High-Speed Numerical Arrays, Statistics & Conditional Where",
    summaryTe:
      "పెద్ద సంఖ్యలో ఉన్న ఆర్థిక గణాంకాలు (15th FC / House Tax DCB) మరియు శాతాలను NumPy తో వేగంగా లెక్కించడం.",
    stepsTe: [
      "import numpy as np ద్వారా NumPy లైబ్రరీని లోడ్ చేయాలి.",
      "np.where() అనేది ఎక్సెల్‌లోని IF() ఫార్ములా లాగా వేల సంఖ్యలపై ఒకేసారి పనిచేస్తుంది.",
    ],
    codeOrFormula:
      'import numpy as np\ndemand = np.array([1200000, 850000, 940000, 1500000])\ncollection = np.array([1150000, 600000, 940000, 1410000])\npct = np.round((collection / demand) * 100, 2)\nstatus = np.where(pct >= 90, "Excellent", "Follow-up Needed")\nprint("Percentages:", pct)\nprint("Mean Collection:", np.mean(collection))',
    practicalExampleTe:
      "జిల్లాలోని అన్ని మండలాల సగటు పన్ను వసూలు (Mean), గరిష్ట (Max), కనిష్ట (Min) విలువలను లెక్కించడం.",
  },

  // E. PANDAS TUTORIALS
  {
    id: "pd_dataframe_groupby_merge",
    track: "pandas",
    level: "Advanced",
    titleTe: "1. Pandas DataFrames: Read Excel, Clean, GroupBy, Merge & Export",
    titleEn: "Pandas Data Analysis: DataFrames, GroupBy, Merge/Join & FillNA",
    summaryTe:
      "ఎక్సెల్‌లో క్రాష్ అయ్యే లక్షల రోస్ ఉన్న ఫైళ్లను (ఉదా: Farmer Registry / Multi-Month DSR) Pandas తో 2 సెకన్లలో విశ్లేషించడం.",
    stepsTe: [
      "pd.read_excel('dsr.xlsx') ద్వారా ఎక్సెల్ ఫైల్‌ను DataFrame గా చదవవచ్చు.",
      "df.drop_duplicates(), df.fillna(0) తో డేటాను క్లీన్ చేయవచ్చు.",
      "df.groupby('Mandal') ద్వారా మండల వారీ సమ్మరీ టేబుల్ తయారు చేసి కొత్త ఎక్సెల్‌గా సేవ్ చేయవచ్చు.",
    ],
    codeOrFormula:
      'import pandas as pd\ndf = pd.read_excel("Mandal_DSR.xlsx")\ndf["Collection"] = df["Collection"].fillna(0)\nsummary = df.groupby("Mandal").agg(\n    Total_GPs=("GP_Name", "count"),\n    Total_Demand=("Demand", "sum"),\n    Total_Collection=("Collection", "sum")\n).reset_index()\nsummary["Coll_Pct"] = round((summary["Total_Collection"] / summary["Total_Demand"]) * 100, 2)\nsummary.to_excel("Mandal_Consolidated_Report.xlsx", index=False)',
    practicalExampleTe:
      "మండలాల వారీగా మొత్తం GPల సంఖ్య, మొత్తం డిమాండ్ మరియు వసూలు శాతాన్ని 10 లైన్ల Pandas స్క్రిప్ట్‌తో ఆటోమేట్ చేయడం.",
  },

  // F. POWER BI TUTORIALS
  {
    id: "pbi_dashboard_dax",
    track: "powerbi",
    level: "Advanced",
    titleTe: "1. Power BI Desktop: Data Import, DAX Measures, Matrix Visuals & Slicers",
    titleEn: "Power BI Interactive Panchayat Dashboards, DAX & Conditional Formatting",
    summaryTe:
      "జిల్లా మరియు మండల అధికారుల సమీక్షా సమావేశాల కోసం ఆకర్షణీయమైన ఇంటరాక్టివ్ Power BI డ్యాష్‌బోర్డుల తయారీ.",
    stepsTe: [
      "Get Data -> Excel Workbook ద్వారా DSR లేదా DCB మాస్టర్ షీట్‌ను Power BI లోకి లోడ్ చేయండి.",
      "DAX ఫార్ములాతో Dynamic Collection % మరియు Attendance % Measures సృష్టించండి.",
      "Mandal మరియు Date కోసం Slicers పెట్టి, Matrix Visual లో Conditional Data Bars ఆన్ చేయండి.",
    ],
    codeOrFormula:
      '// Power BI DAX Measures:\nTotal Demand = SUM(DCB_Data[Total_Demand])\nTotal Collection = SUM(DCB_Data[Total_Collection])\nCollection % = DIVIDE([Total Collection], [Total Demand], 0) * 100\nAttended GPs = CALCULATE(COUNTROWS(DSR_Data), DSR_Data[Status] = "Present")',
    practicalExampleTe:
      "మండలం పేరుపై క్లిక్ చేయగానే ఆ మండలంలోని అన్ని గ్రామ పంచాయతీల హాజరు, MAS మరియు DCB గ్రాఫ్‌లు మారే లైవ్ డ్యాష్‌బోర్డ్.",
  },

  // G. PRACTICAL OPERATOR GUIDES
  {
    id: "prac_polling_consolidation",
    track: "practical",
    level: "Intermediate",
    titleTe: "1. ప్రాక్టికల్ ఆపరేటర్ గైడ్స్: ఎన్నికల పోలింగ్ సిబ్బంది లెక్కింపు & GP డేటా కన్సాలిడేషన్",
    titleEn: "Mandal Polling Staff Calculations, Data Consolidation & Office Automation",
    summaryTe:
      "ఎన్నికల సమయంలో పోలింగ్ స్టేషన్ల వారీగా PO, APO, OP లెక్కింపు (20% రిజర్వ్‌తో) మరియు రోజువారీ ఆఫీస్ ఆటోమేషన్ చిట్కాలు.",
    stepsTe: [
      "ఓటర్ల సంఖ్య ఆధారంగా పోలింగ్ సిబ్బంది కేటాయింపుకు CEILING మరియు IF ఫార్ములాలు ఉపయోగించండి.",
      "ఈ-వేదికలోని Unsupported Excel Viewer తో HTML .xls ఫైళ్లను .xlsx గా మార్చి, Excel Studio లో Compare చేయండి.",
    ],
    codeOrFormula:
      '=CEILING(Total_Polling_Stations * 1.20, 1) // 20% Reserve Staff Calculation',
    practicalExampleTe:
      "మండలంలోని 85 పోలింగ్ కేంద్రాలకు 20% రిజర్వ్‌తో కలిపి అవసరమైన ప్రిసైడింగ్ ఆఫీసర్ల సంఖ్యను ఖచ్చితంగా లెక్కించడం.",
  },
];

export interface PrActQuestionItem {
  id: string;
  topic: string;
  questionTe: string;
  sectionRef: string;
  officialRuleSummaryTe: string;
  practicalExplanationTe: string;
}

export const PR_ACT_INTERACTIVE_QA: PrActQuestionItem[] = [
  {
    id: "qa_sarpanch",
    topic: "Sarpanch Powers (సర్పంచ్ అధికారాలు)",
    questionTe: "సర్పంచ్ అధికారాలు, విధులు మరియు సస్పెన్షన్ నిబంధనలు ఏమిటి?",
    sectionRef: "Section 32 to 37 – Telangana Panchayat Raj Act, 2018",
    officialRuleSummaryTe:
      "సెక్షన్ 32 ప్రకారం సర్పంచ్ గ్రామ పంచాయతీ సమావేశాలకు అధ్యక్షత వహిస్తారు మరియు పాలనాపరమైన పర్యవేక్షణ చేస్తారు. సెక్షన్ 37 ప్రకారం విధి నిర్వహణలో నిర్లక్ష్యం లేదా నిధుల దుర్వినియోగం జరిగితే జిల్లా కలెక్టర్ విచారణ జరిపి సస్పెండ్/తొలగించవచ్చు.",
    practicalExplanationTe:
      "ఆచరణాత్మక ఉదాహరణ: గ్రామంలో 100% పారిశుద్ధ్యం, హరితహారం మొక్కల రక్షణ (85% సర్వైవల్) మరియు ప్రతి నెలా GP సమావేశం నిర్వహించడం సర్పంచ్ తప్పనిసరి బాధ్యత.",
  },
  {
    id: "qa_secretary",
    topic: "Secretary Responsibilities (కార్యదర్శి బాధ్యతలు)",
    questionTe: "పంచాయతీ కార్యదర్శి యొక్క చట్టబద్ధమైన విధులు మరియు ఆర్థిక బాధ్యతలు ఏమిటి?",
    sectionRef: "Section 42 & 43 – Telangana Panchayat Raj Act, 2018",
    officialRuleSummaryTe:
      "సెక్షన్ 42 ప్రకారం గ్రామ పంచాయతీ రికార్డుల భద్రత, తీర్మానాల అమలు, 100% పన్ను వసూలు, జనన మరణ నమోదు మరియు అక్రమ నిర్మాణాల నియంత్రణ కార్యదర్శి చట్టబద్ధమైన విధి.",
    practicalExplanationTe:
      "ఆచరణాత్మక ఉదాహరణ: రోజువారీ DSR నమోదు, UBD సర్టిఫికెట్ల DSC సంతకం, క్యాష్ బుక్ నిర్వహణ మరియు అనుమతి లేని లేఅవుట్లకు నోటీసులు ఇవ్వడం కార్యదర్శి ప్రత్యక్ష బాధ్యత.",
  },
  {
    id: "qa_gram_sabha",
    topic: "Gram Sabha (గ్రామ సభ నిబంధనలు)",
    questionTe: "గ్రామ సభ ఎప్పుడెప్పుడు నిర్వహించాలి మరియు కోరం నిబంధన ఏమిటి?",
    sectionRef: "Section 6 – Telangana Panchayat Raj Act, 2018",
    officialRuleSummaryTe:
      "సెక్షన్ 6 ప్రకారం ప్రతి 2 నెలలకు ఒకసారి కనీసం ఒక గ్రామ సభ నిర్వహించాలి. గ్రామ ఓటర్ల జాబితా ఆధారంగా నిర్దేశిత కోరం హాజరు తప్పనిసరి.",
    practicalExplanationTe:
      "ఆచరణాత్మక ఉదాహరణ: GPDP వార్షిక బడ్జెట్ ఆమోదం, లబ్ధిదారుల ఎంపిక మరియు ఆడిట్ నివేదికలను గ్రామ సభ ముందు ఉంచి మినిట్స్ పుస్తకంలో నమోదు చేయాలి.",
  },
  {
    id: "qa_standing_committees",
    topic: "Standing Committees (స్థాయి సంఘాలు)",
    questionTe: "గ్రామ పంచాయతీలో ఎన్ని స్థాయి సంఘాలు (Standing Committees) ఉండాలి?",
    sectionRef: "Section 41 – Telangana Panchayat Raj Act, 2018",
    officialRuleSummaryTe:
      "సెక్షన్ 41 ప్రకారం ప్రతి గ్రామ పంచాయతీలో పారిశుద్ధ్యం, వీధి దీపాలు, మొక్కల పెంపకం మరియు అభివృద్ధి పనుల పర్యవేక్షణ కోసం 4 స్థాయి సంఘాలను ఏర్పాటు చేయాలి.",
    practicalExplanationTe:
      "ఆచరణాత్మక ఉదాహరణ: వార్డు సభ్యులు మరియు మహిళా సంఘాల ప్రతినిధులతో కూడిన ఈ కమిటీలు గ్రామ స్థాయి పనుల నాణ్యతను పర్యవేక్షిస్తాయి.",
  },
  {
    id: "qa_meetings",
    topic: "Panchayat Meetings (పంచాయతీ సమావేశాలు)",
    questionTe: "గ్రామ పంచాయతీ పాలకవర్గ సమావేశాల నిబంధనలు ఏమిటి?",
    sectionRef: "Section 39 & 40 – Telangana Panchayat Raj Act, 2018",
    officialRuleSummaryTe:
      "ప్రతి నెలా కనీసం ఒకసారి గ్రామ పంచాయతీ సమావేశం జరగాలి. వరుసగా 3 సమావేశాలకు అనుమతి లేకుండా గైర్హాజరయ్యే సభ్యులు అనర్హతకు గురవుతారు.",
    practicalExplanationTe:
      "ఆచరణాత్మక ఉదాహరణ: సమావేశ అజెండా నోటీసును సభ్యులకు ముందుగానే అందజేసి, సమావేశ తీర్మానాలను Panchayat Nirnay పోర్టల్‌లో అప్‌లోడ్ చేయాలి.",
  },
  {
    id: "qa_taxes_finance",
    topic: "Taxes & Financial Responsibilities (పన్నులు & ఆర్థికం)",
    questionTe: "గ్రామ పంచాయతీ పన్నులు, నిధులు మరియు ఆడిట్ నిబంధనలు ఏమిటి?",
    sectionRef: "Section 61 to 75 – Telangana Panchayat Raj Act, 2018",
    officialRuleSummaryTe:
      "సెక్షన్ 61–70 ప్రకారం ఇంటి పన్ను, కుళాయి ఫీజు, ట్రేడ్ లైసెన్స్ మరియు వేలం పాటల ద్వారా ఆదాయం సమకూర్చుకోవాలి. ప్రతి పైసా eGramSwaraj / PFMS ద్వారానే ఖర్చు చేయాలి.",
    practicalExplanationTe:
      "ఆచరణాత్మక ఉదాహరణ: వసూలైన పన్నులను వెంటనే GP ఖాతాలో జమ చేయాలి మరియు ప్రతి ఆర్థిక సంవత్సరం AuditOnline లో వార్షిక ఆడిట్ పూర్తి చేయాలి.",
  },
];

export function LearningCenterTracks({
  addToast,
}: {
  addToast?: (msg: string) => void;
}) {
  const [selectedTrack, setSelectedTrack] = useState<string>("excel");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("e_vedhika_learning_completed");
      if (saved) setCompletedIds(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleCompleted = (id: string) => {
    const next = completedIds.includes(id)
      ? completedIds.filter((x) => x !== id)
      : [...completedIds, id];
    setCompletedIds(next);
    try {
      localStorage.setItem("e_vedhika_learning_completed", JSON.stringify(next));
    } catch {}
    if (addToast) {
      addToast(
        next.includes(id)
          ? "✅ మాడ్యూల్ పూర్తయినట్లు మార్క్ చేయబడింది!"
          : "మాడ్యూల్ అన్‌మార్క్ చేయబడింది."
      );
    }
  };

  const tracks = [
    { id: "excel", label: "A. Excel Tutorials", icon: FileSpreadsheet },
    { id: "gsheets", label: "B. Google Sheets", icon: FileSpreadsheet },
    { id: "python", label: "C. Python Coding", icon: Code2 },
    { id: "numpy", label: "D. NumPy Analytics", icon: Database },
    { id: "pandas", label: "E. Pandas DataFrames", icon: Database },
    { id: "powerbi", label: "F. Power BI Dashboards", icon: BarChart3 },
    { id: "practical", label: "G. Practical Operator Guides", icon: Wrench },
  ];

  const filteredTopics = useMemo(() => {
    return COMPLETE_LEARNING_TOPICS.filter((t) => {
      if (selectedTrack !== "ALL" && t.track !== selectedTrack) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.titleTe.toLowerCase().includes(q) ||
          t.titleEn.toLowerCase().includes(q) ||
          t.summaryTe.toLowerCase().includes(q) ||
          t.codeOrFormula.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedTrack, searchQuery]);

  const progressPct = Math.round(
    (completedIds.length / COMPLETE_LEARNING_TOPICS.length) * 100
  );

  const handleDownloadPracticeWorkbook = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([
      {
        RLB_Code: "360101",
        Mandal: "Ibrahimpatnam",
        GP_Name: "Dandumailaram",
        Secretary_Attendance: "Present",
        Submission_Time: "08:35 AM",
        House_Tax_Demand: 1485000,
        House_Tax_Collection: 1392000,
      },
      {
        RLB_Code: "360102",
        Mandal: "Ibrahimpatnam",
        GP_Name: "Yeliminedu",
        Secretary_Attendance: "Present",
        Submission_Time: "08:50 AM",
        House_Tax_Demand: 1120000,
        House_Tax_Collection: 1064000,
      },
      {
        RLB_Code: "360201",
        Mandal: "Gajwel",
        GP_Name: "Ahmadipur",
        Secretary_Attendance: "Meeting",
        Submission_Time: "09:15 AM",
        House_Tax_Demand: 910000,
        House_Tax_Collection: 910000,
      },
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Practice_Data");
    XLSX.writeFile(wb, "E_Vedhika_Training_Practice_Dataset.xlsx");
    if (addToast) addToast("ప్రాక్టీస్ ఎక్సెల్ ఫైల్ డౌన్‌లోడ్ చేయబడింది!");
  };

  return (
    <div className="space-y-6">
      {/* Progress Banner */}
      <div className="bg-gradient-to-r from-[#0d3b66] via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-emerald-300 text-xs font-black">
            <Award size={14} /> DIGITAL TRAINING & CODING LEARNING CENTER
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Excel, Google Sheets, Python, NumPy, Pandas & Power BI లెర్నింగ్ హబ్
          </h3>
          <p className="text-xs text-slate-200">
            పంచాయతీ కంప్యూటర్ ఆపరేటర్లు మరియు కార్యదర్శుల కోసం ఫార్ములాలు, కోడ్ ఉదాహరణలు, ప్రాక్టీస్ ఎక్సెల్ ఫైల్స్ మరియు ట్రైనింగ్ ప్రోగ్రెస్ ట్రాకర్.
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-2.5 text-xs font-bold">
            శిక్షణ పురోగతి (Training Progress):{" "}
            <strong className="text-amber-300">{progressPct}%</strong> (
            {completedIds.length}/{COMPLETE_LEARNING_TOPICS.length} Completed)
          </div>
          <button
            type="button"
            onClick={handleDownloadPracticeWorkbook}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} /> Download Sample Practice Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Track Selector & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTrack("ALL")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer ${
              selectedTrack === "ALL"
                ? "bg-[#0d3b66] text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            అన్ని ట్రాక్స్ (All 7 Tracks)
          </button>
          {tracks.map((tr) => {
            const Icon = tr.icon;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => setSelectedTrack(tr.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                  selectedTrack === tr.id
                    ? "bg-[#0d3b66] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Icon size={14} /> {tr.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ఫార్ములా లేదా ట్యుటోరియల్ వెతకండి (ఉదా: VLOOKUP, XLOOKUP, QUERY, Pandas, GroupBy, DAX)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Tutorials Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredTopics.map((topic) => {
          const isDone = completedIds.includes(topic.id);
          return (
            <div
              key={topic.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                      {topic.track.toUpperCase()}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-black">
                      {topic.level}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompleted(topic.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <CheckCircle2 size={13} />
                    {isDone ? "Completed" : "Mark Complete"}
                  </button>
                </div>

                <div>
                  <h4 className="text-base font-black text-slate-900">
                    {topic.titleTe}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400">
                    {topic.titleEn}
                  </p>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {topic.summaryTe}
                </p>

                <ul className="space-y-1.5 text-xs text-slate-700">
                  {topic.stepsTe.map((st, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#0d3b66] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="bg-slate-900 text-emerald-300 p-3.5 rounded-2xl font-mono text-xs relative">
                  <pre className="whitespace-pre-wrap break-all pr-16">
                    {topic.codeOrFormula}
                  </pre>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(topic.codeOrFormula);
                      if (addToast) addToast("కోడ్ / ఫార్ములా కాపీ చేయబడింది!");
                    }}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-sans font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy size={11} /> Copy
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium">
                  <strong>💡 పంచాయతీ ఆచరణాత్మక ఉదాహరణ:</strong>{" "}
                  {topic.practicalExampleTe}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PrActInteractiveAssistant() {
  const [queryText, setQueryText] = useState<string>("");
  const [selectedQa, setSelectedQa] = useState<PrActQuestionItem>(
    PR_ACT_INTERACTIVE_QA[0]
  );

  const matchedQaList = useMemo(() => {
    if (!queryText.trim()) return PR_ACT_INTERACTIVE_QA;
    const q = queryText.toLowerCase();
    return PR_ACT_INTERACTIVE_QA.filter(
      (item) =>
        item.topic.toLowerCase().includes(q) ||
        item.questionTe.toLowerCase().includes(q) ||
        item.sectionRef.toLowerCase().includes(q) ||
        item.officialRuleSummaryTe.toLowerCase().includes(q) ||
        item.practicalExplanationTe.toLowerCase().includes(q)
    );
  }, [queryText]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
      {/* Legal Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 space-y-1">
          <p className="font-black uppercase tracking-wide text-amber-900">
            చట్టపరమైన గమనిక (Mandatory Legal Disclaimer)
          </p>
          <p className="font-bold">
            &quot;This tool is for educational and informational purposes only. It is not a substitute for official legal advice.&quot;
          </p>
          <p className="font-medium text-amber-900">
            ఈ-వేదిక PR Act 2018 అసిస్టెంట్ కేవలం విద్యాపరమైన అవగాహన కోసం మాత్రమే. అధికారిక నిర్ణయాల కోసం ప్రభుత్వ గెజిట్ (Act No. 5 of 2018) ను సంప్రదించండి.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <MessageSquare size={18} className="text-blue-600" />
            PR Act 2018 ఇంటరాక్టివ్ ప్రశ్న-సమాధాన సహాయకుడు (Section-Grounded Q&A Assistant)
          </h3>
          <p className="text-xs text-slate-500">
            సర్పంచ్ అధికారాలు, కార్యదర్శి విధులు, గ్రామ సభ, స్థాయి సంఘాలు, పన్నులు లేదా సమావేశాలపై ప్రశ్నను ఎంచుకోండి లేదా వెతకండి.
          </p>
        </div>
      </div>

      {/* Topic Quick Buttons */}
      <div className="flex flex-wrap gap-2">
        {PR_ACT_INTERACTIVE_QA.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedQa(item)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all ${
              selectedQa.id === item.id
                ? "bg-[#0d3b66] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item.topic}
          </button>
        ))}
      </div>

      {/* Clear Distinction: Official Section Reference vs Practical Explanation */}
      {selectedQa && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-indigo-700 text-white text-[11px] font-black uppercase">
              📜 చట్టంలోని అసలు సెక్షన్ నిబంధన ({selectedQa.sectionRef})
            </span>
            <h4 className="text-sm font-black text-slate-900 pt-1">
              {selectedQa.questionTe}
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {selectedQa.officialRuleSummaryTe}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-700 text-white text-[11px] font-black uppercase">
              💡 సులభమైన వివరణ & ఆచరణాత్మక పంచాయతీ ఉదాహరణ (Practical Explanation)
            </span>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium pt-2">
              {selectedQa.practicalExplanationTe}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
