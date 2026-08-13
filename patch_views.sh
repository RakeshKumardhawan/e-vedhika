#!/bin/bash
sed -i 's/return Math.max(rawViews, viewedByCount);/return rawViews + viewedByCount;/g' src/App.tsx
