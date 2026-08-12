import React from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEFAULT_PAGE_DESCRIPTIONS } from '../data/pageDescriptions';

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
        className="bg-blue-50/80 backdrop-blur border border-blue-100/50 rounded-2xl p-4 mb-6 flex items-start gap-3 shadow-sm"
      >
        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl shrink-0 mt-0.5">
          <Info size={18} />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-blue-950 text-[14px] tracking-tight">{banner.title}</h3>
          <p className="text-blue-800 text-[13px] mt-1 font-medium leading-relaxed">{banner.description}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
