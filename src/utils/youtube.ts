export interface ToolTutorial {
  id: string; // tool key e.g. 'dsr_analyzer', 'multi_dsr', 'excel_merger', etc.
  toolName: string; // Telugu / English tool title
  category: string;
  youtubeUrl: string;
  embedUrl: string;
  description?: string;
  steps?: string[];
  updatedAt?: string;
}

/**
 * Transforms various YouTube URL formats (standard, watch, share, shorts, embed)
 * into a clean iframe embed URL with optional parameters.
 */
export function parseYouTubeEmbedUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const trimmed = url.trim();

  // Guard against dummy placeholder video
  if (trimmed.includes('dQw4w9WgXcQ') || trimmed === '') {
    return '';
  }

  // Already embed format
  if (trimmed.includes('youtube.com/embed/')) {
    const cleanUrl = trimmed.split('?')[0];
    const videoId = cleanUrl.split('youtube.com/embed/')[1];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    return trimmed;
  }

  // Shorts format: https://www.youtube.com/shorts/VIDEO_ID
  if (trimmed.includes('youtube.com/shorts/')) {
    const videoId = trimmed.split('youtube.com/shorts/')[1]?.split('?')[0]?.split('/')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  // standard watch format: https://www.youtube.com/watch?v=VIDEO_ID
  if (trimmed.includes('youtube.com/watch')) {
    try {
      const parsedUrl = new URL(trimmed);
      const videoId = parsedUrl.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      // fallback regex search
      const match = trimmed.match(/[?&]v=([^&]+)/);
      if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // Shortened format: https://youtu.be/VIDEO_ID
  if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }

  // Direct video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}

/**
 * Extracts YouTube Video ID for thumbnail generation
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const embed = parseYouTubeEmbedUrl(url);
  if (embed.includes('/embed/')) {
    return embed.split('/embed/')[1]?.split('?')[0] || null;
  }
  return null;
}

/**
 * Returns HD thumbnail URL for a given YouTube URL
 */
export function getYouTubeThumbnailUrl(url: string): string {
  const id = getYouTubeVideoId(url);
  if (id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600';
}

/**
 * Initial Default Tool Tutorials list across all tools on E-Vedhika platform
 */
export const DEFAULT_TOOL_TUTORIALS: ToolTutorial[] = [
  {
    id: 'dsr_analyzer',
    toolName: 'Daily DSR Analyzer (రోజువారీ నివేదిక విశ్లేషణ)',
    category: 'రిపోర్టుల టూల్స్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'రోజువారీ DSR ఫైళ్లను సులభంగా అప్‌లోడ్ చేసి విశ్లేషించే పూర్తి విధానం మరియు ఎర్రర్స్ పరిష్కారం.',
    steps: [
      'DSR ఎక్సెల్ ఫైల్‌ను టూల్‌లో అప్‌లోడ్ చేయండి.',
      'ఆటోమేటిక్ డేటా రీడింగ్ పూర్తయిన తర్వాత సమగ్ర నివేదికను పరిశీలించండి.',
      'పిడిఎఫ్ లేదా ఎక్సెల్ రూపంలో డౌన్‌లోడ్ చేసుకోండి.'
    ]
  },
  {
    id: 'multi_dsr',
    toolName: 'Multi-Day DSR Analyzer (మల్టీ డే DSR అనలైజర్)',
    category: 'రిపోర్టుల టూల్స్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'ఒకేసారి పలు రోజుల DSR డేటాను కంబైన్ చేసి సమగ్ర నివేదిక తయారుచేసే గైడ్.',
    steps: [
      'కంబైన్ చేయవలసిన పలు తేదీల DSR ఫైళ్లను ఎంచుకోండి.',
      'అనలైజ్ బటన్ క్లిక్ చేసి సమగ్ర గ్రాఫ్స్ మరియు సమ్మరీ చూడండి.'
    ]
  },
  {
    id: 'excel_merger',
    toolName: 'Excel File Merge (ఎక్సెల్ ఫైళ్ల విలీనం)',
    category: 'డేటా ప్రాసెసింగ్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'పలు ఎక్సెల్ షీట్‌లను లేదా ఫైళ్లను సింగిల్ మాస్టర్ ఎక్సెల్ ఫైల్‌గా విలీనం చేయడం.',
    steps: [
      'మీ వద్ద ఉన్న అన్ని ఎక్సెల్ ఫైళ్లను ఒకేసారి డ్రాగ్ అండ్ డ్రాప్ చేయండి.',
      'షీట్స్ ఆర్డర్ సరిచూసుకొని "Merge Excel Files" క్లిక్ చేయండి.'
    ]
  },
  {
    id: 'pdf_compressor',
    toolName: 'PDF Compressor & Converter (పిడిఎఫ్ కంప్రెసర్)',
    category: 'డాక్యుమెంట్ టూల్స్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'పెద్ద సైజ్ పిడిఎఫ్ ఫైళ్లను నాణ్యత తగ్గకుండా చిన్న సైజ్‌కి కంప్రెస్ చేయడం.',
    steps: [
      'PDF ఫైల్ ఎంచుకోండి, కంప్రెషన్ లెవల్ ఎంపిక చేయండి.',
      'కంప్రెస్ బటన్ క్లిక్ చేసి కొత్త సైజ్ ఫైల్‌ను డౌన్‌లోడ్ చేసుకోండి.'
    ]
  },
  {
    id: 'farmer_registry',
    toolName: 'Farmer Registry (రైతు రిజిస్ట్రీ సేవలు)',
    category: 'గ్రామీణ మరియు వ్యవసాయ సేవా టూల్స్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'రైతుల వివరాలు సేకరించడం, సరిచూసుకోవడం మరియు నివేదికలు తయారు చేయడం.',
    steps: [
      'రైతు ఆధార్ లేదా సర్వే నంబర్ నమోదు చేయండి.',
      'వివరాలు సరిచూసి సబ్మిట్ చేయండి.'
    ]
  },
  {
    id: 'gpdp',
    toolName: 'GPDP Planning Tool (గ్రామ పంచాయతీ ప్రణాళిక టూల్)',
    category: 'పంచాయతీ నిర్వహణ',
    youtubeUrl: '',
    embedUrl: '',
    description: 'గ్రామ పంచాయతీ అభివృద్ధి ప్రణాళిక (GPDP) వివరాలను ఆన్‌లైన్‌లో తయారు చేయడం.',
    steps: [
      'పంచాయతీ సమాచారం మరియు పనుల వివరాలు ఎంటర్ చేయండి.',
      'డ్రాఫ్ట్ మరియు ఫైనల్ ప్రణాళిక డౌన్‌లోడ్ చేసుకోండి.'
    ]
  },
  {
    id: 'monthly_activity',
    toolName: 'Monthly Activity Formatter (నెలవారీ కార్యాచరణ ఫార్మాటర్)',
    category: 'రిపోర్టుల టూల్స్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'నెలవారీ పనుల నివేదికలను ప్రభుత్వ ప్రమాణాలకు అనుగుణంగా ఫార్మాట్ చేసే ట్యుటోరియల్.',
    steps: [
      'నెలవారీ సమాచారం అప్‌లోడ్ చేయండి.',
      'ఆటో ఫార్మాట్ ఉపయోగించి రెడీమేడ్ ప్రింట్ డాక్యుమెంట్ పొందండి.'
    ]
  },
  {
    id: 'cloud_storage',
    toolName: 'Excel File Manager & Cloud Storage (క్లౌడ్ స్టోరేజ్)',
    category: 'డేటా సెక్యూరిటీ & బ్యాకప్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'ముఖ్యమైన ఫైళ్లను సురక్షితంగా క్లౌడ్‌లో దాచుకోవడం మరియు ఎప్పుడైనా డౌన్‌లోడ్ చేసుకోవడం.',
    steps: [
      'ఫైల్ సెక్షన్ ఓపెన్ చేసి అప్‌లోడ్ చేయండి.',
      'ఫోల్డర్ వైజ్ వర్గీకరించి భద్రపరచండి.'
    ]
  },
  {
    id: 'software_hub',
    toolName: 'Software Hub (సాఫ్ట్‌వేర్ డౌన్‌లోడ్ హబ్)',
    category: 'సాఫ్ట్‌వేర్‌లు & డ్రైవర్లు',
    youtubeUrl: '',
    embedUrl: '',
    description: 'అధికారిక డ్రైవర్లు, డిజిటల్ సిగ్నేచర్ (DSC) సాఫ్ట్‌వేర్లు ఉచితంగా పొందే విధానం.',
    steps: [
      'కావలసిన సాఫ్ట్‌వేర్ ఎంచుకోండి.',
      'డౌన్‌లోడ్ లేదా ఇన్‌స్టాలేషన్ మార్గదర్శకాలను పాటించండి.'
    ]
  },
  {
    id: 'gos_formats',
    toolName: 'Application Formats & GOs (జీవోలు & అప్లికేషన్ ఫార్మాట్లు)',
    category: 'ప్రభుత్వ ఉత్తర్వులు',
    youtubeUrl: '',
    embedUrl: '',
    description: 'తాజా జీవోలు, దరఖాస్తు ఫార్మాట్‌లు మరియు ప్రొఫార్మాలను శోధించడం.',
    steps: [
      'కేటగిరీ లేదా కీవర్డ్ తో వెతకండి.',
      'కావలసిన పత్రం క్లిక్ చేసి ప్రింట్ తీసుకోండి.'
    ]
  },
  {
    id: 'useful_links',
    toolName: 'Useful Web Links (ఉపయోగకరమైన లింక్‌లు)',
    category: 'పోర్టల్స్ & డైరెక్టరీలు',
    youtubeUrl: '',
    embedUrl: '',
    description: 'వివిధ ప్రభుత్వ వెబ్‌సైట్‌లు మరియు విభాగాల అధికారిక లింక్‌ల వినియోగం.',
    steps: [
      'కావలసిన విభాగం పై క్లిక్ చేయండి.',
      'నేరుగా అధికారిక వెబ్‌సైట్‌కి వెళ్ళండి.'
    ]
  },
  {
    id: 'excel_a4_print',
    toolName: 'Excel → A4 Print Formatter (ఎక్సెల్ A4 ప్రింట్ ప్రిపరేషన్)',
    category: 'ప్రింటింగ్ టూల్స్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'ఎక్సెల్ పట్టికలను A4 పేజీలో కట్ కాకుండా సరిగ్గా అమర్చే విధానం.',
    steps: [
      'ఎక్సెల్ షీట్ ఎంచుకోండి.',
      'పేజీ లేఅవుట్ మరియు మార్జిన్స్ ఆటో అడ్జస్ట్ చేయండి.'
    ]
  },
  {
    id: 'knowledge_hub',
    toolName: 'Digital Training & Knowledge Hub (జ్ఞాన వేదిక)',
    category: 'శిక్షణ & నాలెడ్జ్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'వివిధ అధికారిక శిక్షణ మెటీరియల్స్, యూజర్ మాన్యువల్స్ మరియు వీడియోలు వీక్షించండి.',
    steps: [
      'విషయ సూచిక చూడండి.',
      'కావలసిన కోర్సు లేదా మాన్యువల్ ఎంచుకోండి.'
    ]
  },
  {
    id: 'ubd_monitoring',
    toolName: 'UBD Monitoring Center (UBD లైవ్ మానిటరింగ్ సిస్టమ్)',
    category: 'సిస్టమ్ మానిటరింగ్',
    youtubeUrl: '',
    embedUrl: '',
    description: 'వివిధ మండల పీసీల లైవ్ స్టేటస్ మరియు డయాగ్నోస్టిక్స్ రిపోర్ట్ మానిటర్ చేయడం.',
    steps: [
      'లైవ్ మానిటరింగ్ సెక్షన్ ఓపెన్ చేయండి.',
      'పిసి నేమ్, DSC స్టేటస్ మరియు యాక్టివిటీ నివేదికలు పరిశీలించండి.'
    ]
  }
];
