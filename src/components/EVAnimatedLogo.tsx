import React from "react";
import { motion } from "framer-motion";

export function EVAnimatedLogo({ size = 64 }: { size?: number }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-[#0d3b66] to-[#0a1f33] shadow-lg border border-white/5"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-white/5 rounded-2xl animate-pulse" />
      <span className="text-2xl font-black text-[#fbe947] relative z-10 select-none">
        EV
      </span>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-2xl border-2 border-white/5 border-t-white/20"
      />
    </motion.div>
  );
}
