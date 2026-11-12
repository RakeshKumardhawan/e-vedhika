import React from 'react';
import { Info, Youtube, CheckCircle2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_PAGE_DESCRIPTIONS, PageDescriptionEntry } from '../data/pageDescriptions';

export function triggerYouTubeTutorial(toolId: string, toolName?: string) {
  window.dispatchEvent(new CustomEvent("open-youtube-tutorial", { detail: { toolId, toolName } }));
}

export function TabInfoBanner({ 
  currentTab, 
  customDescriptions 
}: { 
  currentTab: string; 
  customDescriptions?: Record<string, { title: string; description: string }> 
}) {
  const defaultEntry = DEFAULT_PAGE_DESCRIPTIONS[currentTab];
  const customEntry = customDescriptions?.[currentTab];
  const banner: PageDescriptionEntry | undefined = customEntry
    ? {
        ...defaultEntry,
        title: customEntry.title || defaultEntry?.title || "",
        description: customEntry.description || defaultEntry?.description || "",
      }
    : defaultEntry;
  
  if (!banner) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentTab}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-slate-50 backdrop-blur border border-blue-100 rounded-2xl p-4 sm:p-5 mb-6 space-y-3 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0 mt-0.5">
              <Info size={18} />
            </div>
            <div>
              <h2 className="font-black text-blue-950 text-sm sm:text-base tracking-tight leading-snug">{banner.title}</h2>
              <p className="text-blue-900/90 text-xs sm:text-[13px] mt-1 font-medium leading-relaxed">{banner.description}</p>
            </div>
          </div>

          <button
            onClick={() => triggerYouTubeTutorial(currentTab, banner.title)}
            className="shrink-0 flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-md transition-all border border-red-500/30 cursor-pointer self-start sm:self-center"
            title={`Watch ${banner.title} YouTube Tutorial`}
          >
            <Youtube size={16} className="text-white" />
            <span>Watch Tutorial</span>
          </button>
        </div>

        {(banner.highlights && banner.highlights.length > 0) && (
          <div className="pt-2.5 border-t border-blue-200/50 grid grid-cols-1 md:grid-cols-3 gap-2">
            {banner.highlights.map((hl, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs text-slate-700 font-semibold bg-white/80 px-3 py-2 rounded-xl border border-blue-100/80">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>{hl}</span>
              </div>
            ))}
          </div>
        )}

        {(banner.guideSteps && banner.guideSteps.length > 0) && (
          <div className="bg-white/90 border border-indigo-100 rounded-xl p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-900">
              <BookOpen size={14} className="text-indigo-600" />
              <span>వినియోగ మార్గదర్శిని (How to Use This Tool):</span>
            </div>
            <ul className="space-y-1 text-[11px] sm:text-xs text-slate-700 font-medium list-disc list-inside">
              {banner.guideSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

