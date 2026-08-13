#!/bin/bash
sed -i 's/<\/button>/<\/motion.button>/g' src/App.tsx
sed -i 's/<button/<motion.button/g' src/App.tsx
sed -i 's/<\/motion.button><\/motion.button>/<\/motion.button>/g' src/App.tsx
