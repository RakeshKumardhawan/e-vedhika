sed -i 's/<motion.div /<motion.div\n      initial={{ opacity: 0, y: 20 }}/' src/App.tsx
sed -i 's/animate={commentPulse ? { scale: \[1, 1.02, 1\] } : { scale: 1 }}/animate={commentPulse ? { scale: [1, 1.02, 1], opacity: 1, y: 0 } : { scale: 1, opacity: 1, y: 0 }}/' src/App.tsx
