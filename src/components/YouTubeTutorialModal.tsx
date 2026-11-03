import React from 'react';
import { X, ExternalLink, PlayCircle, BookOpen, CheckCircle2, Sparkles, Youtube } from 'lucide-react';
import { ToolTutorial, parseYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../utils/youtube';

interface YouTubeTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorial: ToolTutorial | null;
}

export const YouTubeTutorialModal: React.FC<YouTubeTutorialModalProps> = ({
  isOpen,
  onClose,
  tutorial
}) => {
  if (!isOpen || !tutorial) return null;

  const embedUrl = parseYouTubeEmbedUrl(tutorial.youtubeUrl || tutorial.embedUrl);
  const thumbnailUrl = getYouTubeThumbnailUrl(tutorial.youtubeUrl || tutorial.embedUrl);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-3 pr-4">
            <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
              <Youtube className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800/60 font-medium">
                  {tutorial.category || 'వీడియో ట్యుటోరియల్'}
                </span>
                <span className="text-xs text-slate-400">E-VEDHIKA Guide</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-snug">
                {tutorial.toolName}
              </h3>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50"
            title="మూసివేయి (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-lg group">
            {embedUrl ? (
              <iframe
                src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
                title={tutorial.toolName}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-6 text-center">
                <img src={thumbnailUrl} alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <PlayCircle className="w-16 h-16 text-red-500 relative z-10 mb-2" />
                <p className="relative z-10 text-white font-medium">వీడియో లింక్ సిద్ధంగా లేదు</p>
                <p className="relative z-10 text-xs text-slate-400 mt-1">అడ్మిన్ ప్యానెల్ లో యూట్యూబ్ లింక్ ని అప్‌డేట్ చేయవచ్చు</p>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ట్యుటోరియల్ చూడటం ద్వారా టూల్ వినియోగం సులభమవుతుంది.</span>
            </div>
            
            <a
              href={tutorial.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-lg transition-all shadow-md shadow-red-900/30"
            >
              <ExternalLink className="w-4 h-4" />
              <span>యూట్యూబ్‌లో ఓపెన్ చేయి</span>
            </a>
          </div>

          {/* Tutorial Details & Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  వివరణ (Description)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {tutorial.description || 'ఈ టూల్ ఎలా ఉపయోగించాలో స్పష్టంగా తెలుసుకోవడానికి ఈ యూట్యూబ్ వీడియో సహాయపడుతుంది.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  ముఖ్యమైన దశలు (Steps)
                </h4>
                {tutorial.steps && tutorial.steps.length > 0 ? (
                  <ul className="space-y-2.5">
                    {tutorial.steps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-blue-900/40 text-blue-300 border border-blue-700/50 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">వీడియో ఆధారంగా మార్గదర్శకాలు చూడగలరు.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
