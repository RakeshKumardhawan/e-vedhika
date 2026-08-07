import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Maximize2, Sparkles, Volume2, Loader2, FileText, ArrowRight, RefreshCw, Plus, CheckCircle2, Video
} from 'lucide-react';

interface PostItem {
  id: string;
  title: string;
  author?: string;
  date?: string;
  content: string;
  category?: string;
  badge?: string;
}

interface AIVideoHomeSectionProps {
  posts?: PostItem[];
  onSelectPostForVideo?: (post: PostItem) => void;
}

export function AIVideoHomeSection({ posts: externalPosts }: AIVideoHomeSectionProps) {
  // Default sample posts if none passed
  const defaultPosts: PostItem[] = [
    {
      id: '1',
      title: 'గ్రామ పంచాయతీ UBD ఆన్‌లైన్ వెరిఫికేషన్ మార్గదర్శకాలు 2026',
      author: 'E-Vedhika Admin',
      date: '06 Aug 2026',
      content: 'పంచాయతీ కార్యదర్శులు ఆఫ్‌లైన్ రిజిస్టర్లను ఆన్‌లైన్ UBD పోర్టల్‌తో సరిపోల్చేందుకు నవీకరణ జారీ చేయబడింది. జనన మరణాల నమోదులను ఆన్‌లైన్‌లో తనిఖీ చేయండి.',
      category: 'GO & Circulars',
      badge: 'ముఖ్యమైనది'
    },
    {
      id: '2',
      title: 'రైతు రిజిస్ట్రీ - పట్టాదార్ పాస్‌బుక్ నంబర్ మ్యాపింగ్',
      author: 'Technical Team',
      date: '05 Aug 2026',
      content: 'పాస్‌బుక్ నంబర్ సరిచూతలో ఆధార్ మాస్కింగ్ అమలులో ఉంది. పట్టాదారు పాస్‌బుక్ సంఖ్యతో రైతు పేరు, మొబైల్ సంఖ్యను సరిపోల్చండి.',
      category: 'Farmer Registry',
      badge: 'కొత్తది'
    },
    {
      id: '3',
      title: 'C# Diagnostics Tool v2.4 హెల్త్ చెక్ అప్‌డేట్',
      author: 'IT Cell',
      date: '04 Aug 2026',
      content: 'DSC Token డ్రైవర్లు మరియు DigiSigner 8080 పోర్ట్ హెల్త్ చెక్ ఆటోమేషన్ అప్‌డేట్ చేయబడింది. పీసీ హెల్త్ స్కోర్ తనిఖీ చేసుకోండి.',
      category: 'Diagnostics',
      badge: 'సాంకేతిక'
    }
  ];

  const activePosts = externalPosts && externalPosts.length > 0 ? externalPosts : defaultPosts;

  const [selectedPostId, setSelectedPostId] = useState<string>(activePosts[0]?.id || '1');
  const [mobileTab, setMobileTab] = useState<'posts' | 'video'>('posts');

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
  const [hasVideoError, setHasVideoError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Active Post object
  const activePost = activePosts.find(p => p.id === selectedPostId) || activePosts[0];

  useEffect(() => {
    if (activePosts.length > 0 && !activePosts.find(p => p.id === selectedPostId)) {
      setSelectedPostId(activePosts[0].id);
    }
  }, [externalPosts]);

  // Handle post selection and AI video generation trigger
  const handleSelectPost = (post: PostItem) => {
    setSelectedPostId(post.id);
    setHasVideoError(false);
    // Automatically trigger fresh AI video generation simulation
    generateAIVideo(post.content);
  };

  // AI Video generation API
  const generateAIVideo = async (scriptText: string) => {
    setIsGenerating(true);
    setHasVideoError(false);
    setGenerationProgress(20);

    try {
      const response = await fetch('/api/ai-video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: scriptText,
          avatarId: 'te_avatar_1',
          voiceLanguage: 'te-IN'
        })
      });

      const data = await response.json();

      let progress = 35;
      const interval = setInterval(() => {
        progress += 25;
        setGenerationProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          if (data?.videoUrl) {
            setVideoUrl(data.videoUrl);
          } else {
            setVideoUrl('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
          }
        }
      }, 300);
    } catch (err) {
      console.error("Video error:", err);
      setIsGenerating(false);
      setVideoUrl('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');
    }
  };

  const handleVideoError = () => {
    console.warn("Video failed to load or unsupported, using presenter audio mode");
    setHasVideoError(true);
  };

  // Play Full HD 1080p Video in Fullscreen
  const handlePlayFullscreen = async () => {
    if (!videoRef.current) return;
    try {
      videoRef.current.play();
      setIsPlaying(true);
      speakTeluguVoiceover(activePost?.content || '');

      if (videoRef.current.requestFullscreen) {
        await videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        await (videoRef.current as any).webkitRequestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen play error:", err);
    }
  };

  // Speech Synthesizer for Telugu Voiceover
  const speakTeluguVoiceover = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'te-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="w-full max-w-7xl mx-auto my-6 px-3 sm:px-6">
      
      {/* Clean Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-4 sm:p-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold rounded-full mb-1">
              <Sparkles size={13} className="text-indigo-600" />
              <span>ఈ-వేదిక ఏఐ మీడియా హబ్</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              పోస్ట్‌లు & ఆటోమేటెడ్ ఏఐ వీడియోస్
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              ఎడమవైపు పోస్ట్ కంటెంట్ ఆధారంగా కుడివైపు ఆటోమేటిక్‌గా తెలుగు ఏఐ వీడియో తయారవుతుంది.
            </p>
          </div>

          {/* Mobile View Toggle Buttons */}
          <div className="flex sm:hidden bg-slate-100 p-1 rounded-xl w-full">
            <button
              onClick={() => setMobileTab('posts')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mobileTab === 'posts' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              📝 పోస్ట్‌లు ({activePosts.length})
            </button>
            <button
              onClick={() => setMobileTab('video')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                mobileTab === 'video' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              <Video size={13} />
              <span>🎬 ఏఐ వీడియో</span>
            </button>
          </div>
        </div>

        {/* 50:50 Desktop Grid / Tabbed Mobile View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ================= LEFT COLUMN: POSTS LIST (6 Inches / 50%) ================= */}
          <div className={`lg:col-span-6 space-y-3 ${mobileTab === 'video' ? 'hidden sm:block' : 'block'}`}>
            <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-800">
                <FileText size={16} className="text-indigo-600" />
                <span>ఇటీవలి సమాచారం & పోస్ట్‌లు</span>
              </span>
              <span>{activePosts.length} నిర్దేశాలు</span>
            </div>

            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {activePosts.map((post) => {
                const isSelected = post.id === selectedPostId;
                return (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-sm ring-1 ring-indigo-400/30'
                        : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
                      {post.category && (
                        <span className="px-2 py-0.5 bg-white text-indigo-700 border border-slate-200 rounded-md">
                          {post.category}
                        </span>
                      )}
                      {post.date && <span>{post.date}</span>}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-medium">
                      {post.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-[10px] text-slate-400 font-bold">
                        {post.author ? `కార్యదర్శి: ${post.author}` : 'E-Vedhika Update'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPost(post);
                          setMobileTab('video');
                        }}
                        className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        <Sparkles size={12} className="text-amber-300" />
                        <span>వీడియోగా చూడు</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= RIGHT COLUMN: AI VIDEO PLAYER (6 Inches / 50%) ================= */}
          <div className={`lg:col-span-6 space-y-4 ${mobileTab === 'posts' ? 'hidden sm:block' : 'block'}`}>
            <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl border border-slate-800 relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                  <Sparkles size={16} className="text-amber-400 animate-pulse" />
                  <span>ఏఐ యానిమేటెడ్ వీడియో</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Full HD 1080p
                </span>
              </div>

              {/* Selected Post Title Box */}
              <div className="mb-3 bg-white/10 p-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-between gap-2">
                <span className="truncate text-indigo-200 font-bold">
                  {activePost?.title || 'Selected Post'}
                </span>
                <button
                  onClick={() => generateAIVideo(activePost?.content || '')}
                  disabled={isGenerating}
                  className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold rounded-md flex items-center gap-1 shrink-0"
                >
                  <RefreshCw size={10} className={isGenerating ? 'animate-spin' : ''} />
                  <span>రీఫ్రెష్</span>
                </button>
              </div>

              {/* Video Display Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
                {!hasVideoError ? (
                  <video
                    ref={videoRef}
                    poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80"
                    className="w-full h-full object-cover"
                    controls
                    onError={handleVideoError}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={videoUrl} type="video/mp4" onError={handleVideoError} />
                    <p className="text-white text-xs p-4">వీడియో ప్లేయర్ లభ్యం కాలేదు.</p>
                  </video>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_70%)]" />
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mb-3 shadow-inner">
                      <Sparkles size={32} className="text-indigo-400 animate-pulse" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">తెలుగు ఏఐ అవతార్ నరేటర్ ప్రెజెంటేషన్</h4>
                    <p className="text-xs text-slate-300 max-w-sm mb-4 line-clamp-2">
                      {activePost?.title}
                    </p>
                    <button
                      onClick={() => speakTeluguVoiceover(activePost?.content || '')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                    >
                      <Volume2 size={16} className={isSpeaking ? 'text-emerald-300 animate-bounce' : ''} />
                      <span>{isSpeaking ? 'వాయిస్ ఓవర్ ప్లే అవుతోంది...' : 'తెలుగు వాయిస్ ఓవర్ ప్లే చేయండి'}</span>
                    </button>
                  </div>
                )}

                {!isPlaying && !isGenerating && !hasVideoError && (
                  <div
                    onClick={handlePlayFullscreen}
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-950/20"
                  >
                    <div className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95">
                      <Play size={28} className="ml-1 fill-white" />
                    </div>
                    <p className="mt-3 text-[11px] font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                      <Maximize2 size={12} className="text-indigo-400" />
                      ప్లే చేయండి (Full Screen 1080p + తెలుగు వాయిస్)
                    </p>
                  </div>
                )}

                {/* Progress Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                    <Loader2 size={32} className="animate-spin text-indigo-400 mb-2" />
                    <p className="text-xs font-bold text-slate-200">
                      ఏఐ వీడియో తయారవుతోంది...
                    </p>
                    <div className="w-48 bg-slate-800 h-2 rounded-full mt-3 overflow-hidden border border-indigo-500/30">
                      <div
                        className="bg-indigo-500 h-full transition-all duration-300"
                        style={{ width: `${generationProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-indigo-300 font-mono mt-1">{generationProgress}%</span>
                  </div>
                )}
              </div>

              {/* Telugu Audio Script Box */}
              <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-indigo-300">
                    <Volume2 size={14} className={isSpeaking ? 'text-emerald-400 animate-pulse' : ''} />
                    <span>తెలుగు వాయిస్ ఓవర్ నరేషన్</span>
                  </span>
                  <button
                    onClick={() => speakTeluguVoiceover(activePost?.content || '')}
                    className="text-[10px] text-indigo-300 hover:text-white underline font-semibold"
                  >
                    వాయిస్ విను (Test Audio)
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  "{activePost?.content || ''}"
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
