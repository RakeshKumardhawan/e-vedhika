import React from 'react';
import { Info, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_PAGE_DESCRIPTIONS } from '../data/pageDescriptions';

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
  const banner = customDescriptions?.[currentTab] || DEFAULT_PAGE_DESCRIPTIONS[currentTab];
  
  if (!banner) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentTab}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50/80 backdrop-blur border border-blue-100 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0 mt-0.5">
            <Info size={18} />
          </div>
          <div>
            <h3 className="font-black text-blue-950 text-[14px] tracking-tight">{banner.title}</h3>
            <p className="text-blue-800 text-[13px] mt-1 font-medium leading-relaxed">{banner.description}</p>
          </div>
        </div>

        <button
          onClick={() => triggerYouTubeTutorial(currentTab, banner.title)}
          className="shrink-0 flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl shadow-md transition-all border border-red-500/30 cursor-pointer"
          title={`${banner.title} యూట్యూబ్ ట్యుటోరియల్ చూడండి`}
        >
          <Youtube size={16} className="text-white" />
          <span>వాచ్ ట్యుటోరియల్</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
